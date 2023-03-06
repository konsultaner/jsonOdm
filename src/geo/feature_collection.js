//  @flow

import Geometry from "./geometry";

export default class FeatureCollection extends Geometry {

    /**
     * The GeoJSON FeatureCollection object
     * @param {jsonOdm.Geo.Feature[]|Array} features
     * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
     * @constructor
     */
    constructor(features, boundaryBox) {
        super(boundaryBox);
        this.type = "FeatureCollection";
        this.features = features || [];
    }
}