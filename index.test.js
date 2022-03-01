const supertest = require("supertest");
const app = require("./src/index");
const request = supertest(app);

describe("Test", () => {
  // Initial route - Server running
  test("GET /", async () => {
    const response = await request.get("/");
    expect(response.statusCode).toEqual(200);
  });

  // Create user test
  test("POST /signup", async () => {
    const mocked_user = {
      firstName: "Usuario",
      lastName: "Ficticio",
      email: "user.ficticio@world.com",
      password: "teste123",
      phones: [
        {
          number: 988887888,
          area_code: 81,
          country_code: "+55",
        },
      ],
    };

    const response = await request.post("/signup").send(mocked_user);
    expect(response.statusCode).toEqual(201);
    return;
  });

  // Authenticate user test
  test("POST /signin", async () => {
    const mocked_user = {
      email: "user.ficticio@world.com",
      password: "teste123",
    };

    const response = await request.post("/signin").send(mocked_user);
    expect(response.statusCode).toEqual(200);
    return;
  });

  // Get user from Bearer token auth
  test("GET /me", async () => {
    const mocked_user = {
      email: "user.ficticio@world.com",
      password: "teste123",
    };

    const auth_response = await request.post("/signin").send(mocked_user);
    expect(auth_response.statusCode).toEqual(200);
    const response = await request
      .get("/me")
      .set("Authorization", `Bearer ${auth_response.body.token}`);
    expect(response.statusCode).toEqual(200);
    return;
  });
});
