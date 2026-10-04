import css from './AdvantagesBlock.module.css'

const advantages = [
  {
    icon: 'icon-select-check-box',
    title: 'Реальні відгуки',
    text: 'Користувачі діляться чесними враженнями, щоб ви робили правильний вибір.',
  },
  {
    icon: 'icon-filter-alt',
    title: 'Зручні фільтри',
    text: 'Шукайте за типом локації, регіоном, наявністю зручностей та іншими критеріями.',
  },
  {
    icon: 'icon-communication',
    title: 'Спільнота мандрівників',
    text: 'Додавайте власні улюблені місця та діліться своїми неймовірними знахідками.',
  },
]

export default function AdvantagesBlock() {
  return (
    <section className={css.section} aria-labelledby="advantages-title">
      <div className="container">
        <h2 className={css.heading} id="advantages-title">
          Ключові переваги
        </h2>

        <ul className={css.list}>
          {advantages.map(({ icon, title, text }) => (
            <li key={title} className={css.card}>
              <svg className={css.icon} aria-hidden="true" focusable="false">
                <use href={`/icons/sprite.svg#${icon}`} />
              </svg>
              <h3 className={css.cardTitle}>{title}</h3>
              <p className={css.cardText}>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
