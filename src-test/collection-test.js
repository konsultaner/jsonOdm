"use strict";

var CollectionTest = TestCase("CollectionTest");

var testSource = {
        "testCollection":[
            {id:1,name:"Mustermann",firstName:"Tom",married:true},
            {id:2,name:"Musterfrau",firstName:null,married:false}
        ],
        "parentCollection":[
            {
                onOfALotId:300,
                keys:[1,2,3,4],
                childCollection:[
                    {id:1},{id:2},{id:3}
                ]
            }
        ],
        "foreignCollection":[
            {id:1,foreignName:"Mustermann"},
            {id:2,foreignName:"Musterfrau"}
        ],
        "goldenRuleCollection":[
            {id:1,lang:'en',cite:"One should treat others as one would like others to treat oneself."},
            {id:2,lang:'da',cite:"Du skal elske din næste som dig selv!"},
            {id:3,lang:'eo',cite:"Kiel vi volas, ke la homoj faru al vi, faru ankaŭ al ili tiel same."},
            {id:4,lang:'de',cite:"Behandle andere so, wie du von ihnen behandelt werden willst."},
            {id:5,lang:'pl',cite:"Rób innym to, co byś chciał, żeby tobie robili."},
            {id:6,lang:'en',cite:"One should not treat others in ways that one would not like to be treated."}
        ],
        "aLot":[],
        "geo":[
            // google example https://storage.googleapis.com/maps-devrel/google.json
            {
            "type": "Feature",
            "properties": {
                "letter": "G",
                "color": "blue",
                "rank": "7",
                "ascii": "71"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [123.61, -22.14], [122.38, -21.73], [121.06, -21.69], [119.66, -22.22], [119.00, -23.40],
                        [118.65, -24.76], [118.43, -26.07], [118.78, -27.56], [119.22, -28.57], [120.23, -29.49],
                        [121.77, -29.87], [123.57, -29.64], [124.45, -29.03], [124.71, -27.95], [124.80, -26.70],
                        [124.80, -25.60], [123.61, -25.64], [122.56, -25.64], [121.72, -25.72], [121.81, -26.62],
                        [121.86, -26.98], [122.60, -26.90], [123.57, -27.05], [123.57, -27.68], [123.35, -28.18],
                        [122.51, -28.38], [121.77, -28.26], [121.02, -27.91], [120.49, -27.21], [120.14, -26.50],
                        [120.10, -25.64], [120.27, -24.52], [120.67, -23.68], [121.72, -23.32], [122.43, -23.48],
                        [123.04, -24.04], [124.54, -24.28], [124.58, -23.20], [123.61, -22.14]
                    ]
                ]
            }
        },
            {
                "type": "Feature",
                "properties": {
                    "letter": "o",
                    "color": "red",
                    "rank": "15",
                    "ascii": "111"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [128.84, -25.76], [128.18, -25.60], [127.96, -25.52], [127.88, -25.52], [127.70, -25.60],
                            [127.26, -25.79], [126.60, -26.11], [126.16, -26.78], [126.12, -27.68], [126.21, -28.42],
                            [126.69, -29.49], [127.74, -29.80], [128.80, -29.72], [129.41, -29.03], [129.72, -27.95],
                            [129.68, -27.21], [129.33, -26.23], [128.84, -25.76]
                        ],
                        [
                            [128.45, -27.44], [128.32, -26.94], [127.70, -26.82], [127.35, -27.05], [127.17, -27.80],
                            [127.57, -28.22], [128.10, -28.42], [128.49, -27.80], [128.45, -27.44]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "o",
                    "color": "yellow",
                    "rank": "15",
                    "ascii": "111"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [131.87, -25.76], [131.35, -26.07], [130.95, -26.78], [130.82, -27.64], [130.86, -28.53],
                            [131.26, -29.22], [131.92, -29.76], [132.45, -29.87], [133.06, -29.76], [133.72, -29.34],
                            [134.07, -28.80], [134.20, -27.91], [134.07, -27.21], [133.81, -26.31], [133.37, -25.83],
                            [132.71, -25.64], [131.87, -25.76]
                        ],
                        [
                            [133.15, -27.17], [132.71, -26.86], [132.09, -26.90], [131.74, -27.56], [131.79, -28.26],
                            [132.36, -28.45], [132.93, -28.34], [133.15, -27.76], [133.15, -27.17]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "g",
                    "color": "blue",
                    "rank": "7",
                    "ascii": "103"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [138.12, -25.04], [136.84, -25.16], [135.96, -25.36], [135.26, -25.99], [135, -26.90],
                            [135.04, -27.91], [135.26, -28.88], [136.05, -29.45], [137.02, -29.49], [137.81, -29.49],
                            [137.94, -29.99], [137.90, -31.20], [137.85, -32.24], [136.88, -32.69], [136.45, -32.36],
                            [136.27, -31.80], [134.95, -31.84], [135.17, -32.99], [135.52, -33.43], [136.14, -33.76],
                            [137.06, -33.83], [138.12, -33.65], [138.86, -33.21], [139.30, -32.28], [139.30, -31.24],
                            [139.30, -30.14], [139.21, -28.96], [139.17, -28.22], [139.08, -27.41], [139.08, -26.47],
                            [138.99, -25.40], [138.73, -25.00 ], [138.12, -25.04]
                        ],
                        [
                            [137.50, -26.54], [136.97, -26.47], [136.49, -26.58], [136.31, -27.13], [136.31, -27.72],
                            [136.58, -27.99], [137.50, -28.03], [137.68, -27.68], [137.59, -26.78], [137.50, -26.54]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "l",
                    "color": "green",
                    "rank": "12",
                    "ascii": "108"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [140.14,-21.04], [140.31,-29.42], [141.67,-29.49], [141.59,-20.92], [140.14,-21.04]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "e",
                    "color": "red",
                    "rank": "5",
                    "ascii": "101"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [144.14, -27.41], [145.67, -27.52], [146.86, -27.09], [146.82, -25.64], [146.25, -25.04],
                            [145.45, -24.68], [144.66, -24.60], [144.09, -24.76], [143.43, -25.08], [142.99, -25.40],
                            [142.64, -26.03], [142.64, -27.05], [142.64, -28.26], [143.30, -29.11], [144.18, -29.57],
                            [145.41, -29.64], [146.46, -29.19], [146.64, -28.72], [146.82, -28.14], [144.84, -28.42],
                            [144.31, -28.26], [144.14, -27.41]
                        ],
                        [
                            [144.18, -26.39], [144.53, -26.58], [145.19, -26.62], [145.72, -26.35], [145.81, -25.91],
                            [145.41, -25.68], [144.97, -25.68], [144.49, -25.64], [144, -25.99], [144.18, -26.39]
                        ]
                    ]
                }
            }
        ]
    };
