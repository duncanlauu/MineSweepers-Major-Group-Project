import React, {useEffect, useState} from "react"
import axiosInstance from '../../axios'
import {useNavigate} from "react-router";
import useGetUser from "../../helpers";
import SingleSuggestedUser from "./SingleSuggestedUser";

export default function SuggestedUserList(props) {

    const [mySuggestedUsers, setSuggestedUsers] = useState("")
    const currentUser = useGetUser();

    useEffect(() => {
        getAllSuggestedUsers();
    }, [currentUser]);

    const getAllSuggestedUsers = () => {
        axiosInstance
            .get(`recommender/0/10/${currentUser.id}/top_n_users_random_books/`)
            .then((res) => {
                const allSuggestedUsers = res.data;
                setSuggestedUsers(allSuggestedUsers)
            })
            .catch(error => console.error(error));
    }

    const displaySuggestedUsers = (e) => {
        if (mySuggestedUsers.length > 0) {
            return (
                mySuggestedUsers.map((suggestedUser, index) => {
                    console.log(suggestedUser.recommended_user);
                    return (
                        <SingleSuggestedUser suggestedUser={suggestedUser.recommended_user}/>
                    )
                })
            )
        } else {
            return (<h3> You don't have any friend suggestions yet. </h3>)

        }
    }
    return (
        <>
            {displaySuggestedUsers(props)}
        </>
    )

}