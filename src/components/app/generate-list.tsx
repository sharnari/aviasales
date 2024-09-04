import React from 'react'
import { useSelector } from 'react-redux'

import { Ticket } from '../../service/service'
import TicketFC from '../ticket'

import styles from './app.module.scss'

interface PropListJSX {
  tickets: Ticket[]
  setButtonMoreStyles: React.Dispatch<React.SetStateAction<string>>
}

interface CheckboxState {
  id: string
  text: string
  isCheck: boolean
}

export const TicketsGenerateJSX: React.FC<PropListJSX> = ({ tickets, setButtonMoreStyles }) => {
  const displayedTicketsCount = useSelector(
    (state: { store: { displayedTicketsCount: number } }) => state.store.displayedTicketsCount
  )
  const status = useSelector((state: { store: { status: string | null } }) => state.store.status)
  let idTickets = 1
  const isFilterChecked = useSelector((state: { store: { filter: CheckboxState[] } }) => state.store.filter)
  const allChecked = isFilterChecked.some((checkbox) => checkbox.isCheck)
  if (tickets.length > 0) {
    const ticketsPuck = tickets.slice(0, displayedTicketsCount)
    if (displayedTicketsCount >= tickets.length) {
      setButtonMoreStyles(styles.none)
    }
    return (
      <React.Fragment>
        {ticketsPuck.map((el) => (
          <li key={idTickets++} className="tickets--list--item">
            <TicketFC info={el} />
          </li>
        ))}
      </React.Fragment>
    )
  } else {
    setButtonMoreStyles(styles.none)
    if (!allChecked) {
      return <p>Рейсов, подходящих под заданные фильтры, не найдено</p>
    }
    return <p>{status}...</p>
  }
}
