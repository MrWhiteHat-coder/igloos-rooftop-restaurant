import { ButtonLink } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center bg-forest px-5 pt-24 text-center">
      <p className="eyebrow mb-6 text-brass">Off the parapet</p>
      <p className="font-display text-[6rem] font-light leading-none text-ivory/15 sm:text-[9rem]">404</p>
      <h1 className="mt-2 font-display text-4xl font-light text-ivory sm:text-5xl">
        This balcony is <em className="italic text-brass-2">under the stars already.</em>
      </h1>
      <p className="mt-5 max-w-md text-[0.95rem] font-light leading-relaxed text-ivory/55">
        The page you were looking for isn't on the terrace. Let's walk you back.
      </p>
      <div className="mt-10">
        <ButtonLink to="/">Return home</ButtonLink>
      </div>
    </div>
  );
}
