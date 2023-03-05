// @flow

export class Polygon {

    coordinates: any[];
    bbox: number[];

    /**
     * A GeoJSON Polygon object
     * @param {Array} positions An array of arrays with at least 2-dimensional arrays of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude.
     * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
     * @example
     * var polygon = new jsonOdm.Geo.Polygon([
     *    // The last position should be equal to the first one to close the polygon
     *    [[51.2,32],[51.4,21],[51.6,21],[51.2,21]],
     *    // Must be fully inside the n-1th poly-line
     *    [[51.5,32],[51.6,21],[51.7,21],[51.5,21]]
     *    // more inner holes might follow
     * ]);
     * @constructor
     */
    constructor(positions, boundaryBox) {
        this.type = "Polygon";
        this.coordinates = positions;
        if (boundaryBox) {
            this.bbox = boundaryBox;
        }
    }

    /**
     * Checks whether a Polygon is inside another geometry
     * @param {Polygon} polygon
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
     * @return {boolean}
     */
    static within (polygon, geometry) {
        var i, j;
        if (!polygon.coordinates || !jsonOdm.util.isArray(polygon.coordinates)) {
            return false;
        }
        if (geometry.type === "Point" || geometry.type === "MultiPoint" || geometry.type === "LineString" || geometry.type === "MultiLineString") {
            return false;
        }

        if (geometry.type === "Polygon") {
            for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length - 1; i++) {
                if (!jsonOdm.Geo.edgeWithinPolygon([polygon.coordinates[0][i], polygon.coordinates[0][i + 1]], geometry.coordinates[0])) {
                    return false;
                }
            }
            return true;
        }
        if (geometry.type === "MultiPolygon") {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (j = 0; polygon.coordinates[0] && j < polygon.coordinates[0].length - 1; j++) {
                    var inside = jsonOdm.Geo.edgeWithinPolygon([polygon.coordinates[0][j], polygon.coordinates[0][j + 1]], geometry.coordinates[i][0]);
                    if (!inside) {
                        break;
                    }
                    if (inside && j + 1 === polygon.coordinates[0].length - 1) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (jsonOdm.Geo.Polygon.within(polygon, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length; i++) {
            if (!jsonOdm.Geo.pointWithinBounds(polygon.coordinates[0][i], geometry)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks whether a Polygon intersects another geometry
     * @param {Polygon} polygon
     * @param {Point|BoundaryBox|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon|GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
     * @return {boolean}
     */
    static intersects (polygon: Polygon, geometry): boolean {
        let i, j;
        if (!polygon.coordinates || !jsonOdm.util.isArray(polygon.coordinates)) {
            return false;
        }
        if (geometry.type === "Point") {
            return jsonOdm.Geo.Point.intersects(geometry, polygon);
        }
        if (geometry.type === "MultiPoint") {
            return jsonOdm.Geo.MultiPoint.intersects(geometry, polygon);
        }
        if (geometry.type === "LineString") {
            return jsonOdm.Geo.LineString.intersects(geometry, polygon);
        }
        if (geometry.type === "MultiLineString") {
            return jsonOdm.Geo.MultiLineString.intersects(geometry, polygon);
        }

        if (geometry.type === "Polygon") {
            for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length - 1; i++) {
                if (jsonOdm.Geo.edgeIntersectsPolygon([polygon.coordinates[0][i], polygon.coordinates[0][i + 1]], geometry.coordinates[0])) {
                    return true;
                }
            }
            return false;
        }
        if (geometry.type === "MultiPolygon") {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (j = 0; polygon.coordinates[0] && j < polygon.coordinates[0].length - 1; j++) {
                    if (jsonOdm.Geo.edgeIntersectsPolygon([polygon.coordinates[0][j], polygon.coordinates[0][j + 1]], geometry.coordinates[i][0])) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
            // maybe order it by complexity to get a better best case scenario
            for (i = 0; i < geometry.geometries.length; i++) {
                if (jsonOdm.Geo.Polygon.intersects(polygon, geometry.geometries[i])) {
                    return true;
                }
            }
            return false;
        }
        // assume we have a BoundaryBox given
        for (i = 0; polygon.coordinates[0] && i < polygon.coordinates[0].length - 1; i++) {
            if (jsonOdm.Geo.edgeIntersectsBounds([polygon.coordinates[0][i], polygon.coordinates[0][i + 1]], geometry)) {
                return true;
            }
        }
        return false;
    }
}