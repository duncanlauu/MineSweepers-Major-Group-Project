import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {
    Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, Input, UncontrolledCollapse,
    Modal, ModalBody
} from "reactstrap"
import PersonalPostEditor from "./PersonalPostEditor"
import PostCommentList from "./PostCommentList"
import Gravatar from "react-gravatar"
import {PostHeadingText } from "./UserProfileElements"

export default function SinglePersonalPost(props) {

    const [personalPost, setPersonalPost] = useState("");
    const [writtenComment, updateWrittenComment] = useState("dummy")
    const [posterEmail, setPosterEmail] = useState("");
    const [isModalVisible, setModalVisibility] = useState()
    const currentUser = JSON.parse(localStorage.user)

    useEffect(() => {
        setPersonalPost(props.personalPost)
        getPostCreatorEmail(props.personalPost.author)
    }, []);

    const getPostCreatorEmail = (author_id) => {
        axiosInstance.get(`user/get_update/${author_id}/`)
        .then((res) => {
            setPosterEmail(res.data.email)
        })
        .catch(error => console.error(error));
    }

    const deletePost = (post_id, e) => {
        axiosInstance
            .delete(`posts/${post_id}`)
            .then((res) => {
                props.updatePageAfterDeletion()
            })
            .catch(error => console.error(error));
    }

    const changeModalVisibility = () => {
        setModalVisibility(!isModalVisible);
    }

    const commentsRef = useRef([]);
    // used to have unique togglers
    const togglerID = "toggler" + personalPost.id
    const HashtagTogglerId = "#toggler" + personalPost.id


    return(
        <div className="personalPost" key={personalPost.id}>

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
                            { props.requestedUser_id !== undefined && 
                                <Gravatar email={posterEmail} size={30} style={{ 
                                            borderRadius: "50px",
                                            marginTop: "0rem",
                                            marginBottom: "0rem"
                                        }} 
                                />
                            }
                        </Col>
                        { props.requestedUser_id == undefined && 
                            <Col xs="11" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <div>
                                    <Button style={{marginRight: "1rem"}} onClick={() => changeModalVisibility()}>
                                        Edit                    
                                    </Button>
                                    <Button name={personalPost.id} onClick={(e) => deletePost(personalPost.id, e)}>
                                        X
                                    </Button>
                                </div>
                            </Col>
                        }
                    </Row>    
                </CardHeader>

                <CardBody>
                    <div style={{display: 'flex', justifyContent: "center"}}>
                        <CardTitle> 
                            <PostHeadingText>
                                {personalPost.title} 
                            </PostHeadingText>
                        </CardTitle>
                    </div>

                    <CardText>    
                        <h5> {personalPost.content} </h5> 
                    </CardText>
                </CardBody>
                
                <Button color="link" id={togglerID} style={{marginBottom: "1rem"}}>
                    view all comments
                </Button>

                <UncontrolledCollapse toggler={HashtagTogglerId}>
                    <div style={{maxHeight: "25rem", marginBottom: "2rem"}}>
                        <PostCommentList post={personalPost}/>
                    </div>
                </UncontrolledCollapse>
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