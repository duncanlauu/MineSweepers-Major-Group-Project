/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SingleFriend from "../SingleFriend";
import routerWrapper from "../../../../test-helpers";


describe("Components exist", () => {

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<SingleFriend friend={{
                id: 1,
                username: "test1",
                email: "test1@example.org"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText("Gravatar for test1@example.org")).toBeInTheDocument()
        })
    })

    test("contains username", async () => {
        act(() => {
            render(routerWrapper(<SingleFriend friend={{
                id: 1,
                username: "test1",
                email: "test1@example.org"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("test1")).toBeInTheDocument()
        })
    })

    test("contains remove button", async () => {
        act(() => {
            render(routerWrapper(<SingleFriend friend={{
                id: 1,
                username: "test1",
                email: "test1@example.org"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("X")).toBeInTheDocument()
        })
    })

    test("contains gravatar for other user", async () => {
        act(() => {
            render(routerWrapper(<SingleFriend friend={{
                id: 1,
                username: "test1",
                email: "test1@example.org"
            }} requestedUser_id={2}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText("Gravatar for test1@example.org")).toBeInTheDocument()
        })
    })

    test("contains username for other user", async () => {
        act(() => {
            render(routerWrapper(<SingleFriend friend={{
                id: 1,
                username: "test1",
                email: "test1@example.org"
            }} requestedUser_id={2}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("test1")).toBeInTheDocument()
        })
    })

    test("does not contain remove button for other user", async () => {
        act(() => {
            render(routerWrapper(<SingleFriend friend={{
                id: 1,
                username: "test1",
                email: "test1@example.org"
            }} requestedUser_id={2}/>))
        })

        await waitFor(() => {
            expect(screen.queryByText("X")).not.toBeInTheDocument()
        })
    })
})
