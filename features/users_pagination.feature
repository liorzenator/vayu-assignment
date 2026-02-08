Feature: Users Pagination
  As a developer
  I want to be able to fetch users with pagination
  So that I can manage large sets of user data efficiently

  Background:
    Given the database is initialized

  Scenario: Get first page of users
    Given there are 5 users in the database
    When I send a GET request to "/users?limit=2&offset=0"
    Then the response status code should be 200
    And the response body should contain 2 users
    And the response meta should show total as 5
    And the response meta should show limit as 2
    And the response meta should show offset as 0
    And the response meta should show page as 1

  Scenario: Get second page of users
    Given there are 5 users in the database
    When I send a GET request to "/users?limit=2&offset=2"
    Then the response status code should be 200
    And the response body should contain 2 users
    And the response meta should show offset as 2
    And the response meta should show page as 2
