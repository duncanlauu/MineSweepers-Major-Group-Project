/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import UserProfileEditor from "../UserProfileEditor";
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json"
import routerWrapper from "../../../test-helpers";


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
            render(routerWrapper(<UserProfileEditor currentUser={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Edit Profile`)).toBeInTheDocument();
        })
    })

    test("contains bio", async () => {
        act(() => {
            render(routerWrapper(<UserProfileEditor currentUser={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Bio`)).toBeInTheDocument();
        })
    })

    test("contains location", async () => {
        act(() => {
            render(routerWrapper(<UserProfileEditor currentUser={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Location`)).toBeInTheDocument();
        })
    })

    test("contains save changes button", async () => {
        act(() => {
            render(routerWrapper(<UserProfileEditor currentUser={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Save changes`)).toBeInTheDocument();
        })
    })
})
