const assert = require('assert')
const SignUpValidator = require('../../source/signingValidator/SignUpValidator')

let signUpValidator = new SignUpValidator()


let validData = {
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
assert(signUpValidator.hasInvalidField(validData) == false)
assert(signUpValidator.hasMissingField(validData) == false)


let missingLastNameData = {
    "firstName": "Hello",
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
assert(signUpValidator.hasInvalidField(missingLastNameData) == false)
assert(signUpValidator.hasMissingField(missingLastNameData) == true)


let zeroPhonesData = {
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": "hunter2",
    "phones": []
}
assert(signUpValidator.hasInvalidField(zeroPhonesData) == false)
assert(signUpValidator.hasMissingField(zeroPhonesData) == true)


let noPhonesData = {
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": "hunter2"
}
assert(signUpValidator.hasInvalidField(noPhonesData) == false)
assert(signUpValidator.hasMissingField(noPhonesData) == true)


let hasGenderData = {
    "firstName": "Hello",
    "lastName": "World",
    "gender": "male",
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
assert(signUpValidator.hasInvalidField(hasGenderData) == true)
assert(signUpValidator.hasMissingField(hasGenderData) == false)


let hasGenderAndNoPasswordData = {
    "firstName": "Hello",
    "lastName": "World",
    "gender": "male",
    "email": "hello@world.com",
    "phones": [
        {
            "number": 988887888,
            "area_code": 81,
            "country_code": "+55"
        }
    ]
}
assert(signUpValidator.hasInvalidField(hasGenderAndNoPasswordData) == true)
assert(signUpValidator.hasMissingField(hasGenderAndNoPasswordData) == true)


let emptyData = {

}
assert(signUpValidator.hasInvalidField(emptyData) == false)
assert(signUpValidator.hasMissingField(emptyData) == true)


let numberIsStringData = {
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": "hunter2",
    "phones": [
        {
            "number": "988887888",
            "area_code": "81",
            "country_code": "+55"
        }
    ]
}
assert(signUpValidator.hasInvalidField(numberIsStringData) == true)
assert(signUpValidator.hasMissingField(numberIsStringData) == false)


let passwordIsNumberData = {
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": 123456789,
    "phones": [
        {
            "number": 988887888,
            "area_code": 81,
            "country_code": "+55"
        }
    ]
}
assert(signUpValidator.hasInvalidField(passwordIsNumberData) == true)
assert(signUpValidator.hasMissingField(passwordIsNumberData) == false)


let phoneIsNumberData = {
    "firstName": "Hello",
    "lastName": "World",
    "email": "hello@world.com",
    "password": "hunter2",
    "phones": 81988887888
}
assert(signUpValidator.hasInvalidField(phoneIsNumberData) == true)
assert(signUpValidator.hasMissingField(phoneIsNumberData) == true)


let randomRPGData = {
    "name": "Kyle",
    "class": "warrior",
    "HP": 215,
    "MP": 55
}
assert(signUpValidator.hasInvalidField(randomRPGData) == true)
assert(signUpValidator.hasMissingField(randomRPGData) == true)