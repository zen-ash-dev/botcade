export function isValid(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

function solve(board: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function solveSudoku(board: number[][]): number[][] | null {
  const copy = board.map(row => [...row]);
  if (solve(copy)) return copy;
  return null;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateSolvedBoard(): number[][] {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(board);
  return board;
}

export function generateSudokuBoard(difficulty: 'Easy' | 'Medium' | 'Hard'): number[][] {
  const solved = generateSolvedBoard();
  const board = solved.map(row => [...row]);

  const removals = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 45 : 55;
  const positions = shuffleArray(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
  );

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= removals) break;
    board[r][c] = 0;
    removed++;
  }

  return board;
}
