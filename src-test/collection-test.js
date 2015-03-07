CollectionTest = TestCase("CollectionTest");

var testSource = {
        "testCollection":[
            {name:"Mustermann"},
            {name:"Musterfrau"}
        ],
        "parentCollection":[
            {
                keys:[1,2,3,4],
                childCollection:[
                    {id:1},{id:2},{id:3},
                ]
            }
        ],
        "foreignCollection":[
            {id:1,foreignName:"Mustermann"},
            {id:2,foreignName:"Musterfrau"}
        ],
        "aLot":[]
    };
for(var i = 0; i < 10000; i++){
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
};

CollectionTest.prototype.testSimpleQuery = function () {
    var collection = new jsonOdm.Collection("testCollection");
    assertEquals("Simple Query","Mustermann",collection.$query().$branch("name").$eq("Mustermann").$first().name);
    assertEquals("Simple Query","Musterfrau",collection.$query().$branch("name").$eq("Musterfrau").$all()[0].name);

    collection = new jsonOdm.Collection("aLot");
    assertEquals("Simple Query","Richi400",collection.$query().$branch("name").$eq("Richi199","Richi400").$all()[1].name);
};