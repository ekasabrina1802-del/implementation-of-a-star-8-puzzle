import { useEffect, useMemo, useState } from 'react';
import './App.css';

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function clone(arr) {
  return [...arr];
}

function arraysEqual(a, b) {
  return a.every((v, i) => v === b[i]);
}

function boardToString(board) {
  return board.join(',');
}

function indexToRC(i) {
  return [Math.floor(i / 3), i % 3];
}

function rcToIndex(r, c) {
  return r * 3 + c;
}

function manhattan(board) {
  let d = 0;
  for (let i = 0; i < 9; i++) {
    const val = board[i];
    if (val === 0) continue;
    const [r1, c1] = indexToRC(i);
    const goalIndex = val - 1;
    const [r2, c2] = indexToRC(goalIndex);
    d += Math.abs(r1 - r2) + Math.abs(c1 - c2);
  }
  return d;
}

function inversionCount(board) {
  const arr = board.filter((v) => v !== 0);
  let inv = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inv++;
    }
  }
  return inv;
}

function isSolvable(board) {
  return inversionCount(board) % 2 === 0;
}

function getNeighbors(board) {
  const zero = board.indexOf(0);
  const [r, c] = indexToRC(zero);

  const dirs = [
    [-1, 0, 'Geser ubin ke bawah'],
    [1, 0, 'Geser ubin ke atas'],
    [0, -1, 'Geser ubin ke kanan'],
    [0, 1, 'Geser ubin ke kiri'],
  ];

  const result = [];
  for (const [dr, dc, label] of dirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
      const ni = rcToIndex(nr, nc);
      const movedTile = board[ni];
      const next = clone(board);
      next[zero] = movedTile;
      next[ni] = 0;
      result.push({ board: next, move: `${label}: ${movedTile}` });
    }
  }
  return result;
}

function aStar(start) {
  if (!isSolvable(start)) {
    return { solvable: false, path: [], moves: [], explored: 0, cost: 0 };
  }

  const open = [
    {
      board: start,
      g: 0,
      h: manhattan(start),
      f: manhattan(start),
      path: [start],
      moves: [],
    },
  ];

  const visited = new Map();
  visited.set(boardToString(start), 0);
  let explored = 0;

  while (open.length) {
    open.sort((a, b) => a.f - b.f || a.h - b.h);
    const current = open.shift();
    explored++;

    if (arraysEqual(current.board, GOAL)) {
      return {
        solvable: true,
        path: current.path,
        moves: current.moves,
        explored,
        cost: current.g,
      };
    }

    for (const next of getNeighbors(current.board)) {
      const g = current.g + 1;
      const key = boardToString(next.board);

      if (!visited.has(key) || g < visited.get(key)) {
        visited.set(key, g);
        const h = manhattan(next.board);
        open.push({
          board: next.board,
          g,
          h,
          f: g + h,
          path: [...current.path, next.board],
          moves: [...current.moves, next.move],
        });
      }
    }
  }

  return { solvable: false, path: [], moves: [], explored, cost: 0 };
}

function parseInput(text) {
  const nums = text.split(/[^0-9]+/).filter(Boolean).map(Number);
  if (nums.length !== 9) return null;

  const set = new Set(nums);
  if (set.size !== 9) return null;

  for (let i = 0; i <= 8; i++) {
    if (!set.has(i)) return null;
  }

  return nums;
}

function Board({ board, step }) {
  return (
    <div className="board">
      {board.map((n, i) => (
        <div
          key={`${step}-${i}-${n}`}
          className={`tile ${n === 0 ? 'empty' : ''}`}
        >
          {n === 0 ? '🌸' : n}
        </div>
      ))}
    </div>
  );
}

