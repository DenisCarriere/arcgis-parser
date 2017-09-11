declare function arcgisParser(url: arcgisParser.Options | string): Promise<arcgisParser.Metadata>
declare namespace arcgisParser {
  type BBox = [number, number, number, number]
  type Protocol = 'http' | 'https'

  interface Options {
    url?: string
    protocol?: Protocol
    host?: string
    pathname?: string
    service?: string
    query?: {[key: string]: any}
  }

  interface URL {
    getCapabilities: string
    slippy: string
    host: string
  }

  interface Service {
    type: string
    version: string
    title: string
  }

  interface Layer {
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

  interface Metadata {
    service: Service
    layer: Layer
    url: URL
  }
  /**
   * Metadata
   */
  export function metadata(url: Options | string, json: any): Metadata
  /**
   * Format
   */
  export function format(options: Options): string

  /**
   * Get
   */
  export function get(url: Options | string): Promise<any>
}
export = arcgisParser
