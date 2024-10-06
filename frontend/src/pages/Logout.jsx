
import { logout } from '@/services/storage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/');
    }, []);

    return null;
}

export default Logout;