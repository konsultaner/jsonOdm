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