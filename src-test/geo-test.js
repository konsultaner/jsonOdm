"use strict";

var GeoTest = TestCase("GeoTest");

GeoTest.prototype.testPointInPolygon = function () {
    var point = [10,10];
    var polygon1 = [[0,0],[0,20],[20,20],[20,0],[0,0]];
    var polygon2 = [[0,0],[20,0],[9,10],[20,20],[0,20],[0,0]];
    var polygon3 = [[0,0],[20,0],[9,10],[20,20],[9,0],[0,0]];
    var polygon4 = [[0,0],[20,0],[9,10],[20,20],[21,0],[22,20],[23,0],[24,20],[25,0],[0,0]];
    var polygon5 = [[0,0],[20,0],[0,20],[0,0]];
    var polygon6 = [[10,20],[30,10],[10,10],[10,50],[10,20]];

    assertTrue("Point in Square",jsonOdm.Geo.pointWithinPolygon(point,polygon1));
    assertFalse("Point not in Square",jsonOdm.Geo.pointWithinPolygon(point,polygon2));
    assertTrue("Point in Square",jsonOdm.Geo.pointWithinPolygon(point,polygon3));
    assertTrue("Point in Square",jsonOdm.Geo.pointWithinPolygon(point,polygon4));
    assertTrue("Point on Path",jsonOdm.Geo.pointWithinPolygon(point,polygon5));
    assertTrue("Point on Vertex",jsonOdm.Geo.pointWithinPolygon(point,polygon6));
};

GeoTest.prototype.testDetectGeometry = function () {
    assertTrue("Detect as Point",       jsonOdm.Geo.detectAsGeometry([1,1])       instanceof jsonOdm.Geo.Point);
    assertTrue("Detect as BoundaryBox", jsonOdm.Geo.detectAsGeometry([1,1,3,3])   instanceof Array); // is an Array because constructor returns an array
    assertTrue("Detect as LineString",  jsonOdm.Geo.detectAsGeometry([[1,1]])     instanceof jsonOdm.Geo.LineString);
    assertTrue("Detect as Polygon",     jsonOdm.Geo.detectAsGeometry([[[1,1]]])   instanceof jsonOdm.Geo.Polygon);
    assertTrue("Detect as MultiPolygon",jsonOdm.Geo.detectAsGeometry([[[[1,1]]]]) instanceof jsonOdm.Geo.MultiPolygon);
};

GeoTest.prototype.testPointInGeometry = function () {
    assertTrue("Point is in Point" ,      jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.Point([1,1])));
    assertFalse("Point is not in Point" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.Point([1,2])));

    assertTrue("Point is in bounds" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.BoundaryBox([0,0,2,2])));
    assertTrue("Point is just in bounds" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.BoundaryBox([0,0,1,1])));
    assertFalse("Point is not in bounds" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.BoundaryBox([2,2,8,8])));

    assertTrue("Point is in LineString" ,      jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.LineString([[1,1],[1,2]])));
    assertFalse("Point is not in LineString" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.LineString([[2,1],[1,2]])));
    assertFalse("Point is not in LineString" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.LineString([1,1])));

    assertTrue("Point is in MultiLineString first" ,  jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]])));
    assertTrue("Point is in MultiLineString second" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,1]]])));
    assertFalse("Point is not in MultiLineString" ,   jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])));
    assertFalse("Point is not in MultiLineString" ,   jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.MultiLineString([[1,1],[1,2]])));

    assertTrue("Point is in Polygon on vertex" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.Polygon([[[1,2],[3,1],[1,1],[1,5],[1,2]]])));
    assertTrue("Point is in Polygon on path" ,   jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.Polygon([[[0,0],[2,0],[0,2],[0,0]]])));
    assertTrue("Point is in Polygon inside" ,    jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]])));
    assertFalse("Point is not in Polygon" ,      jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]),new jsonOdm.Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]])));

    assertTrue("Point is in MultiPolygon[0] on vertex " , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]), new jsonOdm.Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]])));
    assertTrue("Point is in MultiPolygon[1] on vertex " , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]), new jsonOdm.Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[1,2],[3,1],[1,1],[1,5],[1,2]]]])));
    assertTrue("Point is in MultiPolygon[0] on path" ,    jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]), new jsonOdm.Geo.MultiPolygon([[[[0,0],[2,0],[0,2],[0,0]]],[[[0,0],[-2,0],[0,-2],[0,0]]]])));
    assertTrue("Point is in MultiPolygon[1] on path" ,    jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]), new jsonOdm.Geo.MultiPolygon([[[[0,0],[-2,0],[0,-2],[0,0]]],[[[0,0],[2,0],[0,2],[0,0]]]])));
    assertTrue("Point is in MultiPolygon[0] inside" ,     jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]), new jsonOdm.Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]])));
    assertTrue("Point is in MultiPolygon[1] inside" ,     jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]), new jsonOdm.Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]])));
    assertFalse("Point is in MultiPolygon on vertex " ,   jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([-1,1]),new jsonOdm.Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]])));

    assertTrue("Point is in GeometryCollection[0]" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]), new jsonOdm.Geo.GeometryCollection([
        new jsonOdm.Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,1]]]),
        new jsonOdm.Geo.LineString([[2,1],[1,2]]),
        new jsonOdm.Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
    ])));
    assertTrue("Point is in GeometryCollection[1]" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]), new jsonOdm.Geo.GeometryCollection([
        new jsonOdm.Geo.LineString([[2,1],[1,2]]),
        new jsonOdm.Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]),
        new jsonOdm.Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
    ])));
    assertFalse("Point is not in GeometryCollection" , jsonOdm.Geo.Point.within(new jsonOdm.Geo.Point([1,1]), new jsonOdm.Geo.GeometryCollection([
        new jsonOdm.Geo.LineString([[2,1],[1,2]]),
        new jsonOdm.Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
    ])));

};