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