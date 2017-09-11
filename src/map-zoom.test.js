const test = require('tape')
const mapZoom = require('./map-zoom')

test('map-zoom', t => {
  t.equal(mapZoom(282.124294), 21)
  t.equal(mapZoom(1155581.108577), 9)
  t.end()
})
