/*global getWinner*/
window.addEventListener('load', function handler() {
  'use strict';
  var cells = document.querySelectorAll('.cell');
  var field = document.querySelector('.field');
  var newGame = document.querySelector('.startNewGame');
  var winnerMessage = document.querySelector('.winner-message');

  newGame.addEventListener('click', function startNewGame() {
    var i;
    for (i = 0; i < cells.length; i++) {
      cells[i].classList.remove('x');
      cells[i].classList.remove('o');
    }
    winnerMessage.innerHTML = '';
  });

  field.addEventListener('click', function course(e) {
    var x;
    var o;
    x = document.querySelectorAll('.x');
    o = document.querySelectorAll('.o');
    if (!(e.target.classList.contains('x') || e.target.classList.contains('o') || getWinner() || e.target === field)) {
      if (o.length === x.length) {
        e.target.classList.add('x');
      } else {
        e.target.classList.add('o');
      }
    }
    if (getWinner() === 'x') {
      winnerMessage.innerHTML = 'Крестик победил';
    } else if (getWinner() === 'o') {
      winnerMessage.innerHTML = 'Нолик победил';
    }
  });
});
