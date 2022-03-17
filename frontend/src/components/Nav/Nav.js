import React from 'react'
import { Container, NavbarBrand, Button, Modal, ModalBody, ModalHeader, Input } from 'reactstrap'
import { BiSearch } from "@react-icons/all-files/bi/BiSearch";
import { BiUserCircle } from "@react-icons/all-files/bi/BiUserCircle"
import { AiOutlinePlus } from "@react-icons/all-files/ai/AiOutlinePlus";
import { GrGroup } from "@react-icons/all-files/gr/GrGroup"
import { AiOutlineBook } from '@react-icons/all-files/ai/AiOutlineBook'
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { NavMenu, SearchContainer, SearchResult, SearchText } from './NavElements';
import Gravatar from 'react-gravatar';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axios';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            search: '', 

        };
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    
    handleChange(e) {
        this.setState({
            search: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitting")
    
        axiosInstance
          .get(`search/`, { 
            params: {  search_query: this.state.search} 
           
          })
          .then((res) => { 
            console.log(res)
            console.log(res.data)
          })
      }

    render() {
        return (
            <div>
                <Container fluid style={{ backgroundColor:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <Link to="/home/" style={{ color: "#000" }}>
                        <NavbarBrand style={{ fontFamily:"Source Sans Pro", fontWeight:"600" }}>bookgle</NavbarBrand>
                    </Link>
                    <Button 
                        type='button' 
                        style={{ 
                            backgroundColor:"#FFF",
                            border:"0px",
                        }}
                        text = {this.state.search}
                        onClick={this.toggle}>
                        <Box style={{ backgroundColor:"#ECECEC", height:"3rem", width:"30rem", display:"flex", borderRadius:"100px", alignItems:"center", justifyContent:"flex-end" }}>
                        <IconButton type='submit'>
                        <BiSearch />
                        </IconButton>
                        </Box>
                    </Button>
                    <NavMenu>
                    <Link to="/create_club/" style={{ color: "#000" }}>
                        <Button 
                            type='button'
                            style={{
                                backgroundColor:"#653FFD",
                                fontFamily:"Source Sans Pro",
                                fontWeight:"500",
                                alignItems:"center",
                                justifyContent:"space-around",
                                marginRight:"2rem",
                            }}
                            ><AiOutlinePlus 
                                style={{ backgroundColor:"#4F30CC", 
                                         borderRadius:"2px", 
                                         height:"2rem", 
                                         width:"2rem", 
                                         marginRight: "1rem" }}/>New Club</Button>
                            </Link>
                        <ChatBubbleOutline fontSize='large' />
                        <Link to="/notifications/" style={{ color: "#000" }}>
                            <NotificationsNoneIcon fontSize='large' />
                        </Link>
                        <AccountCircleIcon fontSize='large' />
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
                        <BiSearch style={{ height:"2rem", width:"2rem" }} onClick={this.handleSubmit}/>
                        

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
                            onChange={this.handleChange}
                            value={this.state.search}
                        />
                    </SearchContainer>
                </ModalHeader>
                    <ModalBody style={{ overflowY:"scroll" }}>
                        {/* User Search Results */}
                        <Box sx={{ display:"flex", flexDirection:"row", alignItems:"center" }}>
                            <BiUserCircle />
                            <span style={{ fontFamily:"Source Sans Pro", fontWeight:"600", marginLeft:"3px" }}>Users</span>
                        </Box>
                        <SearchResult>
                            <Gravatar email='blah@blah.com' />
                            <SearchText>
                                Pamela M. Beesly<br />
                                <span style={{ fontWeight:"500", fontSize:"small" }}>pambeesly@dundermifflin.org</span>
                            </SearchText>
                        </SearchResult>
                        {/* Club Search Results */}
                        <Box sx={{ display:"flex", flexDirection:"row", alignItems:"center" }}>
                            <GrGroup />
                            <span style={{ fontFamily:"Source Sans Pro", fontWeight:"600", marginLeft:"3px" }}>Clubs</span>
                        </Box>
                        <SearchResult>
                            <Gravatar email='blah@blah.com' />
                            <SearchText>
                                SlytherintoLibraries<br />
                                <span style={{ fontWeight:"500", fontSize:"small" }}>21 Members</span>
                            </SearchText>
                        </SearchResult>
                        {/* Club Search Results */}
                        <Box sx={{ display:"flex", flexDirection:"row", alignItems:"center" }}>
                            <AiOutlineBook />
                            <span style={{ fontFamily:"Source Sans Pro", fontWeight:"600", marginLeft:"3px" }}>Books</span>
                        </Box>
                        <SearchResult>
                            <Gravatar email='blah@blah.com' />
                            <SearchText>
                                Bob the Builder<br />
                                <span style={{ fontWeight:"500", fontSize:"small" }}>Keith Chapman</span>
                            </SearchText>
                        </SearchResult>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Nav