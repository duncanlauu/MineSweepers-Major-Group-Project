import React, {useEffect, useState} from "react"
import axiosInstance from '../../axios'
import {useNavigate} from "react-router";
import { Button } from "reactstrap";
import useGetUser from "../../helpers";
import SingleSuggestedUser from "./SingleSuggestedUser";

export default function SuggestedUserList(props) {

    const [mySuggestedUsers, setSuggestedUsers] = useState("")
    const currentUser = useGetUser();

    useEffect(() => {
        console.log("Current user passed as Hook: " + currentUser.id)
       getAllSuggestedUsers();
    }, [currentUser]);

    const getAllSuggestedUsers = () => {
        axiosInstance
            .get(`recommender/0/20/${currentUser.id}/top_n_users_random_books/`)
            .then((res) => {
                console.log("suggestions, Get request worked!")
                console.log(`recommender/0/20/${currentUser.id}/top_n_users_random_books/`)
                console.log(res.data)
                const allSuggestedUsers = res.data;
                setSuggestedUsers(allSuggestedUsers)
            })
            .catch(error => console.error(error));
    }

    const displaySuggestedUsers = (e) => {
        if (mySuggestedUsers.length > 0) {
            return (
                <div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <h3> Suggested Users</h3>
                    </div>
                    

                    {mySuggestedUsers.map((suggestedUser, index) => {
                        console.log(suggestedUser.recommended_user);
                        return (
                            <div key={suggestedUser.id}>
                                <SingleSuggestedUser suggestedUser={suggestedUser.recommended_user}/>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <h3> 
                    <h3> No friends suggestions yet. Please re-login to see more. </h3>
                    {/* <Button onClick={getAllSuggestedUsers}>
                        hmm
                    </Button> */}
                 </h3>
            )

        }
    }
    return (
        <>
            {displaySuggestedUsers(props)}
        </>
    )

}