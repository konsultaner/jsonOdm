/**
 * A GeoJSON geometry object
 * this is an abstract class for internal use
 */
export default class Geometry {
    bbox: number[];

    constructor(boundaryBox: number[]) {
        if (boundaryBox) {
            this.bbox = boundaryBox;
        }
    }
}