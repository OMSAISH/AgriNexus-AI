import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)

# Create SQLAlchemy engine with pool configuration suitable for PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency that provides an active database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_database_connection() -> dict:
    """Executes a diagnostic ping query to verify PostgreSQL readiness."""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();")).scalar()
            current_db = connection.execute(text("SELECT current_database();")).scalar()
            return {
                "connected": True,
                "database_name": current_db,
                "version": result,
                "error": None,
            }
    except Exception as exc:
        logger.error(f"Database connection failure: {exc}")
        return {
            "connected": False,
            "database_name": settings.POSTGRES_DB,
            "version": None,
            "error": str(exc),
        }
