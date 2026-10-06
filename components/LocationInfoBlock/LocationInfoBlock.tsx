'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { subscribeToReviewCreated } from '@/lib/reviews/review-events'
import type { LocationDetails } from '@/types/location'

import css from './LocationInfoBlock.module.css'

type LocationInfoBlockProps = {
  location: LocationDetails;
};

export default function LocationInfoBlock({
  location,
}: LocationInfoBlockProps) {
  const [rating, setRating] = useState(location.rate ?? 0)
  const [feedbacksCount, setFeedbacksCount] = useState(
    location.feedbacksCount ?? 0,
  )

  useEffect(() => {
    setRating(location.rate ?? 0)
    setFeedbacksCount(location.feedbacksCount ?? 0)
  }, [location._id, location.rate, location.feedbacksCount])

  useEffect(
    () =>
      subscribeToReviewCreated((detail) => {
        if (detail.locationId !== location._id) return
        setRating(detail.rate)
        setFeedbacksCount(detail.feedbacksCount)
      }),
    [location._id],
  )

  const reviewCountLabel = getReviewCountLabel(feedbacksCount)

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={css.infoContainer}>
      <div className={css.rate}>
        {Array.from({ length: 5 }, (_, index) => {
          let icon = "icon-star-rate";

          if (index < fullStars) {
            icon = "icon-star-filled";
          } else if (index === fullStars && hasHalfStar) {
            icon = "icon-star-half";
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
        <svg
          className={css.rateDot}
          width="4"
          height="4"
          viewBox="0 0 4 4"
          aria-hidden="true"
        >
          <circle cx="2" cy="2" r="2" fill="currentColor" />
        </svg>

        <span className={css.rateNumber}>{rating.toFixed(1)}</span>
        <span className={css.feedbackCount}>{reviewCountLabel}</span>
      </div>

      <h1 className={css.title}>{location.name}</h1>
      <ul className={css.list}>
        <li className={css.item}>
          <p className={css.text}>
            Регіон:
            <span className={css.label}>
              {location.regionName ?? location.region}
            </span>
          </p>
        </li>

        <li className={css.item}>
          <p className={css.text}>
            Тип локації:
            <span className={css.label}>
              {location.locationTypeName ?? location.locationType}
            </span>
          </p>
        </li>
        <li className={css.item}>
          <p className={css.author}>
            <span className={css.authorLabel}> Автор статті:</span>
            {location.ownerId?.name || location.ownerId?.username ? (
              <Link
                href={`/profile/${location.ownerId._id}`}
                className={`${css.link} ${css.label}`}
              >
                {location.ownerId.name || location.ownerId?.username}
              </Link>
            ) : (
              <span className={css.label}>Автор не вказаний</span>
            )}
          </p>
        </li>
      </ul>
    </div>
  );
}

function getReviewCountLabel(count: number) {
  const lastTwoDigits = count % 100
  const lastDigit = count % 10
  const noun =
    lastTwoDigits >= 11 && lastTwoDigits <= 14
      ? 'відгуків'
      : lastDigit === 1
        ? 'відгук'
        : lastDigit >= 2 && lastDigit <= 4
          ? 'відгуки'
          : 'відгуків'

  return `${count} ${noun}`
}
