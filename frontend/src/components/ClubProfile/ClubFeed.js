import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../axios";
import { useParams } from "react-router-dom";
import SingleFeedPost from "../Feed/SingleFeedPost";

const ClubFeed = () => {
  const { club_id } = useParams();

  const [clubFeedPosts, setClubFeedPosts] = useState("");

  useEffect(() => {
    getClubFeedPosts();
  }, []);

  const getClubFeedPosts = () => {
    axiosInstance
      .get(`feed/clubs/${club_id}`)
      .then((res) => {
        const allClubPosts = res.data.posts;
        setClubFeedPosts(allClubPosts);
      })
      .catch((error) => console.error(error));
  };

  const displayClubFeedPost = (e) => {
    if (clubFeedPosts.length > 0) {
      return clubFeedPosts.map((post) => {
        return (
          <div className="SingleClubPost" key={post.id}>
            <SingleFeedPost post={post} />
          </div>
        );
      });
    }
  };

  return <> {displayClubFeedPost()} </>;
};

export default ClubFeed;
