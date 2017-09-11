const test = require('tape')
const format = require('./format')

test('format', t => {
  t.equal(format({service: 'World_Topo_Map'}), 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer?f=pjson', '{service}')
  t.equal(format({url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer'}), 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer?f=pjson', '{url}')
  t.equal(format('https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer'), 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer?f=pjson', 'string')
  t.end()
})

test('format -- throws', t => {
  t.throws(() => format(null), /options is required/, 'options is required')
  t.end()
})
