import React, { useState, useEffect, useRef, useReducer } from "react"
import {Button} from "reactstrap"
import axiosInstance from '../../axios'
import SinglePersonalPost from "./SinglePersonalPost";

export default function PersonalPostList(props){

    const [myPersonalPosts, setPersonalPosts] = useState("");
    
    useEffect(() => {
        getPersonalPosts()
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
                            <SinglePersonalPost personalPost={personalPost} updatePageAfterDeletion={updatePageAfterDeletion}/>
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