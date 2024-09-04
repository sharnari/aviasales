import React, { useEffect, useState } from 'react'

import { Ticket } from '../../service/service'
import { useDispatch, useSelector } from '../../store'
import { fetchSearchId, fetchTickets, showMoreTickets } from '../../store/filterSlice'
import ErrorAlert from '../alert-error'
import Filter from '../app-filter'
import HeaderApp from '../app-header'
import MenuApp from '../menu-app'
// import TicketFC from '../ticket'

import styles from './app.module.scss'
import { TicketsGenerateJSX } from './generate-list'

// interface CheckboxState {
//   id: string
//   text: string
//   isCheck: boolean
// }

const App: React.FC = () => {
  const [buttonMoreStyles, setButtonMoreStyles] = useState(styles.more)
  const dispatch = useDispatch()
  const searchId = useSelector((state: { store: { searchId: string | null } }) => state.store.searchId)
  const tickets = useSelector((state: { store: { filteredTickets: Ticket[] } }) => state.store.filteredTickets)
  const status = useSelector((state: { store: { status: string | null } }) => state.store.status)
  const error = useSelector((state: { store: { error: string | null } }) => state.store.error)
  // const displayedTicketsCount = useSelector(
  //   (state: { store: { displayedTicketsCount: number } }) => state.store.displayedTicketsCount
  // )
  // const isFilterChecked = useSelector((state: { store: { filter: CheckboxState[] } }) => state.store.filter)
  // const allChecked = isFilterChecked.some((checkbox) => checkbox.isCheck)

  const [isOffline, setIsOffline] = useState(false)

  // const ticketsGenerateJSX = () => {
  //   let idTickets = 1
  //   if (tickets.length > 0) {
  //     const ticketsPuck = tickets.slice(0, displayedTicketsCount)
  //     if (displayedTicketsCount >= tickets.length) {
  //       buttonMoreStyles = styles.none
  //     }
  //     return ticketsPuck.map((el) => (
  //       <li key={idTickets++} className="tickets--list--item">
  //         <TicketFC info={el} />
  //       </li>
  //     ))
  //   } else {
  //     buttonMoreStyles = styles.none
  //     if (!allChecked) {
  //       return <p>Рейсов, подходящих под заданные фильтры, не найдено</p>
  //     }
  //     return <p>{status}...</p>
  //   }
  // }

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!navigator.onLine) {
      setIsOffline(true)
      return
    }
    dispatch(fetchSearchId())
  }, [dispatch])

  useEffect(() => {
    if (searchId && navigator.onLine) {
      dispatch(fetchTickets(searchId))
    }
  }, [dispatch, searchId])

  if (isOffline) {
    return <ErrorAlert errorMessage="Нет подключения к интернету. Пожалуйста, проверьте соединение." />
  } else if (error) {
    return <ErrorAlert errorMessage={error} />
  } else if (status === 'loading') {
    return <p>{status}...</p>
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
            <ul className="tickets--list">
              <TicketsGenerateJSX tickets={tickets} setButtonMoreStyles={setButtonMoreStyles} />
            </ul>
            <button className={buttonMoreStyles} onClick={() => dispatch(showMoreTickets())}>
              показать еще 5 билетов!
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
