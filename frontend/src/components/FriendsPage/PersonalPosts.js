import React, { useState, useEffect } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, FormGroup, Label } from "reactstrap"

import { useNavigate } from "react-router";
import { PostContent, PostTitle, SinglePostContainer } from "./FriendsPageElements";
import PostComments from "./PostComments";

export default function PersonalPosts(props) {
    console.log(props)
    
    const [myPersonalPosts, setPersonalPosts] = useState("");
    const [commentsUnderPost, setCommentsUnderPost] = useState("")
    const [writtenComment, updateWrittenComment] = useState("ad")
    const navigate = useNavigate();

    useEffect(() => {
        getPersonalPosts()
    }, []);

    const handleCommentChange = (e) => {
        updateWrittenComment({
          ...writtenComment, 
          [e.target.name]: e.target.value.trim(), 
        })
      }

    const getPersonalPosts = () => {
        axiosInstance
            .get("posts/")
            .then((res) => {
                const allPersonalPosts = res.data.posts;
                setPersonalPosts(allPersonalPosts)
                //navigate("/log_in/")
            })
            .catch(error => console.error(error));
    }

    const getCommentsUnderPost = (post_id) => {
        axiosInstance
            .get(`posts/${post_id}`)
            .then((res) => {
                console.log("comments:")
                console.log(res)
                //const allPersonalPosts = res.data.posts;
                //setPersonalPosts(allPersonalPosts)
                //navigate("/log_in/")
            })
            .catch(error => console.error(error));
    }

    const deletePost = (post_id, e) => {
        axiosInstance
            .delete(`posts/${post_id}`)
            .then((res) => {
                //navigate("/log_in/")
                console.log(res)
                //console.log(writtenComment)
            })
            .catch(error => console.error(error));
    }

    const handleCommentSubmit = (post_id) => {
        axiosInstance
            .post(`posts/${post_id}/comments`, {
                content : writtenComment, 
            })
            .then((res) => {
                console.log(res)
                navigate("/home/")
                navigate("/friends_page/")
            })
    } 

    
    const displayPersonalPosts = (e) => {
        if (myPersonalPosts.length > 0) {
            console.log(myPersonalPosts);
            return (
                myPersonalPosts.map((personalPost, index) => {
                    console.log(personalPost);
                    return (
                        <div className="personalPost" key={personalPost.id}> 
                            <SinglePostContainer>
                                <Row>
                                    <Col>
                                        <PostTitle>
                                            <h2> {personalPost.title} </h2>
                                        </PostTitle>
                                    </Col>
                                    <Col>
                                        <Button name={personalPost.id} onClick={(e) => deletePost(personalPost.id, e)}>
                                             X 
                                        </Button>
                                    </Col>
                                </Row>
                                        
                                <PostContent>
                                    <h4> {personalPost.content} </h4>
                                </PostContent>

                                <div>                                       
                                    <p> Comment section </p>
                                </div>
                        
                                <Row>
                                    <Col xs="8"> 
                                        <Input type="textarea" rows="2"
                                            id="myComment"
                                            name="myComment"
                                            onChange={handleCommentChange}
                                            style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                        />
                                    </Col>
                                    <Col xs="4">
                                        {/* <Button onClick={(e) => handleCommentSubmit(personalPost.id)}>
                                            <p> Send </p>
                                        </Button> */}
                                        <Button onClick={(e) => getCommentsUnderPost(personalPost.id, e)}>
                                            <p> get comments </p>
                                        </Button>
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
