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
const randomBombPosition = (
  x: number,
  y: number,
  bombCount: number,
  width: number,
  length: number,
  bomb: number,
) => {
  const positions = new Set<string>();
  const line: [number, number][] = [];
  const getRandomBomb = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  positions.add(`${y},${x}`);
  for (const [dy, dx] of directions) {
    positions.add(`${y + dy},${x + dx}`);
  }

  while (line.length < bomb) {
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
const levelSetFunction = (length: number, length2: number): number[][] => {
  const twoDimensionalArray: number[][] = Array.from({ length: length2 }, () =>
    Array.from({ length }, () => 0),
  );
  return twoDimensionalArray;
};
const levelSetFunction_setBoard = (length: number, length2: number): number[][] => {
  const twoDimensionalArray_setBoard: number[][] = Array.from({ length: length2 }, () =>
    Array.from({ length }, () => 1),
  );
  return twoDimensionalArray_setBoard;
};

const repeatOpen = (
  x: number,
  y: number,
  openBoard: number[][],
  bombMap: number[][],
  width: number,
  length: number,
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
      repeatOpen(nx, ny, openBoard, bombMap, width, length, visited);
    }
  }
};
const resetFunction = (
  userInputs: number[][],
  bombMap: number[][],
  board: number[][],
  width: number,
  length: number,
) => {
  for (let y = 0; y < length; y++) {
    for (let x = 0; x < width; x++) {
      userInputs[y][x] = 0;
      bombMap[y][x] = 0;
      board[y][x] = 1;
    }
  }
  return;
};
type CallState = 'playGame' | 'clearGame' | 'gameOver';
let state: CallState = 'playGame';
const gameState = (): string => {
  if (state === 'playGame') {
    return `${-517}px ${0}px`;
  }
  if (state === 'clearGame') {
    return `${-564}px ${0}px`;
  } else return `${-611}px ${0}px`;
};

const gameClearPosition = () => {
  return;
};
const gameOverPosition = () => {
  return;
};

