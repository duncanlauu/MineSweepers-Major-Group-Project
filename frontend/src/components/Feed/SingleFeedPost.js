import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, UncontrolledCollapse} from "reactstrap"
import PostCommentList from "./PostCommentList"
import Gravatar from "react-gravatar"
import { ParaText, PostHeadingText } from "../UserProfile/UserProfileElements"
import { useNavigate } from "react-router";
import { ClubPill, LikesText, PostText, ReactionContainer } from "./FeedElements"

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
                                    marginBottom: "0rem",
                                    cursor: "pointer"
                                }} 
                            />
                        </Col>
                        <Col xs="4" style={{ paddingRight:"0px" }}>
                            <h5 style={{ fontFamily:"Source Sans Pro", fontWeight:"600", marginTop:"0.65rem" }}>{posterName}</h5>
                        </Col>
                        <Col xs="6" style={{display: "flex", justifyContent: "flex-end", padding:"0px"}}>
                            {feedPost.club != null &&
                                <ClubPill>{feedPost.club__name}</ClubPill>
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
                        <PostText>{feedPost.content}</PostText>
                    </CardText>
                </CardBody>
                
                <div>
                    <Row style={{ display:"flex", float:"right", marginRight:"1rem", marginBottom:"0.5rem" }}>
                        <ReactionContainer>
                            <img 
                                src="../../../static/images/CommentsIcon.svg" 
                                style={{ height:"2rem", opacity:"60%", marginRight:"1rem", cursor:"pointer" }}
                                id={togglerID} />
                            <img 
                                src="../../../static/images/UnlikedIcon.svg" 
                                alt="Like Button" 
                                style={{ height:"2rem", opacity:"60%", cursor:"pointer" }}
                                onClick={likePost} />
                            <LikesText>{likesCount}</LikesText>
                        </ReactionContainer>
                    </Row>
                    <br></br>
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