import React from 'react'

import aviaLogo from '../../assets/S7 Logo.png'
import Service, { Ticket } from '../../service/service'
import { NumberTransformation } from '../../utils/transform-number'

import styles from './ticket.module.scss'
import { TicketInfoJSX } from './tickets-list'

interface TicketFCProps {
  info: Ticket
}

const TicketFC: React.FC<TicketFCProps> = (props) => {
  const service = new Service()
  const getImage = service.getImage

  const numberService = new NumberTransformation()
  const numberSpace = numberService.spaceDigits

  const { info } = props

  return (
    <div className={styles.container}>
      <div className={styles.topSide}>
        <div className={styles.price}>
          <p>{numberSpace(info.price)} Р</p>
        </div>
        <div className={styles.aviaName}>
          <img src={getImage(info.carrier) || aviaLogo} alt="name of aviacompany" />
        </div>
      </div>
      {[0, 1].map((el) => (
        <div key={el} className={styles.bottomSide}>
          <TicketInfoJSX indexOrigin={el} info={info} />
        </div>
      ))}
    </div>
  )
}

export default TicketFC
