const test = require('tape')
const format = require('../').format

test('format', t => {
  t.equal(format({service: 'World_Topo_Map'}), 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer?f=pjson')
  t.end()
})

test('format -- throws', t => {
  t.throws(() => format(null), /options.pathname or options.service is required/, 'options.pathname or options.service is required')
  t.end()
})
