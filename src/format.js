const url = require('url')

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
 * Default URL
 *
 * @param {Object} options
 * @param {Protocol} [options.protocol]
 * @param {string} [options.host]
 * @param {string} [options.pathname]
 * @param {string} [options.service]
 * @param {Object} [options.query]
 */
module.exports = function format (options) {
  options = options || {}
  const protocol = options.protocol || defaults.protocol
  const host = options.host || defaults.host
  let pathname = options.pathname || defaults.pathname
  if (pathname.includes('{service}') && options.service) pathname = defaults.pathname.replace('{service}', options.service)
  else throw new Error('options.pathname or options.service is required')
  const query = options.query || defaults.query
  return url.format({
    protocol: protocol,
    host: host,
    pathname: pathname,
    query: query
  })
}
