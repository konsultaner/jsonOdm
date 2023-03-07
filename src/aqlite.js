import Query from "./query";

export default class Aqlite {

    static TOKEN_WORD = -1;
    static TOKEN_KEY_WORD = -2;
    static TOKEN_NUMBER_VALUE = -3;
    static TOKEN_STRING_VALUE = -5;
    static TOKEN_PREPARED_VARIABLE = -6;
    static TOKEN_SYMBOL = -7;

    static TOKEN_SINGLE_SYMBOL_MATCHER = /[(){}[\]:,]/;
    static TOKEN_MULTIPLE_SYMBOL_MATCHER = /[+*\-/?=~^<>|&%.]/;
    static TOKEN_WORD_MATCHER = /[^\s+\-0-9.]/;
    static TOKEN_VARIABLE_MATCHER = /[+\-0-9.]/;
    static TOKEN_WHITESPACE_MATCHER = /\s/;

    static RESERVED_TOKENS = [
        "AGGREGATE",
        "ALL",
        "AND",
        "ANY",
        "ASC",
        "COLLECT",
        "DESC",
        "DISTINCT",
        "FALSE",
        "FILTER",
        "FOR",
        "GRAPH",
        "IN",
        "INBOUND",
        "INSERT",
        "INTO",
        "LET",
        "LIKE",
        "LIMIT",
        "NONE",
        "NOT",
        "NULL",
        "OR",
        "REMOVE",
        "RETURN",
        "SORT",
        "TRUE"
    ]

    static getToken(query): Token[] {
        return Array.prototype.reduce.call(
            query + " ", // terminate the query with a whitespace
            (aggregation: Tokenizer, currentCharacter) => {
                const isWhitespace = Aqlite.TOKEN_WHITESPACE_MATCHER.test(currentCharacter);

                if (currentCharacter === '\n' || currentCharacter === '\r'){
                    aggregation.currentLine++;
                    aggregation.currentCharacterIndex = 0;
                } else {
                    aggregation.currentCharacterIndex++;
                }

                // reset or initialize current token
                if (
                    !aggregation.currentToken ||
                    (
                        aggregation.currentToken &&
                        aggregation.currentToken.type &&
                        aggregation.currentToken.type !== Aqlite.TOKEN_STRING_VALUE &&
                        isWhitespace
                    ) ||
                    (
                        aggregation.currentToken &&
                        aggregation.currentToken.type &&
                        aggregation.currentToken.type !== Aqlite.TOKEN_STRING_VALUE &&
                        aggregation.currentToken.type !== Aqlite.TOKEN_SYMBOL &&
                        Aqlite.TOKEN_MULTIPLE_SYMBOL_MATCHER.test(currentCharacter) &&
                        (
                            aggregation.currentToken.type !== Aqlite.TOKEN_NUMBER_VALUE ||
                            currentCharacter !== '.'
                        )
                    ) ||
                    (
                        aggregation.currentToken &&
                        aggregation.currentToken.type &&
                        aggregation.currentToken.type !== Aqlite.TOKEN_STRING_VALUE &&
                        Aqlite.TOKEN_SINGLE_SYMBOL_MATCHER.test(currentCharacter)
                    ) ||
                    (
                        aggregation.currentToken &&
                        aggregation.currentToken.type === Aqlite.TOKEN_SYMBOL &&
                        Aqlite.TOKEN_SINGLE_SYMBOL_MATCHER.test(aggregation.currentToken.value)
                    ) ||
                    (
                        aggregation.currentToken &&
                        aggregation.currentToken.type === Aqlite.TOKEN_SYMBOL &&
                        !Aqlite.TOKEN_MULTIPLE_SYMBOL_MATCHER.test(currentCharacter)
                    ) ||
                    (
                        aggregation.currentToken &&
                        aggregation.currentToken.type === Aqlite.TOKEN_STRING_VALUE &&
                        aggregation.currentToken.value[0] === currentCharacter &&
                        aggregation.currentToken.value[aggregation.currentToken.value.length-1] !== '\\'
                    )
                ) {
                    if (aggregation.currentToken) {
                        aggregation.tokens.push(aggregation.currentToken);
                        if (Aqlite.RESERVED_TOKENS.includes(aggregation.currentToken.value)) {
                            aggregation.currentToken.type = Aqlite.TOKEN_KEY_WORD;
                        }
                        if (aggregation.currentToken.type === Aqlite.TOKEN_STRING_VALUE) {
                            aggregation.currentToken.value = aggregation.currentToken.value.substring(1);
                            aggregation.currentToken = new Token();
                            return aggregation;
                        }
                    }
                    aggregation.currentToken = new Token();
                }

                // choose token type
                if (!aggregation.currentToken.value || aggregation.currentToken.type === Aqlite.TOKEN_SYMBOL) {
                    if (Aqlite.TOKEN_MULTIPLE_SYMBOL_MATCHER.test(currentCharacter) || Aqlite.TOKEN_SINGLE_SYMBOL_MATCHER.test(currentCharacter)) {
                        aggregation.currentToken.type = Aqlite.TOKEN_SYMBOL;
                    } else if (Aqlite.TOKEN_VARIABLE_MATCHER.test(currentCharacter)) {
                        aggregation.currentToken.type = Aqlite.TOKEN_NUMBER_VALUE;
                    } else if (currentCharacter === '@') {
                        aggregation.currentToken.type = Aqlite.TOKEN_PREPARED_VARIABLE;
                    } else if (currentCharacter === '"' || currentCharacter === "'") {
                        aggregation.currentToken.type = Aqlite.TOKEN_STRING_VALUE;
                    } else if (Aqlite.TOKEN_WORD_MATCHER.test(currentCharacter)) {
                        aggregation.currentToken.type = Aqlite.TOKEN_WORD;
                    }
                }
                if (!aggregation.currentToken.value) {
                    aggregation.currentToken.line = aggregation.currentLine;
                    aggregation.currentToken.characterIndex = aggregation.currentCharacterIndex;
                }

                // fill up token
                if (!isWhitespace || aggregation.currentToken.type === Aqlite.TOKEN_STRING_VALUE) {
                    aggregation.currentToken.value = (aggregation.currentToken.value || '') + currentCharacter;
                }
                return aggregation;
            },
            new Tokenizer()
        ).tokens;
    }

    static run(query): Query {
        let tokens = Aqlite.getToken(query);
    }

}

class Tokenizer {
    currentLine = 1;
    currentCharacterIndex = 0;
    currentToken: Token;
    tokens: Token[] = [];
}

class Token {
    line: number;
    characterIndex: number;
    value: string;
    type: number;
}