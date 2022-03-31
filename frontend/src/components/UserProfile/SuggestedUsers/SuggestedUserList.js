import React, {useEffect, useState} from "react"
import axiosInstance from '../../../axios'
import SingleSuggestedUser from "./SingleSuggestedUser";

export default function SuggestedUserList(props) {

    const [mySuggestedUsers, setSuggestedUsers] = useState("")
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
       getAllSuggestedUsers();
    }, []);

    const getAllSuggestedUsers = () => {
        axiosInstance
            .get(`recommender/0/20/${currentUser.id}/top_n_users_random_books/`)
            .then((res) => {
                console.log("get-request for suggested users worked!")
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