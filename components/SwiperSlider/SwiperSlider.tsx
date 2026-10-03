'use client'

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import css from './SwiperSlider.module.css';


type SliderProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  navigationMarginTop?: number;
  renderItem: (item: T) => React.ReactNode;
};

export default function SwiperSlider<T>({
  items,
  getKey,
  navigationMarginTop = 50,
  renderItem,
}: SliderProps<T>) {

  const swiperRef = useRef<SwiperType | null>(null);

  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  // const prevButton = `${sliderId}-prev`;
  // const nextButton = `${sliderId}-next`;

  useEffect(() => {
    const swiper = swiperRef.current;

   
  if (!swiper || !prevRef.current || !nextRef.current) return

  const navigation = swiper.params.navigation

  if (!navigation || typeof navigation === 'boolean') return

  navigation.prevEl = prevRef.current
  navigation.nextEl = nextRef.current
    swiper.navigation.destroy()
    swiper.navigation.init()
    swiper.navigation.update()
  }, [items.length])

  return (
    <div className={css.wrapper}>
      <Swiper
       modules={[Navigation]}
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
         slidesPerGroup={1}
        spaceBetween={24}
        loop={items.length > 3}
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
        className={css.swiper}
      >
        {items.map(item => (
          <SwiperSlide key={getKey(item)} className={css.slide}>
            {renderItem(item)}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={css.navigation}
      style={{ marginTop: `${navigationMarginTop}px` }}>
        <button
          type="button"
          ref={prevRef}
          className={`${css.prevButton}`}
          aria-label="Попередній слайд"
        >
            <svg className={css.arrowIcon} width={24} height={24} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-arrow-back" />
            </svg>
          
        </button>

        <button
          type="button"
          ref={nextRef}
          className={css.nextButton}
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
//         items={locations} <-- ДЛЯ СЕКЦИИ СВОЁ НАЗВАНИЕ 
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