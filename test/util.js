describe("Utilities", function () {
    describe("isArray", function () {
        it("should be an array", function () {
            expect(jsonOdm.util.isArray([])).toBe(true);
        });

        it("Should not be an array", function () {
            expect(jsonOdm.util.isArray("a")).not.toBe(true);
            expect(jsonOdm.util.isArray(1)).not.toBe(true);
            expect(jsonOdm.util.isArray({})).not.toBe(true);
            expect(jsonOdm.util.isArray(true)).not.toBe(true);
            expect(jsonOdm.util.isArray(false)).not.toBe(true);
        });
    });
    describe("is", function () {
        it("Should be a null", function () {
            expect(jsonOdm.util.is(null,"null"));
        });
        it("Should be a string", function () {
            expect(jsonOdm.util.is("","string")).toBe(true);
        });
        it("Should be a object", function () {
            expect(jsonOdm.util.is({},"object")).toBe(true);
        });
        it("Should be a regexp", function () {
            expect(jsonOdm.util.is(/.*/i,"regexp")).toBe(true);
        });
        it("Should be an array", function () {
            expect(jsonOdm.util.is([],"array")).toBe(true);
        });
        it("Should be an object", function () {
            expect(jsonOdm.util.is({},"object")).toBe(true);
        });
        it("Should be a boolean", function () {
            expect(jsonOdm.util.is(true,"boolean")).toBe(true);
        });
        it("Should be a undefined", function () {
            expect(jsonOdm.util.is({}.undefined,"undefined")).toBe(true);
        });
        if(window.ArrayBuffer){ // only test it if it is supported
            it("Should be a arraybuffer", function () {
                expect(jsonOdm.util.is(new ArrayBuffer(12),"arraybuffer")).toBe(true);
            });
        }
        it("Should be a boolean", function () {
            expect(jsonOdm.util.is(true,["string","boolean"])).toBe(true);
        });
        it("Should be not a boolean", function () {
            expect(jsonOdm.util.is(true,["string","number"])).not.toBe(true);
        });
    });
    describe("Object Keys", function () {
        var myObject = {myKey:"myValue"};
        it("Should have the key", function () {
            expect(jsonOdm.util.objectKeys(myObject)[0]).toBe("myKey");
            expect(jsonOdm.util.objectKeys(myObject).length).toBe(1);
        });
        it("Should have the key even with the polyfill", function () {
            expect(jsonOdm.util.objectKeysPolyfill(myObject)[0]).toBe("myKey");
            expect(jsonOdm.util.objectKeysPolyfill(myObject).length).toBe(1);
        });
        it("Should throw an error for the functions", function () {
            expect(function () {jsonOdm.util.objectKeysPolyfill()}).toThrow(new TypeError('Object.keys called on non-object'));
        });
    });
    describe("Branch", function () {
        var myObject = {myKey:"myValue",myArray:[{myKey:"value"}]};
        it("Should branch" , function () {
            expect(jsonOdm.util.branch(myObject,["myKey"])).toBe("myValue");
            expect(jsonOdm.util.branch(jsonOdm.util.branch(myObject,["myArray",0,"myKey"]))).toBe("value");
            expect(jsonOdm.util.branch(myObject,["myArray",0,"myKey"])).not.toBe("myValue");
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