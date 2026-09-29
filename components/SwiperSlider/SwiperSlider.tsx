'use client'


import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

import css from './SwiperSlider.module.css';


type SliderProps<T> = {
  items: T[];
  sliderId: string;
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
};

export default function SwiperSlider<T>({
  items,
  sliderId,
  getKey,
  renderItem,
}: SliderProps<T>) {
  const prevButton = `${sliderId}-prev`;
  const nextButton = `${sliderId}-next`;

  return (
    <div className={css.wrapper}>
      <Swiper
        slidesPerView={1}
        spaceBetween={24}
        loop={true}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1440: {
            slidesPerView: 3,
          },
        }}
        navigation={{
          nextEl: `.${nextButton}`,
          prevEl: `.${prevButton}`,
        }}
        modules={[Navigation]}
        className={css.swiper}
      >
        {items.map(item => (
          <SwiperSlide key={getKey(item)}>
            {renderItem(item)}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={css.navigation}>
        <button
          type="button"
          className={`${css.prevButton} ${prevButton}`}
          aria-label="Попередній слайд"
        >
          <Image
            className={css.arrowIcon}
            src="./arrow_back.svg"
            alt="Previous slide"
            width={24}
            height={24}
          />
        </button>

        <button
          type="button"
          className={`${css.nextButton} ${nextButton}`}
          aria-label="Наступний слайд"
        >
          <Image
            className={css.arrowIcon}
            src="./arrow_forward.svg"
            alt="Next slide"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}

// Карточки крутятся по кругу сейчас  loop={true}

// В СВОЙ КОМПОНЕНТ import SwiperSlider from '../SwiperSlider/SwiperSlider';

//   <SwiperSlider
//         items={locations} 
//         sliderId="popular-locations" <-- ДЛЯ СЕКЦИИ СВОЁ НАЗВАНИЕ 
//          getKey={location => location._id}
//         renderItem={location => (
//           <div>
//           {/* Здесь потом будет:*/}
//           CARD
//           {/* <LocationCard location={location} /> */}
//           </div>
//         )}
//       />