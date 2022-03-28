import React, { useState, useEffect, useRef, useReducer } from "react"
import {Button} from "reactstrap"
import axiosInstance from '../../axios'
import SinglePersonalPost from "./SinglePersonalPost";

export default function PersonalPostList(props){

    const [myPersonalPosts, setPersonalPosts] = useState("");
    
    useEffect(() => {
        if(props.requestedUser_id == undefined){
            getPersonalPosts()
        }else{
            getPersonalPostsOfOtherUser()
        }
    }, []);

    const getPersonalPosts = () => {
        axiosInstance
            .get("posts/")
            .then((res) => {
                console.log("my posts:")
                console.log(res.data)
                const allPersonalPosts = res.data.posts;
                setPersonalPosts(allPersonalPosts)
            })
            .catch(error => console.error(error));
    }

    const getPersonalPostsOfOtherUser = () => {
        axiosInstance
            .get(`posts/user/${props.requestedUser_id}`)
            .then((res) => {
                console.log("EYOO other user's posts!!:")
                console.log(res.data)
                const allPersonalPosts = res.data.posts;
                setPersonalPosts(allPersonalPosts)
            })
            .catch(error => console.error(error));
    }

    function updatePageAfterDeletion() {
        getPersonalPosts()
    }

    const displayPersonalPosts = (e) => {
        if (myPersonalPosts.length > 0) {
            console.log(myPersonalPosts);
            return (
                myPersonalPosts.map((personalPost, index) => {
                    return (
                        <div key={personalPost.id}>
                            <SinglePersonalPost personalPost={personalPost} updatePageAfterDeletion={updatePageAfterDeletion} requestedUser_id={props.requestedUser_id}/>
                        </div>
                    )
                })
            )
        }
        else {
            return (<h5> You don't have any posts yet. </h5>)

        }
    }

    return (
        <>
            {displayPersonalPosts(props)}
        </>
    )
}