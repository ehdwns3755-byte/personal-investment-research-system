# CSS Classes Reference - Issue #5 Refactoring

## Overview

This document lists all 20 CSS classes created during the inline CSS refactoring of `investment-system.html`.

## Utility Classes

### Margin Bottom Utilities
- `.mb-20` - Margin bottom 20px
- `.mb-10` - Margin bottom 10px  
- `.mb-30` - Margin bottom 30px

### Margin Top Utilities
- `.mt-20` - Margin top 20px
- `.mt-30` - Margin top 30px
- `.mt-10` - Margin top 10px

### Margin Utilities (shorthand)
- `.m-10-0` - Margin 10px 0

### Font Size Utilities
- `.fs-12` - Font size 12px
- `.fs-14` - Font size 14px
- `.fs-16` - Font size 16px

### Color Utilities
- `.c-999` - Color #999
- `.c-666` - Color #666
- `.c-error` - Color #C62828 (red/error)
- `.c-primary` - Color #1976D2 (blue/primary)

### Layout & Display Utilities
- `.ta-center` - Text align center
- `.p-40` - Padding 40px
- `.fw-bold` - Font weight bold

## Component-Specific Classes

### Description Section
- `.desc-section` - Container for description sections (margin: 10px 0)
- `.desc-title` - Title within description (font-size: 12px)

### Empty State
- `.empty-container` - Container for empty state (centered, 40px padding, gray text)
- `.empty-message` - Empty state message (font-size: 16px, margin-bottom: 10px)
- `.empty-guide` - Empty state guide text (font-size: 14px)

### Portfolio Tab
- `.portfolio-tab-title` - Portfolio tab title (margin-bottom: 20px)
- `.portfolio-count` - Portfolio item count display (margin-bottom: 20px, gray color, 14px font)

### Learn Tab
- `.learn-tab-title` - Learn tab title (margin-bottom: 20px)
- `.learn-description` - Learn tab description (margin-bottom: 20px, gray color, 14px font)
- `.advice-box` - Advice box container (margin-top: 30px)

### Learning Content
- `.learning-list` - List in learning content (margin-left: 20px, margin-bottom: 10px)
- `.warning-text` - Warning text styling (color: #C62828, bold)
- `.gold-rule-text` - Gold rule/important text (color: #1976D2, bold)

## Usage Examples

### Basic Margin
```html
<h2 class="mb-20">Title with bottom margin</h2>
<div class="mt-10">Content with top margin</div>
```

### Font and Color
```html
<p class="fs-14 c-666">Gray text, 14px font size</p>
<span class="c-error fw-bold">Red bold text</span>
```

### Component Styling
```html
<div class="empty-container">
  <p class="empty-message">No items found</p>
  <p class="empty-guide">Add an item to get started</p>
</div>
```

### Multiple Classes
```html
<button class="fw-bold c-primary ta-center">Button</button>
<div class="learning-list">
  <li>Item 1</li>
  <li>Item 2</li>
</div>
```

## CSS Class Definitions

All classes are defined in the `<style>` block starting at line 335 of investment-system.html.

### Full CSS Listing

```css
/* Margin utilities */
.mb-20 { margin-bottom: 20px; }
.mb-10 { margin-bottom: 10px; }
.mb-30 { margin-bottom: 30px; }
.mt-20 { margin-top: 20px; }
.mt-30 { margin-top: 30px; }
.mt-10 { margin-top: 10px; }
.m-10-0 { margin: 10px 0; }

/* Font size utilities */
.fs-12 { font-size: 12px; }
.fs-14 { font-size: 14px; }
.fs-16 { font-size: 16px; }

/* Color utilities */
.c-999 { color: #999; }
.c-666 { color: #666; }
.c-error { color: #C62828; }
.c-primary { color: #1976D2; }

/* Layout utilities */
.ta-center { text-align: center; }
.p-40 { padding: 40px; }
.fw-bold { font-weight: bold; }

/* Description section */
.desc-section { margin: 10px 0; }
.desc-title { font-size: 12px; }

/* Empty state */
.empty-container {
  text-align: center;
  padding: 40px;
  color: #999;
}

.empty-message {
  font-size: 16px;
  margin-bottom: 10px;
}

.empty-guide {
  font-size: 14px;
}

/* Portfolio tab */
.portfolio-tab-title { margin-bottom: 20px; }
.portfolio-count {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

/* Learn tab */
.learn-tab-title { margin-bottom: 20px; }
.learn-description {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}
.advice-box { margin-top: 30px; }

/* Learning content */
.learning-list { margin-left: 20px; margin-bottom: 10px; }
.warning-text { color: #C62828; font-weight: bold; }
.gold-rule-text { color: #1976D2; font-weight: bold; }
```

## Naming Conventions

### Margin Utilities
- `m[direction]-[pixels]`
- Examples: `mb-20` (margin-bottom 20px), `mt-10` (margin-top 10px)

### Font Size Utilities
- `fs-[pixels]`
- Examples: `fs-12`, `fs-14`, `fs-16`

### Color Utilities
- `c-[name/code]`
- Examples: `c-999`, `c-error`, `c-primary`

### General Utilities
- `[property]-[value]`
- Examples: `ta-center` (text-align center), `fw-bold` (font-weight bold)

### Component Classes
- `.component-purpose`
- Examples: `portfolio-tab-title`, `empty-container`, `learning-list`

## Migration Guide

### Before (Inline Styles)
```javascript
const element = document.createElement('div');
element.style.marginBottom = '20px';
element.style.color = '#666';
element.style.fontSize = '14px';
```

### After (CSS Classes)
```javascript
const element = document.createElement('div');
element.className = 'mb-20 c-666 fs-14';
```

## Benefits

1. **Maintainability** - All styles in one place (CSS block)
2. **Reusability** - Classes can be combined for multiple elements
3. **Consistency** - Shared values (20px spacing, #666 color)
4. **Performance** - CSS is cached separately from JavaScript
5. **Readability** - Class names are more descriptive than inline style values

## Future Improvements

Consider extending these utilities with:
- Responsive variants: `mb-20-sm`, `mb-30-lg`
- State variants: `hover:c-primary`, `focus:fw-bold`
- Custom themes: `c-success`, `c-warning`, `c-info`
- Animation classes: `fade-in`, `slide-up`

## Questions?

Refer to the main refactoring report for detailed information about this CSS refactoring implementation.
