import React, { useState, useEffect } from "react"
import axiosInstance from '../../axios'

import { useNavigate } from "react-router";


export default function PersonalPostForm(props) {
    console.log(props)

    const [formData, updateFormData] = useState(initialFormData)
    const navigate = useNavigate();

    const initialFormData = Object.freeze({ // After the user has typed in their data, it can no longer be changed. (.freeze)
        club_id: '',
        title: '',
        content: '',
        image_link: '',
        book_link: '',
      })

    const handleChange = (e) => {
        updateFormData({
          ...formData, // ... is spread syntax. Slits the iterable into individual elements
          [e.target.name]: e.target.value.trim(), // Referring to the forms elements name attribute. Trimming whitespace
        })
      }

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
                navigate("/log_in/")
            })
    }
    
    const displayPersonalPostForm = (e) => {
        <Container fluid>
        <Row style={{ marginTop: "6rem" }}>
            <Col />
            <Col>
                <h1> Upload Post </h1>

                <Container>
                <Form> {/*  might have to add more info here */}
                    <Row>
                    <Col xs="6">
                        <FormGroup>
                            <Label for="club_id"> Club ID </Label>
                            <Input
                                id="club_id"
                                name="club_id" // name to target from JS
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs="6">
                        <FormGroup>
                            <Label for="title"> Title </Label>
                            <Input
                                id="title"
                                name="title"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            />
                        </FormGroup>
                    </Col>
                    </Row>

                    <FormGroup>
                        <Label for="content"> Content </Label>
                        <Input
                            id="content"
                            name="content"
                            onChange={handleChange}
                            style={{ border: "0", backgroundColor: "#F3F3F3" }}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="image"> Email </Label>
                        <Input
                            id="image_link"
                            name="image_link"
                            onChange={handleChange}
                            style={{ border: "0", backgroundColor: "#F3F3F3" }}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="book"> Password </Label>
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
                            style={{ backgroundColor: "#653FFD", width: "7rem" }}
                            >
                            Post!
                            </Button>
                        </Col>
                    </FormGroup>

                </Form>
                </Container>

            </Col>
            <Col />
        </Row>
      </Container>

    }
    return (
        <>
            {displayPersonalPostForm(props)}
        </>
    )

}
