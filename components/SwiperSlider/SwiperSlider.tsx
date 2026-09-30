'use client'


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

import css from './SwiperSlider.module.css';


type SliderProps<T> = {
  items: T[];
  sliderId: string;
  getKey: (item: T) => string;
  navigationMarginTop?: number;
  renderItem: (item: T) => React.ReactNode;
};

export default function SwiperSlider<T>({
  items,
  sliderId,
  getKey,
  navigationMarginTop = 50,
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
            spaceBetween: 24,
          },
          1440: {
            slidesPerView: 3,
            spaceBetween: 24,
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

      <div className={css.navigation}
      style={{ marginTop: `${navigationMarginTop}px` }}>
        <button
          type="button"
          className={`${css.prevButton} ${prevButton}`}
          aria-label="Попередній слайд"
        >
            <svg className={css.arrowIcon} width={24} height={24} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-arrow-back" />
            </svg>
          
        </button>

        <button
          type="button"
          className={`${css.nextButton} ${nextButton}`}
          aria-label="Наступний слайд"
        >
   <svg className={css.arrowIcon} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-arrow-forward" />
            </svg>
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
//  navigationMarginTop={50}  НЕ ОБОВЬЯЗКОВО. ЗА ЗАМОВЧУВАННЯМ 50PX ВІДСТАНЬ ВІД КНОПОК ДО КАРТОК
//         renderItem={location => (
//           <div>
//           {/* Здесь потом будет:*/}
//           CARD
//           {/* <LocationCard location={location} /> */}
//           </div>
// 
//         )}
//       />