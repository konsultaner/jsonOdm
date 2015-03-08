JSON ODM
========

This Project aims to be provide a json object document mapper.

Road map
----

- Implement all comparison and projection methods from [mongo db](http://docs.mongodb.org/manual/reference/operator/query/)
- Support Promise/A+ sources for the odm.addSource
- Full CRUD support
- Aggregation

Example
------
```javascript
// initialize The mapper
var odm = new jsonOdm();
// add a source to the mapper
odm.addSource('people',{
   "Person" : [
       {"id":1,"name":"Richi",jobId:1},
       {"id":2,"name":"Dave",jobId:2},
       {"id":3,"name":"Tom",jobId:3},
       {"id":4,"name":"Lisa",jobId:4},
       {"id":5,"name":"Hanni",jobId:3},
       {"id":6,"name":"Selma",jobId:3},
       {"id":7,"name":"Ralf",jobId:1}
   ],
   "Jobs" : [
       {"id":1,"name":"plumber"},
       {"id":2,"name":"programmer"},
       {"id":3,"name":"chef"},
       {"id":4,"name":"hairdresser"}
   ]
});
// instantiate a collection object
var people = new jsonOdm.Collection('Person');
people.$hasOne("jobId","id","Jobs","job");
var q = people.query();
// get all hairdresser and plumber
var hairdresser = q.$or(
   q.$branch("jobId").$eq(1)
   q.$branch("jobId").$eq(4)
).$all();
// get all but hairdressers and plumbers
var hairdresser = q.$and(
   q.$branch("jobId").$notEq(1)
   q.$branch("jobId").$notEq(4)
).$all();
```