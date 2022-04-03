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
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// render the club profile with memory router and initial entries as wrapper
const renderClubProfile = (role) => {
    let club_id;

    switch (role) {
        case 'not_applied':
            club_id = '3'
            break
        case 'applied':
            club_id = '4'
            break
        case 'member':
            club_id = '2'
            break
        case 'admin':
            club_id = '15'
            break
        case 'owner':
            club_id = '1'
            break
        case 'banned':
            club_id = '10'
    }

    return render(
        <MemoryRouter initialEntries={[`/club_profile/${club_id}`]}>
            <Routes>
                <Route path='club_profile/:club_id' element={<ClubProfile />} />
            </Routes>
        </MemoryRouter>)
}

// Test different users: Not applied (2), applied, member, admin, owner, banned. Create different club mocks where current user has each relationship to.
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        club_id: '1',
    }),
}))

beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
    });
});

beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("user", JSON.stringify(user));
});


describe('User is banned', () => {

    const role = 'banned'

    test('contains name of club', async () => {

        act(() => {
            renderClubProfile(role);
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Margaretmouth Book Club/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    describe('Correct tabs are shown', () => {

        test('contains profile tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const profileTab = screen.getByRole('tab', { name: /profile/i })
                expect(profileTab).toBeInTheDocument()
            })
        })

        test('does not contain members tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const membersTab = screen.queryAllByRole('tab', { name: /members/i })
                expect(membersTab).toHaveLength(0)
            })
        })

        test('does not contain feed tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const feedTab = screen.queryAllByRole('tab', { name: /feed/i })
                expect(feedTab).toHaveLength(0)
            })
        })

        test('does not contain meetings tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const meetingsTab = screen.queryAllByRole('tab', { name: /meetings/i })
                expect(meetingsTab).toHaveLength(0)
            })
        })
    })
})

describe('User has not applied', () => {

    const role = 'not_applied'

    test('contains name of club', async () => {

        act(() => {
            renderClubProfile(role);
        })

        await waitFor(() => {
            const headingText = screen.getByText(/South Nathan Book Club/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    describe('Correct tabs are shown', () => {

        test('contains profile tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const profileTab = screen.getByRole('tab', { name: /profile/i })
                expect(profileTab).toBeInTheDocument()
            })
        })

        test('does not contain members tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const membersTab = screen.queryAllByRole('tab', { name: /members/i })
                expect(membersTab).toHaveLength(0)
            })
        })

        test('does not contain feed tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const feedTab = screen.queryAllByRole('tab', { name: /feed/i })
                expect(feedTab).toHaveLength(0)
            })
        })

        test('does not contain meetings tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const meetingsTab = screen.queryAllByRole('tab', { name: /meetings/i })
                expect(meetingsTab).toHaveLength(0)
            })
        })
    })
})

describe('User has applied', () => {

    const role = 'applied'

    test('contains name of club', async () => {

        act(() => {
            renderClubProfile(role);
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Flemingfort Book Club/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    describe('Correct tabs are shown', () => {

        test('contains profile tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const profileTab = screen.getByRole('tab', { name: /profile/i })
                expect(profileTab).toBeInTheDocument()
            })
        })

        test('does not contain members tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const membersTab = screen.queryAllByRole('tab', { name: /members/i })
                expect(membersTab).toHaveLength(0)
            })
        })

        test('does not contain feed tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const feedTab = screen.queryAllByRole('tab', { name: /feed/i })
                expect(feedTab).toHaveLength(0)
            })
        })

        test('does not contain meetings tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const meetingsTab = screen.queryAllByRole('tab', { name: /meetings/i })
                expect(meetingsTab).toHaveLength(0)
            })
        })
    })
})

describe('User is member', () => {

    const role = 'member'

    test('contains name of club', async () => {

        act(() => {
            renderClubProfile(role);
        })

        await waitFor(() => {
            const headingText = screen.getByText(/West Guyview Book Club/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    describe('Correct tabs are shown', () => {

        test('contains profile tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const profileTab = screen.getByRole('tab', { name: /profile/i })
                expect(profileTab).toBeInTheDocument()
            })
        })

        test('contains members tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const membersTab = screen.getByRole('tab', { name: /members/i })
                expect(membersTab).toBeInTheDocument()
            })
        })

        test('contains feed tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const feedTab = screen.getByRole('tab', { name: /feed/i })
                expect(feedTab).toBeInTheDocument()
            })
        })

        test('contains meetings tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const meetingsTab = screen.getByRole('tab', { name: /meetings/i })
                expect(meetingsTab).toBeInTheDocument()
            })
        })
    })
})

describe('User is admin', () => {

    const role = 'admin'

    test('contains name of club', async () => {

        act(() => {
            renderClubProfile(role);
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Hayesberg Book Club/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    describe('Correct tabs are shown', () => {

        test('contains profile tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const profileTab = screen.getByRole('tab', { name: /profile/i })
                expect(profileTab).toBeInTheDocument()
            })
        })

        test('contains members tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const membersTab = screen.getByRole('tab', { name: /members/i })
                expect(membersTab).toBeInTheDocument()
            })
        })

        test('contains feed tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const feedTab = screen.getByRole('tab', { name: /feed/i })
                expect(feedTab).toBeInTheDocument()
            })
        })

        test('contains meetings tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const meetingsTab = screen.getByRole('tab', { name: /meetings/i })
                expect(meetingsTab).toBeInTheDocument()
            })
        })
    })
})

describe('User is owner', () => {

    const role = 'owner'

    test('contains name of club', async () => {

        act(() => {
            renderClubProfile(role);
        })

        await waitFor(() => {
            const headingText = screen.getByText(/kerbal book club/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    describe('Correct tabs are shown', () => {

        test('contains profile tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const profileTab = screen.getByRole('tab', { name: /profile/i })
                expect(profileTab).toBeInTheDocument()
            })
        })

        test('contains members tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const membersTab = screen.getByRole('tab', { name: /members/i })
                expect(membersTab).toBeInTheDocument()
            })
        })

        test('contains feed tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const feedTab = screen.getByRole('tab', { name: /feed/i })
                expect(feedTab).toBeInTheDocument()
            })
        })

        test('contains meetings tab', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const meetingsTab = screen.getByRole('tab', { name: /meetings/i })
                expect(meetingsTab).toBeInTheDocument()
            })
        })
    })
})

