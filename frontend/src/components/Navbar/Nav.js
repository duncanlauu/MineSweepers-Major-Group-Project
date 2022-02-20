import React from 'react'
import { Container, NavbarBrand, Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'reactstrap'
import { BiSearch } from "@react-icons/all-files/bi/BiSearch";
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline'
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { NavMenu, SearchContainer } from './NavElements';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false 
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <div>
                <Container fluid style={{ backgroundColor:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <NavbarBrand style={{ fontFamily:"Source Sans Pro", fontWeight:"600" }}>bookgle</NavbarBrand>
                    <Button 
                        type='button' 
                        style={{ 
                            backgroundColor:"#FFF",
                            border:"0px",
                        }} 
                        onClick={this.toggle}>
                        <Box style={{ backgroundColor:"#ECECEC", height:"3rem", width:"30rem", display:"flex", borderRadius:"100px", alignItems:"center", justifyContent:"flex-end" }}>
                        <IconButton type='submit'>
                        <BiSearch />
                        </IconButton>
                        </Box>
                    </Button>
                    <NavMenu>
                        <ChatBubbleOutline fontSize='large' />
                        <NotificationsNoneIcon fontSize='large' />
                        <SettingsIcon fontSize='large'/>
                    </NavMenu>
                </Container>
                <Modal 
                    isOpen={this.state.modal} 
                    toggle={this.toggle} 
                    className={this.props.className}
                    style={{
                        left: 0,
                        top: 100
                    }}
                >
                <ModalHeader toggle={this.toggle}>
                    <SearchContainer>
                        <BiSearch style={{ height:"2rem", width:"2rem" }} />
                        <Input 
                            type='text'
                            placeholder='Search...'
                            style={{
                                height: "5rem",
                                width: "25rem",
                                outline: "none",
                                border: "0",
                                boxShadow: "none",
                                padding: "none",
                                fontFamily: "Source Sans Pro",
                                fontSize: "20px"
                            }}
                        />
                    </SearchContainer>
                </ModalHeader>
                    <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Nav