# Downbadu UI Design System & Style Guide

## Overview

Downbadu is a GitHub software discovery platform with a clean, professional design that emphasizes clarity, accessibility, and modern aesthetics. The design system combines custom CSS with Tailwind CSS utilities to create a cohesive user experience.

---

## Color Palette

### Primary Colors

- **Primary Blue**: `#0d72e7` (rgb(13, 114, 231)) - Main brand color, used for links and primary actions
- **Primary Dark**: `#0f73e6` (rgb(15, 115, 230)) - Button primary color
- **Primary Hover**: `#0d6dde` (rgb(13, 109, 222))

### Success Colors

- **Success Green**: `#038738` (rgb(3, 135, 56)) - Download buttons, positive actions
- **Success Hover**: `#02732e` (rgb(2, 115, 46))
- **Light Green**: `#dcfce7` (rgb(220, 252, 231))

### Semantic Colors

- **Danger Red**: `#ef4444` (rgb(239, 68, 68))
- **Warning Yellow**: `#fde68a` (rgb(253, 230, 138))
- **Blue Accent**: `#bae6fd` (rgb(186, 230, 253))

### Neutral Colors

- **Body Text**: `#253858` (rgb(37, 56, 88)) - Main text color
- **Secondary Text**: `#64748b` (rgb(100, 116, 139)) - Descriptions, metadata
- **Border Gray**: `#e7eff7` (rgb(231, 239, 247))
- **Background Gray**: `#f6f9fc` (rgb(246, 249, 252)) - Generic box background
- **Light Background**: `#FCF8F8` - Main section background

### Special Backgrounds

- **Management Navbar**: `#0b60c1` (rgb(11, 96, 193))
- **Slate Variants**: `#f8fafc`, `#f1f5f9`, `#e2e8f0`, `#cbd5e1`

---

## Typography

### Font Hierarchy

- **Mobile Base**: `0.9rem` (on mobile < 640px)
- **Desktop Base**: `1rem` (16px)

### Headings

- **H1 (Title Big)**: `3.75rem` (mobile: `2.25rem`)
- **H2**: `1.875rem` / `800` weight (mobile: `1.5rem`)
- **Title**: Standard heading with `1rem` margin-bottom
- **Subtitle**: `1.25rem` / `300` weight / `1.75rem` line-height

### Special Typography

- **Simple Card Title**: `1.25rem` / `600` weight (mobile: `1.125rem`)
- **Simple Card Tagline**: `17px` / slate color
- **Breadcrumbs**: `0.875rem` / `700` weight

---

## Layout Components

### Container

- **Max Widths**:
  - Small: `640px`
  - Medium: `768px`
  - Large: `1024px`
  - XLarge: `1280px`
- **Padding**: Auto left/right margins, 100% width

### Sections & Hero

- **Section Padding**: `1.5rem` vertical, `1rem` horizontal (lg: `1.5rem`)
- **Hero Body**: Same padding structure

---

## Hero Components

### Hero Styles

```css
.hero {
  background: linear-gradient(180deg, #e1f2ff, #e5f4ff 41.32%, #f6f9fc);
  align-items: stretch;
  display: flex;
  flex-direction: column;
}
```

### Hero Modern Background (.bg-modern)

Complex radial gradients with:

- Turquoise gradient at bottom-left
- Light blue gradient at top-center
- Teal gradient at bottom-right
- Linear gradient from `#f6fbff` → `#e1f4ff` → `#e4fbf6` → `#f2fff9` → `#ffffff`

### Hero Primary (.is-primary)

- Grid pattern background with `20px × 20px` grid
- Light blue lines (`rgba(186, 230, 253, 0.6)` and `0.5` opacity)

---

## Card & Box Components

### Boxed Component

```css
.boxed {
  border-radius: 0.5rem;
  padding: 1.25rem;
  border: 1px solid #e7eff7;
  background-color: #f6f9fc;
  word-wrap: break-word;
}
```

**Mobile Responsive**:

- Border radius: `0`
- Margin: `-1rem` left/right
- Padding: `1rem`

**Variants**:

- `.boxed--more-space`: `2.5rem` padding (mobile: `1rem`)
- `.boxed--extra-space`: `3.5rem` padding (mobile: `1.25rem`)

### Alt-Boxed

```css
.alt-boxed {
  border-radius: 0.25rem;
  background-gradient: from #f6f9fc to transparent (on hover, to left);
}
```

### Simple Card Component

