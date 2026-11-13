migrate((app) => {
  const collection = app.findCollectionByNameOrId('it_requests')
  collection.updateRule = '@request.body.title:isset = false && @request.body.room:isset = false && @request.body.details:isset = false && (@request.body.status:isset = false || (status = "Новая" && @request.body.status = "В работе") || (status = "В работе" && @request.body.status = "Готово"))'
  app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId('it_requests')
  collection.updateRule = '@request.body.title:isset = false && @request.body.room:isset = false && @request.body.details:isset = false'
  app.save(collection)
})
