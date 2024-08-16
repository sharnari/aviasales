import React from "react";

import HeaderApp from "../app-header";
import Filter from "../app-filter";
import MenuApp from "../menu-app";
import Ticket from "../ticket"

import styles from "./app.module.scss";

const App: React.FC = () => {
  return (
    <>
      <HeaderApp />
      <main className={styles.mainGrid}>
        <aside className={styles.leftBar}>
          <Filter />
        </aside>
        <section className={styles.contentBar}>
          <MenuApp />
          <div className="tickets">
            <ul className="tickets--list">
              <li className="tickets--list--item">
              <Ticket />
              </li>
            </ul>
            <button className={styles.more}>показать еще 5 билетов!</button>
          </div>
        </section>
      </main>
    </>
  );
};

export default App;
