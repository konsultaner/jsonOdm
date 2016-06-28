"use strict";

// for code climate recognition
if (typeof jsonOdm === "undefined") {
    var jsonOdm = new JsonOdm();
}

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
    if (!geometry.type) {
        if (jsonOdm.util.isArray(geometry) && geometry.length === 2 && !jsonOdm.util.isArray(geometry[0])) {
            geometry = new jsonOdm.Geo.Point(geometry);
        } else if (jsonOdm.util.isArray(geometry) && geometry.length === 4 && !jsonOdm.util.isArray(geometry[0])) {
            geometry = new jsonOdm.Geo.BoundaryBox(geometry);
        } else if (jsonOdm.util.isArray(geometry) && geometry.length >= 1 && jsonOdm.util.isArray(geometry[0]) && geometry[0].length === 2 && !jsonOdm.util.isArray(geometry[0][0])) {
            geometry = new jsonOdm.Geo.LineString(geometry);
        } else if (jsonOdm.util.isArray(geometry) && geometry.length >= 1 &&
            jsonOdm.util.isArray(geometry[0]) && geometry[0].length >= 1 &&
            jsonOdm.util.isArray(geometry[0][0]) && geometry[0][0].length === 2 && !jsonOdm.util.isArray(geometry[0][0][0])) {
            geometry = new jsonOdm.Geo.Polygon(geometry);
        } else if (jsonOdm.util.isArray(geometry) && geometry.length >= 1 &&
            jsonOdm.util.isArray(geometry[0]) && geometry[0].length >= 1 &&
            jsonOdm.util.isArray(geometry[0][0]) && geometry[0][0].length >= 1 &&
            jsonOdm.util.isArray(geometry[0][0][0]) && geometry[0][0][0].length === 2 && !jsonOdm.util.isArray(geometry[0][0][0][0])) {
            geometry = new jsonOdm.Geo.MultiPolygon(geometry);
        } else {
            return false;
        }
    }
    return geometry;
};

/**
 * The GeoJSON FeatureCollection object
 * @param {jsonOdm.Geo.Feature[]|Array} features
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @constructor
 */