for(var i = 1; i < 10000; i++){
    testSource.aLot.push({
        id:i,name:'Richi'+i
    })
}
jsonOdm.addSource("test",testSource,true);

CollectionTest.prototype.testArrayInheritance = function () {
    var collection = new jsonOdm.Collection("testCollection");
    assertEquals("LengthTest1",2,collection.length);
    collection[0] = {name:"Mustermann-1"};
    collection[1] = {name:"Mustermann-2"};
    collection[2] = {name:"Mustermann-3"};
    collection.push({name:"Mustermann-4"});
    assertEquals("LengthTest2",4,collection.length);
    assertEquals("ContentTest","Mustermann-2",collection[1].name);
};

CollectionTest.prototype.testCollectionDecoration = function () {
   var collection = new jsonOdm.Collection("parentCollection");
    assertNotUndefined("Should be decorated",collection.$hasMany);
    assertFunction("Should be a function",collection.$hasMany);
    assertFunction("Should be a function",collection.$branch(0,'childCollection').$hasMany);

    collection.$hasMany("keys","id","foreignCollection","foreignKeys");
    collection.$hasOne("onOfALotId","id","aLot","onOfALot");
    assertEquals("Should have collection extended",2,collection[0].foreignKeys.length);
    assertEquals("Should have collection extended",collection[0].onOfALotId,collection[0].onOfALot.id);
};

