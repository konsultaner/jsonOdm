import Aqlite from "../src/aqlite";

describe("Aqlite", function () {
    describe("Lexer", function () {
        it("Generate correct tokens for all defined values", function () {
            const resultTokens = Aqlite.getToken(
                "FOR element IN Collection\n" +
                "FILTER element.name == 'Richard the first \"Conquerer\" ever' && LENGTH(element.name) > 2 || \n\r" +
                "       element.name == \"Burkhardt the 2nd\" ||\n" +
                "       element.volume < -12.392\n" +
                "RETURN element"
            )
            expect(resultTokens.length).toBe(22);
        });
    });
});
