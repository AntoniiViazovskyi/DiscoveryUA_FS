'use client'


import SwiperSlider from '../SwiperSlider/SwiperSlider';

import css from './PopularLocationsBlock.module.css';
import Link from 'next/link';
import LocationCard from '../LocationCard/LocationCard';
import { fetchAllLocations } from '@/lib/api/clientApi';
import { useQuery } from '@tanstack/react-query';

export default function PopularLocationsBlock() {
const { data, isLoading, isError } = useQuery({
  queryKey: ['popular-locations'],
  queryFn: () =>
    fetchAllLocations(
      1,
      6,
      undefined,
      undefined,
      undefined,
      undefined,
      'rate',
      'desc',
    ),
});
const locations = data?.locations ?? [];
//       const locations = [
//     { _id: '1', name: 'Поліська Пуща' },
//     { _id: '2', name: 'Древлянські Світанки' },
//     { _id: '3', name: 'Зелене Дихання' },
// { _id: '4', name: 'Сонячна Ривʼєра' },
//   { _id: '5', name: 'Карпатський Край' },
//   { _id: '6', name: 'Золоте Озеро' },
//   ];


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
         navigationMarginTop={40}
        renderItem={location => (
          
          <LocationCard  location={location} 
           onView={location => {
    console.log(location);
  }}
          />
          
          
        )}
      />
     </section>
  );
}



