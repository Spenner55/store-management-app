import { Link } from "react-router-dom";
import styles from './PublicHeader.module.css';

const PublicHeader = () => {
    return (
        <header className={styles['public-header']}>
            <div className={styles['public-header-container']}>
                <div>
                    <Link to='/' className={styles['public-header-home']}>Home</Link>
                </div>
                <nav className={styles['public-header-links']}>
                    <Link to='/inventory'>Browse Inventory</Link>
                    <Link to='/departments'>Departments</Link>
                    <Link to='/store_locator'>Store Locator</Link>
                    <Link to='/careers'>Careers</Link>
                    <Link to='/about'>About Us</Link>

                </nav>
                <div className={styles['public-header-login']}>
                    <Link to='/login' className={styles['public-header-login-link']}>Login</Link>
                </div>
            </div>
        </header>
    )
}

export default PublicHeader;