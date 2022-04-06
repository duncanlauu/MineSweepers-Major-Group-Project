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

    describe('Members tab shows correct contents', () => {

        describe('contains correct components', () => {
            test('shows owner title', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const title = screen.getByTestId('ownerMemberCard')
                expect(title).toBeInTheDocument()
            })

            test('shows admins title', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const title = screen.getByText(/admins/i)
                expect(title).toBeInTheDocument()
            })

            test('shows members title', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const title = screen.getByTestId('membersTitle')
                expect(title).toBeInTheDocument()
            })

            test('shows applicants title', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const title = screen.getByText(/applicants/i)
                expect(title).toBeInTheDocument()
            })

            test('displays correct number of people', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const people = screen.queryAllByTestId('individualMemberCard')
                expect(people).toHaveLength(6)
            })
        })

        describe('displays first person correctly', () => {

            test('displays name', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const name = screen.getByRole('link', { name: /jeb/i });
                expect(name).toBeInTheDocument()
            })

            test('displays email', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const email = screen.getByText(/jeb@example\.org/i)
                expect(email).toBeInTheDocument()
            })

            test('displays bio with max. 45 characters', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const bio = screen.getByText(/i love chess! i mean books, i love books\./i)
                expect(bio).toBeInTheDocument()
            })
        });

        describe('manage members functionality', () => {

            test('contains the same number of ban buttons as members + admins', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const members = screen.queryAllByTestId('memberMemberCard')
                const admins = screen.queryAllByTestId('adminMemberCard')
                const banButtons = screen.queryAllByRole('button', { name: "Ban" })

                expect(members.length + admins.length).toBe(banButtons.length)
            })

            test('contains the same number of accept buttons as applicants', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const applicants = screen.queryAllByTestId('applicantMemberCard')
                const banButtons = screen.queryAllByRole('button', { name: /accept/i })

                expect(applicants.length).toBe(banButtons.length)
            })

            test('contains the same number of reject buttons as applicants', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const applicants = screen.queryAllByTestId('applicantMemberCard')
                const banButtons = screen.queryAllByRole('button', { name: /reject/i })

                expect(applicants.length).toBe(banButtons.length)
            })

            test('contains the same number of unban buttons as banned users', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const bannedUsers = screen.queryAllByTestId('bannedMemberCard')
                const banButtons = screen.queryAllByRole('button', { name: /unban/i })

                expect(bannedUsers.length).toBe(banButtons.length)
            })

            test('contains the same number of make owner buttons as admins', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /members/i })
                    fireEvent.click(feedTab)
                })

                const adminUsers = screen.queryAllByTestId('adminMemberCard')
                const makeOwnerButtons = screen.queryAllByRole('button', { name: /make owner/i })

                expect(adminUsers.length).toBe(makeOwnerButtons.length)
            })
        });
    })

    describe('Feed Tab shows correct contents', () => {

        test('shows the correct number of posts', async () => {

            act(() => {
                renderClubProfile(role);
            })

            const feedTab = await screen.findByRole('tab', { name: /feed/i })
            fireEvent.click(feedTab)

            const posts = await screen.findAllByTestId('singleFeedPost')
            expect(posts).toHaveLength(1)
        })


        describe('shows correct first post', () => {

            test('correct author', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                const feedTab = await screen.findByRole('tab', { name: /feed/i })
                fireEvent.click(feedTab)

                const author = await screen.findByText(/@jeb/i)
                expect(author).toBeInTheDocument()
            })

            test('correct title', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                const feedTab = await screen.findByRole('tab', { name: /feed/i })
                fireEvent.click(feedTab)

                const title = await screen.findByText(/aspernatur cumque voluptatibus asperiores\./i)
                expect(title).toBeInTheDocument()
            })


            test('correct content', async () => {

                act(() => {
                    renderClubProfile(role);
                })

                const feedTab = await screen.findByRole('tab', { name: /feed/i })
                fireEvent.click(feedTab)

                const title = await screen.findByText(/libero cupiditate temporibus optio delectus\. similique illum deserunt adipisci occaecati earum\./i)
                expect(title).toBeInTheDocument()
            })
        })
    })




    describe('Meetings tab shows correct contents', () => {

        describe('contains correct components', () => {

            test('shows all meetigns heading', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                const feedTab = await screen.findByRole('tab', { name: /meetings/i })
                fireEvent.click(feedTab)

                const heading = screen.getByText(/all meetings/i)
                expect(heading).toBeInTheDocument()
            })

            test('shows schedule meeting button', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                const feedTab = await screen.findByRole('tab', { name: /meetings/i })
                fireEvent.click(feedTab)

                const button = screen.getByRole('button', { name: /schedule a meeting/i })
                expect(button).toBeInTheDocument()
            })
        })

        describe('displays correct contents of first meeting', () => {

            test('shows correct meeting title', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /meetings/i })
                    fireEvent.click(feedTab)
                })

                const title = screen.getByText(/Kerbal book meeting number 1/i)
                expect(title).toBeInTheDocument()
            })

            test('shows correct meeting book', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /meetings/i })
                    fireEvent.click(feedTab)
                })

                const book = screen.getByText(/Happy Birthday, Moon/i)
                expect(book).toBeInTheDocument()
            })

            test('shows correct meeting description', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                await waitFor(() => {
                    const feedTab = screen.getByRole('tab', { name: /meetings/i })
                    fireEvent.click(feedTab)
                })

                const description = screen.getByText(/Reading books but also space, what else could you possibly need\?/i)
                expect(description).toBeInTheDocument()
            })
        })

        test('shows correct number of meetings', async () => {
            act(() => {
                renderClubProfile(role);
            })

            await waitFor(() => {
                const feedTab = screen.getByRole('tab', { name: /meetings/i })
                fireEvent.click(feedTab)
            })

            const meetings = screen.queryAllByTestId('singleMeetingCard')
            expect(meetings).toHaveLength(7)
        })
    })
})

