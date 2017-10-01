import * as URL from 'url'
import slippyTile from 'slippy-tile'
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
  const isWGS84 = json.spatialReference && json.spatialReference.wkid === 4326

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
      bbox: isWGS84 ? '{bbox4326}' : '{bbox3857}',
      bboxSR: isWGS84 ? 'EPSG:4326' : 'EPSG:3857',
      imageSR: 'EPSG:3857',
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
      bbox: isWGS84 ? '{bbox4326}' : '{bbox3857}',
      bboxSR: isWGS84 ? 'EPSG:4326' : 'EPSG:3857',
      imageSR: 'EPSG:3857',
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
  if (slippy) world = slippyTile([0, 0, 0], slippy)
  return {
    getCapabilities: getCapabilities,
    slippy: slippy,
    world: world,
    host: parse.host
  }
}
