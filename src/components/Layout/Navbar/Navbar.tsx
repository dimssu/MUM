import { Link } from 'react-router-dom';
import { logout } from '../../../api/auth';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          User Management System
        </Link>
        <div className={styles.navLinks}>
          <Link to="/users" className={styles.navLink}>Users</Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 