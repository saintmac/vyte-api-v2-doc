---
{ "pageClass": "reference-page" }
---

# User preferences

:::::panel

:::: left
The preferences of a user decide which notifications Vyte sends to that user, per channel: `email` (notification emails) and `push` (push notifications of the Vyte mobile app). Each user has exactly one preferences object. It is an extension of the [User](/reference/users/) resource, which is why its paths start with `/v2/users/:user_id/`. Preferences only concern notifications sent to the user as a Vyte account holder; for the notifications sent to the administrators of a team, see [Team admin preferences](/reference/team_admin_preferences/). Authentication, key scopes and error format are described in [Conventions](/reference/).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users/:user_id/preferences" href="#retrieve-the-preferences-of-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id/preferences" href="#update-the-preferences-of-a-user"></endpoint>
</endpoints>
::::

:::::

## The Preferences object

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `_id` | string | no | Id of the preferences object. Only stable once the preferences have been saved by a first `PUT` (see [Notes and caveats](#notes-and-caveats)). |
| `belongs_to` | string | no | Id of the [user](/reference/users/) these preferences belong to. |
| `prefs` | object | yes | The notification switches, grouped by channel. |
| `prefs.email` | object | yes | Switches for notification emails. |
| `prefs.email.attending` | boolean | yes | Email when an invitee accepts an event the user created. Default `true`. |
| `prefs.email.declined` | boolean | yes | Email when an invitee declines an event the user created. Default `true`. |
| `prefs.email.event_cancelled` | boolean | yes | Email when an event the user takes part in is cancelled by someone else. Default `true`. |
| `prefs.email.event_cancelled_admin` | boolean | yes | Email when the user cancels an event they created. Default `true`. |
| `prefs.email.event_confirmed` | boolean | yes | Email when an event the user takes part in is confirmed by someone else. Default `true`. |
| `prefs.email.event_confirmed_admin` | boolean | yes | Email when the user confirms an event they created. Default `true`. |
| `prefs.email.new_event` | boolean | yes | Email when the user is invited to an event created by someone else (other than a booking made on the user's own booking page). Default `true`. |
| `prefs.email.new_event_admin` | boolean | yes | Email when the user creates an event. Default `true`. |
| `prefs.email.new_message` | boolean | yes | Email when someone else posts a message on an event the user created or takes part in. Default `true`. |
| `prefs.email.new_suggestion` | boolean | yes | Email when someone else suggests a new date or place. Default `true`. |
| `prefs.email.new_suggestion_own` | boolean | yes | Email when the user suggests a new date or place. Default `true`. |
| `prefs.email.vote_update` | boolean | yes | Email when people vote on an event the user created. Default `true`. |
| `prefs.email.vote_confirmation` | boolean | yes | Email sent to the user after they vote. Default `false`. |
| `prefs.email.vyteme_created_admin` | boolean | yes | Email when an event is booked from the user's booking page. Default `true`. |
| `prefs.push` | object | yes | Switches for push notifications of the Vyte mobile app. |
| `prefs.push.attending` | boolean | yes | Push notification when an invitee accepts an event the user created. Default `false`. |
| `prefs.push.declined` | boolean | yes | Push notification when an invitee declines an event the user created. Default `false`. |
| `prefs.push.event_cancelled` | boolean | yes | Push notification when an event is cancelled by someone else. Default `false`. |
| `prefs.push.event_confirmed` | boolean | yes | Push notification when an event is confirmed by someone else. Default `false`. |
| `prefs.push.new_event` | boolean | yes | Push notification when the user is invited to an event created by someone else. Default `false`. |
| `prefs.push.new_message` | boolean | yes | Push notification when someone else posts a message on an event. Default `false`. |
| `prefs.push.new_suggestion` | boolean | yes | Push notification when someone else suggests a new date or place. Default `false`. |
| `prefs.push.vote_update` | boolean | yes | Push notification when people vote on an event the user created. Default `false`. |
| `prefs.push.vyteme_created_admin` | boolean | yes | Push notification when an event is booked from the user's booking page. Default `false`. |
| `createdAt` | string (ISO 8601 date) | no | Creation date. Present only once the preferences have been saved. |
| `updatedAt` | string (ISO 8601 date) | no | Last update date. Present only once the preferences have been saved. |

The `email` channel has 14 switches and the `push` channel has 9; the lists above are complete. `event_cancelled_admin`, `event_confirmed_admin`, `new_event_admin`, `new_suggestion_own` and `vote_confirmation` exist only for `email`.

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

```json
{
  "_id": "5f1e9b2a8c4d3e0012345679",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "prefs": {
    "email": {
      "attending": true,
      "declined": true,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": true,
      "new_event": true,
      "new_event_admin": true,
      "new_message": true,
      "new_suggestion": true,
      "new_suggestion_own": true,
      "vote_update": true,
      "vote_confirmation": false,
      "vyteme_created_admin": true
    },
    "push": {
      "attending": false,
      "declined": false,
      "event_cancelled": false,
      "event_confirmed": false,
      "new_event": false,
      "new_message": false,
      "new_suggestion": false,
      "vote_update": false,
      "vyteme_created_admin": false
    }
  },
  "createdAt": "2026-01-15T09:30:00.000Z",
  "updatedAt": "2026-01-15T09:30:00.000Z"
}
```

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| `GET` | `/v2/users/:user_id/preferences` | Retrieve the preferences of a user | organization, team, user |
| `PUT` | `/v2/users/:user_id/preferences` | Update (or create) the preferences of a user | organization, team, user |

### Retrieve the preferences of a user

`GET /v2/users/:user_id/preferences`

Returns the preferences of the user. When the user has no saved preferences yet, the default preferences are returned (all `email` switches `true` except `vote_confirmation`, all `push` switches `false`). Nothing is saved by this call.

**Key scope:** organization, team (the user must be a member of one of the key's teams), user (only for the key's own user).

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string | Id of the user. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with the complete [Preferences object](#the-preferences-object).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not a member of the key's organization (or of the key's teams for a `team` key), or a `user` key is used for another user. |
| `404` | The organization of the key no longer exists. |
| `500` | Unexpected server error. |

**Example**

```bash
curl 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/preferences' \
  -H 'Authorization: YOUR_API_KEY'
```

The response is the object shown in [The Preferences object](#the-preferences-object) (without `createdAt` / `updatedAt` when the preferences were never saved).

### Update the preferences of a user

`PUT /v2/users/:user_id/preferences`

Changes one or several switches. This is a partial update: only the switches present in the request are changed, every other switch keeps its current value. If the user has no saved preferences yet, they are created from the defaults and the request is applied on top (upsert). No notification is sent by this call.

**Key scope:** organization, team (the user must be a member of one of the key's teams), user (only for the key's own user).

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string | Id of the user. |

**Query parameters**

None.

**Request body**

JSON. The switches must be wrapped in a `prefs` object; anything outside `prefs` is ignored.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `prefs` | object | no | - | Switches to change. When absent, nothing is changed (the preferences are still created if they did not exist). |
| `prefs.email` | object | no | - | Email switches to change. Any of the 14 `prefs.email.*` fields of the [Preferences object](#the-preferences-object), each a boolean. |
| `prefs.push` | object | no | - | Push switches to change. Any of the 9 `prefs.push.*` fields of the [Preferences object](#the-preferences-object), each a boolean. |

Channels other than `email` and `push`, and switch names not listed in the object table, are ignored. Send real JSON booleans.

**Response**

`200 OK` with the complete, updated [Preferences object](#the-preferences-object). The status is `200` whether the preferences were created or updated.

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not a member of the key's organization (or of the key's teams for a `team` key), or a `user` key is used for another user. |
| `404` | The organization of the key no longer exists. |
| `500` | A switch value cannot be interpreted as a boolean, or unexpected server error. |

**Example**

```bash
curl -X PUT 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/preferences' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "prefs": {
      "email": { "vote_update": false, "new_event_admin": false },
      "push": { "new_message": true }
    }
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345679",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "prefs": {
    "email": {
      "attending": true,
      "declined": true,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": true,
      "new_event": true,
      "new_event_admin": false,
      "new_message": true,
      "new_suggestion": true,
      "new_suggestion_own": true,
      "vote_update": false,
      "vote_confirmation": false,
      "vyteme_created_admin": true
    },
    "push": {
      "attending": false,
      "declined": false,
      "event_cancelled": false,
      "event_confirmed": false,
      "new_event": false,
      "new_message": true,
      "new_suggestion": false,
      "vote_update": false,
      "vyteme_created_admin": false
    }
  },
  "createdAt": "2026-01-15T09:30:00.000Z",
  "updatedAt": "2026-01-15T09:31:12.000Z"
}
```

## Notes and caveats

- The request body of `PUT` must wrap the switches in `prefs` (<code v-pre>{"prefs": {"email": {...}}}</code>). A body that puts `email` / `push` at the top level is accepted with `200` but changes nothing.
- The response of both endpoints is the whole Preferences object, with the switches under `prefs`, not the bare `email` / `push` maps.
- `GET` never creates anything. Until the first `PUT`, the returned `_id` is a placeholder that differs on every call and `createdAt` / `updatedAt` are absent. Do not store that `_id`.
- `PUT` is an upsert and is idempotent: repeating the same request yields the same preferences.
- `PUT` is a partial update at switch level: to reset a switch, send its default value explicitly.
- Preferences can also change outside the API: the user can edit them in the Vyte applications, and the first time a user enables push notifications in the Vyte mobile app, all `push` switches are turned on and the `email` switches `attending`, `declined` and `vote_update` are turned off.
- A user's preferences do not control what invitees or team administrators receive; they only apply to the user identified by `:user_id`.
