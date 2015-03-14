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
        "aLot":[]
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

CollectionTest.prototype.testDelete = function () {
    var collection = new jsonOdm.Collection("aLot");
    collection.$query().$branch("id").$gt(500).$delete();
    assertEquals("Deleted all entries that have id > 500",500,collection.length);
};