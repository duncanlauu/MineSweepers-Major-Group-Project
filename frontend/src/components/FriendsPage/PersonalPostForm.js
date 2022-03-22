import React, { useState, useEffect } from "react"
import { Container, Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap"
import axiosInstance from '../../axios'

import { useNavigate } from "react-router";


export default function PersonalPostForm(props) {
    console.log(props)

    const [titleErr, setTitleErr] = useState('')
    const [contentErr, setContentErr] = useState('')
    const [clubIDErr, setClubIDErr] = useState('')
    const [imageLinkErr, setImageLinkErr] = useState('')
    const [bookLinkErr, setBookLinkErr] = useState('')

    const initialFormData = Object.freeze({ // After the user has typed in their data, it can no longer be changed. (.freeze)
        club_id : '',
        title : '',
        content : '', 
        image_link : '',
        book_link : ''
    })

    const [formData, updateFormData] = useState(initialFormData)
    const [writtenComment, updateWrittenComment] = useState()
    const navigate = useNavigate();

    const handleChange = (e) => {
        updateFormData({
          ...formData, 
          [e.target.name]: e.target.value.trim(), 
        })
      }

    //   const handleCommentChange = (e) => {
    //     updateWrittenComment({
    //       ...writtenComment, 
    //       [e.target.name]: e.target.value.trim(), 
    //     })
    //   }

    const handlePostFriendRequest = (e) => {
        e.preventDefault()
        
        axiosInstance
            .post("posts/", {
                club_id : formData.club_id,
                title : formData.title,
                content : formData.content, 
                image_link : formData.image_link,
                book_link : formData.book_link
            })
            .then((res) => {
                navigate("/home/")
                navigate("/friends_page/")
            })
            .catch((e) => {
                console.log(e.response.data)
                setTitleErr(e.response.data.title)
                setContentErr(e.response.data.content)
                setClubIDErr(e.response.data.club_id)
                setBookLinkErr(e.response.data.book_link)
                setImageLinkErr(e.response.data.image_link)
            })
    }
    
    const displayPersonalPostForm = (e) => {
        return(
            <Container fluid>
            <Row>
                <Col>
                    <h1> Upload Post </h1>
                    

                    <Container>
                    <Form> 
                        
                        <FormGroup>
                            <Label for="title"> Title </Label>
                            <Input
                                id="title"
                                name="title"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            />
                        </FormGroup>
                        <div>{titleErr}</div>

                        <FormGroup>
                            <Label for="content"> Content </Label>
                            <Input type="textarea" rows="5"
                                id="content"
                                name="content"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            />
                        </FormGroup>
                        <div>{contentErr}</div>

                        
                        <Row>
                        <Col xs="3">
                            <FormGroup>
                                <Label for="club_id"> Club ID </Label>
                                <Input
                                    id="club_id"
                                    name="club_id" 
                                    onChange={handleChange}
                                    style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                />
                            </FormGroup>
                            <div>{clubIDErr}</div>

                        </Col>

                        <Col xs="9">
                            <FormGroup>
                                <Label for="image_link"> Image link </Label>
                                <Input
                                    id="image_link"
                                    name="image_link"
                                    onChange={handleChange}
                                    style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                />
                            </FormGroup>
                            <div>{imageLinkErr}</div>

                        </Col>
                        </Row>

                        <FormGroup>
                            <Label for="book_link"> Book link </Label>
                            <Input
                                id="book_link"
                                name="book_link"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            />
                        </FormGroup>
                        <div>{bookLinkErr}</div>


                        <FormGroup>
                            <Col sm={{ size: 10, offset: 5 }}>
                                <Button
                                type="submit"
                                className="submit"
                                onClick={handlePostFriendRequest}
                                style={{ width: "7rem" }}
                                >
                                Post!
                                </Button>
                            </Col>
                        </FormGroup> 

                    </Form>
                    </Container>

                </Col>
            </Row>
        </Container>
        )
    }
    return (
        <>
            {displayPersonalPostForm(props)}
        </>
    )

}
