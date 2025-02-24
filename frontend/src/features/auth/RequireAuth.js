import { useSelector } from "react-redux";
import jwt_decode from 'jwt-decode';
import { selectCurrentToken } from "./authSlice";

const useAuth = () => {
    const token = useSelector(selectCurrentToken);

    if(!token) return {email: null, role: null};

    try {
        const decoded = jwt_decode(token);
        const email = decoded?.UserInfo?.email;
        const role = decoded?.UserInfo?.role;
        return { email, role };
    }
    catch (err) {
        console.error('Failed to decode token', error);
        return { email: null, role: null };
    }
};

export default useAuth;