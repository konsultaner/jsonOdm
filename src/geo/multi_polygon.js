// @flow

import Point from "./point";
import MultiPoint from "./multi_point";
import LineString from "./line_string";
import MultiLineString from "./multi_line_string";
import Polygon from "./polygon";
import Util from "./util";
import Geometry from "./geometry";
import GeometryCollection from "./geometry_collection";

export default class MultiPolygon extends Geometry {
    coordinates: any[];

    /**
     * A GeoJSON MultiPolygon object
     * @param {Array} positions An array of Polygon position arrays
     * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
     * @example
     * var polygons = new MultiPolygon([
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
    constructor (positions, boundaryBox) {
        super(boundaryBox);
        this.coordinates = positions;
    };

    /**
     * Checks whether a MultiPolygon is inside another geometry
     * @param {MultiPolygon} multiPolygon
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static within(multiPolygon, geometry) {
        let i, j, k, found;
        if (!multiPolygon.coordinates || !Array.isArray(multiPolygon.coordinates)) {
            return false;
        }
        if (geometry instanceof Point || geometry instanceof MultiPoint || geometry instanceof LineString || geometry instanceof MultiLineString) {
            return false;
        }

        if (geometry instanceof Polygon) {
            for (i = 0; multiPolygon.coordinates && i < multiPolygon.coordinates.length; i++) {
                for (j = 0; j < multiPolygon.coordinates[i][0].length - 1; j++) {
                    if (!Util.edgeWithinPolygon([multiPolygon.coordinates[i][0][j], multiPolygon.coordinates[i][0][j + 1]], geometry.coordinates[0])) {
                        return false;
                    }
                }
            }
            return true;
        }
        if (geometry instanceof MultiPolygon) {
            for (i = 0; multiPolygon.coordinates && i < multiPolygon.coordinates.length; i++) {
                found = false;
                for (j = 0; geometry.coordinates && j < geometry.coordinates.length; j++) {
                    for (k = 0; multiPolygon.coordinates[i][0] && k < multiPolygon.coordinates[i][0].length - 1; k++) {
                        let inside = Util.edgeWithinPolygon([multiPolygon.coordinates[i][0][k], multiPolygon.coordinates[i][0][k + 1]], geometry.coordinates[j][0]);
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
        if (geometry instanceof GeometryCollection && Array.isArray(geometry.geometries)) {
            for (i = 0; i < geometry.geometries.length; i++) {
                if (MultiPolygon.within(multiPolygon, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; i < multiPolygon.coordinates.length; i++) {
            for (j = 0; j < multiPolygon.coordinates[i][0].length; j++) {
                if (!Util.pointWithinBounds(multiPolygon.coordinates[i][0][j], geometry)) {
                    return false;
                }
            }
        }
        return true;
    };

    /**
     * Checks whether a MultiPolygon intersects another geometry
     * @param {MultiPolygon} multiPolygon
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static intersects(multiPolygon, geometry) {
        let i, j, k;
        if (!multiPolygon.coordinates || !Array.isArray(multiPolygon.coordinates)) {
            return false;
        }
        if (geometry instanceof Point) {
            return Point.intersects(geometry, multiPolygon);
        }
        if (geometry instanceof MultiPoint) {
            return MultiPoint.intersects(geometry, multiPolygon);
        }
        if (geometry instanceof LineString) {
            return LineString.intersects(geometry, multiPolygon);
        }
        if (geometry instanceof MultiLineString) {
            return MultiLineString.intersects(geometry, multiPolygon);
        }
        if (geometry instanceof Polygon) {
            return Polygon.intersects(geometry, multiPolygon);
        }

        if (geometry instanceof MultiPolygon) {
            for (i = 0; multiPolygon.coordinates && i < multiPolygon.coordinates.length; i++) {
                for (j = 0; geometry.coordinates && j < geometry.coordinates.length; j++) {
                    for (k = 0; multiPolygon.coordinates[i][0] && k < multiPolygon.coordinates[i][0].length - 1; k++) {
                        if (Util.pointWithinPolygon(multiPolygon.coordinates[i][0][k], geometry.coordinates[j][0])) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        if (geometry instanceof GeometryCollection && Array.isArray(geometry.geometries)) {
            for (i = 0; i < geometry.geometries.length; i++) {
                if (MultiPolygon.intersects(multiPolygon, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; i < multiPolygon.coordinates.length; i++) {
            for (j = 0; j < multiPolygon.coordinates[i][0].length - 1; j++) {
                if (Util.edgeIntersectsBounds([multiPolygon.coordinates[i][0][j], multiPolygon.coordinates[i][0][j + 1]], geometry)) {
                    return true;
                }
            }
        }
        return false;
    };

}