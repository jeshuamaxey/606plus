# Typography System

This document provides guidance for implementing typography in the application. It covers font configuration, usage patterns, components, and best practices.

## Font Stack

The application uses a two-font system:

### Display Font: Stack Sans Notch
- **Purpose**: Bold display font for headings
- **Source**: [Google Fonts](https://fonts.google.com/specimen/Stack+Sans+Notch)
- **Weight**: 700 (Bold only)
- **Usage**: All headings (`h1`-`h6`) outside of cards
- **CSS Variable**: `--font-stack-sans-notch`

### Body Font: Geist Sans
- **Purpose**: Primary body copy font
- **Source**: Google Fonts via Next.js
- **Weights**: Available in multiple weights (light, normal, medium, etc.)
- **Usage**: Body text, card headings, and all non-heading content
- **CSS Variable**: `--font-geist-sans`

### Monospace Font: Geist Mono
- **Purpose**: Code, technical annotations, and monospace content
- **Source**: Google Fonts via Next.js
- **Usage**: Technical specifications, code snippets, reference numbers
- **CSS Variable**: `--font-geist-mono`

## Font Configuration

Fonts are configured in `src/app/layout.tsx` using Next.js font optimization:

```typescript
import { Geist, Geist_Mono, Stack_Sans_Notch } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const stackSansNotch = Stack_Sans_Notch({
  variable: "--font-stack-sans-notch",
  subsets: ["latin"],
  weight: "700", // Bold weight only
  display: "swap",
});
```

Font variables are applied to the root layout's body element, making them available throughout the application via CSS variables.

## CSS Variables

The following CSS variables are available in `src/app/globals.css`:

- `--font-geist-sans`: Geist Sans (body font)
- `--font-geist-mono`: Geist Mono (monospace font)
- `--font-stack-sans-notch`: Stack Sans Notch (display font)

These can be accessed in CSS:
```css
font-family: var(--font-geist-sans);
```

## Typography Rules

### Global Heading Rules

All headings (`h1`-`h6`) outside of cards automatically use **Stack Sans Notch Bold**:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-stack-sans-notch), var(--font-geist-sans), sans-serif;
  font-weight: 700;
}
```

### Card Heading Exception

**Important**: Headings inside cards use **Geist Sans** instead of Stack Sans Notch. This is enforced via CSS:

```css
.card h1,
.card h2,
.card h3,
.card h4,
.card h5,
.card h6 {
  font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}
```

To ensure this rule applies, all card components must include the `card` class on their root element.

### Body Text

Body text always uses **Geist Sans** with appropriate weights:
- Light (300): For large introductory text
- Normal (400): Default body text
- Medium (500): For emphasis within body text

## Typography Components

### Heading Component

Located in `src/components/ui/Typography.tsx`:

```tsx
import { Heading } from '@/components/ui/Typography';

<Heading level={1}>Main Title</Heading>
<Heading level={2}>Section Title</Heading>
<Heading level={3}>Subsection Title</Heading>
```

**Props:**
- `level` (1-6): Heading level, defaults to 1
- `className`: Additional CSS classes
- All standard HTML heading attributes

**Default Styles:**
- Level 1: `text-5xl md:text-6xl font-bold tracking-tight`
- Level 2: `text-4xl md:text-5xl font-bold tracking-tight`
- Level 3: `text-3xl md:text-4xl font-bold tracking-tight`
- Level 4: `text-2xl md:text-3xl font-bold tracking-tight`
- Level 5: `text-xl md:text-2xl font-bold tracking-tight`
- Level 6: `text-lg md:text-xl font-bold tracking-tight`

**Note**: The Heading component automatically applies Stack Sans Notch via inline styles. When used inside cards, the `.card` CSS rule will override this to use Geist Sans.

### BodyText Component

```tsx
import { BodyText } from '@/components/ui/Typography';

<BodyText size="lg" weight="light">Large introductory text</BodyText>
<BodyText size="md" weight="normal">Standard body text</BodyText>
<BodyText size="sm" weight="normal">Small body text</BodyText>
```

**Props:**
- `size`: `'sm' | 'md' | 'lg'` - Text size
- `weight`: `'light' | 'normal' | 'medium'` - Font weight
- `className`: Additional CSS classes

**Default Styles:**
- Uses Geist Sans
- `sm`: `text-sm leading-relaxed`
- `md`: `text-base leading-relaxed`
- `lg`: `text-lg leading-relaxed`

### Label Component

```tsx
import { Label } from '@/components/ui/Typography';

