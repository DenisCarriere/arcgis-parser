export type BBox = [number, number, number, number]
export type Protocol = 'http' | 'https'

export interface URL {
  getCapabilities: string
  slippy: string
  world: string
  host: string
}

export interface Service {
  type: string
  version: string
  title: string
}

export interface Layer {
  title: string
  identifier: string
  author: string
  abstract: string
  category: string
  keywords: string
  format: string
  formats: string
  minzoom: number
  maxzoom: number
  bbox: BBox
}

export interface Metadata {
  service: Service
  layer: Layer
  url: URL
}
/**
 * ArcGIS Parser
 *
 * @param url ArcGIS REST service url
 * @param json MapServer or ImageServer JSON
 */
export default function arcgisParser(url: string, json: object): Metadata
