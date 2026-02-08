import { BeforeAll, AfterAll, Before, Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import { expect } from "chai";
import { app } from "../../index";
import { AppDataSource } from "../../src/config/database";
import { User } from "../../src/entity/User";
import { Group } from "../../src/entity/Group";
import * as baseSteps from "./steps";

let testUser: User;
let testGroup: Group;

BeforeAll(async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
});

AfterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});

Before(async () => {
    if (AppDataSource.isInitialized) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
        await queryRunner.query('TRUNCATE TABLE user_groups');
        await queryRunner.query('TRUNCATE TABLE users');
        await queryRunner.query('TRUNCATE TABLE `groups`');
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
        await queryRunner.release();
    }
});

Given("the database is initialized", async function () {
    expect(AppDataSource.isInitialized).to.be.true;
});

Given("there are {int} users in the database", async function (count: number) {
    const userRepository = AppDataSource.getRepository(User);
    for (let i = 1; i <= count; i++) {
        await userRepository.save({
            name: `User ${i}`,
            email: `user${i}@example.com`
        });
    }
});

Given("there are {int} groups in the database", async function (count: number) {
    const groupRepository = AppDataSource.getRepository(Group);
    for (let i = 1; i <= count; i++) {
        await groupRepository.save({
            name: `Group ${i}`
        });
    }
});

Given("there is a group {string} with a user {string}", async function (groupName: string, userName: string) {
    const userRepository = AppDataSource.getRepository(User);
    const groupRepository = AppDataSource.getRepository(Group);

    testUser = await userRepository.save({
        name: userName,
        email: `${userName.replace(/\s/g, '').toLowerCase()}@example.com`
    });

    testGroup = await groupRepository.save({
        name: groupName,
        users: [testUser]
    });
});

When("I send a DELETE request to remove the user from the group", async function () {
    (baseSteps as any).response = await request(app).delete(`/groups/${testGroup.id}/users/${testUser.id}`);
});

When("I send a PUT request to {string} with body:", async function (path: string, body: string) {
    (baseSteps as any).response = await request(app)
        .put(path)
        .send(JSON.parse(body));
});

Then("the response body should contain {int} users", function (count: number) {
    const response = (baseSteps as any).response;
    expect(response.body.data).to.be.an('array');
    expect(response.body.data.length).to.equal(count);
});

Then("the response body should contain {int} groups", function (count: number) {
    const response = (baseSteps as any).response;
    expect(response.body.data).to.be.an('array');
    expect(response.body.data.length).to.equal(count);
});

Then("the response meta should show total as {int}", function (total: number) {
    const response = (baseSteps as any).response;
    expect(response.body.meta.total).to.equal(total);
});

Then("the response meta should show limit as {int}", function (limit: number) {
    const response = (baseSteps as any).response;
    expect(response.body.meta.limit).to.equal(limit);
});

Then("the response meta should show offset as {int}", function (offset: number) {
    const response = (baseSteps as any).response;
    expect(response.body.meta.offset).to.equal(offset);
});

Then("the response meta should show page as {int}", function (page: number) {
    const response = (baseSteps as any).response;
    expect(response.body.meta.page).to.equal(page);
});

Then("the user {string} should not be in the group {string}", async function (userName: string, groupName: string) {
    const groupRepository = AppDataSource.getRepository(Group);
    const group = await groupRepository.findOne({
        where: { id: testGroup.id },
        relations: ["users"]
    });
    expect(group).to.not.be.null;
    const userInGroup = group!.users.find(u => u.name === userName);
    expect(userInGroup).to.be.undefined;
});

Then("the group {string} status should be {string}", async function (groupName: string, status: string) {
    const groupRepository = AppDataSource.getRepository(Group);
    const group = await groupRepository.findOne({
        where: { id: testGroup.id }
    });
    expect(group).to.not.be.null;
    expect(group!.status).to.equal(status);
});
