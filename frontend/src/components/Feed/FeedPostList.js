import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import SingleFeedPost from "./SingleFeedPost";

export default function FeedPostList(props){
    const [myFeedPosts, setFeedPosts] = useState("");

    useEffect(() => {
        getFeedPosts()
    }, []);

    const getFeedPosts = () => {
        axiosInstance
            .get("feed/")
            .then((res) => {
                const allFeedPosts = res.data.posts;
                setFeedPosts(allFeedPosts)
            })
            .catch(error => console.error(error));
    }

    const displayFeedPosts = (e) => {
        if (myFeedPosts.length > 0) {
            return (
                myFeedPosts.map((feedPost, index) => {
                    return(
                        <div className="SingleFeedPost" key={feedPost.id}>
                            <SingleFeedPost feedPost={feedPost} />
                        </div>
                    )
                })
            )
        } else {
            return (<h5> No posts available. </h5>)
        }
    }

    return(
        <> {displayFeedPosts()} </>
    )
}