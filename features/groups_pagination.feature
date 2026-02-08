Feature: Groups Pagination
  As a developer
  I want to be able to fetch groups with pagination
  So that I can manage large sets of group data efficiently

  Background:
    Given the database is initialized

  Scenario: Get first page of groups
    Given there are 3 groups in the database
    When I send a GET request to "/groups?limit=2&offset=0"
    Then the response status code should be 200
    And the response body should contain 2 groups
    And the response meta should show total as 3
    And the response meta should show limit as 2
    And the response meta should show offset as 0
    And the response meta should show page as 1
