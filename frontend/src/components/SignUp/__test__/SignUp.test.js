/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SignUp from "../SignUp";
import routerWrapper from "../../../test-helpers";
import userEvent from "@testing-library/user-event";


describe("Components exist", () => {

    test("contains heading", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Create an account/i)).toBeInTheDocument()
        })
    })

    test("contains sub heading", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/If you already have one, you can log in/i)).toBeInTheDocument()
        })
    })

    test("contains sub heading", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/If you already have one, you can log in/i)).toBeInTheDocument()
        })
    })

    test("contains first name", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/First Name/i)).toBeInTheDocument()
        })
    })

    test("contains first name", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/First Name/i)).toBeInTheDocument()
        })
    })

    test("contains last name", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Last Name/i)).toBeInTheDocument()
        })
    })

    test("contains username", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Username/i)).toBeInTheDocument()
        })
    })

    test("contains email", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Email/i)).toBeInTheDocument()
        })
    })

    test("contains password", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Password/i)).toBeInTheDocument()
        })
    })

    test("contains bio", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Bio/i)).toBeInTheDocument()
        })
    })

    test("contains location", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Location/i)).toBeInTheDocument()
        })
    })

    test("contains birthday", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Birthday/i)).toBeInTheDocument()
        })
    })

    test("contains sign up button", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Sign Up/i)).toBeInTheDocument()
        })
    })
})

