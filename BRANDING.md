# PinDex Branding Guide

## Logo Design

### Font
- **Primary Font**: Kalam (Google Fonts)
  - Handwritten style, browser-compatible
  - Weights: 400 (regular), 700 (bold)
  - Works across all modern browsers
  - Fallback: System fonts if Google Fonts unavailable

### Logo Features
- **Gradient Text**: Pink (#ff007a) to Blue (#2172e5) gradient
- **Handwritten Style**: Slight rotation on "Pin" (-2deg) and "Dex" (+1deg)
- **Lightning Bolt**: Subtle ⚡ accent (30% opacity)
- **Tagline**: "Decentralized DEX" in uppercase system font

### Logo Sizes
- **Small**: 20px (for mobile/favicon)
- **Medium**: 32px (default, header)
- **Large**: 48px (hero sections)

## Color Palette

### Primary Colors
- **Pink**: `#ff007a` (primary accent)
- **Blue**: `#2172e5` (secondary accent)
- **Gradient**: Pink → Blue (135deg)

### UI Colors
- **Background**: `#0d0e14` (dark)
- **Surface**: `#1a1d29` (card background)
- **Text Primary**: `#ffffff` (white)
- **Text Secondary**: `#888d9b` (gray)
- **Border**: `#2c2f36` (dark gray)

## Typography

### Logo Font
- **Kalam**: Handwritten style for logo
- **System Fonts**: Fallback for tagline

### Body Font
- **Inter**: Clean, modern sans-serif
- **System Stack**: Fallback to system fonts

## Usage

### Logo Component
```tsx
import { Logo } from '@/components/Logo';

// Default (medium with tagline)
<Logo />

// Small without tagline
<Logo size="small" showTagline={false} />

// Large with tagline
<Logo size="large" showTagline={true} />
```

### Brand Name
- **Full Name**: PinDex
- **Tagline**: "Decentralized DEX"
- **Description**: "Decentralized Uniswap frontend deployed via PinMe to ENS and IPFS"

## Files Updated

### Components
- ✅ `components/Logo.tsx` - New logo component
- ✅ `components/Header.tsx` - Updated with logo
- ✅ `components/Footer.tsx` - Updated branding

### Configuration
- ✅ `app/layout.tsx` - Updated metadata and favicon
- ✅ `package.json` - Updated name and description
- ✅ `README.md` - Updated branding
- ✅ `workflow.md` - Updated project name

## Browser Compatibility

### Font Loading
- ✅ Google Fonts (primary)
- ✅ System font fallback
- ✅ Works offline (after initial load)
- ✅ No external dependencies required

### Gradient Support
- ✅ Webkit browsers (Chrome, Safari, Edge)
- ✅ Firefox
- ✅ Fallback to solid color if gradients unsupported

## Favicon

- **Format**: SVG (inline data URI)
- **Design**: "PD" initials in pink (#ff007a)
- **Size**: 100x100 viewBox
- **Compatibility**: All modern browsers

## Brand Guidelines

1. **Always use the gradient** for the logo text
2. **Maintain spacing** around the logo
3. **Use appropriate size** for context
4. **Keep tagline** when space allows
5. **Preserve handwritten style** - don't use other fonts


