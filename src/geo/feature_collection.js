//  @flow

export default class FeatureCollection {

    /**
     * The GeoJSON FeatureCollection object
     * @param {jsonOdm.Geo.Feature[]|Array} features
     * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
     * @constructor
     */
    constructor(features, boundaryBox) {
        this.type = "FeatureCollection";
        this.features = features || [];
        if (boundaryBox) {
            this.bbox = boundaryBox;
        }
    }
}