/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json"
import renderClubProfile from './clubProfileHelper';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        club_id: '3',
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

    describe('Profile tab shows correct contents', () => {

        test('shows club description', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const description = screen.getByText(/reprehenderit excepturi corrupti recusandae\./i)
                expect(description).toBeInTheDocument()
            })
        })

        test('shows owners Gravatar', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const ownerGravatar = screen.getByRole('img', { name: /gravatar for julie73@example\.net/i })
                expect(ownerGravatar).toBeInTheDocument()
            })
        })

        test('shows apply button', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const apply = screen.getByRole('button', { name: /apply/i })
                expect(apply).toBeInTheDocument()
            })
        })

        test('clicking apply button toggles it to show  withdraw application', async () => {

            act(() => {
                renderClubProfile(role);
            })

            const apply = await screen.findByRole('button', { name: /apply/i })
            fireEvent.click(apply)

            const withdrawApplication = await screen.findByRole('button', { name: /withdraw application/i })
            expect(withdrawApplication).toBeInTheDocument()

        })

        describe('does not show content for users with different relationship to club', () => {

            test('does not show leave club button', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const leave = screen.queryAllByRole('button', { name: /leave club/i })
                    expect(leave).toHaveLength(0)
                })
            })

            test('does not show you are banned text', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const bannedText = screen.queryAllByText(/you are banned from this club/i)
                    expect(bannedText).toHaveLength(0)
                })
            })

            test('does not show transfer ownership text', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const transferOwnership = screen.queryAllByText(/if you would like to leave the club, please transfer the ownership/i)
                    expect(transferOwnership).toHaveLength(0)
                })
            })

            test('does not show withdraw application text', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const withdrawApplication = screen.queryAllByRole('button', { name: /withdraw application/i })
                    expect(withdrawApplication).toHaveLength(0)
                })
            })
        })

        describe('Reading history', () => {
            test('shows reading history heading', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const readingHistory = screen.getByRole('heading', { name: /reading history/i })
                    expect(readingHistory).toBeInTheDocument()
                })
            })

            test('shows correct first book', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const bookTitle = screen.getByText(/violent ward/i)
                    expect(bookTitle).toBeInTheDocument()
                })
            })

            test('shows correct first books author and year of release', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const authorRelease = screen.getByText(/len deighton, 1994/i)
                    expect(authorRelease).toBeInTheDocument()
                })
            })

            test('shows correct amount of books in reading history', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const books = screen.getAllByTestId('IndividualBookCard')
                    expect(books).toHaveLength(10)
                })
            })
        })
    })
})