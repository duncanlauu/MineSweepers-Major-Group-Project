/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import BookProfilePage from "../BookProfilePage";
import {MemoryRouter, Route, Routes} from "react-router-dom";


describe("Components exist", () => {

    test("contains image", async () => {

        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByTestId("book-profile-card-image")).toBeInTheDocument()
        })
    })

    test("does not contain clear button since already rated", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            const clearButton = screen.queryByText("Clear")
            expect(clearButton).not.toBeInTheDocument()

        })
    })

    test("contains update rating button", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("Update rating")).toBeInTheDocument()
        })
    })

    test("contains actual title", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText(/Classical Mythology/i)).toBeInTheDocument()
        })
    })

    test("contains actual author", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText(/Mark P. O. Morford/i)).toBeInTheDocument()
        })
    })

    test("contains actual publication date", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText(/2002/i)).toBeInTheDocument()
        })
    })

    test("contains actual genre", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText(/Social Science/i)).toBeInTheDocument()
        })
    })

    test("contains actual publisher", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText(/Oxford University Press/i)).toBeInTheDocument()
        })
    })

    test("contains author", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText(/Author:/i)).toBeInTheDocument()
        })
    })

    test("contains publication date", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText(/Date:/i)).toBeInTheDocument()
        })
    })

    test("contains genre", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText(/Genre:/i)).toBeInTheDocument()
        })
    })

    test("contains publisher", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText(/Publisher:/i)).toBeInTheDocument()
        })
    })

    test("contains recommendations button", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/book_profile/0195153448"]}>
                    <Routes>
                        <Route path={'/book_profile/:book_id'} element={<BookProfilePage/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("See your recommendations")).toBeInTheDocument()
        })
    })
})