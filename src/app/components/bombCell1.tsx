import styles from '../page.module.css';

type BombCell1Props = {
  bombCount: number;
  frugCount: number;
};
export default function BombCell1({ bombCount, frugCount }: BombCell1Props) {
  <div
    className={styles.bombCell1}
    style={{
      backgroundPosition:
        bombCount - frugCount < 0
          ? `0px`
          : `${-22.8 * Math.floor((bombCount - frugCount) / 100)}px`,
    }}
  />;
}
