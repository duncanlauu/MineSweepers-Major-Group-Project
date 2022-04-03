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
                post={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: 1,
                    author__email: "commentauthor1@example.com",
                    content: "comment content1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByAltText("Gravatar for commentauthor1@example.com")).toBeInTheDocument()
        })
    })

    test("contains content", async () => {
        act(() => {
            render(routerWrapper(<SinglePostComment
                post={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: 1,
                    author__email: "commentauthor1@example.com",
                    content: "comment content1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText(/comment content1/i)).toBeInTheDocument()
        })
    })

    test("contains remove button if current user is the author", async () => {
        act(() => {
            render(routerWrapper(<SinglePostComment
                post={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: 1,
                    author__email: "commentauthor1@example.com",
                    content: "comment content1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByTestId("comment-remove-button")).toBeInTheDocument()
        })
    })

    test("does not contain remove button if current user is not the author", async () => {
        act(() => {
            render(routerWrapper(<SinglePostComment
                post={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: 2,
                    author__email: "commentauthor2@example.com",
                    content: "comment content2"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.queryByTestId("comment-remove-button")).not.toBeInTheDocument()
        })
    })

    test("contains reply button", async () => {
        act(() => {
            render(routerWrapper(<SinglePostComment
                post={{
                    id: 1,
                }}
                comment={{
                    id: 1,
                    author: 1,
                    author__email: "commentauthor1@example.com",
                    content: "comment content1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByTestId(/comment-reply-button/i)).toBeInTheDocument()
        })
    })
})