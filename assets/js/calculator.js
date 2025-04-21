import { adjustDisplay } from "./displayHorizontalScroll.js";

let answer = 0;
let lastValue = "";
let isAnswerLastValue = false;

const DISPLAY_ELEMENT = document.querySelector("#display");
const CALCULATOR_BUTTONS = document.querySelectorAll(".btn-calculator");
CALCULATOR_BUTTONS.forEach((CALCULATOR_BUTTON) => {
    const BUTTON_VALUE = CALCULATOR_BUTTON.value;

    CALCULATOR_BUTTON.addEventListener("click", function () {
        CALCULATOR_BUTTON.classList.add("active");

        if (BUTTON_VALUE == "zero") {
            validateValue("0");
        } else {
            validateValue(BUTTON_VALUE);
        }

        adjustDisplay();

        setTimeout(() => {
            CALCULATOR_BUTTON.classList.remove("active");
        }, 100);
    });
});

document.addEventListener("keydown", function(event) {
    const EVENT_KEY = event.key;
    const BUTTON = getButtonFromKey(EVENT_KEY);

    if (BUTTON && !BUTTON.classList.contains("active")) {
        BUTTON.classList.add("active");
        if (BUTTON.value == "zero") {
            validateValue("0");
        } else {
            validateValue(BUTTON.value);
        }

        adjustDisplay();
    }
});

document.addEventListener("keyup", function(event) {
    const EVENT_KEY = event.key;
    const BUTTON = getButtonFromKey(EVENT_KEY);

    if (BUTTON) {
        BUTTON.classList.remove("active");
    }
});

function getButtonFromKey(key) {
    if (key == "0") {
        return document.querySelector("[value='zero']");
    } else if (key == "_" || key == "F9") {
        return document.querySelector("[value='changeSign']");
    } else if (key == "*" || key == "X") {
        return document.querySelector("[value='x']");
    } else if (!isNaN(key) || key == "%" || key == "!" || key == "/" || key == "x" || key == "-" || key == "+" || key == ".") {
        return document.querySelector("[value='" + key + "']");
    } else if (key == ",") {
        return document.querySelector("[value='.']");
    } else if (key == "=" || key == "Enter") {
        return document.querySelector("[value='calculate']");
    } else if (key == "Backspace") {
        return document.querySelector("[value='backspace']");
    } else if (key == "Delete" || key == "c" || key == "C") {
        return document.querySelector("[value='clearAll']");
    }

    return null;
}


function validateValue(value) {
    let expression = DISPLAY_ELEMENT.value;
    const LAST_CHARACTER = expression.slice(-1);
    let newDisplayValue;
    let invalidOperators;

    if (DISPLAY_ELEMENT.value == "Erro") {
        DISPLAY_ELEMENT.value = 0;
        expression = DISPLAY_ELEMENT.value;
    }

    switch (value) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            newDisplayValue = getUpdatedDisplayNumericValue(expression, expression.length, DISPLAY_ELEMENT.value, isAnswerLastValue, LAST_CHARACTER, value);
            DISPLAY_ELEMENT.value = newDisplayValue;

            lastValue = getLastValue("numeric", newDisplayValue);
            isAnswerLastValue = false;
            break;

        case "clearAll":
            deleteAllValues(DISPLAY_ELEMENT);
            isAnswerLastValue = false;
            break;

        case "backspace":
            deleteLastValue(expression, expression.length, DISPLAY_ELEMENT);
            isAnswerLastValue = false;
            break;

        case ".":
            newDisplayValue = getUpdatedDisplayDecimalValue(LAST_CHARACTER, DISPLAY_ELEMENT.value, value);
            DISPLAY_ELEMENT.value = newDisplayValue;

            lastValue = getLastValue("decimal", newDisplayValue);
            isAnswerLastValue = false;
            break;

        case "answer":
            newDisplayValue = getUpdatedDisplayAnswerValue(DISPLAY_ELEMENT.length, DISPLAY_ELEMENT.value, LAST_CHARACTER);
            DISPLAY_ELEMENT.value = newDisplayValue;

            lastValue = answer;
            isAnswerLastValue = true;
            break;

        case "changeSign":
            newDisplayValue = getUpdatedDisplayChangeSignValue(expression, DISPLAY_ELEMENT.value);

            DISPLAY_ELEMENT.value = newDisplayValue;
            isAnswerLastValue = false;
            break;

        case "%":
        case "!":
            invalidOperators = ["%", "!", "/", "x", "-", "+"];
            newDisplayValue = getUpdatedDisplayOperatorValue(invalidOperators, LAST_CHARACTER, DISPLAY_ELEMENT.value, value);

            DISPLAY_ELEMENT.value = newDisplayValue;
            isAnswerLastValue = false;
            break;

        case "/":
        case "x":
            invalidOperators = ["%", "/", "x", "-", "+"];
            newDisplayValue = getUpdatedDisplayOperatorValue(invalidOperators, LAST_CHARACTER, DISPLAY_ELEMENT.value, value);

            DISPLAY_ELEMENT.value = newDisplayValue;
            isAnswerLastValue = false;
            break;

        case "-":
            invalidOperators = ["-", "."];
            newDisplayValue = getUpdatedDisplayOperatorValue(invalidOperators, LAST_CHARACTER, DISPLAY_ELEMENT.value, value);

            DISPLAY_ELEMENT.value = newDisplayValue;
            isAnswerLastValue = false;
            break;

        case "+":
            invalidOperators = ["/", "x", "-", "+", "."];
            newDisplayValue = getUpdatedDisplayOperatorValue(invalidOperators, LAST_CHARACTER, DISPLAY_ELEMENT.value, value);

            DISPLAY_ELEMENT.value = newDisplayValue;
            isAnswerLastValue = false;
            break;

        case "calculate":
            processexpression(expression, DISPLAY_ELEMENT);
            isAnswerLastValue = false;
            break;

    }
}

