// @flow

import Polygon from "./polygon";

/**
 * A GeoJSON BoundaryBox object
 * @param {Array} boundaryBox An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var boundaryBox = new jsonOdm.Geo.BoundaryBox([-180.00,-90.00,180.00,90.00]);
 */
export default class BoundaryBox extends Array {

    constructor(boundaryBox) {
        super();
        if (Array.isArray(boundaryBox)) {
            this[0] = boundaryBox[0];
            this[1] = boundaryBox[1];
            this[2] = boundaryBox[2];
            this[3] = boundaryBox[3];
        } else {
            this[0] = 0;
            this[1] = 0;
            this[2] = 0;
            this[3] = 0;
        }
    }

    /**
     * Checks whether a BoundaryBox is inside another geometry
     * @param {BoundaryBox} bounds
     * @param {Point|BoundaryBox|MultiPoint|LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
     * @return {boolean}
     */
    static within(bounds, geometry): boolean {
        if (!Array.isArray(bounds) || bounds.length !== 4) {
            return false;
        }
        // a boundary box is equal to a polygonal box
        return Polygon.within(new Polygon([[[bounds[0], bounds[1]], [bounds[2], bounds[1]], [bounds[2], bounds[3]], [bounds[0], bounds[3]], [bounds[0], bounds[1]]]]), geometry);
    }
}