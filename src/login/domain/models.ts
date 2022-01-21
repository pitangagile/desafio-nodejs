type User = {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phones: {
        number: number;
        areaCode: number;
        countryCode: string;
    }[];
    createdAt: Date;
    lastLogin: Date;
};

class APIError extends Error {
    statusCode: any;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
  }
  

const validateUser = (user: User): User => {
    const { firstName, lastName, email, password, phones } = user;

    // check null fields
    if (!firstName || !lastName || !email || !password || !phones) {
        throw new APIError('Missing fields', 400);
    }
    // check 0 length fields  
    if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || password.length === 0) {
        throw new APIError('Invalid fields', 400);
    }

    // iterate over phones to validate each phone
    phones.forEach(phone => {
        // check null fields
        if (!phone.number || !phone.areaCode || !phone.countryCode) {
            throw new APIError('Missing fields', 400);
        }
        // check if number and area code are numbers
        if (isNaN(phone.number) || isNaN(phone.areaCode)) {
            throw new APIError('Invalid fields', 400);
        }
        // check if infos are not empty
        if (phone.number.toString().length === 0 || phone.areaCode.toString().length === 0 || phone.countryCode.length === 0) {
            throw new APIError('Invalid fields', 400);
        }
    });


    // email to lowercase
    user.email = email.toLowerCase();
    
    return user;
}


// export user, validateUser and APIError
export { User, validateUser, APIError };
