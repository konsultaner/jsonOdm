"use strict";

/**
 * The object to provide geographical data
 * @constructor
 */
jsonOdm.Geo = function () {

};

/**
 * The method checks whether a point is inside a polygon or not. The polygon will be auto closed
 * @param {Array} point A point representation i.e. [1,2]
 * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.pointWithinPolygon = function (point,polygon) {
    if(!(jsonOdm.util.isArray(point) && jsonOdm.util.isArray(polygon) && polygon.length > 2)) return false;

    var isClosed = polygon[0][0] == polygon[polygon.length-1][0] && polygon[0][1] == polygon[polygon.length-1][1];
    var intersection = 0;

    // close the polygon
    if(!isClosed) polygon = polygon.concat([polygon[0]]);

    // do not enter the last point because the calculation also reads the i+1th index
    for(var i = 0; i < polygon.length - 1; i++){
        if(
            polygon[i][0] < point[0] && polygon[i+1][0] < point[0] || // the vector is only in section 1 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] < point[1] && polygon[i+1][1] < point[1] || // the vector is only in section 1 or 2 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] > point[1] && polygon[i+1][1] > point[1]    // the vector is only in section 3 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
        ){
            continue;
        }
        var n1 = [polygon[i][0]-point[0],polygon[i][1]-point[1]],
            n2 = [polygon[i+1][0]-point[0],polygon[i+1][1]-point[1]];

        if((n1[0]-n2[0])*(-n1[1]/n1[1]-n2[1])+n1[0] >= 0) intersection++; // the vector intersects the positive x-axis of the coordinate system normalized to the point
    }
    return intersection%2 == 1; // the normalized x-axis needs to be intersected by a odd amount of intersections
};