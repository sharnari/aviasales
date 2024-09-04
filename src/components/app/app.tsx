import React, { useEffect, useState } from 'react'

import { Ticket } from '../../service/service'
import { useDispatch, useSelector } from '../../store'
import { fetchSearchId, fetchTickets, showMoreTickets, CheckboxState } from '../../store/filterSlice'
import ErrorAlert from '../alert-error'
import Filter from '../app-filter'
import HeaderApp from '../app-header'
import MenuApp from '../menu-app'

import styles from './app.module.scss'
import { TicketsGenerateJSX } from './generate-list'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const filter = useSelector((state: { store: { filter: CheckboxState[] } }) => state.store.filter)
  const searchId = useSelector((state: { store: { searchId: string | null } }) => state.store.searchId)
  const tickets = useSelector((state: { store: { tickets: Ticket[] } }) => state.store.tickets)
  const displayedTicketsCount = useSelector(
    (state: { store: { displayedTicketsCount: number } }) => state.store.displayedTicketsCount
  )
  const status = useSelector((state: { store: { status: string | null } }) => state.store.status)
  const error = useSelector((state: { store: { error: string | null } }) => state.store.error)
  const filterTickets = useSelector((state: { store: { filterTickets: string } }) => state.store.filterTickets)
  const [isOffline, setIsOffline] = useState(false)

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

  const applyFiltersAndSort = (tickets: Ticket[]) => {
    const activeFilters = filter.filter((arg) => arg.isCheck && arg.id !== 'all').map((arg) => arg.id)
    if (activeFilters.length === 0) {
      return tickets
    }
    let filteredTickets = tickets
    if (activeFilters.length > 0 && !activeFilters.includes('all')) {
      filteredTickets = filteredTickets.filter((ticket: Ticket) => {
        const stops = ticket.segments[0].stops.length
        return (
          (activeFilters.includes('none') && stops === 0) ||
          (activeFilters.includes('one') && stops === 1) ||
          (activeFilters.includes('two') && stops === 2) ||
          (activeFilters.includes('three') && stops === 3)
        )
      })
    }
    filteredTickets.sort((ticket_1: Ticket, ticket_2: Ticket) => {
      if (filterTickets === 'самый дешевый') {
        return ticket_1.price - ticket_2.price
      } else if (filterTickets === 'самый быстрый') {
        const duration_1 = ticket_1.segments[0].duration + ticket_1.segments[1].duration
        const duration_2 = ticket_2.segments[0].duration + ticket_2.segments[1].duration
        return duration_1 - duration_2
      }
      return 0
    })
    return filteredTickets
  }

  if (isOffline) {
    return <ErrorAlert errorMessage="Нет подключения к интернету. Пожалуйста, проверьте соединение." />
  } else if (error) {
    return <ErrorAlert errorMessage={error} />
  } else if (status === 'loading') {
    return <p>{status}...</p>
  }
  const allChecked = filter.some((checkbox) => checkbox.isCheck)
  const shouldShowMoreButton = displayedTicketsCount < tickets.length && allChecked

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
              <TicketsGenerateJSX tickets={applyFiltersAndSort(tickets)} />
            </ul>
            {shouldShowMoreButton && (
              <button className={styles.more} onClick={() => dispatch(showMoreTickets())}>
                Показать еще 5 билетов!
              </button>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

export default App
