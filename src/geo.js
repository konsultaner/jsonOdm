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
 * Takes an array and puts it into a GeoJSON geometry definition. If it geometry already is a valid GeoJSON it will only be returned
 * @param {Array|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry
 * @return {boolean|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection}
 */
jsonOdm.Geo.detectAsGeometry = function (geometry) {
    if(!geometry.type){
        if(jsonOdm.util.isArray(geometry) && geometry.length == 2 && !jsonOdm.util.isArray(geometry[0])){
            geometry = new jsonOdm.Geo.Point(geometry);
        }else if(jsonOdm.util.isArray(geometry) && geometry.length == 4 && !jsonOdm.util.isArray(geometry[0])){
            geometry = new jsonOdm.Geo.BoundaryBox(geometry);
        }else if(jsonOdm.util.isArray(geometry) && geometry.length >= 1 && jsonOdm.util.isArray(geometry[0]) && geometry[0].length == 2 && !jsonOdm.util.isArray(geometry[0][0])){
            geometry = new jsonOdm.Geo.LineString(geometry);
        }else if( jsonOdm.util.isArray(geometry) && geometry.length >= 1 &&
            jsonOdm.util.isArray(geometry[0]) && geometry[0].length >= 1 &&
            jsonOdm.util.isArray(geometry[0][0]) && geometry[0][0].length == 2 && !jsonOdm.util.isArray(geometry[0][0][0])){
            geometry = new jsonOdm.Geo.Polygon(geometry);
        }else if( jsonOdm.util.isArray(geometry) && geometry.length >= 1 &&
            jsonOdm.util.isArray(geometry[0]) && geometry[0].length >= 1 &&
            jsonOdm.util.isArray(geometry[0][0]) && geometry[0][0].length >= 1 &&
            jsonOdm.util.isArray(geometry[0][0][0]) && geometry[0][0][0].length == 2 && !jsonOdm.util.isArray(geometry[0][0][0][0])){
            geometry = new jsonOdm.Geo.MultiPolygon(geometry);
        }else return false;
    }
    return geometry;
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
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
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
 * @param {Array} boundaryBox An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var boundaryBox = new jsonOdm.Geo.BoundaryBox([-180.00,-90.00,180.00,90.00]);
 * @constructor
 */
jsonOdm.Geo.BoundaryBox = function (boundaryBox) {
    var self = Object.create( Array.prototype );
    // calls the constructor of Array
    self = (Array.apply(self) || self);
    if(jsonOdm.util.isArray(boundaryBox)){
        self[0] = boundaryBox[0];
        self[1] = boundaryBox[1];
        self[2] = boundaryBox[2];
        self[3] = boundaryBox[3];
    }else{
        self[0] = 0;
        self[1] = 0;
        self[2] = 0;
        self[3] = 0;
    }
    return self;
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
 * Checks whether a Point is inside of another geometry
 * @param {jsonOdm.Geo.Point} point
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.Point.within = function (point,geometry) {
    var i, j;
    if (!point.coordinates) return false;
    if (geometry.type == "Point") return geometry.coordinates[0] == point.coordinates[0] && geometry.coordinates[1] == point.coordinates[1];
    if (geometry.type == "MultiPoint" || geometry.type == "LineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            if (geometry.coordinates[i][0] == point.coordinates[0] && geometry.coordinates[i][1] == point.coordinates[1]) return true;
        }
        return false;
    }
    if (geometry.type == "MultiLineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; geometry.coordinates[i] && j < geometry.coordinates[i].length; j++)
                if (geometry.coordinates[i][j][0] == point.coordinates[0] && geometry.coordinates[i][j][1] == point.coordinates[1]) return true;
        }
        return false;
    }
    if (geometry.type == "Polygon") {
        // we assume that polygon wholes do not intersect the outer polygon
        return jsonOdm.Geo.pointWithinPolygon(point.coordinates, geometry.coordinates ? geometry.coordinates[0] : null)
    }
    if (geometry.type == "MultiPolygon") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            // we assume that polygon wholes do not intersect the outer polygon
            if (jsonOdm.Geo.pointWithinPolygon(point.coordinates, geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) return true;
        }
        return false;
    }
    if(geometry.type == "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for(i = 0; i < geometry.geometries.length; i++){
            if(jsonOdm.Geo.Point.within(point,geometry.geometries[i])) return true;
        }
        return false;
    }
    // might be a boundary box
    return jsonOdm.Geo.pointWithinBounds(point.coordinates,geometry);
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
 * Checks whether a MultiPoint is inside of another geometry
 * @param {jsonOdm.Geo.MultiPoint} multiPoint
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiPoint.within = function (multiPoint,geometry) {
    var i, j, k, found;
    if (!point.coordinates) return false;
    if (geometry.type == "Point") return false;
    if (geometry.type == "MultiPoint" || geometry.type == "LineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            found = false;
            for(j = 0 ; multiPoint.coordinates && j < multiPoint.coordinates.length; j++){
                found = found || geometry.coordinates[i][0] == multiPoint.coordinates[j][0] && geometry.coordinates[i][1] == multiPoint.coordinates[j][1];
            }
            if(!found) return false;
        }
        return true;
    }
    if (geometry.type == "MultiLineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; geometry.coordinates[i] && j < geometry.coordinates[i].length; j++)
                found = false;
                for(k = 0 ; multiPoint.coordinates && k < multiPoint.coordinates.length; k++){
                    if(geometry.coordinates[i][j][0] == multiPoint.coordinates[k][0] && geometry.coordinates[i][j][1] == multiPoint.coordinates[k][1]){
                        found = true;
                        break;
                    }
                }
                if(!found) return false;
        }
        return false;
    }
    if (geometry.type == "Polygon") {
        for(i = 0; multiPoint.coordinates && i < multiPoint.coordinates.length; i++) {
            // we assume that polygon wholes do not intersect the outer polygon
            if(!jsonOdm.Geo.pointWithinPolygon(multiPoint.coordinates[i], geometry.coordinates ? geometry.coordinates[0] : null)) return false;
        }
        return true;
    }
    if (geometry.type == "MultiPolygon") {
        for(j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                // we assume that polygon wholes do not intersect the outer polygon
                if(jsonOdm.Geo.pointWithinPolygon(point.coordinates[j], geometry.coordinates[i] ? geometry.coordinates[i][0] : null)){
                    found = true;
                    break;
                }
            }
            if(!found) return false;
        }
        return true;
    }
    if(geometry.type == "MultiGeometry" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for(i = 0; i < geometry.geometries.length; i++){
            if(jsonOdm.Geo.MultiPoint.within(multiPoint,geometry.geometries[i])) return true;
        }
        return false;
    }
    return false;
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
 * Checks whether a LineString is inside of another geometry
 * @method within
 * @memberof jsonOdm.Geo.LineString
 * @param {jsonOdm.Geo.LineString} lineString
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.LineString.within = jsonOdm.Geo.MultiPoint.within;

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
    this.type = "MultiLineString";
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
 * A GeoJSON MultiPolygon object
 * @param {Array} positions An array of Polygon position arrays
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var polygons = new jsonOdm.Geo.MultiPolygon([
 *    [
 *      [[51.2,32],[51.4,21],[51.6,21],[51.2,21]],
 *      [[51.5,32],[51.6,21],[51.7,21],[51.5,21]]
 *    ],
 *    [
 *      [[51.2,32],[51.4,21],[51.6,21],[51.2,21]],
 *      [[51.5,32],[51.6,21],[51.7,21],[51.5,21]]
 *    ]
 * ]);
 * @constructor
 */
