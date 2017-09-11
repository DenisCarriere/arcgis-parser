const https = require('https')
const format = require('./format')

/**
 * Get JSON
 *
 * @param {Object|string} url
 * @returns {Promise<Object>} JSON results
 */
module.exports = function get (url) {
  if (!url) throw new Error('url is required')
  if (typeof url === 'object') url = format(url)

  return new Promise((resolve, reject) => {
    https.get(url, response => {
      let data = ''
      response.on('data', chunk => {
        data += chunk
      })
      response.on('end', () => {
        return resolve(JSON.parse(data))
      })
    })
  })
}
