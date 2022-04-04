import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
import axiosInstance from "../../axios";

import { useNavigate } from "react-router";

export default function UserProfileEditor(props) {
    const [formData, updateFormData] = useState(props.currentUser);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const navigate = useNavigate();

    const handleEditRequest = (e) => {
        e.preventDefault();

        axiosInstance
            .put(`user/get_update/${props.currentUser.id}/`, {
                action: "edit",
                password: props.currentUser.password,
                username: props.currentUser.username,
                email: props.currentUser.email,
                first_name: props.currentUser.first_name,
                last_name: props.currentUser.last_name,
                location: formData.location,
                bio: formData.bio,
            })
            .then((res) => {
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate("/home/");
                navigate("/user_profile/");
            })
            .catch((e) => {
                console.error(err);
            });
    };

    const displayPersonalPostForm = (e) => {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <h1> Edit Profile </h1>
                        </div>

                        <Container>
                            <Form>
                                <FormGroup>
                                    <Label for="bio"> Bio </Label>
                                    <Input
                                        type="textarea"
                                        rows="5"
                                        id="bio"
                                        name="bio"
                                        onChange={handleChange}
                                        style={{
                                            border: "0",
                                            backgroundColor: "#F3F3F3",
                                            borderRadius: "20px",
                                        }}
                                        value={formData.bio}
                                    />
                                    <p />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="location"> Location </Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        onChange={handleChange}
                                        style={{
                                            border: "0",
                                            backgroundColor: "#F3F3F3",
                                            borderRadius: "20px",
                                        }}
                                        value={formData.location}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Button
                                            type="submit"
                                            className="submit"
                                            onClick={handleEditRequest}
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
        );
    };
    return <>{displayPersonalPostForm(props)}</>;
}
