import { Link } from 'react-router-dom';
import styles from './Public.module.css';

const Public = () => {
    return (
        <section className={styles.public}>
            <header className={styles.publicHeader}>
                <h1>Welcome to Store</h1>
            </header>
            <main className={styles.publicMain}>
                <Link className={styles.publicEmployeeLogin} to='/dash'>Login</Link>
            </main>
            <footer className={styles.publicFooter}>

            </footer>
        </section>
    );
}

export default Public;
