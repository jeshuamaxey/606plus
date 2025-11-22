# E-Track Grid Implementation Guide

This guide explains how to implement the e-track grid layout as demonstrated in the preview layouts. The e-track grid creates a row-based layout with continuous vertical tracks that run down the page, inspired by the Vitsoe 606 Universal Shelving System.

## Overview

The e-track grid uses two key components:
- **`ETrackRowGrid`** - The main grid component that arranges items in rows
- **`ETrackContainer`** - A wrapper component that creates the visual e-track lines

## Key Implementation Pattern

The e-track grid follows a specific pattern to create continuous vertical tracks:

1. **Wrap the entire grid** in an `ETrackContainer` with the `right` prop
2. **Wrap each grid item** in an `ETrackContainer` with the `left` prop

This creates tracks between columns (left tracks on items) and on the right edge (right track on the grid container).

## Basic Usage

```tsx
import { ETrackRowGrid } from '@/components/ui/ETrackRowGrid';

const items = [
  { title: 'Item 1', subtitle: 'Category', image: '/image1.jpg' },
  { title: 'Item 2', subtitle: 'Category', image: '/image2.jpg' },
  // ... more items
];

<ETrackRowGrid
  items={items}
  columns={3}
  rowSpacing="none"
/>
```

## Component Structure

### ETrackRowGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Item[]` | **required** | Array of items to display in the grid |
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | Number of columns per row |
| `rowSpacing` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'none'` | Vertical spacing between rows |
| `className` | `string` | `''` | Additional CSS classes for the container |

### Item Interface

Each item in the `items` array should have the following structure:

```typescript
interface Item {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
}
```

## Best Practices

### 1. Continuous Tracks

For continuous vertical tracks (no gaps), use `rowSpacing="none"`:

```tsx
<ETrackRowGrid
  items={items}
  columns={3}
  rowSpacing="none"  // No gaps = continuous tracks
/>
```

### 2. Item Distribution

Items are distributed **horizontally** across rows:
- Row 1: Items 0, 1, 2
- Row 2: Items 3, 4, 5
- Row 3: Items 6, 7, 8
- etc.

This makes it ideal for sequential data rendering where items flow left-to-right, top-to-bottom.

### 3. Responsive Behavior

The e-tracks are **only visible on desktop** (md breakpoint and above). On mobile, the grid collapses to a single column without tracks. This is handled automatically by the component.

### 4. Column Count

Choose the number of columns based on your content:
- **1 column**: Full-width items, tracks on left and right edges
- **2 columns**: Two-column layout with track between columns
- **3 columns**: Balanced layout (default) with tracks between columns
- **4 columns**: Dense layout with multiple tracks

## How It Works Internally

### ETrackContainer Structure

The `ETrackContainer` component uses three nested divs to create the three-line e-track effect:

```
<ETrackContainer left>
  <div border-left>           <!-- First line -->
    <div padding-left>         <!-- Gap -->
      <div border-left>        <!-- Second line -->
        <div padding-left>     <!-- Gap -->
          <div border-left>    <!-- Third line -->
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
</ETrackContainer>
```

### Grid Implementation

The `ETrackRowGrid` component:

1. Wraps the entire grid in `<ETrackContainer right>` to show the right edge track
2. Wraps each item in `<ETrackContainer left>` to show tracks between columns
3. Uses CSS Grid to arrange items in rows
4. Distributes items horizontally across rows

## Complete Example

Here's a complete example from the preview layout:

```tsx
'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import { ETrackRowGrid } from '@/components/ui/ETrackRowGrid';

export default function CataloguePage() {
  const items = [
    { 
      title: 'Braun KF 20 Coffee Maker', 
      subtitle: 'Kitchenware · 1972', 
      image: '/images/coffee-maker.jpg' 
    },
    { 
      title: 'Max Bill Wristwatch', 
      subtitle: 'Timepiece · 1961', 
      image: '/images/watch.jpg' 
    },
    // ... more items
  ];

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-4">Catalogue</Heading>
          <BodyText className="mb-8">
            A curated collection of objects displayed in an e-track grid layout.
          </BodyText>
          
          <ETrackRowGrid
            items={items}
            columns={3}
            rowSpacing="none"
          />
        </Container>
      </Section>
    </div>
  );
}
```

## Visual Result

The e-track grid creates:
- **Three vertical gray lines** (rgb(212, 212, 212)) on the left of each column
- **Three vertical gray lines** on the right edge of the grid
- **2px gaps** between each line
- **Continuous tracks** that run down the entire page (when `rowSpacing="none"`)

## Customization

### Custom Item Component

You can customize the item rendering by modifying the `ETrackRowGrid` component or creating your own wrapper:

```tsx
<ETrackRowGrid
  items={items}
  columns={3}
  rowSpacing="none"
  className="my-custom-class"
/>
```

### Spacing Options

- `rowSpacing="none"` - No gaps, continuous tracks
- `rowSpacing="sm"` - Small gaps (4px)
- `rowSpacing="md"` - Medium gaps (6px)
- `rowSpacing="lg"` - Large gaps (8px)

## Troubleshooting

### Tracks Not Showing

- Ensure you're viewing on desktop (md breakpoint and above)
- Check that items are properly structured with required fields
- Verify the component is imported correctly

### Items Not Arranging Correctly

- Check that `columns` prop matches your desired layout
- Ensure items array has enough items to fill rows
- Verify CSS Grid classes are being applied

### Tracks Not Continuous

- Use `rowSpacing="none"` for continuous tracks
- Check for any custom CSS that might add gaps
- Ensure the grid container doesn't have additional spacing

## Related Components

- `ETrackContainer` - The wrapper component that creates the track lines
- `CatalogueItem` - The default item component used in the grid
- `ETrackGrid` - Alternative column-based e-track layout (different implementation)

## See Also

- Preview Layout 10: `/preview/layouts/10` - Live example of the e-track row grid
- Preview Layout 5: `/preview/layouts/5` - Alternative column-based e-track layout

