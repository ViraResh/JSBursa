function getWinner() {

  var cellsD = document.querySelectorAll('.cell');
  var n = Math.sqrt(cellsD.length);
  var cells = [];
  var w = 5;

  //в эту функцию подаю 5 значений: 1,2 - координаты начала поиска линии; 3,4 - направление поиска ([1,0] - вертикаль,[0,1] - горизонталь и т.д.); 5 - длина линии для победы.
  function getPrev(i, j, x, y, w) {
    if (w === 1) {
      return cells[i][j];
    } else if (i === n || j === n || !cells[i][j]) {
      return undefined;
    } else if (cells[i][j] === getPrev(i + x, j + y, x, y, w - 1)) {
      return getPrev(i + x, j + y, x, y, w - 1);
    }
  }

  function read() {
    for (var i = 0; i < n; i++) {
      cells.push([]);
      for (var j = 0; j < n; j++) {
        var el = cellsD[i * n + j];
        if (el.classList.contains('x')) {
          cells[i].push('x');
        } else if (el.classList.contains('o')) {
          cells[i].push('o');
        } else {
          cells[i].push('');
        }
      }
    }
  }

  function checkOut() {
    for (var k = 0; k < n; k++) {
      for (var l = 0; l < n; l++) {
        if (checkIn(k, l)) {
          return checkIn(k, l)
        }
      }
    }
  }

  function checkIn(i, j) {
    return getPrev(i, j, 1, 0, w) || getPrev(i, j, 0, 1, w) || getPrev(i, j, 1, 1, w) || getPrev(i, j, 1, -1, w);
  }

  read();
  return checkOut();
}
