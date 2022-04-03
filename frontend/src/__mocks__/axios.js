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
import ratings from '../mocksData/ratings.json'
import ratings2 from '../mocksData/ratings2.json'
import userChats from '../mocksData/getUserChats.json'
import singleClub1_Owner from '../mocksData/getSingleClub1_Owner.json'
import singleClub3_NotApplied from '../mocksData/getSingleClub3_NotApplied.json'
import singleClub4_Applied from '../mocksData/getSingleClub4_Applied.json'
import singleClub2_Member from '../mocksData/getSingleClub2_Member.json'
import singleClub15_Admin from '../mocksData/getSingleClub15_Admin.json'
import singleClub10_Banned from '../mocksData/getSingleClub10_Banned.json'


const generateGetResponse = (url) => {
    switch (url) {
        case `genres?n=10`:
            return { data: tenGenres };
        case `get_current_user`:
            return { data: currentUser };
        case `recommender/0/10/1/top_n/`:
            return { data: myTop10Recommendations }
        case `recommender/0/10/top_n_global/`:
            return { data: top10GlobalRecommendations }
        case `recommender/0/10/top_n_global_for_genre/history/`:
            return { data: top10GlobalHistoryRecommendations }
        case `recommender/0/10/1/top_n_for_genre/history/`:
            return { data: myTop10HistoryRecommendations }
        case `books/0195153448`:
            return { data: bookDetails1 }
        case `books/0380715899`:
            return { data: bookDetails2 }
        case `books/00000000001`:
            return { data: bookDetails3 }
        case `recommender/0/10/1/top_n_clubs_top_club_books/`:
            return { data: topClubs }
        case `/user/get_update/1/`:
            return { data: currentUser };
        case `user/get_update/1/`:
            return { data: currentUser };
        case `user/get_update/2/`:
            return { data: currentUser2 };
        case `user/get_update/3/`:
            return { data: currentUser3 };
        case `user/get_update/4/`:
            return { data: currentUser4 };
        case `user/get_update/5/`:
            return { data: currentUser5 };
        case `meetings/1`:
            return { data: myMeetings };
        case `/recommender/0/12/top_n_global/`:
            return { data: top12Global };
        case `clubs/`:
            return { data: clubs };
        case `ratings/`:
            return { data: ratings };
        case `ratings/other_user/2`:
            return { data: ratings2 };
        case `chat/?username=test`:
            return { data: userChats }
        case `singleclub/1`:
            return { data: singleClub1_Owner }
        case `singleclub/3`:
            return { data: singleClub3_NotApplied }
        case `singleclub/4`:
            return { data: singleClub4_Applied }
        case `singleclub/2`:
            return { data: singleClub2_Member }
        case `singleclub/15`:
            return { data: singleClub15_Admin }
        case `singleclub/10`:
            return { data: singleClub10_Banned }

        default:
            console.log("no matching mock for url", url)
            return { data: {} };
    }
}

const generatePostResponse = (url, data) => {
    switch (url) {
        case "clubs/":
            if (data.name !== "") {
                return Promise.resolve({ data: {} })
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
                return Promise.resolve({ data: {} })
            } else {
                return Promise.reject({ data: {} })
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
                return Promise.resolve({ data: {} })
            }
        default:
            console.log("no matching mock for url ", url)
            return Promise.resolve({ data: {} });
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
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn(function () {
        return {
            interceptors: {
                request: {
                    use: jest.fn(() => Promise.resolve({ data: {} })),
                },
                response: {
                    use: jest.fn(() => Promise.resolve({ data: {} })),
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
            put: jest.fn(() => Promise.resolve({ data: {} })),
            delete: jest.fn(() => Promise.resolve({ data: {} })),
        }
    }),
};