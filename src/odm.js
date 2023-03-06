// @flow

import Aqlite from "./aqlite";

/**
 * The main class holding all subclasses and the data source
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
export default class JsonOdm {
    static sources = {};
    static selectedSource = {};
    /**
     * Add a data source to the odm that is selectable via the selectSource method
     * @param {*} sourceId There is an override check
     * @param {object} source An object with collection arrays
     * @param {boolean} selectSource select the source
     */
    static addSource(sourceId, source, selectSource) {
        if (typeof source == "object") {
            if (typeof JsonOdm.sources[sourceId] === "undefined") {
                JsonOdm.sources[sourceId] = source;
            }
            if (selectSource) {
                JsonOdm.selectedSource = source;
            }
        }
    };

    /**
     * Select a source by its id this will affect all collections
     * @param {*} sourceId
     */
    static selectSource (sourceId) {
        if (typeof JsonOdm.sources[sourceId] !== "undefined") {
            JsonOdm.selectedSource = JsonOdm.sources[sourceId];
        }
    };

    /**
     * A subset AQL {@link https://www.arangodb.com/docs/stable/aql/}
     * @experimental
     * @param query The query to execute
     * @return {Query}
     **/
    static query(query) {
        return Aqlite.parse(query);
    }
}