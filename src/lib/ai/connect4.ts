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

export function getConnect4BestMove(board: Player[][], aiPlayer: 'Yellow'): number {
  const validColumns = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) validColumns.push(c);
  }

  if (validColumns.length === 0) return -1;
  return validColumns[Math.floor(Math.random() * validColumns.length)];
}
