import Geometry from "./geometry";

/**
 * A GeoJSON GeometryCollection object
 * @param {Array} geometries An array of GeoJSON geometry objects
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var polygons = new GeometryCollection([
 *    new LineString([[51.5,32.1],[51.6,21]]),
 *    new MultiPoint([[51.5,32],[51.6,21]]),
 *    new LineString([[51.3,32.2],[51.9,21]])
 * ]);
 */
export default class GeometryCollection extends Geometry  {
    geometries: any[];

    constructor(geometries, boundaryBox) {
        super(boundaryBox);
        this.geometries = geometries;
    };

    /**
     * Checks whether a GeometryCollection is inside another geometry
     * @param {GeometryCollection} geometryCollection
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static within(geometryCollection, geometry) {
        if (!Array.isArray(geometryCollection.geometries) || !geometryCollection.geometries.length || !geometry instanceof Geometry) {
            return false;
        }
        for (let i = 0; i < geometryCollection.geometries.length; i++) {
            if (geometryCollection.geometries[i].constructor.within) {
                if (!geometryCollection.geometries[i].constructor.within(geometryCollection.geometries[i], geometry)) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    };

    /**
     * Checks whether a GeometryCollection intersects another geometry
     * @param {GeometryCollection} geometryCollection
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any &lt;geometry&gt; object
     * @return {boolean}
     */
    static intersects(geometryCollection, geometry) {
        if (!Array.isArray(geometryCollection.geometries) || !geometryCollection.geometries.length || !geometry instanceof Geometry) {
            return false;
        }
        for (let i = 0; i < geometryCollection.geometries.length; i++) {
            if (geometryCollection.geometries[i].constructor.intersects) {
                if (geometryCollection.geometries[i].constructor.intersects(geometryCollection.geometries[i], geometry)) {
                    return true;
                }
            }
        }
        return false;
    };


}