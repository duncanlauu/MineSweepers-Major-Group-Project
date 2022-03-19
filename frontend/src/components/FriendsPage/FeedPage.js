import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, FormGroup, Label, Card, CardBody, CardTitle, CardText, CardFooter, CardHeader, UncontrolledCollapse } from "reactstrap"

import { useNavigate } from "react-router";
import { PostCommentsSection, PostContent, PostTitle, SinglePostContainer } from "./FriendsPageElements";
import PostComments from "./PostComments";

export default function FeedPage(props) {
    console.log(props)

    //const [myPersonalPosts, setPersonalPosts] = useState("");
    const [myFeedPosts, setFeedPosts] = useState("");
    const [commentsUnderPost, setCommentsUnderPost] = useState("")

    const [writtenComment, updateWrittenComment] = useState("dummy")
    const navigate = useNavigate();

    useEffect(() => {
        getFeedPosts()
    }, []);

    const getFeedPosts = () => {
        axiosInstance
            .get("feed/")
            .then((res) => {
                console.log("feed:")
                console.log(res.data)
                const allFeedPosts = res.data.posts;
                setFeedPosts(allFeedPosts)
                // const allFeedPosts = res.data;
                // setFeedPosts(allFeedPosts)
                //navigate("/log_in/")
            })
            .catch(error => console.error(error));
    }

    const handleCommentChange = (e) => {
        updateWrittenComment({
            writtenComment,
            [e.target.name]: e.target.value,
        })
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

    const getCommentsUnderPost = (post_id) => {
        axiosInstance
            .get(`posts/${post_id}/comments/`)
            .then((res) => {
                console.log(res.data)
                const allCommentsUnderPost = res.data.comments;
                setCommentsUnderPost(allCommentsUnderPost)
            })
    }

    const commentsRef = useRef([]);

    const uploadComment = (post_id, e, index) => {
        console.log(writtenComment.myComment)
        axiosInstance
            .post(`posts/${post_id}/comments/`, {
                content: writtenComment.myComment,
            })
            .then((res) => {
                console.log(res.data)
                const comment = { author: localStorage.username, content: writtenComment.myComment }
                console.log(commentsRef.current[index])
                commentsRef.current[index].addComment(comment)
                console.log("adding post in parent: ", comment)
                // navigate("/home/")
                // navigate("/friends_page/")
                // call setCommentsUnderPost in PostComments
            })
    }

    
    const displayFeedPosts = (e) => {
        if (myFeedPosts.length > 0) {
            console.log(myFeedPosts);
            return (
                myFeedPosts.map((feedPost, index) => {
                    console.log(feedPost);
                    // used to have unique togglers
                    const togglerId = "toggler" + feedPost.id;
                    const HashtagTogglerId = "#" + togglerId;

                    return (
                        <div className="feedPost" key={feedPost.id}>

                            <Card style={{ marginBottom: "1rem", marginRight: "1rem", marginTop: "1rem"}}>
                                <CardHeader>
                                    <h3> @{feedPost.author_id} </h3>
                                </CardHeader>
                                <CardBody>
                                    <CardTitle> <h2> {feedPost.title} </h2> </CardTitle>
                                    <CardText> <h4> {feedPost.content} </h4> </CardText>

                                    <Button color="primary" id={togglerId} style={{marginBottom: "1rem"}}>
                                        See comments
                                    </Button>

                                    <UncontrolledCollapse toggler={HashtagTogglerId}>
                                        <div style={{height: "12rem", overflowY: "scroll", marginBottom: "2rem"}}>
                                            <PostComments ref={el => commentsRef.current[index] = el}  personalPost={feedPost} />
                                        </div>
                                    </UncontrolledCollapse>
                                    <Row>
                                        <Col>
                                            <Input type="textarea" rows="1"
                                                id="myComment"
                                                name="myComment"
                                                onChange={handleCommentChange}
                                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                            />
                                        </Col>
                                        <Col>
                                            <Button onClick={(e) => uploadComment(feedPost.id, e, index)}>
                                                <p> Send </p>
                                            </Button>
                                        </Col>
                                    
                                    </Row>
                                </CardBody>
                                <CardFooter>  
                                    <Row> 
                                        <Button onClick={(e) => getPost(feedPost.id)}>
                                            <p> Get Info </p>
                                        </Button>
                                    </Row>    
                                </CardFooter>
                            </Card>
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
            {displayFeedPosts(props)}
        </>
    )

}

