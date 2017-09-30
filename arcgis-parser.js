'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var globalMercator = require('global-mercator');
var URL = require('url');
var slippyTile = _interopDefault(require('slippy-tile'));

/**
 * Parse Service
 *
 * @param {Object} json
 * @returns {Service} Parsed Service
 */
function parseService (json) {
  const documentInfo = json.documentInfo || {};
  const title = documentInfo.Title || null;
  const version = json.currentVersion || null;

  return {
    type: (title && version) ? 'ArcGIS REST Service' : null,
    version: version,
    title: title
  }
}

/**
 * Clean URL
 *
 * @param {string} url Url
 * @returns {string} Cleaned URL
 */
function clean (url) {
  return url
    .replace(/%3A/g, ':')
    .replace(/%7B/g, '{')
    .replace(/%7D/g, '}')
    .replace(/%2C/g, ',')
}

/**
 * Map Zoom
 *
 * @param {number} scale
 * @returns {number} zoom level
 */
function mapZoom (scale) {
  if (scale === null || scale === undefined) throw new Error('scale is required')
  if (typeof scale !== 'number') throw new Error('scale should be a number')

  const lookup = {
    0: 591657527.591555,
    1: 295828763.795777,
    2: 147914381.897889,
    3: 73957190.948944,
    4: 36978595.474472,
    5: 18489297.737236,
    6: 9244648.868618,
    7: 4622324.434309,
    8: 2311162.217155,
    9: 1155581.108577,
    10: 577790.554289,
    11: 288895.277144,
    12: 144447.638572,
    13: 72223.819286,
    14: 36111.909643,
    15: 18055.954822,
    16: 9027.977411,
    17: 4513.988705,
    18: 2256.994353,
    19: 1128.497176,
    20: 564.248588,
    21: 282.124294,
    22: 141.062147,
    23: 70.5310735,
    24: 35,
    25: 20,
    26: 10,
    27: 5,
    28: 2.5,
    29: 1,
    30: 1
  };
  for (var zoom = 0; zoom < Object.keys(lookup).length; zoom++) {
    if (Math.floor(scale) === Math.floor(lookup[zoom])) return zoom
    if (Math.floor(scale) > Math.floor(lookup[zoom])) {
      if (zoom === 0) return 0
      return zoom - 1
    }
  }
  return null
}

/**
 * Parse Layer
 *
 * @param {string} url
 * @param {Object} json
 * @returns {Layer} Parsed Layer
 */
function parseLayer (url, json) {
  const documentInfo = json.documentInfo || {};
  const title = documentInfo.Title || null;
  var identifier;
  const identifierMatch = url.match(/services\/(.+)\//);
  if (identifierMatch.length > 0) identifier = identifierMatch[1];

  // Formats
  const formats = json.supportedImageFormatTypes;
  var format$$1;
  if (formats.match(/png/i)) format$$1 = 'png';
  else if (formats.match(/jpg/i)) format$$1 = 'jpg';
  else format$$1 = null;

  // BBox
  var bbox = null;
  if (json.fullExtent) {
    const west = json.fullExtent.xmin;
    const south = json.fullExtent.ymin;
    const east = json.fullExtent.xmax;
    const north = json.fullExtent.ymax;
    switch (json.fullExtent.spatialReference.latestWkid) {
      case 3857:
        const westsouth = globalMercator.metersToLngLat([west, south]);
        const eastnorth = globalMercator.metersToLngLat([east, north]);
        bbox = [westsouth[0], westsouth[1], eastnorth[0], eastnorth[1]];
        break
      case 4326:
        bbox = [west, south, east, north];
        break
      default:
        bbox = null;
    }
  }
  var minzoom;
  var maxzoom;
  if (json.minScale && json.maxScale) {
    minzoom = mapZoom(json.minScale);
    maxzoom = mapZoom(json.maxScale);
  }
  return {
    title: title,
    identifier: identifier,
    author: documentInfo.Author || null,
    abstract: documentInfo.Subject || null,
    category: documentInfo.Category || null,
    keywords: documentInfo.Keywords || null,
    format: format$$1,
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
  const parse$$1 = URL.parse(url);
  const isWGS84 = json.spatialReference && json.spatialReference.wkid === 4326;

  // getCapabilities
  parse$$1.search = null;
  parse$$1.query = {f: 'pjson'};
  const getCapabilities = clean(URL.format(parse$$1));

  // Slippy
  var slippy = null;
  if (json.capabilities && json.capabilities.includes('Map')) {
    const formats = json.supportedImageFormatTypes || '';
    const format$$1 = (formats.match(/png/i)) ? 'png' : 'jpg';

    parse$$1.query = {
      bbox: isWGS84 ? '{bbox4326}' : '{bbox3857}',
      bboxSR: isWGS84 ? 'EPSG:4326' : 'EPSG:3857',
      imageSR: 'EPSG:3857',
      size: '256,256',
      format: format$$1,
      transparent: 'true',
      f: 'image'
    };
    parse$$1.path = null;
    parse$$1.pathname = parse$$1.pathname + '/export';
    slippy = clean(URL.format(parse$$1));
  }
  return {
    getCapabilities: getCapabilities,
    slippy: slippy,
    world: slippyTile([0, 0, 0], slippy),
    host: parse$$1.host
  }
}

/**
 * ArcGIS Parser
 *
 * @param {string} url ArcGIS REST service url
 * @param {Object} json MapServer or ImageServer JSON
 * @returns {Metadata} Metadata
 * @example
 * const url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer?f=pjson'
 * const response = await fetch(url)
 * const json = await response.json()
 * const metadata = arcgisParser(url, json)
 * //=metadata
 */
function arcgisParser (url, json) {
  if (!url) throw new Error('url is required')
  if (!json) throw new Error('json is required')

  return {
    service: parseService(json),
    layer: parseLayer(url, json),
    url: parseUrl(url, json)
  }
}

module.exports = arcgisParser;
