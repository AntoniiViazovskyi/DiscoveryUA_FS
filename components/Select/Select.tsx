'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import css from './Select.module.css';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  name?: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  loading?: boolean;
  id?: string;
  className?: string;
};

export default function Select({
  name,
  label,
  options,
  value,
  onChange,
  onBlur,
  placeholder = 'Оберіть...',
  error,
  disabled = false,
  loading = false,
  id,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const selectId = id ?? (name ? `select-${name}` : reactId);
  const errorId = `${selectId}-error`;
  const listboxId = `${selectId}-listbox`;

  const isDisabled = disabled || loading;
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : null;

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
    onBlur?.();
  }, [onBlur]);

  const openList = (index: number) => {
    if (isDisabled || options.length === 0) return;
    setOpen(true);
    setHighlightedIndex(index);
  };

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open, close]);

  useEffect(() => {
    if (!open || highlightedIndex < 0) return;

    const optionElement = document.getElementById(
      `${selectId}-option-${highlightedIndex}`
    );
    optionElement?.scrollIntoView({ block: 'nearest' });
  }, [open, highlightedIndex, selectId]);

  const handleToggle = () => {
    if (isDisabled) return;

    if (open) {
      close();
    } else {
      const startIndex = selectedOption
        ? options.indexOf(selectedOption)
        : 0;
      openList(startIndex);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isDisabled || options.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          const startIndex = selectedOption
            ? options.indexOf(selectedOption)
            : 0;
          openList(startIndex);
        } else {
          setHighlightedIndex((prev) =>
            prev < 0 || prev >= options.length - 1 ? 0 : prev + 1
          );
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          const startIndex = selectedOption
            ? options.indexOf(selectedOption)
            : options.length - 1;
          openList(startIndex);
        } else {
          setHighlightedIndex((prev) =>
            prev <= 0 ? options.length - 1 : prev - 1
          );
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) {
          const startIndex = selectedOption
            ? options.indexOf(selectedOption)
            : 0;
          openList(startIndex);
        } else if (highlightedIndex >= 0) {
          selectOption(options[highlightedIndex].value);
        }
        break;

      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
        }
        break;

      case 'Tab':
        if (open) close();
        break;

      default:
        break;
    }
  };

  const fieldClasses = [css.field, open ? css.fieldOpen : '', className]
    .filter(Boolean)
    .join(' ');
  const headerClasses = [
    css.header,
    open ? css.headerOpen : '',
    error ? css.headerError : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClasses} ref={containerRef}>
      {label && (
        <label className={css.label} htmlFor={selectId}>
          {label}
        </label>
      )}

      <div className={css.controlWrap}>
        <button
          type="button"
          id={selectId}
          className={headerClasses}
          disabled={isDisabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-activedescendant={
            open && highlightedIndex >= 0
              ? `${selectId}-option-${highlightedIndex}`
              : undefined
          }
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
        >
          <span className={selectedLabel ? css.value : css.placeholderValue}>
            {loading ? 'Завантажуємо...' : (selectedLabel ?? placeholder)}
          </span>
          <svg
            className={open ? css.arrowOpen : css.arrow}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <ul
            className={css.list}
            id={listboxId}
            role="listbox"
            aria-label={label ?? placeholder}
          >
            {options.map((option, index) => {
              const optionClasses = [
                css.option,
                index === highlightedIndex || option.value === value
                  ? css.optionActive
                  : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <li
                  key={option.value}
                  id={`${selectId}-option-${index}`}
                  role="option"
                  aria-selected={option.value === value}
                  className={optionClasses}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option.value)}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && (
        <p className={css.errorText} id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
