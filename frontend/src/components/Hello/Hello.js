import axiosInstance from "../../axios"
import React, {useState, useEffect} from "react";

export default function Hello(props) {

    const [message, setMessage] = useState("")

    const getMessage = (e) => {
        axiosInstance.get('/hello/').then(response => { // use .then to make react wait for response!!
            const message = response.data.hello; // do sth with the retrieved data
            setMessage(message); // use the useState methods
            return message;
        }).catch(error => {
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        })
    }

    useEffect(() => {
        const messageData1 = getMessage();
        console.log("messageData1: ", JSON.stringify(messageData1, null, 4));
    }, []);

    return (
        <div>
            <p>Hello</p>
            <p>{message}</p>
        </div>
    )
}