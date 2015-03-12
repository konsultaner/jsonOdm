"use strict";

var GeoTest = TestCase("GeoTest");

GeoTest.prototype.testPointInPolygon = function () {
    var point = [10,10];
    var polygon1 = [[0,0],[0,20],[20,20],[20,0],[0,0]];
    var polygon2 = [[0,0],[20,0],[9,10],[20,20],[0,20],[0,0]];
    var polygon3 = [[0,0],[20,0],[9,10],[20,20],[9,0],[0,0]];
    var polygon4 = [[0,0],[20,0],[9,10],[20,20],[21,0],[22,20],[23,0],[24,20],[25,0],[0,0]];

    assertTrue("Point in Square",jsonOdm.Geo.pointWithinPolygon(point,polygon1));
    assertFalse("Point not in Square",jsonOdm.Geo.pointWithinPolygon(point,polygon2));
    assertTrue("Point in Square",jsonOdm.Geo.pointWithinPolygon(point,polygon3));
    assertTrue("Point in Square",jsonOdm.Geo.pointWithinPolygon(point,polygon4));
};