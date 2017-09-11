import * as arcgisParser from './'

async function main() {
  arcgisParser('https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer')

  // Metadata
  const metadata = await arcgisParser({service: 'NatGeo_World_Map'})

  // Metadata.Url
  metadata.url.slippy

  // Metadata.Layer
  metadata.layer.title
  metadata.layer.identifier

  // Metadata.Service
  metadata.service.version
}