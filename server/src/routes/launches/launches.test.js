const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadLaunchData } = require("../../models/launches.model");

describe("Launches API", () => {
  beforeAll(async () => {
    // jest.setTimeout(30000);
    await mongoConnect();
    await loadLaunchData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("should return 200", async () => {
      await request(app).get("/v1/launches").expect(200);
    });
  });

  describe("Test POST /launch", () => {
    const completeLaunchData = {
      mission: "GS Falcon X",
      rocket: "Falcon 9",
      target: "Moon",
      launchDate: "2020-01-01",
    };

    const launchDataWithoutDate = {
      mission: "GS Falcon X",
      rocket: "Falcon 9",
      target: "Moon",
    };
    test("It should respond with 201 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Missing Fields",
      });
    });

    const completeLaunchDataWithBadDate = {
      mission: "GS Falcon X",
      rocket: "Falcon 9",
      target: "Moon",
      launchDate: "Boot",
    };

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchDataWithBadDate)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Invalid Date",
      });
    });
  });
});
