# Individual Item Page Implementation

## Overview
A dedicated page for displaying individual catalogue items, accessed via `/items/[slug]`. This page showcases design objects with rich metadata and multiple images in an asymmetric two-column layout.

## Implementation Summary

### Layout Structure
- **Asymmetric Two-Column Layout**:
  - **Left Column (2/3 width)**: Image gallery displaying all images
  - **Right Column (1/3 width)**: Metadata panel with item information
- **E-Track Borders**: Vertical e-track lines on left edge, right edge, and between columns
- **Responsive**: Columns stack vertically on mobile, maintain asymmetric layout on desktop (≥1024px)

### Image Display
- **Aspect Ratio**: Square (1:1) for all images on item detail page
- **Image Source**: Uses first image from `images` array as primary image
- **Additional Images**: All remaining images from array displayed sequentially
- **Hotspot Support**: Images use Sanity hotspot for intelligent cropping
- **Alt Text**: Required for all images (accessibility)
- **Credit**: Optional attribution field for each image

### Metadata Display
- Item number (#)
- Item name (large heading)
- Category badge
- Designer name
- Brand name
- Year range (formatted as "1972" or "1972-1985")
- Materials
- Dimensions
- Description (full text)

## Schema Structure

### Item Schema (`sanity/schemas/item.ts`)
- **images**: Array of image objects
  - Each image includes:
    - `alt` (required): Alternative text for accessibility
    - `credit` (optional): Image attribution
    - Hotspot and crop data for intelligent cropping
  - Preview shows thumbnail with alt text as title

### Data Flow
1. Homepage uses first image (`images[0]`) from array
2. Item detail page displays all images sequentially
3. First image is primary, remaining images follow

## Technical Details

### Routing
- **Route**: `/app/items/[slug]/page.tsx`
- **Type**: Server component (Next.js App Router)
- **404 Handling**: `not-found.tsx` for missing items

### Data Fetching
- **Function**: `getItemBySlug()` in `src/lib/sanity.ts`
- **Query**: Fetches full item data with resolved references
- **Includes**: All metadata fields, images array with hotspot/crop/alt/credit

### Image Processing
- **URL Builder**: `buildLargeImageUrl()` - generates 1200×1200px images
- **Hotspot**: Automatically used by Sanity's image URL builder
- **Optimization**: Next.js Image component with proper sizing

## Design Implementation

### Typography
- Item name: `Heading` level 1
- Metadata labels: `Label` component (uppercase, tracking-wide)
- Metadata values: `BodyText` size `sm`
- Description: `BodyText` size `md` weight `light`

### Layout Components
- `Container` and `Section` for consistent spacing
- `ETrack` components for vertical borders
- CSS Grid for asymmetric 2-column layout
- Responsive padding and gaps

### Visual Design
- Minimal aesthetic matching Vitsoe 606 style
- Generous white space
- E-track borders for structural definition
- Square images for consistent presentation

## Current State

### ✅ Implemented
- Asymmetric 2-column layout (2/3 + 1/3)
- E-track borders (left, right, between columns)
- Multiple images support (array)
- Square aspect ratio for all images
- Hotspot support for intelligent cropping
- Alt text (required) and credit (optional) fields
- Full metadata display
- Responsive design
- 404 error handling

### 🔄 Future Enhancements (Not Implemented)
- Related items section
- Breadcrumbs
- Links to designer/brand/category pages
- SEO meta tags
- Structured data

## Usage

### Accessing Item Pages
Items are linked from the homepage via `CatalogueItem` component:
- Each item links to `/items/[slug]`
- Slug is generated from item name or uses existing slug

### Adding Images in CMS
1. Add images to the `images` array
2. Set alt text (required) for each image
3. Optionally add credit/attribution
4. Set hotspot (focal point) by clicking and dragging on image
5. First image in array appears on homepage and as primary on detail page

