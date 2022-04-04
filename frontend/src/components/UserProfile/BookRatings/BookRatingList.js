import React, {useEffect, useState} from "react";
import axiosInstance from "../../../axios";
import SingleBookRating from "./SingleBookRating";

export default function BookRatingList(props) {
    const [ratings, setRatings] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (props.requestedUser_id === undefined) {
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
                const allRatings = res.data;
                setRatings(allRatings);
            })
            .catch((error) => console.error(error));
    };

    const displayRatings = (e) => {
        if (ratings) {
            console.log("Ratings", ratings);
            return ratings.map((ratedBook) => {
                return (
                    <SingleBookRating
                        book={ratedBook}
                    />
                );
            });
        } else {
            if (props.requestedUser_id === currentUser.id) {
                return <h5> You have not rated anything yet. </h5>;
            } else {
                return <h5> This user has not rated anything yet. </h5>;
            }
        }
    };

    return <>{displayRatings(props)}</>;
}
