// src/hooks/useAutoLogin.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authApiSlice';

const useAutoLogin = () => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const doLogin = async () => {
      try {
        const { accessToken } = await login({
          email: process.env.REACT_APP_DEV_EMAIL,
          password: process.env.REACT_APP_DEV_PASS,
        }).unwrap();
        dispatch(setCredentials({ accessToken }));
      } catch {
        console.warn('Dev auto‑login failed');
      }
    };

    doLogin();
  }, [dispatch, login]);
};

export default useAutoLogin;
