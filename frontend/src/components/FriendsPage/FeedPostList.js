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
                console.log("feed:")
                console.log(res.data)
                const allFeedPosts = res.data.posts;
                setFeedPosts(allFeedPosts)
            })
            .catch(error => console.error(error));
    }

    const displayFeedPosts = (e) => {
        if (myFeedPosts.length > 0) {
            console.log('feed: ' + myFeedPosts);
            return (
                myFeedPosts.map((feedPost, index) => {
                    return(
                        <div className="SingleFeedPost" key={feedPost.id}>
                            <SingleFeedPost feedPost={feedPost}/>
                        </div>
                    )
                })
            )
        } else {
            return (<h5> You don't have any posts yet. </h5>)
        }
    }

    return(
        <> {displayFeedPosts()} </>
    )
}