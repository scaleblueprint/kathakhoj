# KathaKhoj private Studio backend (foundation)

This API is intentionally separate from the public static frontend. **Do not expose a Studio link or deploy until the backend, database, persistent private storage, and origin are configured.** All catalogue and document endpoints require an authenticated session. Public health endpoint contains no private data.

## Local setup

Use Python 3.11+ and PostgreSQL. In backend/: `pip install -r requirements.txt`. Set all variables in .env.example in your environment; do not commit values. Generate an Argon2 password hash with `python -c "from pwdlib import PasswordHash; import getpass; print(PasswordHash.recommended().hash(getpass.getpass()))"`. Generate the session secret with `python -c "import secrets; print(secrets.token_urlsafe(48))"`. Set STUDIO_STORAGE_DIR to a **private persistent disk**, not ephemeral Render filesystem. Run `alembic upgrade head`, then `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

For production, serve the API through the **same HTTPS origin** as the public site using a reverse proxy for /api/*, and serve the SPA for other routes. The cookie is Secure and SameSite=Strict; cross-site API hosting will not work as-is. The existing Render static site cannot proxy to a private API on its own; migrate the public deployment to a suitable same-origin web service or configure a trusted reverse proxy before enabling Studio. Configure STUDIO_ORIGIN to that exact origin. Do not put credentials, source texts, or database URL in Vite env vars. Add durable backup and access logs before importing valuable content.

## Rights and ingestion

Work metadata defaults to unverified. Upload is refused unless rights_status is verified/permission/licensed **and** rights_evidence is recorded. Upload accepts <=10MB TXT/MD/PDF; it stores private bytes with SHA-256 and status stored_unprocessed. No automatic extraction, vectorization, scraping, AI generation, or publication is implemented yet. PDF and Markdown parsing are later stages; no extracted text is exposed publicly. Metadata can describe protected works without copying full texts.

## Security limitations before production

Single owner credential from environment; eight-hour signed session, origin and CSRF checks for writes, per-process login throttling. Add shared rate limiting, audit logs, robust backups, monitoring, password rotation, and a production security review before wider access. Use a private service or firewall where possible.
