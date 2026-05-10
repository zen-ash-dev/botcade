type Player = 'X' | 'O' | null;

export function calculateWinner(squares: Player[]): Player | 'Draw' {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return squares.includes(null) ? null : 'Draw';
}

export function getBestMove(squares: Player[], aiPlayer: 'O', humanPlayer: 'X'): number {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = aiPlayer;
      let score = minimax(squares, 0, false, aiPlayer, humanPlayer);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(squares: Player[], depth: number, isMaximizing: boolean, aiPlayer: 'O', humanPlayer: 'X'): number {
  const result = calculateWinner(squares);
  if (result === aiPlayer) return 10 - depth;
  if (result === humanPlayer) return depth - 10;
  if (result === 'Draw') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = aiPlayer;
        let score = minimax(squares, depth + 1, false, aiPlayer, humanPlayer);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = humanPlayer;
        let score = minimax(squares, depth + 1, true, aiPlayer, humanPlayer);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

export function getRandomMove(squares: Player[]): number {
  const emptyIndices = squares.map((sq, i) => sq === null ? i : null).filter(val => val !== null) as number[];
  if (emptyIndices.length === 0) return -1;
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}
