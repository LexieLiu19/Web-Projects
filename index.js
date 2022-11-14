buffer = '0';

function buttonClick(value) {
  if (isNaN(parseInt(value))) {
    handleSymbol(value);
  } else {
    handleNumber(value);
  }
}

function handleNumber(num) {
  if (buffer === '0') {
    buffer = num;
  } else {
    buffer += num;
  }

  console.log(buffer);
}
function handleSymbol(symb) {
  console.log('Symbol');
}

function init() {
  document
    .querySelector('.calc-buttons')
    .addEventListener('click', function (event) {
      buttonClick(event.target.innerText);
    });
}

init();
