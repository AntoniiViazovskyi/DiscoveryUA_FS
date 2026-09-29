'use client'


import SwiperSlider from '../SwiperSlider/SwiperSlider';

import css from './PopularLocationsBlock.module.css';
import Link from 'next/link';
// import LocationCard from '../LocationCard/LocationCard';

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
    <section className={`${css.popularLocationSection} ${css.container}`}>
      <div className={css.popularLocationContainer}>
      <h2 className={css.popularLocationsTitle}>Популярні локації</h2>
   <Link href='/locations' className={css.popularLocationsLink}>Всі локації</Link>
   </div>

  <SwiperSlider
        items={locations}
        sliderId="popular-locations"
         getKey={location => location._id}
        renderItem={location => (
          <div>
          {/* Здесь потом будет:*/}
          CARD
          {/* <LocationCard location={location} /> */}
          </div>
        )}
      />
     </section>
  );
}



