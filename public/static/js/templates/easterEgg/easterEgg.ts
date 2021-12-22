import { templateFunc } from '../../types';
import eggT from './easterEgg.handlebars';
import './easterEgg.sass';
/**
 * Пасхалочка
 */
export function egg() {
  const size = 10;
  let bombFrequency = 0.2;
  let tileSize = 50;

  const board = document.querySelectorAll('.board')[0] as HTMLElement;
  let tiles : NodeListOf<HTMLDivElement>;
  let boardSize : number;

  const restartBtn = document.querySelectorAll('.minesweeper-btn')[0];
  const endscreen = document.querySelectorAll('.endscreen')[0];

  const boardSizeBtn = document.getElementById('boardSize') as HTMLInputElement;
  const difficultyBtns = document.querySelectorAll('.difficulty');

  let bombs : string[] = [];
  let numbers: string[] = [];
  const numberColors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6',
    '#f1c40f', '#1abc9c', '#34495e', '#7f8c8d'];
  const endscreenContent = {win: `<span>${<string>window.localizer.getLocaleItem('win')}</span>`,
    loose: `<span>${<string>window.localizer.getLocaleItem('lose')}</span>`};

  let gameOver = false;

  const clear = () => {
    gameOver = false;
    bombs  = [];
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
    board.style.width = `${boardSize * tileSize}px`;

    document.documentElement.style.setProperty('--tileSize', `${tileSize}px`);
    document.documentElement.style.setProperty('--boardSize', `${boardSize * tileSize}px`);

    let x = 0;
    let y = 0;
    tiles.forEach((tile) => {
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
      tile.addEventListener('click', function() {
        clickTile(tile);
      });
    });

    numbers.forEach((num : string) => {
      const coords = num.split(',');
      const tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0];
      const res = tile.getAttribute('data-num');
      let dataNum  = 0;
      if (res != null) {
        dataNum = parseInt(res);
      }
      tile.setAttribute('data-num', (dataNum + 1).toString());
    });
  };


  const flag = (tile : HTMLDivElement) => {
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
  const clickTile = (tile: HTMLDivElement) => {
    if (gameOver) return;
    if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged')) return;
    const coordinate = tile.getAttribute('data-tile');
    if (bombs.includes(<string>coordinate)) {
      endGame();
    } else {
      const num = tile.getAttribute('data-num');
      if (num != null) {
        tile.classList.add('tile--checked');
        tile.innerHTML = num;
        tile.style.color = numberColors[Number(num) - 1];
        setTimeout(() => {
          checkVictory();
        }, 100);
        return;
      }

      checkTile(coordinate);
    }
    tile.classList.add('tile--checked');
  };
  const checkTile = (coordinate : string | null) => {
    const coords = coordinate?.split(',');
    if (coords == undefined) {
      return;
    }
    const x = parseInt(coords[0]);
    const y = parseInt(coords[1]);

    setTimeout(() => {
      if (x > 0) {
        const targetW = document.querySelectorAll(`[data-tile="${x - 1},${y}"`)[0] as HTMLDivElement;
        clickTile(targetW);
      }
      if (x < boardSize - 1) {
        const targetE = document.querySelectorAll(`[data-tile="${x + 1},${y}"`)[0] as HTMLDivElement;
        clickTile(targetE);
      }
      if (y > 0) {
        const targetN = document.querySelectorAll(`[data-tile="${x},${y - 1}"]`)[0] as HTMLDivElement;
        clickTile(targetN);
      }
      if (y < boardSize - 1) {
        const targetS = document.querySelectorAll(`[data-tile="${x},${y + 1}"]`)[0] as HTMLDivElement;
        clickTile(targetS);
      }

      if (x > 0 && y > 0) {
        const targetNW = document.querySelectorAll(`[data-tile="${x - 1},${y - 1}"`)[0] as HTMLDivElement;
        clickTile(targetNW);
      }
      if (x < boardSize - 1 && y < boardSize - 1) {
        const targetSE = document.querySelectorAll(`[data-tile="${x + 1},${y + 1}"`)[0] as HTMLDivElement;
        clickTile(targetSE);
      }

      if (y > 0 && x < boardSize - 1) {
        const targetNE = document.querySelectorAll(`[data-tile="${x + 1},${y - 1}"]`)[0] as HTMLDivElement;
        clickTile(targetNE);
      }
      if (x > 0 && y < boardSize - 1) {
        const targetSW = document.querySelectorAll(`[data-tile="${x - 1},${y + 1}"`)[0] as HTMLDivElement;
        clickTile(targetSW);
      }
    }, 10);
  };

  const endGame = () => {
    endscreen.innerHTML = endscreenContent.loose;
    endscreen.classList.add('show');
    gameOver = true;
    tiles.forEach((tile) => {
      const coordinate = tile.getAttribute('data-tile');
      if (bombs.includes(<string>coordinate)) {
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
      if (!tile.classList.contains('tile--checked') && !bombs.includes(<string>coordinate)) win = false;
    });
    if (win) {
      endscreen.innerHTML = endscreenContent.win;
      endscreen.classList.add('show');
      gameOver = true;
    }
  };
  setup();

  restartBtn?.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    clear();
  });

  boardSizeBtn?.addEventListener('change', function(e) {
    e.stopPropagation();
    tileSize = 70 - (Number(boardSizeBtn.value) * 2);
    clear();
  });
  (<NodeListOf<HTMLInputElement>>difficultyBtns)?.forEach((btn) => {
    btn.addEventListener('click', function() {
      bombFrequency = Number(btn.value);
      clear();
    });
  });
}

export function eggTemplate():string {
  return (<templateFunc>eggT)({
    text: window.localizer.getLocaleItem('easterEggText'),
    easy: window.localizer.getLocaleItem('easterEggEasy'),
    normal: window.localizer.getLocaleItem('easterEggMedium'),
    hard: window.localizer.getLocaleItem('easterEggHard'),
    again: window.localizer.getLocaleItem('easterEggAgain'),
  });
}
