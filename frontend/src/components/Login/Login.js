import React from 'react'
import { Col, Container, FormGroup, Input, Label, Row, Button, Navbar, NavbarBrand } from 'reactstrap'
import { HeadingText, LoginContainer, ParaText, Form, VisibilityToggle } from './LoginElements'
import { FaExternalLinkAlt } from 'react-icons/fa'


// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import axios from 'axios';
import { Spin, Icon } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';

// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


class Login extends React.Component {

    state = {
        loginForm: true,
    }

    // componentWillReceiveProps(newProps) {
    //     if (newProps.token !== null && newProps.username !== null) {

    //     }
    // }

    // componentDidMount() {
    //     if (this.props.token !== null && this.props.username !== null) {

    //     }
    // }

    authenticate = (e) => {
        e.preventDefault();
        if (this.state.loginForm) {
            this.props.login(
                e.target.username.value,
                e.target.password.value
            );
        } else {
            this.props.signup(
                e.target.username.value,
                e.target.email.value,
                e.target.password.value,
                e.target.password2.value
            );
        }
    }

    render() {
        return (

          <div>
              <Row>
                <Navbar color="light" expand="md" light>
                  <NavbarBrand href="/">
                    <h1> bookgle </h1>
                  </NavbarBrand>
                </Navbar>
             </Row>
              <Container fluid>
                      <Row style={{ marginTop: "6rem" }}>
                          <Col />
                          <Col>
                              <HeadingText>Sign into your account</HeadingText><br />
                              <ParaText>If you haven't created one yet, you can do so here <FaExternalLinkAlt style={{ height: "15px", color: "#0057FF" }} /> .</ParaText>
                              <div>{
                              this.props.isAuthenticated ?

                              <div>User is logged in</div> : <div>User is not logged in</div>
                                }</div> 
                              <LoginContainer>
                                  <form method="POST" onSubmit={this.authenticate}>
                                      <FormGroup>
                                          <Label>Username</Label>
                                          <Input name="username" style={{ border: "0", backgroundColor: "#F3F3F3" }} />
                                      </FormGroup>
                                      <FormGroup>
                                          <Label>Password</Label>
                                          <Input name="password" style={{ border: "0", backgroundColor: "#F3F3F3" }}>
                                          </Input>
                                      </FormGroup>
                                      <FormGroup>
                                          <Col sm={{size: 10, offset: 4}}>
                                              <Button type="submit" style={{ backgroundColor: "#653FFD", width: "7rem" }}>Sign In</Button>
                                          </Col>
                                      </FormGroup>
                                  </form>
                              </LoginContainer>
                          </Col>
                          <Col />
                      </Row>
              </Container>
          </div>



          // this.props.isAuthenticated ?
          //
          //             <button onClick={() => this.props.logout()} className="authBtn"><span>Logout</span></button>
          //
          //             :
          //
          //                 <form method="POST" onSubmit={this.authenticate}>
          //
          //                     {
          //
          //                         <div>
          //                             <input name="username" type="text" placeholder="username" />
          //                             <input name="password" type="password" placeholder="password" />
          //                         </div>
          //                     }
          //
          //                     <button type="submit">Authenticate</button>
          //
          //                 </form>

            // <div id="sidepanel">
            // <div id="profile">
            //     <div className="wrap">
            //     <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
            //     <p>Mike Ross</p>
            //     <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
            //     <div id="status-options">
            //         <ul>
            //         <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
            //         <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
            //         <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
            //         <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
            //         </ul>
            //     </div>
            //     <div id="expanded">
            //         {
            //             this.props.loading ?
            //
            //             <Spin /*indicator={antIcon}*/ /> :
            //
            //             this.props.isAuthenticated ?
            //
            //             <button onClick={() => this.props.logout()} className="authBtn"><span>Logout</span></button>
            //
            //             :
            //
            //             <div>
            //
            //
            //                 <form method="POST" onSubmit={this.authenticate}>
            //
            //                     {
            //
            //                         <div>
            //                             <input name="username" type="text" placeholder="username" />
            //                             <input name="password" type="password" placeholder="password" />
            //                         </div>
            //                     }
            //
            //                     <button type="submit">Authenticate</button>
            //
            //                 </form>
            //
            //
            //
            //
            //
            //             </div>
            //         }
            //     </div>
            //     </div>
            // </div>
            // </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null,
        loading: state.loading,
        token: state.token,
        username: state.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (userName, password) => dispatch(actions.authLogin(userName, password)),
        logout: () => dispatch(actions.logout()),
        signup: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
