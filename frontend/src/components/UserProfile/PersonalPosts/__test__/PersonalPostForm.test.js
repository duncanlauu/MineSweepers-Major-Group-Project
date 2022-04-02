/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import PersonalPostForm from "../PersonalPostForm";
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

    test("contains edit post button for an existing post", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Edit Post`)).toBeInTheDocument()
        })
    })

    test("does not contain upload post button for an existing post", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.queryByText(`Upload Post`)).not.toBeInTheDocument()
        })
    })

    test("contains upload post button for a new post", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Upload Post`)).toBeInTheDocument()
        })
    })

    test("does not contain edit post button for a new post", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm/>))
        })

        await waitFor(() => {
            expect(screen.queryByText(`Edit Post`)).not.toBeInTheDocument()
        })
    })

    test("contains title", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Title`)).toBeInTheDocument()
        })
    })

    test("contains content", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Content`)).toBeInTheDocument()
        })
    })

    test("contains title for new post", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Title`)).toBeInTheDocument()
        })
    })

    test("contains content for new post", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Content`)).toBeInTheDocument()
        })
    })

    test("contains actual content", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`content1`)).toBeInTheDocument()
        })
    })

    test("contains clubs", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Club`)).toBeInTheDocument()
        })
    })

    test("contains all clubs", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByText(`Club ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains save button for existing posts", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Save`)).toBeInTheDocument()
        })
    })

    test("does not contains post button for existing posts", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.queryByText(`Post!`)).not.toBeInTheDocument()
        })
    })

    test("contains post button for new posts", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Post!`)).toBeInTheDocument()
        })
    })

    test("does not contain save button for new posts", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostForm/>))
        })

        await waitFor(() => {
            expect(screen.queryByText(`Save`)).not.toBeInTheDocument()
        })
    })
})
