import fs from 'fs'
import test from 'tape'
import path from 'path'
import glob from 'glob'
import fetch from 'node-fetch'
import load from 'load-json-file'
import write from 'write-json-file'
import { mapZoom } from './src/utils'
import arcgisParser from './'

const urls = {
  'Toronto': 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Toronto/ImageServer',
  'ESRI_Imagery_World_2D': 'https://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer',
  'NatGeo_World_Map': 'https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer',
  'World_Imagery': 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
  'World_Street_Map': 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer',
  'World_Topo_Map': 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer'
}

const out = (filename) => path.join(__dirname, 'test', 'out', filename)

test('arcgis-parse -- parseUrl', t => {
  const json = load.sync(path.join(__dirname, 'test', 'in', 'Toronto.json'))
  const url = urls['Toronto']
  arcgisParser(url, json)
  t.end()
})

test('arcgis-parser -- json', t => {
  glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
    const json = load.sync(filepath)
    const name = path.parse(filepath).name
    const url = urls[name]
    if (!url) return null
    const metadata = arcgisParser(url, json)

    if (process.env.REGEN) {
      write.sync(out(name + '.json'), metadata)
      // Save word thumnail image
      fetch(metadata.url.world).then(response => response.buffer()).then(buffer => {
        fs.writeFileSync(out(name + '.png'), buffer)
      })
    }
    t.deepEqual(metadata, load.sync(out(name + '.json')))
  })
  t.end()
})

test('arcgis-parser.utils -- mapZoom', t => {
  t.equal(mapZoom(282.124294), 21)
  t.equal(mapZoom(1155581.108577), 9)
  t.end()
})
