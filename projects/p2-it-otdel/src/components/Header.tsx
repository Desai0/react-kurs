type HeaderProps = {
  newCount: number
}

function Header({ newCount }: HeaderProps) {
  return (
    <header className="header">
      <h1>Р”РѕСЃРєР° Р·Р°СЏРІРѕРє</h1>
      <p>РРў-РѕС‚РґРµР» РєРѕР»Р»РµРґР¶Р° В· Р·Р°СЏРІРєРё СЃС‚СѓРґРµРЅС‚РѕРІ Рё РїСЂРµРїРѕРґР°РІР°С‚РµР»РµР№</p>
      <span className="header__count">РќРѕРІС‹С… Р·Р°СЏРІРѕРє: {newCount}</span>
    </header>
  )
}

export default Header
