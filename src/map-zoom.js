/**
 * Map Zoom
 *
 * @param {number} scale
 * @returns {number} zoom level
 */
module.exports = function mapZoom (scale) {
  if (scale === null || scale === undefined) throw new Error('scale is required')
  if (typeof scale !== 'number') throw new Error('scale should be a number')

  const lookup = {
    0: 591657527.591555,
    1: 295828763.795777,
    2: 147914381.897889,
    3: 73957190.948944,
    4: 36978595.474472,
    5: 18489297.737236,
    6: 9244648.868618,
    7: 4622324.434309,
    8: 2311162.217155,
    9: 1155581.108577,
    10: 577790.554289,
    11: 288895.277144,
    12: 144447.638572,
    13: 72223.819286,
    14: 36111.909643,
    15: 18055.954822,
    16: 9027.977411,
    17: 4513.988705,
    18: 2256.994353,
    19: 1128.497176,
    20: 564.248588,
    21: 282.124294,
    22: 141.062147,
    23: 70.5310735,
    24: 35,
    25: 20,
    26: 10,
    27: 5,
    28: 2.5,
    29: 1,
    30: 1
  }
  for (var zoom = 0; zoom < Object.keys(lookup).length; zoom++) {
    if (Math.floor(scale) === Math.floor(lookup[zoom])) return zoom
    if (Math.floor(scale) > Math.floor(lookup[zoom])) {
      if (zoom === 0) return 0
      return zoom - 1
    }
  }
  return null
}
