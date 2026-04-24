/**
 * SA FIELD Design System
 *
 * 이 파일은 프로젝트 전체에서 사용되는 디자인 토큰을 정의합니다.
 */

// ============================================================================
// BREAKPOINTS (반응형 디자인)
// ============================================================================
export const breakpoints = {
  // Desktop
  desktop: {
    large: 1920, // Desktop Large
    medium: 1440, // Desktop Medium
  },
  // Tablet
  tablet: {
    large: 1080, // Tablet Large
    medium: 800,  // Tablet Medium
  },
  // Mobile
  mobile: {
    max: 799, // Mobile (< 800px)
  },
} as const;

// Tailwind 스타일 브레이크포인트 객체
export const tailwindBreakpoints = {
  'mobile': `${breakpoints.mobile.max}px`,
  'tablet': `${breakpoints.tablet.medium}px`,
  'tablet-lg': `${breakpoints.tablet.large}px`,
  'desktop': `${breakpoints.desktop.medium}px`,
  'desktop-lg': `${breakpoints.desktop.large}px`,
} as const;

// ============================================================================
// TYPOGRAPHY (타이포그래피)
// ============================================================================
export const typography = {
  // Font Families
  fontFamily: {
    sans: 'var(--font-pretendard), -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    display: 'var(--font-pretendard), sans-serif',
  },

  // Font Sizes (반응형 고려)
  fontSize: {
    // Display
    'display-lg': ['4rem', { lineHeight: '1.1', fontWeight: '900' }],      // 64px
    'display-md': ['3rem', { lineHeight: '1.2', fontWeight: '900' }],      // 48px
    'display-sm': ['2.5rem', { lineHeight: '1.2', fontWeight: '800' }],    // 40px

    // Headings
    'h1': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],              // 32px
    'h2': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],           // 28px
    'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],            // 24px
    'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],           // 20px
    'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],          // 18px
    'h6': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],              // 16px

    // Body
    'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],     // 18px
    'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],            // 16px
    'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],     // 14px

    // Utility
    'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],      // 12px
    'overline': ['0.625rem', { lineHeight: '1.6', fontWeight: '700', letterSpacing: '0.1em' }], // 10px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line Heights
  lineHeight: {
    tight: 1.1,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
} as const;

// ============================================================================
// SPACING (간격 시스템)
// ============================================================================
export const spacing = {
  // Base spacing unit: 4px (0.25rem)
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
} as const;

// ============================================================================
// SHADOWS (그림자 / Elevation)
// ============================================================================
export const shadows = {
  // Elevation Levels
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

  // Brand shadows (with brand color)
  'brand-sm': '0 2px 4px 0 rgba(232, 163, 61, 0.1)',
  'brand-md': '0 4px 8px 0 rgba(232, 163, 61, 0.15)',
  'brand-lg': '0 8px 16px 0 rgba(232, 163, 61, 0.2)',
} as const;

// ============================================================================
// BORDER RADIUS (모서리 둥글기)
// ============================================================================
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // 완전한 원형
} as const;

// ============================================================================
// Z-INDEX (계층 구조)
// ============================================================================
export const zIndex = {
  // Base layers
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,

  // Specific components
  navbar: 50,
  sidebar: 40,
  footer: 10,
  heroImage: 1,
  overlay: 1045,
} as const;

// ============================================================================
// TRANSITIONS & ANIMATIONS (전환 및 애니메이션)
// ============================================================================
export const transitions = {
  // Duration
  duration: {
    fast: '150ms',
    base: '200ms',
    medium: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  // Timing functions
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Common transitions
  all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'background-color 200ms, color 200ms, border-color 200ms',
  transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================================================
// LAYOUT (레이아웃)
// ============================================================================
export const layout = {
  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  },

  // Common heights
  height: {
    navbar: '4rem',        // 64px
    mobileNavbar: '3.5rem', // 56px
    footer: '20rem',       // 320px
    hero: {
      desktop: '600px',
      tablet: '500px',
      mobile: '400px',
    },
  },
} as const;

// ============================================================================
// EXPORT ALL
// ============================================================================
export const designSystem = {
  breakpoints,
  typography,
  spacing,
  shadows,
  borderRadius,
  zIndex,
  transitions,
  layout,
} as const;

export default designSystem;
