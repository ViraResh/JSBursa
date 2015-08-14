/*global getWinner*/
var gameState = {
  input: '',
  id: [],
  sign: []
};

var state = localStorage.getItem('game');
if (state) {
  gameState = JSON.parse(state);
}

window.addEventListener('load', function onLoad() {
  'use strict';
  var startGame;
  var generateField;
  var errorMessage;
  var input;
  var mainGame;
  var startNewGame;
  var winnerMessage;
  var field;

  startGame = document.querySelector('.startGame');
  generateField = document.querySelector('.generateField');
  errorMessage = document.querySelector('.error-message');
  input = document.querySelector('.count');
  mainGame = document.querySelector('.mainGame');
  startNewGame = document.querySelector('.startNewGame');
  winnerMessage = document.querySelector('.winner-message');
  field = document.querySelector('.field');

  function generate() {
    var i;
    var j;
    var row;
    var cell;
    for (i = 0; i < gameState.input; i++) {
      row = document.createElement('div');
      field.appendChild(row);
      row.classList.add('row');
      for (j = 0; j < gameState.input; j++) {
        cell = document.createElement('div');
        row.appendChild(cell);
        cell.classList.add('cell');
      }
    }
  }

  function ifGetWinner() {
    if (getWinner() === 'x') {
      winnerMessage.innerHTML = 'Крестик победил';
    } else if (getWinner() === 'o') {
      winnerMessage.innerHTML = 'Нолик победил';
    }
  }

  function reload() {
    var i;
    var id;
    var el;
    if (gameState.input) {
      mainGame.style.display = 'inline-block';
      startGame.style.display = 'none';

      generate();

      if (gameState.sign[0]) {
        for (i = 0; i < gameState.id.length; i++) {
          id = gameState.id[i];
          el = document.querySelectorAll('.cell')[id];
          el.classList.add(gameState.sign[i]);
        }
      }

      ifGetWinner();
    }
  }

  reload();

  function start() {
    errorMessage.innerHTML = '';
    if (!input.value) return;
    if (isNaN(input.value) || (input.value < 5) || (input.value > 15) || (input.value % 1 !== 0)) {
      errorMessage.innerHTML = 'Вы ввели некорректное число';
    } else {
      mainGame.style.display = 'inline-block';
      startGame.style.display = 'none';
      gameState.input = input.value;
      localStorage.setItem('game', JSON.stringify(gameState));
      generate();
    }
  }

  function course(e) {
    var x;
    var o;
    var current;
    var id;

    x = document.querySelectorAll('.x');
    o = document.querySelectorAll('.o');
    id = Array.prototype.indexOf.call(document.querySelectorAll('.cell'), event.target);

    if (!(e.target.classList.contains('x') || e.target.classList.contains('o') || getWinner() || e.target === field)) {
      if (o.length === x.length) {
        current = 'x';
      } else {
        current = 'o';
      }

      e.target.classList.add(current);
      gameState.id.push(id);
      gameState.sign.push(current);
      localStorage.setItem('game', JSON.stringify(gameState));

      ifGetWinner();
    }
  }

  function newGame() {
    startGame.style.display = 'inline-block';
    mainGame.style.display = 'none';
    field.innerHTML = '';
    winnerMessage.innerHTML = '';
    input.value = '';
    gameState = {
      input: '',
      id: [],
      sign: []
    };
    localStorage.removeItem('game');
  }

  generateField.addEventListener('click', start);
  field.addEventListener('click', course);
  startNewGame.addEventListener('click', newGame);
});
