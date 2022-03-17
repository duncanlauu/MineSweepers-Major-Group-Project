import SignUp from "../components/SignUp/SignUp";
import {render, screen, cleanup} from '@testing-library/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

describe("should render", () => {
  test("renders", () => {
    render(<BrowserRouter>
            <SignUp/>
            </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
    expect(screen.getByLabelText("User Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Birthday")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  })

  test("succesful sign up", () => {
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

    
    submit.click()


  })

}
  )