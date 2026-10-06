import css from "./ErrorMessage.module.css"
type ErrorMessageProps = {
  message?: string;
};

export default function ErrorMessage({
  message = "Не вдалося завантажити дані",
}: ErrorMessageProps) {
  return <p className={css.text} role="alert">{message}</p>;
}
