import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© {currentYear} User Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 