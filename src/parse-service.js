/**
 * @typedef {Object} Service
 * @property {string} type
 * @property {string} version
 * @property {string} title
 */

/**
 * Parse Service
 *
 * @param {Object} json
 * @returns {Service} Parsed Service
 */
export default function parseService (json) {
  const documentInfo = json.documentInfo || {}
  const title = documentInfo.Title || null
  const version = json.currentVersion || null

  return {
    type: (title && version) ? 'ArcGIS REST Service' : null,
    version: version,
    title: title
  }
}
