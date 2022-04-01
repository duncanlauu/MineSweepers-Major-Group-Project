import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios";
import SingleBookRating from "./SingleBookRating";

export default function BookRatingList(props) {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (props.requestedUser_id == undefined) {
      getAllRatings();
    } else {
      getAllRatingsOfOtherUser();
    }
  }, []);

  const getAllRatings = () => {
    axiosInstance
      .get(`ratings/`)
      .then((res) => {
        const allRatings = res.data.ratings;
        setRatings(allRatings);
      })
      .catch((error) => console.error(error));
  };

  const getAllRatingsOfOtherUser = () => {
    axiosInstance
      .get(`ratings/other_user/${props.requestedUser_id}`)
      .then((res) => {
        console.log("other user data", res);
        const allRatings = res.data;
        setRatings(allRatings);
      })
      .catch((error) => console.error(error));
  };

  const displayRatings = (e) => {
    console.log("Ratings", ratings);
    if (ratings) {
      return ratings.map((ratedBook) => {
        return (
          <SingleBookRating
            book_id={ratedBook.book}
            rating={ratedBook.rating}
          />
        );
      });
    } else {
      if (props.requestedUser_id == undefined) {
        return <h5> You have not rated anything yet. </h5>;
      } else {
        return <h5> This user has not rated anything yet. </h5>;
      }
    }
  };

  return <>{displayRatings(props)}</>;
}
