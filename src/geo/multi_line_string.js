// @flow

import Point from "./point";
import MultiPoint from "./multi_point";
import LineString from "./line_string";
import Polygon from "./polygon";
import Util from "./util";

export default class MultiLineString {
    coordinates: any[];
    bbox: number[];

    /**
     * A GeoJSON MultiLineString object
     * @param {Array} positions An array of arrays with at least 2-dimensional arrays of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude.
     * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
     * @example
     * var multiLineString = new MultiLineString([
     *    [[51.2,32],[51.4,21]],
     *    [[51.5,32],[51.6,21]]
     * ]);
     * @constructor
     */
    constructor(positions, boundaryBox) {
        this.type = "MultiLineString";
        this.coordinates = positions;
        if (boundaryBox) {
            this.bbox = boundaryBox;
        }
    };

    /**
     * Checks whether a MultiLineString is inside of another geometry
     * @param {MultiLineString} multiLineString
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static within (multiLineString, geometry) {
        let i, j, k, found;
        if (!multiLineString.coordinates || !jsonOdm.util.isArray(multiLineString.coordinates)) {
            return false;
        }
        if (geometry instanceof Point || geometry instanceof MultiPoint) {
            return false;
        }

        if (geometry instanceof LineString) {
            for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
                if (!Util.lineStringWithinLineString(multiLineString.coordinates[i], geometry.coordinates)) {
                    return false;
                }
            }
            return true;
        }
        if (geometry instanceof MultiLineString) {
            for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
                found = false;
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    if (Util.lineStringWithinLineString(multiLineString.coordinates[j], geometry.coordinates[i])) {
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
        if (geometry instanceof Polygon) {
            for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
                for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates[i].length - 1; j++) {
                    if (!Util.edgeWithinPolygon([multiLineString.coordinates[i][j], multiLineString.coordinates[i][j + 1]], geometry.coordinates[0])) {
                        return false;
                    }
                }
            }
            return true;
        }
        if (geometry instanceof MultiPolygon) {
            for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
                found = false;
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    for (k = 0; multiLineString.coordinates[j] && k < multiLineString.coordinates[j].length - 1; k++) {
                        if (Util.edgeWithinPolygon([multiLineString.coordinates[j][k], multiLineString.coordinates[j][k + 1]], geometry.coordinates[i][0]) && k + 1 === multiLineString.coordinates[j].length - 1) {
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
        if (geometry instanceof GeometryCollection && jsonOdm.util.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (MultiLineString.within(multiLineString, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; i < multiLineString.coordinates.length; i++) {
            for (j = 0; j < multiLineString.coordinates[i].length; j++) {
                if (!Util.pointWithinBounds(multiLineString.coordinates[i][j], geometry)) {
                    return false;
                }
            }
        }
        return true;
    };

    /**
     * Checks whether a MultiLineString intersects another geometry
     * @param {MultiLineString} multiLineString
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static intersects (multiLineString, geometry) {
        var i, j, k;
        if (!multiLineString.coordinates || !jsonOdm.util.isArray(multiLineString.coordinates)) {
            return false;
        }
        if (geometry instanceof Point) {
            return Point.intersects(geometry, multiLineString);
        }
        if (geometry instanceof MultiPoint) {
            return MultiPoint.intersects(geometry, multiLineString);
        }
        if (geometry instanceof LineString) {
            return LineString.intersects(geometry, multiLineString);
        }
        if (geometry instanceof MultiLineString) {
            for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
                for (k = 0; multiLineString.coordinates[j] && k < multiLineString.coordinates[j].length - 1; k++) {
                    for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                        if (Util.edgeIntersectsLineString([multiLineString.coordinates[j][k], multiLineString.coordinates[j][k + 1]], geometry.coordinates[i])) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        if (geometry instanceof Polygon) {
            for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
                for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates[i].length - 1; j++) {
                    if (Util.edgeIntersectsPolygon([multiLineString.coordinates[i][j], multiLineString.coordinates[i][j + 1]], geometry.coordinates[0])) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry instanceof MultiPolygon) {
            for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    for (k = 0; multiLineString.coordinates[j] && k < multiLineString.coordinates[j].length - 1; k++) {
                        if (Util.edgeIntersectsPolygon([multiLineString.coordinates[j][k], multiLineString.coordinates[j][k + 1]], geometry.coordinates[i][0])) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        if (geometry instanceof GeometryCollection && jsonOdm.util.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (MultiLineString.intersects(multiLineString, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
            for (j = 0; j < multiLineString.coordinates[i].length - 1; j++) {
                if (Util.edgeIntersectsBounds([multiLineString.coordinates[i][j], multiLineString.coordinates[i][j + 1]], geometry)) {
                    return true;
                }
            }
        }
        return false;
    };
}