/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SinglePersonalPost from "../SinglePersonalPost";
import routerWrapper from "../../../../test-helpers";
import fakeLocalStorage from "../../../../fakeLocalStorage";
import user from "../../../../mocksData/getCurrentUser.json";


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

    test("contains author's gravatar", async () => {
        act(() => {
            render(routerWrapper(<SinglePersonalPost personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Gravatar for author1@example.com`)).toBeInTheDocument()
        })
    })

    test("contains edit button", async () => {
        act(() => {
            render(routerWrapper(<SinglePersonalPost personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Edit")).toBeInTheDocument()
        })
    })

    test("contains remove button", async () => {
        act(() => {
            render(routerWrapper(<SinglePersonalPost personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("X")).toBeInTheDocument()
        })
    })

    test("contains title", async () => {
        act(() => {
            render(routerWrapper(<SinglePersonalPost personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("title1")).toBeInTheDocument()
        })
    })

    test("contains content", async () => {
        act(() => {
            render(routerWrapper(<SinglePersonalPost personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("content1")).toBeInTheDocument()
        })
    })

    test("contains comments button", async () => {
        act(() => {
            render(routerWrapper(<SinglePersonalPost personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("view all comments")).toBeInTheDocument()
        })
    })
})
