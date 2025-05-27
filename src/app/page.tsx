'use client';
import { useState } from 'react';
import styles from './page.module.css';
// const down = (n: number) => {
//   console.log(n);
//   if (n === 0) {
//     return;
//   } else {
//     return down(n - 1);
//   }
// };
// down(10);
// const sum1 = (n: number): number => {
//   if (n === 0) {
//     return 0;
//   } else {
//     return sum1(n - 1) + n;
//   }
// };

// const sum2 = (n: number, m: number): number => {
//   if (m === n) {
//     return n;
//   } else {
//     return sum2(n, m - 1) + m;
//   }
// };

// const sum3 = (n: number, m: number): number => {
//   return ((n + m) * (m - n + 1)) / 2;
// };

// console.log(sum3(4, 10));

// console.log(sum2(4, 10));

// console.log(sum1(10));
const directions = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
];

const randomBombPosition = (x: number, y: number) => {
  const positions = new Set<string>();
  const line: [number, number][] = [];
  const getRandomBomb = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  positions.add(`${y},${x}`);
  for (const [dy, dx] of directions) {
    positions.add(`${y + dy},${x + dx}`);
  }
  console.log(positions);

  while (line.length < 10) {
    const x_bombPosition = getRandomBomb(0, 8);
    const y_bombPosition = getRandomBomb(0, 8);
    const key = `${y_bombPosition},${x_bombPosition}`;

    if (!positions.has(key)) {
      positions.add(key);
      line.push([y_bombPosition, x_bombPosition]);
    }
  }
  return line;
};

let Maked = true;

export default function Home() {
  const [sampleCounter, setSampleCounter] = useState(0);
  const [numbers, setNumbers] = useState([0, 0, 0, 0, 0]);
  const [userInputs, setUserInput] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const clickHandler = (x: number, y: number) => {
    if (Maked) {
      const newBombMap = structuredClone(bombMap);
      const bomb = randomBombPosition(x, y);
      for (const [ky, kx] of bomb) {
        newBombMap[ky][kx] = 11;
      }
      console.log(bomb);
      console.log(x, y);
      for (const [ny, nx] of directions) {
        console.log(y + ny, x + nx);
      }
      Maked = false;
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          if (newBombMap[y][x] === 0) {
            let bombCheck = 0;
            for (const [dy, dx] of directions) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < 9 && nx >= 0 && nx < 9 && newBombMap[ny][nx] === 11) {
                bombCheck++;
              }
            }
            newBombMap[y][x] = bombCheck;
          }
        }
      }
      setBombMap(newBombMap);
    }

    board[y][x];
  };
  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    console.log('右クリックされた座標:', x, y);
    const newUserInputs = structuredClone(userInputs);
    userInputs[y][x]++;
    console.log('クリック数:', userInputs[y][x]);
    newUserInputs[y][x] = userInputs[y][x] % 3;
    setUserInput(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputBoard}>
        {userInputs.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.samplecell}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
              onContextMenu={(e) => handleRightClick(e, x, y)}
              style={{ backgroundPosition: `${-30 * (bombMap[y][x] - 1)}px` }}
            >
              <div className={styles.boardCell}>
                <div
                  className={styles.userInputsCell}
                  style={{
                    backgroundPosition:
                      userInputs[y][x] === 1
                        ? `-270px`
                        : userInputs[y][x] === 2
                          ? `-240px`
                          : undefined,
                  }}
                >
                  {bombMap[y][x]}
                </div>
              </div>
            </div>
          )),
        )}
      </div>
    </div>
  );
}
