/* eslint-disable no-loop-func */
/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const navbar = document.querySelector('.navbar');
const warning = document.querySelector('.warning');
const WORD_LENGTH = 5;

const rounds = 6;

async function init() {
  let currentGuess = '';
  let currentRow = 0;
  let isLoading = false;

  const res = await fetch('https://words.dev-apis.com/word-of-the-day');
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split('');
  let done = false;
  // eslint-disable-next-line no-use-before-define
  setLoading(false);
  isLoading = true;

  function isLetter(letter) {
    return /^[a-zA-Z]+$/.test(letter);
  }

  function setLoading(isLoading) {
    loadingDiv.classList.toggle('hidden', !isLoading);
  }
  function setWarning() {
    warning.classList.remove('hidden');
    setTimeout(() => {
      warning.classList.add('hidden');
    }, 1000);
  }

  function wordMap(words) {
    const wordObj = {};

    for (let i = 0; i < words.length; i++) {
      const letter = words[i];
      if (wordObj[letter]) {
        wordObj[letter]++;
      } else {
        wordObj[letter] = 1;
      }
    }

    return wordObj;
  }

  function addLetter(letter) {
    if (currentGuess.length < WORD_LENGTH) {
      // add letter to the end
      currentGuess += letter;
    } else {
      // replace the last letter
      currentGuess = currentGuess.substring(0, WORD_LENGTH - 1) + letter;
    }

    letters[currentRow * WORD_LENGTH + currentGuess.length - 1].innerText = letter;
  }

  async function commit() {
    if (currentGuess.length !== WORD_LENGTH) return;

    isLoading = true;
    setLoading(isLoading);
    // check if  word  is valid
    const res = await fetch('https://words.dev-apis.com/validate-word', {
      method: 'POST',
      body: JSON.stringify({ word: currentGuess }),
    });
    const resObj = await res.json();
    const { validWord } = resObj;
    isLoading = false;
    setLoading(isLoading);

    if (!validWord) {
      setWarning(validWord);
      // eslint-disable-next-line no-use-before-define
      markInvalidWord();
      return;
    }

    const guessParts = currentGuess.split('');
    const map = wordMap(wordParts);

    // TODO validate the word
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (wordParts[i] === guessParts[i]) {
        letters[currentRow * WORD_LENGTH + i].classList.add('correct');
        map[guessParts[i]]--;
      }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (wordParts[i] === guessParts[i]) {
        // do nothing; Already do in the for loop above;
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        letters[currentRow * WORD_LENGTH + i].classList.add('close');
        map[guessParts[i]]--;
      } else {
        letters[currentRow * WORD_LENGTH + i].classList.add('wrong');
      }
    }

    currentRow++;
    if (currentRow === rounds) {
      alert(`You lose the game, the world is ${word}`);
      done = true;
    } else if (currentGuess === word) {
      // win
      // TODO Fix bug
      done = true;
      navbar.innerHTML = '<h1>You Win!</h1>';
      navbar.classList.add('winner');
      return;
    }

    currentGuess = '';
  }

  function backspace() {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1);
      letters[currentRow * WORD_LENGTH + currentGuess.length].innerText = '';
    }
  }
  function markInvalidWord() {
    for (let i = 0; i < WORD_LENGTH; i++) {
      letters[WORD_LENGTH * currentRow + i].classList.remove('invalid');

      setTimeout(() => {
        letters[WORD_LENGTH * currentRow + i].classList.add('invalid');
      }, 10);
    }
  }
  document.addEventListener('keydown', (event) => {
    if (done || isLoading) {
      // do nothing
    }

    const action = event.key;
    if (action === 'Enter') {
      commit();
    } else if (action === 'Backspace') {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing
    }
  });
}
init();
