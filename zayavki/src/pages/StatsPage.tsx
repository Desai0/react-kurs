import { useBoard } from '../board'
import type { Category, Status } from '../requests'
const statuses: Status[] = ['Новая', 'В работе', 'Готово']
const categories: Category[] = ['Компьютер', 'Проектор', 'Принтер', 'Интернет']
function StatsPage() {
  const { requests, loading, loadError, retry } = useBoard()
  return <main className="page"><h2>Статистика</h2>
    {loading ? <p>Загрузка заявок…</p> : loadError ? <div role="alert"><p>{loadError}</p><button onClick={retry}>Повторить подключение</button></div> : <>
      <p>Всего заявок: {requests.length}</p>
      <div className="stats">
        <table><thead><tr><th>Статус</th><th>Заявок</th></tr></thead><tbody>{statuses.map((s) => <tr key={s}><td>{s}</td><td>{requests.filter((r) => r.status === s).length}</td></tr>)}</tbody></table>
        <table><thead><tr><th>Категория</th><th>Заявок</th></tr></thead><tbody>{categories.map((c) => <tr key={c}><td>{c}</td><td>{requests.filter((r) => r.category === c).length}</td></tr>)}</tbody></table>
      </div>
    </>}
  </main>
}
export default StatsPage
