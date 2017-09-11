const path = require('path')
const test = require('tape')
const write = require('write-json-file')
const load = require('load-json-file')
const metadata = require('./metadata')
const format = require('./format')

const testPath = (folder, filename) => path.join(__dirname, '..', 'test', folder, filename)
const services = ['World_Topo_Map', 'World_Imagery']

test('metadata -- services', t => {
  services.forEach(service => {
    const url = format({service: service})
    const input = load.sync(testPath('in', service + '.json'))
    const output = testPath('out', service + '.json')

    const results = metadata(url, input)
    if (process.env.REGEN) write.sync(output, results)
    t.deepEqual(results, load.sync(output))
  })
  t.end()
})

test('metadata -- throws', t => {
  t.end()
})
