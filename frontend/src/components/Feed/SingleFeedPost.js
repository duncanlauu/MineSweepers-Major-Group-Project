import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, UncontrolledCollapse} from "reactstrap"
import PostCommentList from "./PostCommentList"
import Gravatar from "react-gravatar"
import { PostHeadingText } from "../UserProfile/UserProfileElements"
import { useNavigate } from "react-router";
import ThumbUp from '@mui/icons-material/ThumbUp';

export default function SingleFeedPost(props) {

    const [feedPost, setFeedPosts] = useState("")
    const [posterName, setPosterName] = useState("");
    const [posterEmail, setPosterEmail] = useState("");
    const [likesCount, setLikesCount] = useState(0)
    const [likesUsersList, setLikesUsersList] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        setFeedPosts(props.feedPost)
        getPostUpvotes(props.feedPost.id)
        getPostCreatorNameAndEmail(props.feedPost.author)
    }, []);

    const getPostCreatorNameAndEmail = (author_id) => {
        axiosInstance.get(`user/get_update/${author_id}/`)
        .then((res) => {
            setPosterName(res.data.username)
            setPosterEmail(res.data.email)
        })
        .catch(error => console.error(error));
    }

    const getPostUpvotes = (postID) => {
        axiosInstance.get(`posts/${postID}`)
        .then((res) => {
            setLikesCount(res.data.post.upvotes.length)
            setLikesUsersList(res.data.post.upvotes)
        })
        .catch(error => console.error(error));
    }

    const likePost = () => {
        axiosInstance
        .put(`posts/${props.feedPost.id}`, {
            "action": "upvote"
        })
        .then((res) => {
            getPostUpvotes(props.feedPost.id)
        })
        .catch(error => console.error(error));
    }

    const navigateToProfile = () => {
        navigate(`/user_profile/${props.feedPost.author}/`)
    }

    const commentsRef = useRef([]);
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
                            <Gravatar email={posterEmail} size={30} onClick={navigateToProfile} style={{
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
                            {feedPost.club != null &&
                                <h5> <b> {feedPost.club__name} </b></h5>
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
                
                <div>
                    <Row>
                        <Col/>
                        <Col>
                            <Button color="link" id={togglerID} style={{marginBottom: "1rem"}}>
                                view all comments
                            </Button>
                        </Col>
                        <Col>
                            <div style={{
                                textAlign: "center"}
                                }>
                            <Button name="like-button" style={{ height: "4rem", background: "#653FFD", color:"#ffffff"}} onClick={likePost}>
                                <ThumbUp/>
                            </Button> &nbsp;&nbsp;
                            <h5 style={{display : 'inline-block'}}><b> Likes: {likesCount} </b></h5> {/* need style */}
                            </div>
                        </Col>
                    </Row>
                    <br/>
                </div>

                <UncontrolledCollapse toggler={HashtagTogglerId}>
                    <div style={{maxHeight: "25rem", marginBottom: "2rem"}}>
                        <PostCommentList post={feedPost}/>
                    </div>
                </UncontrolledCollapse>
            </Card>
        </div>
    )
}