'use client'


import SwiperSlider from '../SwiperSlider/SwiperSlider';
import css from './PopularLocationsBlock.module.css';
import Link from 'next/link';
import LocationCard from '../LocationCard/LocationCard';
import { fetchAllLocations } from '@/lib/api/clientApi';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';


export default function PopularLocationsBlock() {
const router = useRouter();

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
if (isLoading) {
  return <p>Завантаження...</p>;
}

if (isError) {
  return <p>Не вдалося завантажити локації</p>;
}


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
          <LocationCard
          location={location}
          
          rating={
  <div className={css.rating}>
    {Array.from({ length: 5 }, (_, index) => {
      let icon = 'icon-star-rate';

      const fullStars = Math.floor(location.rate);
      const hasHalfStar = location.rate % 1 !== 0;

      if (index < fullStars) {
        icon = 'icon-star-filled';
      } else if (index === fullStars && hasHalfStar) {
        icon = 'icon-star-half';
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

  </div>
}

           onView={location => {
        router.push(`/locations/${location._id}`
        )
  }}
/>
     )}
 />
     </section>
  );
};