export default function Home() {
  const [lengthCustom, setLengthCustom] = useState(9);
  const [widthCustom, setWidthCustom] = useState(9);
  const [bombCount, setBombCount] = useState(10);
  const [userInputs, setUserInput] = useState<number[][]>(
    levelSetFunction(widthCustom, lengthCustom),
  );
  const [bombMap, setBombMap] = useState<number[][]>(levelSetFunction(widthCustom, lengthCustom));
  const [board, setBoard] = useState<number[][]>(
    levelSetFunction_setBoard(widthCustom, lengthCustom),
  );
  //タイマー
  const [count, setCount] = useState(0);
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

  //3段階難易度
  const levelSet1 = () => {
    state = 'playGame';
    resetButton();
    setLengthCustom(9);
    setWidthCustom(9);
    setBombCount(10);
    setUserInput(levelSetFunction(9, 9));
    setBombMap(levelSetFunction(9, 9));
    setBoard(levelSetFunction_setBoard(9, 9));
  };
  const levelSet2 = () => {
    state = 'playGame';
    resetButton();
    setLengthCustom(16);
    setWidthCustom(16);
    setBombCount(40);
    setUserInput(levelSetFunction(16, 16));
    setBombMap(levelSetFunction(16, 16));
    setBoard(levelSetFunction_setBoard(16, 16));
  };
  const levelSet3 = () => {
    state = 'playGame';
    resetButton();
    setLengthCustom(16);
    setWidthCustom(30);
    setBombCount(99);
    setUserInput(levelSetFunction(30, 16));
    setBombMap(levelSetFunction(30, 16));
    setBoard(levelSetFunction_setBoard(30, 16));
  };

  const resetButton = () => {
    state = 'playGame';
    stopTimer();
    setCount(0);
    intervalRef.current = null;
    const newUserInputs = structuredClone(userInputs);
    const newBombMap = structuredClone(bombMap);
    const newBoard = structuredClone(board);
    resetFunction(newUserInputs, newBombMap, newBoard, widthCustom, lengthCustom);
    setUserInput(newUserInputs);
    setBombMap(newBombMap);
    setBoard(newBoard);
    return;
  };

  if (bombMap.flat().filter((i) => i === 0).length !== widthCustom * lengthCustom) {
    startTimer();
  }

  //左クリック動作
  const clickHandler = (x: number, y: number) => {
    const newUserInputs = structuredClone(userInputs);
    const newBombMap = structuredClone(bombMap);
    if (bombMap.flat().filter((i) => i === 0).length === widthCustom * lengthCustom) {
      //ボムの周りの数字を生成
      const bomb = randomBombPosition(x, y, bombCount, widthCustom, lengthCustom, bombCount);
      for (const [ky, kx] of bomb) {
        newBombMap[ky][kx] = 11;
      }
      for (let y = 0; y < lengthCustom; y++) {
        for (let x = 0; x < widthCustom; x++) {
          if (newBombMap[y][x] === 0) {
            let bombCheck = 0;
            for (const [dy, dx] of directions) {
              const ny = y + dy;
              const nx = x + dx;
              if (
                ny >= 0 &&
                ny < lengthCustom &&
                nx >= 0 &&
                nx < widthCustom &&
                newBombMap[ny][nx] === 11
              ) {
                bombCheck++;
              }
            }
            newBombMap[y][x] = bombCheck;
          }
        }
      }
      repeatOpen(x, y, newUserInputs, newBombMap, widthCustom, lengthCustom);

      setUserInput(newUserInputs);
      setBombMap(newBombMap);
      setBoard(newBombMap);
    }
    if (userInputs[y][x] !== 1) {
      newUserInputs[y][x] = 3;
      repeatOpen(x, y, newUserInputs, board, widthCustom, lengthCustom);
      if (bombMap[y][x] === 11) {
        state = 'gameOver';
        stopTimer();
        gameOverPosition();
        alert('ゲームオーバー');
        for (let ky = 0; ky < lengthCustom; ky++) {
          for (let kx = 0; kx < widthCustom; kx++) {
            if (bombMap[ky][kx] === 11) {
              newUserInputs[ky][kx] = 3;
            }
          }
        }
        newUserInputs[y][x] = 4;
        setUserInput(newUserInputs);
      }
      setUserInput(newUserInputs);
    }
    let check = 0;
    for (let ky = 0; ky < lengthCustom; ky++) {
      for (let kx = 0; kx < widthCustom; kx++) {
        if (userInputs[ky][kx] === 3) {
          check++;
        }
      }
    }
    if (check === lengthCustom * widthCustom - bombCount - 1) {
      state = 'clearGame';
      stopTimer();
      gameClearPosition();
      alert('ゲームクリア');
    }
  };
  const frugCount = userInputs.flat().filter((i) => i === 1).length;

  //右クリック動作
  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    const newUserInputs = structuredClone(userInputs);
    if (userInputs[y][x] !== 3) {
      userInputs[y][x]++;
      newUserInputs[y][x] = userInputs[y][x] % 3;
      setUserInput(newUserInputs);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.customBoard}>
        <form
          style={{ marginBottom: `20px` }}
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const w = Number((form.elements.namedItem('width') as HTMLInputElement).value);
            const l = Number((form.elements.namedItem('length') as HTMLInputElement).value);
            const b = Number((form.elements.namedItem('bomb') as HTMLInputElement).value);
            if (w > 0 && l > 0 && b > 0 && b < w * l) {
              setWidthCustom(w);
              setLengthCustom(l);
              setBombCount(b);
              resetButton();
              setUserInput(levelSetFunction(w, l));
              setBombMap(levelSetFunction(w, l));
              setBoard(levelSetFunction_setBoard(w, l));
            } else {
              alert('正しい値を入力してください');
            }
          }}
        >
          <span>
            <label>
              幅
              <input type="number" name="width" defaultValue={widthCustom} min={1} max={100} />
            </label>
            <label>
              高さ
              <input type="number" name="length" defaultValue={lengthCustom} min={1} max={100} />
            </label>
            <label>
              爆弾数
              <input type="number" name="bomb" defaultValue={bombCount} min={1} max={10000} />
            </label>
            <button type="submit">更新</button>
          </span>
        </form>
      </div>
      <div className={styles.levelBoard}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            levelSet1();
          }}
          style={{ color: ` #5e8bec` }}
        >
          初級
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            levelSet2();
          }}
          style={{ color: ` #5e8bec` }}
        >
          中級
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            levelSet3();
          }}
          style={{ color: ` #5e8bec` }}
        >
          上級
        </a>
      </div>

      <div
        className={styles.bigMatherBoard}
        style={{ width: `${40 + 30 * widthCustom}px`, height: `${120 + 30 * lengthCustom}px` }}
      >
        <div
          className={styles.allBoard}
          style={{ width: `${10 + 30 * widthCustom}px`, height: `${90 + 30 * lengthCustom}px` }}
        >
          <div className={styles.timeSmileBoard} style={{ width: `${10 + 30 * widthCustom}px` }}>
            <div className={styles.bombCountBoard}>
              <div
                className={styles.bombCell1}
                style={{
                  backgroundPosition:
                    bombCount - frugCount < 0
                      ? `0px`
                      : `${-22.8 * Math.floor((bombCount - frugCount) / 100)}px`,
                }}
              />
              <div
                className={styles.bombCell2}
                style={{
                  backgroundPosition:
                    bombCount - frugCount < 0
                      ? `0px`
                      : `${-22.8 * Math.floor((bombCount - frugCount - Math.floor((bombCount - frugCount) / 100) * 100) / 10)}px`,
                }}
              />
              <div
                className={styles.bombCell3}
                style={{
                  backgroundPosition:
                    bombCount - frugCount < 0
                      ? `0px`
                      : `${-22.8 * (bombCount - frugCount - Math.floor((bombCount - frugCount) / 10) * 10)}px`,
                }}
              />
            </div>
            <div className={styles.boardCell2}>
              <div className={styles.cell2}>
                <div
                  className={styles.smileCell}
                  onClick={resetButton}
                  style={{
                    backgroundPosition: gameState(),
                  }}
                />
              </div>
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
          <div
            className={styles.borderBoard1}
            style={{ width: `${10 + 30 * widthCustom}px`, height: `${10 + 30 * lengthCustom}px` }}
          >
            <div
              className={styles.inputBoard}
              style={{ width: `${30 * widthCustom}px`, height: `${30 * lengthCustom}px` }}
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
                      backgroundColor: userInputs[y][x] === 4 ? `#ff0000` : `#c6c6c6`,
                    }}
                  >
                    <div
                      className={styles.boardCell}
                      style={{
                        opacity: userInputs[y][x] === 3 || userInputs[y][x] === 4 ? 0 : 1,
                      }}
                    >
                      <div className={styles.cell}>
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
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
