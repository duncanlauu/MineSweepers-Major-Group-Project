import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, Input, UncontrolledCollapse} from "reactstrap"
import PostCommentList from "./PostCommentList"
import Gravatar from "react-gravatar"
import { FeedPostContainer, PostHeadingText } from "./UserProfileElements"
import { border } from "@mui/system"

export default function SingleFeedPost(props) {

    const [feedPost, setFeedPosts] = useState("")
    const [posterName, setPosterName] = useState("");
    const [posterEmail, setPosterEmail] = useState("");
    const [writtenComment, updateWrittenComment] = useState("dummy")

    useEffect(() => {
        setFeedPosts(props.feedPost)
        // console.log("feedPost.author_id")
        // console.log(props.feedPost.author)
        // console.log("club feeds:")
        // console.log(props.feedPost)
        getPostCreatorName(props.feedPost.author)
        getPostCreatorEmail(props.feedPost.author)
    }, []);

    const getPostCreatorName = (author_id) => {
        axiosInstance.get(`user/get_update/${author_id}/`)
        .then((res) => {
            // console.log("The post creator is: " + res.data.username)
            setPosterName(res.data.username)
        })
        .catch(error => console.error(error));
    }

    const getPostCreatorEmail = (author_id) => {
        axiosInstance.get(`user/get_update/${author_id}/`)
        .then((res) => {
            // console.log("The post creator is: " + res.data.username)
            setPosterEmail(res.data.email)
        })
        .catch(error => console.error(error));
    }

    const uploadComment = (post_id, e, index) => {
        // console.log(writtenComment.myComment)
        axiosInstance
            .post(`posts/${post_id}/comments/`, {
                content: writtenComment.myComment,
            })
            .then((res) => {
                // console.log(res.data)
                const comment = { author: localStorage.username, content: writtenComment.myComment }
                // console.log(commentsRef.current[index])
                commentsRef.current[index].addComment(comment)
                // console.log("adding post in parent: ", comment)
            })
    }

    const handleCommentChange = (e) => {
        updateWrittenComment({
            writtenComment,
            [e.target.name]: e.target.value,
        })
    }

    const commentsRef = useRef([]);
    // used to have unique togglers
    const togglerID = "toggler" + feedPost.id
    const HashtagTogglerId = "#toggler" + feedPost.id

    return(
        <div className="feedPost" key={feedPost.id}>
            
            <Card style={{ marginBottom: "1rem",
                marginRight: "1rem",
                marginTop: "1rem",
                marginLeft: "1rem",
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "3px solid rgba(0,0,0,.125)"}}
            >
                <CardHeader> 
                    <Row >
                        <Col xs="1">
                            <Gravatar email={posterEmail} size={30} style={{ 
                                    borderRadius: "50px",
                                    marginTop: "0rem",
                                    marginBottom: "0rem"
                                }} 
                            />
                        </Col>
                        <Col xs="4">
                            <h5><b> @{posterName} </b></h5>
                        </Col>
                        <Col xs="6" style={{display: "flex", justifyContent: "flex-end"}}>
                            {feedPost.club_id != null &&
                                <h5> <b> Club: {feedPost.club_id} </b></h5>
                            }
                        </Col>
                    </Row>
                </CardHeader>

                
                <CardBody>
                    <div style={{ display: 'flex', justifyContent: "center"}}>
                        <CardTitle> 
                            <PostHeadingText>
                                {feedPost.title} 
                            </PostHeadingText>
                        </CardTitle>
                    </div>


                    <CardText>    
                        <h5> {feedPost.content} </h5> 
                    </CardText>
                </CardBody>
                
                <Button color="link" id={togglerID} style={{marginBottom: "1rem"}}>
                    view all comments
                </Button>

                <UncontrolledCollapse toggler={HashtagTogglerId}>
                    <div style={{maxHeight: "25rem", marginBottom: "2rem"}}>
                        <PostCommentList post={feedPost}/>
                    </div>
                </UncontrolledCollapse>
            </Card>
        </div>
    )
}