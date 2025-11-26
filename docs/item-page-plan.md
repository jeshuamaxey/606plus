# Individual Item Page Plan

## Overview
A dedicated page for displaying individual catalogue items, accessed via `/items/[slug]`. This page should showcase design objects with rich metadata and multiple images, appealing to design enthusiasts.

## Layout Structure

### Asymmetric Two-Column Layout
- **Left Column (2/3 width)**: Primary content area
  - Image gallery/display
  - Main visual focus
  
- **Right Column (1/3 width)**: Metadata and information
  - Item details
  - Category, designer, brand information
  - Links to related pages
  - Additional metadata

### Responsive Behavior
- On mobile/tablet: Stack columns vertically (full width)
- Maintain asymmetric layout on desktop (≥1024px)

## Content Sections

### Left Column (2/3) - Image Gallery
1. **Primary Image Display**
   - Large, prominent image
   - High quality, optimized loading
   - Support for multiple images (gallery)

2. **Image Gallery Options** (if multiple images)
   - Thumbnail navigation below main image
   - Or: Full-width carousel/slideshow
   - Or: Grid of images (2-3 columns)
   - Consider: Lightbox/modal for full-screen viewing

### Right Column (1/3) - Information Panel
1. **Item Header**
   - Item number (e.g., "#42")
   - Item name (large heading)
   - Category badge/tag

2. **Metadata Section**
   - **Designer**: Name with link to designer page (if available)
   - **Brand**: Name with link to brand page (if available)
   - **Years**: Format as "1972" or "1972-1985" or "1972-present"
   - **Category**: Display with link to category page

3. **Description**
   - Full text description (if available)
   - Formatted with proper typography

4. **Related Links** (if applicable)
   - Link to designer page: `/designers/[slug]`
   - Link to brand page: `/brands/[slug]`
   - Link to category page: `/categories/[slug]`
   - "View all items by [Designer]" link

5. **Additional Metadata** (design-focused)
   - Consider: Materials, dimensions, design principles
   - Consider: Related items in same category
   - Consider: Design era/style tags

## Data Requirements

### Current Schema Support
- ✅ Single image (`image`)
- ✅ Name, number, slug
- ✅ Category (reference)
- ✅ Designer (reference, optional)
- ✅ Brand (reference, optional)
- ✅ Year range (yearStart, yearEnd)
- ✅ Description (text)

### Schema Enhancements Needed
- ⚠️ **Multiple Images**: Current schema only supports single image
  - **Option A**: Add `images` array field to item schema
  - **Option B**: Use single image for now, plan gallery enhancement later
  - **Recommendation**: Add `images` array for future-proofing

## Components to Build/Create

### New Components Needed

1. **`ItemImageGallery`** (NEW)
   - Purpose: Display multiple images with navigation
   - Features:
     - Main image display
     - Thumbnail strip or grid
     - Image transitions
     - Optional: Lightbox mode
   - Props: `images: string[]`, `alt: string`, `variant?: 'thumbnails' | 'carousel'`

2. **`ItemMetadata`** (NEW)
   - Purpose: Structured display of item metadata
   - Features:
     - Label-value pairs
     - Link support for references
     - Clean typography hierarchy
   - Props: `item: ItemData`, `showLinks?: boolean`

3. **`MetadataRow`** (NEW - optional sub-component)
   - Purpose: Single metadata row (label + value)
   - Features:
     - Consistent spacing
     - Link support
   - Props: `label: string`, `value: string | ReactNode`, `href?: string`

4. **`AsymmetricLayout`** (NEW - optional utility component)
   - Purpose: Reusable asymmetric 2-column layout
   - Features:
     - 2/3 and 1/3 column widths
     - Responsive stacking
   - Props: `left: ReactNode`, `right: ReactNode`, `gap?: 'sm' | 'md' | 'lg'`

### Existing Components to Use
- ✅ `ImageDisplay` - For individual images
- ✅ `Typography` (Heading, BodyText, Label) - For text content
- ✅ `Badge` - For category tags
- ✅ `Button` or `Link` - For navigation links
- ✅ `Container` & `Section` - For layout structure
- ✅ `Divider` - For visual separation

## Implementation Steps

### Phase 1: Schema & Data Layer
1. **Decide on multiple images approach**
   - If adding `images` array: Update `sanity/schemas/item.ts`
   - If using single image: Document limitation for now

