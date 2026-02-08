Feature: Health Check
  As a developer
  I want to check the status of the API
  So that I know it is running correctly

  Scenario: Root endpoint returns success
    Given the API is running
    When I send a GET request to "/"
    Then the response status code should be 200
    And the response body should contain "status" as "Running"
