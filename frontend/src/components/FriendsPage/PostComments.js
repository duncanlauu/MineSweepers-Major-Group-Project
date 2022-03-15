import React, { useState, useEffect } from "react"
import axiosInstance from '../../axios'
import { Row, Col } from "reactstrap"
import { useNavigate } from "react-router";

export default function PostComments(props) {

    const navigate = useNavigate();
    const [commentsUnderPost, setCommentsUnderPost] = useState([]);

    useEffect(() => {
        getCommentsUnderPost()
    }, []);

    const getCommentsUnderPost = () => {
        console.log(props.personalPost.id)
        axiosInstance
            .get(`posts/${props.personalPost.id}/comments/`)
            .then((res) => {
                console.log(res.data)
                const allCommentsUnderPost = res.data;
                setCommentsUnderPost(allCommentsUnderPost);
            })
    }

    const displayCommentsUnderPost = (e) => {
        if (commentsUnderPost.length > 0) {
            console.log(commentsUnderPost);
            return (
                commentsUnderPost.map((singleComment, index) => {
                    console.log(singleComment);
                    return (
                        <div className="singleComment" key={singleComment.id}>
                            <Row>
                                <Col>
                                    <h2> {singleComment.author} </h2>

                                    <h4> {singleComment.content} </h4>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            )
        } else {
            return (<h5> You don't have any comments yet. </h5>)
        }
    }

    return (
        <>
            {displayCommentsUnderPost()}
        </>
    )

}

