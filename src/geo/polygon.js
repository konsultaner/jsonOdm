// @flow

import Point from "./point";
import MultiPoint from "./multi_point";
import LineString from "./line_string";
import MultiLineString from "./multi_line_string";
import MultiPolygon from "./multi_polygon";
import Geometry from "./geometry";
import GeometryCollection from "./geometry_collection";
import Util from "./util";

export default class Polygon extends Geometry {

    coordinates: any[];

    /**
     * A GeoJSON Polygon object
     * @param {Array} positions An array of arrays with at least 2-dimensional arrays of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude.
     * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
     * @example
     * var polygon = new Polygon([
     *    // The last position should be equal to the first one to close the polygon
     *    [[51.2,32],[51.4,21],[51.6,21],[51.2,21]],
     *    // Must be fully inside the n-1th poly-line
     *    [[51.5,32],[51.6,21],[51.7,21],[51.5,21]]
     *    // more inner holes might follow
     * ]);
     * @constructor
     */
    constructor(positions, boundaryBox) {
        super(boundaryBox);
        this.coordinates = positions;
    }

    /**
     * Checks whether a Polygon is inside another geometry
     * @param {Polygon} polygon
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static within (polygon, geometry) {
        let i, j;
        if (!polygon.coordinates || !Array.isArray(polygon.coordinates)) {
            return false;
        }
        if (geometry instanceof Point || geometry instanceof MultiPoint || geometry instanceof LineString || geometry instanceof MultiLineString) {
            return false;
        }

        if (geometry instanceof Polygon) {
            for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length - 1; i++) {
                if (!Util.edgeWithinPolygon([polygon.coordinates[0][i], polygon.coordinates[0][i + 1]], geometry.coordinates[0])) {
                    return false;
                }
            }
            return true;
        }
        if (geometry instanceof MultiPolygon) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (j = 0; polygon.coordinates[0] && j < polygon.coordinates[0].length - 1; j++) {
                    const inside = Util.edgeWithinPolygon([polygon.coordinates[0][j], polygon.coordinates[0][j + 1]], geometry.coordinates[i][0]);
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
        if (geometry instanceof GeometryCollection && Array.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (Polygon.within(polygon, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length; i++) {
            if (!Util.pointWithinBounds(polygon.coordinates[0][i], geometry)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks whether a Polygon intersects another geometry
     * @param {Polygon} polygon
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static intersects (polygon: Polygon, geometry): boolean {
        let i, j;
        if (!polygon.coordinates || !Array.isArray(polygon.coordinates)) {
            return false;
        }
        if (geometry instanceof Point) {
            return Point.intersects(geometry, polygon);
        }
        if (geometry instanceof MultiPoint) {
            return MultiPoint.intersects(geometry, polygon);
        }
        if (geometry instanceof LineString) {
            return LineString.intersects(geometry, polygon);
        }
        if (geometry instanceof MultiLineString) {
            return MultiLineString.intersects(geometry, polygon);
        }

        if (geometry instanceof Polygon) {
            for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length - 1; i++) {
                if (Util.edgeIntersectsPolygon([polygon.coordinates[0][i], polygon.coordinates[0][i + 1]], geometry.coordinates[0])) {
                    return true;
                }
            }
            return false;
        }
        if (geometry instanceof MultiPolygon) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (j = 0; polygon.coordinates[0] && j < polygon.coordinates[0].length - 1; j++) {
                    if (Util.edgeIntersectsPolygon([polygon.coordinates[0][j], polygon.coordinates[0][j + 1]], geometry.coordinates[i][0])) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry instanceof GeometryCollection && Array.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (Polygon.intersects(polygon, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length - 1; i++) {
            if (Util.edgeIntersectsBounds([polygon.coordinates[0][i], polygon.coordinates[0][i + 1]], geometry)) {
                return true;
            }
        }
        return false;
    }
}