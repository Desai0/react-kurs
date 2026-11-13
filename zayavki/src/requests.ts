export type Status = 'Новая' | 'В работе' | 'Готово'
export type Category = 'Компьютер' | 'Проектор' | 'Принтер' | 'Интернет'

export type NewRequest = {
  title: string
  room: string
  category: Category
  details: string
}

export type RequestItem = NewRequest & {
  id: string
  status: Status
  created: string
}

export function nextStatus(status: Status): Status {
  return status === 'Новая' ? 'В работе' : 'Готово'
}
