import React, { useState, useEffect } from "react"
import { Container, Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap"
import axiosInstance from '../../axios'

import { useNavigate } from "react-router";


export default function PersonalPostForm(props) {
    console.log(props)

    const [formData, updateFormData] = useState()
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
                book_link : formData.image_link
            })
            .then((res) => {
                navigate("/home/")
                navigate("/friends_page/")
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

                        <FormGroup>
                            <Label for="content"> Content </Label>
                            <Input type="textarea" rows="5"
                                id="content"
                                name="content"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            />
                        </FormGroup>
                        
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
