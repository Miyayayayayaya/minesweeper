'use client';
import { useState } from 'react';
import styles from './page.module.css';

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

const repeatOpen = (
  x: number,
  y: number,
  openBoard: number[][],
  bombMap: number[][],
  visited = new Set<string>(),
) => {
  const key = `${y},${x}`;
  if (visited.has(key)) return;
  visited.add(key);
  if (bombMap[y][x] !== 0) return;
  openBoard[y][x] = 3;
  for (const [dy, dx] of directions) {
    const ny = y + dy;
    const nx = x + dx;
    if (ny >= 0 && ny < 9 && nx >= 0 && nx < 9) {
      openBoard[ny][nx] = 3;
    }

    if (ny >= 0 && ny < 9 && nx >= 0 && nx < 9) {
      repeatOpen(nx, ny, openBoard, bombMap, visited);
    }
  }
};

export default function Home() {
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
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  //左クリック動作
  const clickHandler = (x: number, y: number) => {
    const newUserInputs = structuredClone(userInputs);

    //ボムの周りの数字を生成
    if (Maked) {
      const newBombMap = structuredClone(bombMap);
      const bomb = randomBombPosition(x, y);
      for (const [ky, kx] of bomb) {
        newBombMap[ky][kx] = 11;
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
            console.log('aaaa', newBombMap);
          }
        }
      }
      repeatOpen(x, y, newUserInputs, newBombMap);

      setUserInput(newUserInputs);
      setBombMap(newBombMap);
      setBoard(newBombMap);
    }
    if (userInputs[y][x] !== 1) {
      newUserInputs[y][x] = 3;
      repeatOpen(x, y, newUserInputs, board);
      setUserInput(newUserInputs);
    }
  };

  //右クリック動作
  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    const newUserInputs = structuredClone(userInputs);
    userInputs[y][x]++;
    newUserInputs[y][x] = userInputs[y][x] % 3;
    setUserInput(newUserInputs);
    let CorrectFrug = 0;
    const frugCounts = userInputs.flat().filter((i) => i === 1).length;
    console.log('旗カウント', frugCounts);

    for (let ky = 0; ky < 9; ky++) {
      for (let kx = 0; kx < 9; kx++) {
        console.log(ky, kx);
        if (bombMap[ky][kx] === 11 && userInputs[ky][kx] === 1) {
          console.log('位置', userInputs[ky][kx]);
          CorrectFrug++;
          console.log('正解', CorrectFrug);
          if (CorrectFrug === 10) {
            alert('ゲームクリア');
          }
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.motherBoard}>
        <div className={styles.inputBoard}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div
                className={styles.samplecell}
                key={`${x}-${y}`}
                onClick={() => clickHandler(x, y)}
                onContextMenu={(e) => handleRightClick(e, x, y)}
                style={{ backgroundPosition: `${-30 * (bombMap[y][x] - 1)}px` }}
              >
                <div
                  className={styles.boardCell}
                  style={{
                    backgroundPosition: userInputs[y][x] === 3 ? `-30px` : undefined,
                  }}
                >
                  <div
                    className={styles.userInputsCell}
                    style={{
                      backgroundPosition:
                        userInputs[y][x] === 1
                          ? `-270px`
                          : userInputs[y][x] === 2
                            ? `-240px`
                            : `30px`,
                    }}
                  />
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
