const expressionDisplay = document.querySelector("#expression");
const resultDisplay = document.querySelector("#result");
const buttons = document.querySelectorAll("button");

let expression = "";
let justCalculated = false;
let errorState = false;

const operators = ["+", "-", "*", "/"];

function isOperator(character) {
  return operators.includes(character);
}

function formatExpression(value) {
  return value.replaceAll("*", "×").replaceAll("/", "÷").replaceAll("-", "−");
}

function updateDisplay() {
  expressionDisplay.textContent = expression ? formatExpression(expression) : "0";

  if (!expression) {
    resultDisplay.textContent = "0";
  } else {
    const lastPart = expression.split(/[+\-*/]/).pop();
    resultDisplay.textContent = lastPart || "0";
  }
}

function clearCalculator() {
  expression = "";
  justCalculated = false;
  errorState = false;
  updateDisplay();
}

function deleteLast() {
  if (errorState) {
    clearCalculator();
    return;
  }

  expression = expression.slice(0, -1);
  justCalculated = false;
  updateDisplay();
}

function appendNumber(value) {
  if (errorState || justCalculated) {
    expression = "";
    justCalculated = false;
    errorState = false;
  }

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/]/).pop();

    if (currentNumber.includes(".")) {
      return;
    }

    if (currentNumber === "") {
      expression += "0";
    }
  }

  const currentNumber = expression.split(/[+\-*/]/).pop();

  if (value !== "." && currentNumber === "0") {
    expression = expression.slice(0, -1);
  }

  expression += value;
  updateDisplay();
}

function appendOperator(operator) {
  if (errorState) {
    clearCalculator();
  }

  if (!expression) {
    if (operator === "-") {
      expression = "-";
      updateDisplay();
    }
    return;
  }

  if (expression === "-") {
    return;
  }

  const lastCharacter = expression.at(-1);

  if (isOperator(lastCharacter)) {
    // Replace the previous operator instead of creating invalid input.
    expression = expression.slice(0, -1) + operator;
  } else {
    expression += operator;
  }

  justCalculated = false;
  updateDisplay();
}

function tokenize(value) {
  const tokens = [];
  let number = "";

  for (const character of value) {
    if ((character >= "0" && character <= "9") || character === ".") {
      number += character;
    } else if (isOperator(character)) {
      if (number === "" && character === "-" && tokens.length === 0) {
        number = "-";
      } else {
        if (number !== "") {
          tokens.push(parseFloat(number));
          number = "";
        }
        tokens.push(character);
      }
    }
  }

  if (number !== "") {
    tokens.push(parseFloat(number));
  }

  return tokens;
}

function calculate(value) {
  const tokens = tokenize(value);

  if (tokens.length === 0 || typeof tokens[0] !== "number") {
    return { error: "Invalid expression" };
  }

  // First pass: multiplication and division.
  const reduced = [tokens[0]];

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const nextNumber = tokens[i + 1];

    if (typeof nextNumber !== "number" || !Number.isFinite(nextNumber)) {
      return { error: "Invalid expression" };
    }

    if (operator === "*" || operator === "/") {
      const left = reduced.pop();

      if (operator === "/" && nextNumber === 0) {
        return { error: "Cannot divide by zero" };
      }

      switch (operator) {
        case "*":
          reduced.push(left * nextNumber);
          break;
        case "/":
          reduced.push(left / nextNumber);
          break;
      }
    } else {
      reduced.push(operator, nextNumber);
    }
  }

  // Second pass: addition and subtraction.
  let total = reduced[0];

  for (let i = 1; i < reduced.length; i += 2) {
    const operator = reduced[i];
    const nextNumber = reduced[i + 1];

    switch (operator) {
      case "+":
        total += nextNumber;
        break;
      case "-":
        total -= nextNumber;
        break;
    }
  }

  if (!Number.isFinite(total)) {
    return { error: "Invalid result" };
  }

  return { value: total };
}

function evaluateExpression() {
  if (!expression || isOperator(expression.at(-1))) {
    return;
  }

  const calculation = calculate(expression);

  if (calculation.error) {
    resultDisplay.textContent = calculation.error;
    expressionDisplay.textContent = formatExpression(expression);
    errorState = true;
    return;
  }

  const result = Number.parseFloat(calculation.value.toFixed(10)).toString();

  expressionDisplay.textContent = `${formatExpression(expression)} =`;
  resultDisplay.textContent = result;
  expression = result;
  justCalculated = true;
}

function handleButtonClick(event) {
  const button = event.currentTarget;
  const number = button.dataset.number;
  const operator = button.dataset.operator;
  const action = button.dataset.action;

  if (number !== undefined) {
    appendNumber(number);
    return;
  }

  if (operator !== undefined) {
    appendOperator(operator);
    return;
  }

  switch (action) {
    case "clear":
      clearCalculator();
      break;
    case "delete":
      deleteLast();
      break;
    case "equals":
      evaluateExpression();
      break;
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if ((key >= "0" && key <= "9") || key === ".") {
    appendNumber(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    appendOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    evaluateExpression();
  } else if (key === "Backspace" || key === "Delete") {
    deleteLast();
  } else if (key === "Escape" || key.toLowerCase() === "c") {
    clearCalculator();
  }
});

updateDisplay();
