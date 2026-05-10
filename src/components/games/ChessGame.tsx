'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { getBestChessMove } from '@/lib/ai/chess';
import { useProgression } from '@/hooks/useProgression';

type SquareT = `${'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'}${1|2|3|4|5|6|7|8}`;

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState('Your Turn');
  const [selectedSquare, setSelectedSquare] = useState<SquareT | null>(null);
  const [validMoves, setValidMoves] = useState<SquareT[]>([]);
  const { addWin } = useProgression();

  const gameRef = useRef(game);
  gameRef.current = game;

  const clearSelection = useCallback(() => {
    setSelectedSquare(null);
    setValidMoves([]);
  }, []);

  useEffect(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setStatus(`Checkmate — ${game.turn() === 'w' ? 'AI' : 'You'} Win`);
        if (game.turn() === 'b') addWin(300);
      } else if (game.isDraw()) {
        setStatus('Draw');
      } else if (game.isStalemate()) {
        setStatus('Stalemate');
      }
      clearSelection();
    } else {
      clearSelection();
      if (game.turn() === 'b') {
        setStatus('AI Thinking...');
        const timer = setTimeout(() => {
          const g = gameRef.current;
          const copy = new Chess(g.fen());
          const best = getBestChessMove(copy, 3);
          if (best) {
            copy.move(best);
            setGame(copy);
          }
        }, 500);
        return () => clearTimeout(timer);
      } else if (game.isCheck()) {
        setStatus('Check');
      } else {
        setStatus('Your Turn (White)');
      }
    }
  }, [game, addWin, clearSelection]);

  const executeMove = useCallback((from: SquareT, to: SquareT): boolean => {
    const g = gameRef.current;
    if (g.turn() === 'b') return false;
    const copy = new Chess(g.fen());
    try {
      const move = copy.move({ from, to, promotion: 'q' });
      if (move === null) return false;
      setGame(copy);
      return true;
    } catch {
      return false;
    }
  }, []);

  const onDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }): boolean => {
    if (!targetSquare) return false;
    return executeMove(sourceSquare as SquareT, targetSquare as SquareT);
  }, [executeMove]);

  const onSquareClick = useCallback(({ square }: { square: string }) => {
    const g = gameRef.current;
    if (g.turn() === 'b' || g.isGameOver()) return;

    const sq = square as SquareT;

    if (selectedSquare && validMoves.includes(sq)) {
      executeMove(selectedSquare, sq);
      return;
    }

    const piece = g.get(sq);
    if (piece && piece.color === 'w') {
      const moves = g.moves({ square: sq as any, verbose: true }) as any[];
      setSelectedSquare(sq);
      setValidMoves(moves.map(m => m.to as SquareT));
    } else {
      clearSelection();
    }
  }, [selectedSquare, validMoves, executeMove, clearSelection]);

  function getSquareStyles(): Record<string, React.CSSProperties> {
    const styles: Record<string, React.CSSProperties> = {};

    if (selectedSquare) {
      styles[selectedSquare] = {
        background: 'radial-gradient(circle, rgba(99,102,241,0.4), rgba(99,102,241,0.1))',
      };
    }

    for (const sq of validMoves) {
      const piece = game.get(sq as any);
      if (piece) {
        styles[sq] = {
          background: 'radial-gradient(circle, transparent 60%, rgba(79,70,229,0.2) 60%)',
        };
      } else {
        styles[sq] = {
          background: 'radial-gradient(circle, rgba(79,70,229,0.2) 25%, transparent 25%)',
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
              background: 'radial-gradient(circle, rgba(239,68,68,0.4), transparent 70%)',
            };
          }
        }
      }
    }

    return styles;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm w-full max-w-lg mx-auto">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-display text-lg text-neutral-900 tracking-tight">Chess</h2>
        {!game.isGameOver() && (
          <button
            onClick={() => { setGame(new Chess()); clearSelection(); setStatus('Your Turn'); }}
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors font-medium cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div className="w-full max-w-[400px] mb-4 rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
        <Chessboard options={{
          position: game.fen(),
          onPieceDrop: onDrop,
          onSquareClick,
          squareStyles: getSquareStyles(),
          darkSquareStyle: { backgroundColor: '#e8e8e8' },
          lightSquareStyle: { backgroundColor: '#ffffff' },
        }} />
      </div>

      <div className={`px-5 py-2 rounded-full border text-xs font-medium tracking-tight ${
        status.includes('Win') || status.includes('You')
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : status === 'Check'
          ? 'bg-red-50 border-red-200 text-red-600'
          : 'bg-neutral-50 border-neutral-200 text-neutral-600'
      }`}>
        {status}
      </div>

      {game.isGameOver() && (
        <button
          onClick={() => { setGame(new Chess()); clearSelection(); }}
          className="mt-6 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-medium tracking-tight hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Rematch
        </button>
      )}
    </div>
  );
}
