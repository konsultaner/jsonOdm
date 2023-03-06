// @flow

import Polygon from "./polygon";
import Point from "./point";
import Util from "./util";
import LineString from "./line_string";
import MultiLineString from "./multi_line_string";
import Geometry from "./geometry";
import GeometryCollection from "./geometry_collection";
import MultiPolygon from "./multi_polygon";

/**
 * A GeoJSON MultiPoint object
 * @param {Array} positions An array of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude, i.e. [[51,32],[51.4,21]]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var multiPoint = new Geo.MultiPoint([
 *    [51.5,32],[51.6,21]
 * ]);
 */
export default class MultiPoint extends Geometry  {
    coordinates: any[];

    constructor (positions, boundaryBox) {
        super(boundaryBox);
        this.coordinates = positions;
    };


    /**
     * Checks whether a MultiPoint is inside another geometry
     * @param {MultiPoint} multiPoint
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
     * @return {boolean}
     */
    static within(multiPoint, geometry) {
        let i, j, k, found;
        if (!multiPoint.coordinates || !Array.isArray(multiPoint.coordinates)) {
            return false;
        }
        if (geometry instanceof Point) {
            return multiPoint.coordinates.length === 1 && multiPoint.coordinates[0][0] === geometry.coordinates[0] && multiPoint.coordinates[0][1] === geometry.coordinates[1];
        }
        if (geometry instanceof MultiPoint) {
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
        if (geometry instanceof LineString) {
            for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
                if (!Util.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates)) {
                    return false;
                }
            }
            return true;
        }
        if (geometry instanceof MultiLineString) {
            for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
                found = false;
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    if (Util.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates[i])) {
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
            for (i = 0; multiPoint.coordinates && i < multiPoint.coordinates.length; i++) {
                // we assume that polygon wholes do not intersect the outer polygon
                if (!Util.pointWithinPolygon(multiPoint.coordinates[i], geometry.coordinates ? geometry.coordinates[0] : null)) {
                    return false;
                }
            }
            return true;
        }
        if (geometry instanceof MultiPolygon) {
            for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
                found = false;
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    // we assume that polygon wholes do not intersect the outer polygon
                    if (Util.pointWithinPolygon(multiPoint.coordinates[j], geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) {
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
        if (geometry instanceof GeometryCollection && Array.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (MultiPoint.within(multiPoint, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; i < multiPoint.coordinates.length; i++) {
            if (!Util.pointWithinBounds(multiPoint.coordinates[i], geometry)) {
                return false;
            }
        }
        return true;
    };

    /**
     * Checks whether a MultiPoint intersects another geometry
     * @param {MultiPoint} multiPoint
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
     * @return {boolean}
     */
    static intersects (multiPoint, geometry) {
        let i, j, k;
        if (!multiPoint.coordinates || !Array.isArray(multiPoint.coordinates)) {
            return false;
        }
        if (geometry instanceof Point) {
            return Point.intersects(geometry, multiPoint);
        }
        if (geometry instanceof MultiPoint) {
            for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    if (geometry.coordinates[i][0] === multiPoint.coordinates[j][0] && geometry.coordinates[i][1] === multiPoint.coordinates[j][1]) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry instanceof LineString) {
            for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
                if (Util.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates)) {
                    return true;
                }
            }
            return false;
        }
        if (geometry instanceof MultiLineString) {
            for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    if (Util.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates[i])) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry instanceof Polygon) {
            for (i = 0; multiPoint.coordinates && i < multiPoint.coordinates.length; i++) {
                if (Util.pointWithinPolygon(multiPoint.coordinates[i], geometry.coordinates ? geometry.coordinates[0] : null)) {
                    return true;
                }
            }
            return false;
        }
        if (geometry instanceof MultiPolygon) {
            for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    // we assume that polygon wholes do not intersect the outer polygon
                    if (Util.pointWithinPolygon(multiPoint.coordinates[j], geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry instanceof GeometryCollection && Array.isArray(geometry.geometries)) {
            for (i = 0; i < geometry.geometries.length; i++) {
                if (MultiPoint.intersects(multiPoint, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; i < multiPoint.coordinates.length; i++) {
            if (Util.pointWithinBounds(multiPoint.coordinates[i], geometry)) {
                return true;
            }
        }
        return false;
    };


}