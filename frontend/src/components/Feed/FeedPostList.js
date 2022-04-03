import React, {useState, useEffect} from "react";
import axiosInstance from "../../axios";
import SingleFeedPost from "./SingleFeedPost";

export default function FeedPostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = () => {
        axiosInstance
            .get("feed/")
            .then((res) => {
                setPosts(res.data.posts);
            })
            .catch((error) => console.error(error));
    };

    if (posts.length > 0) {
        return posts.map((post) => {
            return (
                <div className="SingleFeedPost" key={post.id}>
                    <SingleFeedPost post={post}/>
                </div>
            );
        });
    } else {
        return <h4> Your feed is empty. Add friends to check out their posts! </h4>;
    }
}
