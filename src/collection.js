"use strict";

jsonOdm.Collection = function (collectionName) {
    var self = Object.create( Array.prototype );
    self = (Array.apply( self, Array.prototype.slice.call( arguments, 1 ) ) || self);

    if(typeof collectionName != "undefined" && jsonOdm.selectedSource && jsonOdm.selectedSource[collectionName]){
        self = self.concat(jsonOdm.selectedSource[collectionName]);
    }
    jsonOdm.Collection.decorate(self);

    self.$branch = function () {
        var subCollection = jsonOdm.util.branch(self,arguments);
        jsonOdm.Collection.decorate(subCollection);
        return subCollection;
    };

    return self;
};

jsonOdm.Collection.decorate = function (collection) {
    var decorate = function (collection){
        if(jsonOdm.util.isArray(collection)) {
            /** Creates a has many relation to another collection
             *
             * @param {*|String} foreignKeyMapName
             * @param {int|String} privateKeyField
             * @param {*|String} childCollectionName
             * @param {String} [alias] The new field that will carry all connected data. This field must not exist before setting the relation
             */
            collection.$hasMany = function (foreignKeyMapName, privateKeyField, childCollectionName, alias) {
                // SET THE ALIAS
                if (typeof childCollectionName == "string") alias = alias || childCollectionName;
                // FIND THE CHILD COLLECTION
                var childCollection = childCollectionName;
                if (typeof childCollectionName == "string" && jsonOdm.selectedSource && jsonOdm.selectedSource[childCollectionName]){
                    childCollection = jsonOdm.selectedSource[childCollectionName];
                }

                for (var c = 0; c < collection.length; c++) {
                    var foreignKeyMap = foreignKeyMapName;
                    if (collection[c].hasOwnProperty(foreignKeyMapName)) foreignKeyMap = collection[c][foreignKeyMapName];
                    if (typeof collection[c][alias] == "undefined") {
                        for (var i = 0; foreignKeyMap.length && i < foreignKeyMap.length; i++) {
                            var foreignModel = null;
                            for (var j = 0; j < childCollection.length; j++) {
                                if (foreignKeyMap[i] == childCollection[j][privateKeyField]) {
                                    foreignModel = childCollection[j];
                                    break;
                                }
                            }
                            if (foreignModel != null) {
                                if (!collection[c][alias])collection[c][alias] = [];
                                collection[c][alias].push(foreignModel);
                            }
                        }
                    }
                }
            };

            /** Creates a has many relation to another collection
             *
             * @param {String} foreignKey
             * @param {int|String} privateKeyField
             * @param {String} childCollectionName
             * @param {String} alias
             */
            collection.$hasOne = function (foreignKey, privateKeyField, childCollectionName, alias) {
                // SET THE ALIAS
                if (typeof childCollectionName == "string") alias = alias || childCollectionName;
                // FIND THE CHILD COLLECTION
                var childCollection = childCollectionName;
                if (typeof childCollectionName == "string" && jsonOdm.selectedSource && jsonOdm.selectedSource[childCollectionName]){
                    childCollection = jsonOdm.selectedSource[childCollectionName];
                }

                for (var c = 0; c < collection.length; c++) {
                    if (collection[c].hasOwnProperty(foreignKey)) foreignKey = collection[c][foreignKey];
                    if (typeof collection[c][alias] == "undefined") {
                        var foreignModel = null;
                        for (var j = 0; j < childCollection.length; j++) {
                            if (foreignKey == childCollection[j][privateKeyField]) {
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

            /** Creates a query object filled with the right collection data
             *
             * @return {jsonOdm.Query}
             */
            collection.$query = function(){
                return new jsonOdm.Query(collection);
            };
        }
    };

    decorate(collection);
};