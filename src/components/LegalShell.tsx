const PROSE =
  "[&_section]:mt-14 [&_section:first-child]:mt-0 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-light [&_h2]:text-espresso [&_p]:mt-4 [&_p]:text-[0.95rem] [&_p]:font-light [&_p]:leading-[1.85] [&_p]:text-espresso/75 [&_ul]:mt-4 [&_ul]:list-none [&_ul]:space-y-2 [&_li]:text-[0.95rem] [&_li]:font-light [&_li]:leading-relaxed [&_li]:text-espresso/75 [&_li]:before:mr-3 [&_li]:before:text-brass-3 [&_li]:before:content-['·'] [&_em]:text-brass-3 [&_a]:text-brass-3 [&_a]:border-b [&_a]:border-brass-3/40";

export default function LegalShell({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <section className="bg-ivory text-espresso">
        <div className="mx-auto max-w-3xl px-5 pb-16 pt-24 sm:pt-28">
          <p className="rule-note mb-6 text-brass-3">
            <span className="eyebrow">{eyebrow}</span>
          </p>
          <h1 className="font-display text-5xl font-light leading-[1.05] sm:text-6xl">{title}</h1>
          <p className="mt-5 text-[0.72rem] font-light tracking-wide text-espresso/50">{updated}</p>
        </div>
      </section>
      <article className={`bg-ivory-2 px-5 pb-28 pt-16 text-espresso sm:px-8 ${PROSE}`}>
        <div className="mx-auto max-w-3xl">{children}</div>
      </article>
    </div>
  );
}
