import React from 'react'
import {Container, NavbarBrand, Button, Modal, ModalBody, ModalHeader, Input} from 'reactstrap'
import {BiSearch} from "@react-icons/all-files/bi/BiSearch";
import {BiUserCircle} from "@react-icons/all-files/bi/BiUserCircle"
import {AiOutlinePlus} from "@react-icons/all-files/ai/AiOutlinePlus";
import {GrGroup} from "@react-icons/all-files/gr/GrGroup"
import {AiOutlineBook} from '@react-icons/all-files/ai/AiOutlineBook'
import Box from '@mui/material/Box';
import {IconButton} from '@mui/material';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {NavMenu, SearchContainer, SearchResult, SearchText} from './NavElements';
import Gravatar from 'react-gravatar';
import {Link} from 'react-router-dom'
import PersonalPostForm from '../FriendsPage/PersonalPostForm';
import axiosInstance from '../../axios';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            search: '',
        };
        this.toggle = this.toggle.bind(this);
        this.state = {
            postModal: false,
            searchBooks: [],
            searchClubs: [],
            searchUsers: [],
            searchFriends: [],
        };
        this.changeModalVisibility = this.changeModalVisibility.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isAuthenticated = this.props.isAuthenticated;
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
        console.log(this.state.search)
    }

    changeModalVisibility() {
        this.setState({
            postModal: !this.state.postModal
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitting")

        axiosInstance
            .get(`search/`, {
                params: {search_query: this.state.search}

            })
            .then((res) => {
                console.log(res)
                console.log(res.data)
                this.setState({
                    searchBooks: JSON.parse(res.data)['books'],
                    searchClubs: JSON.parse(res.data)['clubs'],
                    searchUsers: JSON.parse(res.data)['users'],
                });
            })
    }

    render() {
        return (
            <div>
                <Container fluid style={{
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <Link to="/home/" style={{color: "#000"}}>
                        <NavbarBrand style={{fontFamily: "Source Sans Pro", fontWeight: "600"}}>bookgle</NavbarBrand>
                    </Link>
                    {this.isAuthenticated ?
                        <>
                            <Button
                                type='button'
                                style={{
                                    backgroundColor: "#FFF",
                                    border: "0px",
                                }}
                                text={this.state.search}
                                onClick={this.toggle}>
                                <Box style={{
                                    backgroundColor: "#ECECEC",
                                    height: "3rem",
                                    width: "30rem",
                                    display: "flex",
                                    borderRadius: "100px",
                                    alignItems: "center",
                                    justifyContent: "flex-end"
                                }}>
                                    {this.state.search === '' 
                                    ? <SearchText> </SearchText> 
                                    : <SearchText>{this.state.search}</SearchText>}
                                    <IconButton type='submit'>
                                        <BiSearch/>
                                    </IconButton>
                                </Box>
                            </Button>
                            <NavMenu>
                                <div onClick={this.changeModalVisibility} style={{ cursor: 'pointer' }}>
                                    <img src='../../../static/images/NewPostButton.svg' alt='New Post Button' />
                                </div>
                                <Link to="/create_club/" style={{color: "#000"}}>
                                    <img src='../../../static/images/NewClubButton.svg' alt='New Club Button' />
                                </Link>
                                <Link to="/chat2/" style={{color: "#000"}}>
                                    <img src='../../../static/images/ChatIcon.svg' alt='Open Chats' style={{ marginLeft:"1rem" }} />
                                </Link>
                                <Link to="/friends_page/" style={{color: "#000"}}>
                                    <AccountCircleIcon fontSize='large'/>
                                </Link>
                            </NavMenu>
                        </>
                        : <></>
                    }
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
                            <Button onClick={this.handleSubmit}>
                                <BiSearch style={{height: "2rem", width: "2rem"}} />
                            </Button>
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
                    <ModalBody style={{overflowY: "scroll"}}>
                        {/* User Search Results */}
                        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <BiUserCircle/>
                            <span style={{
                                fontFamily: "Source Sans Pro",
                                fontWeight: "600",
                                marginLeft: "3px"
                            }}>Users</span>
                        </Box>
                        {/* <SearchResult>
                            <Gravatar email='blah@blah.com'/>
                            <SearchText>
                                Pamela M. Beesly<br/>
                                <span style={{fontWeight: "500", fontSize: "small"}}>pambeesly@dundermifflin.org</span>
                            </SearchText>
                        </SearchResult> */}
                        <ul>
                            {this.state.searchUsers.map(obj =>
                                <li>{obj.username}</li>
                            )}
                        </ul>
                        {/* Club Search Results */}
                        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <GrGroup/>
                            <span style={{
                                fontFamily: "Source Sans Pro",
                                fontWeight: "600",
                                marginLeft: "3px"
                            }}>Clubs</span>
                        </Box>
                        {/* <SearchResult>
                            <Gravatar email='blah@blah.com'/>
                            <SearchText>
                                SlytherintoLibraries<br/>
                                <span style={{fontWeight: "500", fontSize: "small"}}>21 Members</span>
                            </SearchText>
                        </SearchResult> */}
                        <ul>
                            {this.state.searchClubs.map(obj =>
                                <li>{obj.name}</li>
                            )}
                        </ul>
                        {/* Book Search Results */}
                        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <AiOutlineBook/>
                            <span style={{
                                fontFamily: "Source Sans Pro",
                                fontWeight: "600",
                                marginLeft: "3px"
                            }}>Books</span>
                        </Box>
                        {/* <SearchResult>
                            <Gravatar email='blah@blah.com'/>
                            <SearchText>
                                Bob the Builder<br/>
                                <span style={{fontWeight: "500", fontSize: "small"}}>Keith Chapman</span>
                            </SearchText>
                        </SearchResult> */}
                        <ul>
                            {this.state.searchBooks.map(obj =>
                                <li>{obj.title}</li>
                            )}
                        </ul>
                    </ModalBody>
                </Modal>


                <Modal
                    isOpen={this.state.postModal}
                    toggle={this.changeModalVisibility}
                    style={{
                        left: 0,
                        top: 100
                    }}
                >

                    <ModalBody style={{overflowY: "scroll"}}>
                        <PersonalPostForm/>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Nav

Nav.defaultProps = {
    isAuthenticated: true
}