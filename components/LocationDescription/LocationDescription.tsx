import styles from "./LocationDescription.module.css";

type LocationDescriptionProps = {
  description: string;
};

export default function LocationDescription({
  description,
}: LocationDescriptionProps) {
  return (
    <div className={styles.description}>
      <p className={styles.text}>{description}</p>
    </div>
  );
}
