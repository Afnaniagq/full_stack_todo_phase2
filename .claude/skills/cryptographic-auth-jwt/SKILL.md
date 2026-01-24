---
name: cryptographic-auth-jwt
description: Implement secure authentication and authorization using JSON Web Tokens (JWT) with cryptographic signing.
---

# Cryptographic Auth (JWT)

## Instructions

1. **Token structure**
   - Use standard JWT parts: header, payload, signature
   - Include essential claims (`sub`, `exp`, `iat`, `iss`)
   - Keep payload minimal and non-sensitive

2. **Token creation**
   - Sign tokens using secure algorithms (HS256 or RS256)
   - Store secrets and private keys securely
   - Set appropriate expiration times

3. **Token validation**
   - Verify signature integrity
   - Validate expiration and issuer
   - Reject malformed or revoked tokens

4. **Auth flow integration**
   - Issue JWTs after successful login
   - Send tokens via Authorization headers
   - Protect routes using middleware/guards

## Best Practices
- Always use HTTPS
- Keep JWTs short-lived
- Never store secrets in source code
- Prefer RS256 for distributed systems
- Implement refresh tokens carefully
- Avoid storing sensitive data in JWT payloads

## Example Structure
```python
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "super-secret-key"
ALGORITHM = "HS256"

def create_access_token(subject: str):
    payload = {
        "sub": subject,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=15),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
