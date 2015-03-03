CollectionTest = TestCase("CollectionTest");

jsonOdm.addSource("test",{"testCollection":[
    {name:"Mustermann"},
    {name:"Musterfrau"}
]},true);

CollectionTest.prototype.testArrayInheritance = function () {
    var collection = new jsonOdm.Collection("testCollection");
    assertEquals("LengthTest",2,collection.length);
};