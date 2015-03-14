"use strict";

/**
 * The object to provide geographical data and methods. <br>
 * <strong style='color:#ff0000'>Warning:</strong> The coordinate reference system is <a href="http://spatialreference.org/ref/epsg/4326/" target="_blank">WGS 84</a>
 * witch uses the coordinate order [<strong>longitude</strong>,<strong>latitude</strong>]!<br>
 * Changing the coordinate reference system (CRS) is not supported yet.
 * @module jsonOdm.Geo
 * @constructor
 */
jsonOdm.Geo = function () {

};

/**
 * The GeoJSON FeatureCollection object
 * @param {jsonOdm.Geo.Feature[]|Array} features
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @constructor
 */
jsonOdm.Geo.FeatureCollection = function (features,boundaryBox) {
    this.type = "FeatureCollection";
    this.features = features || [];
    if(boundaryBox) this.bbox = boundaryBox;
};

/**
 * A GeoJSON feature object
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @param {*} [properties] Additional properties that belong to this feature
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @param {*} [id] A unique identifier
 * @constructor
 */
jsonOdm.Geo.Feature = function (geometry,properties,boundaryBox,id) {
    this.geometry = geometry || {};
    if(properties) this.properties = properties;
    if(boundaryBox) this.bbox = boundaryBox;
    if(id) this.id = id;
};

/**
 * A GeoJSON Point object
 * @param {Array} position A 2-dimensional array with the first entry being the longitude and the second one being the latitude, i.e. [51,32]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var point = new jsonOdm.Geo.Point([51.5,32]);
 * @constructor
 */
jsonOdm.Geo.Point = function (position,boundaryBox) {
    this.type = "Point";
    this.coordinates = position;
    if(boundaryBox) this.bbox = boundaryBox;
};

/**
 * A GeoJSON MultiPoint object
 * @param {Array} positions An array of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude, i.e. [[51,32],[51.4,21]]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var multiPoint = new jsonOdm.Geo.MultiPoint([
 *    [51.5,32],[51.6,21]
 * ]);
 * @constructor
 */
jsonOdm.Geo.MultiPoint = function (positions,boundaryBox) {
    this.type = "MultiPoint";
    this.coordinates = positions;
    if(boundaryBox) this.bbox = boundaryBox;
};

/**
 * A GeoJSON LineString object
 * @param {Array} positions An at least 2-dimensional array of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude, i.e. [[51,32],[51.4,21]]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var lineString = new jsonOdm.Geo.LineString([
 *    [51.5,32],[51.6,21]
 * ]);
 * @constructor
 */
jsonOdm.Geo.LineString = function (positions,boundaryBox) {
    this.type = "LineString";
    this.coordinates = positions;
    if(boundaryBox) this.bbox = boundaryBox;
};

/**
 * A GeoJSON MultiLineString object
 * @param {Array} positions An array of arrays with at least 2-dimensional arrays of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude.
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var multiLineString = new jsonOdm.Geo.MultiLineString([
 *    [[51.2,32],[51.4,21]],
 *    [[51.5,32],[51.6,21]]
 * ]);
 * @constructor
 */
jsonOdm.Geo.MultiLineString = function (positions,boundaryBox) {
    this.type = "LineString";
    this.coordinates = positions;
    if(boundaryBox) this.bbox = boundaryBox;
};

/**
 * A GeoJSON Polygon object
 * @param {Array} positions An array of arrays with at least 2-dimensional arrays of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude.
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var polygon = new jsonOdm.Geo.Polygon([
 *    // The last position should be equal to the first one to close the polygon
 *    [[51.2,32],[51.4,21],[51.6,21],[51.2,21]],
 *    // Must be fully inside the n-1th poly-line
 *    [[51.5,32],[51.6,21],[51.7,21],[51.5,21]]
 *    // more inner holes might follow
 * ]);
 * @constructor
 */
jsonOdm.Geo.Polygon = function (positions,boundaryBox) {
    this.type = "Polygon";
    this.coordinates = positions;
    if(boundaryBox) this.bbox = boundaryBox;
};

/**
 * The method checks whether a point is inside a polygon or not. The polygon will be auto closed
 * @param {Array} point A point representation i.e. [1,2]
 * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.pointWithinPolygon = function (point,polygon) {
    if(!(jsonOdm.util.isArray(point) && jsonOdm.util.isArray(polygon) && polygon.length > 2)) return false;

    var isClosed = polygon[0][0] == polygon[polygon.length-1][0] && polygon[0][1] == polygon[polygon.length-1][1];
    var intersection = 0;

    // close the polygon
    if(!isClosed) polygon = polygon.concat([polygon[0]]);

    // do not enter the last point because the calculation also reads the i+1th index
    for(var i = 0; i < polygon.length - 1; i++){
        if(
            polygon[i][0] < point[0] && polygon[i+1][0] < point[0] || // the vector is only in section 1 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] < point[1] && polygon[i+1][1] < point[1] || // the vector is only in section 1 or 2 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] > point[1] && polygon[i+1][1] > point[1]    // the vector is only in section 3 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
        ){
            continue;
        }
        var n1 = [polygon[i][0]-point[0],polygon[i][1]-point[1]],
            n2 = [polygon[i+1][0]-point[0],polygon[i+1][1]-point[1]];

        if((n1[0]-n2[0])*(-n1[1]/n1[1]-n2[1])+n1[0] >= 0) intersection++; // the vector intersects the positive x-axis of the coordinate system normalized to the point
    }
    return intersection%2 == 1; // the normalized x-axis needs to be intersected by a odd amount of intersections
};