CollectionTest.prototype.testQuery = function () {
    var collection = new jsonOdm.Collection("testCollection");
    assertEquals("test the equality","Mustermann",collection.$query().$branch("name").$eq("Mustermann").$first().name);
    assertEquals("No Result",0, collection.$query().$branch("name").$eq("Jack").$all().length);
    assertEquals("test the not equality","Mustermann",collection.$query().$branch("name").$ne("Musterfrau").$first().name);
    assertEquals("test the multiple not equality",0,collection.$query().$branch("name").$nin(["Musterfrau","Mustermann"]).$all().length);
    assertEquals("test the multiple not equality","Mustermann",collection.$query().$branch("name").$nin(["Musterfrau"]).$first().name);
    assertEquals("test greater then","Musterfrau",collection.$query().$branch("id").$gt(1).$all()[0].name);
    assertEquals("test greater then or equal",2,collection.$query().$branch("id").$gte(1).$all().length);
    assertEquals("test less then","Mustermann",collection.$query().$branch("id").$lte(2).$first().name);
    assertEquals("test less then or equal",2,collection.$query().$branch("id").$lte(2).$all().length);
    assertEquals("$isNull test against null",1,collection.$query().$branch("firstName").$isNull().$all().length);
    assertEquals("$isNull test against an undefined field",2,collection.$query().$branch("middleName").$isNull().$all().length);
    assertEquals("$exists test should be 0",0,collection.$query().$branch("middleName").$exists().$all().length);
    assertEquals("$exists test should be 2",2,collection.$query().$branch("firstName").$exists().$all().length);
    assertEquals("$type test should be 2",2,collection.$query().$branch("firstName").$type("string","null").$all().length);
    assertEquals("$type test should be 1",1,collection.$query().$branch("firstName").$type("string").$all().length);
    assertEquals("$type test should be 2",2,collection.$query().$branch("middleName").$type("undefined").$all().length);
    assertEquals("$type test should be 0",0,collection.$query().$branch("firstName").$type("undefined").$all().length);

    collection = new jsonOdm.Collection("aLot");
    assertEquals("$lt: Less then test",400,collection.$query().$branch("id").$lt(401).$all().length);
    assertEquals("$eq: Test multiple quality","Richi400",collection.$query().$branch("name").$eq("Richi199","Richi400").$all()[1].name);
    assertEquals("$in: Test multiple quality","Richi400",collection.$query().$branch("name").$in(["Richi199","Richi400"]).$all()[1].name);
    assertEquals("$mod test should be a fourth of original length",Math.floor(collection.length/4),collection.$query().$branch("id").$mod(4,0).$all().length);
    assertEquals("$mod test first id should be 4",4,collection.$query().$branch("id").$mod(4,0).$first().id);
    assertEquals("$regex test should find 99 elements",99,collection.$query().$branch("name").$regex("^richi[0-9]{1,2}$","i").$all().length);
    assertEquals("$regex test should find 99 elements",99,collection.$query().$branch("name").$regex(/^richi[0-9]{1,2}$/i).$all().length);
    assertEquals("$regex test should find 0 elements",0,collection.$query().$branch("name").$regex("^richi[0-9]{1,2}$").$all().length);
    assertEquals("$regex test should find 0 elements",0,collection.$query().$branch("name").$regex(/^richi[0-9]{1,2}$/).$all().length);

    var q = collection.$query();
    var subCollection = q.$or(
        q.$branch("name").$eq("Richi400"),
        q.$branch("name").$eq("Richi199")
    ).$all();
    assertEquals("Should have 2 sub entries",2,subCollection.length);
    assertEquals("The first one should be Richi199",199,subCollection[0].id);
    assertEquals("The second one should be Richi400",400,subCollection[1].id);

    subCollection = q.$and(
        q.$branch("name").$eq("Richi401"),
        q.$branch("id").$eq(401)
    ).$all();
    assertEquals("Should have 1 entry",1,subCollection.length);
    assertEquals("The first one should be Richi401",401,subCollection[0].id);

    subCollection = q.$nand(
        q.$branch("id").$eq(401),
        q.$branch("name").$eq("Richi401")
    ).$all();
    assertEquals("$nand: Should have 1 entry",collection.length-1,subCollection.length);
    assertEquals("$nand: sub collection should not have Richi401",0,subCollection.$query().$branch("id").$eq(401).$all().length);

    subCollection = q.$nor(
        q.$branch("id").$gt(600),
        q.$branch("id").$lt(400),
        q.$branch("id").$eq(500)
    ).$all();
    assertEquals("$nor: Test logical nor",200,subCollection.length);
    assertEquals("$nor: The first one should be Richi400",400,subCollection[0].id);
    assertEquals("$nor: The 100 should be Richi 501",501,subCollection[100].id);
    assertEquals("$nor: The 99 should be Richi 499",499,subCollection[99].id);

    subCollection = q.$or(
        q.$and(
            q.$branch("name").$eq("Richi401"),
            q.$branch("id").$eq(401)
        ),
        q.$and(
            q.$branch("name").$eq("Richi1002"),
            q.$branch("id").$eq(1002)
        )
    ).$all();
    assertEquals("Should have 2 sub entries",2,subCollection.length);
    assertEquals("The first one should be Richi401",401,subCollection[0].id);
    assertEquals("The second one should be Richi1002",1002,subCollection[1].id);
};