describe("Sign up works properly", () => {

    test("successful sign up", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        const firstName = screen.getByTestId("first_name")
        const lastName = screen.getByTestId("last_name")
        const username = screen.getByTestId("username")
        const email = screen.getByTestId("email")
        const password = screen.getByTestId("password")
        const bio = screen.getByTestId("bio")
        const location = screen.getByTestId("location")
        const birthday = screen.getByTestId("birthday")
        const submit = screen.getByText("Sign Up")
        userEvent.type(firstName, 'jonny')
        userEvent.type(lastName, 'Doe')
        userEvent.type(username, 'jonnydoe')
        userEvent.type(email, 'jonnydoe@gmail.com')
        userEvent.type(password, 'Password1234')
        userEvent.type(bio, 'I am a test bio')
        userEvent.type(location, 'Test Location')
        userEvent.type(birthday, "2000-01-01")

        expect(firstName.value).toBe("jonny")
        expect(lastName.value).toBe("Doe")
        expect(username.value).toBe("jonnydoe")
        expect(email.value).toBe('jonnydoe@gmail.com')
        expect(password.value).toBe("Password1234")
        expect(bio.value).toBe("I am a test bio")
        expect(location.value).toBe("Test Location")
        expect(birthday.value).toBe("2000-01-01")

        userEvent.click(submit)
    })

    test("unsuccessful sign up - blank first name", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        const firstName = screen.getByTestId("first_name")
        const lastName = screen.getByTestId("last_name")
        const username = screen.getByTestId("username")
        const email = screen.getByTestId("email")
        const password = screen.getByTestId("password")
        const bio = screen.getByTestId("bio")
        const location = screen.getByTestId("location")
        const birthday = screen.getByTestId("birthday")
        const submit = screen.getByText("Sign Up")
        userEvent.type(lastName, 'Doe')
        userEvent.type(username, 'jonnydoe')
        userEvent.type(email, 'jonnydoe@gmail.com')
        userEvent.type(password, 'Password1234')
        userEvent.type(bio, 'I am a test bio')
        userEvent.type(location, 'Test Location')
        userEvent.type(birthday, "2000-01-01")

        expect(firstName.value).toBe("")
        expect(lastName.value).toBe("Doe")
        expect(username.value).toBe("jonnydoe")
        expect(email.value).toBe('jonnydoe@gmail.com')
        expect(password.value).toBe("Password1234")
        expect(bio.value).toBe("I am a test bio")
        expect(location.value).toBe("Test Location")
        expect(birthday.value).toBe("2000-01-01")

        userEvent.click(submit)
        const error = await screen.findByText("This field may not be blank.")
        expect(error).toBeInTheDocument()
    })

    test("unsuccessful sign up - blank last name", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        const firstName = screen.getByTestId("first_name")
        const lastName = screen.getByTestId("last_name")
        const username = screen.getByTestId("username")
        const email = screen.getByTestId("email")
        const password = screen.getByTestId("password")
        const bio = screen.getByTestId("bio")
        const location = screen.getByTestId("location")
        const birthday = screen.getByTestId("birthday")
        const submit = screen.getByText("Sign Up")
        userEvent.type(firstName, 'jonny')
        userEvent.type(username, 'jonnydoe')
        userEvent.type(email, 'jonnydoe@gmail.com')
        userEvent.type(password, 'Password1234')
        userEvent.type(bio, 'I am a test bio')
        userEvent.type(location, 'Test Location')
        userEvent.type(birthday, "2000-01-01")

        expect(firstName.value).toBe("jonny")
        expect(lastName.value).toBe("")
        expect(username.value).toBe("jonnydoe")
        expect(email.value).toBe('jonnydoe@gmail.com')
        expect(password.value).toBe("Password1234")
        expect(bio.value).toBe("I am a test bio")
        expect(location.value).toBe("Test Location")
        expect(birthday.value).toBe("2000-01-01")

        userEvent.click(submit)
        const error = await screen.findByText("This field may not be blank.")
        expect(error).toBeInTheDocument()
    })

    test("unsuccessful sign up - blank username", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        const firstName = screen.getByTestId("first_name")
        const lastName = screen.getByTestId("last_name")
        const username = screen.getByTestId("username")
        const email = screen.getByTestId("email")
        const password = screen.getByTestId("password")
        const bio = screen.getByTestId("bio")
        const location = screen.getByTestId("location")
        const birthday = screen.getByTestId("birthday")
        const submit = screen.getByText("Sign Up")
        userEvent.type(firstName, 'jonny')
        userEvent.type(lastName, 'Doe')
        userEvent.type(email, 'jonnydoe@gmail.com')
        userEvent.type(password, 'Password1234')
        userEvent.type(bio, 'I am a test bio')
        userEvent.type(location, 'Test Location')
        userEvent.type(birthday, "2000-01-01")

        expect(firstName.value).toBe("jonny")
        expect(lastName.value).toBe("Doe")
        expect(username.value).toBe("")
        expect(email.value).toBe('jonnydoe@gmail.com')
        expect(password.value).toBe("Password1234")
        expect(bio.value).toBe("I am a test bio")
        expect(location.value).toBe("Test Location")
        expect(birthday.value).toBe("2000-01-01")

        userEvent.click(submit)
        const error = await screen.findByText("This field may not be blank.")
        expect(error).toBeInTheDocument()
    })

    test("unsuccessful sign up - blank email", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        const firstName = screen.getByTestId("first_name")
        const lastName = screen.getByTestId("last_name")
        const username = screen.getByTestId("username")
        const email = screen.getByTestId("email")
        const password = screen.getByTestId("password")
        const bio = screen.getByTestId("bio")
        const location = screen.getByTestId("location")
        const birthday = screen.getByTestId("birthday")
        const submit = screen.getByText("Sign Up")
        userEvent.type(firstName, 'jonny')
        userEvent.type(lastName, 'Doe')
        userEvent.type(username, 'jonnydoe')
        userEvent.type(password, 'Password1234')
        userEvent.type(bio, 'I am a test bio')
        userEvent.type(location, 'Test Location')
        userEvent.type(birthday, "2000-01-01")

        expect(firstName.value).toBe("jonny")
        expect(lastName.value).toBe("Doe")
        expect(username.value).toBe("jonnydoe")
        expect(email.value).toBe('')
        expect(password.value).toBe("Password1234")
        expect(bio.value).toBe("I am a test bio")
        expect(location.value).toBe("Test Location")
        expect(birthday.value).toBe("2000-01-01")

        userEvent.click(submit)
        const error = await screen.findByText("This field may not be blank.")
        expect(error).toBeInTheDocument()
    })

    test("unsuccessful sign up - blank password", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        const firstName = screen.getByTestId("first_name")
        const lastName = screen.getByTestId("last_name")
        const username = screen.getByTestId("username")
        const email = screen.getByTestId("email")
        const password = screen.getByTestId("password")
        const bio = screen.getByTestId("bio")
        const location = screen.getByTestId("location")
        const birthday = screen.getByTestId("birthday")
        const submit = screen.getByText("Sign Up")
        userEvent.type(firstName, 'jonny')
        userEvent.type(lastName, 'Doe')
        userEvent.type(username, 'jonnydoe')
        userEvent.type(email, 'jonnydoe@gmail.com')
        userEvent.type(bio, 'I am a test bio')
        userEvent.type(location, 'Test Location')
        userEvent.type(birthday, "2000-01-01")

        expect(firstName.value).toBe("jonny")
        expect(lastName.value).toBe("Doe")
        expect(username.value).toBe("jonnydoe")
        expect(email.value).toBe('jonnydoe@gmail.com')
        expect(password.value).toBe("")
        expect(bio.value).toBe("I am a test bio")
        expect(location.value).toBe("Test Location")
        expect(birthday.value).toBe("2000-01-01")

        userEvent.click(submit)
        const error = await screen.findByText("This field may not be blank.")
        expect(error).toBeInTheDocument()
    })

    test("unsuccessful sign up - blank bio", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        const firstName = screen.getByTestId("first_name")
        const lastName = screen.getByTestId("last_name")
        const username = screen.getByTestId("username")
        const email = screen.getByTestId("email")
        const password = screen.getByTestId("password")
        const bio = screen.getByTestId("bio")
        const location = screen.getByTestId("location")
        const birthday = screen.getByTestId("birthday")
        const submit = screen.getByText("Sign Up")
        userEvent.type(firstName, 'jonny')
        userEvent.type(lastName, 'Doe')
        userEvent.type(username, 'jonnydoe')
        userEvent.type(email, 'jonnydoe@gmail.com')
        userEvent.type(password, 'Password1234')
        userEvent.type(location, 'Test Location')
        userEvent.type(birthday, "2000-01-01")

        expect(firstName.value).toBe("jonny")
        expect(lastName.value).toBe("Doe")
        expect(username.value).toBe("jonnydoe")
        expect(email.value).toBe('jonnydoe@gmail.com')
        expect(password.value).toBe("Password1234")
        expect(bio.value).toBe("")
        expect(location.value).toBe("Test Location")
        expect(birthday.value).toBe("2000-01-01")

        userEvent.click(submit)
        const error = await screen.findByText("This field may not be blank.")
        expect(error).toBeInTheDocument()
    })

    test("unsuccessful sign up - blank location", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        const firstName = screen.getByTestId("first_name")
        const lastName = screen.getByTestId("last_name")
        const username = screen.getByTestId("username")
        const email = screen.getByTestId("email")
        const password = screen.getByTestId("password")
        const bio = screen.getByTestId("bio")
        const location = screen.getByTestId("location")
        const birthday = screen.getByTestId("birthday")
        const submit = screen.getByText("Sign Up")
        userEvent.type(firstName, 'jonny')
        userEvent.type(lastName, 'Doe')
        userEvent.type(username, 'jonnydoe')
        userEvent.type(email, 'jonnydoe@gmail.com')
        userEvent.type(password, 'Password1234')
        userEvent.type(bio, 'I am a test bio')
        userEvent.type(birthday, "2000-01-01")

        expect(firstName.value).toBe("jonny")
        expect(lastName.value).toBe("Doe")
        expect(username.value).toBe("jonnydoe")
        expect(email.value).toBe('jonnydoe@gmail.com')
        expect(password.value).toBe("Password1234")
        expect(bio.value).toBe("I am a test bio")
        expect(location.value).toBe("")
        expect(birthday.value).toBe("2000-01-01")

        userEvent.click(submit)
        const error = await screen.findByText("This field may not be blank.")
        expect(error).toBeInTheDocument()
    })

    test("unsuccessful sign up - blank birthday", async () => {
        act(() => {
            render(routerWrapper(<SignUp/>))
        })

        const firstName = screen.getByTestId("first_name")
        const lastName = screen.getByTestId("last_name")
        const username = screen.getByTestId("username")
        const email = screen.getByTestId("email")
        const password = screen.getByTestId("password")
        const bio = screen.getByTestId("bio")
        const location = screen.getByTestId("location")
        const birthday = screen.getByTestId("birthday")
        const submit = screen.getByText("Sign Up")
        userEvent.type(firstName, 'jonny')
        userEvent.type(lastName, 'Doe')
        userEvent.type(username, 'jonnydoe')
        userEvent.type(email, 'jonnydoe@gmail.com')
        userEvent.type(password, 'Password1234')
        userEvent.type(bio, 'I am a test bio')
        userEvent.type(location, 'Test Location')

        expect(firstName.value).toBe("jonny")
        expect(lastName.value).toBe("Doe")
        expect(username.value).toBe("jonnydoe")
        expect(email.value).toBe('jonnydoe@gmail.com')
        expect(password.value).toBe("Password1234")
        expect(bio.value).toBe("I am a test bio")
        expect(location.value).toBe("Test Location")

        userEvent.click(submit)
        const error = await screen.findByText("This field may not be blank.")
        expect(error).toBeInTheDocument()
    })
})
