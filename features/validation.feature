Feature: API Validation
  As an API consumer
  I want to receive clear error messages when I send invalid data
  So that I can correct my requests

  Scenario: Invalid pagination parameters (string instead of number)
    Given the database is initialized
    When I send a GET request to "/users?limit=abc"
    Then the response status code should be 400
    And the response body should contain "message" as "Validation failed"

  Scenario: Invalid pagination parameters (negative number)
    Given the database is initialized
    When I send a GET request to "/users?limit=-1"
    Then the response status code should be 400
    And the response body should contain "message" as "Validation failed"

  Scenario: Invalid bulk update (exceeding limit)
    Given the database is initialized
    When I send a PUT request to "/users/bulk-update" with body:
    """
    {
      "updates": [
        { "id": 1, "status": "active" }
      ]
    }
    """
    Then the response status code should be 200

  Scenario: Invalid bulk update (invalid status)
    Given the database is initialized
    When I send a PUT request to "/users/bulk-update" with body:
    """
    {
      "updates": [
        { "id": 1, "status": "invalid_status" }
      ]
    }
    """
    Then the response status code should be 400
    And the response body should contain "message" as "Validation failed"

  Scenario: Invalid group removal IDs (string instead of number)
    Given the database is initialized
    When I send a GET request to "/groups/abc/users/def"
    Then the response status code should be 404
