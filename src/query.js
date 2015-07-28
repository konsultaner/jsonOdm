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
