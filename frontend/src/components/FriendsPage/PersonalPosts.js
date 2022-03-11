import React, { useState, useEffect } from "react"
import axiosInstance from '../../axios'

import { useNavigate } from "react-router";

export default function PersonalPosts(props) {
    console.log(props)
    
    const [myPersonalPosts, setPersonalPosts] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getPersonalPosts()
    }, []);

    const getPersonalPosts = () => {
        axiosInstance
            .get(`posts/`)
            .then((res) => {
                const allPersonalPosts = res.data.posts;
                setPersonalPosts(allPersonalPosts)
                navigate("/log_in/")
            })
            .catch(error => console.error(error));
    }
    
    const displayPersonalPosts = (e) => {
        if (myPersonalPosts.length > 0) {
            return (
                myPersonalPosts.map((personalPost, index) => {
                    console.log(personalPost);
                    return (
                        <div className="personalPost" key={personalPost.post_id}> 
                        {/* personalPost.post_id NOT YET AVAILABLE */}
                            <Row>
                                <Col>
                                    <h3> Test.! </h3>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            <Button>
                                                <p> ButtonLOL </p>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            )
        } else {
            return (<h5> You don't have any posts yet. </h5>)

        }
    }
    return (
        <>
            {displayPersonalPosts(props)}
        </>
    )

}
