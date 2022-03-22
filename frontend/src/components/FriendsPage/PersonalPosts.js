import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, InputGroup, InputGroupButton, FormGroup, Label, Card, CardBody, CardTitle, CardText, CardFooter, CardHeader, UncontrolledCollapse, Modal, ModalHeader, ModalBody } from "reactstrap"

import { useNavigate } from "react-router";
import { PostContent, PostTitle, SinglePostContainer } from "./FriendsPageElements";
import PostComments from "./PostComments";
import PersonalPostForm from "./PersonalPostForm";
import PersonalPostEditor from "./PersonalPostEditor";

export default function PersonalPosts(props) {
    console.log(props)

    const [myPersonalPosts, setPersonalPosts] = useState("");

    const [writtenComment, updateWrittenComment] = useState("dummy")
    const navigate = useNavigate();

    const [isModalVisible, setModalVisibility] = useState(null)

    const changeModalVisibility = (index) => {
        setModalVisibility(index);
    }

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

    // const getPost = (post_id, e) => {
    //     axiosInstance
    //         .get(`posts/${post_id}`)
    //         .then((res) => {
    //             //navigate("/log_in/")
    //             console.log(res.data.post)
    //             //console.log(writtenComment)
    //         })
    //         .catch(error => console.error(error));
    // }

    const deletePost = (post_id, e) => {
        axiosInstance
            .delete(`posts/${post_id}`)
            .then((res) => {
                //navigate("/log_in/")
                console.log(res)
                removeFromPage(e)
                //console.log(writtenComment)
            })
            .catch(error => console.error(error));
    }

    const removeFromPage = (e) => {
        const id = parseInt(e.target.getAttribute("name"))
        setPersonalPosts(myPersonalPosts.filter(item => item.id !== id));
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


    const displayPersonalPosts = (e) => {
        if (myPersonalPosts.length > 0) {
            console.log(myPersonalPosts);
            return (
                myPersonalPosts.map((personalPost, index) => {
                    console.log(personalPost);
                    // used to have unique togglers
                    const togglerId = "toggler" + personalPost.id;
                    const HashtagTogglerId = "#" + togglerId;

                    return (
                            <div className="personalPost" key={personalPost.id}>
                                <Card style={{ marginBottom: "1rem", marginRight: "1rem", marginTop: "1rem"}}>
                                    <CardHeader style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button style={{marginRight: "1rem"}} onClick={() => changeModalVisibility(index)}>
                                            Edit
                                            
                                        </Button>
                                        <Button name={personalPost.id} onClick={(e) => deletePost(personalPost.id, e)}>
                                            X
                                        </Button>
                                    </CardHeader>
                                    <CardBody>
                                        <CardTitle> <h2> {personalPost.title} </h2> </CardTitle>
                                        <CardText> <h4> {personalPost.content} </h4> </CardText>

                                        <Button color="primary" id={togglerId} style={{marginBottom: "1rem"}}>
                                            See comments
                                        </Button>

                                        <UncontrolledCollapse toggler={HashtagTogglerId}>
                                            <div>
                                                <PostComments ref={el => commentsRef.current[index] = el}  personalPost={personalPost} />
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
                                                <Button onClick={(e) => uploadComment(personalPost.id, e, index)}>
                                                    <p> Send </p>
                                                </Button>    
                                            </Col>
                                                        
                                        </Row>
                                    </CardBody>
                                    {/* <CardFooter>  
                                        <Row> 
                                            <Button onClick={(e) => getPost(personalPost.id)}>
                                                <p> Get Info </p>
                                            </Button>
                                        </Row>    
                                    </CardFooter> */}
                                </Card>

                                <Modal
                                    isOpen = {isModalVisible == index}
                                    toggle = {() => changeModalVisibility(null)}
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
                })

            )
        } else {
            return (<h5> You don't have any posts yet. </h5>)

        }
    }

    // const displayPersonalPosts = (e) => {
    //     if (myPersonalPosts.length > 0) {
    //         console.log(myPersonalPosts);
    //         return (
    //             myPersonalPosts.map((personalPost, index) => {
    //                 console.log(personalPost);
    //                 return (
                        
    //                         <div className="personalPost" key={personalPost.id}>
    //                             <Card>
    //                             <SinglePostContainer>
    //                                 <Row>
    //                                     <Col>
    //                                         <PostTitle>
    //                                             <h1> {personalPost.title} </h1>
    //                                         </PostTitle>
    //                                     </Col>
    //                                     <Col>
    //                                         <Button name={personalPost.id} onClick={(e) => deletePost(personalPost.id, e)}>
    //                                             X
    //                                         </Button>
    //                                     </Col>
    //                                 </Row>

    //                                 <PostContent>
    //                                     <h4> {personalPost.content} </h4>
    //                                 </PostContent>

    //                                 <div>
    //                                     <h5> Comment section </h5>
    //                                     <PostComments ref={el => commentsRef.current[index] = el}  personalPost={personalPost} />
    //                                 </div>

    //                                 <Row>

    //                                     <Input type="textarea" rows="1"
    //                                         id="myComment"
    //                                         name="myComment"
    //                                         onChange={handleCommentChange}
    //                                         style={{ border: "0", backgroundColor: "#F3F3F3" }}
    //                                     />

    //                                 </Row>
    //                                 <Row>
    //                                     <Col xs="6">
    //                                         <Row>
    //                                             <Button onClick={(e) => uploadComment(personalPost.id, e, index)}>
    //                                                 <p> Send </p>
    //                                             </Button>
    //                                         </Row>

    //                                     </Col>
    //                                     <Col xs="3">
    //                                         <Button onClick={(e) => getCommentsUnderPost(personalPost.id, e)}>
    //                                             <p> Show </p>
    //                                         </Button>
    //                                     </Col>

    //                                 </Row>

    //                                 <Row>
    //                                     <Button onClick={(e) => getPost(personalPost.id)}>
    //                                         <p> Get Info </p>
    //                                     </Button>
    //                                 </Row>
    //                             </SinglePostContainer>
    //                             </Card>
    //                         </div>
                        
    //                 )
    //             })
    //         )
    //     } else {
    //         return (<h5> You don't have any posts yet. </h5>)

    //     }
    // }


    return (
        <>
            {displayPersonalPosts(props)}
        </>
    )

}
