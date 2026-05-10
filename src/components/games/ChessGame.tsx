'use client'

import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { getBestChessMove } from '@/lib/ai/chess';
import { useProgression } from '@/hooks/useProgression';

type SquareT = `${'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'}${1|2|3|4|5|6|7|8}`;

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("YOUR TURN");
  const [selectedSquare, setSelectedSquare] = useState<SquareT | null>(null);
  const [validMoves, setValidMoves] = useState<SquareT[]>([]);
  const { addWin } = useProgression();

  useEffect(() => {
    if (game.isGameOver()) {
      handleGameOver();
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
      if (game.turn() === 'b') {
        setStatus("AI THINKING...");
        const timer = setTimeout(makeAIMove, 500);
        return () => clearTimeout(timer);
      } else if (game.isCheck()) {
        setStatus("CHECK");
      } else {
        setStatus("YOUR TURN (WHITE)");
      }
    }
  }, [game]);

  const handleGameOver = () => {
    if (game.isCheckmate()) {
      setStatus(`CHECKMATE — ${game.turn() === 'w' ? 'AI' : 'YOU'} WIN`);
      if (game.turn() === 'b') addWin(300);
    } else if (game.isDraw()) {
      setStatus("DRAW");
    } else if (game.isStalemate()) {
      setStatus("STALEMATE");
    }
  };

  const makeAIMove = () => {
    const gameCopy = new Chess(game.fen());
    const bestMove = getBestChessMove(gameCopy, 3);
    if (bestMove) {
      gameCopy.move(bestMove);
      setGame(gameCopy);
    }
  };

  const executeMove = useCallback((from: SquareT, to: SquareT) => {
    if (game.turn() === 'b') return false;
    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (move === null) return false;
      setGame(gameCopy);
      setSelectedSquare(null);
      setValidMoves([]);
      return true;
    } catch {
      return false;
    }
  }, [game]);

  function onDrop({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) {
    if (!targetSquare || game.turn() === 'b') return false;
    return executeMove(sourceSquare as SquareT, targetSquare as SquareT);
  }

  function onSquareClick({ square }: { square: string }) {
    if (game.turn() === 'b' || game.isGameOver()) return;

    const sq = square as SquareT;
    const gameCopy = new Chess(game.fen());

    if (selectedSquare && validMoves.includes(sq)) {
      executeMove(selectedSquare, sq);
      return;
    }

    const piece = gameCopy.get(sq);
    if (piece && piece.color === 'w') {
      const moves = gameCopy.moves({ square: sq as any, verbose: true }) as any[];
      setSelectedSquare(sq);
      setValidMoves(moves.map(m => m.to as SquareT));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }

  function getSquareStyles(): Record<string, React.CSSProperties> {
    const styles: Record<string, React.CSSProperties> = {};

    if (selectedSquare) {
      styles[selectedSquare] = {
        background: 'radial-gradient(circle, rgba(124,58,237,0.6), rgba(124,58,237,0.15))',
        boxShadow: 'inset 0 0 12px rgba(124,58,237,0.4)',
      };
    }

    for (const sq of validMoves) {
      const piece = game.get(sq as any);
      if (piece) {
        styles[sq] = {
          background: 'radial-gradient(circle, transparent 60%, rgba(0,255,204,0.35) 60%)',
          boxShadow: 'inset 0 0 8px rgba(0,255,204,0.2)',
        };
      } else {
        styles[sq] = {
          background: 'radial-gradient(circle, rgba(0,255,204,0.35) 25%, transparent 25%)',
        };
      }
    }

    if (game.isCheck() && game.turn() === 'w') {
      const board = game.board();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.type === 'k' && p.color === 'w') {
            const ks = ('abcdefgh'[c] + (8 - r)) as SquareT;
            styles[ks] = {
              ...styles[ks],
              background: 'radial-gradient(circle, rgba(244,63,94,0.5), transparent 70%)',
              boxShadow: 'inset 0 0 12px rgba(244,63,94,0.3)',
            };
          }
        }
      }
    }

    return styles;
  }

  return (
    <div className="flex flex-col items-center p-6 glass-panel rounded-2xl w-full max-w-lg mx-auto">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-display text-lg text-white tracking-wider">C H E S S</h2>
        {game.turn() === 'w' && !game.isGameOver() && (
          <button
            onClick={() => { setSelectedSquare(null); setValidMoves([]); }}
            className="text-[10px] font-body text-gray-600 hover:text-gray-400 transition-colors tracking-wider"
          >
            CLEAR
          </button>
        )}
      </div>

      <div className="w-full max-w-[400px] mb-4 rounded-lg overflow-hidden border-2 border-white/10 shadow-2xl">
        <Chessboard options={{
          position: game.fen(),
          onPieceDrop: onDrop,
          onSquareClick,
          squareStyles: getSquareStyles(),
          darkSquareStyle: { backgroundColor: '#1a1a35' },
          lightSquareStyle: { backgroundColor: '#2a2a50' },
        }} />
      </div>

      <div className={`px-5 py-2 rounded-full border font-body text-xs tracking-wider ${
        status.includes('CHECKMATE') || status.includes('YOU') || status.includes('AI')
          ? 'bg-neon-green/10 border-neon-green/20 text-neon-green'
          : status === 'CHECK'
          ? 'bg-neon-rose/10 border-neon-rose/20 text-neon-rose'
          : 'bg-dark-800/80 border-white/5 text-neon-purple-light'
      }`}>
        {status}
      </div>

      {game.isGameOver() && (
        <button
          onClick={() => { setGame(new Chess()); setSelectedSquare(null); setValidMoves([]); }}
          className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-rose text-white text-xs font-display tracking-wider hover:shadow-neon-purple transition-shadow duration-300"
        >
          REMATCH
        </button>
      )}
    </div>
  );
}