```css
.simple-card-component {
  display: flex;
  gap: 1rem;
  padding: 1.25rem vertical;
  color: #253858;
}

.simple-card-component__title {
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.simple-card-component__tagline {
  color: #64748b;
  font-size: 17px;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

### Clickable Card

- Relative positioning with nested link overlay
- Hover effect adds shadow
- Inner links have `z-index: 1` to remain clickable

---

## Button System

### Base Button (.btn)

```css
.btn {
  border-radius: 0.25rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #e2e8f0;
  color: #475569;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn:hover {
  background-color: #cbd5e1;
  color: #334155;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
```

### Button Variants

**Success Button**:

```css
.btn--success {
  background-color: #038738;
  color: #fff;
}
.btn--success:hover {
  background-color: #02732e;
  color: #f0fdf4;
}
```

**Primary Button**:

```css
.btn--primary {
  background-color: #0f73e6;
  color: #fff;
}
```

**Danger Button**:

```css
.btn--danger {
  background-color: #ef4444;
  color: #fff;
}
```

**Size Variants**:

- `.btn--small`: `0.875rem` font, `6px 0.75rem` padding
- `.btn--large`: `1.5rem` font, `0.75rem 1.5rem` padding
- `.btn--hero`: Small size with special light variants

**Style Variants**:

- `.btn--hollow`: Transparent background, text-colored, hover adds light gray background
- `.btn--category`: Special styling for category buttons with border

---

## Link Button System

### Link Button (.link-btn)

```css
a.link-btn {
  border-radius: 0.25rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background-color: #fff;
  color: #253858;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

a.link-btn:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}
```

### Link Button Light (.link-btn--light)

```css
a.link-btn--light {
  color: #53678b;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

a.link-btn--light:hover {
  background-color: #f8fafc;
  color: #253858;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
```

---

## Navigation Components

### TopBar (.management-navbar)

```css
.management-navbar {
  background-color: #0b60c1;
  color: #fff;
  padding: 0.25rem vertical;
  font-size: 0.75rem (xs);
}
```

### Navbar

- Background: `white`
- Border bottom: `1px solid #f3f4f6` (gray-100)
- Padding: `py-3 px-4 lg:px-6`
- Logo responsive sizing (mobile: `h-8`, desktop: `h-10`)

### Search Input (Navbar)

```css
background: #f8fafc (slate-50)
border: none
rounded-md
padding-left: 2.5rem (for icon)
focus: ring-2 ring-blue-500, bg-white
shadow-sm
```

### Breadcrumbs

```css
.breadcrumbs {
  font-size: 0.875rem;
  font-weight: 700;
}

.breadcrumbs li + li:before {
  content: "/";
  color: #a3a3a3;
}

.breadcrumbs a {
  color: #253858;
}

.breadcrumbs .is-active span {
  color: #64748b;
  font-weight: 500;
}
```

---

## Sidebar

### Sidebar Structure

- Width: Responsive shrink
- Newsletter card: Gradient background `from-primary-500 to-primary-400`
- Featured products: White cards with border and hover effects

### Featured Product Cards

```css
border: 1px solid #e5e7eb (gray-200)
padding: 0.75rem
rounded
hover: border-gray-300
transition: colors
```

---

## Prose / Content Styling

### Prose Typography

Used for README content and long-form text:

```css
.prose {
  color: #374151;
  max-width: 65ch;
  font-size: 1rem;
  line-height: 1.75;
}

.prose h1 {
  font-size: 2.25em;
  font-weight: 800;
  color: #111827;
}
.prose h2 {
  font-size: 1.5em;
  font-weight: 700;
  color: #111827;
}
.prose h3 {
  font-size: 1.25em;
  font-weight: 600;
  color: #111827;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
}
```

---

## Special Components

### Badges

- `.badge-verified`: Checkmark badge for GitHub verification
- `.badge-verified--big`: Larger version for hero sections

### Separated List

```css
.separated-list-x {
  display: inline-flex;
  flex-wrap: wrap;
}

.separated-list-x li + li:before {
  content: "|";
  font-weight: 300;
  text-align: center;
}
```

### Star Rating

Star icons with spacing: `.25rem` margin-right

---

## Form Elements

### Input Fields

```css
.input {
  font-size: 1rem;
  line-height: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid;
  padding: 7px 11px;
  width: 100%;
  transition: 150ms;
}

.input:hover {
  border-color: #d1d5db;
}

.input:focus {
  border-color: transparent;
  ring: 3px;
  z-index: 10;
}
```

### Select & Textarea

Similar styling to `.input` with same hover/focus states

---

## Modal Component

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 51;
  display: none; /* .is-active: flex */
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: hsla(0, 0%, 4%, 0.82);
}

.modal-content {
  max-height: 95vh;
  width: 100%;
  @media (min-width: 768px) {
    width: 640px;
  }
}

.modal-close {
  position: absolute;
  right: 12px;
  top: 8px;
  color: #1d2d35;
  font-weight: 800;
}
```

---

## Design Patterns & Best Practices

### 1. **Responsive Design**

- Mobile-first approach with progressive enhancement
- Key breakpoints: `640px`, `768px`, `1024px`, `1280px`
- Mobile adjustments: reduced padding, font sizes, and simplified layouts

### 2. **Hover States**

- Consistent use of shadows on hover for interactive elements
- Color transitions for buttons and links
- Border color changes for cards

### 3. **Shadow System**

- **Light**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Medium**: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
- **Large**: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`

### 4. **Border Radius**

- **Small**: `0.25rem` (buttons, inputs, badges)
- **Medium**: `0.5rem` (boxes, cards)
- **Large**: `0.75rem` - `1rem` (major containers)

### 5. **Spacing Scale**

Base unit: `0.25rem` (4px)

- Common values: `0.5rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem`, `2.5rem`, `3.5rem`

### 6. **Color Usage**

- **Primary Blue**: Links, interactive elements, brand identity
- **Success Green**: CTAs, download buttons, positive actions
- **Body Text**: Dark slate for readability
- **Secondary Text**: Lighter slate for metadata and descriptions

### 7. **Component Composition**

- Use `.boxed` for generic containers
- Use `.simple-card-component` for list items
- Use `.link-btn` for category pills and tag-like elements
- Use `.btn--success` for primary CTAs
- Use `.prose` for markdown/HTML content

---

## Page-Specific Patterns

### Homepage (index.vue)

- Hero with `.bg-modern` gradient
- Main section: `bg-[#FCF8F8]`
- Two-column layout: main content + sidebar
- Pagination controls with numbered pages
- Grid layout for "Popular Projects" (3 columns on desktop)

### List Page (list.vue)

- Filter bar with search, sort dropdown, and topic pills
- Active filters shown with blue background
- Mobile: collapsible filter section
- Results count and "Clear filters" button

### Product Detail Page ([slug].vue)

- Breadcrumb navigation
- Hero section with product metadata (stars, owner, version)
- Download button: `.btn--hero.btn--success`
- Two-column layout: README content (prose) + AdSense sidebar
- Downloads section with version cards
- Package info sidebar (sticky)

### Footer

- 4-column grid on desktop (2 on mobile)
- Dark background with white text
- Separated list for legal links

---

## Accessibility Considerations

1. **Color Contrast**: All text meets WCAG AA standards
2. **Focus States**: Clear ring indication on form inputs
3. **Semantic HTML**: Proper heading hierarchy, nav elements, breadcrumbs
4. **Aria Labels**: Used for icons and interactive elements
5. **Keyboard Navigation**: All interactive elements are keyboard accessible

---

## Performance Optimizations

1. **Tailwind CSS**: Utility-first approach for smaller bundle sizes
2. **Critical CSS**: Custom Downbadu CSS loaded in layout
3. **Image Optimization**: Responsive images with proper sizing
4. **Lazy Loading**: Used for images in README content

---

## Component Examples

### Featured Product Card (Sidebar)

```vue
<a
  class="block p-3 border border-gray-200 rounded hover:border-gray-300 transition-colors"
>
  <div class="flex items-center justify-between mb-1">
    <div class="font-bold text-gray-900">{{ product.name }}</div>
    <div class="text-xs text-gray-500">⭐ {{ product.stars }}</div>
  </div>
  <p class="text-sm text-gray-600 mb-2">{{ product.description }}</p>
  <div class="flex flex-wrap gap-1">
    <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
      {{ tag }}
    </span>
  </div>
</a>
```

### Product List Item

```vue
<a class="simple-card-component alt-boxed">
  <div class="flex-1">
    <div class="simple-card-component__title">
      <span>{{ index }}. {{ product.name }}</span>
      <span class="text-slate-500 text-sm font-light">
        ⭐ {{ product.stars }} • {{ product.owner }}
      </span>
    </div>
    <p class="simple-card-component__tagline">{{ product.description }}</p>
    <div class="flex flex-wrap gap-1 mt-2">
      <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
        {{ topic }}
      </span>
    </div>
  </div>
</a>
```

### Category/Topic Pills

```vue
<a class="link-btn link-btn--light">
  {{ category.name }}
</a>
```

### Download Button

```vue
<a class="btn btn--hero btn--success px-6 py-3 flex items-center">
  <svg class="w-5 h-5 mr-2"><!-- download icon --></svg>
  Download
</a>
```

---

## Summary

The Downbadu design system emphasizes:

✅ **Clean, professional aesthetics** with modern gradients and subtle shadows  
✅ **Excellent readability** with carefully chosen typography and color contrast  
✅ **Consistency** across all pages and components  
✅ **Responsiveness** with mobile-first design approach  
✅ **Accessibility** with semantic HTML and ARIA labels  
✅ **Performance** with optimized CSS and lazy loading

The style combines **custom CSS classes** (for specialized components like `.simple-card-component`, `.boxed`, `.hero`) with **Tailwind utilities** (for layout, spacing, and responsive design), creating a balanced and maintainable design system.
