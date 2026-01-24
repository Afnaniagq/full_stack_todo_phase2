"""
Environment validation utility for backend
"""
import os
from typing import Dict, List, Tuple

def validate_environment_variables(required_vars: List[str]) -> Tuple[bool, Dict[str, bool]]:
    """
    Validates that required environment variables are set

    Args:
        required_vars: List of required environment variable names

    Returns:
        Tuple of (all_valid, dict of var->validity)
    """
    validation_results = {}

    for var in required_vars:
        value = os.getenv(var)
        is_set = value is not None and value.strip() != "" and value != "your-secret-key-here"
        validation_results[var] = is_set

    all_valid = all(validation_results.values())
    return all_valid, validation_results

def get_auth_secret():
    """Get the BETTER_AUTH_SECRET from environment"""
    return os.getenv("BETTER_AUTH_SECRET")

def check_shared_secret_config():
    """Check if shared authentication secret is properly configured"""
    auth_secret = get_auth_secret()
    is_configured = auth_secret is not None and auth_secret.strip() != "" and auth_secret != "your-secret-key-here"

    return {
        "BETTER_AUTH_SECRET_configured": is_configured,
        "secret_length": len(auth_secret) if auth_secret else 0,
        "uses_default_value": auth_secret == "your-secret-key-here" if auth_secret else True
    }