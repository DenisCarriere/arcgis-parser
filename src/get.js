const https = require('https')
const http = require('http')
const URL = require('url')
const format = require('./format')

/**
 * Get JSON
 *
 * @param {Object|string} url
 * @returns {Promise<Object>} JSON results
 * @example
 * get({service: 'ESRI_Imagery_World_2D'})
 *   .then(capabilities => capabilities)
 */
module.exports = function get (url) {
  if (!url) throw new Error('url is required')
  if (typeof url === 'object') url = format(url)

  // Support both HTTP & HTTPS
  var request = (URL.parse(url).protocol === 'https:') ? request = https : request = http

  return new Promise((resolve, reject) => {
    request.get(url, response => {
      // if (!response.headers['content-type'].match(/application\/json/i)) return reject('content-type must be application/json')

      var data = ''
      response.on('data', chunk => {
        data += chunk
      })
      response.on('end', () => {
        return resolve(JSON.parse(data))
      })
    })
  })
}
