import { useSelector } from "react-redux";
import { jwtDecode } from 'jwt-decode';
import { selectCurrentToken } from "../features/auth/authSlice";

const useAuth = () => {
    const token = useSelector(selectCurrentToken);

    if(!token) return {email: null, role: null};

    try {
        const decoded = jwtDecode(token);
        const email = decoded?.UserInfo?.email;
        const role = decoded?.UserInfo?.role;
        return { email, role };
    }
    catch (err) {
        console.error('Failed to decode token', err);
        return { email: null, role: null };
    }
};

export default useAuth;