import React, { useEffect } from "react";
import { useDispatch, useSelector } from "../../store";
import {
  fetchSearchId,
  fetchTickets,
  showMoreTickets,
} from "../../store/filterSlice";
import { Ticket } from "../../service/service";

import HeaderApp from "../app-header";
import Filter from "../app-filter";
import MenuApp from "../menu-app";
import TicketFC from "../ticket";

import styles from "./app.module.scss";

const App: React.FC = () => {
  let buttonMoreStyles: string = styles.more;
  const dispatch = useDispatch();
  const searchId = useSelector(
    (state: { store: { searchId: string | null } }) => state.store.searchId
  );
  const tickets = useSelector(
    (state: { store: { filteredTickets: Ticket[] } }) =>
      state.store.filteredTickets
  );
  const status = useSelector(
    (state: { store: { status: string | null } }) => state.store.status
  );
  const error = useSelector(
    (state: { store: { error: string | null } }) => state.store.error
  );
  const displayedTicketsCount = useSelector(
    (state: { store: { displayedTicketsCount: number } }) =>
      state.store.displayedTicketsCount
  );

  const ticketsGenerateJSX = () => {
    let idTickets = 1;
    if (tickets.length > 0) {
      const ticketsPuck = tickets.slice(0, displayedTicketsCount);
      if (ticketsPuck.length >= tickets.length) {
        buttonMoreStyles = styles.none;
      }
      return ticketsPuck.map((el) => (
        <li key={idTickets++} className="tickets--list--item">
          <TicketFC info={el} />
        </li>
      ));
    } else {
      buttonMoreStyles = styles.none;
      return <p>Рейсов, подходящих под заданные фильтры, не найдено</p>;
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
            <button
              className={buttonMoreStyles}
              onClick={() => dispatch(showMoreTickets())}
            >
              показать еще 5 билетов!
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default App;
