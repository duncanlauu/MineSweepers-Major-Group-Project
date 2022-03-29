const generateResponse = (url) => {
    switch (url) {
        case "genres?n=10":
            return {data: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]};
        case "/get_current_user/":
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
        case "recommender/0/10/1/top_n_clubs_top_club_books/":
            return {
                data: [
                    {
                        "club": {
                            "id": 1,
                            "name": "Club 1",
                            "owner": {"email": "user1@example.org"}
                        }
                    },
                    {
                        "club": {
                            "id": 2,
                            "name": "Club 2",
                            "owner": {"email": "user2@example.org"}
                        }
                    },
                    {
                        "club": {
                            "id": 3,
                            "name": "Club 3",
                            "owner": {"email": "user3@example.org"}
                        }
                    },
                    {
                        "club": {
                            "id": 4,
                            "name": "Club 4",
                            "owner": {"email": "user4@example.org"}
                        }
                    },
                    {
                        "club": {
                            "id": 5,
                            "name": "Club 5",
                            "owner": {"email": "user5@example.org"}
                        }
                    }
                ]
            }
        case "/user/get_update/1/":
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
        case "meetings/1":
            return {
                data: [
                    {
                        "id": 1,
                        "name": "Meeting 1",
                        "book": {
                            "ISBN": "ISBN 1",
                            "image_links_small": "Link 1"
                        }
                    },
                    {
                        "id": 2,
                        "name": "Meeting 2",
                        "book": {
                            "ISBN": "ISBN 2",
                            "image_links_small": "Link 2"
                        }
                    },
                    {
                        "id": 3,
                        "name": "Meeting 3",
                        "book": {
                            "ISBN": "ISBN 3",
                            "image_links_small": "Link 3"
                        }
                    },
                    {
                        "id": 4,
                        "name": "Meeting 4",
                        "book": {
                            "ISBN": "ISBN 4",
                            "image_links_small": "Link 4"
                        }
                    },
                    {
                        "id": 5,
                        "name": "Meeting 5",
                        "book": {
                            "ISBN": "ISBN 5",
                            "image_links_small": "Link 5"
                        }
                    }
                ]
            };
        case `/recommender/0/12/top_n_global/`:
            return {
                data: [
                    {
                        "book": {
                            "ISBN": "1",
                            "author": "Author 1",
                            "title": "Title 1",
                            "image_links_large": "Image 1"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "2",
                            "author": "Author 2",
                            "title": "Title 2",
                            "image_links_large": "Image 2"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "3",
                            "author": "Author 3",
                            "title": "Title 3",
                            "image_links_large": "Image 3"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "4",
                            "author": "Author 4",
                            "title": "Title 4",
                            "image_links_large": "Image 4"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "5",
                            "author": "Author 5",
                            "title": "Title 5",
                            "image_links_large": "Image 5"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "6",
                            "author": "Author 6",
                            "title": "Title 6",
                            "image_links_large": "Image 6"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "7",
                            "author": "Author 7",
                            "title": "Title 7",
                            "image_links_large": "Image 7"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "8",
                            "author": "Author 8",
                            "title": "Title 8",
                            "image_links_large": "Image 8"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "9",
                            "author": "Author 9",
                            "title": "Title 9",
                            "image_links_large": "Image 9"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "10",
                            "author": "Author 10",
                            "title": "Title 10",
                            "image_links_large": "Image 10"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "11",
                            "author": "Author 11",
                            "title": "Title 11",
                            "image_links_large": "Image 11"
                        }
                    },
                    {
                        "book": {
                            "ISBN": "12",
                            "author": "Author 12",
                            "title": "Title 12",
                            "image_links_large": "Image 12"
                        }
                    }
                ]
            }
        default:
            console.log("no matching mock for this url " + url)
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
