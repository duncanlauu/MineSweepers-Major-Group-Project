import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {
    Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, Input, UncontrolledCollapse,
    Modal, ModalBody
} from "reactstrap"
import PersonalPostEditor from "./PersonalPostEditor"
import PostCommentList from "./PostCommentList"

export default function SinglePersonalPost(props) {

    const [personalPost, setPersonalPost] = useState("");
    const [writtenComment, updateWrittenComment] = useState("dummy")
    const [isModalVisible, setModalVisibility] = useState()

    useEffect(() => {
        setPersonalPost(props.personalPost)
    }, []);

    const deletePost = (post_id, e) => {
        axiosInstance
            .delete(`posts/${post_id}`)
            .then((res) => {
                console.log(res)
                props.updatePageAfterDeletion()
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

    // const handleCommentChange = (e) => {
    //     updateWrittenComment({
    //         writtenComment,
    //         [e.target.name]: e.target.value,
    //     })
    // }

    const changeModalVisibility = () => {
        setModalVisibility(!isModalVisible);
    }

    const commentsRef = useRef([]);
    // used to have unique togglers
    const togglerID = "toggler" + personalPost.id
    const HashtagTogglerId = "#toggler" + personalPost.id


    return(
        <div className="personalPost" key={personalPost.id}>
            <Card style={{ marginBottom: "1rem", marginRight: "1rem", marginTop: "1rem"}}>
                <CardHeader style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{marginRight: "1rem"}} onClick={() => changeModalVisibility()}>
                        Edit                    
                    </Button>
                    <Button name={personalPost.id} onClick={(e) => deletePost(personalPost.id, e)}>
                        X
                    </Button>
                </CardHeader>
                <CardBody>
                    <CardTitle> <h2> {personalPost.title} </h2> </CardTitle>
                    <CardText> <h4> {personalPost.content} </h4> </CardText>

                    <Button color="primary" id={togglerID} style={{marginBottom: "1rem"}}>
                        Comment section
                    </Button>

                    <UncontrolledCollapse toggler={HashtagTogglerId}>
                        <div>
                            <PostCommentList post={personalPost}/>
                        </div>
                    </UncontrolledCollapse>

                    {/* <Row>
                        <Col>
                            <Input type="textarea" rows="1"
                                id="myComment"
                                name="myComment"
                                onChange={handleCommentChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            /> 
                        </Col>
                        <Col>
                            <Button onClick={(e) => uploadComment(personalPost.id, e, 0)}>
                                <p> Send </p>
                            </Button> 
                        </Col>
                    </Row> */}
                </CardBody>
            </Card>

            <Modal
                isOpen = {isModalVisible}
                toggle = {() => changeModalVisibility()}
                style={{
                    left: 0,
                    top: 100
                }}
            >
                <ModalBody style={{overflowY: "scroll"}}>
                    <PersonalPostEditor personalPost={personalPost}/>
                </ModalBody>
            </Modal>
        </div>
    )
}