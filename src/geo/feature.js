// @flow

import Geometry from "./geometry";

/**
 * A GeoJSON feature object
 * @param {Point|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
 * @param {*} [properties] Additional properties that belong to this feature
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @param {*} [id] A unique identifier
 */
export default class Feature extends Geometry {

    constructor(geometry, properties, boundaryBox, id) {
        super(boundaryBox);
        this.geometry = geometry || {};
        if (properties) {
            this.properties = properties;
        }
        if (id) {
            this.id = id;
        }
    }
};