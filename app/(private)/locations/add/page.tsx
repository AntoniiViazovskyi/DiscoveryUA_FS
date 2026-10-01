import LocationForm from '@/components/LocationForm/LocationForm'
import css from './page.module.css'

export default function CreateLocationPage() {
  return (
    <main className="container">
      <h1 className={css.heading}>Додавання нового місця</h1>
      <LocationForm />
    </main>
  )
}
