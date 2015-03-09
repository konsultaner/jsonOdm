JSON ODM
========

This Project aims to be provide a json object document mapper.
**Why would I need this?**
There are many cases where you do not want to have the server query your data. You may also see this mapper as a fancy way to filter your data or prepare a view model.
The original use case was an [ionic](http://ionicframework.com) app that was not interactive so providing a server backend was not needed, but structuring my data
into joinable collections seemed very helpful.

Road map
----

- Implement all comparison and projection methods from [mongo db](http://docs.mongodb.org/manual/reference/operator/query/)
- Support Promise/A+ sources for the odm.addSource
- Full CRUD support CRD is done so far
- Aggregation

Required NPM-Packages
---------------------

To build it from source use command ```gulp``` and after adding:
```bash
npm install --save-dev gulp
npm install --save-dev gulp-concat
npm install --save-dev gulp-filesize
npm install --save-dev gulp-jsdoc
npm install --save-dev gulp-uglify
npm install --save-dev jsdoc3-bootstrap
```

To execute the benchmark use command ```gulp bench``` after adding:
```bash
npm install --save-dev gulp-bench
```

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