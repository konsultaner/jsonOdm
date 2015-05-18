"use strict";

var UtilTest = TestCase("UtilTest");

UtilTest.prototype.testIsArray = function () {
    assertTrue("Should be an array",jsonOdm.util.isArray([]));
    assertFalse("Should not be an array",jsonOdm.util.isArray("a"));
    assertFalse("Should not be an array",jsonOdm.util.isArray(1));
    assertFalse("Should not be an array",jsonOdm.util.isArray({}));
    assertFalse("Should not be an array",jsonOdm.util.isArray(true));
    assertFalse("Should not be an array",jsonOdm.util.isArray(false));
};

UtilTest.prototype.testIs = function () {
    assertTrue("Should be a null",jsonOdm.util.is(null,"null"));
    assertTrue("Should be a string",jsonOdm.util.is("","string"));
    assertTrue("Should be a object",jsonOdm.util.is({},"object"));
    assertTrue("Should be a regexp",jsonOdm.util.is(/.*/i,"regexp"));
    assertTrue("Should be an array",jsonOdm.util.is([],"array"));
    assertTrue("Should be an object",jsonOdm.util.is({},"object"));
    assertTrue("Should be a boolean" ,jsonOdm.util.is(true,"boolean"));
    assertTrue("Should be a undefined",jsonOdm.util.is({}.undefined,"undefined"));
    if(window.ArrayBuffer){ // only test it if it is supported
        assertTrue("Should be a arraybuffer",jsonOdm.util.is(new ArrayBuffer(12),"arraybuffer"));
    }

    assertTrue("Should be a boolean" ,jsonOdm.util.is(true,["string","boolean"]));
    assertFalse("Should be a boolean" ,jsonOdm.util.is(true,["string","number"]));
};

UtilTest.prototype.testObjectKeys = function () {
    var myObject = {myKey:"myValue"};
    assertEquals("Should have the key","myKey",jsonOdm.util.objectKeys(myObject)[0]);
    assertEquals("Should have the key",1,jsonOdm.util.objectKeys(myObject).length);
};

UtilTest.prototype.testBranch = function () {
    var myObject = {myKey:"myValue",myArray:[{myKey:"value"}]};
    assertEquals("Simple Branching","myValue",jsonOdm.util.branch(myObject,["myKey"]));
    assertEquals("Deep Branching","value",jsonOdm.util.branch(myObject,["myArray",0,"myKey"]));
    assertFalse("Deep Branching","myValue" == jsonOdm.util.branch(myObject,["myArray",0,"myKey"]));
};

UtilTest.prototype.testProjection = function () {
    var myObject = {
            key1:"value1",
            key2:"value2",
            key3:{
                key4:"value4",
                key5:"value5",
                key6:{
                    key7:"value7",
                    key8:"value8"
                }
            }
        },
        projectedObject = jsonOdm.util.projectElement({
            key1:1,
            key4: function (element) {
                return element.key2;
            },
            key3 : {
                key5:1,
                concat:function (element){
                    return element.key1 + element.key3.key4;
                },
                key6:{
                    key8:1
                }
            }
        },myObject);
    assertEquals("Key1 should exist",myObject.key1,projectedObject.key1);
    assertEquals("Key4 should equal key2",myObject.key2,projectedObject.key4);
    assertEquals("Key5 should exist",myObject.key3.key5,projectedObject.key3.key5);
    assertEquals("Key8 should exist",myObject.key3.key6.key8,projectedObject.key3.key6.key8);
    assertEquals("Key concat should exist","value1value4",projectedObject.key3.concat);
    assertUndefined("Key2 should not exist",projectedObject.key2);
};