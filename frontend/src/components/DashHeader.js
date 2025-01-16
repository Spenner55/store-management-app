import { Link } from 'react-router-dom';
import styles from './DashHeader.module.css';

const DashHeader = () => {
    return (
        <header className={styles.dashHeader}>
            <div className={styles.dashHeaderContainer}>
                <Link to='/' className={styles.dashHeaderHome}>
                    <h1>Home</h1>
                </Link>
                <nav className={styles.dashHeaderNav}>
                    {/* Navigation links can go here */}
                </nav>
            </div>
        </header>
    );
}

export default DashHeader;
