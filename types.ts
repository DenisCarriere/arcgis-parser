import arcgisParser from './'

async function main() {
  const url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer?f=pjson'
  const response = await fetch(url)
  const json = await response.json()
  const metadata = arcgisParser(url, json)

  // Metadata.Url
  metadata.url.slippy

  // Metadata.Layer
  metadata.layer.title
  metadata.layer.identifier

  // Metadata.Service
  metadata.service.version
}