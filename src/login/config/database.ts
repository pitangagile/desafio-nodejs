import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { User } from "../domain/models";
import { config } from "dotenv";
config();

const {MONGO_URI}  = process.env;
const URI = MONGO_URI || "mongodb://localhost:27017/test";

const {MONGO_USER, MONGO_PASS} = process.env;

const schema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phones: {
    type: [
      {
        number: { type: Number, required: true },
        areaCode: { type: Number, required: true },
        countryCode: { type: String, required: true },
      },
    ],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

const UserModel = model<User>("User", schema);

const connect = () => {
  // Connecting to the database
  mongoose
    .connect(URI, {user: MONGO_USER, pass: MONGO_PASS})
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

export {connect, UserModel, schema};