---
{ "pageClass": "reference-page" }
---

# Group Pro

:::::panel

:::: left
Group Pro is the set of advanced options for group events (events with several invitees, typically polls where invitees vote for dates and places). The Group Pro resource of a [user](./users.md) stores that user's default values for these options: whether invitees may suggest new dates or places or add other invitees, whether the invitee list is hidden, whether email replies go to the organizer, and a default message. Each user has exactly one Group Pro object. The Vyte applications use it to pre-fill the options of a new group event created by the user. The corresponding options of an event are its `settings` (see [Events](./events.md)); the user-level switch that enables the feature is the `group_pro` module (see `PUT /v2/users/:user_id/modules` in [Users](./users.md)). Authentication, key scopes and error format are described in [Conventions](./README.md).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users/:user_id/group-pro" href="#retrieve-the-group-pro-defaults-of-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id/group-pro" href="#update-the-group-pro-defaults-of-a-user"></endpoint>
</endpoints>
::::

:::::

## The Group Pro object

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `_id` | string | no | Id of the Group Pro object. Only stable once it has been saved by a first `PUT` (see [Notes and caveats](#notes-and-caveats)). |
| `belongs_to` | string | no | Id of the [user](./users.md) these defaults belong to. |
| `defaults` | object | yes | The default options. |
| `defaults.settings` | object | yes | Default event settings. |
| `defaults.settings.block_new` | object | yes | What invitees are prevented from adding to the user's group events. |
| `defaults.settings.block_new.date` | boolean | yes | `true`: invitees cannot suggest new dates. Default `false`. |
| `defaults.settings.block_new.place` | boolean | yes | `true`: invitees cannot suggest new places. Default `false`. |
| `defaults.settings.block_new.invitee` | boolean | yes | `true`: invitees cannot add other invitees. Default `false`. |
| `defaults.settings.hide` | object | yes | What is hidden from invitees. |
| `defaults.settings.hide.invitees` | boolean | yes | `true`: the list of invitees is hidden from the invitees. Default `false`. |
| `defaults.settings.reply_to_organizer` | boolean | yes | `true`: replies to the event's notification emails are addressed to the organizer. Default `false`. |
| `defaults.message` | string | yes | Default message of the user's group events. No default: the field is absent until set. HTML is sanitized when saved (unsafe markup is removed or escaped). |
| `createdAt` | string (ISO 8601 date) | no | Creation date. Present only once the object has been saved. |
| `updatedAt` | string (ISO 8601 date) | no | Last update date. Present only once the object has been saved. |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

```json
{
  "_id": "5f1e9b2a8c4d3e001234567a",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "defaults": {
    "settings": {
      "block_new": {
        "date": true,
        "place": false,
        "invitee": false
      },
      "hide": {
        "invitees": false
      },
      "reply_to_organizer": true
    },
    "message": "Please vote for every date that suits you."
  },
  "createdAt": "2026-01-15T09:30:00.000Z",
  "updatedAt": "2026-01-15T09:30:00.000Z"
}
```

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| `GET` | `/v2/users/:user_id/group-pro` | Retrieve the Group Pro defaults of a user | organization, user |
| `PUT` | `/v2/users/:user_id/group-pro` | Update (or create) the Group Pro defaults of a user | organization, user |

### Retrieve the Group Pro defaults of a user

`GET /v2/users/:user_id/group-pro`

Returns the Group Pro object of the user. When the user has none saved yet, an object holding the default values is returned (all booleans `false`, no `message`). Nothing is saved by this call.

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

`200 OK` with the [Group Pro object](#the-group-pro-object).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not a member of the key's organization, or a `user` key is used for another user. |
| `404` | The user or the key's organization does not exist. |
| `500` | Unexpected server error. |

**Example**

```bash
curl 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/group-pro' \
  -H 'Authorization: YOUR_API_KEY'
```

Response for a user who never saved any defaults:

```json
{
  "_id": "5f1e9b2a8c4d3e001234567b",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "defaults": {
    "settings": {
      "block_new": {
        "date": false,
        "place": false,
        "invitee": false
      },
      "hide": {
        "invitees": false
      },
      "reply_to_organizer": false
    }
  }
}
```

### Update the Group Pro defaults of a user

`PUT /v2/users/:user_id/group-pro`

Saves the Group Pro defaults of the user, creating the object if it does not exist yet (upsert). It does not modify any existing event and sends no notification.

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
| `defaults` | object | no | - | The default options. Always send it complete (see below). |
| `defaults.settings.block_new.date` | boolean | no | `false` | `true` to prevent invitees from suggesting new dates. |
| `defaults.settings.block_new.place` | boolean | no | `false` | `true` to prevent invitees from suggesting new places. |
| `defaults.settings.block_new.invitee` | boolean | no | `false` | `true` to prevent invitees from adding other invitees. |
| `defaults.settings.hide.invitees` | boolean | no | `false` | `true` to hide the invitee list from invitees. |
| `defaults.settings.reply_to_organizer` | boolean | no | `false` | `true` to address email replies to the organizer. |
| `defaults.message` | string | no | none | Default message. HTML is sanitized before being stored. |

Send the whole `defaults` object on every call: read it with `GET`, change what you need, and send it back. Fields left out of `defaults` are not guaranteed to keep their previous value. Send only the `defaults` field; do not send back `_id`, `belongs_to`, `createdAt`, `updatedAt` or any other field returned by `GET`.

**Response**

`200 OK`. The body is the plain text `OK`, not JSON, and the saved object is not returned: call `GET` to read it. The status is `200` whether the object was created or updated.

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not a member of the key's organization, or a `user` key is used for another user. |
| `404` | The user or the key's organization does not exist. |
| `500` | A value has the wrong type (for example a non-boolean for a boolean field), or unexpected server error. |

**Example**

```bash
curl -i -X PUT 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/group-pro' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "defaults": {
      "settings": {
        "block_new": { "date": true, "place": false, "invitee": false },
        "hide": { "invitees": false },
        "reply_to_organizer": true
      },
      "message": "Please vote for every date that suits you."
    }
  }'
```

```
HTTP/1.1 200 OK

OK
```

## Notes and caveats

- `PUT` returns the plain text `OK`, not the saved object.
- `GET` never creates anything. Until the first `PUT`, the returned `_id` is a placeholder that differs on every call and `createdAt` / `updatedAt` are absent. Do not store that `_id`.
- These values are defaults for the Vyte applications. They are not applied automatically to events created through the API: when you create an event with the API, pass the wanted options explicitly in the event's `settings` (see [Events](./events.md)).
- Changing the defaults never changes events that already exist.
- These endpoints do not check the `group_pro` module of the user: the defaults can be read and written even when the module is disabled. They only take effect for users who have the module (see [Users](./users.md)).
- `defaults.message` may come back different from what was sent, because HTML is sanitized on save.
- Wrong value types are answered with `500`, not `400`.
