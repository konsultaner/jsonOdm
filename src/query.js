"use strict";

/**
 * The query object that holds the collection to be queried
 * @param {jsonOdm.Collection} collection
 * @constructor
 */
jsonOdm.Query = function (collection) {
    this.$$commandQueue = [];
    this.$all = function (first) {
        if(this.$$commandQueue.length < 1) return collection;
        var filterCollection = new jsonOdm.Collection();
        for(var i = 0; i < collection.length; i++){
            var validCollection = true;
            for(var j = 0; j < this.$$commandQueue.length; j++){
                if(!(validCollection = validCollection && this.$$commandQueue[j](collection[i]))){
                    break;
                }
            }
            if(validCollection){
                if(first) return collection[i];
                filterCollection.push(collection[i]);
            }
        }
        return filterCollection;
    };
    this.$first = function () {
        return this.$all(true);
    }

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
    this.$$commandQueue.push($branch);
    return this;
};

/**
 * Compares the current sub collection value with the comparable
 * like this $eq('1','2','4') so 1 or 2 or 4 are valid fields
 * @param {...*} comparable Values to compare the current field with
 */
jsonOdm.Query.prototype.$eq = function (comparable) {
    return this.$testCollection(arguments,function (collectionValue, possibleValues) {
        return Array.prototype.indexOf.call(possibleValues,collectionValue) > -1;
    });
};
/**
 * Compares the current sub collection value with the comparable
 * like this $notEq('1','2','4') so 1 or 2 or 4 are not valid fields
 * @param {...*} comparable Values to compare the current field with
 */
jsonOdm.Query.prototype.$notEq = function (comparable) {
    return this.$testCollection(arguments, function (collectionValue, possibleValues) {
        return Array.prototype.indexOf.call(possibleValues,collectionValue) == -1;
    });
};

/**
 * var $q = myCollection.query();
 * $q.$and(
 *    $q.$or(
 *        $q.$branch('children','id').$eq(1,2),
 *        $q.$branch('children').$isNull()
 *    ),
 *    $q.$each('enabled').$eq(1,true)
 * ).$all();
 */