import { useState } from 'react'
import Header from './components/Header'
import RequestForm from './components/RequestForm'
import RequestCard from './components/RequestCard'
import { type NewRequest, type Status } from './requests'
import { sendRequest } from './notify'
import { useRequests } from './useRequests'

type Filter = 'Все' | Status
const FILTERS: Filter[] = ['Все', 'Новая', 'В работе', 'Готово']

function App() {
  const { requests, loading, loadError, realtimeError, actionError, pendingIds, retry, add, changeStatus, remove } = useRequests()
  const [filter, setFilter] = useState<Filter>('Все')
  const [notice, setNotice] = useState('')

  const newCount = requests.filter((r) => r.status === 'Новая').length
  const visible = filter === 'Все' ? requests : requests.filter((r) => r.status === filter)

  async function handleAdd(data: NewRequest): Promise<boolean> {
    setNotice('')
    const created = await add(data)
    if (!created) return false
    setNotice('Заявка добавлена. Отправляем уведомление…')
    void sendRequest(created).then((sent) => {
      setNotice(sent
        ? 'Заявка добавлена и передана серверу автоматизации.'
        : 'Заявка добавлена, но уведомление не отправлено: сервер автоматизации недоступен.')
    })
    return true
  }

  return (
    <>
      <Header newCount={newCount} />
      <main className="board">
        <RequestForm onAdd={handleAdd} />
        <section className="list">
          <h2>Заявки</h2>
          {notice && <p className="notice" role="status">{notice}</p>}
          {actionError && <p className="form__error" role="alert">{actionError}</p>}
          {(loadError || realtimeError) && (
            <div className="form__error" role="alert">
              <p>{loadError || realtimeError}</p>
              <button type="button" onClick={retry}>Повторить подключение</button>
            </div>
          )}
          <div className="filters">
            {FILTERS.map((f) => (
              <button key={f} className={f === filter ? 'active' : ''} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          {loading && <p>Загрузка заявок…</p>}
          {!loading && !loadError && visible.length === 0 && <p className="empty">Заявок с таким статусом нет</p>}
          {visible.map((r) => (
            <RequestCard
              key={r.id}
              title={r.title}
              room={r.room}
              category={r.category}
              details={r.details}
              status={r.status}
              pending={pendingIds.includes(r.id)}
              onNext={() => void changeStatus(r)}
              onRemove={() => void remove(r.id)}
            />
          ))}
        </section>
      </main>
    </>
  )
}

export default App
