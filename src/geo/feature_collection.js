//  @flow

import Geometry from "./geometry";

/**
 * The GeoJSON FeatureCollection object
 * @param {jsonOdm.Geo.Feature[]|Array} features
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 */
export default class FeatureCollection extends Geometry {

    constructor(features, boundaryBox) {
        super(boundaryBox);
        this.type = "FeatureCollection";
        this.features = features || [];
    }
}