export type Status = 'РќРѕРІР°СЏ' | 'Р’ СЂР°Р±РѕС‚Рµ' | 'Р“РѕС‚РѕРІРѕ'
export type Category = 'РљРѕРјРїСЊСЋС‚РµСЂ' | 'РџСЂРѕРµРєС‚РѕСЂ' | 'РџСЂРёРЅС‚РµСЂ' | 'РРЅС‚РµСЂРЅРµС‚'

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
  return status === 'РќРѕРІР°СЏ' ? 'Р’ СЂР°Р±РѕС‚Рµ' : 'Р“РѕС‚РѕРІРѕ'
}
