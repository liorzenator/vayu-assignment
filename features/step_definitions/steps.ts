import { Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import { expect } from "chai";
import { app } from "../../index";

let response: any;

Given("the API is running", async function () {
    // In this case, we don't need to do anything as we're testing the app object directly
});

When("I send a GET request to {string}", async function (path: string) {
    response = await request(app).get(path);
});

Then("the response status code should be {int}", function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
});

Then("the response body should contain {string} as {string}", function (key: string, value: string) {
    expect(response.body).to.have.property(key, value);
});
