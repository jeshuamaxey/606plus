# Image Aspect Ratio & Rendering Guide

## Current Implementation

### Where Images Are Displayed

1. **Homepage (CatalogueItem)**
   - Aspect ratio: **Square (1:1)**
   - Uses `object-cover` - crops image to fill container
   - Mobile: Full width, Desktop: ~33% width (3 columns)
   - Uses first image from `images` array

2. **Item Detail Page**
   - Aspect ratio: **Square (1:1)** for all images
   - Uses `object-cover` - crops image to fill container
   - Mobile: Full width, Desktop: ~66% width (2/3 column)
   - Displays all images from `images` array sequentially

3. **ImageDisplay Component**
   - Options: Square (1:1), Portrait (3:4), Landscape (4:3), Wide (16:9)
   - Uses `object-cover` - crops image to fill container

### The Problem

**All images use `object-cover`**, which means:
- Images are **cropped** to fit the container's aspect ratio
- Important parts of the image may be cut off
- Different aspect ratios in different places = inconsistent cropping
- No way to control which part of the image is visible

## Understanding the Problem

### How `object-cover` Works

When you use `object-cover`:
- Image fills the entire container
- Maintains its original aspect ratio
- **Crops** excess parts that don't fit
- Centers the crop by default (or uses focal point if set)

### Example Scenario

If you upload a **portrait image (3:4)** but it displays in a **square (1:1)** container:
- The top and bottom will be cropped
- Only the middle portion shows
- Important details at top/bottom may be lost

## Solutions & Approaches

### Option 1: Standardize on One Aspect Ratio ⭐ **RECOMMENDED**

**Strategy**: Require all images to be uploaded in a single aspect ratio that works everywhere.

**Recommended Aspect Ratio: 4:3 (Landscape)**

**Why 4:3?**
- Works well for most product/object photography
- Already used on item detail pages
- Can be cropped to square for homepage (crops sides, not top/bottom)
- Standard photography ratio (many cameras default to this)

**Implementation**:
1. Set Sanity image field to enforce 4:3 ratio
2. Update homepage to use 4:3 instead of square
3. Provide CMS guidance: "All images must be 4:3 landscape"

**Pros**:
- ✅ Simple rule: one aspect ratio for everything
- ✅ Predictable cropping behavior
- ✅ Easy to communicate to content creators

**Cons**:
- ❌ May not work for all object types (very tall objects, very wide objects)
- ❌ Requires cropping all images before upload

---

### Option 2: Use Sanity Hotspot Feature ⭐⭐ **BEST FOR FLEXIBILITY**

**Strategy**: Use Sanity's built-in hotspot feature to specify the focal point, then use `object-cover` with focal point positioning.

**How It Works**:
- Sanity allows setting a "hotspot" (focal point) when uploading images
- The hotspot tells the system which part of the image is most important
- When cropping, the system keeps the hotspot visible

**Implementation**:
1. Enable hotspot in Sanity image fields (already enabled!)
2. Use Sanity's image URL builder with hotspot positioning
3. Update image rendering to respect hotspot

**Pros**:
- ✅ Flexible - can use different aspect ratios
- ✅ Content creators control what's visible
- ✅ Professional approach used by many CMS platforms

**Cons**:
- ❌ Requires training content creators
- ❌ More complex implementation
- ❌ Still crops, just crops intelligently

---

### Option 3: Use `object-contain` Instead

**Strategy**: Show the entire image without cropping, but may have letterboxing.

**How It Works**:
- Image fits entirely within container
- Maintains aspect ratio
- Adds empty space (letterboxing) if aspect ratios don't match

**Implementation**:
- Change `object-cover` to `object-contain` in components

**Pros**:
- ✅ No cropping - entire image visible
- ✅ Simple change

**Cons**:
- ❌ Inconsistent visual appearance (letterboxing)
- ❌ May look unprofessional
- ❌ Doesn't solve the "looks good everywhere" problem

---

### Option 4: Multiple Image Sizes Per Item

**Strategy**: Upload multiple versions of the same image optimized for different uses.

**Implementation**:
- Primary image: 4:3 for detail page
- Thumbnail: Square for homepage
- Or use Sanity's automatic image transformations

**Pros**:
- ✅ Each use case gets optimized image
- ✅ Best visual quality

**Cons**:
- ❌ More work for content creators
- ❌ More storage/complexity
- ❌ Still need to manage aspect ratios

---

## Current Solution: Square Images with Hotspot Support

### Implementation Strategy

1. **Aspect Ratio**: All images displayed as **square (1:1)** on both homepage and item detail pages
2. **Use Hotspot**: Hotspot selection enabled in Sanity for intelligent cropping
3. **Image Array**: Single `images` array field - first image used on homepage, all images on detail page
4. **CMS Guidance**: 4:3 aspect ratio preset available in cropper (for reference), but images render as squares

### Implementation Steps

#### Step 1: Update Homepage to Use 4:3

