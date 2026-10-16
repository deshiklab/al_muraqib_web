import Link from "next/link";
import type { IconName } from "@/lib/types";
import Icon from "./Icon";
import { cn } from "@/lib/utils";

type Variant = "gold" | "navy" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconPos?: "start" | "end";
  className?: string;
  children: React.ReactNode;
}

const styles: Record<Variant, string> = {
  gold: "bg-gold-500 text-navy-950 hover:bg-gold-600 hover:text-white shadow-sm",
  navy: "bg-navy-900 text-white hover:bg-brand-700",
  outline:
    "border-2 border-navy-900/15 text-navy-900 hover:border-brand-700 hover:text-brand-700 bg-white",
  ghost: "text-navy-900 hover:text-brand-700",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5b]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

function inner(props: BaseProps) {
  const { variant = "navy", size = "md", icon, iconPos = "end", className, children } = props;
  const iconNode = icon ? <Icon name={icon} className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} /> : null;
  return (
    <>
      {iconPos === "start" && iconNode}
      {children}
      {iconPos === "end" && iconNode}
    </>
  );
}

export function Button({
  variant = "navy",
  size = "md",
  icon,
  iconPos = "end",
  className,
  children,
  ...rest
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center rounded-[10px] font-semibold transition-colors duration-150 cursor-pointer",
        styles[variant],
        sizes[size],
        className
      )}
    >
      {inner({ variant, size, icon, iconPos, className, children })}
    </button>
  );
}

export function ButtonLink({
  variant = "navy",
  size = "md",
  icon,
  iconPos = "end",
  className,
  children,
  href,
  ...rest
}: BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      {...rest}
      className={cn(
        "inline-flex items-center justify-center rounded-[10px] font-semibold transition-colors duration-150",
        styles[variant],
        sizes[size],
        className
      )}
    >
      {inner({ variant, size, icon, iconPos, className, children })}
    </Link>
  );
}
