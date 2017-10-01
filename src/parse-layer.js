import { metersToLngLat } from 'global-mercator'
import { mapZoom } from './utils'

/**
 * @typedef {Object} Layer
 * @property {string} title
 * @property {string} identifier
 * @property {string} author
 * @property {string} abstract
 * @property {string} attribution
 * @property {string} category
 * @property {string} keywords
 * @property {string} format
 * @property {string} formats
 * @property {number} minzoom
 * @property {number} maxzoom
 * @property {Array<number>} bbox
 */

/**
 * Parse Layer
 *
 * @param {string} url
 * @param {Object} json
 * @returns {Layer} Parsed Layer
 */
export default function parseLayer (url, json) {
  const documentInfo = json.documentInfo || {}
  const title = documentInfo.Title || null
  var identifier
  const identifierMatch = url.match(/services\/(.+)\//)
  if (identifierMatch.length > 0) identifier = identifierMatch[1]

  // Formats
  var format = 'jpg'
  const formats = json.supportedImageFormatTypes || ''
  if (formats.match(/png/i)) format = 'png'
  else if (formats.match(/jpg/i)) format = 'jpg'

  // BBox
  var bbox = null
  if (json.fullExtent) {
    const west = json.fullExtent.xmin
    const south = json.fullExtent.ymin
    const east = json.fullExtent.xmax
    const north = json.fullExtent.ymax
    switch (json.fullExtent.spatialReference.latestWkid) {
      case 3857:
        const westsouth = metersToLngLat([west, south])
        const eastnorth = metersToLngLat([east, north])
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
    minzoom = (json.minScale !== 0) ? mapZoom(json.minScale) : 0
    maxzoom = (json.maxScale !== 0) ? mapZoom(json.maxScale) : 18
  }
  minzoom = minzoom || 0
  maxzoom = maxzoom || 18
  return {
    title: title,
    identifier: identifier,
    author: documentInfo.Author || null,
    abstract: json.description || json.serviceDescription || null,
    attribution: json.copyrightText || null,
    category: documentInfo.Category || null,
    keywords: documentInfo.Keywords || null,
    format: format,
    formats: formats,
    minzoom: minzoom,
    maxzoom: maxzoom,
    bbox: bbox
  }
}
