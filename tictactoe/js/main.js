const container = document.querySelector('.game');
const play = document.getElementById("play");
const xInput = document.querySelector('#x_campo');
const oInput = document.querySelector('#o_campo');
const banner = document.querySelector(".banner");
const winningSymbol = document.getElementById("s");
const winningText = document.getElementById("w");
const gameNarration = document.querySelector('.game-narration');
const scoreElements = [document.getElementById("score_o"), document.getElementById("score_x")];

const ticTacToe = {
  board: ['', '', '', '', '', '', '', '', ''],
  symbols: ['〇', '✕', '〇✕'],
  turnIndex: 0,
  change() {
    this.turnIndex = (this.turnIndex === 0 ? 1 : 0);
  },
  sequences: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],
  score: {
    score_x: 0,
    score_o: 0
  },
  players: ['〇', '✕'],
  container: null,
  gameOver: false,
  select: 2,
  gameNarration: null,

  initialize(containerElement, xInput, oInput, narrationElement) {
    this.container = containerElement;
    this.players[0] = oInput.value || this.symbols[0];
    this.players[1] = xInput.value || this.symbols[1];
    console.log(oInput.value, " aa")
    this.gameNarration = narrationElement;
    this.gameOver = true;
  },
  
  start() {
    container.style.display = "grid";
    x_campo.style.display = "none";
    o_campo.style.display = "none";
    banner.style.display = "none";

    this.board.fill('');
    this.setNarrationText();
    
    if (this.select === 1 || this.select === 2) {
      this.gameOver = false;
      play.innerText = "REPLAY";
      this.draw();
    }
    
    if (this.select === 1 && this.turnIndex === 1) {
      this.machine();
    }
  },

  makePlay(position) {
    if (this.gameOver) return;
    if (this.board[position] !== '') return;

    this.board[position] = this.symbols[this.turnIndex]
    this.draw();
    
    if (this.checkWinningSequences(this.symbols[this.turnIndex])) {
      this.game_is_over();
      this.stylizeWinnerSequence(this.turnIndex);
      return;
    }
    
    if (this.checkDraw()) {
      this.stylizeWinnerSequence(2);
      this.game_is_over();
      return;
    }
    
    this.change();
    this.setNarrationText();
    
    if (this.select === 1 && this.turnIndex === 1) {
      this.machine();
    }
  },

  draw() {
    let content = '';
    
    for (let i = 0; i < this.board.length; i++) {
      const classe = this.board[i] === this.symbols[0]
    
      content += `
        <div onclick="ticTacToe.makePlay(${i})">
          <span class=${classe ? "oo" : "xx"}>${this.board[i]}</span>
        </div>
      `;
    }

    this.container.innerHTML = content;
  },
  
  checkDraw() {
    return this.board.every(cell => cell !== '');
  },

  checkWinningSequences(symbol) {
    for (let i in this.sequences) {
      if (this.board[this.sequences[i][0]] === symbol && this.board[this.sequences[i][1]] === symbol && this.board[this.sequences[i][2]] === symbol) {
        return true;
      }
    }
    return false;
  },

  stylizeWinnerSequence(index) {
    const winnerSymbol = this.symbols[index];
    
    if (index === 2) {
      winningSymbol.innerHTML = `<span class='xx'>${this.symbols[1]}</span><span class='oo'>${this.symbols[0]}</span>`;
      winningText.innerText = "OLD!";
    } else {
      const scoreElement = index === 0 ? score_o : score_x;
      const winnerSymbolClass = index === 0 ? 'oo' : 'xx';
      
      scoreElement.innerHTML = `${winnerSymbol} - ${index === 0 ? this.score.score_o +=1 : this.score.score_x +=1}`;
      
      winningSymbol.innerHTML = `<span class="${winnerSymbolClass}">${winnerSymbol}</span>`;
      winningText.innerText = "WIN!";
    }
  },
  
  setNarrationText() {
    this.gameNarration.innerText = `${this.turnIndex === 1 ? this.players[1] : this.players[0]} turn`;
  },

  game_is_over() {
    this.gameOver = true;
    this.gameNarration.innerText = 'game over';
    play.innerText = "Jogar novamente?";
    
    setTimeout(() => {
      play.style.display = 'inline-block';
      container.style.display = "none";
      banner.style.display = "flex";
    }, 1000);
  },

  machine() {
    const currentPlayerSymbol = this.symbols[this.turnIndex];
    const opponentSymbol = this.symbols[this.turnIndex === 0 ? 1 : 0];
    
    let move = this.machineStrategicMove(currentPlayerSymbol);
    if (move === -1) {
      move = this.machineStrategicMove(opponentSymbol);
    }
    if (move === -1) {
      move = this.machineRandomMove();
    }
    this.makePlay(move);
  },

  machineStrategicMove(symbol) {
    for (let i = 0; i < this.sequences.length; i++) {
      let score = 0;
      let emptyPosition = -1;
    
      for (let j = 0; j < 3; j++) {
        const position = this.sequences[i][j];
        if (this.board[position] === symbol) {
          score++;
        } else if (this.board[position] === '') {
          emptyPosition = position;
        }
      }
    
      if (score === 2 && emptyPosition !== -1) {
        return emptyPosition;
      }
    }
    return -1;
  },

  machineRandomMove() {
    let emptyPositions = [];
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === '') {
        emptyPositions.push(i);
      }
    }
    return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  },
}

function update() {
  const optionSelect = document.getElementById('change').value;
  
  if (optionSelect == 1) {
    ticTacToe.select = 1;
  } else if(optionSelect == 3) {
    ticTacToe.select = 3
  } else {
    ticTacToe.select = 2;
  }
}

ticTacToe.initialize(container, xInput, oInput, gameNarration);