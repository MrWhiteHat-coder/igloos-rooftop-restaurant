import { forwardRef, useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const controlBase =
  "w-full rounded-lg border bg-night-2/70 px-4 py-3 text-cream placeholder:text-cream/30 transition-colors duration-200 focus:border-gold/70 focus:bg-night-2 disabled:opacity-50";
const okBorder = "border-cream/15";
const errorBorder = "border-red-400/70";

export function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-xs uppercase tracking-[0.18em] text-cream/70">
      {children}
      {hint && <span className="ml-2 normal-case tracking-normal text-cream/40">({hint})</span>}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-red-300">
      {children}
    </p>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, optional, id: idProp, className = "", ...rest }, ref) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const errorId = `${id}-error`;
    return (
      <div>
        <Label htmlFor={id} hint={optional ? "optional" : hint}>
          {label}
        </Label>
        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${controlBase} ${error ? errorBorder : okBorder} ${className}`}
          {...rest}
        />
        <FieldError id={errorId}>{error}</FieldError>
      </div>
    );
  }
);
Input.displayName = "Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  placeholderOption?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, placeholderOption, id: idProp, className = "", children, ...rest }, ref) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const errorId = `${id}-error`;
    return (
      <div>
        <Label htmlFor={id}>{label}</Label>
        <select
          ref={ref}
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${controlBase} ${error ? errorBorder : okBorder} appearance-none ${className}`}
          {...rest}
        >
          {placeholderOption && <option value="">{placeholderOption}</option>}
          {children}
        </select>
        <FieldError id={errorId}>{error}</FieldError>
      </div>
    );
  }
);
Select.displayName = "Select";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, optional, id: idProp, className = "", ...rest }, ref) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const errorId = `${id}-error`;
    return (
      <div>
        <Label htmlFor={id} hint={optional ? "optional" : undefined}>
          {label}
        </Label>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${controlBase} ${error ? errorBorder : okBorder} min-h-28 ${className}`}
          {...rest}
        />
        <FieldError id={errorId}>{error}</FieldError>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
