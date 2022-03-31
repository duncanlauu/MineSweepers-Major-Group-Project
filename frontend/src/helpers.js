import axiosInstance from './axios';
import React, {useState, useEffect} from "react";

// custom hook for getting the logged in user
export default function useGetUser() {
    const [user, setUser] = useState("");

    const getUser = (e) => {
        axiosInstance.get('/get_current_user/')
        .then(response => { // use .then to make react wait for response
            const user = response.data;
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