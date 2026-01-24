"""
Test utility to verify JWT cross-service compatibility
"""
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the shared secret from environment
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

def create_test_token(user_id: str = "test-user-uuid", expiry_minutes: int = 60) -> str:
    """
    Create a test JWT token with required claims ('sub' and 'exp')

    Args:
        user_id: User ID to include in the 'sub' claim
        expiry_minutes: Number of minutes until token expires

    Returns:
        JWT token string
    """
    if not SECRET_KEY:
        raise ValueError("BETTER_AUTH_SECRET not configured in environment")

    # Create payload with required claims
    payload = {
        "sub": user_id,  # Subject (user ID)
        "exp": datetime.utcnow() + timedelta(minutes=expiry_minutes),  # Expiration
        "iat": datetime.utcnow(),  # Issued at
        "jti": f"test-{datetime.utcnow().timestamp()}"  # JWT ID
    }

    # Create and return the token
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_test_token(token: str) -> dict:
    """
    Verify a test JWT token and return its payload

    Args:
        token: JWT token string to verify

    Returns:
        Decoded token payload
    """
    if not SECRET_KEY:
        raise ValueError("BETTER_AUTH_SECRET not configured in environment")

    # Decode and return the payload
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload

def test_cross_service_compatibility() -> dict:
    """
    Test that tokens generated can be verified (simulating cross-service verification)

    Returns:
        Test results dictionary
    """
    try:
        # Create a test token (simulating frontend generation)
        test_token = create_test_token()

        # Verify the token (simulating backend verification)
        payload = verify_test_token(test_token)

        # Validate required claims
        has_sub = 'sub' in payload
        has_exp = 'exp' in payload
        is_valid = has_sub and has_exp

        # Check if token has expected structure
        sub_valid = isinstance(payload.get('sub'), str)
        exp_valid = isinstance(payload.get('exp'), (int, float))

        results = {
            "success": is_valid and sub_valid and exp_valid,
            "token_created": True,
            "token_verified": True,
            "has_required_claims": has_sub and has_exp,
            "sub_claim_valid": sub_valid,
            "exp_claim_valid": exp_valid,
            "token_payload": payload,
            "message": "Cross-service JWT verification successful"
        }

        return results

    except Exception as e:
        return {
            "success": False,
            "token_created": False,
            "token_verified": False,
            "error": str(e),
            "message": f"Cross-service JWT verification failed: {str(e)}"
        }

if __name__ == "__main__":
    # Run a quick test when executed directly
    results = test_cross_service_compatibility()
    print("JWT Cross-Service Test Results:")
    print(results)