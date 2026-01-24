---
name: fullstack-ui-nextjs-app-router
description: Build full-stack user interfaces using the Next.js App Router with server components, layouts, and data fetching.
---

# Full-Stack UI (Next.js App Router)

## Instructions

1. **App structure**
   - Use the `/app` directory for routing
   - Organize UI by routes, layouts, and segments
   - Leverage nested layouts for shared UI

2. **Rendering model**
   - Use Server Components by default
   - Add Client Components only when needed
   - Mix server and client logic responsibly

3. **Data fetching**
   - Fetch data directly in Server Components
   - Use async/await with caching strategies
   - Handle loading and error states with route files

4. **UI & interactivity**
   - Build reusable components
   - Use forms and server actions for mutations
   - Implement navigation with `Link` and `useRouter`

## Best Practices
- Prefer Server Components for performance
- Keep Client Components minimal and focused
- Co-locate data fetching with UI
- Use layouts for consistency
- Handle loading and error states explicitly
- Optimize for accessibility and SEO

## Example Structure
```tsx
// app/users/page.tsx
async function getUsers() {
  const res = await fetch("https://api.example.com/users");
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <ul>
      {users.map((user: any) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
}
