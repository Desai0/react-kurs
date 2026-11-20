import { useState, type SubmitEvent } from 'react'
import type { Category, NewRequest } from '../requests'

type RequestFormProps = {
  onAdd: (request: NewRequest) => Promise<boolean>
}

function RequestForm({ onAdd }: RequestFormProps) {
  const [title, setTitle] = useState('')
  const [room, setRoom] = useState('')
  const [category, setCategory] = useState<Category>('РљРѕРјРїСЊСЋС‚РµСЂ')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (title.trim() === '' || room.trim() === '') {
      setError('Р—Р°РїРѕР»РЅРёС‚Рµ РїРѕР»СЏ В«Р§С‚Рѕ СЃР»СѓС‡РёР»РѕСЃСЊВ» Рё В«РљР°Р±РёРЅРµС‚В».')
      return
    }
    setPending(true)
    const saved = await onAdd({ title: title.trim(), room: room.trim(), category, details: details.trim() })
    setPending(false)
    if (!saved) return
    setTitle('')
    setRoom('')
    setCategory('РљРѕРјРїСЊСЋС‚РµСЂ')
    setDetails('')
    setError('')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>РќРѕРІР°СЏ Р·Р°СЏРІРєР°</h2>

      <label htmlFor="title">Р§С‚Рѕ СЃР»СѓС‡РёР»РѕСЃСЊ</label>
      <input
        id="title"
        type="text"
        disabled={pending}
        placeholder="РќР°РїСЂРёРјРµСЂ: РЅРµ СЂР°Р±РѕС‚Р°РµС‚ РїСЂРѕРµРєС‚РѕСЂ"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="room">РљР°Р±РёРЅРµС‚</label>
      <input
        id="room"
        type="text"
        disabled={pending}
        placeholder="214"
        value={room}
        onChange={(event) => setRoom(event.target.value)}
      />

      <label htmlFor="category">РљР°С‚РµРіРѕСЂРёСЏ</label>
      <select
        id="category"
        disabled={pending}
        value={category}
        onChange={(event) => setCategory(event.target.value as Category)}
      >
        <option>РљРѕРјРїСЊСЋС‚РµСЂ</option>
        <option>РџСЂРѕРµРєС‚РѕСЂ</option>
        <option>РџСЂРёРЅС‚РµСЂ</option>
        <option>РРЅС‚РµСЂРЅРµС‚</option>
      </select>

      <label htmlFor="details">РџРѕРґСЂРѕР±РЅРѕСЃС‚Рё</label>
      <textarea
        id="details"
        disabled={pending}
        rows={3}
        value={details}
        onChange={(event) => setDetails(event.target.value)}
      />

      {error !== '' && <p className="form__error">{error}</p>}

      <button type="submit" disabled={pending}>{pending ? 'РћС‚РїСЂР°РІР»СЏРµРјвЂ¦' : 'РћС‚РїСЂР°РІРёС‚СЊ Р·Р°СЏРІРєСѓ'}</button>
    </form>
  )
}

export default RequestForm
