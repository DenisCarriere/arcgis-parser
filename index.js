const get = require('./src/get')
const format = require('./src/format')
const metadata = require('./src/metadata')

/**
 * Get Metadata from ArcGIS REST Service
 *
 * @param {string|Object} options Options
 * @param {string} [options.url] Url
 * @param {Protocol} [options.protocol='https'] Protocol
 * @param {string} [options.host='services.arcgisonline.com'] Host
 * @param {string} [options.pathname='/arcgis/rest/services/{service}/MapServer'] Pathname
 * @param {Object} [options.query={f: 'pjson'}] Query
 * @param {string} [options.service] ArcGIS Service Name
 * @returns {Promise<Metadata>} Metadata
 * @example
 * const metadata = await arcgisParser({service: 'World_Imagery'})
 */
module.exports = function (options) {
  const url = format(options)
  return get(url)
    .then(json => metadata(url, json))
    .catch(error => { throw new Error(error) })
}
