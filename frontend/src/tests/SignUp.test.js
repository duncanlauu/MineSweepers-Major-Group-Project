import SignUp from "../components/SignUp/SignUp";
import {render, screen, waitFor} from '@testing-library/react'
import { BrowserRouter  } from "react-router-dom";
import '@testing-library/jest-dom';
import '@testing-library/dom';
import userEvent from '@testing-library/user-event'
import React from "react";
import MockAdapter from 'axios-mock-adapter'
import AxiosMockAdapter from 'axios-mock-adapter'
import feature  from 'axios-mock-adapter'
import axios from 'axios'
import { features } from "process";



const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));


  test("renders", () => {
    render(
      <SignUp />
            ) // needed because of the use of the useNavigate hook
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

    render(<SignUp />
            
            ) 



    const firstName = screen.getByTestId("first_name")
    const lastName = screen.getByTestId("last_name")
    const username = screen.getByTestId("username")
    const email = screen.getByTestId("email")
    const password = screen.getByTestId("password")
    const bio = screen.getByTestId("bio")
    const location = screen.getByTestId("location")
    const birthday = screen.getByTestId("birthday")
    const submit = screen.getByRole("button")
    userEvent.type(firstName, 'jonny')
    userEvent.type(lastName, 'Doe')
    userEvent.type(username, 'jonnydoe')
    userEvent.type(email, 'jonnydoe@gmail.com')
    userEvent.type(password, 'Password123')
    userEvent.type(bio, 'I am a test bio')
    userEvent.type(location, 'Test Location')
    userEvent.type(birthday, "2000-01-01")

    expect(firstName.value).toBe("jonny")
    expect(lastName.value).toBe("Doe")
    expect(username.value).toBe("jonnydoe")
    expect(email.value).toBe('jonnydoe@gmail.com')
    expect(password.value).toBe("Password123")
    expect(bio.value).toBe("I am a test bio")
    expect(location.value).toBe("Test Location")
    expect(birthday.value).toBe("2000-01-01")
    
    userEvent.click(submit)
    
    var mock = new MockAdapter(axios);
    await mock.onPost('/user/sign_up/').reply(200,{});

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/log_in/'));
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledTimes(1));
    
    mock.restore();
    mock.resetHistory();
  });
