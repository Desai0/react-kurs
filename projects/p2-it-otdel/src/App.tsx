import { useState } from 'react'
import Header from './components/Header'
import RequestForm from './components/RequestForm'
import RequestCard from './components/RequestCard'
import { type NewRequest, type Status } from './requests'
import { sendRequest } from './notify'
import { useRequests } from './useRequests'

type Filter = 'Р’СЃРµ' | Status
const FILTERS: Filter[] = ['Р’СЃРµ', 'РќРѕРІР°СЏ', 'Р’ СЂР°Р±РѕС‚Рµ', 'Р“РѕС‚РѕРІРѕ']

function App() {
  const { requests, loading, loadError, realtimeError, actionError, pendingIds, retry, add, changeStatus, remove } = useRequests()
  const [filter, setFilter] = useState<Filter>('Р’СЃРµ')
  const [notice, setNotice] = useState('')

  const newCount = requests.filter((r) => r.status === 'РќРѕРІР°СЏ').length
  const visible = filter === 'Р’СЃРµ' ? requests : requests.filter((r) => r.status === filter)

  async function handleAdd(data: NewRequest): Promise<boolean> {
    setNotice('')
    const created = await add(data)
    if (!created) return false
    setNotice('Р—Р°СЏРІРєР° РґРѕР±Р°РІР»РµРЅР°. РћС‚РїСЂР°РІР»СЏРµРј СѓРІРµРґРѕРјР»РµРЅРёРµвЂ¦')
    void sendRequest(created).then((sent) => {
      setNotice(sent
        ? 'Р—Р°СЏРІРєР° РґРѕР±Р°РІР»РµРЅР° Рё РїРµСЂРµРґР°РЅР° СЃРµСЂРІРµСЂСѓ Р°РІС‚РѕРјР°С‚РёР·Р°С†РёРё.'
        : 'Р—Р°СЏРІРєР° РґРѕР±Р°РІР»РµРЅР°, РЅРѕ СѓРІРµРґРѕРјР»РµРЅРёРµ РЅРµ РѕС‚РїСЂР°РІР»РµРЅРѕ: СЃРµСЂРІРµСЂ Р°РІС‚РѕРјР°С‚РёР·Р°С†РёРё РЅРµРґРѕСЃС‚СѓРїРµРЅ.')
    })
    return true
  }

  return (
    <>
      <Header newCount={newCount} />
      <main className="board">
        <RequestForm onAdd={handleAdd} />
        <section className="list">
          <h2>Р—Р°СЏРІРєРё</h2>
          {notice && <p className="notice" role="status">{notice}</p>}
          {actionError && <p className="form__error" role="alert">{actionError}</p>}
          {(loadError || realtimeError) && (
            <div className="form__error" role="alert">
              <p>{loadError || realtimeError}</p>
              <button type="button" onClick={retry}>РџРѕРІС‚РѕСЂРёС‚СЊ РїРѕРґРєР»СЋС‡РµРЅРёРµ</button>
            </div>
          )}
          <div className="filters">
            {FILTERS.map((f) => (
              <button key={f} className={f === filter ? 'active' : ''} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          {loading && <p>Р—Р°РіСЂСѓР·РєР° Р·Р°СЏРІРѕРєвЂ¦</p>}
          {!loading && !loadError && visible.length === 0 && <p className="empty">Р—Р°СЏРІРѕРє СЃ С‚Р°РєРёРј СЃС‚Р°С‚СѓСЃРѕРј РЅРµС‚</p>}
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
