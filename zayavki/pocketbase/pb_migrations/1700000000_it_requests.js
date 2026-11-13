migrate((app) => {
  const collection = new Collection({
    type: 'base',
    name: 'it_requests',
    listRule: '',
    viewRule: '',
    createRule: '@request.body.status = "Новая"',
    updateRule: '@request.body.title:isset = false && @request.body.room:isset = false && @request.body.details:isset = false',
    deleteRule: 'status = "Готово"',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'room', type: 'text', required: true },
      { name: 'category', type: 'select', required: true, maxSelect: 1, values: ['Компьютер', 'Проектор', 'Принтер', 'Интернет'] },
      { name: 'details', type: 'text' },
      { name: 'status', type: 'select', required: true, maxSelect: 1, values: ['Новая', 'В работе', 'Готово'] },
      { name: 'created', type: 'autodate', onCreate: true },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
  })
  app.save(collection)

  const samples = [
    { title: 'Не работает проектор', room: '214', category: 'Проектор', details: 'Проектор включается, но изображения на экране нет.', status: 'Новая' },
    { title: 'Нет интернета', room: '305', category: 'Интернет', details: 'На всех компьютерах в кабинете не открываются сайты.', status: 'В работе' },
    { title: 'Принтер не печатает', room: '112', category: 'Принтер', details: 'Принтер сообщает о замятии бумаги.', status: 'Готово' },
    { title: 'Не включается компьютер', room: '214', category: 'Компьютер', details: 'Компьютер не реагирует на кнопку питания.', status: 'Новая' },
    { title: 'Не работает мышь', room: '118', category: 'Компьютер', details: 'Курсор не двигается.', status: 'В работе' },
  ]
  for (const sample of samples) {
    const record = new Record(collection)
    record.load(sample)
    app.save(record)
  }
}, (app) => {
  app.delete(app.findCollectionByNameOrId('it_requests'))
})
