import SignUp from "../components/SignUp/SignUp";
import {render, screen, cleanup} from '@testing-library/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import React from "react";

import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';




  test("renders", () => {
    render(<BrowserRouter>
            <SignUp/>
            </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByTestId("first_name")).toBeInTheDocument();
    expect(screen.getByTestId("last_name")).toBeInTheDocument();
    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("bio")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toBeInTheDocument();
    expect(screen.getByTestId("birthday")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  })

  test("succesful sign up", async() => {

    render(<BrowserRouter>
            <SignUp/>
            </BrowserRouter>) 



    const firstName = screen.getByTestId("first_name")
    const lastName = screen.getByTestId("last_name")
    const username = screen.getByTestId("username")
    const email = screen.getByTestId("email")
    const password = screen.getByTestId("password")
    const bio = screen.getByTestId("bio")
    const location = screen.getByTestId("location")
    const birthday = screen.getByTestId("birthday")
    const submit = screen.getByRole("button")
    userEvent.type(firstName, 'John')
    userEvent.type(lastName, 'Doe')
    userEvent.type(username, 'johndoe')
    userEvent.type(email, 'johndoe@gmail.com')
    userEvent.type(password, 'Password123')
    userEvent.type(bio, 'I am a test bio')
    userEvent.type(location, 'Test Location')
    userEvent.type(birthday, "2000-01-01")

    expect(firstName.value).toBe("John")
    expect(lastName.value).toBe("Doe")
    expect(username.value).toBe("johndoe")
    expect(email.value).toBe("johndoe@gmail.com")
    expect(password.value).toBe("Password123")
    expect(bio.value).toBe("I am a test bio")
    expect(location.value).toBe("Test Location")
    expect(birthday.value).toBe("2000-01-01")
    
    userEvent.click(submit)
    
    



  })

test("unsuccesful sign up", () => {
    render(<BrowserRouter>
            <SignUp/>
            </BrowserRouter>) 
    const firstName = screen.getByTestId("first_name")
    const lastName = screen.getByTestId("last_name")
    const username = screen.getByTestId("username")
    const email = screen.getByTestId("email")
    const password = screen.getByTestId("password")
    const bio = screen.getByTestId("bio")
    const location = screen.getByTestId("location")
    const birthday = screen.getByTestId("birthday")
    const submit = screen.getByRole("button")

    userEvent.type(firstName, '')
    userEvent.type(lastName, 'Doe')
    userEvent.type(username, 'johndoe')
    userEvent.type(email, 'johndoe@gmail.com')
    userEvent.type(password, 'Password123')
    userEvent.type(bio, 'I am a test bio')
    userEvent.type(location, 'Test Location')
    userEvent.type(birthday, "2000-01-01")

    expect(firstName.value).toBe("")
    expect(lastName.value).toBe("Doe")
    expect(username.value).toBe("johndoe")
    expect(email.value).toBe("johndoe@gmail.com")
    expect(password.value).toBe("Password123")
    expect(bio.value).toBe("I am a test bio")
    expect(location.value).toBe("Test Location")
    expect(birthday.value).toBe("2000-01-01")
    
    
    userEvent.click(submit)

})

