import currentUser from '../mocksData/getCurrentUser.json'
import myTop10Recommendations from '../mocksData/getMyTop10Recommendations.json'
import tenGenres from '../mocksData/getTenGenres.json'
import top10GlobalRecommendations from '../mocksData/getTop10GlobalRecommendations.json'
import top10GlobalHistoryRecommendations from '../mocksData/getTop10GlobalHistoryRecommendations.json'
import myTop10HistoryRecommendations from '../mocksData/getMyTop10HistoryRecommendations.json'
import bookDetails from '../mocksData/getBookDetails.json'
import topClubs from '../mocksData/getTopClubs.json'
import myMeetings from '../mocksData/getMyMeetings.json'
import top12Global from '../mocksData/getTop12Global.json'
import clubs from '../mocksData/clubs.json'


const generateGetResponse = (url) => {
    switch (url) {
        case "genres?n=10":
            return {data: tenGenres};
        case "get_current_user":
            return {data: currentUser};
        case "recommender/0/10/1/top_n/":
            return {data: myTop10Recommendations}
        case "recommender/0/10/top_n_global/":
            return {data: top10GlobalRecommendations}
        case "recommender/0/10/top_n_global_for_genre/history/":
            return {data: top10GlobalHistoryRecommendations}
        case "recommender/0/10/1/top_n_for_genre/history/":
            return {data: myTop10HistoryRecommendations}
        case "books/0195153448":
            return {data: bookDetails}
        case "recommender/0/10/1/top_n_clubs_top_club_books/":
            return {data: topClubs}
        case "/user/get_update/1/":
            return {data: currentUser};
        case "meetings/1":
            return {data: myMeetings};
        case `/recommender/0/12/top_n_global/`:
            return {data: top12Global};
        case `clubs/`:
            return {data: clubs};
        default:
            console.log("no matching mock for url ", url)
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
            } else if(data.email === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "email": "This field may not be blank."
                        }
                    }
                })
            } else if(data.password === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "password": "This field may not be blank."
                        }
                    }
                })
            } else if(data.bio === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "bio": "This field may not be blank."
                        }
                    }
                })
            } else if(data.location === "") {
                return Promise.reject({
                    response: {
                        data: {
                            "location": "This field may not be blank."
                        }
                    }
                })
            } else if(data.birthday === "") {
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
            return {data: {}};
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