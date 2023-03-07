import Aqlite from "../src/aqlite";

describe("Aqlite", function () {
    describe("Lexer", function () {
        it("Generate correct tokens for all defined values", function () {
            const resultTokens = Aqlite.getToken(
                "FOR element IN          Collection\n" +
                "FILTER element.name == 'Richard \\'the\\' first \"Conquerer\" ever'&&LENGTH(element.name)>2 || \n\r" +
                "       element.name == \"Burkhardt 'the' \\\"2nd\\\"\" ||\n" +
                "       element.volume < -12.392\n" +
                "RETURN {element, name: [1,2,3], value: 3}"
            )
            expect(resultTokens.length).toBe(50);

            expect(resultTokens[0].value).toBe("FOR");
            expect(resultTokens[0].type).toBe(Aqlite.TOKEN_KEY_WORD);
            expect(resultTokens[0].line).toBe(1);
            expect(resultTokens[0].characterIndex).toBe(1);

            expect(resultTokens[1].value).toBe("element");
            expect(resultTokens[1].type).toBe(Aqlite.TOKEN_WORD);
            expect(resultTokens[1].line).toBe(1);
            expect(resultTokens[1].characterIndex).toBe(5);

            expect(resultTokens[2].value).toBe("IN");
            expect(resultTokens[2].type).toBe(Aqlite.TOKEN_KEY_WORD);
            expect(resultTokens[2].line).toBe(1);
            expect(resultTokens[2].characterIndex).toBe(13);

            expect(resultTokens[3].value).toBe("Collection");
            expect(resultTokens[3].type).toBe(Aqlite.TOKEN_WORD);
            expect(resultTokens[3].line).toBe(1);
            expect(resultTokens[3].characterIndex).toBe(25);

            //////////////////////////// NEW LINE

            expect(resultTokens[4].value).toBe("FILTER");
            expect(resultTokens[4].type).toBe(Aqlite.TOKEN_KEY_WORD);
            expect(resultTokens[4].line).toBe(2);
            expect(resultTokens[4].characterIndex).toBe(1);

            expect(resultTokens[5].value).toBe("element");
            expect(resultTokens[5].type).toBe(Aqlite.TOKEN_WORD);
            expect(resultTokens[5].line).toBe(2);
            expect(resultTokens[5].characterIndex).toBe(8);

            expect(resultTokens[6].value).toBe(".");
            expect(resultTokens[6].type).toBe(Aqlite.TOKEN_SYMBOL);
            expect(resultTokens[6].line).toBe(2);
            expect(resultTokens[6].characterIndex).toBe(15);

            expect(resultTokens[7].value).toBe("name");
            expect(resultTokens[7].type).toBe(Aqlite.TOKEN_WORD);
            expect(resultTokens[7].line).toBe(2);
            expect(resultTokens[7].characterIndex).toBe(16);

            expect(resultTokens[8].value).toBe("==");
            expect(resultTokens[8].type).toBe(Aqlite.TOKEN_SYMBOL);
            expect(resultTokens[8].line).toBe(2);
            expect(resultTokens[8].characterIndex).toBe(21);

            expect(resultTokens[9].value).toBe("Richard \\'the\\' first \"Conquerer\" ever");
            expect(resultTokens[9].type).toBe(Aqlite.TOKEN_STRING_VALUE);
            expect(resultTokens[9].line).toBe(2);
            expect(resultTokens[9].characterIndex).toBe(24);

            expect(resultTokens[10].value).toBe("&&");
            expect(resultTokens[10].type).toBe(Aqlite.TOKEN_SYMBOL);
            expect(resultTokens[10].line).toBe(2);
            expect(resultTokens[10].characterIndex).toBe(64);

            expect(resultTokens[11].value).toBe("LENGTH");
            expect(resultTokens[11].type).toBe(Aqlite.TOKEN_WORD);
            expect(resultTokens[11].line).toBe(2);
            expect(resultTokens[11].characterIndex).toBe(66);

            expect(resultTokens[12].value).toBe("(");
            expect(resultTokens[12].type).toBe(Aqlite.TOKEN_SYMBOL);
            expect(resultTokens[12].line).toBe(2);
            expect(resultTokens[12].characterIndex).toBe(72);

            expect(resultTokens[13].value).toBe("element");
            expect(resultTokens[13].type).toBe(Aqlite.TOKEN_WORD);
            expect(resultTokens[13].line).toBe(2);
            expect(resultTokens[13].characterIndex).toBe(73);

            expect(resultTokens[14].value).toBe(".");
            expect(resultTokens[14].type).toBe(Aqlite.TOKEN_SYMBOL);
            expect(resultTokens[14].line).toBe(2);
            expect(resultTokens[14].characterIndex).toBe(80);

            expect(resultTokens[15].value).toBe("name");
            expect(resultTokens[15].type).toBe(Aqlite.TOKEN_WORD);
            expect(resultTokens[15].line).toBe(2);
            expect(resultTokens[15].characterIndex).toBe(81);

            expect(resultTokens[16].value).toBe(")");
            expect(resultTokens[16].type).toBe(Aqlite.TOKEN_SYMBOL);
            expect(resultTokens[16].line).toBe(2);
            expect(resultTokens[16].characterIndex).toBe(85);

            expect(resultTokens[17].value).toBe(">");
            expect(resultTokens[17].type).toBe(Aqlite.TOKEN_SYMBOL);
            expect(resultTokens[17].line).toBe(2);
            expect(resultTokens[17].characterIndex).toBe(86);

            expect(resultTokens[18].value).toBe("2");
            expect(resultTokens[18].type).toBe(Aqlite.TOKEN_NUMBER_VALUE);
            expect(resultTokens[18].line).toBe(2);
            expect(resultTokens[18].characterIndex).toBe(87);

            expect(resultTokens[19].value).toBe("||");
            expect(resultTokens[19].type).toBe(Aqlite.TOKEN_SYMBOL);
            expect(resultTokens[19].line).toBe(2);
            expect(resultTokens[19].characterIndex).toBe(89);

            //////////////////////////// NEW LINE

        });
    });
});
