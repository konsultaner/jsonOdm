// @flow

import FeatureCollection from "./geo/feature_collection";
import Feature from "./geo/feature";
import BoundaryBox from "./geo/boundary_box";
import Point from "./geo/point";

import Util from "./geo/util";
import MultiPoint from "./geo/multi_point";
import LineString from "./geo/line_string";
import MultiLineString from "./geo/multi_line_string";
import Polygon from "./geo/polygon";

/**
 * The object to provide geographical data and methods. <br>
 * <strong style='color:#ff0000'>Warning:</strong> The coordinate reference system is <a href="http://spatialreference.org/ref/epsg/4326/" target="_blank">WGS 84</a>
 * witch uses the coordinate order [<strong>longitude</strong>,<strong>latitude</strong>]!<br>
 * Changing the coordinate reference system (CRS) is not supported yet.
 * @module jsonOdm.Geo
 * @constructor
 */
export default class Geo {

    static FeatureCollection = FeatureCollection;
    static Feature = Feature;
    static BoundaryBox = BoundaryBox;
    static Point = Point;
    static MultiPoint = MultiPoint;
    static LineString = LineString;
    static MultiLineString = MultiLineString;
    static Polygon = Polygon;

    static detectAsGeometry = Util.detectAsGeometry;
}


/**
 * A GeoJSON GeometryCollection object
 * @param {Array} geometries An array of GeoJSON geometry objects
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var polygons = new jsonOdm.Geo.GeometryCollection([
 *    new jsonOdm.Geo.LineString([[51.5,32.1],[51.6,21]]),
 *    new jsonOdm.Geo.MultiPoint([[51.5,32],[51.6,21]]),
 *    new jsonOdm.Geo.LineString([[51.3,32.2],[51.9,21]])
 * ]);
 * @constructor
 */
jsonOdm.Geo.GeometryCollection = function (geometries, boundaryBox) {
    this.type = "GeometryCollection";
    this.geometries = geometries;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a GeometryCollection is inside of another geometry
 * @param {jsonOdm.Geo.GeometryCollection} geometryCollection
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.GeometryCollection.within = function (geometryCollection, geometry) {
    if (!jsonOdm.util.isArray(geometryCollection.geometries) || !geometryCollection.geometries.length || !geometry.type) {
        return false;
    }
    for (var i = 0; i < geometryCollection.geometries.length; i++) {
        if (jsonOdm.Geo[geometryCollection.geometries[i].type] && jsonOdm.Geo[geometryCollection.geometries[i].type].within) {
            if (!jsonOdm.Geo[geometryCollection.geometries[i].type].within(geometryCollection.geometries[i], geometry)) {
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
 * @param {jsonOdm.Geo.GeometryCollection} geometryCollection
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.GeometryCollection.intersects = function (geometryCollection, geometry) {
    if (!jsonOdm.util.isArray(geometryCollection.geometries) || !geometryCollection.geometries.length || !geometry.type) {
        return false;
    }
    for (var i = 0; i < geometryCollection.geometries.length; i++) {
        if (jsonOdm.Geo[geometryCollection.geometries[i].type] && jsonOdm.Geo[geometryCollection.geometries[i].type].intersects) {
            if (jsonOdm.Geo[geometryCollection.geometries[i].type].intersects(geometryCollection.geometries[i], geometry)) {
                return true;
            }
        }
    }
    return false;
};


if (typeof module !== "undefined" && module.exports) {
    module.exports = jsonOdm.Geo;
}