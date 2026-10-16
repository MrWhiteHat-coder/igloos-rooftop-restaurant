import { useEffect, type ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.32em] text-gold">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-cream/70 ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
      <div className={`hairline mt-8 text-gold ${align === "center" ? "" : "max-w-xs"}`}>◇</div>
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
    gold: "bg-gold/15 text-gold-bright border-gold/40",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    red: "bg-red-500/15 text-red-300 border-red-500/40",
    neutral: "bg-cream/10 text-cream/70 border-cream/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-cream/60" role="status">
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent"
      />
      <span className="text-sm tracking-wide">{label}…</span>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-line bg-night-2/50 p-10 text-center">
      <h3 className="font-display text-2xl text-cream">{title}</h3>
      {children && <div className="mt-3 text-sm text-cream/60">{children}</div>}
    </div>
  );
}

export function ConfigNotice() {
  return (
    <div
      className="rounded-2xl border border-gold/40 bg-gold/10 p-6 text-center text-sm text-cream/80"
      role="status"
    >
      <strong className="text-gold-bright">Configuration required.</strong> The Supabase
      environment variables are not set on this deployment, so live data cannot be displayed.
      See <code className="text-gold">.env.example</code> and{" "}
      <code className="text-gold">docs/SETUP.md</code> for the exact steps.
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-[fade-in_.2s_ease-out]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold/30 bg-night-2 p-8 shadow-card animate-[fade-up_.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl text-cream">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-2 text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
