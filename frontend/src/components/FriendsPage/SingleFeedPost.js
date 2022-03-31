import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, UncontrolledCollapse} from "reactstrap"
import PostCommentList from "./PostCommentList"
import Gravatar from "react-gravatar"
import { PostHeadingText } from "./UserProfileElements"
import { useNavigate } from "react-router";

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
        console.log("liking post", feedPost.id)
        axiosInstance
            .put(`posts/${feedPost.id}/`, {
                action: "upvote",
            })
            .then((res) => {
                console.log(res)
                console.log("upvote successful")
            })
            .catch(error => console.error(error));
    }

    const navigateToProfile = () => {
        navigate(`/friends_page/${props.feedPost.author}/`)
        window.location.reload()
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
                                <h5> <b> Club: {feedPost.club} </b></h5>
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
                
                <Button style={{borderRadius: "20px", height: "5rem"}} onClick={likePost}>
                    +
                </Button>
                <Button color="link" id={togglerID} style={{marginBottom: "1rem"}}>
                    view all comments
                </Button>
                <h5> <b> Likes: {likesCount} </b></h5> {/* need style */}

                <UncontrolledCollapse toggler={HashtagTogglerId}>
                    <div style={{maxHeight: "25rem", marginBottom: "2rem"}}>
                        <PostCommentList post={feedPost}/>
                    </div>
                </UncontrolledCollapse>
            </Card>
        </div>
    )
}