<Label>Category Name</Label>
```

**Props:**
- `className`: Additional CSS classes

**Default Styles:**
- `text-sm font-medium text-neutral-900 uppercase tracking-wider`
- Uses Geist Sans

## Implementation Guidelines

### When to Use Stack Sans Notch

✅ **Use Stack Sans Notch for:**
- Page titles and main headings
- Section headings outside of cards
- Display text that needs bold, attention-grabbing typography
- Marketing or hero section headings

❌ **Do NOT use Stack Sans Notch for:**
- Headings inside cards (use Geist Sans)
- Body text
- Navigation items
- Form labels

### When to Use Geist Sans

✅ **Use Geist Sans for:**
- All body text
- Headings inside cards
- Navigation items
- Form labels and inputs
- Metadata and captions
- Any text that isn't a display heading

### When to Use Geist Mono

✅ **Use Geist Mono for:**
- Code snippets
- Technical specifications
- Reference numbers
- Measurement annotations
- Any content requiring monospace alignment

### Card Typography

**Critical Rule**: All card components must include the `card` class on their root element to ensure headings use Geist Sans:

```tsx
// ✅ Correct
<div className="card bg-white border border-neutral-200">
  <h3>Card Title</h3> {/* Uses Geist Sans */}
</div>

// ❌ Incorrect
<div className="bg-white border border-neutral-200">
  <h3>Card Title</h3> {/* Uses Stack Sans Notch - wrong! */}
</div>
```

Card components that already include the `card` class:
- `Card` (base component)
- `BoldCard`
- `ModularCard`
- `TechnicalCard`
- `CraftCard`
- `MinimalCard`

### Creating New Card Components

When creating new card components, always:

1. Add the `card` class to the root element
2. Use semantic HTML headings (`h1`-`h6`) for titles
3. Let the CSS rules handle font selection automatically

Example:
```tsx
export const MyNewCard: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="card bg-white border border-neutral-200">
      <h3>{title}</h3> {/* Automatically uses Geist Sans */}
      {children}
    </div>
  );
};
```

## Direct HTML Usage

### Headings Outside Cards

```tsx
// ✅ Correct - Uses Stack Sans Notch automatically
<h1>Page Title</h1>
<h2>Section Title</h2>

// Or use the Heading component
<Heading level={1}>Page Title</Heading>
```

### Headings Inside Cards

```tsx
// ✅ Correct - Uses Geist Sans automatically
<div className="card">
  <h3>Card Title</h3>
</div>

// ❌ Incorrect - Missing card class
<div>
  <h3>Card Title</h3> {/* Wrong font! */}
</div>
```

### Body Text

```tsx
// ✅ Correct - Uses Geist Sans
<p>Body text content</p>

// Or use the BodyText component
<BodyText>Body text content</BodyText>
```

## Best Practices

1. **Use Typography Components**: Prefer `Heading` and `BodyText` components over raw HTML elements for consistency
2. **Card Class Required**: Always add `card` class to card root elements
3. **Semantic HTML**: Use appropriate heading levels (`h1`-`h6`) for hierarchy
4. **Don't Override Fonts**: Avoid manually setting `font-family` unless absolutely necessary
5. **Consistent Weights**: Use the predefined weight options rather than arbitrary values
6. **Responsive Sizes**: The Heading component includes responsive sizing - leverage this rather than custom breakpoints

## Troubleshooting

### Headings in Cards Using Wrong Font

**Problem**: Card headings are using Stack Sans Notch instead of Geist Sans.

**Solution**: Ensure the card root element has the `card` class:
```tsx
<div className="card ..."> {/* Add 'card' class */}
  <h3>Title</h3>
</div>
```

### Font Not Loading

**Problem**: Fonts appear as fallback system fonts.

**Solution**: 
1. Check that font variables are applied in `layout.tsx`
2. Verify CSS variables are defined in `globals.css`
3. Ensure fonts are imported from `next/font/google`

### Custom Font Override Needed

**Problem**: Need to use a different font for a specific use case.

**Solution**: Use inline styles or a custom CSS class, but document why the exception is needed:
```tsx
<h3 style={{ fontFamily: 'var(--font-geist-mono)' }}>
  Technical Specification
</h3>
```

## Reference

- Font Configuration: `src/app/layout.tsx`
- Global Styles: `src/app/globals.css`
- Typography Components: `src/components/ui/Typography.tsx`
- Stack Sans Notch: https://fonts.google.com/specimen/Stack+Sans+Notch

