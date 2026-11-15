---
{ "pageClass": "reference-page" }
---

# Team admin preferences

:::::panel

:::: left
Team admin preferences define **which notifications the admins of a [team](/reference/teams/) receive about the events of the team's members**. There is at most one preferences object per team. It lets managers or assistants (the team's admins, including admin-only users) keep an eye on the bookings of the people they supervise without being invitees of those events.

How it works:

- An event "concerns" a team when one of its participants is a Vyte user who is in the team's `members` (see [Roles in a team](/reference/teams/#roles-in-a-team)).
- Each time Vyte sends a notification email about such an event to that member, and the matching flag below is `true`, **every admin of the team receives a copy of that email** at their primary address.
- The copy is sent whatever the member's own notification preferences are (see [Users](/reference/users/) for a user's own preferences): admin preferences are evaluated independently.
- An admin who administers several teams concerned by the same event receives each notification only once.
- A team with no preferences object, or with all flags `false` (the default), sends nothing to its admins.

The preferences apply to the whole team: they cannot be set per admin.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/teams/:team_id/admin-preferences" href="#retrieve-the-admin-preferences-of-a-team"></endpoint>
  <endpoint method="post" path="/v2/teams/:team_id/admin-preferences" href="#set-the-admin-preferences-of-a-team"></endpoint>
  <endpoint method="put" path="/v2/teams/:team_id/admin-preferences" href="#set-the-admin-preferences-of-a-team"></endpoint>
</endpoints>
::::

:::::

## The Team admin preferences object

