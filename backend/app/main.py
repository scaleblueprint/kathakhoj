import hashlib
import os
import secrets
import time
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, Request, Response, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pwdlib import PasswordHash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from sqlalchemy import select
from sqlalchemy.orm import Session
from .db import session
from .models import Author, Work, SourceDocument, Story, Episode

app = FastAPI(title="KathaKhoj Private Studio API", docs_url=None, redoc_url=None, openapi_url=None)
secret = os.environ.get("STUDIO_SESSION_SECRET", "")
admin_hash = os.environ.get("STUDIO_PASSWORD_HASH", "")
if len(secret) < 32 or not admin_hash:
    raise RuntimeError("Configure STUDIO_SESSION_SECRET (32+ characters) and STUDIO_PASSWORD_HASH")
signer = URLSafeTimedSerializer(secret, salt="kathakhoj-studio-v1")
hasher = PasswordHash.recommended()
allowed_origin = os.environ.get("STUDIO_ORIGIN", "").rstrip("/")
if not allowed_origin.startswith("https://") and not allowed_origin.startswith("http://localhost:"):
    raise RuntimeError("STUDIO_ORIGIN must be the HTTPS frontend origin (or localhost for development)")
app.add_middleware(CORSMiddleware, allow_origins=[allowed_origin], allow_credentials=True, allow_methods=["GET","POST"], allow_headers=["Content-Type","X-CSRF-Token"])
failures = {}
COOKIE = "kathakhoj_studio"

def require_user(request: Request):
    token = request.cookies.get(COOKIE)
    if not token:
        raise HTTPException(401, "Sign in required")
    try:
        user = signer.loads(token, max_age=8*3600)
    except (BadSignature, SignatureExpired):
        raise HTTPException(401, "Session expired")
    if user != "owner":
        raise HTTPException(401, "Invalid session")
    return user

def require_write(request: Request, user=Depends(require_user)):
    if request.headers.get("origin", "").rstrip("/") != allowed_origin:
        raise HTTPException(403, "Invalid origin")
    csrf = request.headers.get("X-CSRF-Token", "")
    if not csrf or csrf != request.cookies.get("kathakhoj_csrf"):
        raise HTTPException(403, "Invalid CSRF token")
    return user

class Login(BaseModel):
    password: str = Field(min_length=1, max_length=1024)

@app.get("/api/studio/session")
def status(request: Request):
    require_user(request)
    return {"authenticated":True, "csrf":request.cookies.get("kathakhoj_csrf")}

@app.post("/api/studio/login")
def login(body: Login, request: Request, response: Response):
    if request.headers.get("origin", "").rstrip("/") != allowed_origin:
        raise HTTPException(403, "Invalid origin")
    ip = request.client.host if request.client else "unknown"
    attempts = [t for t in failures.get(ip, []) if time.time()-t < 900]
    if len(attempts) >= 5:
        raise HTTPException(429, "Too many attempts; retry later")
    if not hasher.verify(body.password, admin_hash):
        failures[ip] = attempts + [time.time()]
        raise HTTPException(401, "Invalid credentials")
    failures.pop(ip, None)
    csrf = secrets.token_urlsafe(32)
    response.set_cookie(COOKIE, signer.dumps("owner"), httponly=True, secure=True, samesite="strict", max_age=8*3600, path="/api/studio")
    response.set_cookie("kathakhoj_csrf", csrf, httponly=False, secure=True, samesite="strict", max_age=8*3600, path="/")
    return {"authenticated":True, "csrf":csrf}

@app.post("/api/studio/logout")
def logout(response: Response, user=Depends(require_write)):
    response.delete_cookie(COOKIE, path="/api/studio")
    response.delete_cookie("kathakhoj_csrf", path="/")
    return {"authenticated":False}

class AuthorIn(BaseModel):
    name: str = Field(min_length=1,max_length=240)
    original_name: str | None = None
    region: str | None = None
    language: str | None = None
    notes: str | None = None

class WorkIn(BaseModel):
    author_id: str
    title: str = Field(min_length=1,max_length=350)
    language: str | None = None
    genre: str | None = None
    source_url: str | None = None
    edition: str | None = None
    rights_status: str = "unverified"
    rights_evidence: str | None = None
    themes: list[str] = Field(default_factory=list)
    devices: list[str] = Field(default_factory=list)
    summary: str | None = None

@app.get("/api/studio/authors")
def authors(db: Session=Depends(session), user=Depends(require_user)):
    return [{"id":a.id,"name":a.name,"region":a.region,"language":a.language} for a in db.scalars(select(Author).order_by(Author.name)).all()]

@app.post("/api/studio/authors",status_code=201)
def add_author(body: AuthorIn, db: Session=Depends(session), user=Depends(require_write)):
    a=Author(**body.model_dump());db.add(a);db.commit();db.refresh(a)
    return {"id":a.id,"name":a.name}

@app.get("/api/studio/works")
def works(db: Session=Depends(session), user=Depends(require_user)):
    return [{"id":w.id,"title":w.title,"author_id":w.author_id,"language":w.language,"rights_status":w.rights_status,"ingestion_status":w.ingestion_status,"themes":w.themes,"devices":w.devices} for w in db.scalars(select(Work).order_by(Work.title)).all()]

@app.post("/api/studio/works",status_code=201)
def add_work(body: WorkIn, db: Session=Depends(session), user=Depends(require_write)):
    if body.rights_status not in {"unverified","public_domain_verified","licensed","permission_granted","restricted"}:
        raise HTTPException(422,"Invalid rights status")
    if not db.get(Author,body.author_id): raise HTTPException(404,"Author not found")
    w=Work(**body.model_dump());db.add(w);db.commit();db.refresh(w)
    return {"id":w.id,"title":w.title}

@app.post("/api/studio/works/{work_id}/documents",status_code=201)
async def upload(work_id: str, file: UploadFile=File(...), db: Session=Depends(session), user=Depends(require_write)):
    w=db.get(Work,work_id)
    if not w: raise HTTPException(404,"Work not found")
    if w.rights_status not in {"public_domain_verified","licensed","permission_granted"} or not w.rights_evidence:
        raise HTTPException(403,"Verify and document rights before storing full text")
    if file.content_type not in {"text/plain","text/markdown","application/pdf"}:
        raise HTTPException(415,"Only plain text, Markdown and PDF are accepted")
    data=await file.read(10*1024*1024+1)
    if len(data)>10*1024*1024: raise HTTPException(413,"Maximum 10 MB")
    digest=hashlib.sha256(data).hexdigest()
    root=Path(os.environ["STUDIO_STORAGE_DIR"]).resolve()
    root.mkdir(parents=True,exist_ok=True)
    path=root / (digest+".source")
    if not path.exists():
        path.write_bytes(data)
        os.chmod(path,0o600)
    d=SourceDocument(work_id=work_id,filename=Path(file.filename or "source").name[:255],sha256=digest,storage_key=str(path),content_type=file.content_type,bytes=len(data))
    db.add(d);w.ingestion_status="stored_unprocessed";db.commit();db.refresh(d)
    return {"id":d.id,"sha256":digest,"status":"stored_unprocessed"}

@app.get("/api/studio/stories")
def stories(db: Session=Depends(session), user=Depends(require_user)):
    return [{"id":s.id,"title":s.title,"premise":s.premise,"status":s.status} for s in db.scalars(select(Story).order_by(Story.created_at.desc())).all()]

@app.get("/api/health")
def health(): return {"status":"ok"}
