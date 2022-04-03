/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import PostCommentList from "../PostCommentList";
import routerWrapper from "../../../test-helpers";
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json";
import SinglePostComment from "../SinglePostComment";


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

    test("contains comment input field", async () => {
        act(() => {
            render(routerWrapper(<PostCommentList
                post={{
                    id: 1
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByTestId("comment-input")).toBeInTheDocument()
        })
    })

    test("contains send button", async () => {
        act(() => {
            render(routerWrapper(<PostCommentList
                post={{
                    id: 1
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText("Send")).toBeInTheDocument()
        })
    })

    test("contains all gravatars", async () => {
        act(() => {
            render(routerWrapper(<PostCommentList
                post={{
                    id: 1
                }}
            />))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByAltText(`Gravatar for author${i}@example.com`)).toBeInTheDocument()
            }
        })
    })

    test("contains all contents", async () => {
        act(() => {
            render(routerWrapper(<PostCommentList
                post={{
                    id: 1
                }}
            />))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByText(`Comment ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains remove button for one of the comments", async () => {
        act(() => {
            render(routerWrapper(<PostCommentList
                post={{
                    id: 1
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getAllByText("x").length).toBe(1)
        })
    })
})
