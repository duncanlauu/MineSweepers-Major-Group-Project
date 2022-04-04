/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import CreateClub from "../CreateClub";
import routerWrapper from "../../../test-helpers";
import userEvent from "@testing-library/user-event";


describe("Components exist", () => {

    test("contains heading text", async () => {
        act(() => {
            render(routerWrapper(<CreateClub/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Create a Club/i)).toBeInTheDocument()
        })
    })

    test("contains name input field", async () => {
        act(() => {
            render(routerWrapper(<CreateClub/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Name/i)).toBeInTheDocument()
        })
    })

    test("contains description input field", async () => {
        act(() => {
            render(routerWrapper(<CreateClub/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Description/i)).toBeInTheDocument()
        })
    })

    test("contains privacy input field", async () => {
        act(() => {
            render(routerWrapper(<CreateClub/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Privacy/i)).toBeInTheDocument()
        })
    })

    test("contains visibility input field", async () => {
        act(() => {
            render(routerWrapper(<CreateClub/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Visibility/i)).toBeInTheDocument()
        })
    })

    test("contains create button", async () => {
        act(() => {
            render(routerWrapper(<CreateClub/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Create")).toBeInTheDocument()
        })
    })

    test("successful club creation", async () => {
        act(() => {
            render(routerWrapper(<CreateClub/>))
        })

        const name = screen.getByTestId("name")
        const description = screen.getByTestId("description")
        const submit = screen.getByText("Create")

        userEvent.type(name, "John's club")
        userEvent.type(description, 'I am a test description')

        expect(name.value).toBe("John's club")
        expect(description.value).toBe("I am a test description")

        userEvent.click(submit)
    })

    test("unsuccessful create club", async () => {
        act(() => {
            render(routerWrapper(<CreateClub/>))
        })

        const name = screen.getByTestId("name")
        const description = screen.getByTestId("description")
        const submit = screen.getByText("Create")

        userEvent.type(description, 'I am a test description')

        expect(name.value).toBe("")
        expect(description.value).toBe("I am a test description")


        await waitFor(() => {
            act(() => {fireEvent.click(submit)})
        })
        const error = await screen.findByText(/This field may not be blank./i)
        expect(error).toBeInTheDocument()
    })
})
