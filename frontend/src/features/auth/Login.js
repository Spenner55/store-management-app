import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';

const Login = () => {
    const errRef = useRef();
    const userRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleUserInput = (e) => setEmail(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ email, password }).unwrap();
            dispatch(setCredentials({accessToken}));
            setEmail('');
            setPassword('');
            navigate('/dash');
        }
        catch (err) {
            console.log('Error object:', err)
            if(!err.status) {
                setErrMsg('No server response');
            }
            else if(err.status === 400) {
                setErrMsg('Missing Credentials');
            }
            else if(err.status === 401) {
                setErrMsg('Email or Password Incorrect');
            }
            else {
                setErrMsg(err.data?.message);
            }
            if(errRef.current)  {
                errRef.current.focus();
            }
        }
    }

    const errClass = errMsg ? 'errmsg' : 'offscreen';

    if (isLoading) return <p>Loading...</p>

    const content = (
        <section className='public'>
            <header>
                <h1>
                    Employee Login
                </h1>
            </header>
            <main className='login'>
                <p ref={errRef} className={errClass} aria-live='assertive' tabIndex='-1'>{errMsg}</p>
                <form className='form' onSubmit={handleSubmit}>
                    <label htmlFor='email'>email: </label>
                    <input
                        className='form__input'
                        type='text'
                        id='email'
                        ref={userRef}
                        value={email}
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