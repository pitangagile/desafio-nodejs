import { config } from "dotenv";
config();

import request from 'supertest';
import { app } from "../../entrypoints/app";
import { connect, UserModel } from "../../config/database";


beforeAll(async () => {
  connect();
  // wait for connection to be established
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterEach(async () => {
  await UserModel.deleteMany();
});


test("POST /signup missing last name", async () => {
  const data = {
    firstName: "Test",
    email: "Tes312t@domain.com",
    password: "p4ssw0rd",
    phones: [
      { number: "1234567890", areaCode: "123", countryCode: "US" },
      { number: "1234245890", areaCode: "125", countryCode: "CN" }
    ],

  }

  await request(app).post("/signup")
    .send(data)
    .expect(400)
    .then(async (response) => {
      // Check the response
      console.log(response.body);

    });
});


test("POST /signup 3 phones", async () => {
  const data = {
    firstName: "dasdsa",
    lastName: "Test",
    email: "Test@domain3.com",
    password: "p4ssw0rd",
    phones: [
      { number: "1234567890", areaCode: "123", countryCode: "US" },
      { number: "1234245890", areaCode: "125", countryCode: "CN" },
      { number: "12342458290", areaCode: "1225", countryCode: "CN" }
    ],

  }

  await request(app).post("/signup")
    .send(data)
    .expect(201)
    .then(async (response) => {
      // Check the response
      console.log(response.body);

    });
});

test("POST /signup then /me then /signin", async () => {
  jest.setTimeout(10000);
  const data = {
    firstName: "dasdsa",
    lastName: "Test",
    email: "Test@domain2.com",
    password: "p4ssw0rd",
    phones: [
      { number: "1234567890", areaCode: "123", countryCode: "US" },
      { number: "1234245890", areaCode: "125", countryCode: "CN" }
    ],

  }
  var token = ""
  await request(app).post("/signup")
    .send(data)
    .expect(201)
    .then(async (response) => {
      console.log(response.body);
      token = response.body.token

    });
  console.log(token);

  await request(app).post("/me")
    .set({ token: token })
    .expect(200)
    .then(async (response) => {
      // Check the response
      console.log(response.body);

    });

  await request(app).post("/signin")
    .send({ email: data.email, password: data.password })
    .expect(200)
    .then(async (response) => {
      // Check the response
      console.log(response.body);

    });


});

