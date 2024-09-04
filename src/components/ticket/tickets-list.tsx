import { format, add } from 'date-fns'

import { Ticket } from '../../service/service'

import styles from './ticket.module.scss'

interface PropsTicketInfoJSX {
  indexOrigin: number
  info: Ticket
}

export const TicketInfoJSX: React.FC<PropsTicketInfoJSX> = ({ indexOrigin, info }) => {
  const declensionText = (count: number): string => {
    switch (true) {
      case count === 1:
        return 'пересадка'
      case count === 2 || count === 3 || count === 4:
        return 'пересадки'
      default:
        return 'пересадок'
    }
  }

  const origin = info.segments[indexOrigin].origin
  const destination = info.segments[indexOrigin].destination
  const duration = `${Math.floor(
    info.segments[indexOrigin].duration / 60
  )}Ч ${Math.floor(info.segments[indexOrigin].duration % 60)}М`
  const timeSending: string = format(new Date(info.segments[indexOrigin].date), 'HH:mm')
  const timeArival: string = format(
    add(new Date(info.segments[indexOrigin].date), {
      minutes: info.segments[indexOrigin].duration,
    }),
    'HH:mm'
  )
  const stops = info.segments[indexOrigin].stops.join(', ')
  const stopsCount = info.segments[indexOrigin].stops.length
  return (
    <div key={indexOrigin} className={styles.bottomSide}>
      <div className={styles.routInfo}>
        <div className={styles.routDiffTime}>
          <p className={styles.routTitle}>
            {origin} - {destination}
          </p>
          <p className={styles.routBody}>
            {timeSending} - {timeArival}
          </p>
        </div>
        <div className={styles.routTime}>
          <p className={styles.routTitle}>в пути</p>
          <p className={styles.routBody}> {duration}</p>
        </div>
        <div className={styles.routTransfer}>
          <p className={styles.routTitle}>
            {stopsCount} {declensionText(stopsCount)}
          </p>
          <p className={styles.routBody}>{stops}</p>
        </div>
      </div>
      <div className="routInfo"></div>
    </div>
  )
}
