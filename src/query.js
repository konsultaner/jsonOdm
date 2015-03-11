"use strict";

/**
 * The query object that holds the collection to be queried
 * @param {jsonOdm.Collection} collection
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
    this.$$collection = collection;
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
    if(this.$$commandQueue.length < 1) return this;
    for(var i = 0; i < this.$$collection.length;){
        var validCollection = true;
        for(var j = 0; j < this.$$commandQueue.length; j++){
            if(!(validCollection = validCollection && this.$$commandQueue[j](this.$$collection[i]))){
                break;
            }
        }
        if(validCollection){
            this.$$collection.splice(i,1);
        }else{
            i++
        }
    }
    return this;
};

/**
 * Returns a collection containing all matching elements
 * @param {boolean} [first] only return the first element, used by jsonOdm.Query.prototype.$first
 * @example
 * var collection = new jsonOdm.Collection("myCollection");
 * collection.$query()
 *    .$branch("id").$eq(2,9)
 *    .$all();
 * @return {jsonOdm.Collection}
 */
jsonOdm.Query.prototype.$all = function (first) {
    if(this.$$commandQueue.length < 1) return this.$$collection;
    var filterCollection = new jsonOdm.Collection();
    for(var i = 0; i < this.$$collection.length; i++){
        var validCollection = true;
        for(var j = 0; j < this.$$commandQueue.length; j++){
            if(!(validCollection = validCollection && this.$$commandQueue[j](this.$$collection[i]))){
                break;
            }
        }
        if(validCollection){
            if(first) return this.$$collection[i];
            filterCollection.push(this.$$collection[i]);
        }
    }
    return filterCollection;
};

/**
 * Short hand version for $all(true)
 * @return {jsonOdm.Collection}
 */
jsonOdm.Query.prototype.$first = function () {
    return this.$all(true);
};

/**
 * Test a collection or colection field against one or more values
 * @param {Array} comparables An array of values to test again
 * @param {function} collectionTest the test function to evaluate the values
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$testCollection = function (comparables,collectionTest) {
    var lastCommand = this.$$commandQueue.pop();
    var $testCollection = (function () {
        return function (collection) {
            if(!((lastCommand instanceof jsonOdm.Collection || typeof lastCommand == "function") && typeof collectionTest == "function")) return false;
            var collectionValue = lastCommand instanceof jsonOdm.Collection?lastCommand:lastCommand(collection);
            return collectionTest(collectionValue,comparables);
        }
    })();
    this.$$commandQueue.push($testCollection);
    return this;
};

/**
 * Test a collection or colection field against one or more values
 * @param {jsonOdm.Query[]} queries A finite number of operators
 * @param {function} operator the test function to evaluate the values
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$binaryOperator = function (queries,operator) {
    var $testCollection = (function (queries,oprator) {
        return function (collection) {
            if(typeof oprator != "function") return false;
            var commandResults = [];
            for(var i = 0; i < queries.length; i++){
                for(var j = 0; j < queries[i].$$commandQueue.length; j++){
                    commandResults.push(queries[i].$$commandQueue[j](collection));
                }
            }
            return operator(commandResults);
        }
    })(queries,operator);
    var subQuery = new jsonOdm.Query(this.$$collection);
    subQuery.$$commandQueue.push($testCollection);
    return subQuery;
};

/** Go down the property tree of the collection
 * @param {...String} node A variable amount of nodes to traverse down the document tree
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$branch = function (node) {
    var $branch = (function(nodes){
        /**
         * @param {*} The collection to go down
         * @return {Query|boolean} The query object with the sub collection or false if querying was impossible
         */
        return function(collection){
            return jsonOdm.util.branch(collection,nodes);
        };
    })(arguments);
    var subQuery = new jsonOdm.Query(this.$$collection);
    subQuery.$$commandQueue.push($branch);
    return subQuery;
};

/**
 * Compares the current sub collection value with the comparable
 * like this $eq('1','2','4') so 1 or 2 or 4 are valid fields
 * @param {...*} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$eq = function (comparable) {
    return this.$testCollection(arguments,function (collectionValue, possibleValues) {
        return Array.prototype.indexOf.call(possibleValues,collectionValue) > -1;
    });
};


/**
 * Compares the current sub collection value with the comparable
 * like this $in(['1','2','4']) so 1 or 2 or 4 are valid fields
 * @param {Array} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$in = function (comparable) {
    return this.$testCollection(comparable,function (collectionValue, possibleValues) {
        return Array.prototype.indexOf.call(possibleValues,collectionValue) > -1;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $ne('1','2','4') so 1 or 2 or 4 are not valid fields
 * @param {...*} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$ne = function (comparable) {
    return this.$testCollection(arguments, function (collectionValue, possibleValues) {
        return Array.prototype.indexOf.call(possibleValues,collectionValue) == -1;
    });
};

/**
 * Compares the current sub collection value with the comparable
 * like this $nin(['1','2','4']) so 1 or 2 or 4 are not valid fields
 * @param {Array} comparable Values to compare the current field with
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$nin = function (comparable) {
    return this.$testCollection(comparable, function (collectionValue, possibleValues) {
        return Array.prototype.indexOf.call(possibleValues,collectionValue) == -1;
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
 * like this $isNull() field value is null or undefined
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$isNull = function () {
    return this.$testCollection(null, function (collectionValue) {
        return typeof collectionValue == 'undefined' || collectionValue === null;
    });
};

/**
 * Compairs result queries with the booleand and
 * @param {...jsonOdm.Query} queries A finite number of operators
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$and = function (queries) {
    // TODO optimize with generators to only query paths that are needed
    return this.$binaryOperator(arguments, function (queryResults) {
        for(var i = 0; i < queryResults.length; i++){
            if(!queryResults[i]) return false;
        }
        return true;
    });
};

/**
 * Compairs result queries with the boolean or
 * @param {...jsonOdm.Query} queries A finite number of operators
 * @return {jsonOdm.Query}
 */
jsonOdm.Query.prototype.$or = function (queries) {
    // TODO optimize with generators to only query paths that are needed
    return this.$binaryOperator(arguments, function (queryResults) {
        for(var i = 0; i < queryResults.length; i++){
            if(queryResults[i]) return true;
        }
        return false;
    });
};