In the descriptions below, "the member" is the team member taking part in the event.

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `_id` | string | no | Unique identifier of the preferences object. This is the value of `admin_preference` in the [Team object](/reference/teams/#the-team-object). |
| `belongs_to` | string | no | `_id` of the team these preferences belong to. Always the team of the URL. |
| `prefs` | object | yes | The preferences. |
| `prefs.email` | object | yes | Email notifications copied to the team's admins. |
| `prefs.email.new_event` | boolean | yes | An event was created by someone else and the member is invited to it. Default `false`. |
| `prefs.email.new_event_admin` | boolean | yes | An event was created by the member. Default `false`. |
| `prefs.email.vyteme_created_admin` | boolean | yes | An event was booked on the member's booking page (the owner of a booking page is the creator of the events booked on it). Default `false`. |
| `prefs.email.event_confirmed` | boolean | yes | An event of the member was confirmed by someone else. Default `false`. |
| `prefs.email.event_confirmed_admin` | boolean | yes | An event created by the member was confirmed by the member. Default `false`. |
| `prefs.email.event_cancelled` | boolean | yes | An event of the member was cancelled by someone else. Default `false`. |
| `prefs.email.event_cancelled_admin` | boolean | yes | An event created by the member was cancelled by the member. Default `false`. |
| `prefs.email.attending` | boolean | yes | An invitee accepted an event created by the member. Default `false`. |
| `prefs.email.declined` | boolean | yes | An invitee declined an event created by the member. Default `false`. |
| `prefs.email.new_message` | boolean | yes | Someone else posted a message in an event the member takes part in or created. Default `false`. |
| `prefs.email.new_suggestion` | boolean | yes | Someone else suggested a new date or place in an event of the member. Default `false`. |
| `prefs.email.new_suggestion_own` | boolean | yes | The member suggested a new date or place. Default `false`. |
| `prefs.email.vote_update` | boolean | yes | Someone voted on the dates or places of an event created by the member. Default `false`. |
| `prefs.email.vote_confirmation` | boolean | yes | The member voted (confirmation email of their own vote). Default `false`. |
| `prefs.calendar` | object | yes | Calendar behaviour for the team's admins. |
| `prefs.calendar.blocker` | boolean | yes | When `true`, each confirmed event created by a member of the team (for example an appointment booked on the member's booking page) also blocks the corresponding time in the calendars of the team's admins, except for an admin who is the creator of the event. The block is updated when the event changes and removed when the event is cancelled. Default `false`. |
| `createdAt` | string (ISO 8601 date-time) | no | Creation date. |
| `updatedAt` | string (ISO 8601 date-time) | no | Last modification date. |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

Example:

```json
{
  "_id": "5f1e9b2a8c4d3e00123456bb",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "prefs": {
    "email": {
      "attending": false,
      "declined": false,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": false,
      "new_event": false,
      "new_event_admin": false,
      "new_message": false,
      "new_suggestion": false,
      "new_suggestion_own": false,
      "vote_update": false,
      "vote_confirmation": false,
      "vyteme_created_admin": true
    },
    "calendar": {
      "blocker": false
    }
  },
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| `GET` | `/v2/teams/:team_id/admin-preferences` | [Retrieve the admin preferences of a team](#retrieve-the-admin-preferences-of-a-team) | organization, team |
| `POST` | `/v2/teams/:team_id/admin-preferences` | [Set the admin preferences of a team](#set-the-admin-preferences-of-a-team) | organization, team |
| `PUT` | `/v2/teams/:team_id/admin-preferences` | [Set the admin preferences of a team](#set-the-admin-preferences-of-a-team) (alias of `POST`) | organization, team |

Authentication, key scopes and the common error format are described in [Conventions](/reference/).

With a `team` scoped key, `:team_id` must be one of the key's teams, otherwise the answer is `403`. `user` scoped keys are not meant to be used on these endpoints.

The admin preferences can also be set while creating or updating a team, through the `admin_preference` field of [Create or update a team](/reference/teams/#create-or-update-a-team).

### Retrieve the admin preferences of a team

`GET /v2/teams/:team_id/admin-preferences`

Returns the admin preferences of the team.

**Key scope:** organization, team (only for the teams of the key)

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the [team](/reference/teams/). |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the [Team admin preferences object](#the-team-admin-preferences-object).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The team belongs to another organization, or `team` scoped key and `team_id` is not one of the key's teams. |
| `404` | The team does not exist, or the team exists but no admin preferences have been set for it yet. |
| `500` | `team_id` is not a valid id, or unexpected server error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/admin-preferences' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e00123456bb",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "prefs": {
    "email": {
      "attending": true,
      "declined": true,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": false,
      "new_event": false,
      "new_event_admin": false,
      "new_message": false,
      "new_suggestion": false,
      "new_suggestion_own": false,
      "vote_update": false,
      "vote_confirmation": false,
      "vyteme_created_admin": false
    },
    "calendar": {
      "blocker": false
    }
  },
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-01-12T09:30:00.000Z"
}
```

### Set the admin preferences of a team

`POST /v2/teams/:team_id/admin-preferences`

`PUT /v2/teams/:team_id/admin-preferences` (alias: `POST` and `PUT` behave identically)

Creates the admin preferences of the team if it has none, otherwise updates the existing ones (upsert). Both methods can be used indifferently for the first call and for later changes, and both always answer `200`.

Business rules:

- The body carries a `prefs` object. **Treat it as a full replacement**: always send the complete set of flags you want to be `true`. A flag that is not present in the `prefs` you send must be considered reset to `false` (this also applies to `prefs.calendar` when you only send `prefs.email`). To change a single flag, first [retrieve](#retrieve-the-admin-preferences-of-a-team) the current object, modify it, and send the whole `prefs` back.
- `belongs_to` cannot be changed: the preferences always belong to the team of the URL.
- The team's `admin_preference` field is set to the `_id` of the preferences object.
- The change applies to the notifications sent after the call. No email is sent by the call itself.

**Key scope:** organization, team (only for the teams of the key)

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the [team](/reference/teams/). |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `prefs` | object | no | all flags `false` | The preferences. |
| `prefs.email` | object | no | all flags `false` | Email notifications copied to the team's admins. |
| `prefs.email.new_event` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.new_event_admin` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.vyteme_created_admin` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.event_confirmed` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.event_confirmed_admin` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.event_cancelled` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.event_cancelled_admin` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.attending` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.declined` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.new_message` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.new_suggestion` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.new_suggestion_own` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.vote_update` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.email.vote_confirmation` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |
| `prefs.calendar` | object | no | `{"blocker": false}` | Calendar behaviour for the team's admins. |
| `prefs.calendar.blocker` | boolean | no | `false` | See [the object](#the-team-admin-preferences-object). |

Unknown fields are ignored.

**Response**

`200` with the saved [Team admin preferences object](#the-team-admin-preferences-object) (also when the object was just created).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The team belongs to another organization, or `team` scoped key and `team_id` is not one of the key's teams. |
| `404` | The team does not exist. |
| `500` | `team_id` is not a valid id, a flag holds a value that is not a boolean, or unexpected server error. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/admin-preferences' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "prefs": {
      "email": {
        "attending": true,
        "declined": true,
        "event_cancelled": true,
        "event_cancelled_admin": true,
        "event_confirmed": true,
        "event_confirmed_admin": false,
        "new_event": true,
        "new_event_admin": false,
        "new_message": false,
        "new_suggestion": false,
        "new_suggestion_own": false,
        "vote_update": false,
        "vote_confirmation": false,
        "vyteme_created_admin": false
      },
      "calendar": {
        "blocker": false
      }
    }
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e00123456bb",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "prefs": {
    "email": {
      "attending": true,
      "declined": true,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": false,
      "new_event": true,
      "new_event_admin": false,
      "new_message": false,
      "new_suggestion": false,
      "new_suggestion_own": false,
      "vote_update": false,
      "vote_confirmation": false,
      "vyteme_created_admin": false
    },
    "calendar": {
      "blocker": false
    }
  },
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

## Notes and caveats

- **`POST` and `PUT` are the same upsert** and both answer `200`, never `201`. There is no `DELETE`: to stop all admin notifications, send a `prefs` object with every flag set to `false`.
- **`GET` answers `404` until preferences have been set once**, even though the team exists. Treat this `404` as "all flags `false`".
- **Send the complete `prefs` object on every write.** Do not rely on omitted flags keeping their previous value.
- **One object per team, shared by all its admins.** Preferences cannot differ from one admin to another. Who receives the notifications is defined by the team's `admins` list (see [Teams](/reference/teams/#roles-in-a-team)).
- **Only events of `members` trigger notifications.** An admin-only user receives the team's notifications, but events in which only that user takes part do not notify the other admins.
- **Admins are notified in addition to the member**, not instead of them. The member's own notification preferences are not affected.
- **A team's preferences object survives changes of its members and admins**; it is only read at the time a notification is sent.
