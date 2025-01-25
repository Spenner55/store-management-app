import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const userRef = useRef();

    const navigate = useNavigate();

    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);

    const handleSubmit = () => {
        setUsername('');
        setPassword('');
        navigate('/dash');
    }

    const content = (
        <section className='public'>
            <header>
                <h1>
                    Employee Login
                </h1>
            </header>
            <main className='login'>
                <form className='form' onSubmit={handleSubmit}>
                    <label htmlFor='username'>Username: </label>
                    <input
                        className='form__input'
                        type='text'
                        id='username'
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete='off'
                        required
                    />

                    <label htmlFor='password'>Password:</label>
                    <input
                        className='form__input'
                        type='password'
                        id='password'
                        onChange={handlePasswordInput}
                        value={password}
                        required
                    />

                    <button className='form__submit-button'>Login</button>
                </form>
            </main>
            <footer>
                <Link to='/'>Back</Link>
            </footer>
        </section>
    )

    return content;
}

export default Login;