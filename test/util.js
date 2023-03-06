import Util from "../src/util";

describe("Utilities", function () {
    describe("is", function () {
        it("Should be a null", function () {
            expect(Util.is(null,"null"));
        });
        it("Should be a string", function () {
            expect(Util.is("","string")).toBe(true);
        });
        it("Should be a object", function () {
            expect(Util.is({},"object")).toBe(true);
        });
        it("Should be a regexp", function () {
            expect(Util.is(/.*/i,"regexp")).toBe(true);
        });
        it("Should be an array", function () {
            expect(Util.is([],"array")).toBe(true);
        });
        it("Should be an object", function () {
            expect(Util.is({},"object")).toBe(true);
        });
        it("Should be a boolean", function () {
            expect(Util.is(true,"boolean")).toBe(true);
        });
        it("Should be a undefined", function () {
            expect(Util.is({}.undefined,"undefined")).toBe(true);
        });
        it("Should be a boolean", function () {
            expect(Util.is(true,["string","boolean"])).toBe(true);
        });
        it("Should be not a boolean", function () {
            expect(Util.is(true,["string","number"])).not.toBe(true);
        });
    });
    describe("Object Keys", function () {
        var myObject = {myKey:"myValue"};
        it("Should have the key", function () {
            expect(Util.objectKeys(myObject)[0]).toBe("myKey");
            expect(Util.objectKeys(myObject).length).toBe(1);
        });
        it("Should have the key even with the polyfill", function () {
            expect(Util.objectKeysPolyfill(myObject)[0]).toBe("myKey");
            expect(Util.objectKeysPolyfill(myObject).length).toBe(1);
        });
        it("Should throw an error for the functions", function () {
            expect(function () {Util.objectKeysPolyfill()}).toThrow(new TypeError('Object.keys called on non-object'));
        });
    });
    describe("Branch", function () {
        var myObject = {myKey:"myValue",myArray:[{myKey:"value"}]};
        it("Should branch" , function () {
            expect(Util.branch(myObject,["myKey"])).toBe("myValue");
            expect(Util.branch(Util.branch(myObject,["myArray",0,"myKey"]))).toBe("value");
            expect(Util.branch(myObject,["myArray",0,"myKey"])).not.toBe("myValue");
        });
    });
    describe("Projection", function () {
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
            projectedObject = Util.projectElement({
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

        it("Should have the key", function () {
            expect(projectedObject.key1).toBe(myObject.key1);
            expect(projectedObject.key4).toBe(myObject.key2);
            expect(projectedObject.key3.key5).toBe(myObject.key3.key5);
            expect(projectedObject.key3.key6.key8).toBe(myObject.key3.key6.key8);
            expect(projectedObject.key3.concat).toBe("value1value4");
            expect(projectedObject.key2).toBeUndefined();
        });
    })
});