import { useState } from 'react'
import type { Category, Status } from '../requests'

type RequestCardProps = {
  title: string
  room: string
  category: Category
  details: string
  status: Status
  pending: boolean
  onNext: () => void
  onRemove: () => void
}

function RequestCard({ title, room, category, details, status, pending, onNext, onRemove }: RequestCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <article className="card">
      <div className="card__top">
        <span className="card__room">каб. {room} · {category}</span>
        <span className="card__status">{status}</span>
      </div>
      <h3>{title}</h3>
      {open && <p>{details}</p>}
      <div className="card__actions">
        <button className="card__more" onClick={() => setOpen(!open)}>
          {open ? 'Скрыть' : 'Подробнее'}
        </button>
        {status === 'Готово' ? (
          <button disabled={pending} onClick={onRemove}>Убрать с доски</button>
        ) : (
          <button disabled={pending} onClick={onNext}>{status === 'Новая' ? 'Взять в работу' : 'Завершить'}</button>
        )}
      </div>
    </article>
  )
}

export default RequestCard
