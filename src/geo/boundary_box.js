// @flow

import {Polygon} from "./polygon";

export default class BoundaryBox extends Array {

    /**
     * A GeoJSON BoundaryBox object
     * @param {Array} boundaryBox An array with [min. longitude, min. latitude, max. longitude, max. latitude]
     * @example
     * var boundaryBox = new jsonOdm.Geo.BoundaryBox([-180.00,-90.00,180.00,90.00]);
     * @constructor
     */
    constructor(boundaryBox) {
        super();
        if (Array.isArray(boundaryBox)) {
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