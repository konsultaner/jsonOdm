jsonOdm.Collection = function (collectionName) {
    var self = Object.create( Array.prototype );
    self = (Array.apply( self, Array.prototype.slice.call( arguments, 1 ) ) || self);

    if(jsonOdm.selectedSource && jsonOdm.selectedSource[collectionName]){
        self = self.concat(jsonOdm.selectedSource[collectionName]);
        jsonOdm.Collection.decorate(self);
    }

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
             * @param {String} alias The new field that will carry all connected data. This field must not exist before setting the relation
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

            for(var i = 0; i < collection.length; i++){
                var keys = jsonOdm.util.objectKeys(collection[i]);
                for(var j = 0; j < keys.length; j++){
                    if(typeof collection[i][keys[j]].$hasMany == "undefined"){
                        decorate(collection[i][keys[j]]);
                    }
                }
            }
        }
    };

    decorate(collection);
};