/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SinglePostComment from "../SinglePostComment";
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

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<SinglePostComment
                currentPost={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: 1,
                    author__email: "author1@example.com",
                    content: "content1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByAltText("Gravatar for author1@example.com")).toBeInTheDocument()
        })
    })

    test("contains content", async () => {
        act(() => {
            render(routerWrapper(<SinglePostComment
                currentPost={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: 1,
                    author__email: "author1@example.com",
                    content: "content1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText("content1")).toBeInTheDocument()
        })
    })

    test("contains remove button if current user is the author", async () => {
        act(() => {
            render(routerWrapper(<SinglePostComment
                currentPost={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: 1,
                    author__email: "author1@example.com",
                    content: "content1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText("x")).toBeInTheDocument()
        })
    })

    test("does not contain remove button if current user is not the author", async () => {
        act(() => {
            render(routerWrapper(<SinglePostComment
                currentPost={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: 2,
                    author__email: "author2@example.com",
                    content: "content2"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.queryByText("x")).not.toBeInTheDocument()
        })
    })

    test("contains reply button", async () => {
        act(() => {
            render(routerWrapper(<SinglePostComment
                currentPost={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: "author1",
                    author__email: "author1@example.com",
                    content: "content1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText("Reply")).toBeInTheDocument()
        })
    })
})
