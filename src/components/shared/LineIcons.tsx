/**
 * Thin-stroke line icons drawn on a 32×32 grid. Single stroke, no fills — they
 * read as engraving, not UI. `currentColor` lets each inherit the accent.
 */

import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  width: 32,
  height: 32,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconCalendar(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="5" y="7" width="22" height="20" rx="2" />
      <path d="M5 12h22M10 4v5M22 4v5" />
      <path d="M11 17h2M15 17h2M19 17h2M11 22h2M15 22h2" />
    </svg>
  );
}

export function IconReel(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="5" y="6" width="22" height="20" rx="3" />
      <path d="M5 12h22M11 6l3 6M18 6l3 6" />
      <path d="M14 16.5v5l4.5-2.5z" />
    </svg>
  );
}

export function IconCaption(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M6 9h20M6 14h20M6 19h14M6 24h9" />
    </svg>
  );
}

export function IconCampaign(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M6 13v6l3 1V12z" />
      <path d="M9 12l12-5v18l-12-5" />
      <path d="M9 20l1.5 5h2.5l-1.5-5" />
      <path d="M24 13c1.5 0 2.5 1.3 2.5 3s-1 3-2.5 3" />
    </svg>
  );
}

export function IconOptimise(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M5 23c4-1 6-8 9-8s4 4 7 1 5-9 5-9" />
      <path d="M22 6h4v4" />
    </svg>
  );
}

export function IconReport(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="7" y="4" width="18" height="24" rx="2" />
      <path d="M11 10h10M11 14h10" />
      <path d="M12 22v-3M16 22v-6M20 22v-4" />
    </svg>
  );
}
