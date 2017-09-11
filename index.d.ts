export type Protocol = 'http' | 'https'

export interface Format {
  protocol?: Protocol
  host?: string
  pathname?: string
  service?: string
  query?: {[key: string]: any}
}

/**
 * Format
 */
export function format(options: Format): string

/**
 * Get
 */
export function get(url: Format | string): any