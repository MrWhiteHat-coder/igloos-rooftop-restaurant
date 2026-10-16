import { ButtonLink } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="font-display text-8xl text-gold-gradient">404</p>
      <h1 className="mt-4 font-display text-4xl text-cream">This balcony is under construction</h1>
      <p className="mt-4 max-w-md text-cream/60">
        The page you were looking for isn't on the terrace. Let's take you back under the stars.
      </p>
      <div className="mt-10">
        <ButtonLink to="/">Return home</ButtonLink>
      </div>
    </div>
  );
}
