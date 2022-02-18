import React from 'react'
import { Container, NavbarBrand, Form, Button, NavItem, NavLink } from 'reactstrap'
import { BiSearch } from "@react-icons/all-files/bi/BiSearch";
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline'
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { NavMenu } from './NavElements';

const Nav = () => {
    return (
        <Container fluid style={{ backgroundColor:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <NavbarBrand style={{ fontFamily:"Source Sans Pro", fontWeight:"600" }}>bookgle</NavbarBrand>
            <Form style={{ display:"flex" }}>
                <Box style={{ backgroundColor:"#ECECEC", height:"3rem", width:"30rem", display:"flex", borderRadius:"100px", alignItems:"center", justifyContent:"flex-end" }}>
                <IconButton type='submit'>
                <BiSearch />
                </IconButton>
                </Box>
            </Form>
            <NavMenu>
                <ChatBubbleOutline fontSize='large' />
                <NotificationsNoneIcon fontSize='large' />
                <SettingsIcon fontSize='large'/>
            </NavMenu>
        </Container>
    )
}

export default Nav