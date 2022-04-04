/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import routerWrapper from "../../../../test-helpers";
import fakeLocalStorage from "../../../../fakeLocalStorage";
import user from "../../../../mocksData/getCurrentUser.json";
import SuggestedUserList from "../SuggestedUserList";


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

    test("contains suggested users heading", async () => {
        act(() => {
            render(routerWrapper(<SuggestedUserList/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Suggested Users`)).toBeInTheDocument()
        })
    })

    test("contains all recommended usernames", async () => {
        act(() => {
            render(routerWrapper(<SuggestedUserList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByText(`test${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains all recommended gravatars", async () => {
        act(() => {
            render(routerWrapper(<SuggestedUserList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByAltText(`Gravatar for test${i}@test.org`)).toBeInTheDocument()
            }
        })
    })
})
