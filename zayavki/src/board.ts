import { createContext, useContext } from 'react'
import type { NewRequest, RequestItem } from './requests'
export type Board = {
  requests: RequestItem[]
  loading: boolean
  loadError: string
  realtimeError: string
  actionError: string
  pendingIds: string[]
  notice: string
  newCount: number
  retry: () => void
  handleAdd: (data: NewRequest) => Promise<boolean>
  changeStatus: (request: RequestItem) => Promise<void>
  remove: (id: string) => Promise<boolean>
}
export const BoardContext = createContext<Board | null>(null)
export function useBoard(): Board {
  const board = useContext(BoardContext)
  if (!board) throw new Error('useBoard вызван вне BoardProvider')
  return board
}
