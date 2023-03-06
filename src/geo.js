// @flow

import FeatureCollection from "./geo/feature_collection";
import Feature from "./geo/feature";
import BoundaryBox from "./geo/boundary_box";
import Point from "./geo/point";
import LineString from "./geo/line_string";
import MultiPoint from "./geo/multi_point";
import MultiLineString from "./geo/multi_line_string";
import Polygon from "./geo/polygon";
import MultiPolygon from "./geo/multi_polygon";
import GeometryCollection from "./geo/geometry_collection";
import Util from "./geo/util";

/**
 * The object to provide geographical data and methods. <br>
 * <strong style='color:#ff0000'>Warning:</strong> The coordinate reference system is <a href="http://spatialreference.org/ref/epsg/4326/" target="_blank">WGS 84</a>
 * witch uses the coordinate order [<strong>longitude</strong>,<strong>latitude</strong>]!<br>
 * Changing the coordinate reference system (CRS) is not supported yet.
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
    static MultiPolygon = MultiPolygon;
    static GeometryCollection = GeometryCollection;

    static detectAsGeometry = Util.detectAsGeometry;
}