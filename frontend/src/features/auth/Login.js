import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';

import styles from './Login.module.css';

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
            if(!err.originalStatus) {
                setErrMsg('No server response');
            }
            else if(err.originalStatus === 400) {
                setErrMsg('Missing Credentials');
            }
            else if(err.originalStatus === 401) {
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
        <section className={styles['public']}>
            <header className={styles['public-header']}>
                <h1>
                    Store Employee Login Portal
                </h1>
            </header>
            <main className={styles['main']}>
                <div className={styles['login']}>
                    <h1>Sign In</h1>
                    <p ref={errRef} className={errClass} aria-live='assertive' tabIndex='-1'>{errMsg}</p>
                    <form className={styles['login__form']} onSubmit={handleSubmit}>
                        <div className={styles['form-row']}>
                            <label htmlFor='email'>Email </label>
                            <input
                                type='text'
                                id='email'
                                ref={userRef}
                                value={email}
                                onChange={handleUserInput}
                                autoComplete='off'
                                required
                            />
                        </div>
                        <div className={styles['form-row']}>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                id='password'
                                onChange={handlePasswordInput}
                                value={password}
                                required
                            />
                        </div>

                        <button className={styles['submit-button']}>Login</button>
                    </form>
                </div>
            </main>
            <footer className={styles['public-footer']}>
                <Link to='/'>Back</Link>
            </footer>
        </section>
    )

    return content;
}

export default Login;