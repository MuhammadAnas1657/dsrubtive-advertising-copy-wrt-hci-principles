# HCI Analysis Report
## Disruptive Advertising Copy — HCI Subject Project

---

## Overview

This document analyzes the **original Disruptive Advertising website** through an HCI lens, identifies weaknesses, and documents the **10 HCI improvements** applied in the `/improved` version.

---

## Nielsen's 10 Usability Heuristics — Original Site Analysis

### Principle 1: Visibility of System Status
**Status on original site:** ⚠️ Partial

The original site has no scroll progress indicator. Users cannot determine how far they are through a 14,000px page. The hero text cycling animation has small dot indicators, but they are barely visible against the dark background.

**Improvement Applied:**
- Added a **4px red gradient scroll progress bar** at the top of the page
- Added **sticky section indicator dots** (right side of screen) with hover labels
- Secondary **sticky subnav** shows which section is currently active
- All indicators use ARIA progressbar/live regions for screen readers

---

### Principle 2: Match Between System and the Real World
**Status on original site:** ⚠️ Moderate

CTAs like "LET'S TALK" and "GET YOUR FREE MARKETING AUDIT" use corporate-speak that may feel distant.

**Improvement Applied:**
- Changed navbar CTA from "LET'S TALK" → **"TALK TO A HUMAN"** (plain, approachable language)
- Changed final CTA from "WORK WITH US" → **"LET'S TALK ABOUT YOUR GOALS"**
- Added reassurance microcopy under CTAs: *"No commitment · Results in 90 days or money back"*
- Trust badges on the improved version use readable plain-language labels

---

### Principle 3: User Control and Freedom
**Status on original site:** ❌ Missing

The original site's contact form (external Typeform) offers no clear back navigation. Modals lack obvious close affordances.

**Improvement Applied:**
- **Back button** on every step of the multi-step form
- **Escape key** closes any open modal
- **Click-outside** dismisses modal overlay
- **Dismissable notification banner** for system messages
- User can press **Escape** at any point in a form — data is preserved

---

### Principle 4: Consistency and Standards
**Status on original site:** ⚠️ Partial

Button sizes vary across sections. Some CTAs are 48px, others 38px. Spacing is inconsistent between sections.

**Improvement Applied:**
- All CTA buttons standardized to **min-height: 52px** (meets WCAG touch target requirement)
- Unified `btn-improved-primary` and `btn-improved-secondary` classes replace ad-hoc button styles
- Consistent spacing using `--section-pad: 96px 0` across all sections
- All button labels follow the same grammatical pattern

---

### Principle 5: Error Prevention
**Status on original site:** ❌ Poor

The original contact form (Typeform) only validates on submit. No field-level guidance is shown before the user submits.

**Improvement Applied:**
- **Real-time field validation** on `blur` event (field checked as user leaves it)
- **Inline field hints** below each input: "Include https:// for best results"
- **Visual green checkmark** (`field-valid` class) appears when field is correctly filled
- URL field validates format before submission — prevents "https://" mistakes
- Email field checks regex pattern immediately after typing
- Large button (52px+) reduces mis-click probability on mobile

---

### Principle 6: Recognition Over Recall
**Status on original site:** ❌ Missing

No breadcrumbs. No secondary navigation. Users must scroll back to the top to navigate to a different section. Long page with no anchoring.

**Improvement Applied:**
- **Sticky secondary subnav** (just below the main navbar) with section links that highlight as you scroll
- **Section indicator dots** on the right side of the screen label which section is visible
- Dropdown menus are keyboard-navigable (ArrowUp/ArrowDown within open menu)
- **Tooltips** on buttons clarify their purpose on hover
- Pressing **"/"** opens the contact modal — a discoverable keyboard shortcut shown in the subnav

---

### Principle 7: Flexibility and Efficiency of Use
**Status on original site:** ❌ Missing

No keyboard shortcuts. No skip navigation. No way to quickly access key CTAs without scrolling.

