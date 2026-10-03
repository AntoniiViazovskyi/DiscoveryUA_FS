import styles from './ReviewCard.module.css'

export type ReviewCardProps = {
  rating: number
  comment: string
  authorName: string
}

const STAR_COUNT = 5

function getStarIcon(rating: number, index: number) {
  const fullStars = Math.floor(rating)

  if (index < fullStars) {
    return 'icon-star-filled'
  }

  if (index === fullStars && rating - fullStars >= 0.5) {
    return 'icon-star-half'
  }

  return 'icon-star-rate'
}

export default function ReviewCard({
  rating,
  comment,
  authorName,
}: ReviewCardProps) {
  const normalizedRating = Math.min(5, Math.max(0, Math.round(rating * 2) / 2))

  return (
    <article className={styles.card}>
      <div
        className={styles.rating}
        role="img"
        aria-label={`Оцінка ${normalizedRating} з 5`}
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => (
          <svg
            className={styles.star}
            key={index}
            width="24"
            height="24"
            aria-hidden="true"
            focusable="false"
          >
            <use href={`/icons/sprite.svg#${getStarIcon(normalizedRating, index)}`} />
          </svg>
        ))}
      </div>

      <p className={styles.comment}>{comment}</p>
      <p className={styles.author}>{authorName}</p>
    </article>
  )
}