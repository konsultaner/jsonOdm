// @flow

export default class Feature {

    /**
     * A GeoJSON feature object
     * @param {jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
     * @param {*} [properties] Additional properties that belong to this feature
     * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
     * @param {*} [id] A unique identifier
     * @constructor
     */
    constructor(geometry, properties, boundaryBox, id) {
        this.geometry = geometry || {};
        if (properties) {
            this.properties = properties;
        }
        if (boundaryBox) {
            this.bbox = boundaryBox;
        }
        if (id) {
            this.id = id;
        }
    }
};