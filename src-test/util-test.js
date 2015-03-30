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
}