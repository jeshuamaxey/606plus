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

### Current Schema Implementation ✅
- ✅ **Images array** (`images`) - Multiple images per item
- ✅ Name, number, slug
- ✅ Category (reference, required)
- ✅ Designer (reference, optional)
- ✅ Brand (reference, optional)
- ✅ Year range (yearStart, yearEnd)
- ✅ Description (text)
- ✅ Materials (string, optional)
- ✅ Dimensions (string, optional)
- ✅ Alt text (required for each image)
- ✅ Credit (optional for each image)

## Components Used

### Implementation Approach
- **No new components created** - Used existing components and CSS Grid
- **Direct implementation** in page component

### Components Used
- ✅ `Image` (Next.js) - For image display
- ✅ `Typography` (Heading, BodyText, Label) - For text content
- ✅ `Badge` - For category tags
- ✅ `Container` & `Section` - For layout structure
- ✅ `Divider` - For visual separation
- ✅ `ETrack` - For vertical borders
- ✅ `Navigation` & `Footer` - For page structure

## Implementation Status

### ✅ Phase 1: Schema & Data Layer - COMPLETE
1. ✅ Added `images` array field to schema
2. ✅ Created `getItemBySlug()` function
3. ✅ Fetches full item data with resolved references
4. ✅ Includes all metadata fields (materials, dimensions added)

### ✅ Phase 2: Core Components - COMPLETE
1. ✅ Used existing components (no new components needed)
2. ✅ Implemented image display directly in page
3. ✅ CSS Grid for asymmetric layout

### ✅ Phase 3: Page Implementation - COMPLETE
1. ✅ Created `/app/items/[slug]/page.tsx`
2. ✅ Server component with data fetching
3. ✅ 404 handling with `not-found.tsx`
4. ✅ Navigation wired up from homepage

### 🔄 Phase 4: Enhancement & Polish - FUTURE
- Related items section (not implemented)
- Breadcrumbs (not implemented)
- SEO optimization (not implemented)
- Links to designer/brand/category pages (prepared but pages not created)

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

## Implementation Decisions Made

1. **Multiple Images**: ✅ Implemented `images` array field
2. **Image Gallery Style**: Sequential display (vertical stack) - simple and clean
3. **Right Column Behavior**: Scrolls naturally with content (not sticky)
4. **Related Links**: Prepared but pages not created yet
5. **Additional Metadata**: ✅ Added materials and dimensions fields
6. **Design Direction**: ✅ Follows minimal aesthetic from preview page
7. **Component Approach**: ✅ Built directly in page context (no isolated components)

## Final Implementation

### What Was Built
- ✅ Images array with multiple images support
- ✅ Asymmetric 2-column layout (2/3 + 1/3)
- ✅ E-track borders for visual structure
- ✅ Square aspect ratio for all images
- ✅ Hotspot support for intelligent cropping
- ✅ Alt text (required) and credit (optional) fields
- ✅ Full metadata display including materials and dimensions
- ✅ Responsive design
- ✅ 404 error handling

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

