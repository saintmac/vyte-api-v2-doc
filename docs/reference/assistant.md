---
{ "pageClass": "reference-page" }
---

# Assistant

:::::panel

:::: left
An assistant access lets a trusted third person (for example an executive assistant) manage the Vyte account of a [user](/reference/users/) without knowing the user's own credentials. The user (or a partner on the user's behalf) defines a dedicated assistant password; the assistant then signs in to the Vyte web application with the user's primary email address and that password, and acts on the user's account. Each user has at most one assistant access. Creating or changing it requires the `assistant` module to be enabled on the user (see `PUT /v2/users/:user_id/modules` in [Users](/reference/users/)). Authentication, key scopes and error format are described in [Conventions](/reference/).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users/:user_id/assistant" href="#check-whether-a-user-has-an-assistant-access"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id/assistant" href="#create-or-update-the-assistant-access-of-a-user"></endpoint>
</endpoints>
::::

:::::

## The Assistant object

The assistant access is never returned by the API: there is no JSON representation. The API only lets you check whether it exists and set its password.

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `psw` | string | yes (write-only) | The assistant password. Never returned. |

The email address used by the assistant to sign in is the first email address of the user (`emails[0]` of the [User object](/reference/users/)) at the time of the last `PUT`. It cannot be chosen.

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| `GET` | `/v2/users/:user_id/assistant` | Check whether the user has an assistant access | organization, user |
| `PUT` | `/v2/users/:user_id/assistant` | Create the assistant access or change its password | organization, user |

### Check whether a user has an assistant access

`GET /v2/users/:user_id/assistant`

Tells whether an assistant access has been set up for the user. The answer is carried by the status code only. This endpoint does not require the `assistant` module.

**Key scope:** organization, user (only for the key's own user). Use one of these two scopes; `team` keys are not supported on this endpoint.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string | Id of the user. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` when an assistant access exists. The body is the plain text `OK`, not JSON.

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not a member of the key's organization, or a `user` key is used for another user. |
| `404` | The user has no assistant access. Also returned when the user or the key's organization does not exist. |
| `500` | Unexpected server error. |

**Example**

```bash
curl -i 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/assistant' \
  -H 'Authorization: YOUR_API_KEY'
```

```
HTTP/1.1 200 OK

OK
```

### Create or update the assistant access of a user

`PUT /v2/users/:user_id/assistant`

Sets the assistant password. If the user has no assistant access yet, it is created (`201`); otherwise its password is replaced (`200`). In both cases the sign-in email of the assistant is set to the user's current first email address, and any assistant session opened with the previous password stops working: the assistant has to sign in again with the new password. No email is sent to the user or to the assistant: transmit the password to the assistant yourself, over a secure channel.

The user must have the `assistant` module enabled, otherwise the request is refused with `403`. Enable it first with `PUT /v2/users/:user_id/modules` (see [Users](/reference/users/)).

**Key scope:** organization, user (only for the key's own user). Use one of these two scopes; `team` keys are not supported on this endpoint.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string | Id of the user. |

**Query parameters**

None.

**Request body**

JSON.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `psw` | string | yes | - | The new assistant password. Must be a non-empty string. No complexity rule is enforced by the API: choose a long, random password, different from the user's own password. |

**Response**

- `201 Created` when the assistant access was created. Body: plain text `Created`.
- `200 OK` when an existing assistant access was updated. Body: plain text `OK`.

**Errors**

| Status | When |
| --- | --- |
| `400` | `psw` is missing or empty. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user does not have the `assistant` module, the user is not a member of the key's organization, or a `user` key is used for another user. |
| `404` | The user or the key's organization does not exist. |
| `500` | Unexpected server error. |

**Example**

```bash
curl -i -X PUT 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/assistant' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"psw": "A_LONG_RANDOM_PASSWORD"}'
```

```
HTTP/1.1 201 Created

Created
```

## Notes and caveats

- Neither endpoint returns JSON on success: the body is the plain-text status phrase (`OK`, `Created`). Rely on the status code.
- `PUT` is an upsert: `201` the first time, `200` afterwards. Every call replaces the password and signs the assistant out, even when the same password is sent again.
- There is no endpoint to read the password or to delete the assistant access through the API v2.
- Order of operations for a new user: create the user, enable the `assistant` module ([Users](/reference/users/)), then call `PUT /v2/users/:user_id/assistant`.
- `GET` only reports that an assistant access has been set up. It does not tell whether the `assistant` module is still enabled on the user.
- The assistant signs in with the user's first email address as it was when `PUT` was last called. If that address changes later, call `PUT` again so that the assistant can sign in with the new address.
- A `403` on `PUT` has several possible causes (module missing, user outside the organization, wrong key scope) and the response does not say which one: check the user's `modules.assistant` first.
