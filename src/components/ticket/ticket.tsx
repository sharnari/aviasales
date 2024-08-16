import React from "react";

import styles from "./ticket.module.scss";
import aviaLogo from "../../assets/S7 Logo.png";

const Ticket: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topSide}>
        <div className={styles.price}>
          <p>13 400 Р</p>
        </div>
        <div className={styles.aviaName}>
          <img src={aviaLogo} alt="name of aviacompany" />
        </div>
      </div>
      <div className={styles.bottomSide}>
        <div className={styles.routInfo}>
          <div className={styles.routDiffTime}>
            <p className={styles.routTitle}>
              mow - hkt
            </p>
            <p className={styles.routBody}>
              10:45 - 08:00
            </p>
          </div>
          <div className={styles.routTime}>
            <p className={styles.routTitle}>
              в пути
            </p>
            <p className={styles.routBody}>
              21ч 15м
            </p>
          </div>
          <div className={styles.routTransfer}>
            <p className={styles.routTitle}>2 пересадки</p>
            <p className={styles.routBody}>hkg, jnb</p>
          </div>
        </div>
        <div className="routInfo"></div>
      </div>
    </div>
  );
};

export default Ticket;
