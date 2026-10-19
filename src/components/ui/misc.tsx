import { useEffect, type ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className={`rule-note mb-6 justify-center ${align === "left" ? "" : "center"} ${isLight ? "" : ""}`}>
          <span className="eyebrow">{eyebrow}</span>
        </p>
      )}
      <h2
        className={`font-display text-[2.6rem] leading-[1.08] font-light sm:text-6xl ${
          isLight ? "text-espresso" : "text-ivory"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-6 max-w-2xl text-[0.95rem] leading-[1.85] font-light ${
            align === "center" ? "mx-auto" : ""
          } ${isLight ? "text-espresso/75" : "text-ivory/65"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone = "gold",
}: {
  children: ReactNode;
  tone?: "gold" | "green" | "red" | "neutral";
}) {
  const tones = {
    gold: "border-brass/50 text-brass-2",
    green: "border-emerald-400/40 text-emerald-200",
    red: "border-red-400/40 text-red-200",
    neutral: "border-ivory/30 text-ivory/70",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-16 text-ivory/60" role="status">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border border-brass border-t-transparent"
      />
      <span className="text-xs uppercase tracking-[0.24em]">{label}</span>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border border-ivory/15 bg-forest-2/60 p-12 text-center">
      <h3 className="font-display text-3xl font-light text-ivory">{title}</h3>
      {children && <div className="mt-4 text-sm font-light text-ivory/60">{children}</div>}
    </div>
  );
}

export function ConfigNotice() {
  return (
    <div
      className="border border-brass/40 bg-brass/10 p-8 text-center text-sm font-light text-ivory/85"
      role="status"
    >
      <strong className="text-brass-2 font-medium">Configuration required.</strong> The Supabase
      environment variables are not set on this deployment, so live data cannot be displayed. See{" "}
      <code className="text-brass-2">.env.example</code> and{" "}
      <code className="text-brass-2">docs/SETUP.md</code>.
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest/85 p-4 animate-[fade-in_.2s_ease-out] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto border border-brass/30 bg-forest-2 p-8 shadow-card animate-[fade-up_.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="font-display text-3xl font-light text-ivory">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-ivory/60 transition-colors hover:text-brass"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
