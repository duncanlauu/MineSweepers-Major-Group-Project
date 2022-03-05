// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React, { useState, useEffect } from 'react'
import { Spin, Icon } from 'antd';
import { connect } from 'react-redux';
import Contact from './Contact';
import axiosInstance from '../../axios'

// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


export default function Sidepanel(props) {

    const [chats, setChats] = useState([])

    // ? Why are you here
    // componentWillReceiveProps(newProps) {
    //     if (newProps.token !== null && newProps.username !== null) {
    //         getUserChats(newProps.token, newProps.username);
    //     }
    // }

    useEffect(() => {
        getUserChats()
    }, []);


    const getUserChats = (e) => {
        const username = localStorage.username
        axiosInstance.get(`http://127.0.0.1:8000/api/chat/?username=${username}`) //broken
            .then(res => setChats(res.data)); // data type not sure
    }

    const activeChats = chats.map(c => {
        console.log(c)
        return (
            <Contact
                key={c.id}
                name="Chat name"
                picURL="http://emilcarlsson.se/assets/louislitt.png"
                status="busy"
                chatURL={`/chat/${c.id}`} />
        )
    })

    return (
        <div id="sidepanel" >
            <div id="profile">
                <div className="wrap">
                    <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                    <p>Mike Ross</p>
                    <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                    <div id="status-options">
                        <ul>
                            <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                            <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                            <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                            <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="search">
                <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..." />
            </div>
            <div id="contacts">
                <ul>
                    {activeChats}
                </ul>
            </div>
        </div>
    );
}
