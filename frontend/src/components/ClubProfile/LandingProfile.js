import React from 'react'
import { Container, Row, Col, Button, ModalHeader, Modal, ModalBody } from 'reactstrap';
import Gravatar from 'react-gravatar';
import { BookProfile, ParaText } from './ClubProfileElements';
import axiosInstance from '../../axios';
import useGetUser from '../../helpers';
import { useParams } from 'react-router-dom';
import {MdOutlineCancelScheduleSend} from 'react-icons/md'

export default class LandingProfile extends React.Component {
    constructor(props) {
        super(props);
        this.toggleClass = this.toggleClass.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            applied: false,
            modal: false
        };
    }

    applyToClub = (id, e) => {
        const action = 'apply'
        const user_id = useGetUser();
        axiosInstance.put(
            `clubs/${id}/${action}/${user_id}`, {}
        ).then(
            res => {
                console.log(res);
            }
        ).catch(
            err => {
                console.log(err);
            }
        )
        this.toggleClass();
    }

    toggleClass() {
        const currentState = this.state.applied
        this.setState({
            applied: !currentState
        });
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        })
    }
    
    render() {
        const applyStyle = {
            width: "17rem",
            margin: "1rem",
            fontFamily: "Source Sans Pro",
            borderRadius: "5px",
            backgroundColor: "#653FFD",
            border: "2px solid #653DDF",
        }

        const appliedStyle = {
            width: "17rem",
            margin: "1rem",
            fontFamily: "Source Sans Pro",
            borderRadius: "5px",
            backgroundColor: "#fff",
            border: "2px solid #653DDF",
            color: "#653FFD"
        }

        let buttonState = this.state.applied ? "Applied" : "Apply"

        return (
            <>
            <Container fluid>
                <Row style={{ display:"flex" }}>
                    <Col xs={8}>
                    <span style={{ fontFamily:"Source Sans Pro", fontSize:"15px" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                    </Col>
                    <Col>
                        <Gravatar email='blah@blah.com' size={100} />
                    </Col>
                </Row>
                <Row>
                    <Button onClick={
                        this.state.applied ? this.toggleModal : (e) => this.applyToClub(1)
                    } 
                        style= {this.state.applied ? appliedStyle : applyStyle}
                    >{buttonState}</Button>
                </Row>
                <Row>
                    <h3 style={{ fontFamily:"Source Sans Pro", marginTop:"2rem", fontWeight:"600" }}>Reading History</h3>
                </Row>
                <Row>
                    <BookProfile>
                        <Col xs={4}>
                            <Gravatar email='blah@blah.com' size={70}></Gravatar>
                        </Col>
                        <Col xs={8}>
                        </Col>
                    </BookProfile>
                </Row>
            </Container>
            <Modal
                isOpen = {this.state.modal}
                toggle = {this.toggleModal}
                style = {{
                    left: 0,
                    top: 100
                }}>
                <ModalHeader toggle={this.toggleModal} style={{ alignItems:"center", justifyContent:"center", display: "flex" }}>
                    <ParaText>This action will cancel your application to the club. Do you wish to proceed?</ParaText>
                    <MdOutlineCancelScheduleSend />
                </ModalHeader>
                <ModalBody style={{ alignItems:"center", justifyContent:"center", display: "flex" }}>
                    <Button 
                        onClick={this.toggleClass}
                        style={{ backgroundColor:"#653FFD" }}>
                        Continue
                    </Button>
                </ModalBody>
            </Modal>
            </>
        );
    }
}
