import eggT from './easterEgg.handlebars';
import './easterEgg.sass';
/**
 * Пасхалочка
 */
export function egg() {
  let size = 10;
  let bombFrequency = 0.2;
  let tileSize = 50;

  const board = document.querySelectorAll('.board')[0];
  let tiles;
  let boardSize;

  const restartBtn = document.querySelectorAll('.minesweeper-btn')[0];
  const endscreen = document.querySelectorAll('.endscreen')[0];

  // РќР°СЃС‚СЂРѕР№РєРё
  const boardSizeBtn = document.getElementById('boardSize');
  const difficultyBtns = document.querySelectorAll('.difficulty');

  let bombs = [];
  let numbers = [];
  const numberColors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6',
    '#f1c40f', '#1abc9c', '#34495e', '#7f8c8d'];
  const endscreenContent = {win: '<span>Вы выиграли!</span>',
    loose: 'КАБУМ! Вы проиграли.'};

  let gameOver = false;

  const clear = () => {
    gameOver = false;
    bombs = [];
    numbers = [];
    endscreen.innerHTML = '';
    endscreen.classList.remove('show');
    tiles.forEach((tile) => {
      tile.remove();
    });
    setup();
  };
  const setup = () => {
    for (let i = 0; i < Math.pow(size, 2); i++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      board.appendChild(tile);
    }
    tiles = document.querySelectorAll('.tile');
    boardSize = Math.sqrt(tiles.length);
    board.style.width = boardSize * tileSize + 'px';

    document.documentElement.style.setProperty('--tileSize', `${tileSize}px`);
    document.documentElement.style.setProperty('--boardSize', `${boardSize * tileSize}px`);

    let x = 0;
    let y = 0;
    tiles.forEach((tile, i) => {
      tile.setAttribute('data-tile', `${x},${y}`);

      const randomBool = Math.random() < bombFrequency;
      if (randomBool) {
        bombs.push(`${x},${y}`);
        if (x > 0) numbers.push(`${x - 1},${y}`);
        if (x < boardSize - 1) numbers.push(`${x + 1},${y}`);
        if (y > 0) numbers.push(`${x},${y - 1}`);
        if (y < boardSize - 1) numbers.push(`${x},${y + 1}`);

        if (x > 0 && y > 0) numbers.push(`${x - 1},${y - 1}`);
        if (x < boardSize - 1 && y < boardSize - 1) numbers.push(`${x + 1},${y + 1}`);

        if (y > 0 && x < boardSize - 1) numbers.push(`${x + 1},${y - 1}`);
        if (x > 0 && y < boardSize - 1) numbers.push(`${x - 1},${y + 1}`);
      }

      x++;
      if (x >= boardSize) {
        x = 0;
        y++;
      }

      tile.oncontextmenu = function(e) {
        e.preventDefault();
        flag(tile);
      };
      tile.addEventListener('click', function(e) {
        clickTile(tile);
      });
    });

    numbers.forEach((num) => {
      const coords = num.split(',');
      const tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0];
      let dataNum = parseInt(tile.getAttribute('data-num'));
      if (!dataNum) dataNum = 0;
      tile.setAttribute('data-num', dataNum + 1);
    });
  };


  const flag = (tile) => {
    if (gameOver) return;
    if (!tile.classList.contains('tile--checked')) {
      if (!tile.classList.contains('tile--flagged')) {
        tile.innerHTML = '&#128681;';
        tile.classList.add('tile--flagged');
      } else {
        tile.innerHTML = '';
        tile.classList.remove('tile--flagged');
      }
    }
  };
  const clickTile = (tile) => {
    if (gameOver) return;
    if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged')) return;
    const coordinate = tile.getAttribute('data-tile');
    if (bombs.includes(coordinate)) {
      endGame(tile);
    } else {
      const num = tile.getAttribute('data-num');
      if (num != null) {
        tile.classList.add('tile--checked');
        tile.innerHTML = num;
        tile.style.color = numberColors[num - 1];
        setTimeout(() => {
          checkVictory();
        }, 100);
        return;
      }

      checkTile(tile, coordinate);
    }
    tile.classList.add('tile--checked');
  };
  const checkTile = (tile, coordinate) => {
    const coords = coordinate.split(',');
    const x = parseInt(coords[0]);
    const y = parseInt(coords[1]);

    setTimeout(() => {
      if (x > 0) {
        const targetW = document.querySelectorAll(`[data-tile="${x - 1},${y}"`)[0];
        clickTile(targetW, `${x - 1},${y}`);
      }
      if (x < boardSize - 1) {
        const targetE = document.querySelectorAll(`[data-tile="${x + 1},${y}"`)[0];
        clickTile(targetE, `${x + 1},${y}`);
      }
      if (y > 0) {
        const targetN = document.querySelectorAll(`[data-tile="${x},${y - 1}"]`)[0];
        clickTile(targetN, `${x},${y - 1}`);
      }
      if (y < boardSize - 1) {
        const targetS = document.querySelectorAll(`[data-tile="${x},${y + 1}"]`)[0];
        clickTile(targetS, `${x},${y + 1}`);
      }

      if (x > 0 && y > 0) {
        const targetNW = document.querySelectorAll(`[data-tile="${x - 1},${y - 1}"`)[0];
        clickTile(targetNW, `${x - 1},${y - 1}`);
      }
      if (x < boardSize - 1 && y < boardSize - 1) {
        const targetSE = document.querySelectorAll(`[data-tile="${x + 1},${y + 1}"`)[0];
        clickTile(targetSE, `${x + 1},${y + 1}`);
      }

      if (y > 0 && x < boardSize - 1) {
        const targetNE = document.querySelectorAll(`[data-tile="${x + 1},${y - 1}"]`)[0];
        clickTile(targetNE, `${x + 1},${y - 1}`);
      }
      if (x > 0 && y < boardSize - 1) {
        const targetSW = document.querySelectorAll(`[data-tile="${x - 1},${y + 1}"`)[0];
        clickTile(targetSW, `${x - 1},${y + 1}`);
      }
    }, 10);
  };

  const endGame = (tile) => {
    endscreen.innerHTML = endscreenContent.loose;
    endscreen.classList.add('show');
    gameOver = true;
    tiles.forEach((tile) => {
      const coordinate = tile.getAttribute('data-tile');
      if (bombs.includes(coordinate)) {
        tile.classList.remove('tile--flagged');
        tile.classList.add('tile--checked', 'tile--bomb');
        tile.innerHTML = '&#128163;';
      }
    });
  };
  const checkVictory = () => {
    let win = true;
    tiles.forEach((tile) => {
      const coordinate = tile.getAttribute('data-tile');
      if (!tile.classList.contains('tile--checked') && !bombs.includes(coordinate)) win = false;
    });
    if (win) {
      endscreen.innerHTML = endscreenContent.win;
      endscreen.classList.add('show');
      gameOver = true;
    }
  };
  setup();

  restartBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    clear();
  });

  boardSizeBtn.addEventListener('change', function(e) {
    e.stopPropagation();
    size = value;
    tileSize = 70 - (size * 2);
    clear();
  });
  difficultyBtns.forEach((btn) => {
    btn.addEventListener('click', function() {
      e.stopPropagation();
      bombFrequency = value;
      clear();
    });
  });
}

export function eggTemplate() {
  return eggT();
}
