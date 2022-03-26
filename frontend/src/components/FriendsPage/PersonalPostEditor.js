import React, { useState, useEffect } from "react"
import { Container, Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap"
import axiosInstance from '../../axios'

import { useNavigate } from "react-router";


export default function PersonalPostEditor(props) {

    const [formData, updateFormData] = useState(props.personalPost)
    const [titleErr, setTitleErr] = useState('')
    const [contentErr, setContentErr] = useState('')
    const [clubIDErr, setClubIDErr] = useState('')
    const navigate = useNavigate();

    const handleChange = (e) => {
        updateFormData({
          ...formData, 
          [e.target.name]: e.target.value, 
        })
      }

    const handleEditRequest = (e) => {
        e.preventDefault()

        axiosInstance
            .put(`posts/${props.personalPost.id}`, {
                action: "edit",
                club : formData.club_id,
                title : formData.title,
                content : formData.content, 
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
            })
    }
    
    const displayPersonalPostForm = (e) => {
        return(
            <Container fluid>
            <Row>
                <Col>
                    <h1> Edit Post </h1>
                    

                    <Container>
                    <Form> 
                        
                        <FormGroup>
                            <Label for="title"> Title </Label>
                            <Input
                                id="title"
                                name="title"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                value={formData.title}
                            />
                            <p></p>
                        </FormGroup>
                        <div>{titleErr}</div>

                        <FormGroup>
                            <Label for="content"> Content </Label>
                            <Input type="textarea" rows="5"
                                id="content"
                                name="content"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                value={formData.content}
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
                                    value={formData.club}
                                />
                            </FormGroup>
                            <div>{clubIDErr}</div>
                        </Col>
                        </Row>

                        <FormGroup>
                            <Col sm={{ size: 10, offset: 5 }}>
                                <Button
                                type="submit"
                                className="submit"
                                onClick={handleEditRequest}
                                style={{ width: "7rem" }}
                                >
                                Save
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
