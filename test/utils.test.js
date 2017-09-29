import test from 'tape'
import { mapZoom } from '../src/utils'

test('utils -- mapZoom', t => {
  t.equal(mapZoom(282.124294), 21)
  t.equal(mapZoom(1155581.108577), 9)
  t.end()
})
