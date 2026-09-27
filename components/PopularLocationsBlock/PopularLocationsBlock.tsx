'use client'


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';


import css from './PopularLocationsBlock.module.css';
import Link from 'next/link';
import Image from 'next/image';



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
    <section>
      <div className={css.popularLocationContainer}>
      <h2 className={css.popularLocationsTitle}>Популярні локації</h2>
   <Link href='/locations' className={css.popularLocationsLink}>Всі локації</Link>
   </div>

    <div className={css.popularLocationWrapper}>
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
        <Image
        className={css.arrowIcon}
        src="./arrow_back.svg"
        alt="Previous slide"
        width={24}
  height={24}/>
        </button>

        <button
          type="button"
         className={css.nextButton}
          aria-label="Наступні локації"
        >
          <Image
          className={css.arrowIcon}
          src="./arrow_forward.svg"
          alt="Previous slide"
          width={24}
  height={24}/>
        </button>
      </div>
    </div>
     </section>
  );
}