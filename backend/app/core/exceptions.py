from datetime import datetime, timezone
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


class AgriNexusException(Exception):
    """Base exception class for domain errors in AgriNexus AI."""
    def __init__(self, title: str, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.title = title
        self.detail = detail
        self.status_code = status_code


class EntityNotFoundException(AgriNexusException):
    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(
            title="Resource Not Found",
            detail=f"{entity_name} with identifier '{entity_id}' was not found.",
            status_code=status.HTTP_404_NOT_FOUND,
        )


class AuthenticationFailedException(AgriNexusException):
    def __init__(self, detail: str = "Invalid email or password."):
        super().__init__(
            title="Authentication Failed",
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class PermissionDeniedException(AgriNexusException):
    def __init__(self, detail: str = "You do not have permission to perform this action."):
        super().__init__(
            title="Permission Denied",
            detail=detail,
            status_code=status.HTTP_403_FORBIDDEN,
        )


async def agrinexus_exception_handler(request: Request, exc: AgriNexusException) -> JSONResponse:
    """Handles domain-specific exceptions returning RFC 7807 problem details."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error": {
                "title": exc.title,
                "status": exc.status_code,
                "detail": exc.detail,
                "instance": str(request.url.path),
            },
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handles Pydantic request validation errors."""
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append({
            "field": field,
            "message": err.get("msg"),
            "type": err.get("type"),
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error": {
                "title": "Validation Error",
                "status": 422,
                "detail": "Request payload validation failed.",
                "instance": str(request.url.path),
                "validation_errors": errors,
            },
        },
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all exception handler for uncaught server errors."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error": {
                "title": "Internal Server Error",
                "status": 500,
                "detail": "An unexpected error occurred. Please contact system administrators.",
                "instance": str(request.url.path),
                "debug_info": str(exc),
            },
        },
    )
