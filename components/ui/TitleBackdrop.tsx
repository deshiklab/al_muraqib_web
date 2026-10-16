import { cn } from "@/lib/utils";

const base = process.env.NEXT_PUBLIC_BASE ?? "";

/**
 * Page-title hero backdrop: a photo layer under the existing navy scrims.
 * If the file is missing, the CSS background simply fades out and the solid
 * gradient remains — safe progressive enhancement.
 */
export default function TitleBackdrop({
  src,
  className,
  veil = "from-navy-950 via-navy-950/80 to-navy-950/50",
}: {
  src: string;
  className?: string;
  veil?: string;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn("absolute inset-0 bg-cover bg-center", className)}
        style={{ backgroundImage: `url("${base}${src}")` }}
      />
      <div aria-hidden="true" className={cn("absolute inset-0 bg-gradient-to-b", veil)} />
      <div aria-hidden="true" className="absolute inset-0 bg-navy-950/30" />
    </>
  );
}
