/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SingleFeedPost from "../SingleFeedPost";
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
            render(routerWrapper(<SingleFeedPost
                feedPost={{
                    id: 1,
                    author: 1,
                    title: "Post title 1",
                    content: "Post content 1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByAltText("Gravatar for test1@test.org")).toBeInTheDocument()
        })
    })

    test("contains poster name", async () => {
        act(() => {
            render(routerWrapper(<SingleFeedPost
                feedPost={{
                    id: 1,
                    author: 1,
                    title: "Post title 1",
                    content: "Post content 1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText("@test1")).toBeInTheDocument()
        })
    })

    test("contains post title", async () => {
        act(() => {
            render(routerWrapper(<SingleFeedPost
                feedPost={{
                    id: 1,
                    author: 1,
                    title: "Post title 1",
                    content: "Post content 1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText("Post title 1")).toBeInTheDocument()
        })
    })

    test("contains post content", async () => {
        act(() => {
            render(routerWrapper(<SingleFeedPost
                feedPost={{
                    id: 1,
                    author: 1,
                    title: "Post title 1",
                    content: "Post content 1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText("Post content 1")).toBeInTheDocument()
        })
    })

    test("contains view all comments button", async () => {
        act(() => {
            render(routerWrapper(<SingleFeedPost
                feedPost={{
                    id: 1,
                    author: 1,
                    title: "Post title 1",
                    content: "Post content 1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText("view all comments")).toBeInTheDocument()
        })
    })

    test("contains like count", async () => {
        act(() => {
            render(routerWrapper(<SingleFeedPost
                feedPost={{
                    id: 1,
                    author: 1,
                    title: "Post title 1",
                    content: "Post content 1"
                }}
            />))
        })

        await waitFor(() => {
            expect(screen.getByText("Likes: 3")).toBeInTheDocument()
        })
    })
})
