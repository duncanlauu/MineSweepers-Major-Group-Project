import currentUser from '../mocksData/getCurrentUser.json'
import currentUser2 from '../mocksData/getCurrentUser2.json'
import currentUser3 from '../mocksData/getCurrentUser3.json'
import currentUser4 from '../mocksData/getCurrentUser4.json'
import currentUser5 from '../mocksData/getCurrentUser5.json'
import myTop10Recommendations from '../mocksData/getMyTop10Recommendations.json'
import tenGenres from '../mocksData/getTenGenres.json'
import top10GlobalRecommendations from '../mocksData/getTop10GlobalRecommendations.json'
import top10GlobalHistoryRecommendations from '../mocksData/getTop10GlobalHistoryRecommendations.json'
import myTop10HistoryRecommendations from '../mocksData/getMyTop10HistoryRecommendations.json'
import bookDetails1 from '../mocksData/getBookDetails1.json'
import bookDetails2 from '../mocksData/getBookDetails2.json'
import bookDetails3 from '../mocksData/getBookDetails3.json'
import topClubs from '../mocksData/getTopClubs.json'
import myMeetings from '../mocksData/getMyMeetings.json'
import top12Global from '../mocksData/getTop12Global.json'
import clubs from '../mocksData/clubs.json'
import friend_requests from '../mocksData/friend_requests.json'
import friends from '../mocksData/friends.json'
import friends2 from '../mocksData/friends2.json'
import ratings from '../mocksData/ratings.json'
import ratings2 from '../mocksData/ratings2.json'
import replies from '../mocksData/replies.json'
import replies2 from '../mocksData/replies2.json'
import replies3 from '../mocksData/replies3.json'
import replies4 from '../mocksData/replies4.json'
import replies5 from '../mocksData/replies5.json'
import post from '../mocksData/post.json'
import post2 from '../mocksData/post2.json'
import post3 from '../mocksData/post3.json'
import post4 from '../mocksData/post4.json'
import post5 from '../mocksData/post5.json'
import posts from '../mocksData/posts.json'
import comments from '../mocksData/comments.json'
import recommended_users from '../mocksData/getTopUserRecommendations.json'
import userChats from '../mocksData/getUserChats.json'


const generateGetResponse = (url) => {
    switch (url) {
        case `genres?n=10`:
            return {data: tenGenres};
        case `get_current_user`:
            return {data: currentUser};
        case `recommender/0/10/1/top_n/`:
            return {data: myTop10Recommendations}
        case `recommender/0/10/top_n_global/`:
            return {data: top10GlobalRecommendations}
        case `recommender/0/10/top_n_global_for_genre/history/`:
            return {data: top10GlobalHistoryRecommendations}
        case `recommender/0/10/1/top_n_for_genre/history/`:
            return {data: myTop10HistoryRecommendations}
        case `books/0195153448`:
            return {data: bookDetails1}
        case `books/0380715899`:
            return {data: bookDetails2}
        case `books/00000000001`:
            return {data: bookDetails3}
        case `recommender/0/10/1/top_n_clubs_top_club_books/`:
            return {data: topClubs}
        case `/user/get_update/1/`:
            return {data: currentUser};
        case `user/get_update/1/`:
            return {data: currentUser};
        case `user/get_update/2/`:
            return {data: currentUser2};
        case `user/get_update/3/`:
            return {data: currentUser3};
        case `user/get_update/4/`:
            return {data: currentUser4};
        case `user/get_update/5/`:
            return {data: currentUser5};
        case `meetings/1`:
            return {data: myMeetings};
        case `/recommender/0/12/top_n_global/`:
            return {data: top12Global};
        case `clubs/`:
            return {data: clubs};
        case `friend_requests/`:
            return {data: friend_requests};
        case `friends/`:
            return {data: friends};
        case `friends/user/2`:
            return {data: friends2};
        case `ratings/`:
            return {data: ratings};
        case `ratings/other_user/2`:
            return {data: ratings2};
        case `posts/1/comments/1/replies/`:
            return {data: replies};
        case `posts/1/comments/2/replies/`:
            return {data: replies2};
        case `posts/1/comments/3/replies/`:
            return {data: replies3};
        case `posts/1/comments/4/replies/`:
            return {data: replies4};
        case `posts/1/comments/5/replies/`:
            return {data: replies5};
        case `posts/2/comments/1/replies/`:
            return {data: replies};
        case `posts/2/comments/2/replies/`:
            return {data: replies2};
        case `posts/2/comments/3/replies/`:
            return {data: replies3};
        case `posts/2/comments/4/replies/`:
            return {data: replies4};
        case `posts/2/comments/5/replies/`:
            return {data: replies5};
        case `posts/3/comments/1/replies/`:
            return {data: replies};
        case `posts/3/comments/2/replies/`:
            return {data: replies2};
        case `posts/3/comments/3/replies/`:
            return {data: replies3};
        case `posts/3/comments/4/replies/`:
            return {data: replies4};
        case `posts/3/comments/5/replies/`:
            return {data: replies5};
        case `posts/4/comments/1/replies/`:
            return {data: replies};
        case `posts/4/comments/2/replies/`:
            return {data: replies2};
        case `posts/4/comments/3/replies/`:
            return {data: replies3};
        case `posts/4/comments/4/replies/`:
            return {data: replies4};
        case `posts/4/comments/5/replies/`:
            return {data: replies5};
        case `posts/5/comments/1/replies/`:
            return {data: replies};
        case `posts/5/comments/2/replies/`:
            return {data: replies2};
        case `posts/5/comments/3/replies/`:
            return {data: replies3};
        case `posts/5/comments/4/replies/`:
            return {data: replies4};
        case `posts/5/comments/5/replies/`:
            return {data: replies5};
        case `posts/1/comments/`:
            return {data: comments};
        case `posts/2/comments/`:
            return {data: comments};
        case `posts/3/comments/`:
            return {data: comments};
        case `posts/4/comments/`:
            return {data: comments};
        case `posts/5/comments/`:
            return {data: comments};
        case `posts/1`:
            return {data: post};
        case `posts/2`:
            return {data: post2};
        case `posts/3`:
            return {data: post3};
        case `posts/4`:
            return {data: post4};
        case `posts/5`:
            return {data: post5};
        case `feed/`:
            return {data: posts};
        case `posts/`:
            return {data: posts};
        case `posts/user/2`:
            return {data: posts};
        case `recommender/0/20/1/top_n_users_random_books/`:
            return {data: recommended_users};
        case `chat/?username=test`:
            return {data: userChats}
        default:
            console.log("no matching mock for url", url)
            return {data: {}};
    }
}

