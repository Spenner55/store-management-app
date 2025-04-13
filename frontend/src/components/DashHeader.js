import { Link } from 'react-router-dom';
import styles from './DashHeader.module.css';

const DashHeader = () => {
    return (
        <header className={styles['dash-header']}>
            <div className={styles['dash-header__container']}>
                <Link to='/' className={styles['dash-header__link']}>
                    <p>Logout</p>
                </Link>
                <Link to='/dash' className={styles['dash-header__link']}>
                    <p>Home</p>
                </Link>
                <nav className={styles['dash-header__nav']}>
                    {/* Navigation links can go here */}
                </nav>
            </div>
        </header>
    );
}

export default DashHeader;
