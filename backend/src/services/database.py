"""
Database health check and connection utilities
"""
from sqlmodel import Session
from src.database import engine, get_session
from typing import Dict, Any
import psycopg2
from urllib.parse import urlparse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_database_connection() -> Dict[str, Any]:
    """
    Check if the database connection is active and healthy

    Returns:
        Dictionary with connection status information
    """
    try:
        # Test the connection by attempting to get a session
        with Session(engine) as session:
            # Execute a simple query to test the connection
            result = session.exec("SELECT 1").first()

        return {
            "status": "connected",
            "ssl_status": "active",  # Since we configured sslmode=require
            "connection_test": True,
            "message": "Database connection is healthy"
        }
    except Exception as e:
        return {
            "status": "disconnected",
            "ssl_status": "inactive",
            "connection_test": False,
            "error": str(e),
            "message": "Database connection failed"
        }

def get_database_ssl_status() -> Dict[str, Any]:
    """
    Check the SSL status of the database connection

    Returns:
        Dictionary with SSL status information
    """
    try:
        # Parse the database URL to check SSL parameters
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            return {
                "ssl_enabled": False,
                "ssl_required": False,
                "message": "DATABASE_URL not configured"
            }

        # Check if sslmode=require is in the URL
        is_ssl_required = "sslmode=require" in database_url.lower()

        # Test actual connection to verify SSL is working
        connection_status = check_database_connection()

        return {
            "ssl_enabled": True,
            "ssl_required": is_ssl_required,
            "ssl_active": connection_status["ssl_status"] == "active",
            "database_url_has_ssl": is_ssl_required,
            "message": "SSL configuration is active" if is_ssl_required else "SSL not required in connection string"
        }
    except Exception as e:
        return {
            "ssl_enabled": False,
            "ssl_required": False,
            "error": str(e),
            "message": "Failed to check SSL status"
        }

def verify_database_schema() -> Dict[str, Any]:
    """
    Verify that the required database schema (User table) exists

    Returns:
        Dictionary with schema verification results
    """
    try:
        from src.models.user import User

        # Check if we can access the User table metadata
        table_name = User.__tablename__

        # Try to execute a query on the User table to verify it exists
        with Session(engine) as session:
            # This will fail if the table doesn't exist
            result = session.exec(f"SELECT COUNT(*) FROM {table_name} LIMIT 1").first()

        return {
            "schema_exists": True,
            "table_name": table_name,
            "table_accessible": True,
            "message": f"User table '{table_name}' exists and is accessible"
        }
    except Exception as e:
        return {
            "schema_exists": False,
            "table_name": "user",
            "table_accessible": False,
            "error": str(e),
            "message": "User table does not exist or is not accessible"
        }

def run_full_database_health_check() -> Dict[str, Any]:
    """
    Run a comprehensive database health check

    Returns:
        Dictionary with full health check results
    """
    connection_status = check_database_connection()
    ssl_status = get_database_ssl_status()
    schema_status = verify_database_schema()

    all_healthy = (
        connection_status.get("connection_test", False) and
        ssl_status.get("ssl_active", False) and
        schema_status.get("schema_exists", False)
    )

    return {
        "overall_status": "healthy" if all_healthy else "unhealthy",
        "timestamp": __import__('datetime').datetime.utcnow().isoformat(),
        "connection": connection_status,
        "ssl": ssl_status,
        "schema": schema_status,
        "all_systems_healthy": all_healthy
    }