import React, { useState, useEffect } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button } from "reactstrap"

import { useNavigate } from "react-router";
import { PostContent, PostTitle, SinglePostContainer } from "./FriendsPageElements";

export default function PersonalPosts(props) {
    console.log(props)
    
    const [myPersonalPosts, setPersonalPosts] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getPersonalPosts()
    }, []);

    const getPersonalPosts = () => {
        axiosInstance
            .get(`posts/`)
            .then((res) => {
                const allPersonalPosts = res.data.posts;
                setPersonalPosts(allPersonalPosts)
                //navigate("/log_in/")
            })
            .catch(error => console.error(error));
    }
    
    const displayPersonalPosts = (e) => {
        if (myPersonalPosts.length > 0) {
            console.log(myPersonalPosts);
            return (
                myPersonalPosts.map((personalPost, index) => {
                    console.log(personalPost);
                    return (
                        <div className="personalPost" key={personalPost.created_at}> 
                            <SinglePostContainer>
                                <Row>
                                    <Col>
                                        <PostTitle>
                                            <h1> {personalPost.title} </h1>
                                        </PostTitle>
                                        <PostContent>
                                            <h3> {personalPost.content} </h3>
                                        </PostContent>
                                    </Col>
                                </Row>
                            </SinglePostContainer>
                        </div>
                    )
                })
            )
        } else {
            return (<h5> You don't have any posts yet. </h5>)

        }
    }
    return (
        <>
            {displayPersonalPosts(props)}
        </>
    )

}
