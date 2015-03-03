CollectionTest = TestCase("CollectionTest");

jsonOdm.addSource("test",{"testCollection":[
    {name:"Mustermann"},
    {name:"Musterfrau"}
]},true);

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