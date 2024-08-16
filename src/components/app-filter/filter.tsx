import styles from "./filter.module.scss";

const Filter = () => {
  return (
    <div className={styles.filter}>
      <h2 className={styles.filterName}>количество пересадок</h2>
      <ul className={styles.filterList}>
        <li className={styles.filterListItem}>
          <input className={styles.inputCheckbox} id="all" type="checkbox" />
          <label htmlFor="all">Все</label>
        </li>
        <li className={styles.filterListItem}>
          <input className={styles.inputCheckbox} type="checkbox" id="no-transfers" />
          <label htmlFor="no-transfers">Без пересадок</label>
        </li>
        <li className={styles.filterListItem}>
          <input className={styles.inputCheckbox} type="checkbox" id="1-transfer" />
          <label htmlFor="1-transfer">1 пересадка</label>
        </li>
        <li className={styles.filterListItem}>
          <input className={styles.inputCheckbox} type="checkbox" id="2-transfers" />
          <label htmlFor="2-transfers">2 пересадка</label>
        </li>
        <li className={styles.filterListItem}>
          <input className={styles.inputCheckbox} type="checkbox" id="3-transfers" />
          <label htmlFor="3-transfers">3 пересадка</label>
        </li>
      </ul>
    </div>
  );
};

export default Filter;
