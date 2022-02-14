import React, { Component } from "react";

// class based. This works as well but function based was recently introduced for hooks and stuff.

// export default class LoginPage extends Component {
//     constructor(props) {
//         super(props)
//     }

//     render() {
//         return <p>This is the Login page</p>
//     }
// }

export default function LoginPage() {
    return (
        <p>This is the Login page function</p>
    )
}