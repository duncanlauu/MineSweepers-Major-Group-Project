import React, {useEffect} from 'react';
import axiosInstance from '../../axios';
import {useNavigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useHasRated from '../hooks/useHasRated';

export default function Logout() {
    const {setAuth} = useAuth();
    const {setHasRated} = useHasRated()
    const navigate = useNavigate();

    useEffect(() => {
        const response = axiosInstance.post('user/log_out/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        localStorage.clear()
        setAuth({});
        // setAuth({ user: undefined });
        setHasRated({})
        axiosInstance.defaults.headers['Authorization'] = null; // remove the headers
        navigate('/')
        window.location.reload()
    });

    return <div>Logout</div>;
}