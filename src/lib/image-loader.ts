
'use client';

// This is a custom image loader for Next.js Image component.
// It's used when we are doing a static export, as the default
// Next.js image optimization requires a server. This loader
// simply returns the original image URL without optimization.
export default function customImageLoader({ src, width, quality }: { src: string, width: number, quality?: number }) {
  return `${src}?w=${width}&q=${quality || 75}`;
}
