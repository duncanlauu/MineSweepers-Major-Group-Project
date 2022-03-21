import SignIn from "../components/Login/Login";
import {render, screen, cleanup} from '@testing-library/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import React from "react";

import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';




  test("renders", () => {
    render(<BrowserRouter>
            <SignIn/>
            </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  })

  test("successful club creation", async() => {

    render(<BrowserRouter>
            <SignIn/>
            </BrowserRouter>) 



    const username = screen.getByTestId("username")
    const password = screen.getByTestId("password")
   
    const submit = screen.getByRole("button")
    userEvent.type(username, "johndoe")
    userEvent.type(password, 'Password123')
   

    expect(username.value).toBe('johndoe')
    expect(password.value).toBe("Password123")

    userEvent.click(submit)
    
    



  })

test("unsuccesful sign up", () => {
  render(<BrowserRouter>
    <SignIn/>
    </BrowserRouter>) 



const username = screen.getByTestId("username")
const password = screen.getByTestId("password")

const submit = screen.getByRole("button")
userEvent.type(username, "johndoe")
userEvent.type(password, 'Password123')


expect(username.value).toBe('johndoe')
expect(password.value).toBe("Password123")

userEvent.click(submit)



})

