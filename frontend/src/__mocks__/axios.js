const generateResponse = (url) => {
    switch (url) {
        case "genres?n=10":
            return {data: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]};
        case "get_current_user":
            return {
                data: {
                    "id": 1,
                    "password": "pbkdf2_sha256$260000$nghK9JWg2c7lKU5YE8ggTX$YTSrsurQe57gmH6582vjRdgHlHYLd2iUKBqnbedXPbw=",
                    "last_login": null,
                    "is_superuser": false,
                    "is_staff": false,
                    "is_active": true,
                    "date_joined": "2022-03-24T13:36:10.145043Z",
                    "username": "test",
                    "email": "test@test.org",
                    "first_name": "asdf",
                    "last_name": "asdf",
                    "bio": "asdf",
                    "location": "asdf",
                    "birthday": "2022-03-02",
                    "created_at": "2022-03-24T13:36:10.250617Z",
                    "groups": [],
                    "user_permissions": [],
                    "liked_books": [],
                    "read_books": [],
                    "clubs": [],
                    "friends": []
                }
            };
        case "books/0195153448":
            return {
                data: {
                    "id": "0195153448",
                    "title": "Classical Mythology",
                    "author": "Mark P. O. Morford",
                    "publication_date": "2002",
                    "publisher": "Oxford University Press",
                    "image_links_large": "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
                    "image_links_medium": "http://images.amazon.com/images/P/0195153448.01.MZZZZZZZ.jpg",
                    "image_links_small": "http://images.amazon.com/images/P/0195153448.01.THUMBZZZ.jpg",
                    "genre": "Social Science"
                }
            }
        case "recommender/0/10/1/top_n_clubs_top_club_books":
            return {
                data: [
                    {
                        "owner": {"email": "user1@example.org"},
                        "name": "Club 1",
                        "id": 1
                    },
                    {
                        "owner": {"email": "user2@example.org"},
                        "name": "Club 2",
                        "id": 2
                    },
                    {
                        "owner": {"email": "user3@example.org"},
                        "name": "Club 3",
                        "id": 3
                    },
                    {
                        "owner": {"email": "user4@example.org"},
                        "name": "Club 4",
                        "id": 4
                    },
                    {
                        "owner": {"email": "user5@example.org"},
                        "name": "Club 5",
                        "id": 5
                    },
                ]
            }
        default:
            console.log("no matching mock for this url")
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
            get: jest.fn((url) => Promise.resolve(generateResponse(url))),
            post: jest.fn(() => Promise.resolve({data: {}})),
            put: jest.fn(() => Promise.resolve({data: {}})),
            delete: jest.fn(() => Promise.resolve({data: {}})),
        }
    }),
};
