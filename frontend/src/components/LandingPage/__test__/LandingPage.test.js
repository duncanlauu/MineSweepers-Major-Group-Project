/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import LandingPage from "../LandingPage";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains welcome text", async () => {
        act(() => {
            render(routerWrapper(<LandingPage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Welcome to/i)).toBeInTheDocument()
        })
    })

    test("contains logo text", async () => {
        act(() => {
            render(routerWrapper(<LandingPage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/bookgle/i)).toBeInTheDocument()
        })
    })

    test("contains LOG IN button", async () => {
        act(() => {
            render(routerWrapper(<LandingPage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/LOG IN/i)).toBeInTheDocument()
        })
    })

    test("contains SIGN UP button", async () => {
        act(() => {
            render(routerWrapper(<LandingPage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/SIGN UP/i)).toBeInTheDocument()
        })
    })
})
