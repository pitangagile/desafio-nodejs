const assert = require('assert')
const { ObjectId } = require('mongodb')
const UserValidator = require('../../source/UserValidator')

let userValidator = new UserValidator()


let validNewUserData = {
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": "hunter2",
    "phones": [
        {
            "number": 988887888,
            "area_code": 81,
            "country_code": "+55"
        }
    ]
}
assert(userValidator.isValidUser(validNewUserData) == true)
assert(userValidator.isValidNewUser(validNewUserData) == true)
assert(userValidator.isValidExistingUser(validNewUserData) == false)


let zeroPhonesData = {
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": "hunter2",
    "phones": []
}
assert(userValidator.isValidUser(zeroPhonesData) == false)
assert(userValidator.isValidNewUser(zeroPhonesData) == false)
assert(userValidator.isValidExistingUser(zeroPhonesData) == false)


let validExistingUserData = {
    "_id": ObjectId("61ec51b1da38407dd85b49ab"),
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": "hunter2",
    "phones": [
        {
            "number": 988887888,
            "area_code": 81,
            "country_code": "+55"
        }
    ],
    "created_at": new Date("2022-01-22T18:49:19.316+00:00"),
    "last_login": new Date("2022-01-22T18:49:58.594+00:00"),
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbGxvQHdvcmxkLmNvbSIsImlhdCI6MTY0Mjg3NzM2MX0.ybo5q1h2bG5O6VPAlvVtr_NkHisUeEWgnQfjyW5a37I"
}
assert(userValidator.isValidUser(validExistingUserData) == true)
assert(userValidator.isValidNewUser(validExistingUserData) == false)
assert(userValidator.isValidExistingUser(validExistingUserData) == true)


let existingUserMissingRefreshToken = {
    "_id": ObjectId("61ec51b1da38407dd85b49ab"),
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": "hunter2",
    "phones": [
        {
            "number": 988887888,
            "area_code": 81,
            "country_code": "+55"
        }
    ],
    "created_at": new Date("2022-01-22T18:49:19.316+00:00"),
    "last_login": new Date("2022-01-22T18:49:58.594+00:00")
}
assert(userValidator.isValidUser(existingUserMissingRefreshToken) == false)
assert(userValidator.isValidNewUser(existingUserMissingRefreshToken) == false)
assert(userValidator.isValidExistingUser(existingUserMissingRefreshToken) == false)


let validExistingUserWithoutIdData = {
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": "hunter2",
    "phones": [
        {
            "number": 988887888,
            "area_code": 81,
            "country_code": "+55"
        }
    ],
    "created_at": new Date("2022-01-22T18:49:19.316+00:00"),
    "last_login": new Date("2022-01-22T18:49:58.594+00:00"),
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbGxvQHdvcmxkLmNvbSIsImlhdCI6MTY0Mjg3NzM2MX0.ybo5q1h2bG5O6VPAlvVtr_NkHisUeEWgnQfjyW5a37I"
}
assert(userValidator.isValidUser(validExistingUserWithoutIdData) == true)
assert(userValidator.isValidNewUser(validExistingUserWithoutIdData) == false)
assert(userValidator.isValidExistingUser(validExistingUserWithoutIdData) == true)