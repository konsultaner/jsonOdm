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

UtilTest.prototype.testObjectKeys = function () {
    var myObject = {myKey:"myValue"};
    assertEquals("Should have the key","myKey",jsonOdm.util.objectKeys(myObject)[0]);
    assertEquals("Should have the key",1,jsonOdm.util.objectKeys(myObject).length);
};