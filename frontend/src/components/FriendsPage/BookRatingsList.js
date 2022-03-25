import React, {useEffect, useState} from "react"
import axiosInstance from '../../axios'
import SingleBookRating from "./SingleBookRating";



export default function BookRatingsList(props){

    const [ratings, setRatings] = useState("")

    useEffect(() => {
        getAllRatings()
    }, []);

    const getAllRatings = () => {
        axiosInstance
            .get(`ratings/`)
            .then((res) => {

                const allRatings = res.data.ratings;
                setRatings(allRatings)
            })
            .catch(error => console.error(error));
    }

    const displayRatings = (e) => {
        if (ratings.length > 0) {
            console.log(ratings)
            return (
                ratings.map((ratedBook) => {
                    return (
                      <SingleBookRating book_id={ratedBook.book} rating={ratedBook.rating}/>
                    )
                })
            )
        } else {
            return (<h5> You have not rated anything yet. </h5>)
        }
    }

    return (
        <>
            {displayRatings(props)}
        </>
    )

}