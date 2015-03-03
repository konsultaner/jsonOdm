jsonOdm.Collection = function (collectionName) {
    var self = Object.create( Array.prototype );
    self = (Array.apply( self, Array.prototype.slice.call( arguments, 1 ) ) || self);

    if(jsonOdm.selectedSource && jsonOdm.selectedSource[collectionName]){
        self = self.concat(jsonOdm.selectedSource[collectionName]);
        //jsonOdm.Collection.decorate(self);
    }

    return self;
};

jsonOdm.Collection.decorate = function (json,dataSource) {
    var decorate = function(json,dataSource){
        /** Creates a has many relation to another collection
         *
         * @param {*|String} foreignKeyMapName
         * @param {int|String} privateKeyField
         * @param {*|String} childCollectionName
         * @param {String} alias The new field that will carry all connected data. This field must not exist before setting the relation
         */
        json.$hasMany = function (foreignKeyMapName,privateKeyField,childCollectionName,alias){
            if(typeof childCollectionName == "string") alias = alias || childCollectionName;

            var childCollection = childCollectionName;
            if(typeof childCollectionName == "string" && jsonOdm.dataSources[dataSource] && jsonOdm.dataSources[dataSource].json &&jsonOdm.dataSources[dataSource].json.hasOwnProperty(childCollectionName)) childCollection = jsonOdm.dataSources[dataSource].json[childCollectionName];

            var collectionObject = json;
            if(!(json instanceof Collection || angular.isArray(json))){
                collectionObject = [json];
            }

            for(var c in collectionObject) {
                if(!collectionObject.hasOwnProperty(c) || c[0] == '$')continue;
                var foreignKeyMap = foreignKeyMapName;
                if (collectionObject[c].hasOwnProperty(foreignKeyMapName)) foreignKeyMap = collectionObject[c][foreignKeyMapName];
                if (typeof collectionObject[c][alias] == "undefined") {
                    for (var i = 0; foreignKeyMap.length && i < foreignKeyMap.length; i++) {
                        var foreignModel = null;
                        for (var j = 0; j < childCollection.length; j++) {
                            if (foreignKeyMap[i] == childCollection[j][privateKeyField]) {
                                foreignModel = childCollection[j];
                                break;
                            }
                        }
                        if (foreignModel != null) {
                            if(!collectionObject[c][alias])collectionObject[c][alias] = [];
                            collectionObject[c][alias].push(foreignModel);
                        }
                    }
                }
            }
        };
        json.$hasOne = function(foreignKey,privateKeyField,childCollectionName,alias){
            if(typeof childCollectionName == "string") alias = alias || childCollectionName;

            var childCollection = childCollectionName;
            if(typeof childCollectionName == "string" && jsonOdm.dataSources[dataSource] && jsonOdm.dataSources[dataSource].json &&jsonOdm.dataSources[dataSource].json.hasOwnProperty(childCollectionName)) childCollection = jsonOdm.dataSources[dataSource].json[childCollectionName];

            var collectionObject = json;
            if(!(json instanceof Collection || angular.isArray(json))){
                collectionObject = [json];
            }

            for(var c in collectionObject) {
                if(!collectionObject.hasOwnProperty(c) || c[0] == '$')continue;
                if (collectionObject[c].hasOwnProperty(foreignKey)) foreignKey = collectionObject[c][foreignKey];
                if (typeof collectionObject[c][alias] == "undefined") {
                    var foreignModel = null;
                    for (var j = 0; j < childCollection.length; j++) {
                        if (foreignKey == childCollection[j][privateKeyField]) {
                            foreignModel = childCollection[j];
                            break;
                        }
                    }
                    if (foreignModel != null) {
                        collectionObject[c][alias] = foreignModel;
                    }

                }
            }
        }
    };

    decorate(json,dataSource);
    for(var i in json){
        if(!json.hasOwnProperty(i)) continue;
        if(typeof json[i] == "object" && !angular.isArray(json[i])){
            decorate(json[i],dataSource);
        }
    }
};