const generatePostResponse = (url, data) => {
    switch (url) {
        case "clubs/":
            if (data.name !== "") {
                return Promise.resolve({data: {}})
            } else {
                return Promise.reject({
                    response: {
                        data: {
                            "name": "This field may not be blank."
                        }
                    }
                })
            }
        case "token/":
            if (data.password === "Password123") {
                return Promise.resolve({data: {}})
            } else {
                return Promise.reject({data: {}})
            }
        case `user/sign_up/`:
            if (data.first_name === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "first_name": "This field may not be blank."
                        }
                    }
                })
            } else if (data.last_name === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "last_name": "This field may not be blank."
                        }
                    }
                })
            } else if (data.username === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "username": "This field may not be blank."
                        }
                    }
                })
            } else if (data.email === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "email": "This field may not be blank."
                        }
                    }
                })
            } else if (data.password === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "password": "This field may not be blank."
                        }
                    }
                })
            } else if (data.bio === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "bio": "This field may not be blank."
                        }
                    }
                })
            } else if (data.location === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "location": "This field may not be blank."
                        }
                    }
                })
            } else if (data.birthday === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "birthday": "This field may not be blank."
                        }
                    }
                })
            } else {
                return Promise.resolve({data: {}})
            }
        default:
            console.log("no matching mock for url ", url)
            return Promise.resolve({data: {}});
    }
}

export default {
    defaults: {
        headers: {
            common: {
                "Content-Type": "",
                "Authorization": ""
            }
        }
    },
    get: jest.fn(() => Promise.resolve({data: {}})),
    post: jest.fn(() => Promise.resolve({data: {}})),
    put: jest.fn(() => Promise.resolve({data: {}})),
    delete: jest.fn(() => Promise.resolve({data: {}})),
    create: jest.fn(function () {
        return {
            interceptors: {
                request: {
                    use: jest.fn(() => Promise.resolve({data: {}})),
                },
                response: {
                    use: jest.fn(() => Promise.resolve({data: {}})),
                }
            },
            defaults: {
                headers: {
                    common: {
                        "Content-Type": "",
                        "Authorization": ""
                    }
                }
            },
            get: jest.fn((url) => Promise.resolve(generateGetResponse(url))),
            post: jest.fn((url, data) => generatePostResponse(url, data)),
            put: jest.fn(() => Promise.resolve({data: {}})),
            delete: jest.fn(() => Promise.resolve({data: {}})),
        }
    }),
};