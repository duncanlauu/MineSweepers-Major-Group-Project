import React from 'react'
import {Container, NavbarBrand, Button, Modal, ModalBody, ModalHeader, Input} from 'reactstrap'
import {BiSearch} from "@react-icons/all-files/bi/BiSearch";
import Box from '@mui/material/Box';
import {IconButton} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {NavMenu, SearchBarHeading, SearchContainer, SearchText} from './NavElements';
import {Link} from 'react-router-dom'
import PersonalPostForm from '../UserProfile/PersonalPosts/PersonalPostForm';
import axiosInstance from '../../axios';
import {usePromiseTracker} from "react-promise-tracker";
import {trackPromise} from 'react-promise-tracker';
import {Oval} from 'react-loader-spinner';
import SearchBookCard from "./SearchBookCard";
import SearchUserCard from "./SearchUserCard";
import SearchClubCard from "./SearchClubCard";


class MainNav extends React.Component {
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
        console.log("submitting");

        trackPromise(
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
        );
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
                    {this.isAuthenticated
                        ? <Link to="/home/" style={{color: "#000"}}>
                            <NavbarBrand
                                style={{fontFamily: "Source Sans Pro", fontWeight: "600"}}>bookgle</NavbarBrand>
                        </Link>
                        : <Link to="/" style={{color: "#000"}}>
                            <NavbarBrand
                                style={{fontFamily: "Source Sans Pro", fontWeight: "600"}}>bookgle</NavbarBrand>
                        </Link>
                    }
                    {this.isAuthenticated ?
                        <>
                            <Button
                                type='button'
                                data-testid="search-button"
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
                                <div onClick={this.changeModalVisibility} style={{cursor: 'pointer'}}>
                                    <img src='../../../static/images/NewPostButton.svg' alt='New Post Button'/>
                                </div>
                                <Link to="/create_club/" style={{color: "#000"}}>
                                    <img src='../../../static/images/NewClubButton.svg' alt='New Club Button'/>
                                </Link>
                                <Link to="/chat2/" style={{color: "#000"}}>
                                    <img src='../../../static/images/ChatIcon.svg' alt='Open Chats'
                                         style={{marginLeft: "1rem"}}/>
                                </Link>
                                <Link to="/user_profile/" data-testid={"user-profile"} style={{color: "#000"}}>
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
                        top: '20%',
                        left: '0'
                    }}>
                    <ModalHeader toggle={this.toggle}>
                        <SearchContainer>
                            <Button onClick={this.handleSubmit} style={SearchButtonStyle}>
                                <BiSearch style={{height: "2rem", width: "2rem"}}/>
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
                            <LoadingIndicator/>
                        </SearchContainer>
                    </ModalHeader>
                    <ModalBody style={{overflowY: "scroll", height: "30rem"}}>
                        {/* User Search Results */}
                        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <img src='../../../static/images/UserIcon.svg' alt='New Club Button'/>
                            <SearchBarHeading>Users</SearchBarHeading>
                        </Box>
                        <ul>
                            {this.state.searchUsers.map((user, index) =>
                                <li key={index}>
                                    <Link to={`/user_profile/${user.id}/`}>
                                        <SearchUserCard username={user.username} email={user.email} bio={user.bio}/>
                                    </Link>
                                </li>
                            )}
                        </ul>
                        {/* Club Search Results */}
                        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <img src='../../../static/images/ClubIcon.svg' alt='New Club Button'/>
                            <SearchBarHeading>Clubs</SearchBarHeading>
                        </Box>
                        <ul>
                            {this.state.searchClubs.map((club, index) =>
                                <li key={index}>
                                    <Link to={`/club_profile/${club.id}/`} onClick={window.location.reload()}>
                                        <SearchClubCard name={club.name} ownerEmail={club.owner.email}
                                                        description={club.description}/>
                                    </Link>
                                </li>
                            )}
                        </ul>
                        {/* Book Search Results */}
                        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <img src='../../../static/images/BookIcon.svg' alt='New Club Button'/>
                            <SearchBarHeading>Books</SearchBarHeading>
                        </Box>
                        <ul>
                            {this.state.searchBooks.map((book, index) =>
                                <li key={index}>
                                    <Link to={`/book_profile/${book.ISBN}`}>
                                        <SearchBookCard name={book.title} author={book.author}
                                                        image={book.image_links_small}/>
                                    </Link>
                                </li>
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

export default MainNav

MainNav.defaultProps = {
    isAuthenticated: true
}

const SearchButtonStyle = {
    backgroundColor: '#653FFD',
    color: '#fff',
    borderRadius: '5px',
}

const LoadingIndicator = (props) => {
    const {promiseInProgress} = usePromiseTracker();

    return (
        promiseInProgress &&
        <Container>
            <div style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '10'
            }}>
                <Oval color="#653FFD" secondaryColor='#B29FFE' height="25" width="25"/>
            </div>
        </Container>
    );
}