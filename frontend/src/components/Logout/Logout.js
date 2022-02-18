import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const response = axiosInstance.post('user/logout/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        localStorage.removeItem('access_token'); // remove the tokens from local storate
        localStorage.removeItem('refresh_token');
        axiosInstance.defaults.headers['Authorization'] = null; // remove the headers
        navigate('/')
    });

    return <div>Logout</div>;
}