2. **Create Sanity query function**
   - Add `getItemBySlug()` to `src/lib/sanity.ts`
   - Fetch full item data with resolved references
   - Include all metadata fields

### Phase 2: Core Components
1. **Build `ItemMetadata` component**
   - Start with static data
   - Support for optional fields
   - Link generation for references

2. **Build `ItemImageGallery` component**
   - Start with single image support
   - Add gallery functionality if multiple images available
   - Consider: Image optimization, lazy loading

3. **Build `AsymmetricLayout` component** (or use CSS Grid directly)
   - Test responsive behavior
   - Ensure proper spacing

### Phase 3: Page Implementation
1. **Create `/app/items/[slug]/page.tsx`**
   - Server component (Next.js App Router)
   - Fetch item data
   - Handle 404 for missing items
   - Render layout with components

2. **Wire up navigation**
   - Ensure `CatalogueItem` links work correctly
   - Test routing

### Phase 4: Enhancement & Polish
1. **Add related items section** (optional)
   - "More from this designer"
   - "More in this category"
   
2. **Add breadcrumbs** (optional)
   - Home > Category > Item

3. **SEO optimization**
   - Meta tags
   - Open Graph images
   - Structured data

## Design Considerations

### Typography Hierarchy
- Item name: `Heading` level 1 or 2
- Metadata labels: `Label` component (uppercase, tracking-wide)
- Metadata values: `BodyText` (normal weight)
- Description: `BodyText` size `lg` or `md`

### Spacing & Layout
- Use `Section` and `Container` for consistent spacing
- Right column: Sticky positioning? (consider for long descriptions)
- Left column: Generous white space around images

### Visual Design
- Maintain minimal aesthetic (Vitsoe 606 style)
- Use `Divider` sparingly for separation
- Consider subtle background colors for metadata panel
- Images: Full bleed or contained with padding?

## Questions for Clarification

1. **Multiple Images**
   - Do you want to add an `images` array field to the schema now?
   - Or should we start with single image and add gallery later?
   - How many images per item do you anticipate?

2. **Image Gallery Style**
   - Preference: Thumbnail strip, carousel, or grid?
   - Should images be full-bleed or contained?
   - Do you want a lightbox/modal for full-screen viewing?

3. **Right Column Behavior**
   - Should the metadata panel be sticky (stay visible while scrolling)?
   - Or should it scroll naturally with content?

4. **Related Links**
   - Do you want to create designer/brand/category pages now?
   - Or should links be prepared but pages created later?
   - What should the "related items" section show? (same designer, same category, etc.)

5. **Additional Metadata**
   - Are there other fields you want to display? (materials, dimensions, etc.)
   - Should we add these to the schema now or later?

6. **Design Direction**
   - Should this page follow the "Minimal Direction" from your preview page?
   - Or a different aesthetic?
   - Any specific inspiration from the Vitsoe 606 catalogue?

7. **Component Isolation**
   - Should we build `ItemMetadata` and `ItemImageGallery` as isolated components first?
   - Or build them in context of the page?

## Recommended Approach

### Start with MVP, then enhance:
1. **MVP Version**:
   - Single image (use existing schema)
   - Basic metadata display
   - Asymmetric layout
   - Essential links (if pages exist)

2. **Enhanced Version**:
   - Multiple images gallery
   - Related items section
   - Sticky metadata panel
   - Rich metadata display

### Component Development Order:
1. **First**: `ItemMetadata` component (can be tested in isolation)
2. **Second**: `AsymmetricLayout` or CSS Grid implementation
3. **Third**: `ItemImageGallery` (start simple, enhance later)
4. **Fourth**: Page implementation tying it all together

## Technical Notes

### Routing
- Route: `/app/items/[slug]/page.tsx`
- Dynamic route using Next.js App Router
- Use `params.slug` to fetch item

### Data Fetching
- Server component (async)
- Fetch from Sanity at build time or request time
- Handle errors gracefully (404 for missing items)

### Image Optimization
- Use Next.js `Image` component
- Sanity image URLs with proper sizing
- Consider: Responsive images, lazy loading

### TypeScript Types
- Create `ItemDetail` interface matching Sanity schema
- Include resolved references (category, designer, brand)

