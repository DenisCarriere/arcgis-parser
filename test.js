const path = require('path')
const write = require('write-json-file')
const load = require('load-json-file')
const arcgisParser = require('./')
const test = require('tape')

const out = (filename) => path.join(__dirname, 'test', 'out', filename)

test('arcgis-parser', async t => {
  // Using Options
  const service = 'ESRI_Imagery_World_2D'
  arcgisParser({service: service}).then(metadata => {
    const output = out(service + '.json')
    if (process.env.REGEN) write.sync(output, metadata)
    t.deepEqual(metadata, load.sync(output))
  }).catch(error => t.fail(error))

  // Using full URL
  arcgisParser('https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer').then(metadata => {
    const output = out('NatGeo_World_Map' + '.json')
    if (process.env.REGEN) write.sync(output, metadata)
    t.deepEqual(metadata, load.sync(output))
  }).catch(error => t.fail(error))

  t.end()
})
