import { useState, type ReactNode } from 'react'
import { BoardContext } from './board'
import type { NewRequest } from './requests'
import { sendRequest } from './notify'
import { useRequests } from './useRequests'
function BoardProvider({ children }: { children: ReactNode }) {
  const data = useRequests()
  const [notice, setNotice] = useState('')
  const newCount = data.requests.filter((r) => r.status === 'Новая').length
  async function handleAdd(request: NewRequest): Promise<boolean> {
    setNotice('')
    const created = await data.add(request)
    if (!created) return false
    setNotice('Заявка добавлена. Отправляем уведомление…')
    void sendRequest(created).then((sent) => setNotice(sent
      ? 'Заявка добавлена и передана серверу автоматизации.'
      : 'Заявка добавлена, но уведомление не отправлено: сервер автоматизации недоступен.'))
    return true
  }
  return <BoardContext value={{ ...data, notice, newCount, handleAdd }}>{children}</BoardContext>
}
export default BoardProvider
