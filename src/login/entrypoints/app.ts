import { config } from "dotenv";
config();

import {connect} from "../config/database";
import  express  from "express";
import { signUpHandler, signInHandler, meHandler } from "../service_layer/handlers";
import { UnitOfWork, FakeUnitOfWork, MongoUnitOfWork} from "../service_layer/unit_of_work";
import { APIError, User } from "../domain/models";

const app = express();

app.use(express.json());

const environment = process.env.NODE_ENV || 'development';

function get_uow(): UnitOfWork {
    switch (environment) {
        case "test":
            return new FakeUnitOfWork();

        case "development":
        case "production":
            connect();
            return new MongoUnitOfWork();
        
        default:
            throw new Error("Unknown environment");
    }
}

const uow = get_uow();

app.get("/", async (req, res) => {
    res.send("front page");
});

app.post("/signup", async (req, res) => {
    try {
        const user = req.body as User;
        const token = await signUpHandler(user, uow);
        res.status(201).json(token);

    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.statusCode).json({
                message: error.message,  errorCode: error.statusCode
            });

        } else {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    
});

app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await signInHandler(email, password, uow);
        res.status(200).json(token);

    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.statusCode).json({
                message: error.message,  errorCode: error.statusCode
            });

        } else {
            res.status(500).json({
                message: "Internal server error",
            });
        }

    }
});

app.post("/me", async (req, res) => {
    try {
        const { token } = req.headers as { token: string };
        if (!token) { throw new APIError("Unauthorized", 401); }
        const user = await meHandler(token, uow);
        res.status(200).json(user);


    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.statusCode).json({
                message: error.message, errorCode: error.statusCode
            });

        } else {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
});

export { app };