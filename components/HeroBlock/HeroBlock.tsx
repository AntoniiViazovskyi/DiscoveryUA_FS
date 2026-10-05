import Image from "next/image";
import css from "./HeroBlock.module.css";
import bgImage from "../../public/background_image.png";
import SearchForm from "../SearchForm/SearchForm";

export default function HeroBlock() {
  return (
    <section className={css.heroSection}>
      
      <Image
        src={bgImage}
        alt="Big river"
        fill
        sizes="(max-width: 1440px) 100vw, 1440px"
        priority
        className={css.backgroundImage}
      />
      <div className={css.overlay}></div>
      <div className={`container ${css.heroContainer}`}>
        <div className={css.contantContainer}>
          <h1 className={css.heroTitle}>
            Відкрий для себе Україну. Знайди ідеальне місце для відпочинку
          </h1>
          <p className={css.heroText}>
            Тисячі перевірених локацій з реальними фото та відгуками від
            мандрівників.
          </p>
          <SearchForm />
        </div>
      </div>
    
    </section>
  );
}
