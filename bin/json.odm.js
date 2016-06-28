"use strict";

/**
 * The main class holding all sub classes and the data source
 * @author Richard Burkhardt - Konsultaner
 *
 * @constructor
 * @example
 * var odm = new jsonOdm();
 * odm.addSource('people',{
 *    "Person" : [
 *        {"id":1,"name":"Richi",jobId:1},
 *        {"id":2,"name":"Dave",jobId:2},
 *        {"id":3,"name":"Tom",jobId:3},
 *        {"id":4,"name":"Lisa",jobId:4},
 *        {"id":5,"name":"Hanni",jobId:3},
 *        {"id":6,"name":"Selma",jobId:3},
 *        {"id":7,"name":"Ralf",jobId:1}
 *    ],
 *    "Jobs" : [
 *        {"id":1,"name":"plumber"},
 *        {"id":2,"name":"programmer"},
 *        {"id":3,"name":"chef"},
 *        {"id":4,"name":"hairdresser"}
 *    ]
 * });
 *
 * var people = new jsonOdm.Collection('Person');
 * people.$hasOne("jobId","id","Jobs","job");
 *
 * var q = people.query();
 * // get all hairdresser
 * var hairdresser = q.$or(
 *    q.$branch("jobId").$eq(4)
 * ).$all();
 *
 * // get all but hairdressers
 * var hairdresser = q.$or(
 *    q.$branch("jobId").$ne(4)
 * ).$all();
 *
 */
function JsonOdm() {
    var self = this;
    this.sources = {};
    this.selectedSource = {};
    /**
     * Add a data source to the odm that is selectable via the selectSource method
     * @param {*} sourceId There is an override check
     * @param {object} source An object with collection arrays
     * @param {boolean} selectSource select the source
     */
    this.addSource = function (sourceId, source, selectSource) {
        if (typeof source == "object") {
            if (typeof self.sources[sourceId] === "undefined") {
                self.sources[sourceId] = source;
            }
            if (selectSource) {
                self.selectedSource = source;
            }
        }
    };
    /**
     * Select a source by its id this will effect all collections
     * @param {*} sourceId
     */
    this.selectSource = function (sourceId) {
        if (typeof self.sources[sourceId] !== "undefined") {
            self.selectedSource = self.sources[sourceId];
        }
    };
}

var root = typeof window !== "undefined" ? window : global;
var jsonOdm = new JsonOdm();
if (!root.jsonOdm) {
    root.jsonOdm = jsonOdm;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = jsonOdm;
}

"use strict";

// for code climate recognition
if (typeof jsonOdm === "undefined") {
    var jsonOdm = new JsonOdm();
}

/**
 * The Utility Class that provides some useful methods used throughout the ODM
 * @constructor
 */
jsonOdm.Util = function () {
    // nothing yet
};


/** Checks the input parameter and returns true if it is an array
 *
 * @param {*} arrayObject
 * @return {boolean}
 */
jsonOdm.Util.prototype.isArray = function (arrayObject) {
    if (!Array.isArray) {
        return Object.prototype.toString.call(arrayObject) === "[object Array]";
    }
    return Array.isArray(arrayObject);
};

/**
 * Checks the type of an object. valid type values are:
 * number, string, undefined, object, array and RegExp, ArrayBuffer, null, boolean plus all other [object *] types
 * @param {*} object The object to test against a type
 * @param {string|string[]} type All possible types that will result in a true
 * @return {boolean}
 */
jsonOdm.Util.prototype.is = function (object, type) {
    type = (typeof type === "string") ? [type] : type;
    var objectType = Object.prototype.toString.call(object);
    objectType = objectType.substring(8, objectType.length - 1).toLowerCase();
    for (var i = 0; i < type.length; i++) {
        var lowerType = type[i].toLowerCase();
        if ("array" === lowerType && this.isArray(object)) {
            return true;
        }
        // all object types, i.e. "[object ArrayBuffer]"
        if (lowerType === objectType) {
            return true;
        }
        // number string object
        if (typeof object === lowerType) {
            return true;
        }
    }
    return false;
};

/** Polyfill for Object.keys
 * @method objectKeysPolyfill
 * @memberof jsonOdm.Util.prototype
 * @param {Object} object The objects to get the keys from
 * @return {Array} An array of keys
 */
jsonOdm.Util.prototype.objectKeysPolyfill = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
        if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
            throw new TypeError("Object.keys called on non-object");
        }

        var result = [], prop, i;

        for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
                result.push(prop);
            }
        }

        if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
                if (hasOwnProperty.call(obj, dontEnums[i])) {
                    result.push(dontEnums[i]);
                }
            }
        }
        return result;
    };
}());

/** Get only the keys of an object
 * @method objectKeys
 * @memberof jsonOdm.Util.prototype
 * @param {Object} object The objects to get the keys from
 * @return {Array} An array of keys
 */
jsonOdm.Util.prototype.objectKeys = Object.keys || jsonOdm.Util.prototype.objectKeysPolyfill;

/** Query an object with a function
 *
 * @param {Object|Array} object
 * @param {...String} path
 * @return {*}
 */
jsonOdm.Util.prototype.branch = function (object, path) {
    function goDown() {
        if (arguments && arguments.length && this) {
            var subCollection = this[arguments[0]];
            if (!subCollection) return subCollection;
            return goDown.apply(subCollection, Array.prototype.slice.call(arguments, 1));
        }
        return this
    }

    return goDown.apply(object, path);
};

/**
 * Projects an element to a projectionDefinition
 * @param {object} projection The projection definition object
 * @param {object} element The element that is projected from
 * @param {object} [parentElement] for internal recursion purpose
 * @return {object} The projected element
 * @example
 * jsonOdm.util.projectElement({
 *     key1:'value1',
 *     key2:'value2'
 * },{
 *     key1:1,
 *     key12:function(element){return element.key1 + element.key2}
 *     // only field modifying queries are allowed
 *     key2:collection.$query.$branch("key2").$substr(0,3)
 * })
 * // will return {key1:'value1',key12:'value1value2',key2:'val'}
 */
jsonOdm.Util.prototype.projectElement = function (projection, element, parentElement) {
    var projectionResult = {};
    for (var key in projection) {
        if (!projection.hasOwnProperty(key)) {
            continue;
        }
        if (projection[key] == 1) {
            projectionResult[key] = element[key]; // might be undefined or raises an error
        } else if (typeof projection[key] === "function") {
            projectionResult[key] = projection[key](parentElement || element);
        } else if (projection[key] instanceof jsonOdm.Query) {
            projectionResult[key] = projection[key].$$commandQueue[projection[key].$$commandQueue.length - 1](element);
            if (projection[key].$$accumulation !== false) projectionResult[key] = projection[key].$$accumulation;
        } else if (typeof projection[key] === "object") {
            projectionResult[key] = this.projectElement(projection[key], element[key], parentElement || element);
        }
    }
    return projectionResult;
};

jsonOdm.util = new jsonOdm.Util();
"use strict";

// for code climate recognition
if (typeof jsonOdm === "undefined") {
    var jsonOdm = new JsonOdm();
}

/**
 * The object to provide geographical data and methods. <br>
 * <strong style='color:#ff0000'>Warning:</strong> The coordinate reference system is <a href="http://spatialreference.org/ref/epsg/4326/" target="_blank">WGS 84</a>
 * witch uses the coordinate order [<strong>longitude</strong>,<strong>latitude</strong>]!<br>
 * Changing the coordinate reference system (CRS) is not supported yet.
 * @module jsonOdm.Geo
 * @constructor
 */
jsonOdm.Geo = function () {
};

/**
 * Takes an array and puts it into a GeoJSON geometry definition. If it geometry already is a valid GeoJSON it will only be returned
 * @param {Array|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry
 * @return {boolean|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection}
 */
jsonOdm.Geo.detectAsGeometry = function (geometry) {
    if (!geometry.type) {
        if (jsonOdm.util.isArray(geometry) && geometry.length === 2 && !jsonOdm.util.isArray(geometry[0])) {
            geometry = new jsonOdm.Geo.Point(geometry);
        } else if (jsonOdm.util.isArray(geometry) && geometry.length === 4 && !jsonOdm.util.isArray(geometry[0])) {
            geometry = new jsonOdm.Geo.BoundaryBox(geometry);
        } else if (jsonOdm.util.isArray(geometry) && geometry.length >= 1 && jsonOdm.util.isArray(geometry[0]) && geometry[0].length === 2 && !jsonOdm.util.isArray(geometry[0][0])) {
            geometry = new jsonOdm.Geo.LineString(geometry);
        } else if (jsonOdm.util.isArray(geometry) && geometry.length >= 1 &&
            jsonOdm.util.isArray(geometry[0]) && geometry[0].length >= 1 &&
            jsonOdm.util.isArray(geometry[0][0]) && geometry[0][0].length === 2 && !jsonOdm.util.isArray(geometry[0][0][0])) {
            geometry = new jsonOdm.Geo.Polygon(geometry);
        } else if (jsonOdm.util.isArray(geometry) && geometry.length >= 1 &&
            jsonOdm.util.isArray(geometry[0]) && geometry[0].length >= 1 &&
            jsonOdm.util.isArray(geometry[0][0]) && geometry[0][0].length >= 1 &&
            jsonOdm.util.isArray(geometry[0][0][0]) && geometry[0][0][0].length === 2 && !jsonOdm.util.isArray(geometry[0][0][0][0])) {
            geometry = new jsonOdm.Geo.MultiPolygon(geometry);
        } else {
            return false;
        }
    }
    return geometry;
};

/**
 * The GeoJSON FeatureCollection object
 * @param {jsonOdm.Geo.Feature[]|Array} features
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @constructor
 */
