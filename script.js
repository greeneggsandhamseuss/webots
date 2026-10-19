const display = document.getElementById('display');
const history = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let previousValue = null;
let operator = null;
let historyText = '';
let justEvaluated = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function updateHistory() {
  history.textContent = historyText || ' ';
}

function calculate(left, right, op) {
  switch (op) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
    default:
      return right;
  }
}

function formatResult(value) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const rounded = Number(value.toFixed(10));
  return String(rounded);
}

function appendNumber(value) {
  if (justEvaluated) {
    currentValue = '0';
    previousValue = null;
    operator = null;
    historyText = '';
    justEvaluated = false;
  }

  if (value === '.' && currentValue.includes('.')) {
    return;
  }

  if (currentValue === '0' && value !== '.') {
    currentValue = value;
  } else {
    currentValue += value;
  }

  updateDisplay();
}

function appendOperator(nextOperator) {
  if (currentValue === 'Error') {
    clearCalculator();
    return;
  }

  const currentNumber = Number(currentValue);

  if (previousValue === null) {
    previousValue = currentNumber;
    historyText = `${previousValue} ${nextOperator}`;
    operator = nextOperator;
    currentValue = '0';
    updateDisplay();
    updateHistory();
    return;
  }

  if (operator !== null) {
    const result = calculate(previousValue, currentNumber, operator);
    previousValue = result;
    historyText = `${previousValue} ${nextOperator}`;
    operator = nextOperator;
    currentValue = '0';
    updateDisplay();
    updateHistory();
    return;
  }

  operator = nextOperator;
  historyText = `${previousValue} ${operator}`;
  currentValue = '0';
  updateDisplay();
  updateHistory();
}

function clearCalculator() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  historyText = '';
  justEvaluated = false;
  updateDisplay();
  updateHistory();
}

function deleteLast() {
  if (justEvaluated) {
    clearCalculator();
    return;
  }

  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
  updateDisplay();
}

function evaluateExpression() {
  if (previousValue === null || operator === null) {
    return;
  }

  const left = previousValue;
  const right = Number(currentValue === '' ? '0' : currentValue);
  const result = calculate(left, right, operator);

  currentValue = formatResult(result);
  historyText = `${left} ${operator} ${right} =`;
  previousValue = null;
  operator = null;
  justEvaluated = true;
  updateDisplay();
  updateHistory();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { value, action } = button.dataset;

    if (action === 'clear') {
      clearCalculator();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'equals') {
      evaluateExpression();
      return;
    }

    if (value && /[0-9.]/.test(value)) {
      appendNumber(value);
      return;
    }

    if (value && /[+\-*/]/.test(value)) {
      appendOperator(value);
    }
  });
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key) || key === '.') {
    appendNumber(key);
    return;
  }

  if (/[+\-*/]/.test(key)) {
    appendOperator(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    evaluateExpression();
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    return;
  }

  if (key.toLowerCase() === 'c') {
    clearCalculator();
  }
});

updateDisplay();
updateHistory();
