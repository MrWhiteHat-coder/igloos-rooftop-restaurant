import { forwardRef, useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const controlBase =
  "w-full border-b border-ivory/25 bg-transparent px-1 py-3.5 text-ivory placeholder:text-ivory/30 transition-colors duration-300 focus:border-brass focus:outline-none rounded-none";
const okBorder = "";
const errorBorder = "border-red-300/70";

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
    <label htmlFor={htmlFor} className="mb-1 block text-[0.62rem] font-medium uppercase tracking-[0.26em] text-ivory/55">
      {children}
      {hint && <span className="ml-2 normal-case tracking-normal text-ivory/35">({hint})</span>}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-[0.8rem] font-light text-red-200">
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
          className={`${controlBase} ${error ? errorBorder : okBorder} appearance-none bg-[length:10px] bg-no-repeat ${className}`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23B79A69' stroke-width='1.5'/%3E%3C/svg%3E\")",
            backgroundPosition: "right 4px center",
          }}
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
          className={`${controlBase} ${error ? errorBorder : okBorder} min-h-28 resize-y ${className}`}
          {...rest}
        />
        <FieldError id={errorId}>{error}</FieldError>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
