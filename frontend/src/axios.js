// From https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/axios.js

// Call this file into any component that needs a connection to the API

import axios from "axios";

const baseURL = 'https://book-club-minesweepers.herokuapp.com/api/' // this is the basic API url. Extend this with specific call required.

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 35000, // in case connection is not possible
    // Adjusting to the auth header types specified in settings for JWT:
    headers: {
        Authorization: localStorage.getItem('access_token')
            ? 'JWT ' + localStorage.getItem('access_token') // Retrieving the access token from local storage
            : null,
        'Content-Type': 'application/json',
        accept: 'application/json'
    }
})


// Documentation on interceptors: https://axios-http.com/docs/interceptors
// From https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/axios.js
// when access token becomes invalid, send the refresh token to the api to receive a new access token.

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;

        // if the server is not working
        if (typeof error.response === 'undefined') {
            alert(
                'A server/network error occurred. ' +
                'Looks like CORS might be the problem. ' +
                'Sorry about this - we will get it fixed shortly.'
            );
            return Promise.reject(error);
        }

        // protection from looping and trying to create multiple tokens
        if (
            error.response.status === 401 &&
            originalRequest.url === baseURL + 'token/refresh/'
        ) {
            window.location.href = '/log_in/';
            return Promise.reject(error);
        }

        if (
            error.response.data.code === 'token_not_valid' &&
            error.response.status === 401 &&
            error.response.statusText === 'Unauthorized'
        ) {
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                // exp date in token is expressed in seconds, while now() returns milliseconds:
                const now = Math.ceil(Date.now() / 1000);
                console.log(tokenParts.exp);

                // Getting the new token.
                // 1. Post to api
                // 2. Store new token in local storage
                if (tokenParts.exp > now) {
                    return axiosInstance
                        .post('/token/refresh/', {refresh: refreshToken}) // sending request for new access token. Passing the refresh token.
                        .then((response) => {
                            localStorage.setItem('access_token', response.data.access);
                            localStorage.setItem('refresh_token', response.data.refresh);

                            axiosInstance.defaults.headers['Authorization'] = // update the headers with the new access tokens
                                'JWT ' + response.data.access;
                            originalRequest.headers['Authorization'] =
                                'JWT ' + response.data.access;

                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log('Refresh token is expired', tokenParts.exp, now);
                    window.location.href = '/log_in/';
                }
            } else {
                console.log('Refresh token not available.');
                window.location.href = '/log_in/';
            }
        }

        // specific error handling done elsewhere
        return Promise.reject(error);
    }
);


export default axiosInstance
