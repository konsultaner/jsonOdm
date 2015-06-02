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
  
If you like the project please support it with a star here on [GitHub](https://github.com/konsultaner/jsonOdm)  
  
If commercial support is needed please [contact me](mailto:burkhardt@konsultaner.de).  

Docs
----
You can find the [documentation here](https://rawgit.com/konsultaner/jsonOdm/master/doc/jsonOdm/0.1/index.html) or compiled to the folder [/doc/jsonOdm/0.1/*](https://github.com/konsultaner/jsonOdm/blob/master/doc/jsonOdm/0.1/index.html). 

Road map
----

- Implement query methods from [mongo db](http://docs.mongodb.org/manual/reference/operator/query/)
    - Comparison (~~$eq~~,~~$gt~~,~~$gte~~,~~$lt~~,~~$lte~~,~~$ne~~,~~$in~~,~~$nin~~) 100%
    - Logical (~~$or~~,~~$and~~,~~$not(= $nand as alias)~~,~~$nor~~) 100%
    - Element (~~$exists~~,~~$type~~) 100% (+ $isNull, for is null or undefined)
    - Evaluation (~~$mod~~,~~$regex~~,~~$text~~,~~$where~~) 100%
    - Geospatial (~~$geoWithin~~,~~$geoIntersects~~,$near,$nearSphere) 50% (maybe have a hard and a soft check -> performance)
    - Array ($all,$elementMatch,$size) 0% // i may not implement the first two
    - Aggregation
        - Pipeline (~~$project~~,$match,$redact,~~$limit~~,~~$skip~~,$unwind,$group,$sort,$geoNear,$out) 30% ($limit and $skip is implemented as $result(skip,limit))
        - Operators (Boolean,Set,Comparison,Arithmetic,~~String~~,Array,Date,Conditional,Variable,Grouping) 10%
- Support Promise/A+ sources for the odm.addSource
- Full CRUD support
- Aggregation

Install from NPM-Package
---------------------

```bash
npm install json-odm
```

Browser Support
---------------
Unit test ran successfully under Chrome,iOS7+,IE9+,Firefox,Android 4.4.2+  
To be tested: Safari on OSX, IE8(test driver does not run in IE < 9 so it will be hard to test)

Example
------
This is only a basic example. Find more in the [docs](https://rawgit.com/konsultaner/jsonOdm/master/doc/jsonOdm/0.1/index.html), i.e. how to use [$geoWithin](https://rawgit.com/konsultaner/jsonOdm/master/doc/jsonOdm/0.1/jsonOdm.Query.html#$geoWithin)
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