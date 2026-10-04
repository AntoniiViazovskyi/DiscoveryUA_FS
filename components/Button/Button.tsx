import { ReactNode, ButtonHTMLAttributes } from 'react';
import css from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  type?: "submit" | "button" | "reset";
  className?: string;
 }

export default function Button({
  children = "Знайти місце", 
  type = "submit",           
  disabled = false,
  className,
  ...props                   
}: ButtonProps) {
 const classes = [css.btn, className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
