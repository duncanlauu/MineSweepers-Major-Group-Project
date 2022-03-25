import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {Row, Col} from "reactstrap"
import { FriendLine, UserNameContainer, UserNameText} from "./UserProfileElements";
import ReactStars from 'react-stars'
import { useNavigate } from "react-router";

export default function SingleBookRating(props) {

    const [title, setTitle] = useState("")

    const navigate = useNavigate();


    useEffect(() => {
        console.log("Book id in call : ", props.book_id)
        axiosInstance
            .get(`books/${props.book_id}`)
            .then(res => {
                console.log("Book data: ", res.data)
                setTitle(res.data.title);
                console.log("Book: ", res.data.book)
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const navigateToBook = (e) => {
        navigate(`/book_profile/${props.book_id}`);
    }

    

    return (
        <div>
            <FriendLine>
                <Row style={{height: "5rem"}} onClick={navigateToBook} >
                    <Col xs="8" style={{height: "5rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                       
                                {title}
                         
                    </Col>
                    <Col  xs="4" style={{display: 'flex', justifyContent: "flex-end"}}>
                    <ReactStars
                            count={5}
                            edit={false}
                            value = {props.rating / 2}
                            size={21}
                            color2={'#ffd700'} />
                    </Col>
                </Row>
            </FriendLine>

        </div>
    )
}