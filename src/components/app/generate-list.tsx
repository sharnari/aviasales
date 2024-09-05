import React from 'react'
import { useSelector } from 'react-redux'

import { Ticket } from '../../service/service'
import ErrorAlert from '../alert-error'
import TicketFC from '../ticket'

interface PropListJSX {
  tickets: Ticket[]
}

interface CheckboxState {
  id: string
  text: string
  isCheck: boolean
}

export const TicketsGenerateJSX: React.FC<PropListJSX> = ({ tickets }) => {
  const displayedTicketsCount = useSelector(
    (state: { store: { displayedTicketsCount: number } }) => state.store.displayedTicketsCount
  )
  const error = useSelector((state: { store: { error: string | null } }) => state.store.error)
  const status = useSelector((state: { store: { status: string | null } }) => state.store.status)
  const isFilterChecked = useSelector((state: { store: { filter: CheckboxState[] } }) => state.store.filter)
  const allChecked = isFilterChecked.some((checkbox) => checkbox.isCheck)
  if (!allChecked) {
    return <p>Рейсов, подходящих под заданные фильтры, не найдено</p>
  }
  if (tickets.length > 0) {
    const ticketsPuck = tickets.slice(0, displayedTicketsCount)
    return (
      <React.Fragment>
        {ticketsPuck.map((el) => (
          <li key={el.id} className="tickets--list--item">
            <TicketFC info={el} />
          </li>
        ))}
      </React.Fragment>
    )
  } else if (error) {
    return <ErrorAlert errorMessage={'Не удалось загрузить ключ доступа('}></ErrorAlert>
  } else return <p>{status}...</p>
}
