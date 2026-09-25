// Shared domain types — Al Muraqib v2 frontend
export type Locale = "en" | "ar";

/** Localized string: value per locale */
export type L = Record<Locale, string>;

export interface NavItem {
  href: string;
  label: L;
  children?: NavItem[];
  external?: boolean;
}

export interface MegaColumn {
  eyebrow: L;
  title: L;
  desc: L;
  links: { label: L; href: string }[];
  viewAll?: { label: L; href: string };
}

export interface ProductGroup {
  slug: string;
  name: L;
  short: L;
  description: L;
  icon: IconName;
}

export interface GalleryItem {
  kind: "product" | "installed" | "drawing";
  caption: L;
}

export interface VariantAxis {
  id: string;
  label: L;
  options: { id: string; label: L; note?: L }[];
}

export interface SpecRow {
  key: L;
  value: L;
}

export interface SpecGroup {
  name: L;
  rows: SpecRow[];
}

export interface Product {
  slug: string;
  group: string;
  featured?: boolean;
  name: L;
  pitch: L;
  description: L[];
  keyFeatures: L[];
  specGroups: SpecGroup[];
  applications: string[]; // application slugs
  attributes: SpecRow[];
  faqs: { q: L; a: L }[];
  gallery: GalleryItem[];
  variantAxes?: VariantAxis[];
  keyFacts: { label: L; value: L }[];
  relatedProducts: string[];
  boughtWith: string[];
  // facets
  technology: string; // hot-press | cold-press | hand-layup
  sizeBuckets: string[]; // compact | medium | large
  insulation: "insulated" | "non-insulated" | "n/a";
  certifications: string[]; // dm | esma | iso
}

export interface Application {
  slug: string;
  name: L;
  icon: IconName;
}

export interface Project {
  slug: string;
  title: L;
  sector: string;
  location: L;
  year: string;
  products: string[]; // product slugs
  scope: L;
  challenge: L;
  solution: L;
  result: L;
}

export interface Article {
  slug: string;
  kind: "blog" | "kb";
  category: L;
  title: L;
  excerpt: L;
  date: string;
  readingMinutes: number;
  relatedProducts: string[];
  body: string[]; // paragraphs (EN; AR falls back)
}

export interface Certification {
  code: string;
  title: L;
  issuer: L;
  validity: L;
}

export interface RfqPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  products: string[];
  sector: string;
  stage: string;
  location: string;
  deadline: string;
  notes: string;
  files: string[];
  locale: Locale;
  sourceUrl: string;
}

export type IconName =
  | "tank"
  | "pool"
  | "layers"
  | "droplet"
  | "leaf"
  | "tool"
  | "bucket"
  | "flask"
  | "shield"
  | "award"
  | "phone"
  | "mail"
  | "whatsapp"
  | "chat"
  | "search"
  | "menu"
  | "close"
  | "chevronDown"
  | "chevronRight"
  | "arrowRight"
  | "arrowUp"
  | "download"
  | "upload"
  | "check"
  | "checkCircle"
  | "file"
  | "image"
  | "calendar"
  | "pin"
  | "building"
  | "filter"
  | "star"
  | "users"
  | "globe"
  | "clock"
  | "ruler"
  | "truck"
  | "eye"
  | "share"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "youtube"
  | "twitter"
  | "plus"
  | "minus"
  | "external";
