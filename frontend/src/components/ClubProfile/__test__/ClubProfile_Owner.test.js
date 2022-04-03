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



    describe('Profile tab shows correct contents', () => {

        test('shows club description', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const description = screen.getByText(/after our success with space programmes, we decided to start a book club/i)
                expect(description).toBeInTheDocument()
            })
        })

        test('shows owners Gravatar', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const ownerGravatar = screen.getByRole('img', { name: /gravatar for jeb@example\.org/i })
                expect(ownerGravatar).toBeInTheDocument()
            })
        })

        test('shows transfer ownership text', async () => {

            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const transferOwnership = screen.getByText(/if you would like to leave the club, please transfer the ownership/i)
                expect(transferOwnership).toBeInTheDocument()
            })
        })

        describe('does not show content for users with different relationship to club', () => {

            test('does not show apply button', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const apply = screen.queryAllByRole('button', { name: /apply/i })
                    expect(apply).toHaveLength(0)
                })
            })

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
                    const bookTitle = screen.getByText(/elementary statistics/i)
                    expect(bookTitle).toBeInTheDocument()
                })
            })

            test('shows correct first books author and year of release', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const authorRelease = screen.getByText(/mario f\. triola, 2000/i)
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

