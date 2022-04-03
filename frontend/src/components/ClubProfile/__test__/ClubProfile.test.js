/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import ClubProfile from '../ClubProfile';
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json"
import { MemoryRouter, BrowserRouter, Route, Routes } from 'react-router-dom';


beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
    });
});

beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("user", JSON.stringify(user));
});

// Test different users: Not applied, applied, member, admin, owner, banned. Create different club mocks where current user has each relationship to.
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        club_id: '1',
    }),
}))


describe('Components exist', () => {

    test('contains heading', async () => {
        act(() => {
            // render(<ClubProfile />, { wrapper: MemoryRouter });
            render(
                <MemoryRouter initialEntries={["/club_profile/1"]}>
                    <Routes>
                        <Route path='club_profile/:club_id' element={<ClubProfile />} />
                    </Routes>
                </MemoryRouter>
            );
        })

        await waitFor(() => {
            const headingText = screen.getByText(/kerbal book club/i)
            expect(headingText).toBeInTheDocument()
        })
    })
})