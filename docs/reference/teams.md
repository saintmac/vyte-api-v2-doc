---
{ "pageClass": "reference-page" }
---

# Teams

:::::panel

:::: left
A team is a named group of [users](/reference/users/) of your organization. Teams are used to:

- take **team bookings**: an appointment is booked "with the team" and Vyte assigns it to one of the team's members (see [Events](/reference/events/), `POST /v2/teams/:team_id/events`);
- compute availability, list events and build reports for a group of users at once (see [Availabilities](/reference/availabilities/), [Events](/reference/events/), [Reports](/reference/reports/));
- give some users (the team's **admins**) oversight of the team's members: admins can be notified of what happens on the members' events (see [Team admin preferences](/reference/team_admin_preferences/));
- delimit what a `team` scoped API key can reach (see [Conventions](/reference/)).

A team always belongs to exactly one organization: the organization of the API key that created it.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/teams" href="#list-teams"></endpoint>
  <endpoint method="post" path="/v2/teams" href="#create-or-update-a-team"></endpoint>
  <endpoint method="post" path="/v2/teams/batch" href="#create-or-update-several-teams"></endpoint>
  <endpoint method="get" path="/v2/teams/:team_id" href="#retrieve-a-team"></endpoint>
  <endpoint method="put" path="/v2/teams/:team_id" href="#update-a-team"></endpoint>
  <endpoint method="delete" path="/v2/teams/:team_id" href="#delete-a-team"></endpoint>
  <endpoint method="post" path="/v2/teams/:team_id/members" href="#add-members-to-a-team"></endpoint>
  <endpoint method="delete" path="/v2/teams/:team_id/members/:member_id" href="#remove-a-user-from-a-team"></endpoint>
  <endpoint method="post" path="/v2/teams/:team_id/members/:member_id/admin" href="#make-a-user-an-admin-of-a-team"></endpoint>
  <endpoint method="delete" path="/v2/teams/:team_id/members/:member_id/admin" href="#remove-the-admin-role-of-a-user"></endpoint>
  <endpoint method="post" path="/v2/teams/:team_id/members/:member_id/admin-only" href="#make-a-user-an-admin-only-of-a-team"></endpoint>
  <endpoint method="delete" path="/v2/teams/:team_id/members/:member_id/admin-only" href="#remove-the-admin-role-of-a-user"></endpoint>
  <endpoint method="get" path="/v2/teams/:team_id/public" href="#retrieve-the-public-view-of-a-team"></endpoint>
</endpoints>
::::

:::::

## Roles in a team

A team holds two independent lists of users: `members` and `admins`. A user can be in one, the other, or both. This gives three roles:

| Role | In `members` | In `admins` | Meaning |
| --- | --- | --- | --- |
| Member | yes | no | A bookable person of the team. |
| Admin | yes | yes | A bookable person of the team who also administers it. |
| Admin-only | no | yes | Administers the team without being bookable in it (for example a manager or an assistant). |

What each list implies:

| Aspect | `members` (member, admin) | `admins` (admin, admin-only) |
| --- | --- | --- |
| Team bookings | Team bookings are assigned to members only. An admin-only user is never assigned a team booking. | No effect by itself. |
| Team availability, team events listing, team reports | Computed over the members only. An admin-only user is not included. | No effect by itself. |
| Reach of a `team` scoped API key | The users reachable with the key are the members of the key's teams. | A `team` scoped key covers the teams administered by the user it was issued for. |
| Notifications | Events in which a member takes part are the ones that trigger the team's admin notifications. Members keep receiving their own notifications according to their own preferences. | Each admin receives a copy of the notification emails enabled in the [team admin preferences](/reference/team_admin_preferences/) for the events of the team's members. An admin of several teams concerned by the same event is notified only once per notification. |
| Calendar | - | Admins get a Vyte team calendar in their calendar list. When the `calendar.blocker` admin preference is on, confirmed events of the members are also blocked in the admins' calendars. |

Rules enforced by the API:

- Only users who are members of the organization can be put in `members` or `admins` through the team create/update/add-members endpoints. References to anyone else are silently ignored (no error).
- A team always has at least one admin: when a team is saved with an empty `admins` list, the first administrator of the organization is automatically set as its admin.
- With no [team admin preferences](/reference/team_admin_preferences/) defined, or with all flags `false` (the default), admins receive no notification.

## The Team object

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `_id` | string | no | Unique identifier of the team (24 hex characters). |
| `name` | string | yes | Name of the team. Required. HTML is sanitized on save. |
| `extid` | string | create-only | Your own identifier for the team (for example its id in your system). Required when creating through the API. Within an organization, `extid` identifies the team: creating a team with an `extid` that already exists updates that team instead (see [Create or update a team](#create-or-update-a-team)). |
| `organization` | string | no | `_id` of the organization the team belongs to. Always the organization of the API key. |
| `level_name` | string | yes | Free label describing the kind / hierarchical level of the team, for example `"agency"`, `"regional team"`, `"top management"`. No default. |
| `tags` | array of string | yes | Free tags attached to the team. Default `[]`. |
| `booking_page_path` | string | yes | Path of the booking page associated with the team. Stored as provided. No default. |
| `public` | boolean | no | When `true`, the name of the team and the first name, last name and picture of its members can be read without authentication through [Retrieve the public view of a team](#retrieve-the-public-view-of-a-team). Default `false`. Cannot be changed through the v2 API; it is set from the Vyte application. |
| `members[]` | array of string, or array of [Team user](#the-team-user-object) | yes | The bookable users of the team. User `_id`s in most responses; expanded to Team user objects in the responses that say so. Default `[]`. |
| `admins[]` | array of string, or array of [Team user](#the-team-user-object) | yes | The users administering the team. Same representation as `members`. See [Roles in a team](#roles-in-a-team). |
| `admin_preference` | string | yes (as an object, see below) | `_id` of the team's [Team admin preferences](/reference/team_admin_preferences/) object. Absent while no preferences have been defined. In requests, you pass an object (<code v-pre>{"prefs": {...}}</code>), in responses you get the id. |
| `createdAt` | string (ISO 8601 date-time) | no | Creation date. |
| `updatedAt` | string (ISO 8601 date-time) | no | Last modification date. |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

Example (ids not expanded):

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "level_name": "agency",
  "tags": ["sales", "paris"],
  "public": false,
  "members": ["5f1e9b2a8c4d3e0012345601", "5f1e9b2a8c4d3e0012345602"],
  "admins": ["5f1e9b2a8c4d3e0012345601"],
  "admin_preference": "5f1e9b2a8c4d3e00123456bb",
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

### The Team user object

In the responses of [Retrieve a team](#retrieve-a-team) and of the member / admin management endpoints, each entry of `members` and `admins` is expanded to the following object.

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `_id` | string | no | `_id` of the [user](/reference/users/). |
| `full_name` | string | no | Full name of the user. |
| `emails[]` | array of string | no | Email addresses of the user. The first one is the primary address. |
| `picture_url` | string | no | URL of the user's picture, when set. |
| `calendars.google` | boolean | no | Whether the user has connected a Google calendar. |
| `calendars.office365` | boolean | no | Whether the user has connected an Office 365 calendar. |
| `calendars.exchange` | boolean | no | Whether the user has connected an Exchange calendar. |
| `calendars.icloud` | boolean | no | Whether the user has connected an iCloud calendar. |
| `calendars.caldav` | boolean | no | Whether the user has connected a CalDAV calendar. |
| `calendars.zoho` | boolean | no | Whether the user has connected a Zoho calendar. |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

Example (team with expanded users):

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "level_name": "agency",
  "tags": ["sales", "paris"],
  "public": false,
  "members": [
    {
      "_id": "5f1e9b2a8c4d3e0012345601",
      "full_name": "Jane Doe",
      "emails": ["jane.doe@example.com"],
      "picture_url": "https://example.com/pictures/jane.jpg",
      "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345602",
      "full_name": "John Smith",
      "emails": ["john.smith@example.com"],
      "calendars": {"google": false, "office365": true, "exchange": false, "icloud": false, "caldav": false, "zoho": false}
    }
  ],
  "admins": [
    {
      "_id": "5f1e9b2a8c4d3e0012345601",
      "full_name": "Jane Doe",
      "emails": ["jane.doe@example.com"],
      "picture_url": "https://example.com/pictures/jane.jpg",
      "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}
    }
  ],
  "admin_preference": "5f1e9b2a8c4d3e00123456bb",
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

### User references

Wherever a request accepts a list of users (`members`, `admins`), each entry of the array can take any of the following forms. Forms can be mixed in the same array.

| Form | Example | Resolves to |
| --- | --- | --- |
| Object with `email` | `{"email": "jane.doe@example.com"}` | The user owning this email address. |
| Object with `extid` | `{"extid": "employee-42"}` | The user whose external id (the `extid` you gave the user in your organization, see [Users](/reference/users/)) has this value. |
| Object with `_id` | `{"_id": "5f1e9b2a8c4d3e0012345601"}` | The user with this `_id`. |
| Object with `member_id` | `{"member_id": "5f1e9b2a8c4d3e0012345601"}` | The user with this `_id` (alias of the `_id` form). |
| String holding an id | `"5f1e9b2a8c4d3e0012345601"` | The user with this `_id`. |
| String holding an email | `"jane.doe@example.com"` | The user owning this email address. |

Rules:

- When an object carries several of these keys, only one is used, in this order of precedence: `email`, `extid`, `_id`, `member_id`.
- `_id` and `member_id` values must be valid ids (24 hex characters).
- A reference that matches no user, or matches a user who is not a member of the organization, is **silently dropped**: the request succeeds and the user is simply not in the resulting list. Always check the returned `members` / `admins`.
- Users are never created by team endpoints. Create them first (see [Users](/reference/users/)).

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| `GET` | `/v2/teams` | [List teams](#list-teams) | organization, team |
| `POST` | `/v2/teams` | [Create or update a team](#create-or-update-a-team) (upsert on `extid`) | organization |
| `POST` | `/v2/teams/batch` | [Create or update several teams](#create-or-update-several-teams) | organization |
| `GET` | `/v2/teams/:team_id` | [Retrieve a team](#retrieve-a-team) | organization, team |
| `PUT` | `/v2/teams/:team_id` | [Update a team](#update-a-team) | organization, team |
| `DELETE` | `/v2/teams/:team_id` | [Delete a team](#delete-a-team) | organization, team |
| `POST` | `/v2/teams/:team_id/members` | [Add members to a team](#add-members-to-a-team) | organization |
| `DELETE` | `/v2/teams/:team_id/members/:member_id` | [Remove a user from a team](#remove-a-user-from-a-team) | organization |
| `POST` | `/v2/teams/:team_id/members/:member_id/admin` | [Make a user an admin of a team](#make-a-user-an-admin-of-a-team) | organization |
| `DELETE` | `/v2/teams/:team_id/members/:member_id/admin` | [Remove the admin role of a user](#remove-the-admin-role-of-a-user) | organization |
| `POST` | `/v2/teams/:team_id/members/:member_id/admin-only` | [Make a user an admin-only of a team](#make-a-user-an-admin-only-of-a-team) | organization |
| `DELETE` | `/v2/teams/:team_id/members/:member_id/admin-only` | [Remove the admin role of a user](#remove-the-admin-role-of-a-user) (alias) | organization |
| `GET` | `/v2/teams/:team_id/public` | [Retrieve the public view of a team](#retrieve-the-public-view-of-a-team) | none (no API key) |

Related endpoints documented elsewhere:

| Method | Path | Documented in |
| --- | --- | --- |
| `GET`, `POST`, `PUT` | `/v2/teams/:team_id/admin-preferences` | [Team admin preferences](/reference/team_admin_preferences/) |
| `GET`, `POST` | `/v2/teams/:team_id/events` | [Events](/reference/events/) |
| `POST` | `/v2/teams/:team_id/availabilities/batch` | [Availabilities](/reference/availabilities/) |
| `GET` | `/v2/teams/:team_id/reports/...` | [Reports](/reference/reports/) |

Authentication, key scopes and the common error format are described in [Conventions](/reference/). In addition to the errors listed for each endpoint, every authenticated endpoint answers `401` when the API key is missing, unknown or deactivated.

How a `team` scoped key is restricted on the endpoints that accept it:

- any `:team_id` in the path that is not one of the key's teams is rejected with `403`, before anything else is checked;
- `GET /v2/teams` returns only the key's teams;
- every endpoint marked "organization" in the table above answers `403`.

`user` scoped keys are not meant to be used on team endpoints.

### List teams

`GET /v2/teams`

Returns the teams of the organization. With a `team` scoped key, returns only the teams of the key.

**Key scope:** organization, team

**Path parameters**

None.

**Query parameters**

None. There is no pagination and no filter: all teams are returned in one array.

**Request body**

None.

**Response**

`200` with a JSON array of [Team objects](#the-team-object) (an empty array when there is none). `members` and `admins` are arrays of user `_id`s (not expanded).

**Errors**

| Status | When |
| --- | --- |
| `400` | The API key is not attached to an organization. |
| `401` | Missing, unknown or deactivated API key. |
| `500` | Unexpected server error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/teams' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345678",
    "name": "Sales Paris",
    "extid": "sales-paris",
    "organization": "5f1e9b2a8c4d3e00123456aa",
    "level_name": "agency",
    "tags": ["sales", "paris"],
    "public": false,
    "members": ["5f1e9b2a8c4d3e0012345601", "5f1e9b2a8c4d3e0012345602"],
    "admins": ["5f1e9b2a8c4d3e0012345601"],
    "admin_preference": "5f1e9b2a8c4d3e00123456bb",
    "createdAt": "2026-01-12T09:30:00.000Z",
    "updatedAt": "2026-02-03T14:05:12.000Z"
  }
]
```

### Create or update a team

`POST /v2/teams`

Creates a team in the organization of the API key. This endpoint is an **upsert keyed on `extid`**: if a team with the same `extid` already exists in the organization, that team is updated with the body instead of a second team being created. The call is therefore safe to repeat.

Business rules:

- `name` and `extid` are required.
- `members` and `admins` are given as [user references](#user-references). Each list, when present, **replaces** the corresponding list of an existing team; when absent, the existing list is kept.
- Putting a user in `admins` does not put them in `members`: list a user in both to make them an admin who is also bookable, in `admins` only to make them admin-only (see [Roles in a team](#roles-in-a-team)).
- If the resulting `admins` list is empty, the first administrator of the organization becomes the team's admin.
- `admin_preference`, when present, creates the team's [admin preferences](/reference/team_admin_preferences/) or replaces the existing ones.
- No email is sent to the users added to the team.

**Key scope:** organization

**Path parameters**

None.

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `name` | string | yes | - | Name of the team. On an existing team, replaces the name. |
| `extid` | string | yes | - | Your identifier for the team. Selects the team to update if it already exists in the organization. |
| `level_name` | string | no | none (existing value kept) | Free label for the kind / level of team. An empty value is ignored. |
| `tags` | array of string | no | `[]` (existing value kept) | Tags of the team. Replaces the existing tags. |
| `booking_page_path` | string | no | none (existing value kept) | Path of the booking page associated with the team. An empty value is ignored. |
| `members` | array of [user references](#user-references) | no | `[]` (existing list kept) | Bookable users of the team. Replaces the existing list. |
| `admins` | array of [user references](#user-references) | no | first administrator of the organization (existing list kept) | Users administering the team. Replaces the existing list. |
| `admin_preference` | object | no | none | Admin notification preferences of the team. |
| `admin_preference.prefs` | object | no | all flags `false` | Same structure as `prefs` in the [Team admin preferences object](/reference/team_admin_preferences/#the-team-admin-preferences-object). On an existing team that already has preferences, the whole `prefs` object is replaced: flags you omit go back to `false`. |

The team is always created in the organization of the API key; the organization cannot be chosen in the body.

**Response**

`201` with the [Team object](#the-team-object), both when the team was created and when an existing team was updated. `members` and `admins` are arrays of user `_id`s (not expanded); `admin_preference` is the id of the preferences object.

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The API key is not `organization` scoped. |
| `500` | `name` or `extid` is missing, a user reference holds a malformed id, or unexpected server error. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/teams' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "Sales Paris",
    "extid": "sales-paris",
    "level_name": "agency",
    "tags": ["sales", "paris"],
    "members": [
      {"_id": "5f1e9b2a8c4d3e0012345601"},
      {"extid": "employee-42"},
      {"email": "john.smith@example.com"}
    ],
    "admins": [
      {"email": "jane.doe@example.com"}
    ],
    "admin_preference": {
      "prefs": {
        "email": {
          "event_confirmed": true,
          "event_cancelled": true
        }
      }
    }
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "level_name": "agency",
  "tags": ["sales", "paris"],
  "public": false,
  "members": ["5f1e9b2a8c4d3e0012345601", "5f1e9b2a8c4d3e0012345603", "5f1e9b2a8c4d3e0012345602"],
  "admins": ["5f1e9b2a8c4d3e0012345601"],
  "admin_preference": "5f1e9b2a8c4d3e00123456bb",
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-01-12T09:30:00.000Z"
}
```

### Create or update several teams

`POST /v2/teams/batch`

Applies [Create or update a team](#create-or-update-a-team) to each element of an array, in one call. Each element follows exactly the same rules (required `name` and `extid`, upsert on `extid`, user references, replacement of `members` / `admins`, admin preferences).

The batch is **not atomic**: teams are processed concurrently and independently. If one of them fails, the call answers `500` while other teams of the batch may already have been created or updated. Because each element is an upsert, the same batch can safely be sent again after fixing the faulty element.

**Key scope:** organization

**Path parameters**

None.

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `organization` | string | yes | - | `_id` of your organization. Must be the organization of the API key. |
| `teams` | array of object | yes | - | The teams to create or update. Each element takes the fields of the [Create or update a team](#create-or-update-a-team) request body. |

**Response**

`201` with a JSON array of [Team objects](#the-team-object), in the same order as the `teams` array of the request. `members` and `admins` are arrays of user `_id`s (not expanded).

**Errors**

| Status | When |
| --- | --- |
| `400` | `organization` is missing, or `teams` is missing or is not an array. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The API key is not `organization` scoped, or `organization` is not the organization of the API key. |
| `500` | An element has no `name` or no `extid`, a user reference holds a malformed id, or unexpected server error. Part of the batch may have been applied. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/teams/batch' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "organization": "5f1e9b2a8c4d3e00123456aa",
    "teams": [
      {
        "name": "Sales Paris",
        "extid": "sales-paris",
        "members": [{"email": "jane.doe@example.com"}, {"email": "john.smith@example.com"}],
        "admins": [{"email": "jane.doe@example.com"}]
      },
      {
        "name": "Sales Lyon",
        "extid": "sales-lyon",
        "members": [{"extid": "employee-42"}]
      }
    ]
  }'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345678",
    "name": "Sales Paris",
    "extid": "sales-paris",
    "organization": "5f1e9b2a8c4d3e00123456aa",
    "tags": [],
    "public": false,
    "members": ["5f1e9b2a8c4d3e0012345601", "5f1e9b2a8c4d3e0012345602"],
    "admins": ["5f1e9b2a8c4d3e0012345601"],
    "createdAt": "2026-01-12T09:30:00.000Z",
    "updatedAt": "2026-01-12T09:30:00.000Z"
  },
  {
    "_id": "5f1e9b2a8c4d3e0012345679",
    "name": "Sales Lyon",
    "extid": "sales-lyon",
    "organization": "5f1e9b2a8c4d3e00123456aa",
    "tags": [],
    "public": false,
    "members": ["5f1e9b2a8c4d3e0012345603"],
    "admins": ["5f1e9b2a8c4d3e0012345600"],
    "createdAt": "2026-01-12T09:30:00.000Z",
    "updatedAt": "2026-01-12T09:30:00.000Z"
  }
]
```

In this example the second team was sent without `admins`: the first administrator of the organization was set as its admin.

### Retrieve a team

`GET /v2/teams/:team_id`

Returns one team of the organization, with its members and admins expanded.

**Key scope:** organization, team (only for the teams of the key)

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the team. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the [Team object](#the-team-object). Each entry of `members` and `admins` is expanded to a [Team user object](#the-team-user-object).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key and `team_id` is not one of the key's teams. |
| `404` | No team with this id in the organization of the API key. |
| `500` | `team_id` is not a valid id, or unexpected server error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "level_name": "agency",
  "tags": ["sales", "paris"],
  "public": false,
  "members": [
    {
      "_id": "5f1e9b2a8c4d3e0012345601",
      "full_name": "Jane Doe",
      "emails": ["jane.doe@example.com"],
      "picture_url": "https://example.com/pictures/jane.jpg",
      "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}
    }
  ],
  "admins": [
    {
      "_id": "5f1e9b2a8c4d3e0012345601",
      "full_name": "Jane Doe",
      "emails": ["jane.doe@example.com"],
      "picture_url": "https://example.com/pictures/jane.jpg",
      "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}
    }
  ],
  "admin_preference": "5f1e9b2a8c4d3e00123456bb",
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

### Update a team

`PUT /v2/teams/:team_id`

Partially updates a team: only the fields present in the body are changed, the others keep their current value.

Business rules:

- The team must have an `extid`. A team that has none (for example a team created from the Vyte application) cannot be updated with this endpoint (`500`).
- Do not send `extid` in the body: the `extid` of a team cannot be changed with this endpoint.
- `members` and `admins`, when present, **replace** the whole corresponding list (they are [user references](#user-references)). To add or remove a single user, prefer the dedicated [member and admin endpoints](#add-members-to-a-team).
- Every time a team is updated, its `members` and `admins` are re-validated against the organization: users who are no longer members of the organization are removed from the team, even when the body does not contain `members` or `admins`.
- If the resulting `admins` list is empty, the first administrator of the organization becomes the team's admin.
- `level_name` and `booking_page_path` cannot be emptied: an empty value is ignored. `tags` can be emptied with `[]`.

**Key scope:** organization, team (only for the teams of the key)

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the team. |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `name` | string | no | current value | New name of the team. |
| `level_name` | string | no | current value | New level label. |
| `tags` | array of string | no | current value | New tags. Replaces the existing tags. |
| `booking_page_path` | string | no | current value | New booking page path. |
| `members` | array of [user references](#user-references) | no | current list | New list of bookable users. Replaces the existing list. |
| `admins` | array of [user references](#user-references) | no | current list | New list of admins. Replaces the existing list. |
| `admin_preference` | object | no | current preferences | <code v-pre>{"prefs": {...}}</code>, same structure as in [Create or update a team](#create-or-update-a-team). To change the preferences of an existing team, prefer the dedicated [Team admin preferences](/reference/team_admin_preferences/) endpoints. |

**Response**

`200` with the updated [Team object](#the-team-object). `members` and `admins` are arrays of user `_id`s (not expanded).

**Errors**

| Status | When |
| --- | --- |
| `400` | The API key is not attached to an organization. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key and `team_id` is not one of the key's teams. |
| `404` | No team with this id in the organization of the API key. |
| `500` | The team has no `extid`, `team_id` is not a valid id, a user reference holds a malformed id, or unexpected server error. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "Sales Paris 14",
    "tags": ["sales", "paris-14"]
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris 14",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "level_name": "agency",
  "tags": ["sales", "paris-14"],
  "public": false,
  "members": ["5f1e9b2a8c4d3e0012345601", "5f1e9b2a8c4d3e0012345602"],
  "admins": ["5f1e9b2a8c4d3e0012345601"],
  "admin_preference": "5f1e9b2a8c4d3e00123456bb",
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

### Delete a team

`DELETE /v2/teams/:team_id`

Deletes a team of the organization. The users themselves are not deleted and stay in the organization.

Side effects: the booking pages and appointment types attached to the team are **deactivated** and detached from the team, so the team can no longer be booked through them. Events already booked are not modified. No email is sent.

The deletion cannot be undone. Re-creating a team with the same `extid` creates a new team with a new `_id`.

**Key scope:** organization, team (only for the teams of the key)

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the team. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the plain text body `OK` (not JSON). The same answer is returned when no team with this id exists in the organization: the call is idempotent and does not tell whether a team was actually deleted.

**Errors**

| Status | When |
| --- | --- |
| `400` | The API key is not attached to an organization. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key and `team_id` is not one of the key's teams. |
| `500` | `team_id` is not a valid id, or unexpected server error. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY'
```

```
OK
```

### Add members to a team

`POST /v2/teams/:team_id/members`

Adds one or several users to the `members` of the team (bookable users). Existing members are kept; users who are already members are left unchanged (no duplicate). The `admins` list is not modified.

Users are given as [user references](#user-references). References that match no user of the organization are silently dropped.

**Key scope:** organization

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the team. |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `members` | array of [user references](#user-references) | yes | - | Users to add to the team. Must contain at least one element. |

**Response**

`200` with the [Team object](#the-team-object) after the change. Each entry of `members` and `admins` is expanded to a [Team user object](#the-team-user-object).

Exception: when none of the references could be resolved to a user of the organization, the answer is still `200`, the team is returned unchanged and `members` / `admins` are arrays of user `_id`s (not expanded).

**Errors**

| Status | When |
| --- | --- |
| `400` | `members` is missing or is an empty array. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The API key is not `organization` scoped. |
| `404` | No team with this id in the organization of the API key. |
| `500` | `team_id` is not a valid id, a user reference holds a malformed id, or unexpected server error. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/members' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "members": [
      {"_id": "5f1e9b2a8c4d3e0012345602"},
      {"email": "alex.martin@example.com"}
    ]
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "tags": ["sales", "paris"],
  "public": false,
  "members": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}},
    {"_id": "5f1e9b2a8c4d3e0012345602", "full_name": "John Smith", "emails": ["john.smith@example.com"], "calendars": {"google": false, "office365": true, "exchange": false, "icloud": false, "caldav": false, "zoho": false}},
    {"_id": "5f1e9b2a8c4d3e0012345604", "full_name": "Alex Martin", "emails": ["alex.martin@example.com"], "calendars": {"google": false, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "admins": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

### Remove a user from a team

`DELETE /v2/teams/:team_id/members/:member_id`

Removes a user from the team entirely: from `members` and, if the user is also an admin, from `admins`. It also works for an admin-only user (removed from `admins`). The user stays in the organization.

If this leaves the team without any admin, the first administrator of the organization becomes the team's admin.

**Key scope:** organization

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the team. |
| `member_id` | string | `_id` of the [user](/reference/users/) to remove. This is a user id; there is no separate "member" identifier. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the [Team object](#the-team-object) after the change (this `DELETE` returns a body). Each entry of `members` and `admins` is expanded to a [Team user object](#the-team-user-object).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The API key is not `organization` scoped. |
| `404` | No team with this id in the organization of the API key. |
| `500` | The user is neither a member nor an admin of the team, `team_id` is not a valid id, or unexpected server error. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/members/5f1e9b2a8c4d3e0012345602' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "tags": ["sales", "paris"],
  "public": false,
  "members": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "admins": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

### Make a user an admin of a team

`POST /v2/teams/:team_id/members/:member_id/admin`

Gives a user the **admin** role: the user is added to `admins` and, if not already there, to `members`. The user is therefore both bookable in the team and an administrator of it. Use [Make a user an admin-only of a team](#make-a-user-an-admin-only-of-a-team) for an administrator who must not be bookable.

The call is idempotent. A Vyte team calendar is added to the user's calendar list if they do not have one yet. No email is sent.

`member_id` must be the `_id` of a user of your organization.

**Key scope:** organization

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the team. |
| `member_id` | string | `_id` of the [user](/reference/users/) to make admin. The user does not need to be a member of the team beforehand. |

**Query parameters**

None.

**Request body**

None. Any body is ignored.

**Response**

`200` with the [Team object](#the-team-object) after the change. Each entry of `members` and `admins` is expanded to a [Team user object](#the-team-user-object).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The API key is not `organization` scoped. |
| `404` | No team with this id in the organization of the API key. |
| `500` | `team_id` or `member_id` is not a valid id, or unexpected server error. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/members/5f1e9b2a8c4d3e0012345602/admin' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "tags": ["sales", "paris"],
  "public": false,
  "members": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}},
    {"_id": "5f1e9b2a8c4d3e0012345602", "full_name": "John Smith", "emails": ["john.smith@example.com"], "calendars": {"google": false, "office365": true, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "admins": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}},
    {"_id": "5f1e9b2a8c4d3e0012345602", "full_name": "John Smith", "emails": ["john.smith@example.com"], "calendars": {"google": false, "office365": true, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

### Remove the admin role of a user

`DELETE /v2/teams/:team_id/members/:member_id/admin`

`DELETE /v2/teams/:team_id/members/:member_id/admin-only` (alias: same behaviour, whichever way the admin role was given)

Removes a user from the `admins` of the team. The `members` list is **not** modified:

- a user who was an admin (member + admin) stays a member of the team and remains bookable;
- a user who was admin-only is no longer related to the team at all.

To remove a user from both lists at once, use [Remove a user from a team](#remove-a-user-from-a-team).

The call is idempotent: it succeeds even when the user is not an admin of the team. If it leaves the team without any admin, the first administrator of the organization becomes the team's admin.

**Key scope:** organization

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the team. |
| `member_id` | string | `_id` of the [user](/reference/users/) losing the admin role. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the [Team object](#the-team-object) after the change (this `DELETE` returns a body). Each entry of `members` and `admins` is expanded to a [Team user object](#the-team-user-object).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The API key is not `organization` scoped. |
| `404` | No team with this id in the organization of the API key. |
| `500` | `team_id` is not a valid id, or unexpected server error. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/members/5f1e9b2a8c4d3e0012345602/admin' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "tags": ["sales", "paris"],
  "public": false,
  "members": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}},
    {"_id": "5f1e9b2a8c4d3e0012345602", "full_name": "John Smith", "emails": ["john.smith@example.com"], "calendars": {"google": false, "office365": true, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "admins": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

### Make a user an admin-only of a team

`POST /v2/teams/:team_id/members/:member_id/admin-only`

Gives a user the **admin-only** role: the user is added to `admins` and, if they were a member, **removed from `members`**. The user administers the team (and receives the admin notifications) but is no longer bookable in it: no team booking is assigned to them and they are not part of the team's availability, events listing and reports.

The call is idempotent. No email is sent.

`member_id` must be the `_id` of a user of your organization.

**Key scope:** organization

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the team. |
| `member_id` | string | `_id` of the [user](/reference/users/) to make admin-only. The user does not need to be a member of the team beforehand. |

**Query parameters**

None.

**Request body**

None. Any body is ignored.

**Response**

`200` with the [Team object](#the-team-object) after the change. Each entry of `members` and `admins` is expanded to a [Team user object](#the-team-user-object).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The API key is not `organization` scoped. |
| `404` | No team with this id in the organization of the API key. |
| `500` | `team_id` or `member_id` is not a valid id, or unexpected server error. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/members/5f1e9b2a8c4d3e0012345605/admin-only' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "extid": "sales-paris",
  "organization": "5f1e9b2a8c4d3e00123456aa",
  "tags": ["sales", "paris"],
  "public": false,
  "members": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "admins": [
    {"_id": "5f1e9b2a8c4d3e0012345601", "full_name": "Jane Doe", "emails": ["jane.doe@example.com"], "calendars": {"google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}},
    {"_id": "5f1e9b2a8c4d3e0012345605", "full_name": "Sam Manager", "emails": ["sam.manager@example.com"], "calendars": {"google": false, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false}}
  ],
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

### Retrieve the public view of a team

`GET /v2/teams/:team_id/public`

Returns a minimal, public description of a team: its name and, for each member, the first name, last name and picture. It is meant to be called without an API key, typically from a public page or a booking widget that lets a visitor see or choose who they can book.

It only works for teams whose `public` field is `true`. `public` is `false` by default and cannot be changed through the v2 API (it is set from the Vyte application). For any other team the endpoint answers `404`, exactly as if the team did not exist.

Only `members` are listed. Admin-only users are not exposed. No email address is exposed.

**Key scope:** none. No API key is required; if one is sent it is ignored.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | `_id` of the team. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with a JSON object holding exactly these fields:

| Field | Type | Description |
| --- | --- | --- |
| `_id` | string | `_id` of the team. |
| `name` | string | Name of the team. |
| `members[]` | array of object | The members of the team. |
| `members[]._id` | string | `_id` of the user. |
| `members[].first_name` | string | First name of the user. Absent when not set. |
| `members[].last_name` | string | Last name of the user. Absent when not set. |
| `members[].picture_url` | string | URL of the user's picture. Absent when not set. |

**Errors**

| Status | When |
| --- | --- |
| `404` | No team with this id, or the team is not public. |
| `500` | `team_id` is not a valid id, or unexpected server error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/public'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales Paris",
  "members": [
    {
      "_id": "5f1e9b2a8c4d3e0012345601",
      "first_name": "Jane",
      "last_name": "Doe",
      "picture_url": "https://example.com/pictures/jane.jpg"
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345602",
      "first_name": "John",
      "last_name": "Smith"
    }
  ]
}
```

## Notes and caveats

- **`POST /v2/teams` is an upsert and always answers `201`.** The status code does not tell whether the team was created or updated. Compare `_id` / `createdAt` if you need to know.
- **`extid` is the identity of a team for the API.** It is required to create a team, it is what makes creation idempotent, and a team without `extid` cannot be updated with `PUT /v2/teams/:team_id`. Choose stable values, unique within your organization, and never send a different `extid` in a `PUT`.
- **Lists are replaced, not merged, by create/update.** `members`, `admins` and `tags` sent to `POST /v2/teams`, `POST /v2/teams/batch` or `PUT /v2/teams/:team_id` replace the existing lists. Use the member / admin endpoints for incremental changes.
- **Unknown users are dropped silently.** A user reference that matches nobody in the organization never produces an error. Compare the returned `members` / `admins` with what you sent.
- **Two representations of `members` / `admins`.** List, create, batch and update return arrays of user ids. Retrieve and the member / admin management endpoints return expanded [Team user objects](#the-team-user-object). The one exception is `POST /v2/teams/:team_id/members` when no reference could be resolved (ids, team unchanged).
- **`admins` and `members` are independent in create/update.** Listing a user only in `admins` makes them admin-only. The `/admin` endpoint, on the contrary, also adds the user to `members`; the `/admin-only` endpoint removes them from `members`.
- **A team is never left without an admin.** Whenever a save would leave `admins` empty, the first administrator of the organization is set as admin.
- **`:member_id` is a user `_id`.** There is no separate member identifier.
- **`DELETE` endpoints return a body.** Deleting a team returns the plain text `OK` (also when the team does not exist); removing a member or an admin returns the updated team as JSON.
- **Removing a user who is not in the team is an error.** `DELETE /v2/teams/:team_id/members/:member_id` answers `500` when the user is neither a member nor an admin, whereas removing the admin role is idempotent.
- **Validation errors are reported as `500`** on several of these endpoints (missing `name` / `extid`, malformed ids). Validate your payloads before sending them and do not rely on the error body.
- **System-managed teams.** The list of teams can contain teams that Vyte created automatically for your organization. Do not update or delete teams you did not create.
- **No pagination** on `GET /v2/teams`.
- **Deleting a team deactivates its booking pages.** Detach or reassign them beforehand if they must stay online.
- **Team-wide operations** (book with a team, list the events of the members, set the availabilities of the members, reports) are documented in [Events](/reference/events/), [Availabilities](/reference/availabilities/) and [Reports](/reference/reports/).
