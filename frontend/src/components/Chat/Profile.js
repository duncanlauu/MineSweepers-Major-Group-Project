// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React from 'react';
import Hoc from './hoc/hoc';

export default function Profile() {
    return (
        <div className="contact-profile">
            {
                localStorage.username !== null ?
                    <Hoc>
                        <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                        <p>{localStorage.username}</p>
                        <div className="social-media">
                            <i className="fa fa-facebook" aria-hidden="true"></i>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                            <i className="fa fa-instagram" aria-hidden="true"></i>
                        </div>
                    </Hoc>
                    :
                    null
            }
        </div>
    )
}
