---
name: interface-styling-tailwind
description: Style modern user interfaces efficiently using utility-first CSS with Tailwind CSS.
---

# Interface Styling (Tailwind CSS)

## Instructions

1. **Layout composition**
   - Build layouts using Flexbox and Grid utilities
   - Apply spacing, sizing, and alignment classes
   - Design mobile-first responsive structures

2. **Visual styling**
   - Use utility classes for colors, typography, and borders
   - Apply gradients, shadows, and opacity
   - Maintain consistent design tokens via config

3. **Responsive design**
   - Use breakpoint prefixes (`sm`, `md`, `lg`, `xl`)
   - Adapt layouts and typography across devices
   - Hide or show elements responsively

4. **State & interaction**
   - Style hover, focus, and active states
   - Use transition and animation utilities
   - Support dark mode and accessibility states

## Best Practices
- Prefer composition over custom CSS
- Keep class usage readable and intentional
- Use Tailwind config for theme consistency
- Design mobile-first, then scale up
- Avoid overusing arbitrary values
- Ensure accessibility with contrast and focus styles

## Example Structure
```html
<section class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
  <div class="text-center p-8 bg-white/90 rounded-xl shadow-lg">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">
      Your Headline
    </h1>
    <p class="text-gray-600 mb-6">
      Supporting text goes here
    </p>
    <button class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
      Get Started
    </button>
  </div>
</section>