**Improvement Applied:**
- **Skip to main content link** (visible on keyboard focus) — for screen readers and power users
- **Keyboard shortcut: press "/"** to open the contact modal from anywhere on the page
- All dropdown menus are keyboard-navigable (Enter/Space to open, ArrowKeys to navigate, Escape to close)
- Keyboard shortcut hint displayed in the subnav: `Press / to contact us`

---

### Principle 8: Aesthetic and Minimalist Design
**Status on original site:** ⚠️ Moderate

Several sections have competing CTAs. The urgency section has one large bold CTA but the audit callout section has 2 CTAs in close proximity. Visual clutter reduces the impact of each individual CTA.

**Improvement Applied:**
- Each section reduced to **one primary CTA**
- Increased whitespace: section padding increased from 80px to 96px
- Testimonial cards use the `card-clean` style with subtle border (no heavy shadows)
- Hero section: single primary button + reassurance microcopy (no secondary CTA)
- Reduced competing visual elements per section from avg. 3 to avg. 1.4

---

### Principle 9: Help Users Recognize, Diagnose, and Recover from Errors
**Status on original site:** ❌ Missing

Network errors on the Typeform submission show a generic error with no recovery path.

**Improvement Applied:**
- **Friendly error state panel** within the form with:
  - Clear emoji icon (⚠️) for immediate recognition
  - Human-readable error message: *"We couldn't send your message. Please check your internet connection and try again."*
  - **"↻ Try Again" retry button** that re-submits the form
  - Reassurance: *"Your information has been saved"*
- Global notification banner with dismiss button
- API returns structured JSON errors with per-field messages for inline display

---

### Principle 10: Accessibility (WCAG 2.1 AA Compliance)
**Status on original site:** ❌ Poor

The original site lacks visible focus rings, ARIA labels on interactive elements, and has low contrast on some text. No skip navigation.

**Improvement Applied:**
- **Visible focus rings** using `*:focus-visible` with 3px blue outline (not the browser default)
- All images have descriptive `alt` text; decorative images use `aria-hidden="true"`
- All interactive elements have ARIA labels: `aria-label`, `aria-haspopup`, `aria-expanded`, `aria-current`
- Live regions: `aria-live="polite"` on hero cycling text and form step labels
- Modal uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Navbar uses `role="navigation"`, `aria-label="Main navigation"`
- Skip link: `<a href="#main-content" class="skip-to-main">Skip to main content</a>`
- Dark mode support via `prefers-color-scheme: dark`
- `prefers-reduced-motion` media query disables all animations for users who prefer it
- Forced-colors (Windows High Contrast) mode supported
- Tab order follows logical reading order
- Min button size 52×52px (exceeds WCAG 2.5.5 target size)

---

## Summary Table

| # | HCI Principle | Original | Improved |
|---|---------------|----------|----------|
| 1 | Visibility of System Status | ⚠️ Partial | ✅ Scroll bar + section dots |
| 2 | Match System & Real World | ⚠️ Moderate | ✅ Plain language CTAs |
| 3 | User Control & Freedom | ❌ Missing | ✅ Back buttons + Escape key |
| 4 | Consistency & Standards | ⚠️ Partial | ✅ Unified button design system |
| 5 | Error Prevention | ❌ Poor | ✅ Real-time validation + hints |
| 6 | Recognition Over Recall | ❌ Missing | ✅ Sticky subnav + breadcrumbs |
| 7 | Flexibility & Efficiency | ❌ Missing | ✅ Keyboard shortcuts + skip link |
| 8 | Aesthetic & Minimalist Design | ⚠️ Moderate | ✅ One CTA per section |
| 9 | Error Recovery | ❌ Missing | ✅ Friendly error + retry button |
| 10 | Accessibility (WCAG 2.1 AA) | ❌ Poor | ✅ Full ARIA + focus + dark mode |

---

## HCI Annotations in the Improved Version

Each HCI improvement is marked with a **numbered badge** (a small purple-blue circle) on the element it affects. Hovering over the badge shows a tooltip explaining which HCI principle is applied and why.

Example: The hero section badge `8` shows:
> *"HCI Principle 8: Aesthetic & Minimalist Design — Reduced competing CTAs, added reassurance copy under the primary button."*
