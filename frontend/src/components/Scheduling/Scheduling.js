import React, {Component, useState, useEffect} from "react";
import {useNavigate} from "react-router";
import axiosInstance from "../../axios";
import {Button, Col, Container, FormGroup, Input, Label, Row} from "reactstrap";
import {FormLayout, HeadingText, ParaText, SignUpContainer} from "../CreateClub/CreateClubElements";
import useGetUser from "../../helpers";


export default function Scheduling() {
    const navigate = useNavigate();
    const user = useGetUser();
    let club;


    const initialFormData = Object.freeze({
        name: '',
        description: '',
        book: '',
        time: '',
        link: ''
    })

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        updateFormData({
            ...formData, // ... is spread syntax. Slits the iterable into individual elements
            [e.target.name]: e.target.value.trim(), // Referring to the forms elements name attribute. Trimming whitespace
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitting", formData)

        // axiosInstance
        //     .get('singleclub/3', {})
        //     .then((res) => {
        //         club = res.data
        //         console.log(res)
        //     })
        //
        // console.log(club)

        axiosInstance
            .post(`scheduling/`, {
                name: formData.name,
                description: formData.description,
                club: 3,
                organiser: user.id,
                attendees: [2, 8, 110],
                book: formData.book,
                time: formData.time,
                link: formData.link
            })
            .then((res) => {
                console.log(res)
                console.log(res.data)
            })
    }

    return (
        <div id="ParentDiv">
            <Row>
            </Row>
            <Container fluid>
                <Row style={{marginTop: "6rem"}}>
                    <Col/>
                    <Col>
                        <HeadingText>Create a meeting</HeadingText>
                        <ParaText/>
                        <SignUpContainer>
                            <FormLayout>
                                <FormGroup>
                                    <Label for="name">Name </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="description"> Description </Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="book"> Book </Label>
                                    <Input
                                        id="book"
                                        name="book"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="time"> Time </Label>
                                    <Input
                                        id="time"
                                        name="time"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="link"> Meeting link </Label>
                                    <Input
                                        id="link"
                                        name="link"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                    />
                                </FormGroup>


                                <FormGroup>
                                    <Col sm={{size: 10, offset: 5}}>
                                        <Button
                                            type="submit"
                                            className="submit"
                                            onClick={handleSubmit}
                                            style={{backgroundColor: "#653FFD", width: "7rem"}}
                                        >
                                            Create
                                        </Button>
                                    </Col>
                                </FormGroup>

                            </FormLayout>
                        </SignUpContainer>

                    </Col>
                    <Col/>
                </Row>
            </Container>
        </div>
    );
}