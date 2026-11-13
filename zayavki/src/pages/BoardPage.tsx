import { useEffect, useState } from 'react'
import { useBoard } from '../board'
import RequestForm from '../components/RequestForm'
import RequestCard from '../components/RequestCard'
import type { Status } from '../requests'
type Filter = 'Все' | Status
const FILTERS: Filter[] = ['Все', 'Новая', 'В работе', 'Готово']
function BoardPage() {
  const { requests, loading, loadError, realtimeError, pendingIds, retry, handleAdd, changeStatus, remove } = useBoard()
  const [filter, setFilter] = useState<Filter>('Все')
  const visible = filter === 'Все' ? requests : requests.filter((r) => r.status === filter)
  useEffect(() => {
    function onKey(event: KeyboardEvent) { if (event.key === 'Escape') setFilter('Все') }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return <main className="board">
    <RequestForm onAdd={handleAdd} />
    <section className="list">
      <h2>Заявки</h2>
      {(loadError || realtimeError) && <div className="form__error" role="alert"><p>{loadError || realtimeError}</p><button type="button" onClick={retry}>Повторить подключение</button></div>}
      <div className="filters">{FILTERS.map((f) => <button key={f} className={f === filter ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
      {loading && <p>Загрузка заявок…</p>}
      {!loading && !loadError && visible.length === 0 && <p className="empty">Заявок с таким статусом нет</p>}
      {visible.map((r) => <RequestCard key={r.id} id={r.id} title={r.title} room={r.room} category={r.category} details={r.details} status={r.status} pending={pendingIds.includes(r.id)} onNext={() => void changeStatus(r)} onRemove={() => void remove(r.id)} />)}
    </section>
  </main>
}
export default BoardPage
