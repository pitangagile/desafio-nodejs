import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userModel } from './models/userModel.js';
dotenv.config();

const { DB_URI } = process.env;

const db = {};

db.url = DB_URI;
db.mongoose = mongoose;
db.user = userModel(mongoose);

export { db };