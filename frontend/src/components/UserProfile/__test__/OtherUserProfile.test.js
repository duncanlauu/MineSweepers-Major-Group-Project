/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import OtherUserProfile from "../OtherUserProfile";
import fakeLocalStorage from "../../../fakeLocalStorage";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import user from "../../../mocksData/getCurrentUser.json"


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
            render(
                <MemoryRouter initialEntries={["/user_profile/1"]}>
                    <Routes>
                        <Route path={'/user_profile/:user_id'} element={<OtherUserProfile/>}/>
                    </Routes>
                </MemoryRouter>
            )
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Gravatar for test1@test.org`)).toBeInTheDocument();
        })
    })
})
