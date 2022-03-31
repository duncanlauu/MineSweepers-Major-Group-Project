/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import Login from "../Login";
import routerWrapper from "../../../test-helpers";
import userEvent from "@testing-library/user-event";


describe("Components exist", () => {

    test("contains heading", async () => {
        act(() => {
            render(routerWrapper(<Login/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Sign into your account/i)).toBeInTheDocument()
        })
    })

    test("contains sub header", async () => {
        act(() => {
            render(routerWrapper(<Login/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/If you haven't created one yet, you can do so/i)).toBeInTheDocument()
        })
    })

    test("contains username field", async () => {
        act(() => {
            render(routerWrapper(<Login/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Username/i)).toBeInTheDocument()
        })
    })

    test("contains password field", async () => {
        act(() => {
            render(routerWrapper(<Login/>))
        })

        await waitFor(() => {
            expect(screen.getByTestId(/password/i)).toBeInTheDocument()
        })
    })

    test("contains log in button", async () => {
        act(() => {
            render(routerWrapper(<Login/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Log In/i)).toBeInTheDocument()
        })
    })
})

test("successful log in", async () => {
    render(routerWrapper(<Login/>))
    const username = screen.getByTestId("username")
    const password = screen.getByTestId("password")
    const submit = screen.getByText("Log In")

    userEvent.type(username, "johndoe")
    userEvent.type(password, 'Password123')

    expect(username.value).toBe('johndoe')
    expect(password.value).toBe("Password123")

    userEvent.click(submit)
})

test("unsuccessful log in", async () => {
    render(routerWrapper(<Login/>))
    const username = screen.getByTestId("username")
    const password = screen.getByTestId("password")
    const submit = screen.getByText("Log In")

    userEvent.type(username, "johndoe")
    userEvent.type(password, 'WrongPassword')

    expect(username.value).toBe('johndoe')
    expect(password.value).toBe("WrongPassword")

    userEvent.click(submit)
    const error = await screen.findByText("Invalid username/password")
    expect(error).toBeInTheDocument()
})
