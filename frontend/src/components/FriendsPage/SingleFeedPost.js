import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, Input, UncontrolledCollapse} from "reactstrap"
import PostCommentList from "./PostCommentList"

export default function SingleFeedPost(props) {

    const [feedPost, setFeedPosts] = useState("")
    const [posterName, setPosterName] = useState("");
    const [writtenComment, updateWrittenComment] = useState("dummy")

    useEffect(() => {
        setFeedPosts(props.feedPost)
        getPostCreatorName(props.feedPost.author_id)
    }, []);

    const getPostCreatorName = (author_id) => {
        axiosInstance.get(`user/get_update/${author_id}/`)
        .then((res) => {
            console.log("The post creator is: " + res.data.username)
            setPosterName(res.data.username)
        })
        .catch(error => console.error(error));
    }

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
                borderRadius: "10px"}}
            >
                <CardHeader>
                    <Row>
                        <Col>
                            <h3> @{posterName} </h3>
                        </Col>
                        <Col>
                            {feedPost.club_id != null &&
                                <h3> Club: {feedPost.club_id} </h3>
                            }
                        </Col>
                    </Row>
                </CardHeader>

                <CardBody>
                    <CardTitle> <h2> {feedPost.title} </h2> </CardTitle>
                </CardBody>

                <CardText>    
                    <h4> {feedPost.content} </h4> 
                </CardText>

                <Button color="primary" id={togglerID} style={{marginBottom: "1rem"}}>
                    Comment section
                </Button>

                <UncontrolledCollapse toggler={HashtagTogglerId}>
                    <div style={{height: "12rem", overflowY: "scroll", marginBottom: "2rem"}}>
                        <PostCommentList post={feedPost}/>
                    </div>
                </UncontrolledCollapse>

                {/* <Row>
                    <Col xs="9">
                        <Input type="textarea" rows="1"
                            id="myComment"
                            name="myComment"
                            onChange={handleCommentChange}
                            style={{ border: "0", backgroundColor: "#F3F3F3" }}
                        />
                    </Col>
                    <Col xs="3">
                        <Button onClick={(e) => uploadComment(feedPost.id, e, 0)}>
                            <p> Send </p>
                        </Button>
                    </Col>
                </Row> */}

            </Card>
        </div>
    )
}