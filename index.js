import parseService from './src/parse-service'
import parseLayer from './src/parse-layer'
import parseUrl from './src/parse-url'

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
export default function arcgisParser (url, json) {
  if (!url) throw new Error('url is required')
  if (!json) throw new Error('json is required')

  return {
    service: parseService(json),
    layer: parseLayer(url, json),
    url: parseUrl(url, json)
  }
}
