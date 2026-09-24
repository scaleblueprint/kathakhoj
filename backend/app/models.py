from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import String, Text, DateTime, ForeignKey, UniqueConstraint, JSON, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base

def uid(): return str(uuid4())
def now(): return datetime.now(timezone.utc)

class Author(Base):
    __tablename__ = "authors"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    name: Mapped[str] = mapped_column(String(240), nullable=False)
    original_name: Mapped[str | None] = mapped_column(String(240))
    region: Mapped[str | None] = mapped_column(String(120))
    language: Mapped[str | None] = mapped_column(String(120))
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)

class Work(Base):
    __tablename__ = "works"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    author_id: Mapped[str] = mapped_column(ForeignKey("authors.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(350), nullable=False)
    original_title: Mapped[str | None] = mapped_column(String(350))
    language: Mapped[str | None] = mapped_column(String(120))
    genre: Mapped[str | None] = mapped_column(String(100))
    year: Mapped[int | None] = mapped_column(Integer)
    source_url: Mapped[str | None] = mapped_column(Text)
    edition: Mapped[str | None] = mapped_column(String(350))
    rights_status: Mapped[str] = mapped_column(String(32), default="unverified")
    rights_evidence: Mapped[str | None] = mapped_column(Text)
    ingestion_status: Mapped[str] = mapped_column(String(32), default="metadata_only")
    themes: Mapped[list] = mapped_column(JSON, default=list)
    devices: Mapped[list] = mapped_column(JSON, default=list)
    summary: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    author: Mapped[Author] = relationship()

class SourceDocument(Base):
    __tablename__ = "source_documents"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    work_id: Mapped[str] = mapped_column(ForeignKey("works.id"), nullable=False, index=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    storage_key: Mapped[str] = mapped_column(Text, nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    __table_args__ = (UniqueConstraint("work_id","sha256"),)

class Story(Base):
    __tablename__ = "studio_stories"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    title: Mapped[str] = mapped_column(String(350), nullable=False)
    premise: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(40), default="idea")
    influence_work_ids: Mapped[list] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)

class Episode(Base):
    __tablename__ = "studio_episodes"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    story_id: Mapped[str] = mapped_column(ForeignKey("studio_stories.id"), nullable=False, index=True)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(350), nullable=False)
    body: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(40), default="outline")
    __table_args__ = (UniqueConstraint("story_id","number"),)
