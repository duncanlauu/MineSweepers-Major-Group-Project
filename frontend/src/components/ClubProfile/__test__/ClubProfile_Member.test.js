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
        club_id: '2',
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

describe('User is member', () => {

    const role = 'member'

    // test('contains name of club', async () => {

    //     act(() => {
    //         renderClubProfile(role);
    //     })

    //     await waitFor(() => {
    //         const headingText = screen.getByText(/West Guyview Book Club/i)
    //         expect(headingText).toBeInTheDocument()
    //     })
    // })

    // describe('Correct tabs are shown', () => {

    //     test('contains profile tab', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const profileTab = screen.getByRole('tab', { name: /profile/i })
    //             expect(profileTab).toBeInTheDocument()
    //         })
    //     })

    //     test('contains members tab', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const membersTab = screen.getByRole('tab', { name: /members/i })
    //             expect(membersTab).toBeInTheDocument()
    //         })
    //     })

    //     test('contains feed tab', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const feedTab = screen.getByRole('tab', { name: /feed/i })
    //             expect(feedTab).toBeInTheDocument()
    //         })
    //     })

    //     test('contains meetings tab', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const meetingsTab = screen.getByRole('tab', { name: /meetings/i })
    //             expect(meetingsTab).toBeInTheDocument()
    //         })
    //     })
    // })

    // describe('Profile tab shows correct contents', () => {

    //     test('shows club description', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const description = screen.getByText(/rerum saepe blanditiis eum voluptatibus\. culpa ut deserunt aspernatur officiis aperiam\. voluptatem nesciunt saepe totam voluptatibus at\. autem laudantium officia praesentium aspernatur\. itaque voluptates cum quo\. optio natus voluptate modi\. possimus veniam vero\. quod reiciendis quis ut\. neque reprehenderit ducimus optio aliquam mollitia praesentium\./i)
    //             expect(description).toBeInTheDocument()
    //         })
    //     })

    //     test('shows owners Gravatar', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const ownerGravatar = screen.getByRole('img', { name: /gravatar for bob@example\.org/i })
    //             expect(ownerGravatar).toBeInTheDocument()
    //         })
    //     })

    //     test('shows leave club button', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const leaveClub = screen.getByRole('button', { name: /leave club/i })
    //             expect(leaveClub).toBeInTheDocument()
    //         })
    //     })

    //     test('clicking leave club button toggles it to show apply', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         const leaveClub = await screen.findByRole('button', { name: /leave club/i })
    //         fireEvent.click(leaveClub)

    //         const applyButton = await screen.findByRole('button', { name: /apply/i })
    //         expect(applyButton).toBeInTheDocument()

    //     })



    //     describe('does not show content for users with different relationship to club', () => {

    //         test('does not show apply button', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const apply = screen.queryAllByRole('button', { name: /apply/i })
    //                 expect(apply).toHaveLength(0)
    //             })
    //         })

    //         test('does not show you are banned text', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const bannedText = screen.queryAllByText(/you are banned from this club/i)
    //                 expect(bannedText).toHaveLength(0)
    //             })
    //         })

    //         test('does not show transfer ownership text', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const transferOwnership = screen.queryAllByText(/if you would like to leave the club, please transfer the ownership/i)
    //                 expect(transferOwnership).toHaveLength(0)
    //             })
    //         })

    //         test('does not show withdraw application text', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const withdrawApplication = screen.queryAllByRole('button', { name: /withdraw application/i })
    //                 expect(withdrawApplication).toHaveLength(0)
    //             })
    //         })
    //     })



    //     describe('Reading history', () => {
    //         test('shows reading history heading', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const readingHistory = screen.getByRole('heading', { name: /reading history/i })
    //                 expect(readingHistory).toBeInTheDocument()
    //             })
    //         })

    //         test('shows correct first book', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const bookTitle = screen.getByText(/working women don't have wives: professional success in the 1990s/i)
    //                 expect(bookTitle).toBeInTheDocument()
    //             })
    //         })

    //         test('shows correct first books author and year of release', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const authorRelease = screen.getByText(/terri apter, 1994/i)
    //                 expect(authorRelease).toBeInTheDocument()
    //             })
    //         })

    //         test('shows correct amount of books in reading history', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const books = screen.getAllByTestId('IndividualBookCard')
    //                 expect(books).toHaveLength(19)
    //             })
    //         })

    //     })
    // })




    // describe('Feed Tab shows correct contents', () => {

    //     test('shows the correct number of posts', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         const feedTab = await screen.findByRole('tab', { name: /feed/i })
    //         fireEvent.click(feedTab)

    //         const posts = await screen.findAllByTestId('singleFeedPost')
    //         expect(posts).toHaveLength(2)
    //     })



    //     describe('shows correct first post', () => {

    //         test('correct author', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             const feedTab = await screen.findByRole('tab', { name: /feed/i })
    //             fireEvent.click(feedTab)

    //             const author = await screen.findByText(/@declan89/i)
    //             expect(author).toBeInTheDocument()
    //         })

    //         test('correct title', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             const feedTab = await screen.findByRole('tab', { name: /feed/i })
    //             fireEvent.click(feedTab)

    //             const title = await screen.findByText(/blanditiis velit neque nulla perspiciatis\./i)
    //             expect(title).toBeInTheDocument()
    //         })


    //         test('correct content', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             const feedTab = await screen.findByRole('tab', { name: /feed/i })
    //             fireEvent.click(feedTab)

    //             const title = await screen.findByRole('heading', { name: /ratione quis tenetur officia eligendi\. ipsum praesentium eveniet quia perspiciatis in\.\ntenetur est vel sed consequuntur alias\. veniam non dignissimos\. beatae aspernatur eos esse facere nam\.\nlaboriosam sapiente quam consectetur\. numquam odit nostrum unde provident\. repudiandae iste excepturi odit quod modi nostrum\./i })
    //             expect(title).toBeInTheDocument()
    //         })

    //         // wait for api endpoint to be fixed 

    //         //     test('correct number of likes', async () => {

    //         //         act(() => {
    //         //             renderClubProfile(role);
    //         //         })

    //         //         await waitFor(() => {
    //         //             const likes = screen.getByText(/likes: 6/i)
    //         //             expect(likes).toBeInTheDocument()
    //         //         })
    //         //     })
    //         // })

    //     })
    // })




    describe('Meetings tab shows correct contents', () => {

        // describe('contains correct components', () => {

        //     test('shows Meeting History Heading', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         const feedTab = await screen.findByRole('tab', { name: /meetings/i })
        //         fireEvent.click(feedTab)

        //         const heading = screen.getByText(/meeting history/i)
        //         expect(heading).toBeInTheDocument()
        //     })

        //     test('shows schedule meeting button', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         const feedTab = await screen.findByRole('tab', { name: /meetings/i })
        //         fireEvent.click(feedTab)

        //         const button = screen.getByRole('button', { name: /schedule a meeting/i })
        //         expect(button).toBeInTheDocument()
        //     })
        // })

        describe('displays correct contents of first meeting', () => {

            test('shows correct meeting title', async () => {
                act(() => {
                    renderClubProfile(role);
                })

                const feedTab = await screen.findByRole('tab', { name: /meetings/i })
                fireEvent.click(feedTab)

                const title = screen.getByText(/west guyview book club meeting #0/i)
                expect(title).toBeInTheDocument()
            })

            //     test('shows correct meeting book', async () => {
            //         act(() => {
            //             renderClubProfile(role);
            //         })

            //         const feedTab = await screen.findByRole('tab', { name: /meetings/i })
            //         fireEvent.click(feedTab)

            //         const title = screen.getByText(/the john fante reader/i)
            //         expect(title).toBeInTheDocument()
            //     })

            //     test('shows correct meeting description', async () => {
            //         act(() => {
            //             renderClubProfile(role);
            //         })

            //         const feedTab = await screen.findByRole('tab', { name: /meetings/i })
            //         fireEvent.click(feedTab)

            //         const description = screen.getByText(/laboriosam fugiat vel modi reprehenderit quisquam\. mollitia ipsa saepe adipisci iusto sapiente nulla aliquam\. laudantium eius nihil maxime\./i)
            //         expect(description).toBeInTheDocument()
            //     })
        })
    })
})