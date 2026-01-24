"""
Health check API endpoints
"""
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
import os
from src.services.environment import check_shared_secret_config
from src.services.database import run_full_database_health_check

# Create a FastAPI router for health endpoints
router = APIRouter()

@router.get("/health")
def health_check() -> Dict[str, Any]:
    """
    Basic health check endpoint
    Returns 200 OK if the service is running
    """
    return {
        "status": "healthy",
        "timestamp": __import__('datetime').datetime.utcnow().isoformat(),
        "service": "Todo API"
    }

@router.get("/health/auth")
def auth_health_check() -> Dict[str, Any]:
    """
    Authentication health check
    Verifies that auth configuration is properly set up
    """
    auth_config = check_shared_secret_config()

    return {
        "status": "healthy" if auth_config["BETTER_AUTH_SECRET_configured"] else "unconfigured",
        "timestamp": __import__('datetime').datetime.utcnow().isoformat(),
        "auth": auth_config
    }

@router.get("/health/full")
def full_health_check() -> Dict[str, Any]:
    """
    Full health check including database connectivity and SSL status
    Returns 200 OK only when both DB connectivity and SSL are active
    """
    db_health = run_full_database_health_check()

    # Determine overall status based on database health
    overall_status = "healthy" if db_health["all_systems_healthy"] else "unhealthy"

    # Return appropriate status code
    http_status = status.HTTP_200_OK if overall_status == "healthy" else status.HTTP_503_SERVICE_UNAVAILABLE

    return {
        "status": overall_status,
        "timestamp": __import__('datetime').datetime.utcnow().isoformat(),
        "database": db_health["connection"]["status"],
        "ssl": db_health["ssl"]["ssl_active"],
        "checks": {
            "database_connection": db_health["connection"]["connection_test"],
            "ssl_active": db_health["ssl"]["ssl_active"],
            "schema_accessible": db_health["schema"]["schema_exists"]
        },
        "details": db_health
    }

@router.get("/health/database")
def database_health_check() -> Dict[str, Any]:
    """
    Database-specific health check
    Verifies database connectivity and SSL enforcement
    Returns 200 OK only when both DB connectivity and SSL are active
    """
    db_health = run_full_database_health_check()

    # Check if both DB connectivity and SSL are active
    db_connected = db_health["connection"]["connection_test"]
    ssl_active = db_health["ssl"]["ssl_active"]

    # Return 200 only if both conditions are met
    if db_connected and ssl_active:
        return {
            "status": "healthy",
            "timestamp": __import__('datetime').datetime.utcnow().isoformat(),
            "database_connected": db_connected,
            "ssl_active": ssl_active,
            "details": {
                "connection": db_health["connection"],
                "ssl": db_health["ssl"],
                "schema": db_health["schema"]
            }
        }
    else:
        # Return 503 if either condition fails
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "unhealthy",
                "timestamp": __import__('datetime').datetime.utcnow().isoformat(),
                "database_connected": db_connected,
                "ssl_active": ssl_active,
                "details": {
                    "connection": db_health["connection"],
                    "ssl": db_health["ssl"],
                    "schema": db_health["schema"]
                }
            }
        )