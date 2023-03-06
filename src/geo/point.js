// @flow

import Util from "./util";
import Polygon from "./polygon";
import MultiPoint from "./multi_point";
import LineString from "./line_string";
import MultiLineString from "./multi_line_string";
import MultiPolygon from "./multi_polygon";
import Geometry from "./geometry";
import GeometryCollection from "./geometry_collection";

/**
 * A GeoJSON Point object
 * @param {Array} position A 2-dimensional array with the first entry being the longitude and the second one being the latitude, i.e. [51,32]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var point = new jsonOdm.Geo.Point([51.5,32]);
 */
export default class Point extends Geometry  {

    coordinates: any[];

    constructor (position, boundaryBox) {
        super(boundaryBox);
        this.coordinates = position;
    }


    /**
     * Checks whether a Point is inside another geometry
     * @param {Point} point
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
     * @return {boolean}
     */
    static within (point: Point, geometry): boolean {
        let i, j;
        if (!point.coordinates) {
            return false;
        }
        if (geometry instanceof Point) {
            return geometry.coordinates[0] === point.coordinates[0] && geometry.coordinates[1] === point.coordinates[1];
        }
        if (geometry instanceof MultiPoint || geometry instanceof LineString) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (geometry.coordinates[i][0] === point.coordinates[0] && geometry.coordinates[i][1] === point.coordinates[1]) {
                    return true;
                }
            }
            return false;
        }
        if (geometry instanceof MultiLineString) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (j = 0; geometry.coordinates[i] && j < geometry.coordinates[i].length; j++) {
                    if (geometry.coordinates[i][j][0] === point.coordinates[0] && geometry.coordinates[i][j][1] === point.coordinates[1]) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry instanceof Polygon) {
            // we assume that polygon wholes do not intersect the outer polygon
            return Util.pointWithinPolygon(point.coordinates, geometry.coordinates ? geometry.coordinates[0] : null);
        }
        if (geometry instanceof MultiPolygon) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                // we assume that polygon wholes do not intersect the outer polygon
                if (Util.pointWithinPolygon(point.coordinates, geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) {
                    return true;
                }
            }
            return false;
        }
        if (geometry instanceof GeometryCollection && Array.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (Point.within(point, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // might be a boundary box
        return Util.pointWithinBounds(point.coordinates, geometry);
    }

    /**
     * Checks whether a Point intersects a geometry witch is equal to the Point being inside a geometry. This is an alias of jsonOdm.Geo.Point.within
     * @param {Point} point
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
     * @return {boolean}
     */
    static intersects (point: Point, geometry): boolean {
        return Point.within(point, geometry);
    }
}