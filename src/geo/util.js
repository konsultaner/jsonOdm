// @flow

import Point from "./point";
import BoundaryBox from "./boundary_box";
import LineString from "./line_string";
import Polygon from "./polygon";
import MultiPolygon from "./multi_polygon";

export default class Util {

    /**
     * Takes an array and puts it into a GeoJSON geometry definition. If the geometry already is a valid GeoJSON it will only be returned
     * @param {Array|BoundaryBox|Point|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry
     * @return {boolean|BoundaryBox|Point|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection}
     */
    static detectAsGeometry (geometry) {
        if (!geometry.type) {
            if (Array.isArray(geometry) && geometry.length === 2 && !Array.isArray(geometry[0])) {
                geometry = new Point(geometry);
            } else if (Array.isArray(geometry) && geometry.length === 4 && !Array.isArray(geometry[0])) {
                geometry = new BoundaryBox(geometry);
            } else if (Array.isArray(geometry) && geometry.length >= 1 && Array.isArray(geometry[0]) && geometry[0].length === 2 && !Array.isArray(geometry[0][0])) {
                geometry = new LineString(geometry);
            } else if (Array.isArray(geometry) && geometry.length >= 1 &&
                Array.isArray(geometry[0]) && geometry[0].length >= 1 &&
                Array.isArray(geometry[0][0]) && geometry[0][0].length === 2 && !Array.isArray(geometry[0][0][0])) {
                geometry = new Polygon(geometry);
            } else if (Array.isArray(geometry) && geometry.length >= 1 &&
                Array.isArray(geometry[0]) && geometry[0].length >= 1 &&
                Array.isArray(geometry[0][0]) && geometry[0][0].length >= 1 &&
                Array.isArray(geometry[0][0][0]) && geometry[0][0][0].length === 2 && !Array.isArray(geometry[0][0][0][0])) {
                geometry = new MultiPolygon(geometry);
            } else {
                return false;
            }
        }
        return geometry;
    };


    /**
     * The method checks whether a point is inside a polygon or not. The polygon will be auto closed
     * @param {Array} point A point representation i.e. [1,2]
     * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
     * @return {boolean}
     */
    static pointWithinPolygon (point, polygon) {
        if (!(Array.isArray(point) && Array.isArray(polygon) && polygon.length > 2)) {
            return false;
        }

        let intersection = 0, foundX;

        // close the polygon
        if (!(polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1])) {
            polygon = polygon.concat([polygon[0]]);
        }

        // do not enter the last point because the calculation also reads the i+1th index
        for (let i = 0; i < polygon.length - 1; i++) {
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
        return intersection % 2 === 1; // the normalized x-axis needs to be intersected by an odd amount of intersections
    };

    /**
     * The method checks whether an edge is inside a polygon or not. The polygon will be auto closed
     * @param {Array} edge A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
     * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
     * @return {boolean}
     */
    static edgeWithinPolygon (edge, polygon) {
        if (!(Array.isArray(edge) && edge.length === 2 && Array.isArray(polygon) && polygon.length >= 2)) {
            return false;
        }

        // close the polygon
        if (!(polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1])) {
            polygon = polygon.concat([polygon[0]]);
        }
        if (!Util.pointWithinPolygon(edge[0], polygon) || !Util.pointWithinPolygon(edge[1], polygon)) {
            return false;
        }

        for (let i = 0; i < polygon.length - 1; i++) {
            // All points may be inside the polygon but their might be faces that are outside the polygon
            if (Util.edgeIntersectsEdge(edge, [polygon[i], polygon[i + 1]], false)) {
                return false;
            }
        }
        return true;
    };

    /**
     * The method checks whether an edge intersects a polygon or not. The polygon will be auto closed
     * @param {Array} edge A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
     * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
     * @return {boolean}
     */
    static edgeIntersectsPolygon (edge, polygon) {
        if (!(Array.isArray(edge) && edge.length === 2 && Array.isArray(polygon) && polygon.length >= 2)) {
            return false;
        }

        // close the polygon
        if (!(polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1])) {
            polygon = polygon.concat([polygon[0]]);
        }
        if (Util.pointWithinPolygon(edge[0], polygon) || Util.pointWithinPolygon(edge[1], polygon)) {
            return true;
        }

        for (let i = 0; i < polygon.length - 1; i++) {
            // All points may be outside the polygon but their might be faces that are inside the polygon
            if (Util.edgeIntersectsEdge(edge, [polygon[i], polygon[i + 1]])) {
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
    static edgeIntersectsLineString (edge, lineString) {
        if (!(Array.isArray(edge) && edge.length === 2 && Array.isArray(lineString))) {
            return false;
        }
        for (let i = 0; i < lineString.length - 1; i++) {
            if (Util.edgeIntersectsEdge(edge, [lineString[i], lineString[i + 1]])) {
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
    static edgeIntersectsEdge (edge1, edge2, allowOnEdge) {
        allowOnEdge = typeof allowOnEdge === "undefined" ? true : allowOnEdge;
        let directionVector1 = [edge1[1][0] - edge1[0][0], edge1[1][1] - edge1[0][1]],
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

        let t = (edge2[0][1] * (directionVector2[0]) + edge1[0][0] * (directionVector2[1]) - edge2[0][0] * (directionVector2[1]) - edge1[0][1] * (directionVector2[0])) / ((directionVector1[1]) * (directionVector2[0]) - (directionVector1[0]) * (directionVector2[1])),
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
    static pointWithinLineString (point, lineString) {
        if (!(Array.isArray(point) && Array.isArray(lineString) && lineString.length >= 2)) {
            return false;
        }
        for (let i = 0; i < lineString.length - 1; i++) {
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

                    ((lineString[i][1] - lineString[i + 1][1]) !== 0 && ((lineString[i][0] - lineString[i + 1][0]) * ((point[1] - lineString[i + 1][1]) / (lineString[i][1] - lineString[i + 1][1])) + lineString[i + 1][0] === point[0])) ||
                    ((lineString[i][0] - lineString[i + 1][0]) !== 0 && ((lineString[i][1] - lineString[i + 1][1]) * ((point[0] - lineString[i + 1][0]) / (lineString[i][0] - lineString[i + 1][0])) + lineString[i + 1][1] === point[1]))
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
    static pointWithinBounds (point, bounds) {
        if (!(Array.isArray(point) && Array.isArray(bounds) && bounds.length === 4)) {
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
    static edgeIntersectsBounds (edge, bounds): boolean {
        if (!(Array.isArray(edge) && Array.isArray(bounds) && bounds.length === 4)) {
            return false;
        }
        return Util.edgeIntersectsPolygon(edge, [[bounds[0], bounds[1]], [bounds[2], bounds[1]], [bounds[2], bounds[3]], [bounds[0], bounds[3]]]);
    };

    /**
     * TODO: ALSO needs to return true for [[1,1],[2,2,]] and [[0,0],[4,4]] // probably needs a rewrite
     * Checks whether a line follows another line or is on the line respectively
     * @param {Array} lineString An array of points, i.e. [[1,1],[1,2],[1,3]]
     * @param {Array} inLineString An array of points, i.e. [[1,1],[1,2],[1,3]]
     * @return {boolean}
     */
    static lineStringWithinLineString (lineString, inLineString): boolean {
        if (!(Array.isArray(lineString) && Array.isArray(inLineString))) {
            return false;
        }
        let i, j;
        for (i = 0; lineString && i < lineString.length; i++) {
            let found = false;
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
}