const assert = require('assert')
const SignInValidator = require('../../source/signingValidator/SignInValidator')

let signInValidator = new SignInValidator()


let validData = {
    "email": "hello@world.com",
    "password": "hunter2"
}
assert(signInValidator.hasInvalidField(validData) == false)
assert(signInValidator.hasMissingField(validData) == false)


let missingPasswordData = {
    "email": "hello@world.com"
}
assert(signInValidator.hasInvalidField(missingPasswordData) == false)
assert(signInValidator.hasMissingField(missingPasswordData) == true)


let missingEmailData = {
    "password": "hunter2"
}
assert(signInValidator.hasInvalidField(missingEmailData) == false)
assert(signInValidator.hasMissingField(missingEmailData) == true)


let passwordIsNumberData = {
    "email": "hello@world.com",
    "password": 123456789
}
assert(signInValidator.hasInvalidField(passwordIsNumberData) == true)
assert(signInValidator.hasMissingField(passwordIsNumberData) == false)


let signUpData = {
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
assert(signInValidator.hasInvalidField(signUpData) == true)
assert(signInValidator.hasMissingField(signUpData) == false)


let randomRPGData = {
    "name": "Kyle",
    "class": "warrior",
    "HP": 215,
    "MP": 55
}
assert(signInValidator.hasInvalidField(randomRPGData) == true)
assert(signInValidator.hasMissingField(randomRPGData) == true)