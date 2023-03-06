// @flow

import JsonOdm from "./odm";
import Query from "./query";
import Util from "./util";

/**
 * The Collection class holding the date from the selected data source
 * @param {String} [collectionName] The name of the selected collection. Leave empty if you want an empty collection but with all methods
 * @return {Collection} An array object with some extra methods added to it
 * @augments Array
 * @constructor
 */
export default class Collection extends Array {
    constructor(dataOrName) {
        super();
        if (Array.isArray(dataOrName)) {
            this.push.apply(this,dataOrName);
        } else if (typeof dataOrName !== "undefined" && JsonOdm.selectedSource[dataOrName]) {
            this.push.apply(this,JsonOdm.selectedSource[dataOrName]);
        }
    }

    $branch() {
        return new Collection(Util.branch(this, arguments));
    }

    /**
     * // TODO needs a proper has many functionality that automatically gathers the child elements
     * Creates a has many relation to another collection
     * @param {Array|String} foreignKeyMapName The name of the field that holds an array of foreign keys
     * @param {int|String} privateKeyField The private key of the foreign collection objects
     * @param {jsonOdm.Collection|String} childCollectionName The child collection that belongs to the foreign keys
     * @param {String} [alias] The new field that will carry all connected data. This field must not exist before setting the relation
     * @memberof jsonOdm.Collection.prototype
     * @method $hasMany
     */
    $hasMany(foreignKeyMapName, privateKeyField, childCollectionName, alias) {
        // SET THE ALIAS
        if (typeof childCollectionName === "string") alias = alias || childCollectionName;
        // FIND THE CHILD COLLECTION
        let childCollection = childCollectionName;
        if (typeof childCollectionName === "string" && JsonOdm.selectedSource && JsonOdm.selectedSource[childCollectionName]) {
            childCollection = JsonOdm.selectedSource[childCollectionName];
        }

        for (let c = 0; c < this.length; c++) {
            let foreignKeyMap = foreignKeyMapName;
            if (this[c].hasOwnProperty(foreignKeyMapName)) {
                foreignKeyMap = this[c][foreignKeyMapName];
            }
            if (typeof this[c][alias] === "undefined") {
                for (let i = 0; foreignKeyMap.length && i < foreignKeyMap.length; i++) {
                    let foreignModel = null;
                    for (let j = 0; j < childCollection.length; j++) {
                        if (foreignKeyMap[i] === childCollection[j][privateKeyField]) {
                            foreignModel = childCollection[j];
                            break;
                        }
                    }
                    if (foreignModel != null) {
                        if (!this[c][alias]) {
                            this[c][alias] = [];
                        }
                        this[c][alias].push(foreignModel);
                    }
                }
            }
        }
    }

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
    $hasOne(foreignKey, privateKeyField, childCollectionName, alias) {
        // SET THE ALIAS
        if (typeof childCollectionName === "string") alias = alias || childCollectionName;
        // FIND THE CHILD COLLECTION
        let childCollection = childCollectionName;
        if (typeof childCollectionName === "string" && JsonOdm.selectedSource && JsonOdm.selectedSource[childCollectionName]) {
            childCollection = JsonOdm.selectedSource[childCollectionName];
        }

        for (let c = 0; c < this.length; c++) {
            let foreignKeyValue;
            if (this[c].hasOwnProperty(foreignKey)) {
                foreignKeyValue = this[c][foreignKey];
            }
            if (typeof this[c][alias] === "undefined") {
                let foreignModel = null;
                for (let j = 0; j < childCollection.length; j++) {
                    if (foreignKeyValue === childCollection[j][privateKeyField]) {
                        foreignModel = childCollection[j];
                        break;
                    }
                }
                if (foreignModel != null) {
                    this[c][alias] = foreignModel;
                }
            }
        }
    }

    /**
     * Creates a query object filled with the right collection data
     * @return {Query} A new query object
     */
    $query() {
        return new Query(this);
    };
}