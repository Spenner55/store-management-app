import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {

    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState(false);

    const [refresh, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();

    useEffect(() => {

        if(effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                console.log('verifyRefreshToken');
                try {
                    await refresh();
                    setTrueSuccess(true);
                } catch (err) {
                    console.error(err);
                }
            }

            if(!token && persist) verifyRefreshToken();

        }

        return () => effectRan.current = true;
        // eslint-disable-next-line
    }, [])

    let content;

    if (!persist) {
        content = <Outlet />
    } else if (isLoading) {
        content = <p>Loading...</p>
    } else if (isError) {
        content = (
        <p className='errmsg'>
        {error?.data?.message}
        <Link to='/login'>Please login again</Link>
        </p>)
    } else if (isSuccess && trueSuccess) {
        content = <Outlet />
    } else {
        content = <p>Please wait...</p>
    }

    return content;

}

export default PersistLogin;