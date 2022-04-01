// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React from 'react';
import {NavLink} from 'react-router-dom';
import Gravatar from 'react-gravatar';
import { MessageProfile, MessagingDisplay, MessagingProfileHeading, MessagingProfilePara, SidePanelTextPreview } from './ChatElements';
import { Col } from 'reactstrap'

const Contact = (props) => (
    <NavLink to={`${props.chatURL}`} style={{color: '#fff'}}>
        <li className="contact">
            <div className='wrap'>
                <MessageProfile>
                    <Col xs={3}>
                        <Gravatar email={props.gravatar} size={50} />
                    </Col>
                    <Col xs={9} style={{ marginLeft:"1rem" }}>
                        <MessagingDisplay>
                            <MessagingProfileHeading className='name'>{props.name}</MessagingProfileHeading>
                            {props.lastMessage && props.lastMessage.length > 25 ? <SidePanelTextPreview className='preview'>{props.lastMessage.slice(0,25)}...</SidePanelTextPreview> : <></>}
                            {props.lastMessage && props.lastMessage.length <= 25 ? <SidePanelTextPreview className='preview'>{props.lastMessage}</SidePanelTextPreview> : <></>}
                            <p>{props.lastUpdated}</p>
                        </MessagingDisplay>
                    </Col>
                </MessageProfile>
            </div>
        </li>
    </NavLink>
);

export default Contact;
