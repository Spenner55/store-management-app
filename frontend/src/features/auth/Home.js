import { Link } from 'react-router-dom';

const Home = () => {
    const content = (
        <section className='Home'>
            <h1>Welcome to Employee Portal</h1>
            <p><Link to='/dash/employees'>View list of co-workers</Link></p>
            <p><Link to='/dash/worklogs'>View list of worklogs</Link></p>
        </section>
    )
    return content;
}

export default Home;