function GoalBoard() {
  const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  return (
    <div className="mini-board">
      {goal.map((n, i) => (
        <div key={i} className={`mini-tile ${n === 0 ? 'goal-empty' : ''}`}>
          {n === 0 ? '🌸' : n}
        </div>
      ))}
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="info-box">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState('1 2 3 4 0 6 7 5 8');
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const parsedInput = useMemo(() => parseInput(input), [input]);
  const board = parsedInput || [1, 2, 3, 4, 0, 6, 7, 5, 8];
  const result = useMemo(() => aStar(board), [board]);

  const maxStep = Math.max(0, result.path.length - 1);

  const shownBoard = result.path.length
    ? result.path[Math.min(step, result.path.length - 1)]
    : board;

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [input]);

  useEffect(() => {
    if (!isPlaying) return;
    if (!result.solvable) return;
    if (step >= maxStep) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStep((s) => Math.min(maxStep, s + 1));
    }, 850);

    return () => clearTimeout(timer);
  }, [isPlaying, step, maxStep, result.solvable]);

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">tugas proyek implementasi algoritma searching</p>
        <h1 className="hero-title">
         <span className="hero-text">Implementasi A* pada 8-Puzzle Problem</span>
        </h1>
        <p className="hero-desc">
          Website ini menampilkan simulasi penyelesaian 8-Puzzle menggunakan algoritma
          A* dengan heuristik Manhattan Distance untuk mencari solusi optimal.
        </p>
      </header>

      <div className="grid-layout">
        <section className="card main-card">
          <div className="section-head">
            <h2>Input State Awal</h2>
            <span className="badge">A* Search</span>
          </div>

          <p className="muted">
            Masukkan 9 angka unik dari 0 sampai 8. Angka 0 mewakili kotak kosong.
          </p>

          <input
            className="input-box"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="contoh: 1 2 3 4 0 6 7 5 8"
          />

          <div className="button-row">
            <button
              className="btn primary"
              onClick={() => setStep((s) => Math.min(maxStep, s + 1))}
              disabled={!result.solvable || step >= maxStep || isPlaying}
            >
              Langkah Berikutnya
            </button>

            <button
              className="btn secondary"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={!result.solvable || step === 0 || isPlaying}
            >
              Sebelumnya
            </button>

            <button
              className="btn play"
              onClick={() => {
                if (step >= maxStep) setStep(0);
                setIsPlaying((prev) => !prev);
              }}
              disabled={!result.solvable || maxStep === 0}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              className="btn ghost"
              onClick={() => {
                setInput('1 2 3 4 0 6 7 5 8');
                setStep(0);
                setIsPlaying(false);
              }}
            >
              Reset
            </button>
          </div>

          <div className="status-row">
            {!parsedInput ? (
              <div className="status warning">
                Input belum valid. Masukkan 9 angka unik dari 0 sampai 8.
              </div>
            ) : result.solvable ? (
              <div className="status success">
                Solusi ditemukan dengan <strong>{result.cost}</strong> langkah dan{' '}
                <strong>{result.explored}</strong> node dieksplorasi.
              </div>
            ) : (
              <div className="status danger">
                State valid tetapi tidak solvable karena jumlah inversinya ganjil.
              </div>
            )}
          </div>
        </section>

        <section className="card side-card">
          <div className="section-head">
            <h2>Goal State</h2>
            <span className="badge soft">Target</span>
          </div>
          <GoalBoard />
          <p className="muted small center-text">
            Target akhir: 1 2 3 / 4 5 6 / 7 8 kosong
          </p>
        </section>

        <section className="card board-card">
          <div className="section-head">
            <h2>State Saat Ini</h2>
            <span className="badge soft">Step {step}</span>
          </div>

          <Board board={shownBoard} step={step} />

          <p className="muted center-text">
            Langkah: {step} / {maxStep}
          </p>
        </section>

        <section className="card move-card">
          <div className="section-head">
            <h2>Urutan Pergerakan</h2>
            <span className="badge soft">Output</span>
          </div>

          {result.moves.length ? (
            <ol className="move-list">
              {result.moves.map((move, i) => (
                <li key={i} className={i === step - 1 ? 'active-move' : ''}>
                  {move}
                </li>
              ))}
            </ol>
          ) : (
            <p className="muted">Belum ada langkah untuk ditampilkan.</p>
          )}
        </section>

        <section className="card full-card">
          <div className="section-head">
            <h2>Ringkasan Proyek</h2>
            <span className="badge">sesuai instruksi soal</span>
          </div>

          <div className="summary-grid">
            <InfoCard title="Latar Belakang">
              Algoritma pencarian berperan penting dalam kecerdasan buatan untuk
              menyelesaikan masalah optimasi dan pencarian solusi. Pada proyek ini,
              permasalahan yang dipilih adalah 8-Puzzle Problem.
            </InfoCard>

            <InfoCard title="Studi Kasus">
              8-Puzzle terdiri dari 8 ubin bernomor dan 1 kotak kosong pada grid 3×3.
              Tujuannya adalah menyusun ubin hingga sesuai dengan goal state.
            </InfoCard>

            <InfoCard title="Algoritma yang Digunakan">
              Algoritma yang digunakan adalah A* karena dapat mencari solusi optimal
              dengan bantuan heuristik Manhattan Distance.
            </InfoCard>

            <InfoCard title="Modeling State Space">
              Setiap susunan papan dianggap sebagai state atau node. Pergerakan ubin
              ke posisi kosong menghasilkan state baru yang akan dievaluasi oleh A*.
            </InfoCard>

            <InfoCard title="Hasil Program">
              Program menampilkan state awal, goal state, langkah-langkah penyelesaian,
              jumlah langkah, dan jumlah node yang dieksplorasi.
            </InfoCard>

            <InfoCard title="Kesimpulan Singkat">
              Berdasarkan hasil simulasi, A* mampu menyelesaikan 8-Puzzle secara efisien
              dan menghasilkan solusi yang optimal pada state yang solvable.
            </InfoCard>
          </div>
        </section>
      </div>
    </div>
  );
}