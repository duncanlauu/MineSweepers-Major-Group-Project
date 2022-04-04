/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SingleFriendRequest from "../SingleFriendRequest";
import routerWrapper from "../../../../test-helpers";


describe("Components exist", () => {

    test("contains accept button", async () => {
        act(() => {
            render(routerWrapper(<SingleFriendRequest friendRequest={{
                sender__email: "friend@example.com",
                sender__username: "friend",
                sender: 1
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Accept")).toBeInTheDocument()
        })
    })

    test("contains reject button", async () => {
        act(() => {
            render(routerWrapper(<SingleFriendRequest friendRequest={{
                sender__email: "friend@example.com",
                sender__username: "friend",
                sender: 1
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Reject")).toBeInTheDocument()
        })
    })

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<SingleFriendRequest friendRequest={{
                sender__email: "friend@example.com",
                sender__username: "friend",
                sender: 1
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText("Gravatar for friend@example.com")).toBeInTheDocument()
        })
    })

    test("contains sender username", async () => {
        act(() => {
            render(routerWrapper(<SingleFriendRequest friendRequest={{
                sender__email: "friend@example.com",
                sender__username: "friend",
                sender: 1
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("friend")).toBeInTheDocument()
        })
    })
})
