
'use client';

import Link from "next/link";
import css from "./LocationInfoBlock.module.css";


export type User = {
  _id: string;
  name: string;
};
// type LocationInfoBlockProps = {
//   location: Location;
// };

//     {location}: LocationInfoBlockProps
export default function LocationInfoBlock(){
 const rating = 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
    return (
        <div className={css.infoContainer}>
            <div className={css.rate}>
                        {Array.from({ length: 5 }, (_, index) => {
          let icon = "icon-star-rate";

          if (index < fullStars) {
            icon = "icon-star-filled";
          } else if (index === fullStars && hasHalfStar) {
            icon = "icon-star-half";
          }

          return (
            <svg
              key={index}
              className={css.star}
              width={24}
              height={24}
              aria-hidden="true"
            >
              <use href={`/icons/sprite.svg#${icon}`} />
            </svg>
          );  
        })}
        <svg
    className={css.rateDot}
    width="4"
    height="4"
    viewBox="0 0 4 4"
    aria-hidden="true"
  >
    <circle cx="2" cy="2" r="2" fill="currentColor" />
  </svg>

  <span className={css.rateNumber}>{rating}</span>
</div>

    <h2 className={css.title}>Бакотська затока</h2>
<ul className={css.list}>
  <li className={css.item}>
    <p className={css.text}>Регіон:
      <span className={css.label}>Хмельниччина</span>
    </p>
  </li>

  <li className={css.item}>
    <p className={css.text}>Тип локації:
     <span className={css.label}>Пляж</span>
    </p>
  </li>
      {/* `/profile/${userId}` */}
  <li className={css.item}>
    
    <p className={css.text}>
      Автор статті: <Link href="/" className={css.link}>Анастасія Олійник</Link>
    </p>
  </li>
</ul>
        </div>
    )
};