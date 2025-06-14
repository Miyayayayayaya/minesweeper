'use client';
import { useRef, useState } from 'react';
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
let width = 9;
let length = 9;
const randomBombPosition = (x: number, y: number, bombCount: number) => {
  const positions = new Set<string>();
  const line: [number, number][] = [];
  const getRandomBomb = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  positions.add(`${y},${x}`);
  for (const [dy, dx] of directions) {
    positions.add(`${y + dy},${x + dx}`);
  }

  while (line.length < bombCount) {
    const x_bombPosition = getRandomBomb(0, width - 1);
    const y_bombPosition = getRandomBomb(0, length - 1);
    const key = `${y_bombPosition},${x_bombPosition}`;

    if (!positions.has(key)) {
      positions.add(key);
      line.push([y_bombPosition, x_bombPosition]);
    }
  }
  return line;
};

const levelSet1 = () => {
  width = 9;
  length = 9;
  // console.log(length);
  return levelSetFunction(width, length);
};
const levelSet2 = () => {
  width = 16;
  length = 16;
  // console.log(length);
  return levelSetFunction(width, length);
};
const levelSet3 = () => {
  width = 30;
  length = 16;
  // console.log(length);
  return levelSetFunction(width, length);
};
const levelSetFunction = (length: number, length2: number): number[][] => {
  const twoDimensionalArray: number[][] = Array.from({ length: length2 }, () =>
    Array.from({ length }, () => 0),
  );
  // console.log(twoDimensionalArray);
  return twoDimensionalArray;
};
const levelSetFunction_setBoard = (length: number, length2: number): number[][] => {
  const twoDimensionalArray_setBoard: number[][] = Array.from({ length: length2 }, () =>
    Array.from({ length }, () => 1),
  );
  // console.log(twoDimensionalArray_setBoard);
  return twoDimensionalArray_setBoard;
};

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
    if (ny >= 0 && ny < length && nx >= 0 && nx < width) {
      openBoard[ny][nx] = 3;
    }
    if (ny >= 0 && ny < length && nx >= 0 && nx < width) {
      repeatOpen(nx, ny, openBoard, bombMap, visited);
    }
  }
};
const resetFunction = (userInputs: number[][], bombMap: number[][], board: number[][]) => {
  for (let y = 0; y < length; y++) {
    for (let x = 0; x < width; x++) {
      userInputs[y][x] = 0;
      bombMap[y][x] = 0;
      board[y][x] = 1;
    }
  }
  return;
};
export default function Home() {
  const [userInputs, setUserInput] = useState<number[][]>(levelSet1());
  const [bombMap, setBombMap] = useState<number[][]>(levelSet1());
  const [board, setBoard] = useState<number[][]>(levelSetFunction_setBoard(width, length));
  //タイマー
  const [count, setCount] = useState(0);
  const [bombCount, setBombCount] = useState(10);
  const [custom, setCustom] = useState([[9], [9]]);

  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000);
      return;
    }
  };
  const stopTimer = () => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
  };

  const resetButton = () => {
    stopTimer();
    setCount(0);
    intervalRef.current = null;
    const newUserInputs = structuredClone(userInputs);
    const newBombMap = structuredClone(bombMap);
    const newBoard = structuredClone(board);
    resetFunction(newUserInputs, newBombMap, newBoard);
    setUserInput(newUserInputs);
    setBombMap(newBombMap);
    setBoard(newBoard);
    return;
  };
  if (bombMap.flat().filter((i) => i === 0).length !== width * length) {
    startTimer();
  }
  //左クリック動作
  const clickHandler = (x: number, y: number) => {
    const newUserInputs = structuredClone(userInputs);
    const newBombMap = structuredClone(bombMap);
    if (bombMap.flat().filter((i) => i === 0).length === width * length) {
      //ボムの周りの数字を生成
      const bomb = randomBombPosition(x, y, bombCount);
      for (const [ky, kx] of bomb) {
        newBombMap[ky][kx] = 11;
      }
      for (let y = 0; y < length; y++) {
        for (let x = 0; x < width; x++) {
          if (newBombMap[y][x] === 0) {
            let bombCheck = 0;
            for (const [dy, dx] of directions) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < length && nx >= 0 && nx < width && newBombMap[ny][nx] === 11) {
                bombCheck++;
              }
            }
            newBombMap[y][x] = bombCheck;
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
      if (bombMap[y][x] === 11) {
        stopTimer();
        alert('ゲームオーバー');
        for (let ky = 0; ky < length; ky++) {
          for (let kx = 0; kx < width; kx++) {
            if (bombMap[ky][kx] === 11) {
              newUserInputs[ky][kx] = 3;
            }
          }
        }
      }
      setUserInput(newUserInputs);
    }
  };

  //右クリック動作
  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    const newUserInputs = structuredClone(userInputs);
    if (userInputs[y][x] !== 3) {
      userInputs[y][x]++;
      newUserInputs[y][x] = userInputs[y][x] % 3;
      setUserInput(newUserInputs);
    }
    let CorrectFrug = 0;

    for (let ky = 0; ky < length; ky++) {
      for (let kx = 0; kx < width; kx++) {
        if (bombMap[ky][kx] === 11 && userInputs[ky][kx] === 1) {
          CorrectFrug++;
          if (CorrectFrug === 10) {
            alert('ゲームクリア');
          }
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <form
        style={{ marginBottom: `20px` }}
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const w = Number((form.elements.namedItem('width') as HTMLInputElement).value);
          const l = Number((form.elements.namedItem('length') as HTMLInputElement).value);
          const b = Number((form.elements.namedItem('bomb') as HTMLInputElement).value);
          if (w > 0 && l > 0 && b > 0 && b < w * l) {
            width = w;
            length = l;
            setBombCount(b);
            setUserInput(levelSetFunction(width, length));
            setBombMap(levelSetFunction(width, length));
            setBoard(levelSetFunction_setBoard(width, length));
            resetButton();
            console.log('よこ', width);
            console.log('たて', length);
            console.log('array', levelSetFunction(width, length));
          } else {
            alert('正しい値を入力してください');
          }
        }}
      >
        <span>
          <label>
            幅
            <input type="number" name="width" defaultValue={width} min={1} max={100} />
          </label>
          <label>
            高さ
            <input type="number" name="length" defaultValue={length} min={1} max={100} />
          </label>
          <label>
            爆弾数
            <input type="number" name="bomb" defaultValue={bombCount} min={1} max={10000} />
          </label>
          <button type="submit">更新</button>
        </span>
      </form>
      <div className={styles.levelBoard}>
        <div className={styles.level1} onClick={levelSet1}>
          初級
        </div>
        <div className={styles.level2} onClick={levelSet2}>
          中級
        </div>
        <div className={styles.level3} onClick={levelSet3}>
          上級
        </div>
      </div>

      <div className={styles.bigMatherBoard}>
        <div className={styles.allBoard}>
          <div className={styles.timeSmileBoard}>
            <div className={styles.bombCountBoard}>
              <div className={styles.bombCell1} />
              <div className={styles.bombCell2} />
              <div className={styles.bombCell3} />
            </div>
            <div className={styles.boardCell2}>
              <div
                className={styles.smileCell}
                onClick={resetButton}
                style={{
                  backgroundPosition: `-530px`,
                }}
              />
            </div>
            <div className={styles.timeBoard}>
              <div
                className={styles.timerCell1}
                style={{
                  backgroundPosition: `${-22.8 * Math.floor(count / 100)}px`,
                }}
              />
              <div
                className={styles.timerCell2}
                style={{
                  backgroundPosition: `${-22.8 * Math.floor((count - Math.floor(count / 100) * 100) / 10)}px`,
                }}
              />
              <div
                className={styles.timerCell3}
                style={{
                  backgroundPosition: `${-22.8 * (count - Math.floor(count / 10) * 10)}px`,
                }}
              />
            </div>
          </div>
          <div className={styles.borderBoard1}>
            <div className={styles.onTheCellBoard}>
              <div
                className={styles.inputBoard}
                style={{ width: `${30 * width}px`, height: `${30 * length}` }}
              >
                {board.map((row, y) =>
                  row.map((color, x) => (
                    <div
                      className={styles.samplecell}
                      key={`${x}-${y}`}
                      onClick={() => {
                        clickHandler(x, y);
                      }}
                      onContextMenu={(e) => handleRightClick(e, x, y)}
                      style={{
                        backgroundPosition: `${-30 * (bombMap[y][x] - 1)}px`,
                        backgroundColor: color === 11 ? `ff0000` : undefined,
                      }}
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
        </div>
      </div>
    </div>
  );
}