jsonOdm.Geo.FeatureCollection = function (features, boundaryBox) {
    this.type = "FeatureCollection";
    this.features = features || [];
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * A GeoJSON feature object
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @param {*} [properties] Additional properties that belong to this feature
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @param {*} [id] A unique identifier
 * @constructor
 */
jsonOdm.Geo.Feature = function (geometry, properties, boundaryBox, id) {
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
};

/**
 * A GeoJSON BoundaryBox object
 * @param {Array} boundaryBox An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var boundaryBox = new jsonOdm.Geo.BoundaryBox([-180.00,-90.00,180.00,90.00]);
 * @constructor
 */
jsonOdm.Geo.BoundaryBox = function (boundaryBox) {
    var self = Object.create(Array.prototype);
    // calls the constructor of Array
    self = (Array.apply(self) || self);
    if (jsonOdm.util.isArray(boundaryBox)) {
        self[0] = boundaryBox[0];
        self[1] = boundaryBox[1];
        self[2] = boundaryBox[2];
        self[3] = boundaryBox[3];
    } else {
        self[0] = 0;
        self[1] = 0;
        self[2] = 0;
        self[3] = 0;
    }
    return self;
};

/**
 * Checks whether a BoundaryBox is inside of another geometry
 * @param {jsonOdm.Geo.BoundaryBox} bounds
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.BoundaryBox.within = function (bounds, geometry) {
    if (!jsonOdm.util.isArray(bounds) || bounds.length !== 4) {
        return false;
    }
    // a boundary box is equal to a polygonal box
    return jsonOdm.Geo.Polygon.within(new jsonOdm.Geo.Polygon([[[bounds[0], bounds[1]], [bounds[2], bounds[1]], [bounds[2], bounds[3]], [bounds[0], bounds[3]], [bounds[0], bounds[1]]]]), geometry);
};

/**
 * A GeoJSON Point object
 * @param {Array} position A 2-dimensional array with the first entry being the longitude and the second one being the latitude, i.e. [51,32]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var point = new jsonOdm.Geo.Point([51.5,32]);
 * @constructor
 */
jsonOdm.Geo.Point = function (position, boundaryBox) {
    this.type = "Point";
    this.coordinates = position;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a Point is inside of another geometry
 * @param {jsonOdm.Geo.Point} point
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.Point.within = function (point, geometry) {
    var i, j;
    if (!point.coordinates) {
        return false;
    }
    if (geometry.type === "Point") {
        return geometry.coordinates[0] === point.coordinates[0] && geometry.coordinates[1] === point.coordinates[1];
    }
    if (geometry.type === "MultiPoint" || geometry.type === "LineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            if (geometry.coordinates[i][0] === point.coordinates[0] && geometry.coordinates[i][1] === point.coordinates[1]) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiLineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; geometry.coordinates[i] && j < geometry.coordinates[i].length; j++) {
                if (geometry.coordinates[i][j][0] === point.coordinates[0] && geometry.coordinates[i][j][1] === point.coordinates[1]) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        // we assume that polygon wholes do not intersect the outer polygon
        return jsonOdm.Geo.pointWithinPolygon(point.coordinates, geometry.coordinates ? geometry.coordinates[0] : null);
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            // we assume that polygon wholes do not intersect the outer polygon
            if (jsonOdm.Geo.pointWithinPolygon(point.coordinates, geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.Point.within(point, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // might be a boundary box
    return jsonOdm.Geo.pointWithinBounds(point.coordinates, geometry);
};

/**
 * Checks whether a Point intersects a geometry witch is equal to the Point being inside a geometry. This is an alias of jsonOdm.Geo.Point.within
 * @param {jsonOdm.Geo.Point} point
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 * @type function
 * @method intersects
 * @memberof jsonOdm.Geo.Point
 */
jsonOdm.Geo.Point.intersects = jsonOdm.Geo.Point.within;

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
jsonOdm.Geo.MultiPoint = function (positions, boundaryBox) {
    this.type = "MultiPoint";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a MultiPoint is inside of another geometry
 * @param {jsonOdm.Geo.MultiPoint} multiPoint
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiPoint.within = function (multiPoint, geometry) {
    var i, j, k, found;
    if (!multiPoint.coordinates || !jsonOdm.util.isArray(multiPoint.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return multiPoint.coordinates.length === 1 && multiPoint.coordinates[0][0] === geometry.coordinates[0] && multiPoint.coordinates[0][1] === geometry.coordinates[1];
    }
    if (geometry.type === "MultiPoint") {
        for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (geometry.coordinates[i][0] === multiPoint.coordinates[j][0] && geometry.coordinates[i][1] === multiPoint.coordinates[j][1]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "LineString") {
        for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
            if (!jsonOdm.Geo.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates)) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "MultiLineString") {
        for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (jsonOdm.Geo.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates[i])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; multiPoint.coordinates && i < multiPoint.coordinates.length; i++) {
            // we assume that polygon wholes do not intersect the outer polygon
            if (!jsonOdm.Geo.pointWithinPolygon(multiPoint.coordinates[i], geometry.coordinates ? geometry.coordinates[0] : null)) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "MultiPolygon") {
        for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                // we assume that polygon wholes do not intersect the outer polygon
                if (jsonOdm.Geo.pointWithinPolygon(multiPoint.coordinates[j], geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiPoint.within(multiPoint, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiPoint.coordinates.length; i++) {
        if (!jsonOdm.Geo.pointWithinBounds(multiPoint.coordinates[i], geometry)) {
            return false;
        }
    }
    return true;
};

/**
 * Checks whether a MultiPoint intersects another geometry
 * @param {jsonOdm.Geo.MultiPoint} multiPoint
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiPoint.intersects = function (multiPoint, geometry) {
    var i, j, k;
    if (!multiPoint.coordinates || !jsonOdm.util.isArray(multiPoint.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return jsonOdm.Geo.Point.intersects(geometry, multiPoint);
    }
    if (geometry.type === "MultiPoint") {
        for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (geometry.coordinates[i][0] === multiPoint.coordinates[j][0] && geometry.coordinates[i][1] === multiPoint.coordinates[j][1]) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "LineString") {
        for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
            if (jsonOdm.Geo.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates)) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiLineString") {
        for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (jsonOdm.Geo.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; multiPoint.coordinates && i < multiPoint.coordinates.length; i++) {
            if (jsonOdm.Geo.pointWithinPolygon(multiPoint.coordinates[i], geometry.coordinates ? geometry.coordinates[0] : null)) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiPolygon") {
        for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                // we assume that polygon wholes do not intersect the outer polygon
                if (jsonOdm.Geo.pointWithinPolygon(multiPoint.coordinates[j], geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiPoint.intersects(multiPoint, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiPoint.coordinates.length; i++) {
        if (jsonOdm.Geo.pointWithinBounds(multiPoint.coordinates[i], geometry)) {
            return true;
        }
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
jsonOdm.Geo.LineString = function (positions, boundaryBox) {
    this.type = "LineString";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a LineString is inside of another geometry
 * @param {jsonOdm.Geo.LineString} lineString
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.LineString.within = function (lineString, geometry) {
    var i, j;
    if (!lineString.coordinates || !jsonOdm.util.isArray(lineString.coordinates)) {
        return false;
    }
    if (geometry.type === "Point" || geometry.type === "MultiPoint") {
        return false;
    }

    if (geometry.type === "LineString") {
        return jsonOdm.Geo.lineStringWithinLineString(lineString.coordinates, geometry.coordinates);
    }
    if (geometry.type === "MultiLineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            if (jsonOdm.Geo.lineStringWithinLineString(lineString.coordinates, geometry.coordinates[i])) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; lineString.coordinates && i < lineString.coordinates.length - 1; i++) {
            if (!jsonOdm.Geo.edgeWithinPolygon([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry.coordinates[0])) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; lineString.coordinates && j < lineString.coordinates.length - 1; j++) {
                if (jsonOdm.Geo.edgeWithinPolygon([lineString.coordinates[j], lineString.coordinates[j + 1]], geometry.coordinates[i][0]) && j + 1 === lineString.coordinates.length - 1) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.LineString.within(lineString, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < lineString.coordinates.length; i++) {
        if (!jsonOdm.Geo.pointWithinBounds(lineString.coordinates[i], geometry)) {
            return false;
        }
    }
    return true;
};


/**
 * Checks whether a LineString intersects another geometry
 * @param {jsonOdm.Geo.LineString} lineString
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.LineString.intersects = function (lineString, geometry) {
    var i, j;
    if (!lineString.coordinates || !jsonOdm.util.isArray(lineString.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return jsonOdm.Geo.Point.intersects(geometry, lineString);
    }
    if (geometry.type === "MultiPoint") {
        return jsonOdm.Geo.MultiPoint.intersects(geometry, lineString);
    }

    if (geometry.type === "LineString") {
        for (i = 0; i < lineString.coordinates.length - 1; i++) {
            if (jsonOdm.Geo.edgeIntersectsLineString([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry.coordinates)) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiLineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; j < lineString.coordinates.length - 1; j++) {
                if (jsonOdm.Geo.edgeIntersectsLineString([lineString.coordinates[j], lineString.coordinates[j + 1]], geometry.coordinates[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; lineString.coordinates && i < lineString.coordinates.length - 1; i++) {
            if (jsonOdm.Geo.edgeIntersectsPolygon([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry.coordinates[0])){
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; lineString.coordinates && j < lineString.coordinates.length - 1; j++) {
                if (jsonOdm.Geo.edgeIntersectsPolygon([lineString.coordinates[j], lineString.coordinates[j + 1]], geometry.coordinates[i][0])) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.LineString.intersects(lineString, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; lineString.coordinates && i < lineString.coordinates.length - 1; i++) {
        if (jsonOdm.Geo.edgeIntersectsBounds([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry)) {
            return true;
        }
    }
    return false;
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
jsonOdm.Geo.MultiLineString = function (positions, boundaryBox) {
    this.type = "MultiLineString";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a MultiLineString is inside of another geometry
 * @param {jsonOdm.Geo.MultiLineString} multiLineString
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiLineString.within = function (multiLineString, geometry) {
    var i, j, k, found;
    if (!multiLineString.coordinates || !jsonOdm.util.isArray(multiLineString.coordinates)) {
        return false;
    }
    if (geometry.type === "Point" || geometry.type === "MultiPoint") {
        return false;
    }

    if (geometry.type === "LineString") {
        for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
            if (!jsonOdm.Geo.lineStringWithinLineString(multiLineString.coordinates[i], geometry.coordinates)) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "MultiLineString") {
        for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (jsonOdm.Geo.lineStringWithinLineString(multiLineString.coordinates[j], geometry.coordinates[i])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
            for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates[i].length - 1; j++) {
                if (!jsonOdm.Geo.edgeWithinPolygon([multiLineString.coordinates[i][j], multiLineString.coordinates[i][j + 1]], geometry.coordinates[0])) {
                    return false;
                }
            }
        }
        return true;
    }
    if (geometry.type === "MultiPolygon") {
        for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (k = 0; multiLineString.coordinates[j] && k < multiLineString.coordinates[j].length - 1; k++) {
                    if (jsonOdm.Geo.edgeWithinPolygon([multiLineString.coordinates[j][k], multiLineString.coordinates[j][k + 1]], geometry.coordinates[i][0]) && k + 1 === multiLineString.coordinates[j].length - 1) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiLineString.within(multiLineString, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiLineString.coordinates.length; i++) {
        for (j = 0; j < multiLineString.coordinates[i].length; j++) {
            if (!jsonOdm.Geo.pointWithinBounds(multiLineString.coordinates[i][j], geometry)) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Checks whether a MultiLineString intersects another geometry
 * @param {jsonOdm.Geo.MultiLineString} multiLineString
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiLineString.intersects = function (multiLineString, geometry) {
    var i, j, k;
    if (!multiLineString.coordinates || !jsonOdm.util.isArray(multiLineString.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return jsonOdm.Geo.Point.intersects(geometry, multiLineString);
    }
    if (geometry.type === "MultiPoint") {
        return jsonOdm.Geo.MultiPoint.intersects(geometry, multiLineString);
    }
    if (geometry.type === "LineString") {
        return jsonOdm.Geo.LineString.intersects(geometry, multiLineString);
    }
    if (geometry.type === "MultiLineString") {
        for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
            for (k = 0; multiLineString.coordinates[j] && k < multiLineString.coordinates[j].length - 1; k++) {
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    if (jsonOdm.Geo.edgeIntersectsLineString([multiLineString.coordinates[j][k], multiLineString.coordinates[j][k + 1]], geometry.coordinates[i])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
            for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates[i].length - 1; j++) {
                if (jsonOdm.Geo.edgeIntersectsPolygon([multiLineString.coordinates[i][j], multiLineString.coordinates[i][j + 1]], geometry.coordinates[0])) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "MultiPolygon") {
        for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (k = 0; multiLineString.coordinates[j] && k < multiLineString.coordinates[j].length - 1; k++) {
                    if (jsonOdm.Geo.edgeIntersectsPolygon([multiLineString.coordinates[j][k], multiLineString.coordinates[j][k + 1]], geometry.coordinates[i][0])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiLineString.intersects(multiLineString, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
        for (j = 0; j < multiLineString.coordinates[i].length - 1; j++) {
            if (jsonOdm.Geo.edgeIntersectsBounds([multiLineString.coordinates[i][j], multiLineString.coordinates[i][j + 1]], geometry)) {
                return true;
            }
        }
    }
    return false;
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
jsonOdm.Geo.Polygon = function (positions, boundaryBox) {
    this.type = "Polygon";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a Polygon is inside of another geometry
 * @param {jsonOdm.Geo.Polygon} polygon
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.Polygon.within = function (polygon, geometry) {
    var i, j;
    if (!polygon.coordinates || !jsonOdm.util.isArray(polygon.coordinates)) {
        return false;
    }
    if (geometry.type === "Point" || geometry.type === "MultiPoint" || geometry.type === "LineString" || geometry.type === "MultiLineString") {
        return false;
    }

    if (geometry.type === "Polygon") {
        for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length - 1; i++) {
            if (!jsonOdm.Geo.edgeWithinPolygon([polygon.coordinates[0][i], polygon.coordinates[0][i + 1]], geometry.coordinates[0])) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; polygon.coordinates[0] && j < polygon.coordinates[0].length - 1; j++) {
                var inside = jsonOdm.Geo.edgeWithinPolygon([polygon.coordinates[0][j], polygon.coordinates[0][j + 1]], geometry.coordinates[i][0]);
                if (!inside) {
                    break;
                }
                if (inside && j + 1 === polygon.coordinates[0].length - 1) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.Polygon.within(polygon, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length; i++) {
        if (!jsonOdm.Geo.pointWithinBounds(polygon.coordinates[0][i], geometry)) {
            return false;
        }
    }
    return true;
};

/**
 * Checks whether a Polygon intersects another geometry
 * @param {jsonOdm.Geo.Polygon} polygon
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.Polygon.intersects = function (polygon, geometry) {
    var i, j;
    if (!polygon.coordinates || !jsonOdm.util.isArray(polygon.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return jsonOdm.Geo.Point.intersects(geometry, polygon);
    }
    if (geometry.type === "MultiPoint") {
        return jsonOdm.Geo.MultiPoint.intersects(geometry, polygon);
    }
    if (geometry.type === "LineString") {
        return jsonOdm.Geo.LineString.intersects(geometry, polygon);
    }
    if (geometry.type === "MultiLineString") {
        return jsonOdm.Geo.MultiLineString.intersects(geometry, polygon);
    }

    if (geometry.type === "Polygon") {
        for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length - 1; i++) {
            if (jsonOdm.Geo.edgeIntersectsPolygon([polygon.coordinates[0][i], polygon.coordinates[0][i + 1]], geometry.coordinates[0])) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; polygon.coordinates[0] && j < polygon.coordinates[0].length - 1; j++) {
                if (jsonOdm.Geo.edgeIntersectsPolygon([polygon.coordinates[0][j], polygon.coordinates[0][j + 1]], geometry.coordinates[i][0])) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.Polygon.intersects(polygon, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length - 1; i++) {
        if (jsonOdm.Geo.edgeIntersectsBounds([polygon.coordinates[0][i], polygon.coordinates[0][i + 1]], geometry)) {
            return true;
        }
    }
    return false;
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
jsonOdm.Geo.MultiPolygon = function (positions, boundaryBox) {
    this.type = "MultiPolygon";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a MultiPolygon is inside of another geometry
 * @param {jsonOdm.Geo.MultiPolygon} multiPolygon
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiPolygon.within = function (multiPolygon, geometry) {
    var i, j, k, found;
    if (!multiPolygon.coordinates || !jsonOdm.util.isArray(multiPolygon.coordinates)) {
        return false;
    }
    if (geometry.type === "Point" || geometry.type === "MultiPoint" || geometry.type === "LineString" || geometry.type === "MultiLineString") {
        return false;
    }

    if (geometry.type === "Polygon") {
        for (i = 0; multiPolygon.coordinates && i < multiPolygon.coordinates.length; i++) {
            for (j = 0; j < multiPolygon.coordinates[i][0].length - 1; j++) {
                if (!jsonOdm.Geo.edgeWithinPolygon([multiPolygon.coordinates[i][0][j], multiPolygon.coordinates[i][0][j + 1]], geometry.coordinates[0])) {
                    return false;
                }
            }
        }
        return true;
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; multiPolygon.coordinates && i < multiPolygon.coordinates.length; i++) {
            found = false;
            for (j = 0; geometry.coordinates && j < geometry.coordinates.length; j++) {
                for (k = 0; multiPolygon.coordinates[i][0] && k < multiPolygon.coordinates[i][0].length - 1; k++) {
                    var inside = jsonOdm.Geo.edgeWithinPolygon([multiPolygon.coordinates[i][0][k], multiPolygon.coordinates[i][0][k + 1]], geometry.coordinates[j][0]);
                    if (!inside) {
                        break;
                    }
                    if (inside && k + 1 === multiPolygon.coordinates[i][0].length - 1) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiPolygon.within(multiPolygon, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiPolygon.coordinates.length; i++) {
        for (j = 0; j < multiPolygon.coordinates[i][0].length; j++) {
            if (!jsonOdm.Geo.pointWithinBounds(multiPolygon.coordinates[i][0][j], geometry)) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Checks whether a MultiPolygon intersects another geometry
 * @param {jsonOdm.Geo.MultiPolygon} multiPolygon
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiPolygon.intersects = function (multiPolygon, geometry) {
    var i, j, k;
    if (!multiPolygon.coordinates || !jsonOdm.util.isArray(multiPolygon.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return jsonOdm.Geo.Point.intersects(geometry, multiPolygon);
    }
    if (geometry.type === "MultiPoint") {
        return jsonOdm.Geo.MultiPoint.intersects(geometry, multiPolygon);
    }
    if (geometry.type === "LineString") {
        return jsonOdm.Geo.LineString.intersects(geometry, multiPolygon);
    }
    if (geometry.type === "MultiLineString") {
        return jsonOdm.Geo.MultiLineString.intersects(geometry, multiPolygon);
    }
    if (geometry.type === "Polygon") {
        return jsonOdm.Geo.Polygon.intersects(geometry, multiPolygon);
    }

    if (geometry.type === "MultiPolygon") {
        for (i = 0; multiPolygon.coordinates && i < multiPolygon.coordinates.length; i++) {
            for (j = 0; geometry.coordinates && j < geometry.coordinates.length; j++) {
                for (k = 0; multiPolygon.coordinates[i][0] && k < multiPolygon.coordinates[i][0].length - 1; k++) {
                    if (jsonOdm.Geo.pointWithinPolygon(multiPolygon.coordinates[i][0][k], geometry.coordinates[j][0])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiPolygon.intersects(multiPolygon, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiPolygon.coordinates.length; i++) {
        for (j = 0; j < multiPolygon.coordinates[i][0].length - 1; j++) {
            if (jsonOdm.Geo.edgeIntersectsBounds([multiPolygon.coordinates[i][0][j], multiPolygon.coordinates[i][0][j + 1]], geometry)) {
                return true;
            }
        }
    }
    return false;
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
jsonOdm.Geo.GeometryCollection = function (geometries, boundaryBox) {
    this.type = "GeometryCollection";
    this.geometries = geometries;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a GeometryCollection is inside of another geometry
 * @param {jsonOdm.Geo.GeometryCollection} geometryCollection
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.GeometryCollection.within = function (geometryCollection, geometry) {
    if (!jsonOdm.util.isArray(geometryCollection.geometries) || !geometryCollection.geometries.length || !geometry.type) {
        return false;
    }
    for (var i = 0; i < geometryCollection.geometries.length; i++) {
        if (jsonOdm.Geo[geometryCollection.geometries[i].type] && jsonOdm.Geo[geometryCollection.geometries[i].type].within) {
            if (!jsonOdm.Geo[geometryCollection.geometries[i].type].within(geometryCollection.geometries[i], geometry)) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
};

/**
 * Checks whether a GeometryCollection intersects another geometry
 * @param {jsonOdm.Geo.GeometryCollection} geometryCollection
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.GeometryCollection.intersects = function (geometryCollection, geometry) {
    if (!jsonOdm.util.isArray(geometryCollection.geometries) || !geometryCollection.geometries.length || !geometry.type) {
        return false;
    }
    for (var i = 0; i < geometryCollection.geometries.length; i++) {
        if (jsonOdm.Geo[geometryCollection.geometries[i].type] && jsonOdm.Geo[geometryCollection.geometries[i].type].intersects) {
            if (jsonOdm.Geo[geometryCollection.geometries[i].type].intersects(geometryCollection.geometries[i], geometry)) {
                return true;
            }
        }
    }
    return false;
};

/**
 * The method checks whether a point is inside a polygon or not. The polygon will be auto closed
 * @param {Array} point A point representation i.e. [1,2]
 * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.pointWithinPolygon = function (point, polygon) {
    if (!(jsonOdm.util.isArray(point) && jsonOdm.util.isArray(polygon) && polygon.length > 2)) {
        return false;
    }

    var intersection = 0, foundX;

    // close the polygon
    if (!(polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1])) {
        polygon = polygon.concat([polygon[0]]);
    }

    // do not enter the last point because the calculation also reads the i+1th index
    for (var i = 0; i < polygon.length - 1; i++) {
        if (polygon[i][0] === point[0] && polygon[i][1] === point[1]) {
            return true;
        } // vertex equals the given point
        if (
            polygon[i][0] < point[0] && polygon[i + 1][0] < point[0] || // the vector is only in section 1 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] < point[1] && polygon[i + 1][1] < point[1] || // the vector is only in section 1 or 2 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] > point[1] && polygon[i + 1][1] > point[1]    // the vector is only in section 3 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
        ) {
            continue;
        }
        foundX = (polygon[i][0] - polygon[i + 1][0]) * ((point[1] - polygon[i + 1][1]) / (polygon[i][1] - polygon[i + 1][1])) + polygon[i + 1][0];
        // on the edge
        if (foundX === point[0] && point[1] <= Math.max(polygon[i][1], polygon[i + 1][1]) && point[1] >= Math.min(polygon[i][1], polygon[i + 1][1])) {
            return true;
        }
        // the vector intersects the positive x-axis of the coordinate system normalized to the point
        if (foundX > point[0]) {
            intersection++;
        }
    }
    return intersection % 2 === 1; // the normalized x-axis needs to be intersected by a odd amount of intersections
};

/**
 * The method checks whether a edge is inside a polygon or not. The polygon will be auto closed
 * @param {Array} edge A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.edgeWithinPolygon = function (edge, polygon) {
    if (!(jsonOdm.util.isArray(edge) && edge.length === 2 && jsonOdm.util.isArray(polygon) && polygon.length >= 2)) {
        return false;
    }

    // close the polygon
    if (!(polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1])) {
        polygon = polygon.concat([polygon[0]]);
    }
    if (!jsonOdm.Geo.pointWithinPolygon(edge[0], polygon) || !jsonOdm.Geo.pointWithinPolygon(edge[1], polygon)) {
        return false;
    }

    for (var i = 0; i < polygon.length - 1; i++) {
        // All points may be inside the polygon but their might be faces that are outside the polygon
        if (jsonOdm.Geo.edgeIntersectsEdge(edge, [polygon[i], polygon[i + 1]], false)) {
            return false;
        }
    }
    return true;
};

/**
 * The method checks whether a edge intersects a polygon or not. The polygon will be auto closed
 * @param {Array} edge A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.edgeIntersectsPolygon = function (edge, polygon) {
    if (!(jsonOdm.util.isArray(edge) && edge.length === 2 && jsonOdm.util.isArray(polygon) && polygon.length >= 2)) {
        return false;
    }

    // close the polygon
    if (!(polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1])) {
        polygon = polygon.concat([polygon[0]]);
    }
    if (jsonOdm.Geo.pointWithinPolygon(edge[0], polygon) || jsonOdm.Geo.pointWithinPolygon(edge[1], polygon)) {
        return true;
    }

    for (var i = 0; i < polygon.length - 1; i++) {
        // All points may be outside the polygon but their might be faces that are inside the polygon
        if (jsonOdm.Geo.edgeIntersectsEdge(edge, [polygon[i], polygon[i + 1]])) {
            return true;
        }
    }
    return false;
};

/**
 * The method checks whether a edge intersects a lineString or not. The polygon will be auto closed
 * @param {Array} edge A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {Array} lineString A line representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.edgeIntersectsLineString = function (edge, lineString) {
    if (!(jsonOdm.util.isArray(edge) && edge.length === 2 && jsonOdm.util.isArray(lineString))) {
        return false;
    }
    for (var i = 0; i < lineString.length - 1; i++) {
        if (jsonOdm.Geo.edgeIntersectsEdge(edge, [lineString[i], lineString[i + 1]])) {
            return true;
        }
    }
    return false;
};

/**
 * Method checks whether an edge intersects another edge
 * @param {Array} edge1 A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {Array} edge2 A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {boolean} [allowOnEdge=true] also counts it as intersection if the edge is on the other edge
 * @return {boolean}
 */
jsonOdm.Geo.edgeIntersectsEdge = function (edge1, edge2, allowOnEdge) {
    allowOnEdge = typeof allowOnEdge === "undefined" ? true : allowOnEdge;
    var directionVector1 = [edge1[1][0] - edge1[0][0], edge1[1][1] - edge1[0][1]],
        bounds1 = [Math.min(edge1[0][0], edge1[1][0]), Math.min(edge1[0][1], edge1[1][1]), Math.max(edge1[0][0], edge1[1][0]), Math.max(edge1[0][1], edge1[1][1])],
        directionVector2 = [edge2[1][0] - edge2[0][0], edge2[1][1] - edge2[0][1]],
        bounds2 = [Math.min(edge2[0][0], edge2[1][0]), Math.min(edge2[0][1], edge2[1][1]), Math.max(edge2[0][0], edge2[1][0]), Math.max(edge2[0][1], edge2[1][1])]
        ;

    // if not in bounds or if both edges are parallel with not intersection result
    if (
        (bounds1[0] > bounds2[0] && bounds1[0] > bounds2[2]) || (bounds1[1] > bounds2[1] && bounds1[1] > bounds2[3]) ||
        (bounds2[0] > bounds1[0] && bounds2[0] > bounds1[2]) || (bounds2[1] > bounds1[1] && bounds2[1] > bounds1[3])
    ) {
        return false;
    }

    if ((directionVector2[0] * directionVector1[1] - directionVector1[0] * directionVector2[1]) === 0) {
        return allowOnEdge && edge1[0][1] + (((edge2[0][0] - edge1[0][0]) / (directionVector1[0])) * (directionVector1[1])) === edge2[0][1];
    }

    var t = (edge2[0][1] * (directionVector2[0]) + edge1[0][0] * (directionVector2[1]) - edge2[0][0] * (directionVector2[1]) - edge1[0][1] * (directionVector2[0])) / ((directionVector1[1]) * (directionVector2[0]) - (directionVector1[0]) * (directionVector2[1])),
        x = edge1[0][0] + (t * (directionVector1[0])),
        y = edge1[0][1] + (t * (directionVector1[1]));

    // intersection needs to be inside the bounds
    return allowOnEdge ?
        (x >= bounds1[0] && x <= bounds1[2] && y >= bounds1[1] && y <= bounds1[3] && x >= bounds2[0] && x <= bounds2[2] && y >= bounds2[1] && y <= bounds2[3]) :
        (x > bounds1[0] && x < bounds1[2] && y > bounds1[1] && y < bounds1[3] && x > bounds2[0] && x < bounds2[2] && y > bounds2[1] && y < bounds2[3]);
};

/**
 * The method checks whether a point is on a line string path or not.
 * @param {Array} point A point representation i.e. [1,2]
 * @param {Array} lineString A line string path representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.pointWithinLineString = function (point, lineString) {
    if (!(jsonOdm.util.isArray(point) && jsonOdm.util.isArray(lineString) && lineString.length >= 2)) {
        return false;
    }
    for (var i = 0; i < lineString.length - 1; i++) {
        if (
            // out of bounds check
        (
            (point[0] >= lineString[i][0] && point[0] <= lineString[i + 1][0] && lineString[i][0] <= lineString[i + 1][0]) ||
            (point[0] <= lineString[i][0] && point[0] >= lineString[i + 1][0] && lineString[i][0] >= lineString[i + 1][0])
        ) &&
        (
            (point[1] >= lineString[i][1] && point[1] <= lineString[i + 1][1] && lineString[i][1] <= lineString[i + 1][1]) ||
            (point[1] <= lineString[i][1] && point[1] >= lineString[i + 1][1] && lineString[i][1] >= lineString[i + 1][1])
        )
        ) {
            // point was on the current path
            if (
                (lineString[i][0] === point[0] && lineString[i][1] === point[1]) ||
                (lineString[i + 1][0] === point[0] && lineString[i + 1][1] === point[1]) ||

                ((lineString[i][1] - lineString[i + 1][1]) != 0 && ((lineString[i][0] - lineString[i + 1][0]) * ((point[1] - lineString[i + 1][1]) / (lineString[i][1] - lineString[i + 1][1])) + lineString[i + 1][0] === point[0])) ||
                ((lineString[i][0] - lineString[i + 1][0]) != 0 && ((lineString[i][1] - lineString[i + 1][1]) * ((point[0] - lineString[i + 1][0]) / (lineString[i][0] - lineString[i + 1][0])) + lineString[i + 1][1] === point[1]))
            ) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Checks whether a point is inside a boundary box or not
 * @param {Array} point
 * @param {Array} bounds
 * @return {boolean}
 */
jsonOdm.Geo.pointWithinBounds = function (point, bounds) {
    if (!(jsonOdm.util.isArray(point) && jsonOdm.util.isArray(bounds) && bounds.length === 4)) {
        return false;
    }
    return point[0] >= bounds[0] && point[1] >= bounds[1] && point[0] <= bounds[2] && point[1] <= bounds[3];
};

/**
 * Checks whether an edge intersects a boundary box or not
 * @param {Array} edge
 * @param {Array} bounds
 * @return {boolean}
 */
jsonOdm.Geo.edgeIntersectsBounds = function (edge, bounds) {
    if (!(jsonOdm.util.isArray(edge) && jsonOdm.util.isArray(bounds) && bounds.length === 4)) {
        return false;
    }
    return jsonOdm.Geo.edgeIntersectsPolygon(edge, [[bounds[0], bounds[1]], [bounds[2], bounds[1]], [bounds[2], bounds[3]], [bounds[0], bounds[3]]]);
};

/**
 * TODO: ALSO needs to return true for [[1,1],[2,2,]] and [[0,0],[4,4]] // probably needs a rewrite
 * Checks whether a line follows another line or is on the line respectively
 * @param {Array} lineString An array of points, i.e. [[1,1],[1,2],[1,3]]
 * @param {Array} inLineString An array of points, i.e. [[1,1],[1,2],[1,3]]
 * @return {boolean}
 */
jsonOdm.Geo.lineStringWithinLineString = function (lineString, inLineString) {
    if (!(jsonOdm.util.isArray(lineString) && jsonOdm.util.isArray(inLineString))) {
        return false;
    }
    var i, j;
    for (i = 0; lineString && i < lineString.length; i++) {
        var found = false;
        for (j = 0; inLineString && j < inLineString.length; j++) {
            if (lineString[i][0] === inLineString[j][0] && lineString[i][1] === inLineString[j][1]) {
                if (i + 1 === lineString.length) {
                    return true; // we have successfully found the last matching line point
                }
                // the next vertex needs to match the next geometry point or the previous or the same again
                if (
                    !(
                        // next is not the next one
                        (inLineString[j + 1] && lineString[i + 1][0] === inLineString[j + 1][0] && lineString[i + 1][1] === inLineString[j + 1][1]) ||
                        // next is not the same one
                        (lineString[i + 1][0] === inLineString[j][0] && lineString[i + 1][1] === inLineString[j][1]) ||
                        // next is not the previous one
                        (j > 0 && lineString[i + 1][0] === inLineString[j - 1][0] && lineString[i + 1][1] === inLineString[j - 1][1])
                    )
                ) {
                    return false;
                }
                found = true;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
};