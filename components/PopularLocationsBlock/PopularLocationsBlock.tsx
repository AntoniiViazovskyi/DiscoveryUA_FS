'use client'


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';


import css from './PopularLocationsBlock.module.css';



export default function PopularLocationsBlock() {

      const locations = [
    { _id: '1', name: 'Поліська Пуща' },
    { _id: '2', name: 'Древлянські Світанки' },
    { _id: '3', name: 'Зелене Дихання' },
{ _id: '4', name: 'Сонячна Ривʼєра' },
  { _id: '5', name: 'Карпатський Край' },
  { _id: '6', name: 'Золоте Озеро' },
  ];
  return (
    <div className={css.wrapper}>
      <Swiper
         slidesPerView={3}
        spaceBetween={30}
       loop={true}
        navigation={{
          nextEl: `.${css.nextButton}`,
          prevEl: `.${css.prevButton}`,
        }}
         modules={[Navigation]}
        className={css.mySwiper}
      >

      {locations.map(location => (
  <SwiperSlide key={location._id}>
    {/* <LocationCard location={location} /> */}Hello
  </SwiperSlide>
  
))}   
      </Swiper>

      <div className={css.navigation}>
        <button
          type="button"
          className={css.prevButton}
          aria-label="Попередні локації"
        >
          ←
        </button>

        <button
          type="button"
         className={css.nextButton}
          aria-label="Наступні локації"
        >
          →
        </button>
      </div>
    </div>
  );
}