CollectionTest.prototype.testStringModification = function () {
    var collection = new jsonOdm.Collection("goldenRuleCollection");
    var firstCite = collection.$query().$first();
    assertEquals("Should substring the result",firstCite.id,collection.$query().$branch("cite").$substr(3,12).$eq(firstCite.cite.substr(3,12)).$first().id);
    assertEquals("Should double substring the result",firstCite.id,collection.$query().$branch("cite").$substr(3,12).$substr(0,2).$eq(firstCite.cite.substr(3,12).substr(0,2)).$first().id);
};

CollectionTest.prototype.testTextSearch = function() {
    var collection = new jsonOdm.Collection("goldenRuleCollection");
    assertEquals("Should find both english rules",2,collection.$query().$branch("cite").$text("One treat").$all().length);
    assertEquals("Should find only first english rule",1,collection.$query().$branch("cite").$text("One treat -not").$all().length);
    assertEquals("Should find only first english rule",1,collection.$query().$branch("cite").$text("\"One should treat\"").$all().length);
    assertEquals("Should find two 'da' and 'pl'",2,collection.$query().$branch("cite").$text("næste Rób").$all().length);
    assertEquals("Should find only 'da' and first 'en'",2,collection.$query().$branch("cite").$text("to -treated").$all().length);
    assertEquals("Should find both english rules",2,collection.$query().$branch("cite").$text("trea").$all().length);
    assertEquals("Should find only english rules",2,collection.$query().$branch("cite").$text("\"trea\" innym").$all().length);
    assertEquals("Should find first english rules",1,collection.$query().$branch("cite").$text("\"trea\" -treated").$all().length);
};

CollectionTest.prototype.testWhereSearch = function () {
    var collection = new jsonOdm.Collection("goldenRuleCollection");
    assertEquals("Should find all english rules",2,collection.$query().$where("return this.lang == 'en'").$all().length)
    assertEquals("Should find first english rules",1,collection.$query().$where("return this.lang == 'en'").$first().id)
    assertEquals("Should find all english rules",2,collection.$query().$where(function(){return this.lang == 'en';}).$all().length)
    assertEquals("Should find first english rules",1,collection.$query().$where(function(){return this.lang == 'en';}).$first().id)
    assertEquals("Should find all english rules",2,collection.$query().$branch("lang").$where(function(){return this == 'en';}).$all().length)
};

CollectionTest.prototype.testDelete = function () {
    var collection = new jsonOdm.Collection("aLot");
    collection.$query().$branch("id").$gt(500).$delete();
    assertEquals("Deleted all entries that have id > 500",500,collection.length);
};

CollectionTest.prototype.testGeoWithin = function () {
    var collection = new jsonOdm.Collection("geo"),
        q = collection.$query().$branch("geometry").$geoWithin(new jsonOdm.Geo.BoundaryBox([129.049317,-31.434555,139.464356,-19.068644]));
    assertEquals("Should find the 2nd O in Google",1, q.$all().length);

    q = collection.$query().$branch("geometry").$geoWithin(new jsonOdm.Geo.BoundaryBox([129.049317,-35.434555,140.870606,-19.068644]));
    assertEquals("Should find the 2nd O and G in Google",2, q.$all().length);
};

CollectionTest.prototype.testGeoIntersects = function () {
    var collection = new jsonOdm.Collection("geo"),
        q = collection.$query().$branch("geometry").$geoIntersects(new jsonOdm.Geo.BoundaryBox([129.049317,-31.434555,139.464356,-19.068644]));
    assertEquals("Should find the Goo in Google",3, q.$all().length);

    q = collection.$query().$branch("geometry").$geoIntersects(new jsonOdm.Geo.BoundaryBox([129.049317,-35.434555,140.870606,-19.068644]));
    assertEquals("Should find the Goog in Google",4, q.$all().length);
};