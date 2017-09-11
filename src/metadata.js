const URL = require('url')
const get = require('./get')
const mapZoom = require('./map-zoom')
const globalMercator = require('global-mercator')

/**
 * @typedef {'png'|'jpg'} Format
 */

/**
 * @typedef {[number, number, number, number]} BBox
 */

/**
 * ArcGIS REST Service Metadata
 *
 * @typedef {Object} Metadata
 * @property {Layer} layer
 * @property {Service} service
 * @property {URL} url
 */

/**
 * Metadata.Layer
 *
 * @typedef {Object} Layer
 * @property {string} title
 * @property {string} identifier
 * @property {string} author
 * @property {string} abstract
 * @property {string} category
 * @property {string} keywords
 * @property {string} format
 * @property {string} formats
 * @property {number} minzoom
 * @property {number} maxzoom
 * @property {BBox} bbox
 */

/**
 * Metadata.Service
 *
 * @typedef {Object} Service
 * @property {string} type
 * @property {string} version
 * @property {string} title
 */

/**
 * Metadata.URL
 *
 * @typedef {Object} URL
 * @property {string} getCapabilities
 * @property {string} slippy
 * @property {string} host
 */

/**
 * Parse Service
 *
 * @param {Object} json
 * @returns {Service} Parsed Service
 */
function parseService (json) {
  const documentInfo = json.documentInfo || {}
  const title = documentInfo.Title || null
  const version = json.currentVersion || null

  return {
    type: (title && version) ? 'ArcGIS REST Service' : null,
    version: version,
    title: title
  }
}

/**
 * Parse Layer
 *
 * @param {string} url
 * @param {Object} json
 * @returns {Layer} Parsed Layer
 */
function parseLayer (url, json) {
  const documentInfo = json.documentInfo || {}
  const title = documentInfo.Title || null
  var identifier
  const identifierMatch = url.match(/services\/(.+)\//)
  if (identifierMatch.length > 0) identifier = identifierMatch[1]

  // Formats
  const formats = json.supportedImageFormatTypes
  var format
  if (formats.match(/png/i)) format = 'png'
  else if (formats.match(/jpg/i)) format = 'jpg'
  else format = null

  // BBox
  var bbox = null
  if (json.fullExtent) {
    const west = json.fullExtent.xmin
    const south = json.fullExtent.ymin
    const east = json.fullExtent.xmax
    const north = json.fullExtent.ymax
    switch (json.fullExtent.spatialReference.latestWkid) {
      case 3857:
        const westsouth = globalMercator.metersToLngLat([west, south])
        const eastnorth = globalMercator.metersToLngLat([east, north])
        bbox = [westsouth[0], westsouth[1], eastnorth[0], eastnorth[1]]
        break
      case 4326:
        bbox = [west, south, east, north]
        break
      default:
        bbox = null
    }
  }
  var minzoom
  var maxzoom
  if (json.minScale && json.maxScale) {
    minzoom = mapZoom(json.minScale)
    maxzoom = mapZoom(json.maxScale)
  }
  return {
    title: title,
    identifier: identifier,
    author: documentInfo.Author || null,
    abstract: documentInfo.Subject || null,
    category: documentInfo.Category || null,
    keywords: documentInfo.Keywords || null,
    format: format,
    formats: formats,
    minzoom: minzoom,
    maxzoom: maxzoom,
    bbox: bbox
  }
}

/**
 * Parse URL
 *
 * @param {string} url
 * @param {Object} json
 * @returns {URL} Parsed URL
 */
function parseUrl (url, json) {
  const parse = URL.parse(url)
  // getCapabilities
  parse.search = null
  parse.query = {f: 'pjson'}
  const getCapabilities = URL.format(parse).replace(/%7B/g, '{').replace(/%7D/g, '}')

  // Slippy
  var slippy = null
  if (json.capabilities && json.capabilities.includes('Map')) {
    const formats = json.supportedImageFormatTypes || ''
    const format = (formats.match(/png/i)) ? 'png' : 'jpg'
    parse.query = {
      bbox: '{bbox}',
      bboxSR: '{srs}',
      imageSR: '{srs}',
      size: '256,256',
      format: format,
      transparent: 'true'
    }
    slippy = URL.format(parse).replace(/%7B/g, '{').replace(/%7D/g, '}').replace(/%2C/g, ',')
  }
  return {
    getCapabilities: getCapabilities,
    slippy: slippy,
    host: parse.host
  }
}

/**
 * Metadata
 *
 * @param {string|Object} url
 * @param {Object} json
 * @returns {Metadata} Metadata
 */
module.exports = function metadata (url, json) {
  if (!url) throw new Error('url is required')
  if (!json) throw new Error('json is required')

  return {
    service: parseService(json),
    layer: parseLayer(url, json),
    url: parseUrl(url, json)
  }
}
