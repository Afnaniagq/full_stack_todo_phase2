---
name: identity-integration-better-auth
description: Integrate authentication and identity management using Better Auth with secure, flexible login flows.
---

# Identity Integration (Better Auth)

## Instructions

1. **Auth setup**
   - Configure Better Auth provider
   - Register applications and callback URLs
   - Manage environment-based configuration

2. **Identity flows**
   - Enable email/password and social logins
   - Support magic links or OTP where applicable
   - Handle login, logout, and session lifecycle

3. **Session & user management**
   - Store and validate authenticated sessions
   - Sync user profiles with application data
   - Handle role and permission mapping

4. **Application integration**
   - Protect routes and APIs with auth middleware
   - Pass identity context to backend services
   - Handle auth errors and redirects gracefully

## Best Practices
- Use secure redirect and callback URLs
- Keep identity logic centralized
- Enforce least-privilege access
- Rotate secrets and keys regularly
- Log authentication events for auditing
- Design flows with a smooth user experience

## Example Structure
```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  providers: ["email", "google"],
  session: {
    strategy: "jwt",
  },
});
