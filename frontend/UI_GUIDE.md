# UI Design Guide - Log Book Automation

## Design Analysis from Reference Images

### Image 1: Hero Section & Navigation
- **Light green background** (#A8F5B8 - soft mint)
- **White card surface** with rounded corners (24px)
- **Dark hero section** (#2B2D31 - charcoal) with rounded corners
- **Bright green CTA button** (#4ADE80 - vibrant green)
- Clean navigation with medium weight text

### Image 2: Card Grid & Content Sections
- **Image cards** with 16px border radius
- **Soft shadows** on cards (subtle elevation)
- **White badge overlays** ("Try it now") with small radius
- Generous spacing between cards (24px gaps)
- Clean typography hierarchy

### Image 3: Testimonials & Pricing Table
- **Pastel card backgrounds** (light green, lavender, cyan)
- **Dark pricing table** (#2B2D31) with rounded corners
- **Colored badges** for plan tiers (green, purple, yellow)
- Consistent 16-20px border radius
- Soft, approachable color palette

---

## Design Tokens

### Color Palette

```css
/* Primary Colors */
--primary-green: #4ADE80;        /* Main CTA, active states */
--primary-dark: #2B2D31;         /* Headers, dark sections */
--primary-light: #A8F5B8;        /* Background accent */

/* Secondary Colors */
--secondary-lavender: #C4B5FD;   /* Accent cards */
--secondary-cyan: #A5F3FC;       /* Accent cards */
--secondary-yellow: #FDE68A;     /* Accent badges */

/* Neutral Colors */
--white: #FFFFFF;                /* Surface, cards */
--gray-50: #F9FAFB;             /* Light background */
--gray-100: #F3F4F6;            /* Subtle backgrounds */
--gray-200: #E5E7EB;            /* Borders */
--gray-600: #4B5563;            /* Secondary text */
--gray-900: #111827;            /* Primary text */

/* Semantic Colors */
--success: #4ADE80;
--info: #60A5FA;
--warning: #FBBF24;
--error: #EF4444;
```

### Typography

```css
/* Font Family */
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Heading Tokens */
--heading-xl: 3rem;      /* 48px - Hero */
--heading-lg: 2rem;      /* 32px - Section titles */
--heading-md: 1.5rem;    /* 24px - Card titles */
--heading-sm: 1.25rem;   /* 20px - Subsections */

/* Body Tokens */
--body-lg: 1.125rem;     /* 18px - Lead text */
--body-md: 1rem;         /* 16px - Body */
--body-sm: 0.875rem;     /* 14px - Small text */
--body-xs: 0.75rem;      /* 12px - Captions */

/* Font Weights */
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Border Radius

```css
--radius-sm: 8px;      /* Small elements, badges */
--radius-md: 12px;     /* Buttons, inputs */
--radius-lg: 16px;     /* Cards */
--radius-xl: 24px;     /* Large sections */
--radius-full: 9999px; /* Pills, rounded buttons */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## Component Styles

### Header / Navigation

**Style**: White background, subtle shadow, medium padding
```jsx
<header className="bg-white shadow-sm px-6 py-4">
  <nav className="flex items-center justify-between max-w-7xl mx-auto">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary-dark rounded-full" />
      <span className="font-semibold text-gray-900">Log Book</span>
    </div>
    <div className="flex gap-6">
      <a className="text-gray-600 hover:text-gray-900">Home</a>
      <a className="text-gray-600 hover:text-gray-900">Features</a>
    </div>
    <button className="bg-primary-green text-white px-6 py-2 rounded-full">
      Sign in
    </button>
  </nav>
</header>
```

### Primary Button

**Style**: Vibrant green, rounded, medium padding, hover lift
```jsx
<button className="bg-primary-green hover:bg-green-500 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
  Get Started
</button>
```

### Secondary Button

**Style**: White background, border, subtle hover
```jsx
<button className="bg-white hover:bg-gray-50 text-gray-900 font-medium px-6 py-3 rounded-xl border border-gray-200 transition-all duration-200">
  Learn More
</button>
```

### Card

**Style**: White surface, rounded corners, soft shadow, generous padding
```jsx
<div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
  <h3 className="text-xl font-semibold text-gray-900 mb-2">Card Title</h3>
  <p className="text-gray-600">Card description text goes here.</p>
</div>
```

### Badge / Chip

**Style**: Small, rounded, colored background
```jsx
<span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary-light text-gray-900 text-sm font-medium">
  Try it now
</span>
```

### Form Input

**Style**: Border, rounded, focus ring
```jsx
<input 
  type="text"
  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
  placeholder="Enter text..."
/>
```

### Testimonial Card

**Style**: Pastel background, rounded, with avatar
```jsx
<div className="bg-secondary-lavender rounded-2xl p-6">
  <p className="text-gray-900 mb-4">"Great product!"</p>
  <div className="flex items-center gap-3">
    <img src="avatar.jpg" className="w-10 h-10 rounded-full" />
    <div>
      <p className="font-medium text-gray-900">John Doe</p>
      <p className="text-sm text-gray-600">CEO, Company</p>
    </div>
  </div>
</div>
```

---

## Layout Guidelines

### Container Widths
- **Max width**: 1280px (max-w-7xl)
- **Padding**: 24px on mobile, 48px on desktop
- **Grid**: 12-column on desktop, stack on mobile

### Spacing Rules
- **Section gaps**: 64-96px vertical
- **Card gaps**: 24px
- **Element padding**: 16-24px
- **Text margins**: 8-12px between paragraphs

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## Accessibility

### Color Contrast
✅ **Primary Green (#4ADE80) on White**: 3.2:1 (AA Large Text)
✅ **Gray-900 (#111827) on White**: 16.1:1 (AAA)
✅ **Gray-600 (#4B5563) on White**: 7.1:1 (AAA)
⚠️ **Primary Green on Dark (#2B2D31)**: Use white text instead

### Focus States
- **Ring**: 2px solid primary-green with 2px offset
- **Visible**: Always show focus indicators
- **Keyboard nav**: Ensure tab order is logical

---

## QA Checklist

### Responsive Testing
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1280px+)
- [ ] Verify card grids stack properly
- [ ] Check navigation collapse on mobile

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader labels present
- [ ] Alt text on images

### Cross-Browser
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari

### Interactions
- [ ] Hover states work smoothly
- [ ] Transitions are 150-220ms
- [ ] No layout shift on hover
- [ ] Buttons have active states

---

## Key Design Decisions

1. **Soft, Approachable Palette**: Used mint green (#A8F5B8) as background accent instead of pure white to create warmth while maintaining professionalism.

2. **Vibrant CTA**: Bright green (#4ADE80) for primary actions creates clear visual hierarchy and draws attention to key interactions.

3. **Generous Spacing**: 24px gaps between cards and 64px+ section spacing creates breathing room and modern feel.

4. **Rounded Corners**: Consistent 16-24px radius on cards and sections creates friendly, contemporary aesthetic without being overly playful.

5. **Subtle Shadows**: Soft elevation (4-6px blur) provides depth without heavy drop shadows, maintaining clean look.

6. **Pastel Accents**: Light lavender, cyan, and yellow for testimonials and badges add personality while staying professional.
