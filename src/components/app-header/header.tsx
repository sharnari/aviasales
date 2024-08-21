import styles from "./header.module.scss";
import logo from "../../assets/Logo.png";

const HeaderApp: React.FC = () => {
  return (
    <header className={styles.height}>
      <div className={styles.positionLogo}>
        <img src={logo} alt="logo Aviasales" />
      </div>
    </header>
  );
};

export default HeaderApp;
