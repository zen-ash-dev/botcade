export const ROWS = 6;
export const COLS = 7;
export type Player = 'Red' | 'Yellow' | null;

export function checkConnect4Win(board: Player[][]): Player | 'Draw' {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let player = board[r][c];
      if (!player) continue;

      if (c + 3 < COLS && player === board[r][c+1] && player === board[r][c+2] && player === board[r][c+3]) return player;
      if (r + 3 < ROWS && player === board[r+1][c] && player === board[r+2][c] && player === board[r+3][c]) return player;
      if (r + 3 < ROWS && c + 3 < COLS && player === board[r+1][c+1] && player === board[r+2][c+2] && player === board[r+3][c+3]) return player;
      if (r - 3 >= 0 && c + 3 < COLS && player === board[r-1][c+1] && player === board[r-2][c+2] && player === board[r-3][c+3]) return player;
    }
  }

  const isDraw = board.every(row => row.every(cell => cell !== null));
  return isDraw ? 'Draw' : null;
}

function simulateDrop(board: Player[][], col: number, player: Player): [Player[][] | null, number] {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === null) {
      const copy = board.map(row => [...row]);
      copy[r][col] = player;
      return [copy, r];
    }
  }
  return [null, -1];
}

function evaluateWindow(window: (Player)[], player: Player): number {
  const opponent: Player = player === 'Yellow' ? 'Red' : 'Yellow';
  let score = 0;
  const pCount = window.filter(c => c === player).length;
  const oCount = window.filter(c => c === opponent).length;
  const emptyCount = window.filter(c => c === null).length;

  if (pCount === 4) score += 100;
  else if (pCount === 3 && emptyCount === 1) score += 10;
  else if (pCount === 2 && emptyCount === 2) score += 3;

  if (oCount === 3 && emptyCount === 1) score -= 50;
  else if (oCount === 2 && emptyCount === 2) score -= 3;

  return score;
}

function scoreBoard(board: Player[][], player: Player): number {
  let score = 0;
  const opponent: Player = player === 'Yellow' ? 'Red' : 'Yellow';

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c + 3 < COLS) {
        const window = [board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]];
        score += evaluateWindow(window, player);
      }
      if (r + 3 < ROWS) {
        const window = [board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]];
        score += evaluateWindow(window, player);
      }
      if (r + 3 < ROWS && c + 3 < COLS) {
        const window = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
        score += evaluateWindow(window, player);
      }
      if (r - 3 >= 0 && c + 3 < COLS) {
        const window = [board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]];
        score += evaluateWindow(window, player);
      }
    }
  }

  const centerCol = Math.floor(COLS / 2);
  for (let r = 0; r < ROWS; r++) {
    if (board[r][centerCol] === player) score += 6;
    if (board[r][centerCol] === opponent) score -= 3;
  }

  return score;
}

function connect4Minimax(board: Player[][], depth: number, alpha: number, beta: number, isMaximizing: boolean, aiPlayer: 'Yellow'): number {
  const validColumns = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) validColumns.push(c);
  }

  const result = checkConnect4Win(board);
  if (result === aiPlayer) return 1000000;
  if (result === 'Draw') return 0;
  if (result !== null) return -1000000;
  if (depth === 0) return scoreBoard(board, aiPlayer);

  if (isMaximizing) {
    let value = -Infinity;
    for (const col of validColumns) {
      const [newBoard] = simulateDrop(board, col, aiPlayer);
      if (!newBoard) continue;
      value = Math.max(value, connect4Minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    const opponent: Player = aiPlayer === 'Yellow' ? 'Red' : 'Yellow';
    let value = Infinity;
    for (const col of validColumns) {
      const [newBoard] = simulateDrop(board, col, opponent);
      if (!newBoard) continue;
      value = Math.min(value, connect4Minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer));
      beta = Math.min(beta, value);
      if (beta <= alpha) break;
    }
    return value;
  }
}

export function getConnect4BestMove(board: Player[][], aiPlayer: 'Yellow'): number {
  const validColumns = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) validColumns.push(c);
  }

  if (validColumns.length === 0) return -1;

  let bestScore = -Infinity;
  let bestCol = validColumns[0];

  for (const col of validColumns) {
    const [newBoard] = simulateDrop(board, col, aiPlayer);
    if (!newBoard) continue;
    const score = connect4Minimax(newBoard, 4, -Infinity, Infinity, false, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }

  return bestCol;
}
