import { Link } from 'react-router-dom';
import styles from './DashHeader.module.css';

const DashHeader = () => {
    return (
        <header className={styles['dash-header']}>
            <div className={styles['dash-header-container']}>
                <div>
                    <Link to="/dash" className={styles['dash-header-home']}>Home</Link>
                </div>

                <nav className={styles['dash-header-links']}>
                    <Link to="/dash/employees">Employees</Link>
                    <Link to="/dash/worklogs">Worklogs</Link>
                    <Link to="/dash/inventory">Inventory</Link>
                </nav>

                <div className={styles['dash-header-logout']}>
                    <Link to="/" className={styles['dash-header-logout-link']}>Logout</Link>
                </div>
            </div>
        </header>
    );
}

export default DashHeader;
