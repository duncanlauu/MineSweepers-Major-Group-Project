/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import CommentReplyList from "../CommentReplyList";
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

    test("contains reply input field", async () => {
        act(() => {
            render(routerWrapper(<CommentReplyList
                post={{
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
            expect(screen.getByTestId("reply-input")).toBeInTheDocument()
        })
    })

    test("contains send button", async () => {
        act(() => {
            render(routerWrapper(<CommentReplyList
                post={{
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
            expect(screen.getByText("Send")).toBeInTheDocument()
        })
    })

    test("contains all gravatars", async () => {
        act(() => {
            render(routerWrapper(<CommentReplyList
                post={{
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
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByAltText(`Gravatar for author${i}@example.com`)).toBeInTheDocument()
            }
        })
    })

    test("contains all reply contents", async () => {
        act(() => {
            render(routerWrapper(<CommentReplyList
                post={{
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
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByText(`Reply ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains delete button", async () => {
        act(() => {
            render(routerWrapper(<CommentReplyList
                post={{
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
            expect(screen.getAllByText("x").length).toBe(1)
        })
    })
})
