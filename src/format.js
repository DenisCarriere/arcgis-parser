const URL = require('url')

const defaults = {
  protocol: 'https',
  host: 'services.arcgisonline.com',
  pathname: '/arcgis/rest/services/{service}/MapServer',
  query: {f: 'pjson'}
}

/**
 * @typedef {'https'|'http'} Protocol
 */

/**
 * Format URL
 *
 * @param {Object|string} options
 * @param {string} [options.url] Url
 * @param {Protocol} [options.protocol='https'] Protocol
 * @param {string} [options.host='services.arcgisonline.com'] Host
 * @param {string} [options.pathname='/arcgis/rest/services/{service}/MapServer'] Pathname
 * @param {Object} [options.query={f: 'pjson'}] Query
 * @param {string} [options.service] ArcGIS Service Name
 * @example
 * const url = format({service: 'World_Topo_Map'})
 * //='https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer?f=pjson
 */
module.exports = function format (options) {
  if (options === null || options === undefined) throw new Error('options is required')
  options = options || {}
  if (typeof options === 'string') options = {url: options}

  const parse = URL.parse(options.url || '')
  const protocol = options.protocol || parse.protocol || defaults.protocol
  const host = options.host || parse.host || defaults.host
  const query = options.query || parse.query || defaults.query
  var pathname = options.pathname || parse.pathname || defaults.pathname

  // Easy access to Online ArcGIS Service
  if (pathname.includes('{service}') && options.service) pathname = defaults.pathname.replace('{service}', options.service)

  if (!host) throw new Error('options.host is required')
  if (!protocol) throw new Error('options.protocol is required')
  if (!pathname) throw new Error('options.pathname is required')

  // console.log(pathname)
  return URL.format({
    protocol: protocol,
    host: host,
    pathname: pathname,
    query: query
  })
}
