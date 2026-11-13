import { useCallback, useEffect, useRef, useState } from 'react'
import type { RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { pb, requestsCollection } from './pocketbase'
import { nextStatus, type NewRequest, type RequestItem } from './requests'

type Change = RecordSubscription<RequestItem>

function applyChange(items: RequestItem[], change: Change): RequestItem[] {
  const rest = items.filter((item) => item.id !== change.record.id)
  if (change.action === 'delete') return rest
  return [...rest, change.record].sort((a, b) => b.created.localeCompare(a.created))
}

export function useRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [realtimeError, setRealtimeError] = useState('')
  const [actionError, setActionError] = useState('')
  const [pendingIds, setPendingIds] = useState<string[]>([])
  const [attempt, setAttempt] = useState(0)
  const recordChange = useRef<(change: Change) => void>(() => {})

  useEffect(() => {
    let active = true
    let unsubscribe: UnsubscribeFunc | undefined
    let unsubscribeConnect: UnsubscribeFunc | undefined
    let fetching = false
    let refreshAgain = false
    let changes: Change[] = []

    recordChange.current = (change) => {
      if (!active) return
      if (fetching) changes.push(change)
      setRequests((current) => applyChange(current, change))
    }

    async function refresh() {
      if (fetching) {
        refreshAgain = true
        return
      }
      fetching = true
      changes = []
      try {
        const list = await requestsCollection.getFullList<RequestItem>({ sort: '-created', requestKey: null })
        if (active) {
          setRequests(changes.reduce(applyChange, list))
          setLoadError('')
        }
      } catch {
        if (active) setLoadError('Не удалось загрузить заявки. Проверьте соединение с сервером.')
      } finally {
        fetching = false
        if (active) {
          setLoading(false)
          if (refreshAgain) {
            refreshAgain = false
            void refresh()
          }
        }
      }
    }

    async function connect() {
      setLoading(true)
      setRealtimeError('')
      try {
        unsubscribe = await requestsCollection.subscribe<RequestItem>('*', (change) => recordChange.current(change))
        if (!active) {
          void unsubscribe()
          return
        }
        // The SDK reconnects automatically; reload to recover events missed offline.
        unsubscribeConnect = await pb.realtime.subscribe('PB_CONNECT', () => {
          if (active) void refresh()
        })
        if (!active) {
          void unsubscribeConnect()
          return
        }
      } catch {
        if (active) setRealtimeError('Обновления в реальном времени недоступны.')
      }
      if (active) void refresh()
    }

    // Load independently so an unavailable realtime endpoint cannot block the list.
    void refresh()
    void connect()
    return () => {
      active = false
      if (unsubscribe) void unsubscribe()
      if (unsubscribeConnect) void unsubscribeConnect()
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  async function add(data: NewRequest): Promise<RequestItem | null> {
    setActionError('')
    try {
      const record = await requestsCollection.create<RequestItem>({ ...data, status: 'Новая' }, { requestKey: null })
      recordChange.current({ action: 'create', record })
      return record
    } catch {
      setActionError('Не удалось сохранить заявку. Проверьте соединение и попробуйте ещё раз.')
      return null
    }
  }

  async function changeStatus(item: RequestItem) {
    setActionError('')
    setPendingIds((current) => [...current, item.id])
    try {
      const record = await requestsCollection.update<RequestItem>(item.id, { status: nextStatus(item.status) }, { requestKey: null })
      recordChange.current({ action: 'update', record })
    } catch {
      setActionError('Не удалось изменить статус заявки. Попробуйте ещё раз.')
    } finally {
      setPendingIds((current) => current.filter((id) => id !== item.id))
    }
  }

  async function remove(id: string): Promise<boolean> {
    setActionError('')
    setPendingIds((current) => [...current, id])
    try {
      await requestsCollection.delete(id, { requestKey: null })
      recordChange.current({ action: 'delete', record: { id } as RequestItem })
      return true
    } catch {
      setActionError('Не удалось удалить заявку. Попробуйте ещё раз.')
      return false
    } finally {
      setPendingIds((current) => current.filter((itemId) => itemId !== id))
    }
  }

  return { requests, loading, loadError, realtimeError, actionError, pendingIds, retry, add, changeStatus, remove }
}
