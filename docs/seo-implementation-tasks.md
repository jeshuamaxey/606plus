# SEO Implementation Tasks

This document outlines the specific tasks to implement SEO optimizations using Next.js App Router conventions.

## Task Overview

All tasks use Next.js built-in features:
- **Metadata API**: `export const metadata` or `generateMetadata()` functions
- **File-based routing**: Special files like `robots.ts` and `sitemap.ts` in the `app` directory
- **Structured Data**: JSON-LD via `<script>` tags in components

---

## Phase 1: Metadata & Social Tags (High Priority)

### Task 1.1: Update Root Layout Metadata
**File**: `src/app/layout.tsx`

**Action**: Replace generic metadata with site-specific defaults
- Update `title` to "606+ | Design object catalogue"
- Update `description` to a compelling site description
- Add `metadataBase` for absolute URLs
- Add default `openGraph` configuration
- Add default `twitter` card configuration
- Add `icons` configuration
- Set `viewport` and `themeColor`

**Next.js Method**: Use `export const metadata: Metadata` object

---

### Task 1.2: Add Homepage-Specific Metadata
**File**: `src/app/page.tsx`

**Action**: Export page-specific metadata that overrides root defaults
- Add `title` with template: "606+ | Design object catalogue"
- Add `description` describing the catalogue (150-160 chars)
- Add `openGraph` with homepage-specific image and description
- Add `twitter` card with homepage-specific data
- Add `alternates.canonical` pointing to homepage URL

**Next.js Method**: Use `export const metadata: Metadata` or `export async function generateMetadata()` if dynamic data needed

**Note**: Since homepage items are fetched async, we can use `generateMetadata()` to potentially include item count or other dynamic info

---

### Task 1.3: Add Metadata to About Page
**File**: `src/app/about/page.tsx`

**Action**: Add page-specific metadata
- Add `title`: "About | 606+"
- Add `description` about the catalogue's purpose
- Add `openGraph` with about page image (Vitsoe 606 image)
- Add canonical URL

**Next.js Method**: Use `export const metadata: Metadata`

---

## Phase 2: Technical SEO Files (High Priority)

### Task 2.1: Create robots.txt
**File**: `src/app/robots.ts` (or `robots.txt`)

**Action**: Create robots.txt using Next.js file-based routing
- Allow all user agents
- Reference sitemap location
- Optionally disallow `/cms` and `/admin` paths

**Next.js Method**: Create `app/robots.ts` exporting a default function that returns a `Robots` object, or create `app/robots.txt` as a static file

**Preferred**: Use `app/robots.ts` for dynamic generation:
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cms', '/admin'],
    },
    sitemap: 'https://606plus.jeshua.dev/sitemap.xml',
  }
}
```

---

### Task 2.2: Generate Sitemap
**File**: `src/app/sitemap.ts`

**Action**: Create dynamic sitemap using Next.js sitemap generation
- Include homepage (`/`)
- Include about page (`/about`)
- Dynamically include all item pages from Sanity CMS
- Set proper `lastModified` dates
- Set `changeFrequency` and `priority`

**Next.js Method**: Create `app/sitemap.ts` exporting a default async function returning `MetadataRoute.Sitemap`

**Implementation**:
- Fetch all published items from Sanity
- Map to sitemap entries with `/items/[slug]` URLs
- Include static pages (homepage, about)

---

## Phase 3: Structured Data (Medium Priority)

### Task 3.1: Add JSON-LD Structured Data to Homepage
**File**: `src/app/page.tsx`

**Action**: Add structured data script tags
- **CollectionPage schema**: Mark homepage as a collection
- **ItemList schema**: List all items in the grid
- **Organization schema**: Site owner information (Jeshua Maxey)
- **BreadcrumbList schema**: Navigation structure

**Next.js Method**: Add `<script type="application/ld+json">` tags in the page component

**Implementation**:
- Create a helper function to generate JSON-LD objects
- Use items data from `getHomepageItems()` to populate ItemList
- Add script tags in the page JSX

---

### Task 3.2: Create Structured Data Helper
**File**: `src/lib/structured-data.ts` (new file)

**Action**: Create reusable functions for generating structured data
- `generateCollectionPageSchema()` - for collection pages
- `generateItemListSchema()` - for item lists
- `generateOrganizationSchema()` - for site owner
- `generateBreadcrumbSchema()` - for navigation

**Purpose**: Keep structured data logic organized and reusable

---

## Phase 4: Content & Semantic HTML (Medium Priority)

### Task 4.1: Add Hero Section with H1
**File**: `src/app/page.tsx`

**Action**: Add introductory content before the grid
- Add H1 heading: "Design object catalogue"
- Add introductory paragraph explaining the catalogue
- Maintain minimalist design aesthetic
- Ensure keywords are naturally integrated

**Implementation**:
- Use existing `Heading` and `BodyText` components
- Add section before `ETrackRowGrid`
- Keep it concise and on-brand

---

### Task 4.2: Enhance Image Alt Text
**File**: `src/lib/sanity.ts` or `src/components/ui/CatalogueItem.tsx`

**Action**: Improve alt text generation
- Make alt text more descriptive
- Include item name, category, and designer when available
- Format: "{{Item Name}} by {{Designer}} - {{Category}}"

**Current**: Uses `item.name` as alt text
**Proposed**: Generate richer alt text from available metadata

---

## Phase 5: Additional Optimizations (Low Priority)

### Task 5.1: Add Viewport and Theme Color
**File**: `src/app/layout.tsx`

**Action**: Ensure proper viewport configuration
- Verify `viewport` metadata is set
- Add `themeColor` for mobile browsers

**Next.js Method**: Use `export const viewport` or include in metadata object

---

### Task 5.2: Optimize Font Loading
**File**: `src/app/layout.tsx`

**Action**: Ensure fonts are optimized for SEO
- Verify `display: "swap"` is set (already done)
- Consider preloading critical fonts

**Status**: Already using `display: "swap"` ✓

---

### Task 5.3: Add Language Attributes
**File**: `src/app/layout.tsx`

**Action**: Ensure proper language declaration
- Verify `<html lang="en">` is set (already done ✓)
- Consider adding `hreflang` if multi-language support is planned

**Status**: Already has `lang="en"` ✓

---

## Implementation Order

1. **Start with Phase 1** (Metadata) - Quick wins, high impact
2. **Then Phase 2** (Technical files) - Essential for crawling
3. **Then Phase 3** (Structured data) - Improves rich snippets
4. **Then Phase 4** (Content) - Improves user experience and SEO
5. **Finally Phase 5** (Polish) - Fine-tuning

---

## Testing Checklist

After implementation, verify:

- [ ] Metadata appears correctly in page source
- [ ] Open Graph tags work (test with Facebook Debugger)
- [ ] Twitter Card preview works (test with Twitter Card Validator)
- [ ] robots.txt is accessible at `/robots.txt`
- [ ] sitemap.xml is accessible at `/sitemap.xml`
- [ ] Structured data validates (use Google Rich Results Test)
- [ ] Canonical URLs are set correctly
- [ ] H1 appears on homepage
- [ ] Images have descriptive alt text
- [ ] Page loads without errors

---

## Notes

- All metadata uses Next.js Metadata API (no manual `<head>` manipulation)
- robots.txt and sitemap use Next.js file-based routing
- Structured data uses standard JSON-LD format
- Maintains existing design aesthetic
- Uses TypeScript for type safety

