/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import Nav from "../Nav";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains home link", async () => {
        act(() => {
            render(routerWrapper(<Nav/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/bookgle/i)).toBeInTheDocument()
        })
    })

    test("contains search button", async () => {
        act(() => {
            render(routerWrapper(<Nav/>))
        })

        await waitFor(() => {
            expect(screen.getByTestId(/search-button/i)).toBeInTheDocument()
        })
    })

    test("contains new post button", async () => {
        act(() => {
            render(routerWrapper(<Nav/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(/New Post Button/i)).toBeInTheDocument()
        })
    })

    test("contains new club button", async () => {
        act(() => {
            render(routerWrapper(<Nav/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(/New Club Button/i)).toBeInTheDocument()
        })
    })

    test("contains open chats button", async () => {
        act(() => {
            render(routerWrapper(<Nav/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(/Open Chats/i)).toBeInTheDocument()
        })
    })

    test("contains friends page button", async () => {
        act(() => {
            render(routerWrapper(<Nav/>))
        })

        await waitFor(() => {
            expect(screen.getByTestId(/friends-link/i)).toBeInTheDocument()
        })
    })
})
