import { ReactNode, ButtonHTMLAttributes } from 'react';
import css from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  type: "submit" | "button" | "reset";
 }

export default function Button({
  children = "Знайти місце", 
  type = "submit",           
  disabled = false,
  ...props                   
}: ButtonProps) {
 
  return (
    <button 
      type={type} 
      className={css.btn}
      disabled={disabled}
      {...props} 
    >
      {children}
    </button>
  );
}
