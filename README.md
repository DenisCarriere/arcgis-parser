# ArcGIS Parser

[![Build Status](https://travis-ci.org/DenisCarriere/arcgis-parser.svg?branch=master)](https://travis-ci.org/DenisCarriere/arcgis-parser)
[![npm version](https://badge.fury.io/js/arcgis-parser.svg)](https://badge.fury.io/js/arcgis-parser)
[![Coverage Status](https://coveralls.io/repos/github/DenisCarriere/arcgis-parser/badge.svg?branch=master)](https://coveralls.io/github/DenisCarriere/arcgis-parser?branch=master)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DenisCarriere/arcgis-parser/master/LICENSE)
[![ES5](https://camo.githubusercontent.com/d341caa63123c99b79fda7f8efdc29b35f9f2e70/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f65732d352d627269676874677265656e2e737667)](http://kangax.github.io/compat-table/es5/)

<!-- Line Break -->

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Parser for ArcGIS REST Services to human friendly JSON.

## Install

**npm**

```bash
$ npm install --save arcgis-parser
```

**web**

```html
<script src="https://wzrd.in/standalone/arcgis-parser@latest"></script>
```

## Quickstart

```javascript
const fs = require('fs')
const xml = fs.readFileSync('ogc-wmts.xml', 'utf8')
const capabilities = ogcParser.wmts(xml)
capabilities.service.type
//=OGC WMTS
capabilities.service.version
//=1.0.0
capabilities.url.getCapabilities
//=http://localhost:80/WMTS/1.0.0/WMTSCapabilities.xml
```

**MapServer?f=pjson**

```json
{
 "currentVersion": 10.3,
 "serviceDescription": "This map is in ...",
 "mapName": "Layers",
 "description": "This map presents low-resolution ...",
 "copyrightText": "Copyright:© 2013 ESRI, i-cubed, GeoEye",
 "supportsDynamicLayers": false,
 "layers": [
  {
   "id": 0,
   "name": "World Imagery",
   "parentLayerId": -1,
   "defaultVisibility": true,
   "subLayerIds": null,
   "minScale": 0,
   "maxScale": 0
  }
 ],
...
```

**capabilities**

```json
```