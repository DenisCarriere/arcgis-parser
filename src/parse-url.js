import * as URL from 'url'
import parseLayer from './parse-layer'
import { clean } from './utils'

/**
 * Parse URL
 *
 * @param {string} url
 * @param {Object} json
 * @returns {URL} Parsed URL
 */
export default function parseUrl (url, json) {
  const parse = URL.parse(url)

  // getCapabilities
  parse.search = null
  parse.query = {f: 'pjson'}
  const getCapabilities = clean(URL.format(parse))

  // Slippy
  var slippy = null

  // Map Server
  if (json.capabilities && json.capabilities.includes('Map')) {
    const formats = json.supportedImageFormatTypes || ''
    const format = (formats.match(/png/i)) ? 'png' : 'jpg'

    parse.query = {
      bbox: '{bbox4326}',
      bboxSR: '4326',
      imageSR: '3857',
      size: '256,256',
      format: format,
      transparent: 'true',
      noData: 0,
      f: 'image'
    }
    parse.path = null
    parse.pathname = parse.pathname + '/export'
    slippy = clean(URL.format(parse))
  }
  // Image Server
  if (json.capabilities && json.capabilities.includes('Image')) {
    const formats = json.supportedImageFormatTypes || ''
    const format = (formats.match(/png/i)) ? 'png' : 'jpg'

    parse.query = {
      bbox: '{bbox4326}',
      bboxSR: '4326',
      imageSR: '3857',
      size: '256,256',
      format: format,
      transparent: 'true',
      noData: 0,
      f: 'image'
    }
    parse.path = null
    parse.pathname = parse.pathname + '/exportImage'
    slippy = clean(URL.format(parse))
  }
  var world = null
  if (slippy) {
    let bbox = parseLayer(url, json).bbox
    // EPSG:3857 doesn't support latitudes higher than 85 degrees
    if (bbox[1] < -85) bbox[1] = -85
    if (bbox[3] > 85) bbox[3] = 85
    world = slippy.replace(/{bbox4326}/, bbox.join(','))
  }
  return {
    getCapabilities: getCapabilities,
    slippy: slippy,
    world: world,
    host: parse.host
  }
}
