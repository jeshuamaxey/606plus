# SEO Optimization Suggestions for Single Item Pages

## Current State Analysis

The single item pages (`/items/[slug]`) are missing critical SEO elements that are present on the homepage. This document outlines specific improvements needed to optimize these pages for search engines.

---

## 🔴 Critical Priority (Must Have)

### 1. **Missing Page-Specific Metadata**
**Issue**: Item pages currently use default metadata from root layout, missing:
- Dynamic title based on item name
- Item-specific meta description
- Item-specific Open Graph images
- Canonical URLs for each item

**Recommendation**: 
- Add `generateMetadata()` function to `src/app/items/[slug]/page.tsx`
- Generate dynamic title: `"{Item Name} by {Designer} | 606+"` or `"{Item Name} | 606+"`
- Create compelling meta description (150-160 chars) using item name, designer, category, and year
- Use item's primary image for Open Graph (1200x630px)
- Set canonical URL: `${siteUrl}/items/${slug}`

**Impact**: High - Essential for search engine understanding and social sharing

---

### 2. **Missing Structured Data (JSON-LD)**
**Issue**: No structured data markup for individual items, missing:
- Product schema (Schema.org Product type)
- BreadcrumbList schema
- Person schema for designer (if available)
- ImageObject schema for images

**Recommendation**:
- Add Product schema with:
  - name, description, image
  - brand (if available)
  - manufacturer (designer as Person)
  - material (from materials field)
  - productionDate (yearStart/yearEnd)
  - category
- Add BreadcrumbList: Home → Items → {Item Name}
- Add Person schema for designer (if available)
- Add ImageObject schemas for all item images

**Impact**: High - Enables rich snippets in search results, better understanding by search engines

---

### 3. **Missing Breadcrumb Navigation**
**Issue**: No visual breadcrumb navigation or schema markup

