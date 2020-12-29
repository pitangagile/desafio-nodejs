import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userModel } from './models/userModel.js';
dotenv.config();

const { DB_USER, DB_PASS } = process.env;

const db = {};

db.url = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.bx2ja.mongodb.net/desafio-pitang?retryWrites=true&w=majority`;
db.mongoose = mongoose;
db.user = userModel(mongoose);

export { db };