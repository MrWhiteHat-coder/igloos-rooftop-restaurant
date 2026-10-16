import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "gold" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-body text-sm tracking-[0.14em] uppercase transition-all duration-300 disabled:opacity-45 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  gold:
    "bg-gradient-to-b from-gold-bright to-gold-deep text-night font-semibold shadow-[0_10px_30px_-10px_rgba(207,163,90,0.55)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-gold/60 text-gold hover:bg-gold/10 hover:border-gold",
  ghost: "text-cream/80 hover:text-gold",
};

const sizes = {
  md: "px-7 py-3",
  sm: "px-4 py-2 text-xs",
  lg: "px-9 py-4",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: keyof typeof sizes;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "gold", size = "md", loading, className = "", children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";

interface ButtonLinkProps {
  to: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ to, variant = "gold", size = "md", className = "", children }: ButtonLinkProps) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </Link>
  );
}

/** External anchor styled as a button (for wa.me / maps links). */
export function ButtonAnchor({
  href,
  variant = "gold",
  size = "md",
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
