import { Link } from 'react-router-dom';
import styles from './Public.module.css';

const Public = () => {
    return (
        <section className={styles['public']}>
            <header className={styles['public-header']}>
                <h1>Welcome to Store</h1>
            </header>
            <main className={styles['public-main']}>
                <Link className={styles['public-links']} to='/login'>Login</Link>
                <Link className={styles['public-links']} to='/inventory'>Browse Inventory</Link>
            </main>
            <footer className={styles['public-footer']}>
                footer
            </footer>
        </section>
    );
}

export default Public;
