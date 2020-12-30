import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userModel } from './models/userModel.js';
dotenv.config();

const { DB_URI } = process.env;

export default {
  url: DB_URI,
  mongoose: mongoose,
  user: userModel(mongoose)
};