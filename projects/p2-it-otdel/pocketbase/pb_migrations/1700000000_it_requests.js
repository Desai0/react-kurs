migrate((app) => {
  const collection = new Collection({
    type: 'base',
    name: 'it_requests',
    listRule: '',
    viewRule: '',
    createRule: '@request.body.status = "РќРѕРІР°СЏ"',
    updateRule: '@request.body.title:isset = false && @request.body.room:isset = false && @request.body.details:isset = false',
    deleteRule: 'status = "Р“РѕС‚РѕРІРѕ"',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'room', type: 'text', required: true },
      { name: 'category', type: 'select', required: true, maxSelect: 1, values: ['РљРѕРјРїСЊСЋС‚РµСЂ', 'РџСЂРѕРµРєС‚РѕСЂ', 'РџСЂРёРЅС‚РµСЂ', 'РРЅС‚РµСЂРЅРµС‚'] },
      { name: 'details', type: 'text' },
      { name: 'status', type: 'select', required: true, maxSelect: 1, values: ['РќРѕРІР°СЏ', 'Р’ СЂР°Р±РѕС‚Рµ', 'Р“РѕС‚РѕРІРѕ'] },
      { name: 'created', type: 'autodate', onCreate: true },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
  })
  app.save(collection)

  const samples = [
    { title: 'РќРµ СЂР°Р±РѕС‚Р°РµС‚ РїСЂРѕРµРєС‚РѕСЂ', room: '214', category: 'РџСЂРѕРµРєС‚РѕСЂ', details: 'РџСЂРѕРµРєС‚РѕСЂ РІРєР»СЋС‡Р°РµС‚СЃСЏ, РЅРѕ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РЅР° СЌРєСЂР°РЅРµ РЅРµС‚.', status: 'РќРѕРІР°СЏ' },
    { title: 'РќРµС‚ РёРЅС‚РµСЂРЅРµС‚Р°', room: '305', category: 'РРЅС‚РµСЂРЅРµС‚', details: 'РќР° РІСЃРµС… РєРѕРјРїСЊСЋС‚РµСЂР°С… РІ РєР°Р±РёРЅРµС‚Рµ РЅРµ РѕС‚РєСЂС‹РІР°СЋС‚СЃСЏ СЃР°Р№С‚С‹.', status: 'Р’ СЂР°Р±РѕС‚Рµ' },
    { title: 'РџСЂРёРЅС‚РµСЂ РЅРµ РїРµС‡Р°С‚Р°РµС‚', room: '112', category: 'РџСЂРёРЅС‚РµСЂ', details: 'РџСЂРёРЅС‚РµСЂ СЃРѕРѕР±С‰Р°РµС‚ Рѕ Р·Р°РјСЏС‚РёРё Р±СѓРјР°РіРё.', status: 'Р“РѕС‚РѕРІРѕ' },
    { title: 'РќРµ РІРєР»СЋС‡Р°РµС‚СЃСЏ РєРѕРјРїСЊСЋС‚РµСЂ', room: '214', category: 'РљРѕРјРїСЊСЋС‚РµСЂ', details: 'РљРѕРјРїСЊСЋС‚РµСЂ РЅРµ СЂРµР°РіРёСЂСѓРµС‚ РЅР° РєРЅРѕРїРєСѓ РїРёС‚Р°РЅРёСЏ.', status: 'РќРѕРІР°СЏ' },
    { title: 'РќРµ СЂР°Р±РѕС‚Р°РµС‚ РјС‹С€СЊ', room: '118', category: 'РљРѕРјРїСЊСЋС‚РµСЂ', details: 'РљСѓСЂСЃРѕСЂ РЅРµ РґРІРёРіР°РµС‚СЃСЏ.', status: 'Р’ СЂР°Р±РѕС‚Рµ' },
  ]
  for (const sample of samples) {
    const record = new Record(collection)
    record.load(sample)
    app.save(record)
  }
}, (app) => {
  app.delete(app.findCollectionByNameOrId('it_requests'))
})
