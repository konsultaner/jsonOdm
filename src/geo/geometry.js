export default class Geometry {
    bbox: number[];

    constructor(boundaryBox) {
        if (boundaryBox) {
            this.bbox = boundaryBox;
        }
    }
}