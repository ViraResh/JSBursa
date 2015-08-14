/*global gameUrls*/
window.addEventListener('load', function onLoad() {
  'use strict';

  var w0;
  var existingGames;
  var playerId;
  var createGame;
  var gameId;
  var statusMessages;
  var mySide;
  var opSide;
  var startGame;
  var mainGame;
  var field;
  var cells;
  var newGame;

  var h1Get;
  var b3Put;
  var g1Post;
  var n2Post;
  var c2Post;

  existingGames = document.querySelector('.existing-games');
  createGame = document.querySelector('.createGame');
  statusMessages = document.querySelectorAll('.status-message');
  startGame = document.querySelector('.startGame');
  mainGame = document.querySelector('.mainGame');
  field = document.querySelector('.field');
  newGame = document.querySelector('.newGame');

  w0 = new WebSocket(gameUrls.list);

  function b1() {
    newGame.innerHTML = 'Новая игра';
  }

  function b4() {
    createGame.disabled = false;
    field.innerHTML = '';
    statusMessages[0].innerHTML = '';
    statusMessages[1].innerHTML = '';
    newGame.innerHTML = 'Сдаться';
    h1Get.abort();
    if (b3Put) {
      b3Put.abort();
    }
    g1Post.abort();
    n2Post.abort();
    if (c2Post) {
      c2Post.abort();
    }
  }

  function b5() {
    if (JSON.parse(b3Put.responseText).message) {
      statusMessages[1].innerHTML = JSON.parse(b3Put.responseText).message;
    } else {
      statusMessages[1].innerHTML = 'Неизвестная ошибка';
      b1();
    }
    newGame.innerHTML = 'Новая игра';
  }

  function b3() {
    b3Put = new XMLHttpRequest();
    b3Put.open('PUT', gameUrls.surrender);
    b3Put.setRequestHeader('Game-ID', gameId);
    b3Put.setRequestHeader('Player-ID', playerId);
    b3Put.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    b3Put.send();
    b3Put.addEventListener('readystatechange', function b3Ready() {
      if (b3Put.readyState === b3Put.DONE) {
        if (b3Put.status === 200) {
          b4();
        } else {
          b5(b3Put);
        }
      }
    });
  }

  function b2() {
    startGame.style.display = 'block';
    mainGame.style.display = 'none';
    if (newGame.innerHTML === 'Новая игра') {
      b4();
    } else if (newGame.innerHTML === 'Сдаться') {
      b3();
    }
  }

  function h2() {
    var h1GetRsp;
    h1GetRsp = JSON.parse(h1Get.responseText);
    if (h1GetRsp.move) {
      cells[h1GetRsp.move - 1].classList.add(opSide);
    }
    if (h1GetRsp.win) {
      statusMessages[1].innerHTML = h1GetRsp.win;
      b1();
    }
  }

  function h1() {
    h1Get = new XMLHttpRequest();
    h1Get.open('GET', gameUrls.move);
    h1Get.setRequestHeader('Game-ID', gameId);
    h1Get.setRequestHeader('Player-ID', playerId);
    h1Get.send();
    h1Get.addEventListener('readystatechange', function h1Ready() {
      if (h1Get.readyState === h1Get.DONE) {
        if (h1Get.status === 200) {
          h2();
        } else {
          h1();
        }
      }
    });
  }

  function g2(cell) {
    cell.classList.add(mySide);
    if (JSON.parse(g1Post.responseText).win) {
      statusMessages[1].innerHTML = JSON.parse(g1Post.responseText).win;
      b1();
    } else {
      h1();
    }
  }

  function g3() {
    if (JSON.parse(g1Post.responseText).message) {
      statusMessages[1].innerHTML = JSON.parse(g1Post.responseText).message;
    } else {
      statusMessages[1].innerHTML = 'Неизвестная ошибка';
      b1();
    }
  }

  function course() {
    var id;

    id = Array.prototype.indexOf.call(cells, event.target) + 1;

    g1Post = new XMLHttpRequest();
    g1Post.open('POST', gameUrls.move);
    g1Post.setRequestHeader('Game-ID', gameId);
    g1Post.setRequestHeader('Player-ID', playerId);
    g1Post.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    g1Post.send(JSON.stringify({'move': id}));
    g1Post.addEventListener('readystatechange', function g1Ready() {
      if (g1Post.readyState === g1Post.DONE) {
        if (g1Post.status === 200) {
          g2(cells[id - 1]);
        } else {
          g3();
        }
      }
    });
  }

  function generate() {
    var i;
    var j;
    var row;
    var cell;
    for (i = 0; i < 10; i++) {
      row = document.createElement('div');
      field.appendChild(row);
      row.classList.add('row');
      for (j = 0; j < 10; j++) {
        cell = document.createElement('div');
        row.appendChild(cell);
        cell.classList.add('cell');
      }
    }
    cells = document.querySelectorAll('.cell');
    field.addEventListener('click', course);
  }

  function w1(message) {
    var li;
    li = document.createElement('li');
    li.innerHTML = message.id;
    existingGames.appendChild(li);
  }

  function w2(message) {
    var i;
    var li;
    li = existingGames.querySelectorAll('li');
    for (i = 1; i < li.length; i++) {
      if (li[i].innerHTML === message.id) {
        existingGames.removeChild(li[i]);
      }
    }
  }

  function n1() {
    statusMessages[0].innerHTML = 'Ожидаем начала игры';
    createGame.disabled = true;
  }

  function n3() {
    statusMessages[0].innerHTML = 'Ошибка старта игры: другой игрок не ответил';
  }

  function n4() {
    statusMessages[0].innerHTML = 'Неизвестная ошибка старта игры';
  }

  function n5() {
    mySide = JSON.parse(n2Post.responseText).side;
    if (mySide === 'x') {
      opSide = 'o';
    } else {
      opSide = 'x';
    }
    startGame.style.display = 'none';
    mainGame.style.display = 'block';
    generate();
    if (mySide === 'o') {
      h1();
    }
  }

  function n2() {
    var gameReady;

    gameReady = {
      player: playerId,
      game: gameId
    };

    n2Post = new XMLHttpRequest();
    n2Post.open('POST', gameUrls.gameReady);
    n2Post.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    n2Post.send(JSON.stringify(gameReady));
    n2Post.addEventListener('readystatechange', function n2Ready() {
      if (n2Post.readyState === n2Post.DONE) {
        if (n2Post.status === 200) {
          n5();
        } else if (n2Post.status === 410) {
          n3();
        } else {
          n4();
        }
      }
    });
  }

  function w3(message) {
    playerId = message.id;
    n1();
    n2();
  }

  function c1() {
    createGame.disabled = true;
  }

  function c3() {
    w0.send(JSON.stringify({'register': gameId}));
  }

  function c4() {
    statusMessages[0].innerHTML = 'Ошибка создания игры';
    createGame.disabled = false;
  }

  function c2() {
    c2Post = new XMLHttpRequest();
    c2Post.open('POST', gameUrls.newGame);
    c2Post.send();
    c2Post.addEventListener('readystatechange', function c2Ready() {
      if (c2Post.readyState === c2Post.DONE) {
        if (c2Post.status === 200) {
          gameId = JSON.parse(c2Post.responseText).yourId;
          if (gameId) {
            c3();
          } else {
            c4();
          }
        } else {
          c4();
        }
      }
    });
  }

  function onMess(event) {
    var message;
    message = JSON.parse(event.data);
    if (message.action === 'add') {
      w1(message);
    } else if (message.action === 'remove') {
      w2(message);
    } else if (message.action === 'startGame') {
      w3(message);
    } else if (message.error) {
      return;
    }
  }

  function onClick() {
    c1();
    c2();
  }

  function j1() {
    if (event.target.nodeName === 'LI') {
      gameId = event.target.innerHTML;
      c3();
    }
  }

  w0.addEventListener('message', onMess);
  createGame.addEventListener('click', onClick);
  existingGames.addEventListener('click', j1);
  newGame.addEventListener('click', b2);
});
