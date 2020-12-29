import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

const User = db.user;

const generateToken = (id) => {
  const token = jwt.sign({ id: id }, JWT_SECRET, { expiresIn: 10*60 });
  // const token = jwt.sign({ id: id }, JWT_SECRET, { expiresIn: '24h' });
  return token;
}

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
const validateName = (name) => {
  let nameReg = /^[a-zA-Z]{2,35}$/;
  return nameReg.test(name);
};

const validate = (userObj) => {
  let returnObj = { isValid: true, message: '', errorCode: 400 };

  if (Object.keys(userObj).length < 5)
    return { isValid: false, message: 'Missing fields', errorCode: 400 };

  const { firstName, lastName, email, password, phones } = userObj;

  if (!validateName(firstName) || !validateName(lastName))
    return { isValid: false, message: 'Invalid fields', errorCode: 422 };
  if (!validateEmail(email))
    return { isValid: false, message: 'Invalid fields', errorCode: 422 };
  if (password.trim().length < 4)
    return { isValid: false, message: 'Invalid fields', errorCode: 422 };

  for (let i = 0; i < phones.length; i++) {
    if (typeof phones[i].number !== 'number' || phones[i].number.toString().length > 9 || phones[i].number.toString().length < 8)
      return { isValid: false, message: 'Invalid fields', errorCode: 422 };
    if (typeof phones[i].area_code !== 'number' || phones[i].area_code.toString().length !== 2)
      return { isValid: false, message: 'Invalid fields', errorCode: 422 };
    if (typeof phones[i].country_code !== 'string')
      return { isValid: false, message: 'Invalid fields', errorCode: 422 };
  }

  return returnObj;
}

const signup = async (req, res) => {
  console.log('req.body', req.body);
  const { email } = req.body;
  const validation = validate(req.body);
  if (!validation.isValid)
    return res.status(validation.errorCode).send({ message: validation.message, errorCode: validation.errorCode });
  try {
    if (await User.findOne({ email }))
      return res.status(409).send({ message: 'E-mail already exists', errorCode: 409 });

    const user = await User.create(req.body);
    user.password = undefined;
    res.status(201).send({ user, token: generateToken(user.id) });
  } catch (error) {
    return res.status(400).send({ message: error, errorCode: 400 });
  }
}

const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ message: 'Missing fields', errorCode: 400 });
  if (!validateEmail(email) || password.trim().length < 4)
    return res.status(422).send({ message: 'Invalid fields', errorCode: 422 });
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await bcrypt.compare(password, user.password)) 
      return res.status(404).send({ message: 'Invalid e-mail or password', errorCode: 404 });

    const timestamp = new Date().getTime();
    const dateBr = new Date(timestamp - BR_OFFSET);
    const userUpdated = await User.findByIdAndUpdate(user.id, { last_login: dateBr }, { new:true });
    user.password = undefined;
    res.status(200).send({ userUpdated, token: generateToken(user.id) });
  } catch (error) {
    return res.status(400).send({ message: error, errorCode: 400 });
  }
}

const getUser = async (req, res) => {
  const { id } = req;
  try {
    const user = await User.findById(id);
    res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ message: error, errorCode: 400 });
  }
}


export { signup, signin, getUser };