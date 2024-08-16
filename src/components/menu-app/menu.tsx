import React from "react";

import styles from "./menu.module.scss";

const MenuApp: React.FC = () => {
  return (
    <menu className={styles.menu}>
      <ul className={styles.menuList}>
        <label className={styles.menuListItem}>
          <li>
            <input type="radio" name="sortSelector" className={styles.radioMenu} />
            Самый дешевый
          </li>
        </label>
        <label className={styles.menuListItem}>
          <li>
            <input type="radio" name="sortSelector" className={styles.radioMenu} />
            Самый быстрый
          </li>
        </label>
        <label className={styles.menuListItem}>
          <li>
            <input type="radio" name="sortSelector" className={styles.radioMenu} />
            Оптимальный
          </li>
        </label>
      </ul>
    </menu>
  );
};

export default MenuApp;
