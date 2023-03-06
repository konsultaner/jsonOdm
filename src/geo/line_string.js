// @flow

import Point from "./point";
import MultiPoint from "./multi_point";
import Util from "./util";
import Polygon from "./polygon";
import MultiLineString from "./multi_line_string";
import Geometry from "./geometry";
import MultiPolygon from "./multi_polygon";
import GeometryCollection from "./geometry_collection";

/**
 * A GeoJSON LineString object
 * @param {Array} positions An at least 2-dimensional array of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude, i.e. [[51,32],[51.4,21]]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var lineString = new LineString([
 *    [51.5,32],[51.6,21]
 * ]);
 */
export default class LineString extends Geometry  {

    coordinates: any[];

    constructor (positions, boundaryBox) {
        super(boundaryBox);
        this.type = "LineString";
        this.coordinates = positions;
    };


    /**
     * Checks whether a LineString is inside another geometry
     * @param {LineString} lineString
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static within(lineString, geometry) {
        let i, j;
        if (!lineString.coordinates || !Array.isArray(lineString.coordinates)) {
            return false;
        }
        if (geometry instanceof Point || geometry instanceof MultiPoint) {
            return false;
        }

        if (geometry instanceof LineString) {
            return Util.lineStringWithinLineString(lineString.coordinates, geometry.coordinates);
        }
        if (geometry instanceof MultiLineString) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (Util.lineStringWithinLineString(lineString.coordinates, geometry.coordinates[i])) {
                    return true;
                }
            }
            return false;
        }
        if (geometry instanceof Polygon) {
            for (i = 0; lineString.coordinates && i < lineString.coordinates.length - 1; i++) {
                if (!Util.edgeWithinPolygon([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry.coordinates[0])) {
                    return false;
                }
            }
            return true;
        }
        if (geometry instanceof MultiPolygon) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (j = 0; lineString.coordinates && j < lineString.coordinates.length - 1; j++) {
                    if (Util.edgeWithinPolygon([lineString.coordinates[j], lineString.coordinates[j + 1]], geometry.coordinates[i][0]) && j + 1 === lineString.coordinates.length - 1) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry instanceof GeometryCollection && Array.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (LineString.within(lineString, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; i < lineString.coordinates.length; i++) {
            if (!Util.pointWithinBounds(lineString.coordinates[i], geometry)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks whether a LineString intersects another geometry
     * @param {LineString} lineString
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static intersects = function (lineString, geometry) {
        let i, j;
        if (!lineString.coordinates || !Array.isArray(lineString.coordinates)) {
            return false;
        }
        if (geometry instanceof Point) {
            return Point.intersects(geometry, lineString);
        }
        if (geometry instanceof MultiPoint) {
            return MultiPoint.intersects(geometry, lineString);
        }

        if (geometry instanceof LineString) {
            for (i = 0; i < lineString.coordinates.length - 1; i++) {
                if (Util.edgeIntersectsLineString([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry.coordinates)) {
                    return true;
                }
            }
            return false;
        }
        if (geometry instanceof MultiLineString) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (j = 0; j < lineString.coordinates.length - 1; j++) {
                    if (Util.edgeIntersectsLineString([lineString.coordinates[j], lineString.coordinates[j + 1]], geometry.coordinates[i])) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry instanceof Polygon) {
            for (i = 0; lineString.coordinates && i < lineString.coordinates.length - 1; i++) {
                if (Util.edgeIntersectsPolygon([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry.coordinates[0])){
                    return true;
                }
            }
            return false;
        }
        if (geometry instanceof MultiPolygon) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (j = 0; lineString.coordinates && j < lineString.coordinates.length - 1; j++) {
                    if (Util.edgeIntersectsPolygon([lineString.coordinates[j], lineString.coordinates[j + 1]], geometry.coordinates[i][0])) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry instanceof GeometryCollection && Array.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (LineString.intersects(lineString, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; lineString.coordinates && i < lineString.coordinates.length - 1; i++) {
            if (Util.edgeIntersectsBounds([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry)) {
                return true;
            }
        }
        return false;
    }
}