function getUpdatedDisplayNumericValue(expression, expressionLength, displayValue, isAnswerLastValue, lastCharacter, value) {
    if (expressionLength == 1 && expression == 0) {
        return value;
    } else if (isAnswerLastValue) {
        isAnswerLastValue = false;

        if (lastCharacter == ".") {
            return displayValue + value;
        } else {
            return displayValue + "x" + value;
        }
    } else if (lastCharacter == "!") {
        return displayValue + "x" + value;
    } else {
        return displayValue + value;
    }
}

function getLastValue(valueType, displayValue) {
    if (valueType == "numeric") {
        return displayValue.split(/[\+\*\/]/).pop();
    } else if (valueType == "decimal") {
        return displayValue.split(/[\+\-\*\/]/).pop();
    }
}

function deleteAllValues(displayElement) {
    displayElement.value = 0;
    lastValue = "";
    answer = 0;
}

function deleteLastValue(expression, expressionLength, displayElement) {
    if (expressionLength > 1) {
        displayElement.value = expression.slice(0, -1);
    } else {
        displayElement.value = 0;
    }

    lastValue = displayElement.value.split(/[\+\*\/]/).pop();
}

function getUpdatedDisplayDecimalValue(lastCharacter, displayValue, value) {
    if (lastCharacter == "%" || lastCharacter == "!" || lastCharacter == "/" || lastCharacter == "x" || lastCharacter == "-" || lastCharacter == "+") {
        if (lastCharacter == "-") {
            return displayValue + "-0" + value;
        } else {
            return displayValue + "0" + value;
        }
    } 
    
    // Se a expressão não contém um ponto decimal
    else if (lastCharacter !== value && !/\.\d*$/.test(displayValue.split(/[\+\-\*\/]/).pop())) {
        return displayValue + value;
    }

    // Se já houver um ponto decimal na parte atual, evita adicionar outro ponto
    return displayValue;
}

function getUpdatedDisplayAnswerValue(displayLength, displayValue, lastCharacter) {
    if (displayLength == 1) {
        return answer;
    } else if (lastCharacter == "%" || lastCharacter == "/" || lastCharacter == "x" || lastCharacter == "-" || lastCharacter == "+" || lastCharacter == ".") {
        return displayValue + answer;
    } else {
        return displayValue + "x" + answer;
    }
}

function getUpdatedDisplayChangeSignValue(expression, displayValue) {
    if (expression == "0" || expression == "-") {
        if (expression.includes("-")) {
            return 0;
        } else {
            return "-";
        }
    }

    if (/^-?\d*\.?\d*$/.test(displayValue)) {
        if (displayValue.startsWith("-")) {
            return displayValue.slice(1);
        } else {
            return "-" + displayValue;
        }
    }

    // Pegando o último número com sinal, se houver operador antes
    const match = displayValue.match(/([+\-x\/])(-?\d*\.?\d*)$/);

    if (match) {
        const OPERATOR = match[1];
        const NUMBER = match[2];
        let inverted = "";

        // Alternando o sinal do número
        if (NUMBER.startsWith("-")) {
            inverted = NUMBER.slice(1);
        } else {
            inverted = "-" + NUMBER;
        }

        // Retornando o operador + número invertido
        return displayValue.slice(0, match.index + 1) + inverted;
    } else {
        // Invertendo o valor inteiro se não houver operador antes
        if (displayValue.startsWith("-")) {
            return displayValue.slice(1);
        } else {
            return "-" + displayValue;
        }
    }
}

function getUpdatedDisplayOperatorValue(invalidOperators, lastCharacter, displayValue, value) {
    if (value == "-" && displayValue == 0 && displayValue.length == 1) {
        return value;
    } else if (!invalidOperators.includes(lastCharacter)) {
        return displayValue + value;
    }

    return displayValue;
}

function processexpression(expression, displayElement) {
    try {
        let calculationResult = expression.replaceAll("x", "*");

        // Substituindo fatoriais
        calculationResult = calculationResult.replace(/(-?\d+)!/g, function (_, number) {
            const n = parseInt(number);
            if (n < 0) {
                displayElement.value = "Erro";
                answer = 0;
                lastValue = 0;
                return "";
            }

            const factorial = calculateFactorial(n);
            return factorial;
        });

        // Porcentagem de outro valor (50%100 -> (50 * 0.01 * 100))
        calculationResult = calculationResult.replace(/(\d+(?:\.\d+)?)%(\d+(?:\.\d+)?)/g, function (_, percent, ofValue) {
            return (percent * 0.01 * ofValue).toString();
        });

        // Porcentagem isolada (10% -> (10 * 0.01))
        calculationResult = calculationResult.replace(/(\d+(?:\.\d+)?)%/g, function (_, number) {
            return (number * 0.01).toString();
        });

        const result = eval(calculationResult);
        if (isNaN(result) || !isFinite(result)) {
            throw new Error("Cálculo inválido");
        }

        displayElement.value = result;
        answer = result;
        lastValue = result;
    } catch (err) {
        displayElement.value = "Erro";
        answer = 0;
        lastValue = 0;
    }

    isAnswerLastValue = false;
}


function calculateFactorial(number) {
    if (number == 0 || number == 1) {
        return 1;
    } else if (number < 0) {
        return null;
    } else {
        let i = 1;
        let factorial = number;

        while (i < number) {
            factorial *= (number - i);
            i++;
        }

        return factorial;
    }
}
