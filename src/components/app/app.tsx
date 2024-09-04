import React, { useEffect, useState } from 'react'

import { Ticket } from '../../service/service'
import { useDispatch, useSelector } from '../../store'
import { fetchSearchId, fetchTickets, showMoreTickets } from '../../store/filterSlice'
import ErrorAlert from '../alert-error'
import Filter from '../app-filter'
import HeaderApp from '../app-header'
import MenuApp from '../menu-app'

import styles from './app.module.scss'
import { TicketsGenerateJSX } from './generate-list'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const searchId = useSelector((state: { store: { searchId: string | null } }) => state.store.searchId)
  const tickets = useSelector((state: { store: { filteredTickets: Ticket[] } }) => state.store.filteredTickets)
  const displayedTicketsCount = useSelector(
    (state: { store: { displayedTicketsCount: number } }) => state.store.displayedTicketsCount
  )
  const status = useSelector((state: { store: { status: string | null } }) => state.store.status)
  const error = useSelector((state: { store: { error: string | null } }) => state.store.error)
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

  if (isOffline) {
    return <ErrorAlert errorMessage="Нет подключения к интернету. Пожалуйста, проверьте соединение." />
  } else if (error) {
    return <ErrorAlert errorMessage={error} />
  } else if (status === 'loading') {
    return <p>{status}...</p>
  }

  const shouldShowMoreButton = displayedTicketsCount < tickets.length

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
              <TicketsGenerateJSX tickets={tickets} />
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
