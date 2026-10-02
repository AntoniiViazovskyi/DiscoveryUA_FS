import LocationInfoBlock from '@/components/LocationInfoBlock/LocationInfoBlock';
// import LocationGallery from '@/components/LocationGallery/LocationGallery';
// import LocationDescription from '@/components/LocationDescription/LocationDescription';
import ReviewsBlock from '@/components/ReviewsBlock/ReviewsBlock';
import { Location } from '@/types/location';
import css from './LocationDetailsPage.module.css';


const testLocation: Location = {
  _id: '68d568270e6bcc357e9833f0',
  image: '',
  name: 'Бакотська затока',
  locationType: 'Пляж',
  region: 'Хмельницька область',
  rate: 4.5,
  description: 'Опис локації',
  advantages: [],
  coordinates: {
    lat: 48.6,
    lon: 26.9,
  },
  ownerId: {
    _id: '1',
    name: 'Анастасія Олійник',
    avatarUrl: '',
  },
  feedbacksId: [],
};

type Props = {
  params: Promise<{ id: string }>;
};

async function getLocation(id: string) {
  const response = await fetch(
    `${process.env.BACKEND_ORIGIN}/api/locations/${id}`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch location');
  }

  return response.json();
}

export default async function LocationDetailsPage({ params }: Props) {
  const { id } = await params;

//   const location = await getLocation(id);

  return (
    <main className="container">
        <div className={css.wrapper}>
      <LocationInfoBlock/>
        <div className={css.gallery}>LocationGallery</div>
</div>

<div className={css.descriptionSection}>
  <div className={css.description}>
    LocationDescription
  </div>
</div>
      {/* <LocationGallery location={location} />

      <LocationDescription location={location} /> */}

      <ReviewsBlock />
    </main>
  );
}