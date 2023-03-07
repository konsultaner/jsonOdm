/** @namespace Geo */
import Geo from "../src/geo";
import Util from "../src/geo/util";

describe("Geo Tools", function () {
    // GEO HELPER
    describe("Point in Polygon", function () {
        var point = [10,10];
        var polygon1 = [[0,0],[0,20],[20,20],[20,0],[0,0]];
        var polygon2 = [[0,0],[20,0],[9,10],[20,20],[0,20],[0,0]];
        var polygon3 = [[0,0],[20,0],[9,10],[20,20],[9,0],[0,0]];
        var polygon4 = [[0,0],[20,0],[9,10],[20,20],[21,0],[22,20],[23,0],[24,20],[25,0],[0,0]];
        var polygon5 = [[0,0],[20,0],[0,20],[0,0]];
        var polygon6 = [[10,20],[30,10],[10,10],[10,50],[10,20]];

        it("Should be in Square", function () {
            expect(Util.pointWithinPolygon(point,polygon1)).toBeTruthy();
        });
        it("Should be in Square", function () {
            expect(Util.pointWithinPolygon(point,polygon3)).toBeTruthy();
        });
        it("Should be in Square", function () {
            expect(Util.pointWithinPolygon(point,polygon4)).toBeTruthy();
        });
        it("Should be on Path", function () {
            expect(Util.pointWithinPolygon(point,polygon5)).toBeTruthy();
        });
        it("Should be on Vertex", function () {
            expect(Util.pointWithinPolygon(point,polygon6)).toBeTruthy();
        });
        it("Should be on Vertex", function () {
            expect(Util.pointWithinPolygon([1,1], [[1,2],[3,1],[1,1],[1,5],[1,2]])).toBeTruthy();
        });
        it("Should not be in Square", function () {
            expect(Util.pointWithinPolygon(point,polygon2)).toBeFalsy();
        });
    });
    describe("Edge Intersects Edge", function () {
        it("Should intersect", function () {
           expect(Util.edgeIntersectsEdge([[0,0], [10,9] ],[[10,0] ,[0,9]])).toBeTruthy();
           expect(Util.edgeIntersectsEdge([[10,0],[0,10] ],[[0,0]  ,[10,10]])).toBeTruthy();
        });
        it("Should intersect in vertex", function () {
           expect(Util.edgeIntersectsEdge([[0,0], [10,10]],[[0,0]  ,[11,10]])).toBeTruthy();
           expect(Util.edgeIntersectsEdge([[0,0], [10,10]],[[1,0]  ,[10,10]])).toBeTruthy();
        });
        it("Should be within each other", function () {
           expect(Util.edgeIntersectsEdge([[0,0], [10,10]],[[1,1]  ,[9,9]])).toBeTruthy();
           expect(Util.edgeIntersectsEdge([[1,1], [9,9]],  [[0,0]  ,[10,10]])).toBeTruthy();
        });
        it("Should be parallel", function () {
           expect(Util.edgeIntersectsEdge([[0,0], [10,10]],[[1,0]  ,[11,10]])).toBeFalsy();
           expect(Util.edgeIntersectsEdge([[0,0], [10,10]],[[-1,0] ,[-11,-10]])).toBeFalsy();
        });
        it("Should be out of bounds", function () {
           expect(Util.edgeIntersectsEdge([[0,0], [10,10]],[[-10,0],[-1,-10]])).toBeFalsy();
           expect(Util.edgeIntersectsEdge([[0,0], [10,10]],[[2,0]  ,[11,10]])).toBeFalsy();
           expect(Util.edgeIntersectsEdge([[0,1], [0,3]]  ,[[0,10] ,[10,10]])).toBeFalsy();
        });
    });
    describe("Intersect Bounds", function () {
        it("Should intersect", function () {
           expect(Util.edgeIntersectsBounds([[-1,0],[3,0]],[0,0,2,2])).toBeTruthy();
           expect(Util.edgeIntersectsBounds([[1,1],[1.5,1.5]],[0,0,2,2])).toBeTruthy();
           expect(Util.edgeIntersectsBounds([[1,1],[8,1.5]],[0,0,2,2])).toBeTruthy();
        });
        it("Should not intersect", function () {
            expect(Util.edgeIntersectsBounds([[-1,0],[3,-1]],[0,0,2,2])).toBeFalsy();
        });
    });
    describe("Edge within polygon", function () {
        it("Should be inside", function () {
            expect(Util.edgeWithinPolygon([[1,1],[3,3]],[[0,0],[0,10],[10,10],[10,0]])).toBeTruthy();
            expect(Util.edgeWithinPolygon([[0,1],[0,3]],[[0,0],[0,10],[10,10],[10,0]])).toBeTruthy();
        });
        it("Should be outside", function () {
            expect(Util.edgeWithinPolygon([[10,1],[10,11]],[[0,0],[0,10],[10,10],[10,0]])).toBeFalsy();
            expect(Util.edgeWithinPolygon([[2,5],[10,6]],[[0,0],[10,0],[10,10],[6,10],[6,4],[5,10],[0,10]])).toBeFalsy();
        });
    });
    describe("LineString within LineString", function () {
        it("Sould only take arrays", function () {
            expect(Util.lineStringWithinLineString([[1,2],[3,2]],[[0,0],[1,2],[3,2],[4,4]])).toBeTruthy();
            expect(Util.lineStringWithinLineString([[1,1],[2,2]],[[0,0],[1,1]])).toBeFalsy();
            expect(Util.lineStringWithinLineString()).toBeFalsy();
        })
    });
    describe("Point on LineString", function () {
        var point = [10,10];
        var line1 = [[0,0],[0,10],[10,10],[10,0]];
        var line2 = [[0,0],[0,20],[10,20],[10,19]];
        var line3 = [[0,0],[20,0],[0,20]];
        var line4 = [[0,0],[20,0],[20,20],[0,20]];

        it("Should be on it", function () {
            expect(Util.pointWithinLineString([1,1],[[3,1],[1,1]])).toBeTruthy();
            expect(Util.pointWithinLineString(point,line1)).toBeTruthy();
            expect(Util.pointWithinLineString(point,line3)).toBeTruthy();
        });
        it("Should not be on it", function () {
            expect(Util.pointWithinLineString(point,line2)).toBeFalsy();
            expect(Util.pointWithinLineString(point,line4)).toBeFalsy();
        });
    });
    describe("Detect Geometry", function () {
        it("should find the right one", function () {
            expect(Util.detectAsGeometry([1,1]) instanceof Geo.Point).toBeTruthy();
            expect(Util.detectAsGeometry([1,1,3,3]) instanceof Array).toBeTruthy(); // is an Array because constructor returns an array
            expect(Util.detectAsGeometry([[1,1]]) instanceof Geo.LineString).toBeTruthy();
            expect(Util.detectAsGeometry([[[1,1]]]) instanceof Geo.Polygon).toBeTruthy();
            expect(Util.detectAsGeometry([[[[1,1]]]]) instanceof Geo.MultiPolygon).toBeTruthy();
        });
    });
    describe("Create Empty Boundary Box", function () {
        var emptyBounds = new Geo.BoundaryBox();
        it("Should have als parameters zeroed", function () {
            expect(emptyBounds[0]).toBe(0);
            expect(emptyBounds[1]).toBe(0);
            expect(emptyBounds[2]).toBe(0);
            expect(emptyBounds[3]).toBe(0);
        });
    });
    // GEO WITHIN
    describe("Point in Geometry", function () {
        it("Should be in Point", function () {
           expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.Point([1,1]))).toBeTruthy();
        });
        it("Should not be in Point", function () {
           expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.Point([1,2]))).toBeFalsy();
        });
        it("Should be in bounds", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.BoundaryBox([0,0,1,1]))).toBeTruthy();
        });
        it("Should not be in bounds", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.BoundaryBox([2,2,8,8]))).toBeFalsy();
        });
        it("Should be in LineString", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.LineString([[1,1],[1,2]]))).toBeTruthy();
        });
        it("Should not be in LineString", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.LineString([[2,1],[1,2]]))).toBeFalsy();
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.LineString([1,1]))).toBeFalsy();
        });
        it("Should be in MultiLineString", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,1]]]))).toBeTruthy();
        });
        it("Should not be in MultiLineString", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]]))).toBeFalsy();
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.MultiLineString([[1,1],[1,2]]))).toBeFalsy();
        });
        it("Should be in Polygon", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.Polygon([[[1,2],[3,1],[1,1],[1,5],[1,2]]]))).toBeTruthy();
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.Polygon([[[0,0],[2,0],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
        });
        it("Should not be in Polygon", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should be in MultiPolygon on vertex, on path, inside", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.Point.within(new Geo.Point([1,1]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[1,2],[3,1],[1,1],[1,5],[1,2]]]]))).toBeTruthy();
            expect(Geo.Point.within(new Geo.Point([1,1]), new Geo.MultiPolygon([[[[0,0],[2,0],[0,2],[0,0]]],[[[0,0],[-2,0],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.Point.within(new Geo.Point([1,1]), new Geo.MultiPolygon([[[[0,0],[-2,0],[0,-2],[0,0]]],[[[0,0],[2,0],[0,2],[0,0]]]]))).toBeTruthy();
            expect(Geo.Point.within(new Geo.Point([1,1]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.Point.within(new Geo.Point([1,1]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
        });
        it("Should not be in MultiPolygon", function () {
            expect(Geo.Point.within(new Geo.Point([-1,1]),new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("Point is in GeometryCollection[0]", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]), new Geo.GeometryCollection([
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,1]]]),
                new Geo.LineString([[2,1],[1,2]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Point is in GeometryCollection[1]", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]), new Geo.GeometryCollection([
                new Geo.LineString([[2,1],[1,2]]),
                new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Point is in GeometryCollection[1]", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]), new Geo.GeometryCollection([
                new Geo.LineString([[2,1],[1,2]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeFalsy();
        });
    });
    describe("MultiPoint in Geometry", function () {
        it("Should be in Point as edge case", function () {
           expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,2]]),new Geo.Point([1,2]))).toBeTruthy();
        });
        it("Should not be in Point", function () {
           expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,2],[2,1]]),new Geo.Point([1,2]))).toBeFalsy();
        });
        it("Should be is in bounds", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,2],[1,1]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[0,0],[2,2]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
        });
        it("Should not be in bounds", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[-1,0],[2,2]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
        });
        it("Should be in MultiPoint", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiPoint([[1,1],[1,2]]))).toBeTruthy();
        });
        it("Should not be in MultiPoint", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiPoint([[2,1],[1,2]]))).toBeFalsy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiPoint([1,1]))).toBeFalsy();
        });
        it("Should be in LineString", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.LineString([[1,1],[1,2]]))).toBeTruthy();
        });
        it("Should not be in LineString", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.LineString([[2,1],[1,2]]))).toBeFalsy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.LineString([1,1]))).toBeFalsy();
        });
        it("Should be in MultiLineString (first,middle,last)", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiLineString([[[2,2],[1,3]],[[1,2],[1,1]]]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiLineString([[[1,2],[1,3]],[[2,2],[1,1]]]))).toBeTruthy();
        });
        it("Should not be in MultiLineString", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiLineString([[[1,2],[1,3]],[[3,1],[1,5]]]))).toBeFalsy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiLineString([[1,1],[1,2]]))).toBeFalsy();
        });
        it("Should be in Polygon (vertex,path,inside)", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.Polygon([[[1,2],[3,1],[1,1],[1,5],[1,2]]]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[0,1],[1,1]]),new Geo.Polygon([[[0,0],[2,0],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[2,1],[1,1]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
        });
        it("Should not be in Polygon", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[2,1],[1,1]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should be in MultiPolygon (vertex,path,inside)", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[1,2],[3,1],[1,1],[1,5],[1,2]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[0,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[2,0],[0,2],[0,0]]],[[[0,0],[-2,0],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[0,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[0,-2],[0,0]]],[[[0,0],[2,0],[0,2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[2,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[2,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
        });
        it("Should not be in MultiPolygon", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[0,0],[1,-1]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("Should be in GeometryCollection[0]", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[1,2]]), new Geo.GeometryCollection([
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,1]]]),
                new Geo.LineString([[2,1],[1,2]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Should be in GeometryCollection[1]", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[0,-2]]), new Geo.GeometryCollection([
                new Geo.LineString([[2,1],[1,2]]),
                new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Should not be in GeometryCollection", function () {
            expect(Geo.MultiPoint.within(new Geo.MultiPoint([[1,1],[0,-2]]), new Geo.GeometryCollection([
                new Geo.LineString([[2,1],[1,2]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeFalsy();
        });
    });
    describe("LineString in Geometry", function () {
        it("Cannot be in Point or MultiPoint", function () {
           expect(Geo.LineString.within(new Geo.LineString([[1,2],[2,1]]),new Geo.Point([1,2]))).toBeFalsy();
           expect(Geo.LineString.within(new Geo.LineString([[1,2],[2,1]]),new Geo.MultiPoint([[1,2],[2,1]]))).toBeFalsy();
        });
        it("Should be in bounds", function () {
            expect(Geo.LineString.within(new Geo.LineString([[1,2],[1,1]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.LineString.within(new Geo.LineString([[0,0],[2,2]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
        });
        it("Should not be in bounds", function () {
            expect(Geo.LineString.within(new Geo.LineString([[-1,0],[2,2]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
        });
        it("Should be in LineString", function () {
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.LineString([[1,1],[1,2]]))).toBeTruthy();
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.LineString([[1,2],[1,1]]))).toBeTruthy();
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2],[1,1]]),new Geo.LineString([[1,2],[1,1]]))).toBeTruthy();
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.LineString([[2,1],[1,2],[1,1]]))).toBeTruthy();
        });
        it("Should not be in LineString", function () {
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.LineString([[1,2],[2,2],[1,1]]))).toBeFalsy();
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.LineString([1,1]))).toBeFalsy();
        });
        it("Should be in MultiLineString(first,second)", function () {
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.MultiLineString([[[2,2],[1,3]],[[1,2],[1,1]]]))).toBeTruthy();
        });
        it("Should not be in MultiLineString", function () {
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.MultiLineString([[[1,2],[1,3]],[[2,2],[1,1]]]))).toBeFalsy();
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.MultiLineString([[[1,2],[1,3]],[[3,1],[1,5]]]))).toBeFalsy();
            expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]),new Geo.MultiLineString([[1,1],[1,2]]))).toBeFalsy();
        });
        it("Should be in Polygon(vertex,inside)", function () {
            expect(Geo.LineString.within(new Geo.LineString([[3,1],[1,2]]),new Geo.Polygon([[[1,2],[3,1],[1,1],[1,5],[1,2]]]))).toBeTruthy();
            expect(Geo.LineString.within(new Geo.LineString([[2,1],[1,1]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
        });
        it("Should not be in Polygon", function () {
           expect(Geo.LineString.within(new Geo.LineString([[4,1],[1,1]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeFalsy();
           expect(Geo.LineString.within(new Geo.LineString([[2,1],[1,1]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should be in MultiPolygon (vertex, inside)", function () {
           expect(Geo.LineString.within(new Geo.LineString([[1,1],[3,1],[1,2]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
           expect(Geo.LineString.within(new Geo.LineString([[1,1],[3,1],[1,2]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[1,2],[3,1],[1,1],[1,5],[1,2]]]]))).toBeTruthy();
           expect(Geo.LineString.within(new Geo.LineString([[2,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
           expect(Geo.LineString.within(new Geo.LineString([[2,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
        });
        it("Should not be in MultiPolygon", function () {
           expect(Geo.LineString.within(new Geo.LineString([[0,0],[1,-1]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("Should be in GeometryCollection[0]", function () {
           expect(Geo.LineString.within(new Geo.LineString([[1,1],[1,2]]), new Geo.GeometryCollection([
               new Geo.MultiLineString([[[1,2],[1,1]],[[3,1],[1,1]]]),
               new Geo.LineString([[2,1],[1,2]]),
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
           ]))).toBeTruthy();
        });
        it("Should be in GeometryCollection[1]", function () {
           expect(Geo.LineString.within(new Geo.LineString([[1,1],[2,2]]), new Geo.GeometryCollection([
               new Geo.LineString([[2,1],[1,2]]),
               new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]),
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
           ]))).toBeTruthy();
        });
        it("Should not be in GeometryCollection", function () {
           expect(Geo.LineString.within(new Geo.LineString([[1,1],[0,-2]]), new Geo.GeometryCollection([
               new Geo.LineString([[2,1],[1,2]]),
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
           ]))).toBeFalsy();
        });
    });
    describe("MultiLineString in Geometry", function () {
        it("Cannot not be in Point or MultiPoint", function () {
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,2],[2,1]]]),new Geo.Point([1,2]))).toBeFalsy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,2],[2,1]]]),new Geo.MultiPoint([[1,2],[2,1]]))).toBeFalsy();
        });
        it("Should be in bounds", function () {
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,2],[1,1]],[[0,2],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
        });
        it("Should not be in bounds", function () {
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,2],[1,1]],[[0,3],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[0,3],[1,1],[2,2],[0,1]],[[1,2],[1,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[0,3],[1,1],[2,2],[0,1]],[[1,2],[1,1]]]),new Geo.BoundaryBox([0,0,-2,-2]))).toBeFalsy();
        });
        it("Should be in LineString", function () {
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,8],[3,1]],[[1,2],[1,1],[1,2],[3,1]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,8],[3,1]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[3,1],[2,8]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
        });
        it("Should not be in LineString", function () {
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[2,8]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeFalsy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,8],[1,1]],[[1,2],[1,1],[1,2],[3,1]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeFalsy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,8],[3,1]],[[1,2],[1,1],[3,1]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeFalsy();
        });
        it("Should be in MultiLineString", function () {
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]],[[2,1],[1,6]]]))).toBeTruthy();
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[3,1],[1,5]],[[1,1],[1,2]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[3,1],[1,5]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
        });
        it("Should not be in MultiLineString", function () {
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2],[3,1],[1,5]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeFalsy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[3,1],[1,5]],[[1,1],[1,3]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeFalsy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[3,1],[1,4]],[[1,1],[1,2]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeFalsy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,4]]]),new Geo.MultiLineString([[[1,1],[1,2]]]))).toBeFalsy();
        });
        it("Should be in Polygon (vertex,inside)", function () {
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,2]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
        });
        it("Should not be in Polygon (vertex,inside)", function () {
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,3]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeFalsy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,1],[1,1]],[[-2,-1],[-1,-1]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[-2,-1],[-1,-1]],[[2,1],[1,1]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should be in MultiPolygon (vertex,inside)", function () {
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[1,2],[3,1],[1,1],[1,5],[1,2]]]]))).toBeTruthy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,2]]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,2]]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
        });
        it("Should not be in MultiPolygon", function () {
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[-2,-1],[-1,-1]],[[2,1],[1,1]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[2,1],[1,1]],[[-2,-1],[-1,-1]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("Should be in GeometryCollection[0]", function () {
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2],[1,5],[4,2]],[[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
               new Geo.BoundaryBox([0,0,8,8]),
               new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
           ]))).toBeTruthy();
        });
        it("Should be in GeometryCollection[1]", function () {
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2],[1,5],[4,2]],[[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
               new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
               new Geo.BoundaryBox([0,0,8,8]),
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
           ]))).toBeTruthy();
        });
        it("Should not be in GeometryCollection", function () {
           expect(Geo.MultiLineString.within(new Geo.MultiLineString([[[1,1],[1,2],[1,5],[4,2]],[[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
               new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
           ]))).toBeFalsy();
        });
    });
    describe("Polygon in Geometry", function () {
        it("Cannot be in Point,MultiPoint,LineString or MultiLineString", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,2],[2,1]]]),new Geo.Point([1,2]))).toBeFalsy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,2],[2,1]]]),new Geo.MultiPoint([[1,2],[2,1]]))).toBeFalsy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[2,8],[3,1]],[[1,2],[1,1],[1,2],[3,1]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeFalsy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,1],[1,2]],[[3,1],[1,5]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeFalsy();
        });
        it("Should be in bounds", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
        });
        it("Should not be in bounds", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[0,3],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[0,3],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[0,3],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,-2,-2]))).toBeFalsy();
        });
        it("Should be in Polygon (vertex,inside)", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
        });
        it("Should not be in Polygon (vertex,inside)", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[2,1],[1,1],[0.5,2],[1,0.5],[1,3]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeFalsy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[2,1],[1,1],[-2,-1],[-1,-1]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[-2,-1],[-1,-1],[2,1],[1,1]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should be in MultiPolygon (vertex,inside)", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[-1,-1],[3,0],[5,5],[1,5],[-1,2]]]]))).toBeTruthy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
        });
        it("Should not be in MultiPolygon", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[-2,-1],[-1,-1],[2,1],[1,1]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
            expect(Geo.Polygon.within(new Geo.Polygon([[[2,1],[1,1],[-2,-1],[-1,-1]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("Should be in GeometryCollection[0]", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.Polygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Should be in GeometryCollection[1]", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.Polygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Should not be in GeometryCollection", function () {
            expect(Geo.Polygon.within(new Geo.Polygon([[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.Polygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeFalsy();
        });
    });
    describe("MultiPolygon in Geometry", function () {
        it("Cannot be in Point,MultiPoint,LineString or MultiLineString", function () {
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,2],[2,1]]]]),new Geo.Point([1,2]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,2],[2,1]]]]),new Geo.MultiPoint([[1,2],[2,1]]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[2,8],[3,1]]],[[[1,2],[1,1],[1,2],[3,1]]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,1],[1,2]]],[[[3,1],[1,5]]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeFalsy();
        });
        it("Should be in bounds", function () {
           expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]],[[[1,1],[1,2],[2,2],[1,1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
           expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,1],[1,2],[2,2],[1,1]]],[[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
        });
        it("Should not be in bounds", function () {
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[0,3],[1,1],[2,2],[0,1]]],[[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]],[[[0,3],[1,1],[2,2],[0,1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[0,3],[1,1],[2,2],[0,1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[0,3],[1,1],[2,2],[0,1]]]]),new Geo.BoundaryBox([0,0,-2,-2]))).toBeFalsy();
        });
        it("Should be in Polygon (vertex, inside)", function () {
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[1,2],[2,2],[1,3]]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
        });
        it("Should not be in Polygon", function () {
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[2,1],[1,1],[-2,-1],[-1,-1]]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[2,1],[1,1],[0.5,2],[1,0.5],[1,3]]],[[[1,1],[0,1],[0,0],[0.3,0.6]]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[2,1],[1,1],[-2,-1],[-1,-1]]],[[[-1,-1],[0,-1],[0,0],[-0.3,-0.6]]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[-2,-1],[-1,-1],[2,1],[1,1]]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should be in MultiPolygon (vertex, inside)", function () {
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[1,2],[2,2],[1,3]]]]), new Geo.MultiPolygon([[[[-1,-1],[3,0],[5,5],[1,5],[-1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[1,2],[2,2],[1,3]]]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[-1,-1],[3,0],[5,5],[1,5],[-1,2]]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
        });
        it("Should not be in MultiPolygon", function () {
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[1,-2],[2,2],[1,3]]]]), new Geo.MultiPolygon([[[[-1,-1],[3,0],[5,5],[1,5],[-1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[-2,-1],[-1,-1],[2,1],[1,1]]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[2,1],[1,1],[-2,-1],[-1,-1]]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("Should be in GeometryCollection[0]", function () {
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]],[[[1,2],[2,2],[1,3]]]]), new Geo.GeometryCollection([
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.MultiPolygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Should be in GeometryCollection[1]", function () {
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[1,2],[2,2],[1,3]]],[[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.MultiPolygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Should not be in GeometryCollection", function () {
            expect(Geo.MultiPolygon.within(new Geo.MultiPolygon([[[[-1,-2],[-2,-2],[-2,-1]]],[[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.MultiPolygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeFalsy();
        });
    });
    describe("GeometryCollection in Geometry", function () {
        // there are a lot of geometry specific tests, so only simple tests are needed
        it("Should be in MultiPoint", function () {
            expect(Geo.GeometryCollection.within(
                new Geo.GeometryCollection([
                    new Geo.Point([1,1]),
                    new Geo.Point([2,2]),
                    new Geo.MultiPoint([[2,2],[3,3]])
                ]),
                new Geo.MultiPoint([[1,1],[2,2],[3,3]])
            )).toBeTruthy();
        });
        it("Should be in MultiPoint", function () {
            expect(Geo.GeometryCollection.within(
                new Geo.GeometryCollection([
                    new Geo.Point([1,1]),
                    new Geo.Point([2,2]),
                    new Geo.MultiPoint([[2,2],[3,3]])
                ]),
                new Geo.MultiPoint([[1,1],[2,2],[3,3],[4,4]])
            )).toBeTruthy();
        });
        it("Should not be in MultiPoint", function () {
            expect(Geo.GeometryCollection.within(
                new Geo.GeometryCollection([
                    new Geo.Point([1,1]),
                    new Geo.Point([2,2]),
                    new Geo.MultiPoint([[2,2],[3,3]])
                ]),
                new Geo.MultiPoint([[1,1],[2,2],[4,4]])
            )).toBeFalsy();
        });
    });
    // GEO INTERSECT
    describe("Point intersects Geometry", function () {
        it("Should be in Point -> its an alias function", function () {
            expect(Geo.Point.within(new Geo.Point([1,1]),new Geo.Point([1,1]))).toBeTruthy();
        });
    });
    describe("MultiPoint intersects Geometry", function () {
        it("Should intersect Point", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[2,2],[4,-2],[1,2]]),new Geo.Point([1,2]))).toBeTruthy();
        });
        it("Should not intersect Point", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[2,2],[2,1]]),new Geo.Point([1,2]))).toBeFalsy();
        });
        it("Should intersect bounds", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,2],[3,1]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[3,4],[2,2]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,0],[2,2]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
        });
        it("Should not intersect bounds", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[-1,0],[3,2]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
        });
        it("Should intersect MultiPoint", function () {
           expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiPoint([[1,1],[1,2]]))).toBeTruthy();
           expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[8,1],[1,2]]),new Geo.MultiPoint([[1,1],[1,2]]))).toBeTruthy();
           expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,5]]),new Geo.MultiPoint([[1,1],[1,2]]))).toBeTruthy();
        });
        it("Should not intersect MultiPoint", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[4,4],[3,3]]),new Geo.MultiPoint([[2,1],[1,2]]))).toBeFalsy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiPoint([1,1]))).toBeFalsy();
        });
        it("Should intersect LineString", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,3]]),new Geo.LineString([[1,1],[1,2]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[3,1],[1,2]]),new Geo.LineString([[1,1],[1,2]]))).toBeTruthy();
        });
        it("Should not intersect LineString", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[2,2]]),new Geo.LineString([[2,1],[1,2]]))).toBeFalsy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.LineString([1,1]))).toBeFalsy();
        });
        it("Should intersect MultiLineSting (first,last,both)", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[2,2]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiLineString([[[2,2],[1,3]],[[1,2],[1,1]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[2,1],[1,2]]),new Geo.MultiLineString([[[2,2],[1,3]],[[1,2],[1,1]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiLineString([[[1,2],[1,3]],[[2,2],[1,1]]]))).toBeTruthy();
        });
        it("Should not intersect MultiLineSting", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[2,2]]),new Geo.MultiLineString([[[1,2],[1,3]],[[3,1],[1,5]]]))).toBeFalsy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,2]]),new Geo.MultiLineString([[1,1],[1,2]]))).toBeFalsy();
        });
        it("Should intersects Polygon (vertex, path)", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[2,1],[1,2]]),new Geo.Polygon([[[1,2],[3,1],[1,1],[1,5],[1,2]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[8,8]]),new Geo.Polygon([[[1,2],[3,1],[1,1],[1,5],[1,2]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[2,1],[1,1]]),new Geo.Polygon([[[0,0],[2,0],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[0,1],[2,1]]),new Geo.Polygon([[[0,0],[2,0],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[8,8],[1,1]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
        });
        it("Should not intersects Polygon", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[2,1],[1,1]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should intersects MultiPolygon (vertex, path, inside)", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[-1,2]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[-1,1],[1,2]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[1,2]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[1,2],[3,1],[1,1],[1,5],[1,2]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[0,1],[6,1]]), new Geo.MultiPolygon([[[[0,0],[2,0],[0,2],[0,0]]],[[[0,0],[-2,0],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[6,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[2,0],[0,2],[0,0]]],[[[0,0],[-2,0],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[0,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[0,-2],[0,0]]],[[[0,0],[2,0],[0,2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[2,1],[6,1]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[6,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[2,1],[1,8]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[5,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
        });
        it("Should not intersects MultiPolygon ", function () {
            expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[0,0],[1,-1]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("Should intersect GeometryCollection[0]", function () {
           expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[1,1],[5,2]]), new Geo.GeometryCollection([
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,1]]]),
               new Geo.LineString([[2,1],[1,2]]),
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
           ]))).toBeTruthy();
        });
        it("Should intersect GeometryCollection[1]", function () {
           expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[3,1],[0,-2]]), new Geo.GeometryCollection([
               new Geo.LineString([[2,1],[1,2]]),
               new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]),
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
           ]))).toBeTruthy();
        });
        it("Should not intersect GeometryCollection", function () {
           expect(Geo.MultiPoint.intersects(new Geo.MultiPoint([[-1,1],[0,-2]]), new Geo.GeometryCollection([
               new Geo.LineString([[2,1],[1,2]]),
               new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
           ]))).toBeFalsy();
        });
    });
    describe("LineString intersects Geometry", function () {
        it("Should intersects Point,MultiPoint", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[1,2],[2,1]]),new Geo.Point([1,2]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[1,2],[2,1]]),new Geo.MultiPoint([[1,2],[2,1]]))).toBeTruthy();
        });
        it("Should intersects bounds", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[1,2],[1,1]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[0,0],[-2,2]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
        });
        it("Should not intersects bounds", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[-1,0],[2,-2]]),new Geo.BoundaryBox([0,0,2,2]))).toBeFalsy();
        });
        it("Should intersects LineString", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[3,1],[1,3]]),new Geo.LineString([[1,1],[3,3]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[3,1],[1,3]]),new Geo.LineString([[1,3],[3,1]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[-2,-2],[-2,-4],[0,0],[3,1],[1,3]]),new Geo.LineString([[1,3],[3,1]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[1,1],[1,2]]),new Geo.LineString([[1,2],[2,2],[1,1]]))).toBeTruthy();
        });
        it("Should not intersects LineString", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[2,2],[-2,2],[-2,6]]),new Geo.LineString([[1,1],[1,-3],[6,-3],[6,6]]))).toBeFalsy();
            expect(Geo.LineString.intersects(new Geo.LineString([[1,1],[1,2]]),new Geo.LineString([1,1]))).toBeFalsy();
        });
        it("Should intersects MultiLineString (first,second)", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[0,2],[2,2]]),new Geo.MultiLineString([[[1,-1],[1,4]],[[3,1],[5,5]]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[0,2],[2,2]]),new Geo.MultiLineString([[[3,1],[5,5]],[[1,-1],[1,3]]]))).toBeTruthy();
        });
        it("Should not intersects MultiLineString", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[1,1],[1,2]]),new Geo.MultiLineString([[[3,1],[5,5]],[[-3,1],[-1,5]]]))).toBeFalsy();
            expect(Geo.LineString.intersects(new Geo.LineString([[1,1],[1,2]]),new Geo.MultiLineString([[1,2],[1,3]]))).toBeFalsy();
        });
        it("Should intersects Polygon on (vertex,inside,path)", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[3,1],[1,2]]),new Geo.Polygon([[[1,2],[3,1],[1,1],[1,5],[1,2]]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[2,1],[1,1]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[4,1],[1,1]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
        });
        it("Should not intersects Polygon", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[2,1],[1,1]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should intersect MultiPolygon on (vertex,inside,path)", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[1,1],[3,1],[1,2]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[1,1],[3,1],[1,2]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[1,2],[3,1],[1,1],[1,5],[1,2]]]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[2,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[2,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[2,-1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.LineString.intersects(new Geo.LineString([[4,1],[1,1]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
        });
        it("Should not intersect MultiPolygon", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[0,0],[1,-1]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("Should intersect GeometryCollection[0]", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[-1,1],[1,2]]), new Geo.GeometryCollection([
                new Geo.MultiLineString([[[1,2],[1,1]],[[3,1],[1,1]]]),
                new Geo.LineString([[2,1],[1,2]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Should intersect GeometryCollection[1]", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[10,10],[13,2],[1,1],[-2,2]]), new Geo.GeometryCollection([
                new Geo.LineString([[2,1],[1,2]]),
                new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Should not intersect GeometryCollection", function () {
            expect(Geo.LineString.intersects(new Geo.LineString([[1,1],[0,-2]]), new Geo.GeometryCollection([
                new Geo.LineString([[2,1],[1,2]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeFalsy();
        });
    });
    describe("MultiLineString intersects Geometry", function () {
        it("Cannot be in Point or MultiPoint", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,2],[2,1]]]),new Geo.Point([1,2]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,2],[2,1]]]),new Geo.MultiPoint([[1,2],[2,1]]))).toBeTruthy();
        });
        it("Should intersect bounds", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,2],[1,1]],[[0,2],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,2],[1,1]],[[0,3],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[0,3],[1,1],[2,2],[0,1]],[[1,2],[1,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
        });
        it("Should not intersect bounds", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[0,3],[1,1],[2,2],[1,2]],[[1,2],[1,1]]]),new Geo.BoundaryBox([0,0,-2,-2]))).toBeFalsy();
        });
        it("Should intersect LineString", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[2,8],[3,1]],[[1,2],[1,1],[1,2],[3,1]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[2,8],[3,1]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[3,1],[2,8]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[2,8]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[20,8],[15,10]],[[0,3],[1,3],[5,1],[1,1]]]),new Geo.LineString([[1,1],[1,2],[3,1],[2,8]]))).toBeTruthy();
        });
        it("Should not intersect LineString", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[2,8],[3,1]],[[1,2],[1,1],[3,1]]]),new Geo.LineString([[10,10],[10,20],[20,11],[12,28]]))).toBeFalsy();
        });
        it("Should intersect MultiLineString", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[0,1.5],[1.5,1.5]],[[13,11],[1,15]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[11,11],[11,12]],[[3,5],[1,1]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]],[[2,1],[1,6]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[3,1],[1,5]],[[1,1],[1,2]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[3,1],[1,5]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeTruthy();expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,4]]]),new Geo.MultiLineString([[[1,1],[1,2]]]))).toBeFalsy();
        });
        it("Should not intersect MultiLineString", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[13,1],[11,4]],[[11,11],[11,12]]]),new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]))).toBeFalsy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,4]]]),new Geo.MultiLineString([[[1,1],[1,2]]]))).toBeFalsy();
        });
        it("Should intersect Polygon", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,2]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,3]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[2,1],[1,1]],[[-2,-1],[-1,-1]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeTruthy();
        });
        it("Should not intersect Polygon", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[9,2],[3,3]],[[2,1],[1,1]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should intersect MultiPolygon", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2]],[[3,1],[1,5]]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[1,2],[3,1],[1,1],[1,5],[1,2]]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,2]]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,2]]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[-2,-1],[-1,-1]],[[1,1],[3,2]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[3,3]],[[-2,-1],[-1,-1]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
        });
        it("Should intersect MultiPolygon", function () {
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[-1,-1],[-3,-3]],[[-2,-1],[-1,-1]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("MultiLineString is in GeometryCollection[0]",function(){
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2],[1,5],[4,2]],[[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("MultiLineString is in GeometryCollection[1]",function(){
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2],[1,5],[4,2]],[[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.MultiLineString([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("MultiLineString intersects GeometryCollection[1]",function(){
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2],[1,5],[4,2]],[[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.MultiLineString([[[0,5],[3,0]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("MultiLineString not in GeometryCollection",function(){
            expect(Geo.MultiLineString.intersects(new Geo.MultiLineString([[[1,1],[1,2],[1,5],[4,2]],[[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.MultiLineString([[[0,-5],[-3,0]],[[-3,-1],[-1,-5]]])
            ]))).toBeFalsy();
        });
    });
    describe("Polygon intersects Geometry", function () {
        it("Should also work reverse with Point,MultiPoint, LineString and MultiLineString", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]),new Geo.Point([1,1]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[0,0],[2,0],[0,2],[0,0]]]),new Geo.MultiPoint([[0,1],[1,1]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]),new Geo.LineString([[4,1],[1,1]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]),new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,3]]]))).toBeTruthy();
        });
        it("Should intersect bounds", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[0,3],[1,1],[2,2],[0,1]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[1,-1],[2,-1],[2,5],[1,5]]]),new Geo.BoundaryBox([0,0,4,4]))).toBeTruthy();
        });
        it("Should not intersect bounds", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[1,3],[1,1],[2,2],[1,1]]]),new Geo.BoundaryBox([0,0,-2,-2]))).toBeFalsy();
        });
        it("Should intersect Polygon", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[2,1],[1,1],[0.5,2],[1,0.5],[1,3]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[2,1],[1,1],[-2,-1],[-1,-1]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeTruthy();
        });
        it("Should not intersect Polygon", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[2,1],[1,1],[2,1],[1,1]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should intersect MultiPolygon", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[-1,-1],[3,0],[5,5],[1,5],[-1,2]]]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[-2,-1],[-1,-1],[2,1],[1,1]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[2,1],[1,1],[-2,-1],[-1,-1]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
        });
        it("Should not intersect MultiPolygon", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[-1,-1],[-1,-2],[-2,-2],[-2,-1]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("Polygon is in GeometryCollection[0]", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.Polygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Polygon is in GeometryCollection[1]", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.Polygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("Polygon is not in GeometryCollection", function () {
            expect(Geo.Polygon.intersects(new Geo.Polygon([[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.Polygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeFalsy();
        });
    });
    describe("MultiPolygon intersects Geometry", function () {
        it("Should also work reverse with Point,MultiPoint, LineString and MultiLineString",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]),new Geo.Point([1,1]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[0,0],[2,0],[0,2],[0,0]]]]),new Geo.MultiPoint([[0,1],[1,1]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]),new Geo.LineString([[4,1],[1,1]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]),new Geo.MultiLineString([[[2,1],[1,1]],[[0.5,2],[1,0.5],[1,3]]]))).toBeTruthy();
        });
        it("Should intersect bounds",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]],[[[1,1],[1,2],[2,2],[1,1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,1],[1,2],[2,2],[1,1]]],[[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[-1,-3],[-1,-1],[-2,-2],[-1,-1]]],[[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,2],[1,1],[0,2],[1,1],[2,2],[0,1]]],[[[-1,-3],[-1,-1],[-2,-2],[-1,-1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[0,3],[1,1],[2,2],[0,1]]],[[[-1,-3],[-1,-1],[-2,-2],[-1,-1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[-1,-3],[-1,-1],[-2,-2],[-1,-1]]],[[[0,3],[1,1],[2,2],[0,1]]]]),new Geo.BoundaryBox([0,0,2,2]))).toBeTruthy();
        });
        it("Should not intersect bounds",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[0,3],[1,1],[2,2],[0,1]]]]),new Geo.BoundaryBox([0,0,-2,-2]))).toBeFalsy();
        });
        it("Should intersect Polygon",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[1,2],[2,2],[1,3]]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[2,1],[1,1],[-2,-1],[-1,-1]]]]),new Geo.Polygon([[[1,1],[1,2],[3,1],[1,5]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[2,1],[1,1],[0.5,2],[1,0.5],[1,3]]],[[[1,1],[0,1],[0,0],[0.3,0.6]]]]),new Geo.Polygon([[[0,0],[2,0],[2,2],[0,2],[0,0]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[2,1],[1,1],[-2,-1],[-1,-1]]],[[[-1,-1],[0,-1],[0,0],[-0.3,-0.6]]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeTruthy();
        });
        it("Should not intersect Polygon",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[2,1],[1,1],[2,1],[1,1]]]]),new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]))).toBeFalsy();
        });
        it("Should intersect MultiPolygon",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[1,2],[2,2],[1,3]]]]), new Geo.MultiPolygon([[[[-1,-1],[3,0],[5,5],[1,5],[-1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[1,2],[2,2],[1,3]]]]), new Geo.MultiPolygon([[[[10,20],[30,10],[10,10],[10,50],[10,20]]],[[[-1,-1],[3,0],[5,5],[1,5],[-1,2]]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]]), new Geo.MultiPolygon([[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[2,1],[1,1],[0.5,2],[1,0.5],[1,2]]]]), new Geo.MultiPolygon([[[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]],[[[0,0],[2,0],[2,2],[0,2],[0,0]]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,1],[1,2],[3,1],[1,5]]],[[[1,-2],[2,2],[1,3]]]]), new Geo.MultiPolygon([[[[-1,-1],[3,0],[5,5],[1,5],[-1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[-2,-1],[-1,-1],[2,1],[1,1]]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeTruthy();
        });
        it("Should not intersect MultiPolygon",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[-1,-1],[-1,-2],[-2,-2],[-2,-1]]]]), new Geo.MultiPolygon([[[[1,2],[3,1],[1,1],[1,5],[1,2]]],[[[10,20],[30,10],[10,10],[10,50],[10,20]]]]))).toBeFalsy();
        });
        it("MultiPolygon is in GeometryCollection[0]",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]],[[[1,2],[2,2],[1,3]]]]), new Geo.GeometryCollection([
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.MultiPolygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("MultiPolygon is in GeometryCollection[1]",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[1,2],[2,2],[1,3]]],[[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.BoundaryBox([0,0,8,8]),
                new Geo.MultiPolygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("MultiPolygon intersects GeometryCollection",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[-1,-2],[-2,-2],[-2,-1]]],[[[1,1],[1,2],[1,5],[4,2],[2,1],[3,1],[1,5]]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.MultiPolygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeTruthy();
        });
        it("MultiPolygon does not intersect GeometryCollection",function(){
            expect(Geo.MultiPolygon.intersects(new Geo.MultiPolygon([[[[-10,-20],[-20,-20],[-20,-10]]],[[[10,11],[12,24],[11,25],[42,12]]]]), new Geo.GeometryCollection([
                new Geo.Polygon([[[0,0],[-2,0],[-2,-2],[0,-2],[0,0]]]),
                new Geo.MultiPolygon([[[1,2],[1,2]],[[3,1],[1,5]]])
            ]))).toBeFalsy();
        });
    });
    describe("GeometryCollection intersects Geometry", function () {
        it("Collection in MultiPoint",function(){
            expect(Geo.GeometryCollection.intersects(
                new Geo.GeometryCollection([
                    new Geo.Point([1,1]),
                    new Geo.Point([2,2])
                ]),
                new Geo.LineString([[3,1],[2,2],[1,3]])
            )).toBeTruthy();
        });
        it("Collection in MultiPoint",function(){
            expect(Geo.GeometryCollection.intersects(
                new Geo.GeometryCollection([
                    new Geo.Point([2,3]),
                    new Geo.MultiPoint([[2,2],[3,3],[9,2]])
                ]),
                new Geo.LineString([[0,0],[3,3],[2,4]])
            )).toBeTruthy();
        });
        it("Collection not in MultiPoint",function(){
            expect(Geo.GeometryCollection.intersects(
                new Geo.GeometryCollection([
                    new Geo.Point([1,1]),
                    new Geo.Point([2,2]),
                    new Geo.MultiPoint([[2,2],[3,3]])
                ]),
                new Geo.MultiPoint([[10,10],[20,20],[40,40]])
            )).toBeFalsy();
        });
    });
});