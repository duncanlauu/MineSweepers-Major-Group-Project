/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import HomePage from "../HomePage";
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

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<HomePage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Our Recommendations/i)).toBeInTheDocument()
        })
    })

    test("contains subheading", async () => {
        act(() => {
            render(routerWrapper(<HomePage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Books/i)).toBeInTheDocument()
        })
    })

    test("contains link to see all recommendations", async () => {
        act(() => {
            render(routerWrapper(<HomePage/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/See all recommendations/i)).toBeInTheDocument()
        })
    })

    test("contains club heading", async () => {
        act(() => {
            render(routerWrapper(<HomePage/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Clubs")).toBeInTheDocument()
        })
    })

    test("contains club recommendations link", async () => {
        act(() => {
            render(routerWrapper(<HomePage/>))
        })

        await waitFor(() => {
            expect(screen.getByText("See all club recommendations")).toBeInTheDocument()
        })
    })

    test("contains all clubs link", async () => {
        act(() => {
            render(routerWrapper(<HomePage/>))
        })

        await waitFor(() => {
            expect(screen.getByText("See all clubs")).toBeInTheDocument()
        })
    })
})
