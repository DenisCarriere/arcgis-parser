const path = require('path')
const test = require('tape')
const write = require('write-json-file')
const load = require('load-json-file')
const get = require('./get')

const out = (filename) => path.join(__dirname, '..', 'test', 'in', filename)
const services = ['World_Topo_Map', 'World_Imagery']

if (process.env.REGEN) {
  test('get -- services', t => {
    services.forEach(service => {
      get({service: service}).then(capabilities => {
        const output = out(service + '.json')
        write.sync(output, capabilities)
        t.deepEqual(capabilities, load.sync(output))
      })
    })
    t.end()
  })
}

test('get -- string', t => {
  get('https://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer?f=pjson').then(capabilities => {
    t.notDeepEqual(capabilities, {})
  })
  get({service: 'ESRI_Imagery_World_2D'}).then(capabilities => {
    t.notDeepEqual(capabilities, {})
  })
  t.end()
})

test('get -- throws', t => {
  t.throws(() => get(null), /url is required/)
  t.throws(() => get(''), /url is required/)
  t.end()
})
