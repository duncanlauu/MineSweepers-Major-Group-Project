import axiosInstance from './axios';
import React, {useState, useEffect} from "react";
import {BrowserRouter} from "react-router-dom";

// custom hook for getting the logged in user
export default function useGetUser() {
    const [user, setUser] = useState("");

    const getUser = (e) => {
        axiosInstance.get('/get_current_user/').then(response => { // use .then to make react wait for response
            const user = response.data;
            console.log(response.data)
            setUser(user);
            return user;
        }).catch(error => {
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        })
    }

    useEffect(() => {
        getUser();
    }, []); // get the user when the page loads

    return user;
}

function wrapComponent(component) {
    return <BrowserRouter>{component}</BrowserRouter>
}