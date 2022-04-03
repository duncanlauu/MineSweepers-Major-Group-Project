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
import SingleSuggestedUser from "../SingleSuggestedUser";


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

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<SingleSuggestedUser suggestedUser={{
                id: 1,
                username: "test1",
                email: "test1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Gravatar for test1@example.com`)).toBeInTheDocument()
        })
    })

    test("contains username", async () => {
        act(() => {
            render(routerWrapper(<SingleSuggestedUser suggestedUser={{
                id: 1,
                username: "test1",
                email: "test1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`test1`)).toBeInTheDocument()
        })
    })
})
