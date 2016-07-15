[![Build Status](https://travis-ci.org/konsultaner/jsonOdm.svg?branch=master)](https://travis-ci.org/konsultaner/jsonOdm)
[![Code Climate](https://codeclimate.com/github/konsultaner/jsonOdm/badges/gpa.svg)](https://codeclimate.com/github/konsultaner/jsonOdm)
[![Test Coverage](https://codeclimate.com/github/konsultaner/jsonOdm/badges/coverage.svg)](https://codeclimate.com/github/konsultaner/jsonOdm/coverage)
[![npm](https://img.shields.io/npm/dm/json-odm.svg)](https://www.npmjs.com/package/json-odm)
[![npm](https://img.shields.io/npm/v/json-odm.svg)](https://www.npmjs.com/package/json-odm)
[![npm](https://img.shields.io/npm/l/json-odm.svg)](https://www.npmjs.com/package/json-odm)
[![GitHub stars](https://img.shields.io/github/stars/konsultaner/jsonOdm.svg)](https://github.com/konsultaner/jsonOdm/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/konsultaner/jsonOdm.svg)](https://github.com/konsultaner/jsonOdm/issues)

JSON ODM
========
by [Konsultaner](http://www.konsultaner.de), Richard Burkhardt
-------------

This Project aims to be provide a json object document mapper.  
**Why would I need this?**  
There are many cases where you do not want to have the server query your data. You may also see this mapper as a fancy way to filter your data or prepare a view model.
The original use case was an [ionic](http://ionicframework.com) app that was not interactive so providing a server backend was not needed, but structuring my data
into joinable collections seemed very helpful.

And if you can use a server you may consider our new [WebSocket server project "connectanum"](http://www.connectanum.com) for Publish/Subscribe and RPC communication 
  
If you like the project please support it with a star here on [GitHub](https://github.com/konsultaner/jsonOdm)  
  
If commercial support is needed please [contact me](mailto:burkhardt@konsultaner.de).  

Docs
----
You can find the [documentation here](https://rawgit.com/konsultaner/jsonOdm/master/docs/gen/0.2/index.html) or compiled to the folder [/docs/gen/*](https://github.com/konsultaner/jsonOdm/blob/master/docs/gen/index.html).

Road map
----

- [ ] Implement query methods from [mongo db](http://docs.mongodb.org/manual/reference/operator/query/)
    - [x] Comparison 100%
        - [x] $eq
        - [x] $gt
        - [x] $gte
        - [x] $lt
        - [x] $lte
        - [x] $ne
        - [x] $in
        - [x] $nin
    - [x] Logical 100%
        - [x] $or
        - [x] $and
        - [x] $not(= $nand as alias)
        - [x] $nor
    - [x] Element 100% (+ $isNull, for is null or undefined)
        - [x] $exists
        - [x] $type
    - [x] Evaluation 100%
        - [x] $mod
        - [x] $regex
        - [x] $text
        - [x] $where
    - [x] Geospatial 50% (maybe have a hard and a soft check -> performance)
        - [x] $geoWithin
        - [x] $geoIntersects
        - [ ] $near
        - [ ] $nearSphere
    - [ ] Array 0% i may not implement the first two
        - [ ] $all
        - [ ] $elementMatch
        - [ ] $size
    - [ ] Aggregation
        - [ ] Pipeline 30% ($limit and $skip is implemented as $result(skip,limit))
            - [x] $project
            - [ ] $match
            - [ ] $redact
            - [x] $limit
            - [x] $skip
            - [ ] $unwind
            - [ ] $sort
            - [ ] $geoNear
            - [ ] $out
        - [ ] Grouping 70% ($count is used to count the results)
            - [x] $group
            - [x] $count
            - [x] $sum
            - [x] $avg
            - [ ] $first
            - [ ] $last
            - [x] $min
            - [x] $max
            - [x] $push
            - [ ] $addToSet
        - [ ] Operators 20% ($mod is renamed $modulo, because Evaluation has a $mod)
            - [ ] Boolean
            - [ ] Set
            - [ ] Comparison
            - [x] Arithmetic
            - [x] String
            - [ ] Array
            - [ ] Date
            - [ ] Conditional
            - [ ] Variable
            - [ ] Grouping
- [ ] Support Promise/A+ sources for the odm.addSource
- [ ] Full CRUD support
- [ ] Aggregation

Install from NPM-Package
---------------------

```bash
npm install json-odm
```

Build and run tests, both minified and unminified
-------------------------------------------------

```bash
npm install json-odm
cd npm_modules/json-odm/
npm install
gulp
```

Browser Support
---------------
Unit test ran successfully under Chrome,iOS7+,IE9+,Firefox,Android 4.4.2+  
To be tested: Safari on OSX, IE8(test driver does not run in IE < 9 so it will be hard to test)

Example
------
This is only a basic example. Find a lot more in the [docs](https://rawgit.com/konsultaner/jsonOdm/master/docs/gen/index.html), i.e. how to use [$geoWithin](https://rawgit.com/konsultaner/jsonOdm/master/docs/gen/jsonOdm.Query.html#__geoWithin__anchor)
```html
<!-- add minified version from https://github.com/konsultaner/jsonOdm/tree/master/bin to the html head -->
<script type="text/javascript" src="js/json.odm.min.js"></script>
```

```javascript
// initialize The mapper
var odm = new jsonOdm();
// add a source to the mapper
odm.addSource('people',{
   "Person" : [
       {"id":1,"name":"Richi",jobId:1,hobbyIds:[1,3,4]},
       {"id":2,"name":"Dave",jobId:2,hobbyIds:[2,4]},
       {"id":3,"name":"Tom",jobId:3,hobbyIds:[3,5]},
       {"id":4,"name":"Lisa",jobId:4,hobbyIds:[1,2,3]},
       {"id":5,"name":"Hanni",jobId:3,hobbyIds:[1,5]},
       {"id":6,"name":"Selma",jobId:3,hobbyIds:[1,4]},
       {"id":7,"name":"Ralf",jobId:1,hobbyIds:[4,3]}
   ],
   "Jobs" : [
       {"id":1,"name":"plumber"},
       {"id":2,"name":"programmer"},
       {"id":3,"name":"chef"},
       {"id":4,"name":"hairdresser"}
   ],
   "Hobbies" : [
       {"id":1,"name":"swimming"},
       {"id":2,"name":"cycling"},
       {"id":3,"name":"fishing"},
       {"id":4,"name":"coding"},
       {"id":5,"name":"dancing"}
   ]
});
// instantiate a collection object
var people = new jsonOdm.Collection('Person');
people.$hasOne("jobId","id","Jobs","job");
people.$hasMany("hobbyIds","id","Hobbies","hobbies");

var q = people.query();
// get all hairdresser and plumber
var hairdresser = q.$or(
   q.$branch("jobId").$eq(1)
   q.$branch("jobId").$eq(4)
).$all();

// get all but hairdressers and plumbers
var hairdresser = q.$and(
   q.$branch("jobId").$ne(1)
   q.$branch("jobId").$ne(4)
).$all();

// delete all plumbers
q.$branch("job","name").$eq("plumber").$delete();
```

License
=======
The MIT License (MIT)  
  
Copyright (c) 2015 Richard Burkhardt - Konsultaner GmbH & Co. KG 
  
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  
  
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  
  
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.