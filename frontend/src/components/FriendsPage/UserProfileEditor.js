import React, { useState, useEffect } from "react"
import { Container, Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap"
import useGetUser from "../../helpers";


export default function UserProfileEditor(props) {

    const [formData, updateFormData] = useState(props.currentUser)

    const handleChange = (e) => {
        updateFormData({
          ...formData, 
          [e.target.name]: e.target.value, 
        })
      }

    const displayPersonalPostForm = (e) => {
        return(
            <Container fluid>
            <Row>
                <Col>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <h1> Edit Profile </h1>
                    </div>
                    

                    <Container>
                    <Form> 
                        
                        <FormGroup>
                            <Label for="bio"> Bio </Label>
                            <Input type="textarea" rows="5"
                                id="bio"
                                name="bio"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" , borderRadius: "20px"}}
                                value={formData.bio}
                            />
                            <p></p>
                        </FormGroup>
                        {/* <div>{titleErr}</div> */}

                        <FormGroup>
                            <Label for="location"> Location </Label>
                            <Input
                                id="location"
                                name="location"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3", borderRadius: "20px"}}
                                value={formData.location}
                            />
                        </FormGroup>
                        {/* <div>{contentErr}</div> */}

                        <FormGroup>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <Button
                                    type="submit"
                                    className="submit"
                                    // onClick={handleEditRequest}
                                    style={{ borderRadius: "50px" }}
                                    >
                                    Save changes
                                </Button>
                            </div>
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
