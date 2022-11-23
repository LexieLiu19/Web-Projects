const statement = document.querySelector('#statement');
const optionButtons = document.querySelectorAll('#options button');
const explanation = document.querySelector('#explanation');

const fact = {
  statement: 'Is today Monday?',
  answer: false,
  explanation: 'Today is Monday hahahhhahahah ',
};

statement.textContent = fact.statement;

const disable = (button) => {
  button.setAttribute('disabled', '');
};
const enable = (button) => {
  button.removeAttribute('disabled');
};

const isCorrect = (guess) => {
  return guess === '' + fact.answer;
};

//  Use a for loop to add a click event listener to each of the optionButtons

for (let button of optionButtons) {
  button.addEventListener('click', (event) => {
    explanation.textContent = fact.explanation;
    for (let disableButton of optionButtons) {
      disable(disableButton);
      // let clickedValue = event.target.textContent;
      if (isCorrect(button.value)) {
        button.classList.add('correct');
      } else {
        button.classList.add('incorrect');
      }
    }
  });
}
