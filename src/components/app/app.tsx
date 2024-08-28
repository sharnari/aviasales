import React, { useEffect } from "react";
import { useDispatch, useSelector } from "../../store";
import { fetchSearchId, fetchTickets } from "../../store/filterSlice";
import { Ticket } from "../../service/service";

import HeaderApp from "../app-header";
import Filter from "../app-filter";
import MenuApp from "../menu-app";
import TicketFC from "../ticket";

import styles from "./app.module.scss";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const searchId = useSelector(
    (state: { store: { searchId: string | null } }) => state.store.searchId
  );
  const tickets = useSelector(
    (state: { store: { tickets: Ticket[] } }) => state.store.tickets
  );
  const status = useSelector(
    (state: { store: { status: string | null } }) => state.store.status
  );
  const error = useSelector(
    (state: { store: { error: string | null } }) => state.store.error
  );

  const ticketsGenerateJSX = () => {
    let idTickets = 1;
    if (tickets) {

      return tickets.map((el) => (
        <li key={idTickets++} className="tickets--list--item">
          <TicketFC info={el} />
        </li>
      ));
    }
  };

  useEffect(() => {
    dispatch(fetchSearchId());
  }, [dispatch]);

  useEffect(() => {
    if (searchId) {
      dispatch(fetchTickets(searchId));
    }
  }, [dispatch, searchId]);

  if (error) {
    return <p>Error</p>;
  } else if (status === "loading") {
    return <p>Loading...</p>;
  }

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
            <ul className="tickets--list">{ticketsGenerateJSX()}</ul>
            <button className={styles.more}>показать еще 5 билетов!</button>
          </div>
        </section>
      </main>
    </>
  );
};

export default App;
