import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AxiosInterceptor = () => {
    const { logout } = useAuth();

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [logout]);

    return null;
};

export default AxiosInterceptor;
