/**
 * Server-safe JSON-LD injector. Renders schema.org structured data.
 * `<` is escaped so article copy can never break out of the script tag.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Absolute URL for schema image fields (crawlers ignore the Pages base path). */
export function absUrl(path?: string): string {
  if (!path) return "";
  try {
    return new URL(path, "https://almuraqib.ae").toString();
  } catch {
    return path;
  }
}
