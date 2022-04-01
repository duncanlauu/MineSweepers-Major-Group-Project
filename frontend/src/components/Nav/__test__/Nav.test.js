/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import MainNav from "../MainNav";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains home link", async () => {
        act(() => {
            render(routerWrapper(<MainNav/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/bookgle/i)).toBeInTheDocument()
        })
    })

    test("contains search button", async () => {
        act(() => {
            render(routerWrapper(<MainNav/>))
        })

        await waitFor(() => {
            expect(screen.getByTestId(/search-button/i)).toBeInTheDocument()
        })
    })

    test("contains new post button", async () => {
        act(() => {
            render(routerWrapper(<MainNav/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(/New Post Button/i)).toBeInTheDocument()
        })
    })

    test("contains new club button", async () => {
        act(() => {
            render(routerWrapper(<MainNav/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(/New Club Button/i)).toBeInTheDocument()
        })
    })

    test("contains open chats button", async () => {
        act(() => {
            render(routerWrapper(<MainNav/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(/Open Chats/i)).toBeInTheDocument()
        })
    })

    test("contains user profile button", async () => {
        act(() => {
            render(routerWrapper(<MainNav/>))
        })

        await waitFor(() => {
            expect(screen.getByTestId(/user-profile/i)).toBeInTheDocument()
        })
    })
})
