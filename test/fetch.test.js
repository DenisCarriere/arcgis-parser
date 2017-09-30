import test from 'tape'
import fetch from 'node-fetch'
import arcgisParser from '../'

test('arcgis-parser -- fetch', t => {
  const url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer?f=pjson'
  fetch(url).then(response => response.json()).then(json => {
    const metadata = arcgisParser(url, json)
    t.assert(metadata, 'metadata')
  })
  t.end()
})