jsonOdm.Geo.FeatureCollection = function (features, boundaryBox) {
    this.type = "FeatureCollection";
    this.features = features || [];
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * A GeoJSON feature object
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @param {*} [properties] Additional properties that belong to this feature
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @param {*} [id] A unique identifier
 * @constructor
 */
jsonOdm.Geo.Feature = function (geometry, properties, boundaryBox, id) {
    this.geometry = geometry || {};
    if (properties) {
        this.properties = properties;
    }
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
    if (id) {
        this.id = id;
    }
};

/**
 * A GeoJSON BoundaryBox object
 * @param {Array} boundaryBox An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var boundaryBox = new jsonOdm.Geo.BoundaryBox([-180.00,-90.00,180.00,90.00]);
 * @constructor
 */
jsonOdm.Geo.BoundaryBox = function (boundaryBox) {
    var self = Object.create(Array.prototype);
    // calls the constructor of Array
    self = (Array.apply(self) || self);
    if (jsonOdm.util.isArray(boundaryBox)) {
        self[0] = boundaryBox[0];
        self[1] = boundaryBox[1];
        self[2] = boundaryBox[2];
        self[3] = boundaryBox[3];
    } else {
        self[0] = 0;
        self[1] = 0;
        self[2] = 0;
        self[3] = 0;
    }
    return self;
};

/**
 * Checks whether a BoundaryBox is inside of another geometry
 * @param {jsonOdm.Geo.BoundaryBox} bounds
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.BoundaryBox.within = function (bounds, geometry) {
    if (!jsonOdm.util.isArray(bounds) || bounds.length !== 4) {
        return false;
    }
    // a boundary box is equal to a polygonal box
    return jsonOdm.Geo.Polygon.within(new jsonOdm.Geo.Polygon([[[bounds[0], bounds[1]], [bounds[2], bounds[1]], [bounds[2], bounds[3]], [bounds[0], bounds[3]], [bounds[0], bounds[1]]]]), geometry);
};

/**
 * A GeoJSON Point object
 * @param {Array} position A 2-dimensional array with the first entry being the longitude and the second one being the latitude, i.e. [51,32]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var point = new jsonOdm.Geo.Point([51.5,32]);
 * @constructor
 */
jsonOdm.Geo.Point = function (position, boundaryBox) {
    this.type = "Point";
    this.coordinates = position;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a Point is inside of another geometry
 * @param {jsonOdm.Geo.Point} point
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.Point.within = function (point, geometry) {
    var i, j;
    if (!point.coordinates) {
        return false;
    }
    if (geometry.type === "Point") {
        return geometry.coordinates[0] === point.coordinates[0] && geometry.coordinates[1] === point.coordinates[1];
    }
    if (geometry.type === "MultiPoint" || geometry.type === "LineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            if (geometry.coordinates[i][0] === point.coordinates[0] && geometry.coordinates[i][1] === point.coordinates[1]) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiLineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; geometry.coordinates[i] && j < geometry.coordinates[i].length; j++) {
                if (geometry.coordinates[i][j][0] === point.coordinates[0] && geometry.coordinates[i][j][1] === point.coordinates[1]) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        // we assume that polygon wholes do not intersect the outer polygon
        return jsonOdm.Geo.pointWithinPolygon(point.coordinates, geometry.coordinates ? geometry.coordinates[0] : null);
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            // we assume that polygon wholes do not intersect the outer polygon
            if (jsonOdm.Geo.pointWithinPolygon(point.coordinates, geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.Point.within(point, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // might be a boundary box
    return jsonOdm.Geo.pointWithinBounds(point.coordinates, geometry);
};

/**
 * Checks whether a Point intersects a geometry witch is equal to the Point being inside a geometry. This is an alias of jsonOdm.Geo.Point.within
 * @param {jsonOdm.Geo.Point} point
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 * @type function
 * @method intersects
 * @memberof jsonOdm.Geo.Point
 */
jsonOdm.Geo.Point.intersects = jsonOdm.Geo.Point.within;

/**
 * A GeoJSON MultiPoint object
 * @param {Array} positions An array of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude, i.e. [[51,32],[51.4,21]]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var multiPoint = new jsonOdm.Geo.MultiPoint([
 *    [51.5,32],[51.6,21]
 * ]);
 * @constructor
 */
jsonOdm.Geo.MultiPoint = function (positions, boundaryBox) {
    this.type = "MultiPoint";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a MultiPoint is inside of another geometry
 * @param {jsonOdm.Geo.MultiPoint} multiPoint
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiPoint.within = function (multiPoint, geometry) {
    var i, j, k, found;
    if (!multiPoint.coordinates || !jsonOdm.util.isArray(multiPoint.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return multiPoint.coordinates.length === 1 && multiPoint.coordinates[0][0] === geometry.coordinates[0] && multiPoint.coordinates[0][1] === geometry.coordinates[1];
    }
    if (geometry.type === "MultiPoint") {
        for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (geometry.coordinates[i][0] === multiPoint.coordinates[j][0] && geometry.coordinates[i][1] === multiPoint.coordinates[j][1]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "LineString") {
        for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
            if (!jsonOdm.Geo.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates)) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "MultiLineString") {
        for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (jsonOdm.Geo.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates[i])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; multiPoint.coordinates && i < multiPoint.coordinates.length; i++) {
            // we assume that polygon wholes do not intersect the outer polygon
            if (!jsonOdm.Geo.pointWithinPolygon(multiPoint.coordinates[i], geometry.coordinates ? geometry.coordinates[0] : null)) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "MultiPolygon") {
        for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                // we assume that polygon wholes do not intersect the outer polygon
                if (jsonOdm.Geo.pointWithinPolygon(multiPoint.coordinates[j], geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiPoint.within(multiPoint, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiPoint.coordinates.length; i++) {
        if (!jsonOdm.Geo.pointWithinBounds(multiPoint.coordinates[i], geometry)) {
            return false;
        }
    }
    return true;
};

/**
 * Checks whether a MultiPoint intersects another geometry
 * @param {jsonOdm.Geo.MultiPoint} multiPoint
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiPoint.intersects = function (multiPoint, geometry) {
    var i, j, k;
    if (!multiPoint.coordinates || !jsonOdm.util.isArray(multiPoint.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return jsonOdm.Geo.Point.intersects(geometry, multiPoint);
    }
    if (geometry.type === "MultiPoint") {
        for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (geometry.coordinates[i][0] === multiPoint.coordinates[j][0] && geometry.coordinates[i][1] === multiPoint.coordinates[j][1]) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "LineString") {
        for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
            if (jsonOdm.Geo.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates)) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiLineString") {
        for (k = 0; multiPoint.coordinates && k < multiPoint.coordinates.length; k++) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (jsonOdm.Geo.pointWithinLineString(multiPoint.coordinates[k], geometry.coordinates[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; multiPoint.coordinates && i < multiPoint.coordinates.length; i++) {
            if (jsonOdm.Geo.pointWithinPolygon(multiPoint.coordinates[i], geometry.coordinates ? geometry.coordinates[0] : null)) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiPolygon") {
        for (j = 0; multiPoint.coordinates && j < multiPoint.coordinates.length; j++) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                // we assume that polygon wholes do not intersect the outer polygon
                if (jsonOdm.Geo.pointWithinPolygon(multiPoint.coordinates[j], geometry.coordinates[i] ? geometry.coordinates[i][0] : null)) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiPoint.intersects(multiPoint, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiPoint.coordinates.length; i++) {
        if (jsonOdm.Geo.pointWithinBounds(multiPoint.coordinates[i], geometry)) {
            return true;
        }
    }
    return false;
};

/**
 * A GeoJSON LineString object
 * @param {Array} positions An at least 2-dimensional array of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude, i.e. [[51,32],[51.4,21]]
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var lineString = new jsonOdm.Geo.LineString([
 *    [51.5,32],[51.6,21]
 * ]);
 * @constructor
 */
jsonOdm.Geo.LineString = function (positions, boundaryBox) {
    this.type = "LineString";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a LineString is inside of another geometry
 * @param {jsonOdm.Geo.LineString} lineString
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.LineString.within = function (lineString, geometry) {
    var i, j;
    if (!lineString.coordinates || !jsonOdm.util.isArray(lineString.coordinates)) {
        return false;
    }
    if (geometry.type === "Point" || geometry.type === "MultiPoint") {
        return false;
    }

    if (geometry.type === "LineString") {
        return jsonOdm.Geo.lineStringWithinLineString(lineString.coordinates, geometry.coordinates);
    }
    if (geometry.type === "MultiLineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            if (jsonOdm.Geo.lineStringWithinLineString(lineString.coordinates, geometry.coordinates[i])) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; lineString.coordinates && i < lineString.coordinates.length - 1; i++) {
            if (!jsonOdm.Geo.edgeWithinPolygon([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry.coordinates[0])) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; lineString.coordinates && j < lineString.coordinates.length - 1; j++) {
                if (jsonOdm.Geo.edgeWithinPolygon([lineString.coordinates[j], lineString.coordinates[j + 1]], geometry.coordinates[i][0]) && j + 1 === lineString.coordinates.length - 1) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.LineString.within(lineString, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < lineString.coordinates.length; i++) {
        if (!jsonOdm.Geo.pointWithinBounds(lineString.coordinates[i], geometry)) {
            return false;
        }
    }
    return true;
};


/**
 * Checks whether a LineString intersects another geometry
 * @param {jsonOdm.Geo.LineString} lineString
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.LineString.intersects = function (lineString, geometry) {
    var i, j;
    if (!lineString.coordinates || !jsonOdm.util.isArray(lineString.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return jsonOdm.Geo.Point.intersects(geometry, lineString);
    }
    if (geometry.type === "MultiPoint") {
        return jsonOdm.Geo.MultiPoint.intersects(geometry, lineString);
    }

    if (geometry.type === "LineString") {
        for (i = 0; i < lineString.coordinates.length - 1; i++) {
            if (jsonOdm.Geo.edgeIntersectsLineString([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry.coordinates)) {
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiLineString") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; j < lineString.coordinates.length - 1; j++) {
                if (jsonOdm.Geo.edgeIntersectsLineString([lineString.coordinates[j], lineString.coordinates[j + 1]], geometry.coordinates[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; lineString.coordinates && i < lineString.coordinates.length - 1; i++) {
            if (jsonOdm.Geo.edgeIntersectsPolygon([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry.coordinates[0])){
                return true;
            }
        }
        return false;
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
            for (j = 0; lineString.coordinates && j < lineString.coordinates.length - 1; j++) {
                if (jsonOdm.Geo.edgeIntersectsPolygon([lineString.coordinates[j], lineString.coordinates[j + 1]], geometry.coordinates[i][0])) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.LineString.intersects(lineString, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; lineString.coordinates && i < lineString.coordinates.length - 1; i++) {
        if (jsonOdm.Geo.edgeIntersectsBounds([lineString.coordinates[i], lineString.coordinates[i + 1]], geometry)) {
            return true;
        }
    }
    return false;
};

/**
 * A GeoJSON MultiLineString object
 * @param {Array} positions An array of arrays with at least 2-dimensional arrays of 2-dimensional arrays with the first entry being the longitude and the second one being the latitude.
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var multiLineString = new jsonOdm.Geo.MultiLineString([
 *    [[51.2,32],[51.4,21]],
 *    [[51.5,32],[51.6,21]]
 * ]);
 * @constructor
 */
jsonOdm.Geo.MultiLineString = function (positions, boundaryBox) {
    this.type = "MultiLineString";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a MultiLineString is inside of another geometry
 * @param {jsonOdm.Geo.MultiLineString} multiLineString
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiLineString.within = function (multiLineString, geometry) {
    var i, j, k, found;
    if (!multiLineString.coordinates || !jsonOdm.util.isArray(multiLineString.coordinates)) {
        return false;
    }
    if (geometry.type === "Point" || geometry.type === "MultiPoint") {
        return false;
    }

    if (geometry.type === "LineString") {
        for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
            if (!jsonOdm.Geo.lineStringWithinLineString(multiLineString.coordinates[i], geometry.coordinates)) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "MultiLineString") {
        for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                if (jsonOdm.Geo.lineStringWithinLineString(multiLineString.coordinates[j], geometry.coordinates[i])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
            for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates[i].length - 1; j++) {
                if (!jsonOdm.Geo.edgeWithinPolygon([multiLineString.coordinates[i][j], multiLineString.coordinates[i][j + 1]], geometry.coordinates[0])) {
                    return false;
                }
            }
        }
        return true;
    }
    if (geometry.type === "MultiPolygon") {
        for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
            found = false;
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (k = 0; multiLineString.coordinates[j] && k < multiLineString.coordinates[j].length - 1; k++) {
                    if (jsonOdm.Geo.edgeWithinPolygon([multiLineString.coordinates[j][k], multiLineString.coordinates[j][k + 1]], geometry.coordinates[i][0]) && k + 1 === multiLineString.coordinates[j].length - 1) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiLineString.within(multiLineString, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiLineString.coordinates.length; i++) {
        for (j = 0; j < multiLineString.coordinates[i].length; j++) {
            if (!jsonOdm.Geo.pointWithinBounds(multiLineString.coordinates[i][j], geometry)) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Checks whether a MultiLineString intersects another geometry
 * @param {jsonOdm.Geo.MultiLineString} multiLineString
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiLineString.intersects = function (multiLineString, geometry) {
    var i, j, k;
    if (!multiLineString.coordinates || !jsonOdm.util.isArray(multiLineString.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return jsonOdm.Geo.Point.intersects(geometry, multiLineString);
    }
    if (geometry.type === "MultiPoint") {
        return jsonOdm.Geo.MultiPoint.intersects(geometry, multiLineString);
    }
    if (geometry.type === "LineString") {
        return jsonOdm.Geo.LineString.intersects(geometry, multiLineString);
    }
    if (geometry.type === "MultiLineString") {
        for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
            for (k = 0; multiLineString.coordinates[j] && k < multiLineString.coordinates[j].length - 1; k++) {
                for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                    if (jsonOdm.Geo.edgeIntersectsLineString([multiLineString.coordinates[j][k], multiLineString.coordinates[j][k + 1]], geometry.coordinates[i])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    if (geometry.type === "Polygon") {
        for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
            for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates[i].length - 1; j++) {
                if (jsonOdm.Geo.edgeIntersectsPolygon([multiLineString.coordinates[i][j], multiLineString.coordinates[i][j + 1]], geometry.coordinates[0])) {
                    return true;
                }
            }
        }
        return false;
    }
    if (geometry.type === "MultiPolygon") {
        for (j = 0; multiLineString.coordinates && j < multiLineString.coordinates.length; j++) {
            for (i = 0; geometry.coordinates && i < geometry.coordinates.length; i++) {
                for (k = 0; multiLineString.coordinates[j] && k < multiLineString.coordinates[j].length - 1; k++) {
                    if (jsonOdm.Geo.edgeIntersectsPolygon([multiLineString.coordinates[j][k], multiLineString.coordinates[j][k + 1]], geometry.coordinates[i][0])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        // maybe order it by complexity to get a better best case scenario
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiLineString.intersects(multiLineString, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; multiLineString.coordinates && i < multiLineString.coordinates.length; i++) {
        for (j = 0; j < multiLineString.coordinates[i].length - 1; j++) {
            if (jsonOdm.Geo.edgeIntersectsBounds([multiLineString.coordinates[i][j], multiLineString.coordinates[i][j + 1]], geometry)) {
                return true;
            }
        }
    }
    return false;
};

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
jsonOdm.Geo.Polygon = function (positions, boundaryBox) {
    this.type = "Polygon";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a Polygon is inside of another geometry
 * @param {jsonOdm.Geo.Polygon} polygon
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.Polygon.within = function (polygon, geometry) {
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
};

/**
 * Checks whether a Polygon intersects another geometry
 * @param {jsonOdm.Geo.Polygon} polygon
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.Polygon.intersects = function (polygon, geometry) {
    var i, j;
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
};

/**
 * A GeoJSON MultiPolygon object
 * @param {Array} positions An array of Polygon position arrays
 * @param {Array} [boundaryBox] An array with [min. longitude, min. latitude, max. longitude, max. latitude]
 * @example
 * var polygons = new jsonOdm.Geo.MultiPolygon([
 *    [
 *      [[51.2,32],[51.4,21],[51.6,21],[51.2,21]],
 *      [[51.5,32],[51.6,21],[51.7,21],[51.5,21]]
 *    ],
 *    [
 *      [[51.2,32],[51.4,21],[51.6,21],[51.2,21]],
 *      [[51.5,32],[51.6,21],[51.7,21],[51.5,21]]
 *    ]
 * ]);
 * @constructor
 */
jsonOdm.Geo.MultiPolygon = function (positions, boundaryBox) {
    this.type = "MultiPolygon";
    this.coordinates = positions;
    if (boundaryBox) {
        this.bbox = boundaryBox;
    }
};

/**
 * Checks whether a MultiPolygon is inside of another geometry
 * @param {jsonOdm.Geo.MultiPolygon} multiPolygon
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiPolygon.within = function (multiPolygon, geometry) {
    var i, j, k, found;
    if (!multiPolygon.coordinates || !jsonOdm.util.isArray(multiPolygon.coordinates)) {
        return false;
    }
    if (geometry.type === "Point" || geometry.type === "MultiPoint" || geometry.type === "LineString" || geometry.type === "MultiLineString") {
        return false;
    }

    if (geometry.type === "Polygon") {
        for (i = 0; multiPolygon.coordinates && i < multiPolygon.coordinates.length; i++) {
            for (j = 0; j < multiPolygon.coordinates[i][0].length - 1; j++) {
                if (!jsonOdm.Geo.edgeWithinPolygon([multiPolygon.coordinates[i][0][j], multiPolygon.coordinates[i][0][j + 1]], geometry.coordinates[0])) {
                    return false;
                }
            }
        }
        return true;
    }
    if (geometry.type === "MultiPolygon") {
        for (i = 0; multiPolygon.coordinates && i < multiPolygon.coordinates.length; i++) {
            found = false;
            for (j = 0; geometry.coordinates && j < geometry.coordinates.length; j++) {
                for (k = 0; multiPolygon.coordinates[i][0] && k < multiPolygon.coordinates[i][0].length - 1; k++) {
                    var inside = jsonOdm.Geo.edgeWithinPolygon([multiPolygon.coordinates[i][0][k], multiPolygon.coordinates[i][0][k + 1]], geometry.coordinates[j][0]);
                    if (!inside) {
                        break;
                    }
                    if (inside && k + 1 === multiPolygon.coordinates[i][0].length - 1) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiPolygon.within(multiPolygon, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiPolygon.coordinates.length; i++) {
        for (j = 0; j < multiPolygon.coordinates[i][0].length; j++) {
            if (!jsonOdm.Geo.pointWithinBounds(multiPolygon.coordinates[i][0][j], geometry)) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Checks whether a MultiPolygon intersects another geometry
 * @param {jsonOdm.Geo.MultiPolygon} multiPolygon
 * @param {jsonOdm.Geo.Point|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry Any jsonOdm.Geo.&lt;geometry&gt; object
 * @return {boolean}
 */
jsonOdm.Geo.MultiPolygon.intersects = function (multiPolygon, geometry) {
    var i, j, k;
    if (!multiPolygon.coordinates || !jsonOdm.util.isArray(multiPolygon.coordinates)) {
        return false;
    }
    if (geometry.type === "Point") {
        return jsonOdm.Geo.Point.intersects(geometry, multiPolygon);
    }
    if (geometry.type === "MultiPoint") {
        return jsonOdm.Geo.MultiPoint.intersects(geometry, multiPolygon);
    }
    if (geometry.type === "LineString") {
        return jsonOdm.Geo.LineString.intersects(geometry, multiPolygon);
    }
    if (geometry.type === "MultiLineString") {
        return jsonOdm.Geo.MultiLineString.intersects(geometry, multiPolygon);
    }
    if (geometry.type === "Polygon") {
        return jsonOdm.Geo.Polygon.intersects(geometry, multiPolygon);
    }

    if (geometry.type === "MultiPolygon") {
        for (i = 0; multiPolygon.coordinates && i < multiPolygon.coordinates.length; i++) {
            for (j = 0; geometry.coordinates && j < geometry.coordinates.length; j++) {
                for (k = 0; multiPolygon.coordinates[i][0] && k < multiPolygon.coordinates[i][0].length - 1; k++) {
                    if (jsonOdm.Geo.pointWithinPolygon(multiPolygon.coordinates[i][0][k], geometry.coordinates[j][0])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    if (geometry.type === "GeometryCollection" && jsonOdm.util.isArray(geometry.geometries)) {
        for (i = 0; i < geometry.geometries.length; i++) {
            if (jsonOdm.Geo.MultiPolygon.intersects(multiPolygon, geometry.geometries[i])) {
                return true;
            }
        }
        return false;
    }
    // assume we have a BoundaryBox given
    for (i = 0; i < multiPolygon.coordinates.length; i++) {
        for (j = 0; j < multiPolygon.coordinates[i][0].length - 1; j++) {
            if (jsonOdm.Geo.edgeIntersectsBounds([multiPolygon.coordinates[i][0][j], multiPolygon.coordinates[i][0][j + 1]], geometry)) {
                return true;
            }
        }
    }
    return false;
};

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

/**
 * The method checks whether a point is inside a polygon or not. The polygon will be auto closed
 * @param {Array} point A point representation i.e. [1,2]
 * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.pointWithinPolygon = function (point, polygon) {
    if (!(jsonOdm.util.isArray(point) && jsonOdm.util.isArray(polygon) && polygon.length > 2)) {
        return false;
    }

    var intersection = 0, foundX;

    // close the polygon
    if (!(polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1])) {
        polygon = polygon.concat([polygon[0]]);
    }

    // do not enter the last point because the calculation also reads the i+1th index
    for (var i = 0; i < polygon.length - 1; i++) {
        if (polygon[i][0] === point[0] && polygon[i][1] === point[1]) {
            return true;
        } // vertex equals the given point
        if (
            polygon[i][0] < point[0] && polygon[i + 1][0] < point[0] || // the vector is only in section 1 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] < point[1] && polygon[i + 1][1] < point[1] || // the vector is only in section 1 or 2 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
            polygon[i][1] > point[1] && polygon[i + 1][1] > point[1]    // the vector is only in section 3 or 4 of the coordinate system normalized to the point, so it does not intersect the positive x-axis
        ) {
            continue;
        }
        foundX = (polygon[i][0] - polygon[i + 1][0]) * ((point[1] - polygon[i + 1][1]) / (polygon[i][1] - polygon[i + 1][1])) + polygon[i + 1][0];
        // on the edge
        if (foundX === point[0] && point[1] <= Math.max(polygon[i][1], polygon[i + 1][1]) && point[1] >= Math.min(polygon[i][1], polygon[i + 1][1])) {
            return true;
        }
        // the vector intersects the positive x-axis of the coordinate system normalized to the point
        if (foundX > point[0]) {
            intersection++;
        }
    }
    return intersection % 2 === 1; // the normalized x-axis needs to be intersected by a odd amount of intersections
};

/**
 * The method checks whether a edge is inside a polygon or not. The polygon will be auto closed
 * @param {Array} edge A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.edgeWithinPolygon = function (edge, polygon) {
    if (!(jsonOdm.util.isArray(edge) && edge.length === 2 && jsonOdm.util.isArray(polygon) && polygon.length >= 2)) {
        return false;
    }

    // close the polygon
    if (!(polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1])) {
        polygon = polygon.concat([polygon[0]]);
    }
    if (!jsonOdm.Geo.pointWithinPolygon(edge[0], polygon) || !jsonOdm.Geo.pointWithinPolygon(edge[1], polygon)) {
        return false;
    }

    for (var i = 0; i < polygon.length - 1; i++) {
        // All points may be inside the polygon but their might be faces that are outside the polygon
        if (jsonOdm.Geo.edgeIntersectsEdge(edge, [polygon[i], polygon[i + 1]], false)) {
            return false;
        }
    }
    return true;
};

/**
 * The method checks whether a edge intersects a polygon or not. The polygon will be auto closed
 * @param {Array} edge A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {Array} polygon A polygon representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.edgeIntersectsPolygon = function (edge, polygon) {
    if (!(jsonOdm.util.isArray(edge) && edge.length === 2 && jsonOdm.util.isArray(polygon) && polygon.length >= 2)) {
        return false;
    }

    // close the polygon
    if (!(polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1])) {
        polygon = polygon.concat([polygon[0]]);
    }
    if (jsonOdm.Geo.pointWithinPolygon(edge[0], polygon) || jsonOdm.Geo.pointWithinPolygon(edge[1], polygon)) {
        return true;
    }

    for (var i = 0; i < polygon.length - 1; i++) {
        // All points may be outside the polygon but their might be faces that are inside the polygon
        if (jsonOdm.Geo.edgeIntersectsEdge(edge, [polygon[i], polygon[i + 1]])) {
            return true;
        }
    }
    return false;
};

/**
 * The method checks whether a edge intersects a lineString or not. The polygon will be auto closed
 * @param {Array} edge A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {Array} lineString A line representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.edgeIntersectsLineString = function (edge, lineString) {
    if (!(jsonOdm.util.isArray(edge) && edge.length === 2 && jsonOdm.util.isArray(lineString))) {
        return false;
    }
    for (var i = 0; i < lineString.length - 1; i++) {
        if (jsonOdm.Geo.edgeIntersectsEdge(edge, [lineString[i], lineString[i + 1]])) {
            return true;
        }
    }
    return false;
};

/**
 * Method checks whether an edge intersects another edge
 * @param {Array} edge1 A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {Array} edge2 A 2-dimensional array holding two vertices representing the edge, i.e. [[1,2],[4,2]]
 * @param {boolean} [allowOnEdge=true] also counts it as intersection if the edge is on the other edge
 * @return {boolean}
 */
jsonOdm.Geo.edgeIntersectsEdge = function (edge1, edge2, allowOnEdge) {
    allowOnEdge = typeof allowOnEdge === "undefined" ? true : allowOnEdge;
    var directionVector1 = [edge1[1][0] - edge1[0][0], edge1[1][1] - edge1[0][1]],
        bounds1 = [Math.min(edge1[0][0], edge1[1][0]), Math.min(edge1[0][1], edge1[1][1]), Math.max(edge1[0][0], edge1[1][0]), Math.max(edge1[0][1], edge1[1][1])],
        directionVector2 = [edge2[1][0] - edge2[0][0], edge2[1][1] - edge2[0][1]],
        bounds2 = [Math.min(edge2[0][0], edge2[1][0]), Math.min(edge2[0][1], edge2[1][1]), Math.max(edge2[0][0], edge2[1][0]), Math.max(edge2[0][1], edge2[1][1])]
        ;

    // if not in bounds or if both edges are parallel with not intersection result
    if (
        (bounds1[0] > bounds2[0] && bounds1[0] > bounds2[2]) || (bounds1[1] > bounds2[1] && bounds1[1] > bounds2[3]) ||
        (bounds2[0] > bounds1[0] && bounds2[0] > bounds1[2]) || (bounds2[1] > bounds1[1] && bounds2[1] > bounds1[3])
    ) {
        return false;
    }

    if ((directionVector2[0] * directionVector1[1] - directionVector1[0] * directionVector2[1]) === 0) {
        return allowOnEdge && edge1[0][1] + (((edge2[0][0] - edge1[0][0]) / (directionVector1[0])) * (directionVector1[1])) === edge2[0][1];
    }

    var t = (edge2[0][1] * (directionVector2[0]) + edge1[0][0] * (directionVector2[1]) - edge2[0][0] * (directionVector2[1]) - edge1[0][1] * (directionVector2[0])) / ((directionVector1[1]) * (directionVector2[0]) - (directionVector1[0]) * (directionVector2[1])),
        x = edge1[0][0] + (t * (directionVector1[0])),
        y = edge1[0][1] + (t * (directionVector1[1]));

    // intersection needs to be inside the bounds
    return allowOnEdge ?
        (x >= bounds1[0] && x <= bounds1[2] && y >= bounds1[1] && y <= bounds1[3] && x >= bounds2[0] && x <= bounds2[2] && y >= bounds2[1] && y <= bounds2[3]) :
        (x > bounds1[0] && x < bounds1[2] && y > bounds1[1] && y < bounds1[3] && x > bounds2[0] && x < bounds2[2] && y > bounds2[1] && y < bounds2[3]);
};

/**
 * The method checks whether a point is on a line string path or not.
 * @param {Array} point A point representation i.e. [1,2]
 * @param {Array} lineString A line string path representation i.e. [[1,2],[2,3],[4,4],[1,2]]
 * @return {boolean}
 */
jsonOdm.Geo.pointWithinLineString = function (point, lineString) {
    if (!(jsonOdm.util.isArray(point) && jsonOdm.util.isArray(lineString) && lineString.length >= 2)) {
        return false;
    }
    for (var i = 0; i < lineString.length - 1; i++) {
        if (
            // out of bounds check
        (
            (point[0] >= lineString[i][0] && point[0] <= lineString[i + 1][0] && lineString[i][0] <= lineString[i + 1][0]) ||
            (point[0] <= lineString[i][0] && point[0] >= lineString[i + 1][0] && lineString[i][0] >= lineString[i + 1][0])
        ) &&
        (
            (point[1] >= lineString[i][1] && point[1] <= lineString[i + 1][1] && lineString[i][1] <= lineString[i + 1][1]) ||
            (point[1] <= lineString[i][1] && point[1] >= lineString[i + 1][1] && lineString[i][1] >= lineString[i + 1][1])
        )
        ) {
            // point was on the current path
            if (
                (lineString[i][0] === point[0] && lineString[i][1] === point[1]) ||
                (lineString[i + 1][0] === point[0] && lineString[i + 1][1] === point[1]) ||

                ((lineString[i][1] - lineString[i + 1][1]) != 0 && ((lineString[i][0] - lineString[i + 1][0]) * ((point[1] - lineString[i + 1][1]) / (lineString[i][1] - lineString[i + 1][1])) + lineString[i + 1][0] === point[0])) ||
                ((lineString[i][0] - lineString[i + 1][0]) != 0 && ((lineString[i][1] - lineString[i + 1][1]) * ((point[0] - lineString[i + 1][0]) / (lineString[i][0] - lineString[i + 1][0])) + lineString[i + 1][1] === point[1]))
            ) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Checks whether a point is inside a boundary box or not
 * @param {Array} point
 * @param {Array} bounds
 * @return {boolean}
 */
jsonOdm.Geo.pointWithinBounds = function (point, bounds) {
    if (!(jsonOdm.util.isArray(point) && jsonOdm.util.isArray(bounds) && bounds.length === 4)) {
        return false;
    }
    return point[0] >= bounds[0] && point[1] >= bounds[1] && point[0] <= bounds[2] && point[1] <= bounds[3];
};

/**
 * Checks whether an edge intersects a boundary box or not
 * @param {Array} edge
 * @param {Array} bounds
 * @return {boolean}
 */
jsonOdm.Geo.edgeIntersectsBounds = function (edge, bounds) {
    if (!(jsonOdm.util.isArray(edge) && jsonOdm.util.isArray(bounds) && bounds.length === 4)) {
        return false;
    }
    return jsonOdm.Geo.edgeIntersectsPolygon(edge, [[bounds[0], bounds[1]], [bounds[2], bounds[1]], [bounds[2], bounds[3]], [bounds[0], bounds[3]]]);
};

/**
 * TODO: ALSO needs to return true for [[1,1],[2,2,]] and [[0,0],[4,4]] // probably needs a rewrite
 * Checks whether a line follows another line or is on the line respectively
 * @param {Array} lineString An array of points, i.e. [[1,1],[1,2],[1,3]]
 * @param {Array} inLineString An array of points, i.e. [[1,1],[1,2],[1,3]]
 * @return {boolean}
 */
jsonOdm.Geo.lineStringWithinLineString = function (lineString, inLineString) {
    if (!(jsonOdm.util.isArray(lineString) && jsonOdm.util.isArray(inLineString))) {
        return false;
    }
    var i, j;
    for (i = 0; lineString && i < lineString.length; i++) {
        var found = false;
        for (j = 0; inLineString && j < inLineString.length; j++) {
            if (lineString[i][0] === inLineString[j][0] && lineString[i][1] === inLineString[j][1]) {
                if (i + 1 === lineString.length) {
                    return true; // we have successfully found the last matching line point
                }
                // the next vertex needs to match the next geometry point or the previous or the same again
                if (
                    !(
                        // next is not the next one
                        (inLineString[j + 1] && lineString[i + 1][0] === inLineString[j + 1][0] && lineString[i + 1][1] === inLineString[j + 1][1]) ||
                        // next is not the same one
                        (lineString[i + 1][0] === inLineString[j][0] && lineString[i + 1][1] === inLineString[j][1]) ||
                        // next is not the previous one
                        (j > 0 && lineString[i + 1][0] === inLineString[j - 1][0] && lineString[i + 1][1] === inLineString[j - 1][1])
                    )
                ) {
                    return false;
                }
                found = true;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
};
"use strict";

// for code climate recognition
if (typeof jsonOdm === "undefined") {
    var jsonOdm = new JsonOdm();
}

/**
 * The Collection class holding the date from the selected data source
 * @param {String} [collectionName] The name of the selected collection. Leave empty if you want an empty collection but with all methods
 * @return {Collection} An array object with some extra methods added to it
 * @augments Array
 * @constructor
 */
jsonOdm.Collection = function (collectionName) {
    var self = Object.create(Array.prototype);
    // calls the constructor of Array
    self = (Array.apply(self) || self);

    if (typeof collectionName !== "undefined" && jsonOdm.selectedSource && jsonOdm.selectedSource[collectionName]) {
        self = self.concat(jsonOdm.selectedSource[collectionName]);
    }
    jsonOdm.Collection.decorate(self);

    self.$branch = function () {
        var subCollection = jsonOdm.util.branch(self, arguments);
        jsonOdm.Collection.decorate(subCollection);
        return subCollection;
    };

    return self;
};

/**
 * Takes a collection object an appends all methods to it that are needed. This way we can work with a native array as a collection
 * @param {jsonOdm.Collection} collection
 */
jsonOdm.Collection.decorate = function (collection) {
    var decorate = function (collection) {
        if (jsonOdm.util.isArray(collection)) {
            /**
             * // TODO needs a proper has many functionality that aromatically gathers the child elements
             * Creates a has many relation to another collection
             * @param {Array|String} foreignKeyMapName The name of the field that holds an array of foreign keys
             * @param {int|String} privateKeyField The private key of the foreign collection objects
             * @param {jsonOdm.Collection|String} childCollectionName The child collection that belongs to the foreign keys
             * @param {String} [alias] The new field that will carry all connected data. This field must not exist before setting the relation
             * @memberof jsonOdm.Collection.prototype
             * @method $hasMany
             */
            collection.$hasMany = function (foreignKeyMapName, privateKeyField, childCollectionName, alias) {
                // SET THE ALIAS
                if (typeof childCollectionName === "string") alias = alias || childCollectionName;
                // FIND THE CHILD COLLECTION
                var childCollection = childCollectionName;
                if (typeof childCollectionName === "string" && jsonOdm.selectedSource && jsonOdm.selectedSource[childCollectionName]) {
                    childCollection = jsonOdm.selectedSource[childCollectionName];
                }

                for (var c = 0; c < collection.length; c++) {
                    var foreignKeyMap = foreignKeyMapName;
                    if (collection[c].hasOwnProperty(foreignKeyMapName)) {
                        foreignKeyMap = collection[c][foreignKeyMapName];
                    }
                    if (typeof collection[c][alias] === "undefined") {
                        for (var i = 0; foreignKeyMap.length && i < foreignKeyMap.length; i++) {
                            var foreignModel = null;
                            for (var j = 0; j < childCollection.length; j++) {
                                if (foreignKeyMap[i] == childCollection[j][privateKeyField]) {
                                    foreignModel = childCollection[j];
                                    break;
                                }
                            }
                            if (foreignModel != null) {
                                if (!collection[c][alias]) {
                                    collection[c][alias] = [];
                                }
                                collection[c][alias].push(foreignModel);
                            }
                        }
                    }
                }
            };

            /**
             * Creates a has many relation to another collection
             * @param {String} foreignKey The name of the field holding a foreign key
             * @param {int|String} privateKeyField The name of the private key field
             * @param {jsonOdm.Collection|String} childCollectionName The child collection that belongs to the foreign keys
             * @param {String} alias  The new field that will carry the connected data.
             * @memberof jsonOdm.Collection.prototype
             * @method $hasOne
             * @example
             * var customers = new jsonOdm.Collection("customers");
             * customers.$hasOne("id","customerGroupId","customerGroup","group");
             * console.log(customers[0]);
             * // > {name:"Some Name",age:"25",...,customerGroupId:1,gourp:{id:1,name:"VIP"},...}
             */
            collection.$hasOne = function (foreignKey, privateKeyField, childCollectionName, alias) {
                // SET THE ALIAS
                if (typeof childCollectionName === "string") alias = alias || childCollectionName;
                // FIND THE CHILD COLLECTION
                var childCollection = childCollectionName;
                if (typeof childCollectionName === "string" && jsonOdm.selectedSource && jsonOdm.selectedSource[childCollectionName]) {
                    childCollection = jsonOdm.selectedSource[childCollectionName];
                }

                for (var c = 0; c < collection.length; c++) {
                    var foreignKeyValue;
                    if (collection[c].hasOwnProperty(foreignKey)) {
                        foreignKeyValue = collection[c][foreignKey];
                    }
                    if (typeof collection[c][alias] === "undefined") {
                        var foreignModel = null;
                        for (var j = 0; j < childCollection.length; j++) {
                            if (foreignKeyValue == childCollection[j][privateKeyField]) {
                                foreignModel = childCollection[j];
                                break;
                            }
                        }
                        if (foreignModel != null) {
                            collection[c][alias] = foreignModel;
                        }
                    }
                }
            };

            /**
             * Creates a query object filled with the right collection data
             * @return {jsonOdm.Query} A new query object
             * @memberof jsonOdm.Collection.prototype
             * @method $query
             */
            collection.$query = function () {
                return new jsonOdm.Query(collection);
            };
        }
    };

    decorate(collection);
};
"use strict";

// for code climate recognition
if (typeof jsonOdm === "undefined") {
    var jsonOdm = new JsonOdm();
}

/** @namespace jsonOdm.Query */

/**
 * The query object that holds the collection to be queried
 * @param {jsonOdm.Collection} [collection]
 * @constructor
 * @example //This example shows how to query a collection
 * var myCollection = new jsonOdm('myCollection');
 * var $q = myCollection.query();
 * $q.$and(
 *    $q.$or(
 *        $q.$branch('child','id').$eq(1,2),
 *        $q.$branch('child').$isNull()
 *    ),
 *    $q.$each('enabled').$eq(1,true)
 * ).$all();
 * @example //This example shows how to delete some entries of a collection
 * var myCollection = new jsonOdm('myCollection');
 * var $q = myCollection.query();
 * $q.$branch('child','id').$eq(1,2).$delete();
 */
jsonOdm.Query = function (collection) {
    this.$$commandQueue = [];
    this.$$aggregationBeforeCollectQueue = [];
    this.$$aggregationResultQueue = [];
    this.$$collection = collection || [];
    this.$$accumulation = false;
};

/**
 * Returns a collection containing all matching elements
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * collection.$query()
 *    .$branch("id").$gt(500)
 *    .$delete();
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$delete = function () {
    if (this.$$commandQueue.length < 1) {
        return this;
    }
    for (var i = 0; i < this.$$collection.length; ) {
        var validCollection = true;
        for (var j = 0; j < this.$$commandQueue.length; j++) {
            if (!(validCollection = validCollection && this.$$commandQueue[j](this.$$collection[i]))) {
                break;
            }
        }
        if (validCollection) {
            this.$$collection.splice(i, 1);
        } else {
            i++;
        }
    }
    return this;
};

/**
 * Returns a collection containing all matching elements within the given range
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * collection.$query()
 *    .$branch("id").$eq(2,9)
 *    .$result(1,3);
 * @param {int} [start] return a subset starting at n; default = 0
 * @param {int} [length] return a subset with the length n; default = collection length
 * @return {*}
 */
jsonOdm.Query.prototype.$result = function (start, length) {
    if (this.$$commandQueue.length < 1 && this.$$aggregationBeforeCollectQueue < 1) {
        return this.$$collection;
    }
    start = typeof start === "undefined" ? 0 : start;
    length = typeof length === "undefined" ? this.$$collection.length : length;

    var filterCollection = new jsonOdm.Collection(),
        resultingElement, i, j;

    for (i = 0; i < this.$$collection.length; i++) {
        var validCollection = true;
        for (j = 0; j < this.$$commandQueue.length; j++) {
            var commandResult = this.$$commandQueue[j](this.$$collection[i]);
            if (!(validCollection = validCollection && commandResult !== null && commandResult !== false && typeof commandResult !== "undefined")) {
                break;
            }
        }
        if (validCollection) {
            if (start > 0) {
                start--;
                continue;
            }
            if (length <= 0) {
                return filterCollection;
            }

            resultingElement = this.$$collection[i];
            for (j = 0; j < this.$$aggregationBeforeCollectQueue.length; j++) {
                resultingElement = this.$$aggregationBeforeCollectQueue[j](i, resultingElement);
            }
            filterCollection.push(resultingElement);
            length--;
        }
    }
    for (i = 0; i < this.$$aggregationResultQueue.length; i++) {
        filterCollection = this.$$aggregationResultQueue[i](filterCollection);
    }
    return filterCollection;
};

/**
 * Returns a collection containing all matching elements
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * collection.$query()
 *    .$branch("id").$eq(2,9)
 *    .$all();
 * @return {jsonOdm.Collection}
 */
jsonOdm.Query.prototype.$all = function () {
    return this.$result();
};

/**
 * Short hand version for $all(true)
 * @return {jsonOdm.Collection}
 */
jsonOdm.Query.prototype.$first = function () {
    return this.$result(0, 1)[0];
};

//////////////////////////////////// COLLECTION AGGREGATION

/**
 * Helper method for aggregation methods
 * @param {function[]|function} afterValidation Push into the query queue after all commands have been executed. Returning false will result in a skip of this value
 * @param {function[]|function} [beforeCollect] Push into the before collect queue to change or replace the collection element
 * @param {function[]|function} [aggregation] If the result of the whole aggregation changes, i.e. for searching, or ordering
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$aggregateCollection = function (afterValidation, beforeCollect, aggregation) {
    if (typeof afterValidation === "function") {
        afterValidation = [afterValidation];
    }
    if (typeof beforeCollect === "function") {
        beforeCollect = [beforeCollect];
    }
    if (typeof aggregation === "function") {
        aggregation = [aggregation];
    }

    if (jsonOdm.util.isArray(afterValidation)) {
        this.$$commandQueue = this.$$commandQueue.concat(afterValidation);
    }
    if (jsonOdm.util.isArray(beforeCollect)) {
        this.$$aggregationBeforeCollectQueue = this.$$aggregationBeforeCollectQueue.concat(beforeCollect);
    }
    if (jsonOdm.util.isArray(aggregation)) {
        this.$$aggregationResultQueue = this.$$aggregationResultQueue.concat(aggregation);
    }
    return this;
};

/**
 * Groups all elements of a collection by a given grouping schema
 * @param {...jsonOdm.Query}
 * @return {jsonOdm.Query}
 * @example
 * var collection = new jsonOdm.Collection("employees");
 * var $query = collection.$query();
 * var groupedResult = $query.$and($query.$branch("age").$gt(21),$query.$branch("age").$lt(50)) // query before grouping
 *       .$group(
 *            "salaryRate", // as used with $branch
 *            ["salaryGroup","name"], // as used with $branch
 *            // A projection object defining the accumulation
 *            {
 *                 missingDays:$query.$sum("daysAtHome"),
 *                 holidayDays:$query.$sum("daysOnHoliday"),
 *                 averageMissingDays:$query.$avg("daysAtHome"),
 *                 averageHolidayDays:$query.$avg("daysOnHoliday"),
 *                 count:$query.$count()
 *            }
 *       ).$all();
 * // RESULT COULD BE
 * // [
 * //   {"salaryRate":3300,"salaryGroup":{"name":"Developer"},"missingDays":22,"holidayDays":144,"averageMissingDays":11,"averageHolidayDays":72,"count":2},
 * //   {"salaryRate":2800,"salaryGroup":{"name":"Tester"}   ,"missingDays":10,"holidayDays":66 ,"averageMissingDays":5, "averageHolidayDays":33,"count":2},
 * //   {"salaryRate":4800,"salaryGroup":{"name":"Boss"}     ,"missingDays":12,"holidayDays":33 ,"averageMissingDays":12,"averageHolidayDays":33,"count":1}
 * // ]
 */
jsonOdm.Query.prototype.$group = function () {
    var orderByFields = arguments;
    var accumulationProjectionDefinition = false;
    var aggregationResultBuffer = [];
    // last argument might be a projection
    if (
        arguments.length > 1 && !(jsonOdm.util.isArray(arguments[arguments.length - 1])) && !(jsonOdm.util.is(arguments[arguments.length - 1], "string")) &&
        typeof arguments[arguments.length - 1] === "object"
    ) {
        accumulationProjectionDefinition = arguments[arguments.length - 1];
        orderByFields = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    }
    return this.$aggregateCollection(
        (function (orderBy, aggregationResult) {
            var valueVariations = {};
            return function (collectionElement) {
                // walk through the collection
                var accumulationObject = {},
                    currentValueVariation = valueVariations,
                    value;
                // create result sets matching the order by parameters
                for (var i = 0; i < orderBy.length; i++) {
                    var currentOrderBy = jsonOdm.util.isArray(orderBy[i]) ? orderBy[i] : [orderBy[i]];
                    value = jsonOdm.util.branch(collectionElement, currentOrderBy);
                    if (i < orderBy.length - 1) {
                        if (typeof currentValueVariation["" + value] === "undefined") {
                            currentValueVariation["" + value] = {};
                        }
                        currentValueVariation = currentValueVariation["" + value];
                    }
                    var accumulationObjectBuffer = accumulationObject;
                    for (var j = 0; j < currentOrderBy.length - 1; j++) {
                        if (typeof accumulationObjectBuffer[currentOrderBy[j]] === "undefined") {
                            accumulationObjectBuffer[currentOrderBy[j]] = {};
                        }
                        accumulationObjectBuffer = accumulationObjectBuffer[currentOrderBy[j]];
                    }
                    accumulationObjectBuffer[currentOrderBy[currentOrderBy.length - 1]] = value;
                }
                if (!currentValueVariation["" + value]) {
                    // this valueVariation has not been found before
                    currentValueVariation["" + value] = {
                        accumulationObject: accumulationObject,
                        subResultSet: []
                    };
                    aggregationResult.push(currentValueVariation["" + value]);
                }
                currentValueVariation["" + value].subResultSet.push(collectionElement);

                return true;
            };
        })(orderByFields, aggregationResultBuffer),
        null,
        (function (aggregationResult, accumulationProjection) {
            function falseQueryAccumulation(projection) {
                for (var i in projection) {
                    if (!projection.hasOwnProperty(i)) {
                        continue;
                    }
                    if (projection[i] instanceof jsonOdm.Query) {
                        projection[i].$$accumulation = false;
                    }
                    if (typeof projection[i] === "object") {
                        falseQueryAccumulation(projection[i]);
                    }
                }
            }

            return function () {
                var resultCollection = new jsonOdm.Collection();
                for (var i = 0; i < aggregationResult.length; i++) {
                    if (accumulationProjection === false) {
                        resultCollection.push(aggregationResult[i].accumulationObject);
                    } else {
                        falseQueryAccumulation(accumulationProjection);
                        var projectionResult = {};
                        for (var j = 0; j < aggregationResult[i].subResultSet.length; j++) {
                            projectionResult = jsonOdm.util.projectElement(accumulationProjection, aggregationResult[i].subResultSet[j]);
                        }
                        for (j in aggregationResult[i].accumulationObject) {
                            if (aggregationResult[i].accumulationObject.hasOwnProperty(j)) {
                                projectionResult[j] = aggregationResult[i].accumulationObject[j];
                            }
                        }
                        resultCollection.push(projectionResult);
                    }
                }
                return resultCollection;
            };
        })(aggregationResultBuffer, accumulationProjectionDefinition));
};

/**
 * Projects all elements of the collection into a given schema
 * @param {*} projection The projection definition with nested definitions
 * @return {jsonOdm.Query}
 * @example
 * var collection = new jsonOdm.Collection("myBooks");
 * var $query = collection.$query()
 *    .$branch("id").$gt(12) // query before project
 *    .$project({
 *        title: 1,
 *        isbn: {
 *            prefix: $query.$branch("isbn").$subString(0,3),
 *            group: $query.$branch("isbn").$subString(3,2),
 *            publisher: $query.$branch("isbn").$subString(5,4),
 *            title: $query.$branch("isbn").$subString(9,3),
 *            checkDigit: $query.$branch("isbn").$subString(12,1)
 *         },
 *         lastName: function(element){return element.author.last}, // functions can be used as well
 *         copiesSold: $query.$branch("copies")
 *    });
 * var collectionResult = $query.$all();
 */
jsonOdm.Query.prototype.$project = function (projection) {
    return this.$aggregateCollection(null, function (index, element) {
        return jsonOdm.util.projectElement(projection, element);
    });
};

//////////////////////////////////// COLLECTION QUERYING AND FILTERING

/**
 * Test a collection or collection field against one or more values
 * @param {*} comparables An array of values to test again
 * @param {function} collectionTest the test function to evaluate the values
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$testCollection = function (comparables, collectionTest) {
    var lastCommand = this.$$commandQueue.pop();
    var $testCollection = (function () {
        return function (collection) {
            if (!((lastCommand instanceof jsonOdm.Collection || typeof lastCommand === "function" || typeof lastCommand === "undefined") && typeof collectionTest === "function")) {
                return false;
            }
            var collectionValue = typeof lastCommand === "undefined" ? collection : (lastCommand instanceof jsonOdm.Collection ? lastCommand : lastCommand(collection));
            return !!collectionTest(collectionValue, comparables);
        };
    })();
    this.$$commandQueue.push($testCollection);
    return this;
};

/**
 * Test a collection or collection field against one or more values
 * @param {jsonOdm.Query[]} queries A finite number of operators
 * @param {function} operator the test function to evaluate the values
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$queryOperator = function (queries, operator) {
    var $testCollection = (function (queries, currentOprator) {
        return function (collection) {
            if (typeof currentOprator !== "function") {
                return false;
            }
            var commandResults = [];
            for (var i = 0; i < queries.length; i++) {
                if (queries[i] instanceof jsonOdm.Query) {
                    for (var j = 0; j < queries[i].$$commandQueue.length; j++) {
                        commandResults.push(queries[i].$$commandQueue[j](collection));
                    }
                } else {
                    // also accept raw values
                    commandResults.push(queries[i]);
                }
            }
            return currentOprator(commandResults);
        };
    })(queries, operator);
    var subQuery = new jsonOdm.Query(this.$$collection);
    subQuery.$$commandQueue.push($testCollection);
    return subQuery;
};

/** Go down the property tree of the collection
 * @param {...String} node A variable amount of nodes to traverse down the document tree
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$branch = function (node) {
    if( typeof node === "undefined" ) {
        return this;
    }
    var $branch = (function (nodes) {
        /**
         * @param {*} The collection to go down
         * @return {Query|boolean} The query object with the sub collection or false if querying was impossible
         */
        return function (collection) {
            return jsonOdm.util.branch(collection, nodes);
        };
    })(arguments);
    var subQuery = new jsonOdm.Query(this.$$collection);
    subQuery.$$commandQueue.push($branch);
    return subQuery;
};

// FIELD MODIFIER

/** Modify fields before validation
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$modifyField = function (modifier) {
    var $modifier = (function (currentModifier, lastCommand) {
        /**
         * @param {*} The collection to go down
         * @return {Query|boolean} The query object with the sub collection or false if querying was impossible
         */
        return function (collection) {
            collection = lastCommand !== null ? lastCommand(collection) : collection;
            return typeof currentModifier === "function" ? currentModifier(collection) : collection;
        };
    })(modifier, this.$$commandQueue.length ? this.$$commandQueue[this.$$commandQueue.length - 1] : null);
    this.$$commandQueue.push($modifier);
    return this;
};

/** A generation for all native String.prototype methods to make them available via $modifyField <br/>
 * Supported Methods are: "charAt", "charCodeAt", "concat", "fromCharCode", "indexOf", "lastIndexOf", "localeCompare", "match", "replace", "search", "slice", "split", "substr", "substring", "toLocaleLowerCase", "toLocaleUpperCase", "toLowerCase", "toUpperCase", "trim", "valueOf"
 * @param {*} [args] The string methods parameter
 * @return {jsonOdm.Query}
 * @method StringPrototype
 * @memberof jsonOdm.Query.prototype
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * var $query = collection.$query();
 *    $query.$branch("explosionBy").$trim().$substr(0,3).$toUpperCase().$eq("TNT").$all();
 */
jsonOdm.Query.stringFiledModifyer = ["charAt", "charCodeAt", "concat", "fromCharCode", "indexOf", "lastIndexOf", "localeCompare", "match", "replace", "search", "slice", "split", "substr", "substring", "toLocaleLowerCase", "toLocaleUpperCase", "toLowerCase", "toUpperCase", "trim", "valueOf"];
function createQueryStringModifier(modifyer) {
    return function () {
        return this.$modifyField((function (args, modifyer) {
            return function (value) {
                return typeof value === "string" && String.prototype.hasOwnProperty(modifyer) ? String.prototype[modifyer].apply(value, args) : value;
            };
        })(arguments, modifyer));
    };
}
for (var i = 0; i < jsonOdm.Query.stringFiledModifyer.length; i++) {
    jsonOdm.Query.prototype["$" + jsonOdm.Query.stringFiledModifyer[i]] = createQueryStringModifier(jsonOdm.Query.stringFiledModifyer[i]);
}

// ACCUMULATION FUNCTIONS

/** Go down the property tree of the collection
 * @param {String[]} nodes A variable of nodes to traverse down the json tree
 * @param {function} accumulator
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$accumulator = function (nodes, accumulator) {
    nodes = typeof nodes === "string" ? [nodes] : nodes;
    var subQuery = new jsonOdm.Query(this.$$collection);
    var $accumulator = (function (nodes, accumulator, query, parentQuery) {
        /**
         * @param {*} The collection to go down
         * @return {Query|boolean} The query object with the sub collection or false if querying was impossible
         */
        return function (collection) {
            var value = nodes !== null ? jsonOdm.util.branch(collection, nodes) : nodes;
            query.$$accumulation = accumulator(value, query.$$accumulation, collection);
            parentQuery.$$accumulation = query.$$accumulation;
            return value;
        };
    })(nodes, accumulator, subQuery, this);
    subQuery.$$commandQueue.push($accumulator);
    return subQuery;
};

/**
 * Performs the accumulation sum of a field. It's integrated to be used with $group. May as well be used as stand alone.
 * @param {...String} branch Internally calls the $branch method to receive the field values
 * @return {jsonOdm.Query}
 * @example
 * // SHOULD BE USED WITH $group
 * var collection = new jsonOdm.Collection("employees");
 * var $query = collection.$query();
 * $query.$sum("daysOff").$all();
 * console.log($query.$$accumulation);
 */
jsonOdm.Query.prototype.$sum = function (branch) {
    return this.$accumulator(branch, function (value, accumulation) {
        if (accumulation === false) {
            accumulation = 0;
        }
        return value + accumulation;
    });
};

/**
 * Performs the accumulation average of a field. It's integrated to be used with $group. May as well be used as stand alone.
 * @param {...String} branch Internally calls the $branch method to receive the field values
 * @return {jsonOdm.Query}
 * @example
 * // SHOULD BE USED WITH $group
 * var collection = new jsonOdm.Collection("employees");
 * var $query = collection.$query();
 * $query.$avg("daysOff").$all();
 * console.log($query.$$accumulation);
 */
jsonOdm.Query.prototype.$avg = function (branch) {
    var count, sum;
    return this.$accumulator(branch, function (value, accumulation) {
        if (accumulation === false) {
            count = 0;
            sum = 0;
        }
        sum += value;
        count++;
        return sum / count;
    });
};

/**
 * Performs the accumulation max of a field. It's integrated to be used with $group. May as well be used as stand alone.
 * @param {...String} branch Internally calls the $branch method to receive the field values
 * @return {jsonOdm.Query}
 * @example
 * // SHOULD BE USED WITH $group
 * var collection = new jsonOdm.Collection("employees");
 * var $query = collection.$query();
 * $query.$max("daysOff").$all();
 * console.log($query.$$accumulation);
 */
jsonOdm.Query.prototype.$max = function (branch) {
    return this.$accumulator(branch, function (value, accumulation) {
        if (accumulation === false) {
            accumulation = value;
        }
        return Math.max(value, accumulation);
    });
};

/**
 * Performs the accumulation min of a field. It's integrated to be used with $group. May as well be used as stand alone.
 * @param {...String} branch Internally calls the $branch method to receive the field values
 * @return {jsonOdm.Query}
 * @example
 * // SHOULD BE USED WITH $group
 * var collection = new jsonOdm.Collection("employees");
 * var $query = collection.$query();
 * $query.$max("daysOff").$all();
 * console.log($query.$$accumulation);
 */
jsonOdm.Query.prototype.$min = function (branch) {
    return this.$accumulator(branch, function (value, accumulation) {
        if (accumulation === false) {
            accumulation = value;
        }
        return Math.min(value, accumulation);
    });
};

/**
 * Counts the grouped elements
 * @return {jsonOdm.Query}
 * @example
 * // SHOULD BE USED WITH $group
 * var collection = new jsonOdm.Collection("employees");
 * var $query = collection.$count();
 * $query.$count("daysOff").$all();
 * expect(collection.length).toBe($query.$$accumulation);
 */
jsonOdm.Query.prototype.$count = function () {
    return this.$accumulator(null, function (value, accumulation) {
        if (accumulation === false) {
            accumulation = 0;
        }
        return ++accumulation;
    });
};

/**
 * adds the grouped elements to result set
 * @return {jsonOdm.Query}
 * @example
 * // SHOULD BE USED WITH $group
 * var collection = new jsonOdm.Collection("employees");
 * var $query = collection.$query();
 * $query.$push("daysOff").$all()
 * expect(collection.length).toBe($query.$$accumulation.length);
 */
jsonOdm.Query.prototype.$push = function () {
    var subQuery = new jsonOdm.Query(this.$$collection);
    var $push = (function (query, parentQuery) {
        return function (collectionElement) {
            query.$$accumulation = query.$$accumulation === false ? [] : query.$$accumulation;
            query.$$accumulation.push(collectionElement);
            parentQuery.$$accumulation = query.$$accumulation;
            return true;
        };
    })(subQuery, this);
    subQuery.$$commandQueue.push($push);
    return subQuery;
};

// ARITHMETIC FUNCTIONS

/**
 * Performs an arithmetic addition on two or more field values
 * @param {jsonOdm.Query|Number} branch1
 * @param {...jsonOdm.Query|...Number} branch2
 * @return jsonOdm.Query
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * var $query = collection.$query();
 *    $query.$add(
 *        $query.$branch("firstValue"),
 *        $query.$subtract(
 *            $query.$branch("lastValue"),
 *            $query.$branch(["otherValues","firstValue"])
 *        )
 *    ).$eq(12).$all();
 */
jsonOdm.Query.prototype.$add = function (branch1, branch2) {
    return this.$queryOperator(arguments, function (queryResults) {
        var result = queryResults.length > 0 ? queryResults[0] : 0;
        for (var i = 1; i < queryResults.length; i++) {
            result += queryResults[i];
        }
        return result;
    });
};

/**
 * Performs an arithmetic subtraction on two or more field values
 * @param {...jsonOdm.Query|...Number} branch
 * @return jsonOdm.Query
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * var $query = collection.$query();
 *    $query.$subtract(
 *        $query.$branch("firstValue"),
 *        $query.$add(
 *            $query.$branch("lastValue"),
 *            $query.$branch(["otherValues","firstValue"])
 *        )
 *    ).$eq(12).$all();
 */
jsonOdm.Query.prototype.$subtract = function (branch) {
    if( typeof branch === "undefined" ) {
        return this;
    }
    return this.$queryOperator(arguments, function (queryResults) {
        var result = queryResults.length > 0 ? queryResults[0] : 0;
        for (var i = 1; i < queryResults.length; i++) {
            result -= queryResults[i];
        }
        return result;
    });
};

/**
 * Performs an arithmetic multiplication on two or more field values
 * @param {...jsonOdm.Query|...Number} branch
 * @return jsonOdm.Query
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * var $query = collection.$query();
 *    $query.$multiply(
 *        $query.$branch("firstValue"),
 *        $query.$add(
 *            $query.$branch("lastValue"),
 *            $query.$branch(["otherValues","firstValue"])
 *        )
 *    ).$eq(12).$all();
 */
jsonOdm.Query.prototype.$multiply = function (branch) {
    if( typeof branch === "undefined" ) {
        return this;
    }
    return this.$queryOperator(arguments, function (queryResults) {
        var result = queryResults.length > 0 ? queryResults[0] : 0;
        for (var i = 1; i < queryResults.length; i++) {
            result *= queryResults[i];
        }
        return result;
    });
};

/**
 * Performs an arithmetic divition on two or more field values
 * @param {...jsonOdm.Query|...Number} branch
 * @return jsonOdm.Query
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * var $query = collection.$query();
 *    $query.$divide(
 *        $query.$branch("firstValue"),
 *        $query.$add(
 *            $query.$branch("lastValue"),
 *            $query.$branch(["otherValues","firstValue"])
 *        )
 *    ).$eq(12).$all();
 */
jsonOdm.Query.prototype.$divide = function (branch) {
    if( typeof branch === "undefined" ) {
        return this;
    }
    return this.$queryOperator(arguments, function (queryResults) {
        var result = queryResults.length > 0 ? queryResults[0] : 0;
        for (var i = 1; i < queryResults.length; i++) {
            result /= queryResults[i];
        }
        return result;
    });
};

/**
 * Performs an arithmetic modulo on two or more field values
 * @param {jsonOdm.Query|Number} branch
 * @param {...jsonOdm.Query|...Number} module
 * @return jsonOdm.Query
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * var $query = collection.$query();
 *    $query.$modulo(
 *        $query.$branch("firstValue"),
 *        $query.$add(
 *            $query.$branch("lastValue"),
 *            $query.$branch(["otherValues","firstValue"])
 *        )
 *    ).$eq(12).$all();
 */
jsonOdm.Query.prototype.$modulo = function (branch, module) {
    if( typeof branch === "undefined" ) {
        return this;
    }
    return this.$queryOperator(arguments, function (queryResults) {
        var result = queryResults.length > 0 ? queryResults[0] : 0;
        for (var i = 1; i < queryResults.length; i++) {
            result = result % queryResults[i];
        }
        return result;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $eq('1','2','4') so 1 or 2 or 4 are valid fields
 * @param {...*} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$eq = function (comparable) {
    if( typeof comparable === "undefined" ) {
        return this;
    }
    return this.$testCollection(arguments, function (collectionValue, possibleValues) {
        for (var i = 0; i < possibleValues.length; i++) {
            if (possibleValues[i] === collectionValue) {
                return true;
            }
        }
        return false;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $in(['1','2','4']) so 1 or 2 or 4 are valid fields
 * @param {Array} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$in = function (comparable) {
    if( typeof comparable === "undefined" ) {
        comparable = [];
    }
    return this.$testCollection(comparable, function (collectionValue, possibleValues) {
        for (var i = 0; i < possibleValues.length; i++) {
            if (possibleValues[i] === collectionValue) {
                return true;
            }
        }
        return false;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $ne('1','2','4') so 1 or 2 or 4 are not valid fields
 * @param {...*} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$ne = function (comparable) {
    if( typeof comparable === "undefined" ) {
        return this
    }
    return this.$testCollection(arguments, function (collectionValue, possibleValues) {
        for (var i = 0; i < possibleValues.length; i++) {
            if (possibleValues[i] === collectionValue) {
                return false;
            }
        }
        return true;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $nin(['1','2','4']) so 1 or 2 or 4 are not valid fields
 * @param {Array} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$nin = function (comparable) {
    if( typeof comparable === "undefined" ) {
        comparable = [];
    }
    return this.$testCollection(comparable, function (collectionValue, possibleValues) {
        for (var i = 0; i < possibleValues.length; i++) {
            if (possibleValues[i] === collectionValue) {
                return false;
            }
        }
        return true;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $gt('1') field values greater then 1 are valid
 * @param {*} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$gt = function (comparable) {
    return this.$testCollection(comparable, function (collectionValue, possibleValues) {
        return possibleValues < collectionValue;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $gte('1') field values greater then or equal to 1 are valid
 * @param {*} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$gte = function (comparable) {
    return this.$testCollection(comparable, function (collectionValue, possibleValues) {
        return possibleValues <= collectionValue;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $lt('1') field values less then 1 are valid
 * @param {*} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$lt = function (comparable) {
    return this.$testCollection(comparable, function (collectionValue, possibleValues) {
        return possibleValues > collectionValue;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $lte('1') field values less then or equal to 1 are valid
 * @param {*} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$lte = function (comparable) {
    return this.$testCollection(comparable, function (collectionValue, possibleValues) {
        return possibleValues >= collectionValue;
    });
};

/**
 * Compares the current sub collection value to be null or undefined
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$isNull = function () {
    return this.$testCollection(null, function (collectionValue) {
        return typeof collectionValue === "undefined" || collectionValue === null;
    });
};

/**
 * Compares the current sub collection value to not be undefined
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$exists = function () {
    return this.$testCollection(null, function (collectionValue) {
        return typeof collectionValue !== "undefined";
    });
};

/**
 * Compares the current sub collection against the given types using the binary of and the JavaScript typeof
 * Supported (case insensitive) types are: number, string, undefined, object, array and RegExp, ArrayBuffer, null, boolean plus all other [object *] types
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * collection.$query()
 *    // id is string or number and not undefined or null
 *    .$branch("id").$type("string","number")
 *    .$all();
 * @param {...string} type A list of allowed types for the selected field
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$type = function (type) {
    if(typeof type === "undefined" ) {
        return this.$testCollection([type], function () {
            return false;
        });
    }

    return this.$testCollection(arguments, function (collectionValue, possibleTypes) {
        return jsonOdm.util.is(collectionValue, possibleTypes);
    });
};

/**
 * Compares the given reminder against the selected field value modulo the given divisor
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * collection.$query()
 *    // get every fourth element, so elements with id 4,8,12,... when starting with id 1
 *    .$branch("id").$mod(4,0)
 *    .$all();
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$mod = function (divisor, remainder) {
    if( typeof divisor === "undefined" || typeof remainder === "undefined" ){
        return this;
    }
    return this.$testCollection(arguments, function (collectionValue, args) {
        return collectionValue % args[0] === args[1];
    });
};

/**
 * Tests a selected field against the regular expression
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * collection.$query()
 *    // gets all elements with a name of "Richard","RiChI","RichI","richard",...
 *    .$branch("name").$regex(/rich(i|ard)/i)
 *    .$all();
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * collection.$query()
 *    // gets all elements with a name of "Richard","RiChI","RichI","richard",...
 *    .$branch("name").$regex("rich(i|ard)","i")
 *    .$all();
 * @param {RegExp|string} regex The regular expression to test against
 * @param {string} [options] The regular expression options, i.e. "i" for case insensitivity
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$regex = function (regex, options) {
    if (typeof regex === "string") {
        regex = typeof options === "string" ? new RegExp(regex, options) : new RegExp(regex);
    }
    return this.$testCollection(regex, function (collectionValue, regex) {
        return regex.test(collectionValue);
    });
};

/**
 * Performs a text search on a given collection with the same notation used by mongodb<br/>
 * In contrast to mongodb this method does not implement stop words elimination or word stamming at the moment
 * @example
 * collection.$query()
 *    // Must find "Ralf Tomson" and ("Jack" or "Josh") and not("Matteo")
 *    .$branch("name").$text("Jack Josh \"Ralf Tomson\" -Matteo")
 *    .$all();
 * @param {String} text
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$text = function (text) {
    var notRegExp = /(^| )-([^ ]+)( |$)/g;
    var andRegExp = /"([^"]+)"/g;
    var nots = [], ands = [];
    var notMatches, andMatches;
    while ((notMatches = notRegExp.exec(text)) !== null) {
        nots.push(notMatches[2]);
    }
    text = text.replace(notRegExp, "");
    while ((andMatches = andRegExp.exec(text)) !== null) {
        ands.push(andMatches[1]);
    }
    text = text.replace(andRegExp, "");
    var ors = text.split(" ");
    return this.$testCollection([nots, ands, ors], function (collectionValue, logics) {
        // nots
        for (var i = 0; i < logics[0].length; i++) {
            if (collectionValue.indexOf(logics[0][i]) > -1) {
                return false;
            }
        }
        // ands
        for (i = 0; i < logics[1].length; i++) {
            if (collectionValue.indexOf(logics[1][i]) < 0) {
                return false;
            }
        }
        // ors
        for (i = 0; i < logics[2].length; i++) {
            if (collectionValue.indexOf(logics[2][i]) > -1) {
                return true;
            }
        }
        // if there are no ors, matching all ands is enough
        return !!logics[1].length;
    });
};

/**
 * Performs a query selection by a self defined function of function body string. The function context (this) will be the current collection or a value selected by $branch.
 * @example
 * // !!!! NOT SUPPORTED ANYMORE !!!! using a string to find Harry
 * collection.$query().$where("return this.name == 'Harry';").$first();
 * // using a function to find Harry
 * collection.$query().$where(function(){return this.name == 'Harry';}).$first();
 * // using $where after selecting a branch
 * collection.$query().$('name').$where(function(){return this == 'Harry';}).$first();
 * @param {string|Function} evaluation
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$where = function (evaluation) {
    return this.$testCollection(evaluation, function (collectionValue, evaluation) {
        if (typeof evaluation !== "function") {
            return false;
        }
        return evaluation.apply(collectionValue);
    });
};

/*-------- GEO ----------*/
/**
 * Checks whether the current field geometry is within the given geometry object <br/>
 * <strong style="color:#ff0000">Warning:</strong> The coordinate reference system is <a href="http://spatialreference.org/ref/epsg/4326/" target="_blank">WGS 84</a>witch uses the coordinate order [<strong>longitude</strong>,<strong>latitude</strong>]!<br/>
 * The method automatically transforms arrays into the assumed GeoJSON definitions where: <br/>
 * [10,10] transforms into a jsonOdm.Geo.Point <br/>
 * [[10,10],[10,12],...] transforms into a jsonOdm.Geo.LineString <br/>
 * [[[10,10],[10,12],...],...] transforms into a jsonOdm.Geo.Polygon <br/>
 * [[[[10,10],[10,12],...],...],...] transforms into a jsonOdm.Geo.MultiPolygon <br/>
 * or simply use a GeoJSON object definition from jsonOdm.Geo
 * @example
 * {
 *     "geo":[
 *         {
 *             "type": "Feature",
 *             "properties": {...},
 *             "geometry": {
 *                 "type": "Polygon",
 *                 "coordinates": [ ... ]
 *             }
 *         },
 *         {
 *             "type": "Feature",
 *             "properties": {...},
 *             "geometry": {
 *                 "type": "Polygon",
 *                 "coordinates": [ ... ]
 *             }
 *         },
 *         ...
 *     ]
 * }
 *
 * var collection = new jsonOdm.Collection("geo"),
 *     q = collection.$query().$branch("geometry").$geoWithin(new jsonOdm.Geo.BoundaryBox([129.049317,-31.434555,139.464356,-19.068644]));
 *     //found geometries
 *     geometries = q.$all();
 * @param {Array|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$geoWithin = function (geometry) {
    return this.$testCollection(jsonOdm.Geo.detectAsGeometry(geometry), function (collectionValue, geometry) {
        return jsonOdm.Geo[collectionValue.type] && jsonOdm.Geo[collectionValue.type].within && jsonOdm.Geo[collectionValue.type].within(collectionValue, geometry);
    });
};

/**
 * Checks whether the current field geometry intersects the given geometry object <br/>
 * <strong style="color:#ff0000">Warning:</strong> The coordinate reference system is <a href="http://spatialreference.org/ref/epsg/4326/" target="_blank">WGS 84</a>witch uses the coordinate order [<strong>longitude</strong>,<strong>latitude</strong>]!<br/>
 * The method automatically transforms arrays into the assumed GeoJSON definitions where: <br/>
 * [10,10] transforms into a jsonOdm.Geo.Point <br/>
 * [[10,10],[10,12],...] transforms into a jsonOdm.Geo.LineString <br/>
 * [[[10,10],[10,12],...],...] transforms into a jsonOdm.Geo.Polygon <br/>
 * [[[[10,10],[10,12],...],...],...] transforms into a jsonOdm.Geo.MultiPolygon <br/>
 * or simply use a GeoJSON object definition from jsonOdm.Geo
 * @example
 * {
 *     "geo":[
 *         {
 *             "type": "Feature",
 *             "properties": {...},
 *             "geometry": {
 *                 "type": "Polygon",
 *                 "coordinates": [ ... ]
 *             }
 *         },
 *         {
 *             "type": "Feature",
 *             "properties": {...},
 *             "geometry": {
 *                 "type": "Polygon",
 *                 "coordinates": [ ... ]
 *             }
 *         },
 *         ...
 *     ]
 * }
 *
 * var collection = new jsonOdm.Collection("geo"),
 *     q = collection.$query().$branch("geometry").$geoIntersects(new jsonOdm.Geo.BoundaryBox([129.049317,-31.434555,139.464356,-19.068644]));
 *     //found geometries
 *     geometries = q.$all();
 * @param {Array|jsonOdm.Geo.BoundaryBox|jsonOdm.Geo.Point|jsonOdm.Geo.MultiPoint|jsonOdm.Geo.LineString|jsonOdm.Geo.MultiLineString|jsonOdm.Geo.Polygon|jsonOdm.Geo.MultiPolygon|jsonOdm.Geo.GeometryCollection} geometry
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$geoIntersects = function (geometry) {
    return this.$testCollection(jsonOdm.Geo.detectAsGeometry(geometry), function (collectionValue, geometry) {
        return jsonOdm.Geo[collectionValue.type] && jsonOdm.Geo[collectionValue.type].intersects && jsonOdm.Geo[collectionValue.type].intersects(collectionValue, geometry);
    });
};

/*-------- Logic ---------*/
/**
 * Compares sub query results using the boolean and
 * @param {...jsonOdm.Query} queries A finite number of operators
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$and = function (queries) {
    // TODO optimize with generators to only query paths that are needed
    return this.$queryOperator(arguments, function (queryResults) {
        for (var i = 0; i < queryResults.length; i++) {
            if (!queryResults[i]) {
                return false;
            }
        }
        return true;
    });
};

/**
 * Compares sub query results using the boolean nand
 * @param {...jsonOdm.Query} queries A finite number of operators
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$nand = function (queries) {
    // TODO optimize with generators to only query paths that are needed
    return this.$queryOperator(arguments, function (queryResults) {
        for (var i = 0; i < queryResults.length; i++) {
            if (!queryResults[i]) {
                return true;
            }
        }
        return false;
    });
};


/**
 * An alisa for $nand
 * @see jsonOdm.Query.$nand
 * @method $not
 * @memberof jsonOdm.Query.prototype
 * @param {...jsonOdm.Query} queries A finite number of operators
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$not = jsonOdm.Query.prototype.$nand;

/**
 * Compares sub query results using the boolean or
 * @param {...jsonOdm.Query} queries A finite number of operators
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$or = function (queries) {
    // TODO optimize with generators to only query paths that are needed
    return this.$queryOperator(arguments, function (queryResults) {
        for (var i = 0; i < queryResults.length; i++) {
            if (queryResults[i]) {
                return true;
            }
        }
        return false;
    });
};

/**
 * Compares sub query results using the boolean nor
 * @param {...jsonOdm.Query} queries A finite number of operators
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$nor = function (queries) {
    // TODO optimize with generators to only query paths that are needed
    return this.$queryOperator(arguments, function (queryResults) {
        for (var i = 0; i < queryResults.length; i++) {
            if (queryResults[i]) {
                return false;
            }
        }
        return true;
    });
};
