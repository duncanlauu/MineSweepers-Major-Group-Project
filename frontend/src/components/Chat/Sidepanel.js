// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React, { useState, useEffect } from 'react'
import Contact from './Contact';
import axiosInstance from '../../axios'
import Gravatar from 'react-gravatar';
import { ImageDiv, MessagingProfilePara } from './ChatElements';

export default function Sidepanel(props) {

    // const [chats, setChats] = useState([])
    // const chats = props.chats
    // const setChats = props.setChats

    useEffect(() => {
        getUserChats()
    }, []);

    const getUserChats = (e) => {
        const username = JSON.parse(localStorage.getItem('user')).username
        axiosInstance.get(`chat/?username=${username}`)
            .then(res => {
                let userChats = res.data;
                userChats.sort(function (a, b) {
                    return (b.last_update).localeCompare(a.last_update);
                })
                console.log(userChats)
                props.setChats(userChats)
            });

    }

    const activeChats = props.chats.map(c => {
        console.log(c)
        return (
            // <Contact
            //     key={c.id}
            //     name={getChatName(c)}
            //     gravatar={getChatGravatar(c)}
            //     chatURL={`/chat/${c.id}`}
            //     lastMessage={c.last_message}
            //     lastUpdated={c.last_updated}
            // />
            <div key={c.id}>
                {getChatName(c) == "Bookgle User (Left the chat)"
                    ?
                    <div style={{ opacity: "25%" }}>
                        <Contact
                            key={c.id}
                            name={getChatName(c)}
                            gravatar={getChatGravatar(c)}
                            chatURL={`/chat/${c.id}`}
                            lastMessage={c.last_message}
                            lastUpdated={c.last_updated}
                        />
                    </div>
                    :
                    <Contact
                        key={c.id}
                        name={getChatName(c)}
                        gravatar={getChatGravatar(c)}
                        chatURL={`/chat/${c.id}`}
                        lastMessage={c.last_message}
                        lastUpdated={c.last_updated}
                    />
                }
            </div>
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
            } else if (chat.participants.length == 1) {
                chatName = "Bookgle User (Left the chat)"
            }
        } else {
            chatName = chat.name;
        }
        return chatName;
    }

    function getChatGravatar(chat) {
        let gravatar = "undefined";
        if (chat.group_chat == false) {
            console.log(localStorage.username)
            console.log(chat.participants.length)
            if (chat.participants.length == 2) {
                for (const participant of chat.participants) {
                    if (participant.username != localStorage.username) {
                        gravatar = participant.email
                    }
                }
            } else if (chat.participants.length == 1) {
                gravatar = chat.participants[0].email
            }
        } else {
            if (chat.owner_gravatar != "") {
                gravatar = chat.owner_gravatar
            } else {
                gravatar = chat.participants[0].email
            }
        }
        return gravatar;
    }


    return (
        <div id="sidepanel" style={{ height: "100%", overflowY: "scroll" }}>
            <div id="profile">
                {/* <div className="wrap">
                    <ImageDiv>
                        <img id="profile-img" style={{ height:"100%", width:"100%" }} src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="Profile Image"/>
                    </ImageDiv>
                    <Gravatar email='blah@blah.com' style={{ borderRadius:"100px" }} />
                    <p>Lorem Ipsum</p>
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
                </div> */}
            </div>
            {/* <div id="search">
                <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..."/>
            </div> */}
            <div id="contacts">
                <ul>
                    {activeChats.length === 0 ? <>You have no active chats.</> : activeChats}
                </ul>
            </div>
        </div>
    );
}
