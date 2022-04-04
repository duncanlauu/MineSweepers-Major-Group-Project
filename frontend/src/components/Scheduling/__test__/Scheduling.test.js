/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import Scheduling from "../Scheduling";
import {MemoryRouter, Route, Routes} from "react-router-dom";
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

    test("contains header", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Please wait for the book recommendations/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    test("contains meeting header", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("Create a meeting")).toBeInTheDocument()
        })
    })

    test("contains name input", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("Name")).toBeInTheDocument()
        })
    })

    test("contains description input", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("Description")).toBeInTheDocument()
        })
    })

    test("contains book input", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("Book")).toBeInTheDocument()
        })
    })

    test("contains start time input", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("Start time")).toBeInTheDocument()
        })
    })

    test("contains end time input", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("End time")).toBeInTheDocument()
        })
    })

    test("contains link input", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("Meeting link")).toBeInTheDocument()
        })
    })

    test("contains create button", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByText("Create")).toBeInTheDocument()
        })
    })

    test("contains all recommended books", async () => {
        act(() => {
            render(
                <MemoryRouter initialEntries={["/scheduling/1"]}>
                    <Routes>
                        <Route path={'/scheduling/:club_id'} element={<Scheduling/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            for (let i = 0; i < 5; i++) {
                expect(screen.getByText(`book${i + 1}`)).toBeInTheDocument()
            }
        })
    })
})
