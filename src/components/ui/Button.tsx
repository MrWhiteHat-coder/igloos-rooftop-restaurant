import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "gold" | "outline" | "ghost" | "espresso";
type Size = "md" | "sm" | "lg";

const base =
  "inline-flex items-center justify-center gap-3 font-body text-[0.72rem] font-medium uppercase tracking-[0.22em] transition-all duration-300 disabled:opacity-45 disabled:cursor-not-allowed";

const styles: Record<Variant, string> = {
  gold:
    "bg-brass text-forest px-8 py-4 hover:bg-brass-2 hover:px-10",
  outline:
    "border border-ivory/40 text-ivory px-8 py-4 hover:border-brass hover:text-brass",
  ghost:
    "text-ivory px-2 py-1 hover:text-brass border-b border-transparent hover:border-brass/60",
  espresso:
    "bg-espresso text-ivory px-8 py-4 hover:bg-espresso/90",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.65rem]",
  md: "",
  lg: "px-10 py-5",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "gold", size = "md", loading, className = "", children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${base} ${styles[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent"
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
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ to, variant = "gold", size = "md", className = "", children }: ButtonLinkProps) {
  return (
    <Link to={to} className={`${base} ${styles[variant]} ${sizes[size]} ${className}`}>
      {children}
    </Link>
  );
}

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
  size?: Size;
  className?: string;
  children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
