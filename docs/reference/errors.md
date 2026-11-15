---
{ "pageClass": "reference-page" }
---

# Errors

Vyte uses conventional HTTP status codes.

| Status | Meaning | What to do |
|---|---|---|
| `200 OK` | Success. | |
| `201 Created` | The resource was created. | |
| `204 No Content` | Success, no body. | |
| `400 Bad Request` | A required parameter is missing, a value is malformed or fails validation. | Fix the request; do not retry unchanged. |
| `401 Unauthorized` | Missing, unknown or deactivated API key. | Check the `Authorization` header. |
| `403 Forbidden` | The key is valid but its scope does not cover this endpoint or this resource, or a feature is not enabled for the organization or the user. | Use a key with the right scope, or target a resource of your organization. |
| `404 Not Found` | The resource does not exist (or the path is wrong). | |
| `409 Conflict` | The request conflicts with the current state, for example an appointment type handle already used on the booking page. | Choose another value. |
| `410 Gone` | The requested time is no longer available: returned when a booking is created, or checked, on a slot that has been taken in the meantime. See [Events](./events.md). | Fetch fresh [slots](./slots.md) and let the user choose another one. |
| `422 Unprocessable Entity` | A value is well formed but not acceptable, for example a booking page nickname that is invalid or already taken. See [Users](./users.md). | Choose another value. |
| `500 Internal Server Error` | Unexpected error. | Retry later with backoff; contact support if it persists. |
| `503 Service Unavailable` | The request timed out or the service is temporarily unavailable. | Retry later with backoff. |

### Error bodies

The error body is **not uniform** across endpoints. It is one of:

- empty, or the plain text reason phrase of the status (`Unauthorized`, `Forbidden`,
  `Not Found`, `Bad Request`);
- a JSON object with a human readable `message`, for example
  `{"message": "Invalid timezone parameter"}`;
- a validation report: a JSON object with a `message` and an `errors` object keyed by the name
  of each invalid field, each entry carrying its own `message`;
- a plain text sentence.

Rely on the **status code** to drive your logic. Treat error messages as diagnostics for humans:
their wording may change.

```json
{
  "message": "Validation failed",
  "errors": {
    "name": { "message": "Path `name` is required." }
  }
}
```

### Retrying

- `GET` requests are safe to retry.
- Do not blindly retry a `POST` that creates a resource after a timeout: check first whether the
  resource was created. For event creation, see the de-duplication mechanism described in
  [Events](./events.md).
- Retry `500` and `503` answers with exponential backoff. Never retry `400`, `401`, `403`, `404`
  without changing the request.
