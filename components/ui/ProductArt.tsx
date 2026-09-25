import Icon from "./Icon";
import { artGradient, cn } from "@/lib/utils";
import type { IconName } from "@/lib/types";

/**
 * Deterministic placeholder artwork — stands in for client photography.
 * Renders a branded gradient tile with the product/group icon.
 */
export default function ProductArt({
  seed,
  icon,
  label,
  kind = "product",
  className,
  priority,
}: {
  seed: string;
  icon: IconName;
  label?: string;
  kind?: "product" | "installed" | "drawing";
  className?: string;
  priority?: boolean;
}) {
  void priority;
  const pattern =
    kind === "drawing"
      ? "opacity-[0.25] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:24px_24px]"
      : kind === "installed"
        ? "opacity-[0.12] bg-[radial-gradient(circle_at_80%_20%,white_0,transparent_60%)]"
        : "opacity-[0.10] bg-[radial-gradient(circle_at_20%_80%,white_0,transparent_55%)]";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br text-white select-none",
        artGradient(seed),
        className
      )}
      role="img"
      aria-label={label || seed}
    >
      <div className={cn("absolute inset-0", pattern)} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
        <span className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/20">
          <Icon name={icon} className="w-10 h-10 md:w-12 md:h-12 text-gold-400" strokeWidth={1.4} />
        </span>
        {label && (
          <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.18em] text-white/85 max-w-[85%] leading-snug">
            {label}
          </span>
        )}
      </div>
      <span className="absolute bottom-3 inset-x-0 text-center text-[9px] tracking-[0.3em] uppercase text-white/40">
        Al Muraqib
      </span>
    </div>
  );
}
