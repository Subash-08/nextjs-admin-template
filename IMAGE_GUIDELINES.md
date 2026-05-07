# Image Guidelines

## Overview
Optimized image handling is critical for performance and user experience. We use Cloudinary for storage and transformation, and a custom `ResponsiveImage` component for display.

## upload Requirements
- **Format:** JPG, PNG, WEBP, GIF
- **Max File Size:** 10MB
- **Color Space:** sRGB recommended

## Aspect Ratios
The system enforces specific aspect ratios to maintain layout consistency.

| Usage | Aspect Ratio | Dimensions (Min) |
|-------|--------------|------------------|
| **Thumbnail** | 4:5 (Portrait) | 400x500px |
| **Cover Image** | 16:9 (Landscape) | 1280x720px |
| **Gallery** | 16:10 / 16:9 / 4:5 | 800px width |
| **OG Image** | 1.91:1 | 1200x630px |
| **Client Logo** | 1:1 (Square) | 200x200px |

## Component Usage

### `ResponsiveImage`
Always use the `ResponsiveImage` component instead of `next/image` directly for project media.

```tsx
<ResponsiveImage 
  src={project.thumbnail.url} 
  alt={project.title} 
  aspectRatio="4:5" 
/>
```

### `ImageUpload`
The `ImageUpload` component automatically handles uploading to Cloudinary and extracting metadata (width, height, aspectRatio, size).

```tsx
<ImageUpload 
  value={field.value} 
  onChange={(value) => field.onChange(value)} 
/>
```

## Best Practices
1. **Alt Text:** Always provide descriptive alt text for accessibility.
2. **Compression:** Cloudinary automatically optimizes quality, but try to upload reasonably compressed source files.
3. **Lazy Loading:** `ResponsiveImage` uses lazy loading by default. Use `priority={true}` only for above-the-fold images (e.g., Hero section).
