import { useDispatch, useSelector } from "react-redux";

import { handleRadioChange } from "../../store/filterSlice";
import { StateAviasales } from "../../store/filterSlice";
import styles from "./menu.module.scss";

const MenuApp: React.FC = () => {
  const dispatch = useDispatch();
  const radioSelected = useSelector(
    (state: { store: StateAviasales }) => state.store.filterTickets
  );
  const onRadioChange = (sort: string) => {
    dispatch(handleRadioChange(sort));
  };

  const namesRadio: string[] = [
    "самый дешевый",
    "самый быстрый",
    "оптимальный",
  ];

  const sortMenuItemJSX = () => {
    return namesRadio.map((el: string, index: number) => {
      return (
        <li key={namesRadio[index]} className={styles.menuListItem}>
          <label className={
            styles.fillSpace + ' ' + styles.menuListItem + ' ' +
            (radioSelected === el ? styles.selected : '')
            }>
            <input
              type="radio"
              name="sortSelector"
              value={namesRadio[index]}
              className={styles.radioMenu}
              onChange={() => onRadioChange(el)}
            />
            {namesRadio[index]}
          </label>
        </li>
      );
    });
  };

  return (
    <menu className={styles.menu}>
      <ul className={styles.menuList}>{sortMenuItemJSX()}</ul>
    </menu>
  );
};

export default MenuApp;
