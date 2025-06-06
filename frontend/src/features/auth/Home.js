import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    const content = (
        <section className={styles['home']}>
            <div className={styles['home-container']}>
                <h1>Welcome to Employee Portal</h1>
                <div className={styles['links']}>
                    <Link to='/dash/employees'>View list of co-workers</Link>
                    <Link to='/dash/worklogs'>View list of worklogs</Link>
                </div>
            </div>
        </section>
    )
    return content;
}

export default Home;