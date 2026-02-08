Feature: Group Management
  As a developer
  I want to be able to manage users within groups
  So that I can maintain correct group memberships

  Background:
    Given the database is initialized

  Scenario: Remove user from group
    Given there is a group "Test Group" with a user "Test User"
    When I send a DELETE request to remove the user from the group
    Then the response status code should be 200
    And the response body should contain "message" as "User removed successfully"
    And the user "Test User" should not be in the group "Test Group"
    And the group "Test Group" status should be "empty"
