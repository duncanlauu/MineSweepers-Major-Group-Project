/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import LandingPage from "../LandingPage";
import routerWrapper from "../../../test-helpers";
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json";


beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
    });
});

beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("user", JSON.stringify(user));
});


describe("Components exist", () => {

    test("contains welcome text", async () => {
        act(() => {
            render(routerWrapper(<LandingPage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Welcome to Bookgle, a social media app/i)).toBeInTheDocument()
            expect(screen.getByText(/where the bookworms of our society converge./i)).toBeInTheDocument()
        })
    })

    test("contains log in button", async () => {
        act(() => {
            render(routerWrapper(<LandingPage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Or log into an existing account./i)).toBeInTheDocument()
        })
    })

    test("contains sign up button", async () => {
        act(() => {
            render(routerWrapper(<LandingPage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Sign Up Today/i)).toBeInTheDocument()
        })
    })

    test("contains link to log in", async () => {
        act(() => {
            render(routerWrapper(<LandingPage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Or log into an existing account./i).closest('a')).toHaveAttribute('href', '/log_in/')
        })
    })

    test("contains link to sign up", async () => {
        act(() => {
            render(routerWrapper(<LandingPage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Sign Up Today/i).closest('a')).toHaveAttribute('href', '/sign_up/')
        })
    })
})
