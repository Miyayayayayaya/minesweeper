'use client';
import { useState } from 'react';
import styles from './page.module.css';
const down = (n: number) => {
  console.log(n);
  if (n === 0) {
    return;
  } else {
    return down(n - 1);
  }
};
down(10);
const sum1 = (n: number): number => {
  if (n === 0) {
    return 0;
  } else {
    return sum1(n - 1) + n;
  }
};

const sum2 = (n: number, m: number): number => {
  if (m === n) {
    return n;
  } else {
    return sum2(n, m - 1) + m;
  }
};

const sum3 = (n: number, m: number): number => {
  return ((n + m) * (m - n + 1)) / 2;
};

console.log(sum3(4, 10));

console.log(sum2(4, 10));

console.log(sum1(10));

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
  const [bombPlace, setBombPlace] = useState([
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

  const clickHandler = () => {
    setSampleCounter((sampleCounter + 1) % 14); //余り
    console.log(sampleCounter);

    const newNumbers = structuredClone(numbers);
    newNumbers[sampleCounter % 5] += 1;
    setNumbers(newNumbers);
    console.log(numbers);
    const calculateTotal = (arr: number[], counter: number) => {
      let total = 0;
      for (let i = 0; i < 5; i++) {
        total += arr[i];
      }
      return total + counter;
    };
    const total = calculateTotal(numbers, sampleCounter);
    console.log(total);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {userInputs.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.samplecell}
              style={{ backgroundPosition: `${-30 * sampleCounter}px` }}
            />
          )),
        )}
      </div>
    </div>
  );
}
