import type { IconName } from "@/lib/types";

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}

/** Minimal stroke icon set (Lucide-style, hand-tuned) */
const paths: Record<IconName, React.ReactNode> = {
  tank: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10h16" />
      <path d="M12 6V3" />
    </>
  ),
  pool: (
    <>
      <path d="M2 16c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2" />
      <path d="M2 20c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2" />
      <path d="M7 14V5a2 2 0 0 1 4 0v9" />
      <path d="M13 12V5a2 2 0 0 1 4 0v6" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 4.5-9 4.5L3 7.5 12 3Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17 9 4.5L21 17" />
    </>
  ),
  droplet: <path d="M12 3c3.5 4.5 6 7.4 6 10.5a6 6 0 0 1-12 0C6 10.4 8.5 7.5 12 3Z" />,
  leaf: (
    <>
      <path d="M5 20C5 10 12 4 21 3c0 9-5 15-16 17Z" />
      <path d="M5 20c3-4.5 7-8 12-11" />
    </>
  ),
  tool: (
    <>
      <path d="M14.5 5.5a4 4 0 0 0 5 5L21 9l-6-6-1.5 1.5Z" />
      <path d="m13 8-9 9a2.1 2.1 0 0 0 3 3l9-9" />
    </>
  ),
  bucket: (
    <>
      <path d="M4 8h16l-1.7 12.3a2 2 0 0 1-2 1.7H7.7a2 2 0 0 1-2-1.7L4 8Z" />
      <path d="M8 8a4 4 0 0 1 8 0" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5 9.5A2 2 0 0 0 6.8 21h10.4a2 2 0 0 0 1.8-2.5L14 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7" />
    </>
  ),
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" />
      <path d="M8.8 8.5c.3-.6.6-.6.9-.6h.6c.2 0 .5 0 .7.5l.7 1.7c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.4 0 .7.4.7 1.2 1.5 2 1.9.3.2.5.1.7 0l.6-.6c.2-.2.4-.2.7-.1l1.6.8c.3.2.4.4.4.6 0 .8-.6 1.5-1.4 1.6-.6.1-1.4.2-3.4-.7-1.9-.8-3.2-2.7-3.4-3.6-.2-.9-.1-1.7.4-2.4Z" />
    </>
  ),
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="m13 5 7 7-7 7" />
    </>
  ),
  arrowUp: (
    <>
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 8 5-5 5 5" />
      <path d="M12 3v12" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
      <path d="M14 2v6h6" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-4.5-4.5L6 21" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
      <path d="M10 21v-3h4v3" />
    </>
  ),
  filter: <path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3Z" />,
  star: <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6L12 17l-5.4 2.7 1.1-6L3.2 9.4l6.1-.8L12 3Z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1" />
      <path d="M16 4.5a4 4 0 0 1 0 7" />
      <path d="M18 14.5a6 6 0 0 1 4 5.5V21" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  ruler: (
    <>
      <rect x="2" y="16" width="20" height="5" rx="1" transform="rotate(-45 2 16)" />
      <path d="m7 14 2 2M10 11l2 2M13 8l2 2" />
    </>
  ),
  truck: (
    <>
      <rect x="1" y="6" width="14" height="10" rx="1" />
      <path d="M15 10h4l3 3.5V16h-7" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10.5V17M8 7.2v.1M12 17v-4a2.5 2.5 0 0 1 5 0v4" />
    </>
  ),
  facebook: <path d="M14.5 8.5H17V5h-2.5A4 4 0 0 0 10.5 9v2H8v3.5h2.5V21H14v-6.5h2.5l.5-3.5H14V9.2c0-.4.2-.7.5-.7Z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5v.1" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="m10.5 9.5 5 2.5-5 2.5v-5Z" />
    </>
  ),
  twitter: <path d="M4 4l7.2 9.2L4.6 20h2.2l5.5-5.7L16.8 20H20l-7.5-9.6L18.9 4h-2.2l-4.9 5.2L8 4H4Z" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </>
  ),
};

export default function Icon({ name, className = "w-5 h-5", strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
