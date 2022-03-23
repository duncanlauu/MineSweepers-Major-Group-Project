import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, FormGroup, Label, Card, CardBody, CardTitle, CardText, CardFooter, CardHeader, UncontrolledCollapse } from "reactstrap"

import { useNavigate } from "react-router";
import { FeedContent, PostCommentsSection, PostContent, PostTitle, SinglePostContainer } from "./FriendsPageElements";
import PostComments from "./PostComments";

export default function FeedPage(props) {
    console.log(props)

    const [myFeedPosts, setFeedPosts] = useState("");

    
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
            })
            .catch(error => console.error(error));
    }

   

    // const getPost = (post_id, e) => {
    //     axiosInstance
    //         .get(`posts/${post_id}`)
    //         .then((res) => {
    //             //navigate("/log_in/")
    //             console.log(res.data.post)
    //         })
    //         .catch(error => console.error(error));
    // }

    // const getCommentsUnderPost = (post_id) => {
    //     axiosInstance
    //         .get(`posts/${post_id}/comments/`)
    //         .then((res) => {
    //             console.log(res.data)
    //             const allCommentsUnderPost = res.data.comments;
    //             setCommentsUnderPost(allCommentsUnderPost)
    //         })
    // }

    

    

    
    const displayFeedPosts = (e) => {
        if (myFeedPosts.length > 0) {
            console.log('feed: ' + myFeedPosts);
            return (
                myFeedPosts.map((post, index) => {
                    
                    //console.log(feedPost);

                    //console.log("Hallelujah")
                    //console.log("Feed post: " , feedPost)
                    // used to have unique togglers
                    

                    //console.log("QQWQW")
                    //console.log(feedPost.author_id)
                    return(
                    <SinglePost feedPost={post}  index={index}/>
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

