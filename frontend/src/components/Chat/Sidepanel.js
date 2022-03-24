// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React, {useState, useEffect} from 'react'
import Contact from './Contact';
import axiosInstance from '../../axios'

export default function Sidepanel(props) {

    const [chats, setChats] = useState([])

    useEffect(() => {
        getUserChats()
    }, []);


    const getUserChats = (e) => {
        const username = localStorage.username
        axiosInstance.get(`http://127.0.0.1:8000/api/chat/?username=${username}`)
            .then(res => {
                let userChats = res.data;
                userChats.sort(function (a, b) {
                    return (b.last_update).localeCompare(a.last_update);
                })
                console.log(userChats)
                setChats(userChats)
            });

    }

    const activeChats = chats.map(c => {
        console.log(c)
        return (
            <Contact
                key={c.id}
                name={getChatName(c)}//"asd"//{c.name == "" ? c.name : c.participants}
                picURL={getChatGravatar(c)}
                status="busy" // get rid of?
                chatURL={`/chat/${c.id}`}
                lastMessage={c.last_message}
                lastUpdated={c.last_updated}
            />
        )
    })

    function getChatName(chat) {
        let chatName = "undefined";
        if (chat.group_chat == false) {
            console.log(localStorage.username)
            console.log(chat.participants.length)
            if (chat.participants.length == 2) {
                for (const participant of chat.participants) {
                    if (participant.username != localStorage.username) {
                        chatName = participant.username;
                    }
                }
            }
        } else {
            chatName = chat.name;
        }
        return chatName;
    }

    function getChatGravatar(chat) {
        //TO BE IMPLEMENTED
        return "http://emilcarlsson.se/assets/louislitt.png";
    }

    return (
        <div id="sidepanel">
            <div id="profile">
                <div className="wrap">
                    <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt=""/>
                    <p>Mike Ross</p>
                    <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                    <div id="status-options">
                        <ul>
                            <li id="status-online" className="active"><span className="status-circle"></span>
                                <p>Online</p></li>
                            <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                            <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                            <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="search">
                <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..."/>
            </div>
            <div id="contacts">
                <ul>
                    {activeChats}
                </ul>
            </div>
        </div>
    );
}
