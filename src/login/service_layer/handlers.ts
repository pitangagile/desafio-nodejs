import { User, validateUser, APIError } from "../domain/models";
import { UnitOfWork } from "./unit_of_work";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();


// sign up handler
const signUpHandler = async (user: User, uow: UnitOfWork): Promise<Object> => {
    // validate user
    const validatedUser = validateUser(user);

    // check if user exists
    const userRepository = uow.userRepository;
    const userExists = await userRepository.findUser({ email: validatedUser.email });

    // if user exists
    if (userExists) {
        throw new APIError("E-mail already exists", 409);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(validatedUser.password, 10);

    // create user
    validatedUser.password = hashedPassword;
    const createdUser = await userRepository.create(validatedUser);

    // create token
    const token = jwt.sign(
        { _id: createdUser._id },
        process.env.TOKEN_KEY as string
    );

    // return user and token
    return { token: token };
};

// sign in handler
const signInHandler = async (email: string, password: string, uow: UnitOfWork): Promise<Object> => {
    // check if email and password were provided
    if (!email || !password) { throw new APIError("Missing fields", 400); }

    // check if user exists
    const userRepository = uow.userRepository;
    const user = await userRepository.findUser({ email: email.toLowerCase() });

    // if user doesnt exist
    if (!user) { throw new APIError("Invalid email or password", 401); }

    // if user exists
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // if password is not valid
    if (!isPasswordValid) { throw new APIError("Invalid email or password", 401); }

    // jwt token
    const token = jwt.sign({ _id: user._id, },
        process.env.TOKEN_KEY as string,
        { expiresIn: 30 }
    );

    // update user last login
    user.lastLogin = new Date();
    await userRepository.update(user);

    return { token: token };
};

// token.ts
export interface TokenInterface {
    _id: string;
    iat: number;
}

// me handler
const meHandler = async (token: string, uow: UnitOfWork): Promise<Object> => {

    // decode token
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY as string, function (err, decodedToken) {

        // if token expired
        if (err instanceof jwt.TokenExpiredError) { throw new APIError("Unauthorized - invalid session", 401); }

        // if token is invalid
        if (err) { throw new APIError("Unauthorized", 401); }

        // if token is valid
        return decodedToken;
        
    }) as unknown as TokenInterface;

    // get user
    const userRepository = uow.userRepository;
    const user = await userRepository.findUser({ _id: decodedToken._id });

    // if user doesnt exist
    if (!user) { throw new APIError("Invalid token", 401); }

    return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phones: user.phones,
        created_at: user.createdAt,
        last_login: user.lastLogin,

    }
};

export { signUpHandler, signInHandler, meHandler };
