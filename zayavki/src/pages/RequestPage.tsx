import { Link, useNavigate, useParams } from 'react-router'
import { useBoard } from '../board'
function RequestPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { requests, loading, loadError, retry, pendingIds, changeStatus, remove } = useBoard()
  const request = requests.find((r) => r.id === id)
  return <main className="page">
    <Link to="/" className="back">← Все заявки</Link>
    {loading ? <p>Загрузка заявки…</p> : loadError ? <div role="alert"><p>{loadError}</p><button onClick={retry}>Повторить подключение</button></div> : !request ? <p>Заявка не найдена.</p> :
      <article className="card request"><div className="card__top"><span className="card__room">каб. {request.room} · {request.category}</span><span className="card__status">{request.status}</span></div>
        <h2>{request.title}</h2><p>{request.details || 'Подробностей нет.'}</p><p className="request__id">Номер заявки: {request.id}</p>
        {request.status === 'Готово' ? <button disabled={pendingIds.includes(request.id)} onClick={() => void remove(request.id).then((ok) => { if (ok) navigate('/') })}>Убрать с доски</button> : <button disabled={pendingIds.includes(request.id)} onClick={() => void changeStatus(request)}>{request.status === 'Новая' ? 'Взять в работу' : 'Завершить'}</button>}
      </article>}
  </main>
}
export default RequestPage
