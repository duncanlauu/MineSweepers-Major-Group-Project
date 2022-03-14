import React, { useState, useEffect } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, FormGroup, Label } from "reactstrap"

import { useNavigate } from "react-router";
import { PostContent, PostTitle, SinglePostContainer } from "./FriendsPageElements";

export default function PersonalPosts(props) {
    console.log(props)
    
    const [myPersonalPosts, setPersonalPosts] = useState("");
    const [commentsUnderPost, setCommentsUnderPost] = useState("")

    const [writtenComment, updateWrittenComment] = useState("dummy")
    const navigate = useNavigate();

    useEffect(() => {
        getPersonalPosts()
    }, []);

    const handleCommentChange = (e) => {
        updateWrittenComment({
          writtenComment, 
          [e.target.name]: e.target.value, 
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

    const getPost = (post_id, e) => {
        axiosInstance
            .get(`posts/${post_id}`)
            .then((res) => {
                //navigate("/log_in/")
                console.log(res.data.post)
                //console.log(writtenComment)
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

    const getCommentsUnderPost = (post_id) => {
        axiosInstance
            .get(`posts/${post_id}/comments/`)
            .then((res) => {
                console.log(res.data.comments)
                const allCommentsUnderPost = res.data.comments;
                setCommentsUnderPost(allCommentsUnderPost)
            })
    }

    const uploadComment = (post_id, e) => {
        console.log(writtenComment.myComment)
        axiosInstance
            .post(`posts/${post_id}/comments/`, {
                content: writtenComment.myComment,
            })
            .then((res) => {
                console.log(res.data)
                // navigate("/home/")
                // navigate("/friends_page/")
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
                                </Row>
                                        
                                <PostContent>
                                    <h4> {personalPost.content} </h4>
                                </PostContent>

                                <div>                                       
                                    <h5> Comment section </h5>
                                    <p> ... </p>
                                    {/* <PostComments personalPost={personalPost}/> */}
                                </div>
                        
                                <Row>
                                     
                                        <Input type="textarea" rows="1"
                                            id="myComment"
                                            name="myComment"
                                            onChange={handleCommentChange}
                                            style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                        />
                                    
                                </Row>
                                <Row>
                                    <Col xs="6">
                                        <Row>
                                            <Button onClick={(e) => uploadComment(personalPost.id, e)}>
                                                <p> Send </p>
                                            </Button>
                                        </Row>
                                        
                                    </Col>
                                    <Col xs="3">
                                        <Button onClick={(e) => getCommentsUnderPost(personalPost.id, e)}>
                                            <p> Show </p>
                                        </Button>
                                    </Col>

                                </Row>
                                      
                                <Row>
                                    <Button onClick={(e) => getPost(personalPost.id)}>
                                        <p> Get Info </p>
                                    </Button>
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
