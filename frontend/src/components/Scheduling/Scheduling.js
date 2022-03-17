import React, {Component, useState, useEffect} from "react";
import {useNavigate} from "react-router";
import axiosInstance from "../../axios";
import {Button, Col, Container, FormGroup, Input, Label, Row} from "reactstrap";
import {FormLayout, HeadingText, ParaText, SignUpContainer} from "../CreateClub/CreateClubElements";
import useGetUser from "../../helpers";


export default function Scheduling() {
    const user = useGetUser();
    let book = [];

    const initialFormData = Object.freeze({
        name: '',
        description: '',
        start_time: '',
        end_time: '',
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

        axiosInstance
            .post('recommender/0/10/3/top_n_for_club/', {})
            .then((res) => {
                axiosInstance
                    .get('recommender/0/10/3/top_n_for_club/', {})
                    .then((res) => {
                        for (let i = 0; i < res.data.length; ++i) {
                            book.append(res.data[i]['book'])
                        }
                        axiosInstance
                            .post(`scheduling/`, {
                                name: formData.name,
                                description: formData.description,
                                club: 3,
                                organiser: user.id,
                                attendees: [2, 8, 110],
                                book: book[0],
                                start_time: formData.start_time,
                                end_time: formData.end_time,
                                link: formData.link
                            })
                            .then((res) => {
                                console.log(res)
                                console.log(res.data)
                            })
                    })
            })


        // axiosInstance
        //     .get('singleclub/3', {})
        //     .then((res) => {
        //         club = res.data
        //         console.log(res)
        //     })


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
                                    <select value={this.state.value} onChange={handleChange} style={{border: "0", backgroundColor: "#F3F3F3"}}>
                                        <option value={book[0]}>book[0]</option>
                                        <option value={book[1]}>book[1]</option>
                                    </select>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="start_time"> Start time </Label>
                                    <Input
                                        id="start_time"
                                        name="start_time"
                                        type="datetime-local"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="end_time"> End time </Label>
                                    <Input
                                        id="end_time"
                                        name="end_time"
                                        type="datetime-local"
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