**Recommendation**:
- Add visual breadcrumb component: `Home > Items > {Item Name}`
- Implement BreadcrumbList structured data (see #2)
- Use semantic `<nav>` element with proper ARIA labels

**Impact**: Medium-High - Improves user experience and helps search engines understand site structure

---

## 🟡 High Priority (Should Have)

### 4. **Open Graph Image Optimization**
**Issue**: Currently using default site image for all items

**Recommendation**:
- Use item's primary image for Open Graph
- Ensure image is optimized: 1200x630px (1.91:1 ratio)
- Fallback to site default if no image available
- Include item name in image alt text

**Impact**: High - Better social media sharing previews, increased click-through rates

---

### 5. **Meta Description Optimization**
**Issue**: No item-specific meta descriptions

**Recommendation**:
- Create unique, compelling descriptions (150-160 characters)
- Include: item name, designer, category, year, key features
- Example: `"The {Item Name} by {Designer} ({Year}) - a {Category} that complements the Vitsoe 606 shelving system. {Brief description}"`
- Avoid keyword stuffing, keep natural and descriptive

**Impact**: High - Improves click-through rates from search results

---

### 6. **Title Tag Optimization**
**Issue**: Using generic title from root layout

**Recommendation**:
- Format: `"{Item Name} by {Designer} | 606+"` or `"{Item Name} ({Year}) | 606+"`
- Keep under 60 characters when possible
- Include primary keyword (item name) at the beginning
- Include designer name if available (helps with E-A-T)

**Impact**: High - First thing users see in search results

---

### 7. **Image Alt Text Enhancement**
**Issue**: Alt text exists but could be more descriptive and SEO-friendly

**Current**: Uses image alt from CMS or fallback
**Recommendation**:
- Primary image: `"{Item Name} by {Designer} - {Category}"`
- Additional images: `"{Item Name} by {Designer} - {Category} - {View description}"` (e.g., "side view", "detail")
- Include designer and category for keyword relevance
- Ensure all images have descriptive alt text

**Impact**: Medium-High - Improves accessibility and image search visibility

---

## 🟢 Medium Priority (Nice to Have)

### 8. **Semantic HTML Structure**
**Issue**: Could improve semantic markup

**Recommendation**:
- Ensure H1 is item name (currently correct)
- Add `<article>` wrapper around main content
- Use `<section>` elements for distinct content areas
- Add `<time>` element for year with `datetime` attribute
- Use `<address>` or structured data for designer/brand info

**Impact**: Medium - Better semantic understanding by search engines

---

### 9. **Internal Linking**
**Issue**: No links to related items or category pages

**Recommendation**:
- Add "Related Items" section linking to:
  - Items by same designer
  - Items in same category
  - Items from same brand
- Add links to category pages (if they exist)
- Add links to designer pages (if they exist)
- Use descriptive anchor text with keywords

**Impact**: Medium - Improves crawlability, user engagement, and site structure

---

### 10. **URL Structure**
**Issue**: Current structure is good, but could add verification

**Recommendation**:
- Ensure slugs are SEO-friendly (lowercase, hyphens, no special chars)
- Keep URLs concise but descriptive
- Verify no duplicate content issues
- Consider adding category/designer in URL if beneficial: `/items/{category}/{slug}` (only if it adds value)

**Impact**: Low-Medium - Current structure is already good

---

### 11. **Content Depth**
**Issue**: Description field may be too short for some items

**Recommendation**:
- Encourage longer, more detailed descriptions in CMS
- Include context about:
  - Design philosophy
  - Historical significance
  - Relationship to Vitsoe 606
  - Materials and craftsmanship
- Aim for 200-300 words minimum when possible
- Use natural keyword integration

**Impact**: Medium - More content = more keyword opportunities and better user experience

---

### 12. **Schema.org Product Properties**
**Issue**: Product schema could be more comprehensive

**Recommendation**:
- Add `offers` property (if applicable)
- Add `aggregateRating` (if reviews are added)
- Add `review` (if reviews are added)
- Add `additionalProperty` for dimensions, materials
- Add `category` with proper taxonomy
- Add `brand` as Organization schema
- Add `manufacturer` as Person schema (designer)

**Impact**: Medium - Enables more rich snippet features

---

### 13. **Twitter Card Optimization**
**Issue**: Using default Twitter card data

**Recommendation**:
- Use item-specific title and description
- Use item's primary image
- Ensure proper card type (`summary_large_image`)
- Include relevant hashtags in description (if natural)

**Impact**: Medium - Better social media engagement

---

### 14. **Canonical URL**
**Issue**: Missing canonical URL for each item page

**Recommendation**:
- Add `alternates.canonical` in metadata
- Ensure it matches the actual URL structure
- Prevent duplicate content issues

**Impact**: Medium - Prevents duplicate content penalties

---

## 🔵 Low Priority (Future Enhancements)

### 15. **FAQ Schema** (if applicable)
**Recommendation**: If common questions exist, add FAQPage schema

### 16. **Video Schema** (if videos added)
**Recommendation**: Add VideoObject schema if item videos are added

### 17. **Review Schema** (if reviews added)
**Recommendation**: Add Review and AggregateRating schemas if review system is implemented

### 18. **Language/Internationalization**
**Recommendation**: Add `hreflang` tags if multiple languages are supported

### 19. **Pagination Schema** (if pagination added)
**Recommendation**: Add pagination structured data if item lists are paginated

### 20. **Performance Optimization**
**Recommendation**:
- Ensure images are properly optimized (WebP format, lazy loading)
- Minimize JavaScript bundle size
- Use Next.js Image component (already implemented ✓)
- Consider adding `loading="lazy"` for below-fold images

---

## Implementation Priority Summary

### Phase 1 (Critical - Do First):
1. ✅ Add `generateMetadata()` function
2. ✅ Add Product structured data (JSON-LD)
3. ✅ Add BreadcrumbList structured data
4. ✅ Add canonical URLs
5. ✅ Optimize Open Graph images

### Phase 2 (High Priority - Do Next):
6. ✅ Enhance meta descriptions
7. ✅ Optimize title tags
8. ✅ Improve image alt text
9. ✅ Add visual breadcrumb navigation

### Phase 3 (Medium Priority - Do Soon):
10. ✅ Improve semantic HTML
11. ✅ Add internal linking (related items)
12. ✅ Enhance Product schema properties
13. ✅ Optimize Twitter Cards

### Phase 4 (Low Priority - Future):
14. Consider FAQ schema
15. Consider review system
16. Performance optimizations

---

## Technical Implementation Notes

### Metadata Function Structure:
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  
  if (!item) {
    return {
      title: 'Item Not Found | 606+',
    };
  }
  
  // Generate dynamic metadata
  return {
    title: `${item.name}${item.designer?.name ? ` by ${item.designer.name}` : ''} | 606+`,
    description: generateMetaDescription(item),
    openGraph: {
      title: `${item.name} | 606+`,
      description: generateMetaDescription(item),
      images: [/* item image */],
    },
    alternates: {
      canonical: `${siteUrl}/items/${slug}`,
    },
  };
}
```

### Structured Data Function Needed:
- `generateProductSchema(item: ItemDetail)` - Returns Product schema
- `generateBreadcrumbSchema(item: ItemDetail)` - Returns BreadcrumbList for item page
- `generatePersonSchema(designer)` - Returns Person schema for designer

---

## Testing Checklist

After implementation, verify:
- [ ] Metadata appears correctly in page source
- [ ] Open Graph preview works (Facebook Debugger)
- [ ] Twitter Card preview works (Twitter Card Validator)
- [ ] Structured data validates (Google Rich Results Test)
- [ ] Canonical URL is set correctly
- [ ] Breadcrumbs appear and work
- [ ] Images have proper alt text
- [ ] Page loads without errors
- [ ] Mobile-friendly (already implemented ✓)
- [ ] Fast page load times

---

## Expected SEO Impact

After implementing these optimizations:
- **Improved search rankings** for item-specific queries
- **Rich snippets** in search results (product info, breadcrumbs)
- **Better social sharing** with item-specific previews
- **Increased click-through rates** from search results
- **Better crawlability** with internal linking
- **Enhanced user experience** with breadcrumbs and related items

---

## Notes

- All implementations should maintain the existing minimalist design aesthetic
- Use Next.js Metadata API (no manual `<head>` manipulation)
- Structured data should use JSON-LD format
- Ensure TypeScript type safety
- No linting errors
- Test on multiple devices and browsers