Change `CatalogueItem` default from `square` to `wide` (4:3):

```tsx
// In CatalogueItem.tsx
aspectRatio = 'wide', // Instead of 'square'
```

#### Step 2: Update Sanity Image URL Builder

Use hotspot-aware image URLs:

```ts
// In sanity.ts
function buildImageUrl(image, width = 800, height = 600) {
  if (!image?.asset?._id) return '';
  
  const imageBuilder = builder.image(image)
    .width(width)
    .height(height)
    .fit('crop');
  
  // Use hotspot if available
  if (image.hotspot) {
    return imageBuilder
      .crop('focalpoint')
      .focalPoint(image.hotspot.x, image.hotspot.y)
      .url();
  }
  
  return imageBuilder.url();
}
```

#### Step 3: Create CMS Guidelines Document

Provide clear instructions for content creators:

**Image Upload Guidelines**:
- All images must be **4:3 aspect ratio** (e.g., 1200×900px, 1600×1200px)
- Set the **hotspot** (focal point) on the most important part of the image
- For objects: Set hotspot on the center of the object
- For portraits: Set hotspot on the face/subject

---

## Simple Rule for Content Creators

### The Golden Rule

> **"Upload all images as 4:3 landscape. Set the hotspot on the most important part. The system will handle the rest."**

### Quick Reference

| Use Case | Aspect Ratio | Hotspot Location |
|----------|-------------|------------------|
| Product/Object | 4:3 | Center of object |
| Portrait/Person | 4:3 | Face/head area |
| Wide Scene | 4:3 | Main subject |
| Detail Shot | 4:3 | Detail area |

---

## Technical Implementation

### Current Image Rendering

```tsx
// Current: Uses object-cover, crops center
<Image
  src={imageUrl}
  fill
  className="object-cover" // Crops to fit
/>
```

### With Hotspot Support

```tsx
// Better: Uses hotspot-aware cropping
<Image
  src={imageUrlWithHotspot} // URL includes focal point
  fill
  className="object-cover" // Still crops, but intelligently
/>
```

### Sanity Hotspot Data Structure

```ts
{
  image: {
    asset: { _id: "..." },
    hotspot: {
      x: 0.5,  // 0-1, horizontal position
      y: 0.5,  // 0-1, vertical position
      height: 0.8,
      width: 0.8
    }
  }
}
```

---

## Aspect Ratio Comparison

### Common Aspect Ratios

| Ratio | Dimensions | Use Case | Works on Homepage? | Works on Detail? |
|-------|-----------|----------|-------------------|------------------|
| **4:3** | 1200×900 | Products, objects | ✅ Yes (crops sides) | ✅ Perfect |
| **1:1** | 1200×1200 | Square photos | ✅ Perfect | ⚠️ Crops top/bottom |
| **3:4** | 900×1200 | Portrait objects | ⚠️ Crops sides | ⚠️ Crops sides |
| **16:9** | 1920×1080 | Wide scenes | ⚠️ Crops sides heavily | ⚠️ Crops sides |

**Conclusion**: 4:3 is the most versatile.

---

## Migration Strategy

### For Existing Images

1. **Audit**: Check current image aspect ratios
2. **Crop**: Use image editing tool to crop all to 4:3
3. **Re-upload**: Replace images in Sanity
4. **Set Hotspots**: Go through and set focal points

### For New Images

1. **Template**: Provide 4:3 template/guide
2. **Validation**: Add validation in Sanity (if possible)
3. **Training**: Document the 4:3 requirement

---

## Alternative: Flexible Approach with Smart Defaults

If you can't standardize on one ratio, use this strategy:

1. **Default to 4:3** for all images
2. **Allow exceptions** for special cases (very tall/wide objects)
3. **Use hotspot** to ensure important parts stay visible
4. **Document exceptions** clearly

---

## Summary

### Best Practice: **4:3 Standard with Hotspot**

1. ✅ Upload all images as **4:3 landscape**
2. ✅ Set **hotspot** on important parts
3. ✅ Use **4:3 containers** everywhere
4. ✅ Let `object-cover` crop intelligently based on hotspot

### Why This Works

- **Predictable**: One aspect ratio = predictable behavior
- **Flexible**: Hotspot allows fine-tuning
- **Professional**: Industry-standard approach
- **Simple**: Easy rule for content creators

## Current Implementation Status

✅ **Completed**:
1. Hotspot support enabled and working
2. Image URL builder uses hotspot automatically
3. CMS guidance added to schema descriptions
4. Square aspect ratio implemented consistently
5. Images array with alt text and credit fields

### Image Upload Guidelines (Current)

- **Recommended**: Upload images as 4:3 landscape (preset available in cropper)
- **Display**: Images render as squares (1:1) on both homepage and detail pages
- **Required**: Set alt text for accessibility
- **Optional**: Add credit/attribution
- **Recommended**: Set hotspot (focal point) on important parts of image

