"""
Logging configuration for authentication events
"""
import logging
import sys
from datetime import datetime
from typing import Dict, Any

# Configure basic logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('auth_events.log')
    ]
)

# Create logger for authentication events
auth_logger = logging.getLogger('auth')
auth_logger.setLevel(logging.INFO)

def log_auth_event(event_type: str, user_id: str = None, details: Dict[str, Any] = None, success: bool = True):
    """
    Log an authentication event

    Args:
        event_type: Type of authentication event (login, logout, token_validation, etc.)
        user_id: User ID associated with the event (if available)
        details: Additional details about the event
        success: Whether the event was successful
    """
    event_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "user_id": user_id,
        "success": success,
        "details": details or {}
    }

    message = f"AUTH_EVENT: {event_type} - User: {user_id or 'unknown'} - Success: {success}"

    if success:
        auth_logger.info(f"{message} - Details: {details}")
    else:
        auth_logger.warning(f"{message} - Details: {details}")

def log_token_validation(token: str, user_id: str = None, success: bool = True, reason: str = None):
    """
    Log a token validation event

    Args:
        token: The token being validated (only log metadata, not the full token for security)
        user_id: User ID extracted from the token
        success: Whether validation was successful
        reason: Reason for failure if validation failed
    """
    token_info = {
        "token_length": len(token) if token else 0,
        "has_user_id": bool(user_id),
        "user_id": user_id,
        "reason": reason
    }

    log_auth_event(
        event_type="token_validation",
        user_id=user_id,
        details=token_info,
        success=success
    )

def log_login_attempt(user_id: str, success: bool = True, source: str = None):
    """
    Log a login attempt

    Args:
        user_id: User ID attempting to log in
        success: Whether the login was successful
        source: Source of the login attempt (IP, device, etc.)
    """
    details = {"source": source} if source else {}
    log_auth_event(
        event_type="login_attempt",
        user_id=user_id,
        details=details,
        success=success
    )

def log_security_event(event_type: str, user_id: str = None, severity: str = "medium", details: Dict[str, Any] = None):
    """
    Log a security-related event

    Args:
        event_type: Type of security event
        user_id: User ID associated with the event
        severity: Severity level (low, medium, high, critical)
        details: Additional details about the event
    """
    security_logger = logging.getLogger(f'security.{severity}')
    event_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "user_id": user_id,
        "severity": severity,
        "details": details or {}
    }

    message = f"SECURITY_EVENT: {severity.upper()} - {event_type} - User: {user_id or 'unknown'}"
    security_logger.warning(f"{message} - Details: {event_data}")