jsonOdm.Geo.MultiPolygon = function (positions,boundaryBox) {
    this.type = "MultiPolygon";
    this.coordinates = positions;
    if(boundaryBox) this.bbox = boundaryBox;
};

/**
 * A GeoJSON GeometryCollection object
 * @param {Array} geometries An array of GeoJSON geometry objects
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var polygons = new jsonOdm.Geo.GeometryCollection([
 *    new jsonOdm.Geo.LineString([[51.5,32.1],[51.6,21]]),
 *    new jsonOdm.Geo.MultiPoint([[51.5,32],[51.6,21]]),
 *    new jsonOdm.Geo.LineString([[51.3,32.2],[51.9,21]])
 * ]);
 * @constructor
 */
jsonOdm.Geo.GeometryCollection = function (geometries,boundaryBox) {
    this.type = "GeometryCollection";
    this.geometries = geometries;
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
        if(polygon[i][0] == point[0] && polygon[i][1] == point[1]) return true; // vertex equals the given point
        if(
            polygon[i][0] < point[0] && polygon[i+1][0] < point[0] || // the vector is only in section 1 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] < point[1] && polygon[i+1][1] < point[1] || // the vector is only in section 1 or 2 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] > point[1] && polygon[i+1][1] > point[1]    // the vector is only in section 3 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
        ){
            continue;
        }
        if((polygon[i][0]-polygon[i+1][0]) * ((point[1]-polygon[i][1])/(polygon[i][1]-polygon[i+1][1])) + polygon[i][0] >= point[1]) intersection++; // the vector intersects the positive x-axis of the coordinate system normalized to the point
    }
    return intersection%2 == 1; // the normalized x-axis needs to be intersected by a odd amount of intersections
};

/**
 * Checks whether a point is inside a boundary box or not
 * @param point
 * @param bounds
 * @return {boolean}
 */
jsonOdm.Geo.pointWithinBounds = function (point, bounds) {
    if(!(jsonOdm.util.isArray(point) && jsonOdm.util.isArray(bounds) && bounds.length == 4)) return false;
    return point[0] >= bounds[0] && point[1] >= bounds[1] && point[0] <= bounds[2] && point[1] <= bounds[3];
};