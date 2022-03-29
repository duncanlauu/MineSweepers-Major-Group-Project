import React, {Component} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {render} from "react-dom";

import Login from "./Login/Login"
import PasswordReset from "./PasswordReset/PasswordReset"
import PasswordResetConfirm from "./PasswordResetConfirm/PasswordResetConfirm"
import Logout from "./Logout/Logout"
import ClubProfile from "./ClubProfile/ClubProfile";
import Error404 from "./Error404/Error404";
import LandingPage from "./LandingPage/LandingPage";
import SignUp from "./SignUp/SignUp";
import Hello from "./Hello/Hello"
import ChatWrapper from "./Chat/ChatWrapper.js"
import HomePage from "./HomePage/HomePage";
import Notifications from "./Notifications/Notifications";
import CreateClub from "./CreateClub/CreateClub";
import Layout from "./Layout/Layout";
import {AuthProvider} from "./context/AuthProvider";
import {RatingsProvider} from "./context/RatingsProvider";
import RequireAuth from "./RequireAuth/RequireAuth";
import RequireRatings from "./RequireRating/RequireRating";
import SignUpRating from "./SignUpRating/SignUpRating";
import Scheduling from "./Scheduling/Scheduling";
import Meetings from "./Meetings/Meetings";
import ClubRecommendationPage from "./ClubRecommendations/ClubRecommendationsPage";
import UserProfile from "./FriendsPage/UserProfile";
import RecommenderPage from "./RecommenderPage/RecommenderPage";
import ListOfClubs from "./ListOfClubs/ListOfClubs";
import ChatUI from "./Chat/ChatUI";
import BookProfilePage from "./BookProfilePage/BookProfilePage";


export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.StrictMode>
                <BrowserRouter>
                    <AuthProvider>
                        <RatingsProvider>
                            <Routes>
                                <Route path='/' element={<Layout/>}>
                                    {/* public routes */}
                                    <Route path='/' element={<LandingPage/>}/>
                                    <Route path='log_in' element={<Login/>}/>
                                    <Route path='sign_up' element={<SignUp/>}/>
                                    <Route path='password_reset' element={<PasswordReset/>}/>
                                    <Route path='password_reset_confirm/:uid/:token' element={<PasswordResetConfirm/>}/>

                                    {/* protected routes */}
                                    <Route element={<RequireAuth/>}>
                                        <Route path='sign_up/rating' element={<SignUpRating/>}/>
                                        {/* <Route element={<RequireRatings/>}> */}
                                            <Route path='log_out' element={<Logout/>}/>
                                            <Route path='home' element={<HomePage/>}/>
                                            <Route path='club_profile/:club_id' element={<ClubProfile/>}/>
                                            <Route path='create_club' element={<CreateClub/>}/>
                                            <Route path='notifications' element={<Notifications/>}/>
                                            <Route path='friends_page/' element={<UserProfile/>}/>
                                            <Route path='friends_page/:user_id' element={<UserProfile/>}/>
                                            <Route path="chat/:chatID" element={<ChatWrapper/>}/>
                                            <Route path="/chat/" element={<ChatWrapper/>}/>
                                            <Route path="/chat2/" element={<ChatUI/>}/>
                                            <Route path="/chat2/:chatID" element={<ChatUI/>}/>
                                            <Route path='hello' element={<Hello/>}/>
                                            <Route path="/scheduling/:club_id" element={<Scheduling/>}/>
                                            <Route path="/meetings/" element={<Meetings/>}/>
                                            <Route path="/recommendations/" element={<RecommenderPage/>}/>
                                            <Route path='recommend_clubs' element={<ClubRecommendationPage/>}/>
                                            <Route path='book_profile/:book_id' element={<BookProfilePage/>}/>
                                            <Route path="/all_clubs/" element={<ListOfClubs/>}/>
                                        {/* </Route> */}
                                    </Route>

                                    {/* error, catch all */}
                                    <Route path='error' element={<Error404/>}/>
                                    <Route path='*' element={<Error404/>}/>
                                </Route>
                            </Routes>
                        </RatingsProvider>
                    </AuthProvider>
                </BrowserRouter>
            </React.StrictMode>
        );
    }
}

const appDiv = document.getElementById("app");
render(<App/>, appDiv);
