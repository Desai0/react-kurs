migrate((app) => {
  const collection = app.findCollectionByNameOrId('it_requests')
  collection.updateRule = '@request.body.title:isset = false && @request.body.room:isset = false && @request.body.details:isset = false && (@request.body.status:isset = false || (status = "РќРѕРІР°СЏ" && @request.body.status = "Р’ СЂР°Р±РѕС‚Рµ") || (status = "Р’ СЂР°Р±РѕС‚Рµ" && @request.body.status = "Р“РѕС‚РѕРІРѕ"))'
  app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId('it_requests')
  collection.updateRule = '@request.body.title:isset = false && @request.body.room:isset = false && @request.body.details:isset = false'
  app.save(collection)
})
