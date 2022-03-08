import React from 'react';
import { connect } from 'react-redux';
import WebSocketInstance from '../../websocket';
import Hoc from '../../hoc/hoc';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../axios'

class Chat extends React.Component {

    state = {
        message: '',
        chatID: ''
    }

    currentUser = null;

    initialiseChat() {
        axiosInstance.get('/get_current_user/').then(response => { // use .then to make react wait for response
            const user = response.data;
            console.log(response.data)

            this.currentUser = user.username
            this.waitForSocketConnection(() => {
                WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
                WebSocketInstance.fetchMessages(
                    this.currentUser,
                    this.props.chatID
                );
            });
            console.log("initialise Chat: " + this.props.chatID)
            this.setState({ chatID: this.props.chatID })
            WebSocketInstance.connect(this.props.chatID);
        }).catch(error => {
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        })
    }

    constructor(props) {
        super(props);
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function () {
                if (WebSocketInstance.state() === 1) {
                    console.log("Connection is made");
                    callback();
                    return;
                } else {
                    console.log("wait for connection...");
                    component.waitForSocketConnection(callback);
                }
            }, 100);
    }

    addMessage(message) {
        if (!(JSON.stringify(message) === JSON.stringify(this.state.messages[this.state.messages.length - 1]))) { //fix duplicate messages when sending, horrible implementation
            this.setState({ messages: [...this.state.messages, message] });
        }
    }

    setMessages(messages) {
        this.setState({ messages: messages.reverse() });
    }

    messageChangeHandler = (event) => {
        this.setState({ message: event.target.value });
    }

    sendMessageHandler = (e) => {

        e.preventDefault();
        const messageObject = {
            from: this.currentUser, //broken
            content: this.state.message,
            chatId: this.props.chatID,
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({ message: '' });
    }

    leaveChatHandler = (e) => {
        console.log("BYEE")
        axiosInstance
            .delete(`chat/${this.props.chatID}/leave/`)
            .then((res) => {
                console.log(res)
            })
            .catch(error => console.error(error));
    }

    renderTimestamp = timestamp => {
        let prefix = '';
        const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime()) / 60000);
        if (timeDiff < 1) { // less than one minute ago
            prefix = 'just now...';
        } else if (timeDiff < 60 && timeDiff > 1) { // less than sixty minutes ago
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24 * 60 && timeDiff > 60) { // less than 24 hours ago
            prefix = `${Math.round(timeDiff / 60)} hours ago`;
        } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) { // less than 7 days ago
            prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix
    }

    renderMessages = (messages) => {
        console.log("renderMessages")
        console.log(messages)
        return messages.map((message, i, arr) => (
            <li
                key={message.id}
                style={{ marginBottom: arr.length - 1 === i ? '300px' : '15px' }}
                className={message.author === this.currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png" />
                <p>{message.content}
                    <br />
                    <small>
                        {this.renderTimestamp(message.timestamp)}
                    </small>
                </p>
            </li>
        ));
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.initialiseChat();
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.chatID !== this.state.chatID) {
            WebSocketInstance.disconnect();
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                    this.currentUser,
                    this.state.chatID
                );
            });
            WebSocketInstance.connect(this.state.chatID);
        }
        this.scrollToBottom();
    }

    static getDerivedStateFromProps(newProps, prevState) {
        console.log(newProps.chatID);

        if (newProps.chatID !== prevState.chatID) {
            return { chatID: newProps.chatID };
        } else {
            return null
        }
    }

    render() {
        const messages = this.state.messages;
        return (
            <Hoc>
                <div>
                    <button onClick={this.leaveChatHandler} id="chat-message-submit" className="submit">
                        Leave
                    </button>
                </div>
                <div className="messages">
                    <ul id="chat-log">
                        {
                            messages &&
                            this.renderMessages(messages)
                        }
                        <div style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                required
                                id="chat-message-input"
                                type="text"
                                placeholder="Write your message..." />
                            <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </Hoc>
        );
    };
}

export default Chat