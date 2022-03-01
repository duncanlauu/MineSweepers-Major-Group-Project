// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React from 'react';
import axios from 'axios';
import { Spin, Icon } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import Contact from './Contact';
import axiosInstance from '../axios'

// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Sidepanel extends React.Component {

    state = {
        chats: [],
        loginForm: true,
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token !== null && newProps.username !== null) {
            this.getUserChats(newProps.token, newProps.username);
        }
    }

    componentDidMount() {
        if (this.props.token !== null && this.props.username !== null) {
            this.getUserChats(this.props.token, this.props.username);
        }
    }

    getUserChats = (token, username) => {
// very bad needs to be changed
      axiosInstance.get('/get_current_user/').then(response => { // use .then to make react wait for response
  				const user = response.data;
  				console.log(response.data)

          axios.defaults.headers = {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`
          };
          axios.get(`http://127.0.0.1:8000/api/chat/?username=${user.username}`) //broken
          .then(res => this.setState({ chats: res.data }));


  		}).catch(error => {
  				console.log("Error: ", JSON.stringify(error, null, 4));
  				throw error;
  		})
    }

    changeForm = () => {
        this.setState({ loginForm: !this.state.loginForm });
    }


    render() {
        const activeChats = this.state.chats.map(c => {
            return (
                <Contact
                    key={c.id}
                    name="Harvey Specter"
                    picURL="http://emilcarlsson.se/assets/louislitt.png"
                    status="busy"
                    chatURL={`/chat/${c.id}`} />
            )
        })
        return (
            <div id="sidepanel">
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
            <div id="bottom-bar">
                <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
                <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
            </div>
            </div>
        );
    };
}

export default Sidepanel
