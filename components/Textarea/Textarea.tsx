'use client'

import type { TextareaHTMLAttributes } from 'react';
import css from './Textarea.module.css';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label?: string;
  error?: string | null;
};

export default function Textarea({
  name,
  label,
  error,
  id,
  disabled,
  className,
  rows = 4,
  ...rest
}: TextareaProps) {
  const textareaId = id ?? name;
  const errorId = `${textareaId}-error`;
  const textareaClasses = [css.textarea, error ? css.textareaError : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={css.field}>
      {label && (
        <label className={css.label} htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={textareaClasses}
        {...rest}
      />
      {error && (
        <p className={css.errorText} id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
