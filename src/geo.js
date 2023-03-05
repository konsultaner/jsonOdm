// @flow

import FeatureCollection from "./geo/feature_collection";
import Feature from "./geo/feature";
import BoundaryBox from "./geo/boundary_box";
import Point from "./geo/point";

import Util from "./geo/util";

/**
 * The object to provide geographical data and methods. <br>
 * <strong style='color:#ff0000'>Warning:</strong> The coordinate reference system is <a href="http://spatialreference.org/ref/epsg/4326/" target="_blank">WGS 84</a>
 * witch uses the coordinate order [<strong>longitude</strong>,<strong>latitude</strong>]!<br>
 * Changing the coordinate reference system (CRS) is not supported yet.
 * @module jsonOdm.Geo
 * @constructor
 */
export default class Geo {

    static FeatureCollection = FeatureCollection;
    static Feature = Feature;
    static BoundaryBox = BoundaryBox;
    static Point = Point;

    static detectAsGeometry = Util.detectAsGeometry;
}

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


if (typeof module !== "undefined" && module.exports) {
    module.exports = jsonOdm.Geo;
}