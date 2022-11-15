//@ts-check

let buffer = '0';
let runningTotal = 0;
let previousOperator = null;

const myScreen = document.querySelector('.screen');

//value: event.target.innerText
/**
 * @param {string} value
 */
function buttonClick(value) {
  if (isNaN(parseInt(value))) {
    handleSymbol(value);
  } else {
    handleNumber(value);
  }

  rerender();
}

/**
 * @param {string} num
 */
function handleNumber(num) {
  if (buffer === '0') {
    buffer = num;
  } else {
    buffer += num;
  }
}

/**
 * @param {string} value
 * value: math operator
 */
function handleMath(value) {
  if (buffer === '0') {
    return; //do nothing
  }

  const intBuffer = parseInt(buffer);

  if (runningTotal === 0) {
    runningTotal = intBuffer;
  } else {
    flushOperation(intBuffer);
  }

  previousOperator = value;
  // set buffer to "0" so that we can enter the next number
  buffer = '0';
}

/**
 * @param {number} intBuffer
 */
function flushOperation(intBuffer) {
  if (previousOperator === '+') {
    runningTotal += intBuffer;
  } else if (previousOperator === '-') {
    runningTotal -= intBuffer;
  } else if (previousOperator === '*') {
    runningTotal *= intBuffer;
  } else if (previousOperator === '/') {
    runningTotal /= intBuffer;
  }
}

/**
 * @param {string} symbol
 */
function handleSymbol(symbol) {
  switch (symbol) {
    case 'C':
      buffer = '0';
      break;
    case '=':
      if (previousOperator === null) {
        return;
      }

      flushOperation(parseInt(buffer));

      buffer = '' + runningTotal; // convert number to string
      runningTotal = 0;

      break;
    case '<':
      if (buffer.length === 1) {
        buffer = '0';
      } else {
        buffer = buffer.substring(0, buffer.length - 1);
      }
      break;
    case '+':
    case '-':
    case 'x':
    case '/':
      handleMath(symbol);
      break;
  }
}

function init() {
  // @ts-ignore
  document
    .querySelector('.calc-buttons')
    .addEventListener('click', function (event) {
      // @ts-ignore
      buttonClick(event.target.innerText);
    });
}

function rerender() {
  // @ts-ignore
  myScreen.innerText = buffer;
}

init();
