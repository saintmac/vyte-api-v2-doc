---
{ "pageClass": "reference-page" }
---

# Users

:::::panel

:::: left
A User is a person of your organization who can be booked on Vyte. A user owns
[calendars](/reference/calendars/), [availabilities](/reference/availabilities/),
[booking pages](/reference/vytemes/) and their [appointment types](/reference/appointment-types/), has
[preferences](/reference/user_preference/), and can be a member or an administrator of
[teams](/reference/teams/). The Users endpoints let a partner provision the members of its organization
(one by one or in batch), read them, update them, switch their product modules on and off,
change their email address, remove them from the organization, and obtain a short-lived token
that authenticates one user directly.

Authentication, API key scopes, formats and the general error model are described in
[Conventions](/reference/) and are not repeated here.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users" href="#list-users"></endpoint>
  <endpoint method="post" path="/v2/users" href="#create-or-update-a-user"></endpoint>
  <endpoint method="get" path="/v2/users/:user_id" href="#retrieve-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id" href="#update-a-user"></endpoint>
  <endpoint method="delete" path="/v2/users/:user_id" href="#remove-a-user-from-the-organization"></endpoint>
  <endpoint method="post" path="/v2/users/batch" href="#batch-create-or-update-users"></endpoint>
  <endpoint method="put" path="/v2/users/batch" href="#batch-create-or-update-users"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id/modules" href="#set-the-modules-of-a-user"></endpoint>
  <endpoint method="get" path="/v2/users/:user_id/email/update" href="#change-the-email-of-a-user"></endpoint>
  <endpoint method="get" path="/v2/users/:user_id/token" href="#get-a-token-to-authenticate-a-user"></endpoint>
</endpoints>
::::

:::::

## The User object

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string (24 hex characters) | no | Identifier of the user. This is the `:user_id` used in every path. |
| `first_name` | string | yes | First name. Leading and trailing spaces are removed. |
| `last_name` | string | yes | Last name. Leading and trailing spaces are removed. |
| `full_name` | string | no | Computed: `first_name` and `last_name` joined by a space (only one of them when the other is empty, an empty string when both are empty). |
| `emails` | array of strings | yes (through `user.email`) | Email addresses of the user, lowercased. In practice it holds one address; `emails[0]` is the primary email, used for notifications and sign-in. It is written with the singular body field `user.email`. |
| `language` | string | yes | Language of the user (ISO 639-1), used for emails and pages. Supported values: `de`, `en`, `es`, `fr`, `it`, `nl`, `pl`, `pt`, `ru`, `sv`. The value is stored as sent (not validated by these endpoints). No default is stored. See [Conventions](/reference/). |
| `timezone` | string | yes | Time zone of the user, as a TZ database name (for example `Europe/Paris`). Stored as sent. No default is stored. |
| `phone` | string | yes | Phone number of the user. |
| `phone_country` | string | yes | Country of the phone number, as a lowercase two-letter country code (for example `fr`). |
| `picture_url` | string | yes | URL of the user's picture. |
| `is_place` | boolean | yes | `true` when this user represents a bookable resource (a room, a place, a piece of equipment) instead of a person. |
| `force_ics` | boolean | yes | `true` to always attach a calendar invitation file (ICS) to the emails sent to this user, even when the user has a connected calendar. |
| `brand` | string (id) | yes | Identifier of the brand (custom branding) applied to this user. It must be a brand of your organization; any other value is silently ignored. |
| `calendars.google` | boolean | no | `true` when the user has connected a Google calendar. Default `false`. |
| `calendars.office365` | boolean | no | `true` when the user has connected a Microsoft 365 calendar. Default `false`. |
| `calendars.exchange` | boolean | no | `true` when the user has connected an Exchange calendar. Default `false`. |
| `calendars.icloud` | boolean | no | `true` when the user has connected an iCloud calendar. Default `false`. |
| `calendars.caldav` | boolean | no | `true` when the user has connected a CalDAV calendar. Default `false`. |
| `calendars.zoho` | boolean | no | `true` when the user has connected a Zoho calendar. Default `false`. |
| `modules.vyteme` | boolean | through [Set the modules](#set-the-modules-of-a-user) | Booking page enabled. Default `false`. Set to `true` automatically when the user is created or updated with a `vyteme` object. |
| `modules.vyteme_pro` | boolean | through [Set the modules](#set-the-modules-of-a-user) | Advanced booking page customization enabled. Default `false`. Set to `true` automatically when the user is created or updated with a `vyteme.custom` object. |
| `modules.availabilities` | boolean | through [Set the modules](#set-the-modules-of-a-user) | Custom availability rules enabled. Default `false`. Set to `true` automatically when the user is created or updated with an `availability` object. |
| `modules.brand` | boolean | through [Set the modules](#set-the-modules-of-a-user) | Custom branding enabled. Default `false`. |
| `modules.assistant` | boolean | through [Set the modules](#set-the-modules-of-a-user) | Assistant (delegation) enabled. Default `false`. |
| `modules.group_pro` | boolean | through [Set the modules](#set-the-modules-of-a-user) | Advanced group scheduling enabled. Default `false`. |
| `modules.team` | boolean | through [Set the modules](#set-the-modules-of-a-user) | Team features enabled. Default `false`. |
| `account.plan` | string | no | Plan of the user: `free` or `pro`. A member of an organization inherits the plan of the organization. Default `free`. |
| `account.app_url` | string | no | Base URL of the Vyte web application for this user, when your organization uses a custom (branded) domain. Absent otherwise. |
| `account.organization.id` | string (id) | no | Identifier of the organization the user belongs to. |
| `account.organization.name` | string | no | Name of that organization. |
| `account.organization.extid` | string | yes | External id: the identifier of this user in **your** system. Optional. It can be used instead of the Vyte id to target the user in [Create or update a user](#create-or-update-a-user). |
| `account.organization.admin` | boolean | no | `true` when the user is an administrator of the organization. May be absent. |
| `signedup_with` | string | no | How the account was created: `api` (created by [Create or update a user](#create-or-update-a-user)), `api_batch` (created by [Batch create or update users](#batch-create-or-update-users)), `email`, `google`, `office365`, or another sign-up channel name. |
| `created_by_org` | string (id) | no | Identifier of the organization that provisioned this user through the API. |
| `createdAt` | string (ISO 8601 date-time) | no | Creation date. Note the camelCase spelling on this resource. |
| `updatedAt` | string (ISO 8601 date-time) | no | Last modification date. Note the camelCase spelling on this resource. |
| `nickname` | string | no | Only in [List users](#list-users) with `populatevyteme=true`, and only for users who have a booking page: nickname of the user's [booking page](/reference/vytemes/). |
| `pageActive` | boolean | no | Only in [List users](#list-users) with `populatevyteme=true`, and only for users who have a booking page: whether that booking page is active. |
| `pagePlaces` | array of objects | no | Only in [List users](#list-users) with `populatevyteme=true`, and only for users who have a booking page: the fixed places configured on that booking page (see `custom.fixed_places` in [Booking pages](/reference/vytemes/)). |

Responses may contain additional fields not listed here; they are internal, may change without
notice and must not be relied upon.

Example:

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "first_name": "Jane",
  "last_name": "Doe",
  "full_name": "Jane Doe",
  "emails": ["jane.doe@example.com"],
  "language": "en",
  "timezone": "Europe/London",
  "phone": "+442071234567",
  "phone_country": "gb",
  "picture_url": "https://www.example.com/pictures/jane.png",
  "calendars": {
    "google": false,
    "office365": false,
    "exchange": false,
    "icloud": false,
    "caldav": false,
    "zoho": false
  },
  "modules": {
    "brand": false,
    "assistant": false,
    "vyteme": true,
    "vyteme_pro": true,
    "availabilities": true,
    "group_pro": false,
    "team": false
  },
  "account": {
    "plan": "pro",
    "app_url": "https://acme.example.com",
    "organization": {
      "id": "5f1e9b2a8c4d3e0012340000",
      "name": "ACME",
      "extid": "employee-1234"
    }
  },
  "signedup_with": "api",
  "created_by_org": "5f1e9b2a8c4d3e0012340000",
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-01-12T09:30:00.000Z"
}
```

## Endpoints

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/users` | [List users](#list-users) | organization, team, user |
| `POST` | `/v2/users` | [Create or update a user](#create-or-update-a-user) | organization |
| `GET` | `/v2/users/:user_id` | [Retrieve a user](#retrieve-a-user) | organization, team, user |
| `PUT` | `/v2/users/:user_id` | [Update a user](#update-a-user) | organization, team, user |
| `DELETE` | `/v2/users/:user_id` | [Remove a user from the organization](#remove-a-user-from-the-organization) | organization |
| `POST` | `/v2/users/batch` | [Batch create or update users](#batch-create-or-update-users) | organization |
| `PUT` | `/v2/users/batch` | Alias of `POST /v2/users/batch` (same behaviour) | organization |
| `PUT` | `/v2/users/:user_id/modules` | [Set the modules of a user](#set-the-modules-of-a-user) | organization, team, user |
| `GET` | `/v2/users/:user_id/email/update` | [Change the email of a user](#change-the-email-of-a-user) | organization, team, user |
| `GET` | `/v2/users/:user_id/token` | [Get a token to authenticate a user](#get-a-token-to-authenticate-a-user) | organization, team, user |

For every path containing `:user_id`: with an `organization` key the user must be a member of the
organization; with a `team` key the user must be a member of one of the key's teams; with a
`user` key it must be the key's own user. Otherwise the answer is `403`.

### List users

`GET /v2/users`

Returns the users the key can reach:

- `organization` key: every member of the organization (administrators included).
- `team` key: the members of the key's teams, without duplicates.
- `user` key: only the key's own user.

The response is a bare JSON array (not wrapped in an object). There is no pagination and no
filtering: all reachable users are returned in one response. The order of the array is not
guaranteed.

**Key scope:** organization, team, user

**Path parameters**

None.

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `populatevyteme` | string | no | not set | When exactly `true`, each user who has a [booking page](/reference/vytemes/) gets three extra fields: `nickname`, `pageActive` and `pagePlaces`. Users without a booking page are returned unchanged. Any other value is ignored. |

**Request body**

None.

**Response**

`200` with an array of [User objects](#the-user-object). An empty array when no user is
reachable.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user` key whose user is no longer a member of the organization. |
| `404` | The organization of the key no longer exists. |
| `500` | Unexpected error. |

**Example**

```bash
curl 'https://api.vyte.in/v2/users?populatevyteme=true' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345678",
    "first_name": "Jane",
    "last_name": "Doe",
    "full_name": "Jane Doe",
    "emails": ["jane.doe@example.com"],
    "language": "en",
    "timezone": "Europe/London",
    "calendars": { "google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false },
    "modules": { "brand": false, "assistant": false, "vyteme": true, "vyteme_pro": true, "availabilities": true, "group_pro": false, "team": false },
    "account": {
      "plan": "pro",
      "organization": { "id": "5f1e9b2a8c4d3e0012340000", "name": "ACME", "extid": "employee-1234" }
    },
    "signedup_with": "api",
    "createdAt": "2026-01-12T09:30:00.000Z",
    "updatedAt": "2026-01-12T09:30:00.000Z",
    "nickname": "acme-jane-doe",
    "pageActive": true,
    "pagePlaces": []
  }
]
```

### Create or update a user

`POST /v2/users`

Creates a user and adds it to your organization, or updates the user when it already exists
(upsert). The same call can also set up, in one request, the user's booking page, appointment
types, availability, preferences, teams, calendar connection and sign-in credentials.

#### How the user is identified

The target user is looked up in this order; the first criterion present in the body is the only
one used:

1. `user.account.organization.extid` (your external id): the user carrying this external id is
   updated.
2. `user.email` (a syntactically valid email address): the user having this email address is
   updated.

If no user matches, a new user is created and the answer is `201`. If a user matches, it is
updated and the answer is `200`. This makes the call idempotent as long as you send an `extid`
or an `email`.

If the body contains neither `user.account.organization.extid` nor a valid `user.email`, a new
user is created on every call (no deduplication is possible).

Changing the email of an existing user: when the user is matched by `extid` (or by id with
[Update a user](#update-a-user)) and `user.email` differs from the current primary email, the
email is replaced immediately, without a verification email - unless another user already has
that address, in which case the call fails with `500` and nothing is changed.

The booking page `nickname` is not an identifier of the user: it is only checked for
availability (see errors below).

#### What the call does

| Aspect | Behaviour |
|---|---|
| Organization membership | The user is added to the members of your organization if not already a member. Adding a member uses one seat of your subscription. The user takes the plan of the organization. |
| Emails | No email is sent to the user by this endpoint: no welcome email, no invitation. Use `finish_signup_with` to obtain a link that you deliver yourself. (The batch endpoint behaves differently, see [Batch create or update users](#batch-create-or-update-users).) |
| Booking page | Created or updated **only** when the body has a `vyteme` object, or when a `template_id` designates a template that has a booking page. Without it the user has no booking page. |
| Appointment types | Created or updated **only** together with a booking page, from `appointmentTypes` (or from the template). |
| Availability | The user's default availability is created or updated **only** when the body has an `availability` object or a `template_id`. Without it nothing is created at this point. |
| Preferences | Updated only when the body has a `user_preference` object or a `template_id`. |
| Teams | For each entry of `teams`, the team is created if needed and the user is added to it. |
| Modules | `modules.vyteme`, `modules.vyteme_pro` and `modules.availabilities` are switched on as described in [The User object](#the-user-object). |
| Sign-in | The user cannot sign in to Vyte until credentials exist: set them with `login`, or let the user choose a password through the `finish_signup_with` link, or authenticate the user with a [token](#get-a-token-to-authenticate-a-user). |

**Key scope:** organization

**Path parameters**

None.

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `organization` | string (id) | yes | - | Identifier of your organization. It must be the organization of the API key. |
| `user` | object | yes | - | Profile of the user. See the `user.*` rows. |
| `user.email` | string | no | - | Email address of the user (singular; stored as `emails[0]`). Lowercased. Used to find an existing user when no `extid` is sent. |
| `user.account.organization.extid` | string | no | - | Your identifier for this user. Used first to find an existing user. |
| `user.first_name` | string | no | - | First name. An empty value is ignored. |
| `user.last_name` | string | no | - | Last name. **On an update, omitting this field erases the stored last name**: resend it on every update. |
| `user.language` | string | no | - | Language, see [The User object](#the-user-object). |
| `user.timezone` | string | no | - | Time zone (TZ database name). |
| `user.phone` | string | no | - | Phone number. |
| `user.phone_country` | string | no | - | Country of the phone number (lowercase two-letter code). |
| `user.picture_url` | string | no | - | URL of the user's picture. |
| `user.is_place` | boolean | no | - | `true` when the user is a bookable resource and not a person. |
| `user.force_ics` | boolean | no | - | `true` to always attach a calendar invitation file to the emails sent to this user. Only `true` is taken into account. |
| `user.brand` | string (id) | no | - | Brand of your organization to apply to the user. A brand that does not belong to your organization is silently ignored. On an update, omitting it removes the user's brand. |
| `template_id` | string (id) | no | - | Identifier of a user template of your organization (user templates are configured by an administrator of the organization in Vyte). See [Creating from a template](#creating-from-a-template). |
| `nickname_postfix` | string | required when the template has a nickname prefix | - | End of the booking page nickname when creating from a template: the nickname is `<template prefix>-<nickname_postfix>`. |
| `finish_signup_with` | string | no | - | Only accepted value: `email` (the literal word, not an address). The response then contains `link`, a URL where the user chooses a password. Vyte does not send this link: deliver it to the user yourself. |
| `login` | object | no | - | Sets sign-in credentials for the user. |
| `login.credentials.username` | string | no | the user's primary email | Sign-in identifier. |
| `login.credentials.password` | string | yes when `login` is sent | - | Password. Write-only: it is never returned. |
| `vyteme` | object | no | - | Booking page to create or update for the user. Fields are those of a [booking page](/reference/vytemes/) (`nickname`, `message`, `custom.*`, ...). `nickname` must not be used by any existing booking page. When your organization has a brand, it is applied to the page. |
| `appointmentTypes` | array of objects | no | - | Appointment types to create or update on the booking page (only processed when a booking page is set by this call). Each entry must have a `handle`; an appointment type with the same `handle` on the page is updated, otherwise it is created. Other fields are those of an [appointment type](/reference/appointment-types/). Note the camelCase spelling. |
| `availability` | object | no | - | Default availability of the user. Fields are those of an [availability](/reference/availabilities/) (`timezone`, `days`, `today_as_busy`, `past_as_busy`, `days_after_as_busy`, `hours_before_as_busy`, `buffer_before`, `buffer_after`, `all_day_busy`, ...). In `days.<weekday>.slots[]`, `start_time` and `end_time` are read as local times in `availability.timezone`; only the time of day matters. |
| `user_preference` | object | no | - | Preferences to set on the user. Fields are those of [user preferences](/reference/user_preference/). |
| `teams` | array of objects | no | - | Teams the user must belong to. |
| `teams[].extid` | string | yes | - | Your identifier for the team. The team of your organization with this external id is used; it is created when it does not exist. |
| `teams[].name` | string | yes | - | Name of the team. The name of an existing team is overwritten with this value. |
| `teams[].admin` | boolean | no | `false` | `true`: the user becomes an administrator of the team. `false` or absent: the user is a plain member (and loses the administrator role on that team if it had it). |
| `teams[].level_name` | string | no | - | Label of the kind of team (for example `Agency`). |
| `teams[].private` | boolean | no | - | Privacy flag of the team, see [Teams](/reference/teams/). |
| `teams[].tags` | array of strings | no | - | Tags of the team, see [Teams](/reference/teams/). |
| `form` | object | no | - | Profile form answers of the user. |
| `form.form_template` | string (id) | yes when `form` is sent | - | Identifier of the form template. One form per user and form template: sending it again replaces `data`. |
| `form.data` | object | no | - | Answers, keyed by the `key` of the fields of the form template. |
| `calendars` | array of objects | no | - | Calendar accounts to connect for the user. Only Exchange is supported here; entries with another `source` are ignored. |
| `calendars[].source` | string | yes | - | `exchange`. |
| `calendars[].credentials.server` | string | yes | - | Exchange server host name. |
| `calendars[].credentials.username` | string | yes | - | Exchange user name. |
| `calendars[].credentials.password` | string | yes | - | Exchange password. Write-only: it is never returned. |

On an update, only the fields present are changed, with the exceptions flagged above
(`user.last_name`, `user.brand`) and the external id: **resend
`user.account.organization.extid` on every update of a user that has one**, otherwise the stored
external id is not preserved.

#### Creating from a template

When `template_id` is sent, the template of your organization is applied:

- Booking page: if the template has a booking page, the user gets a copy of it (all settings
  except the nickname) and a copy of its appointment types. A `vyteme` object sent in the body
  is then ignored. If the template has a nickname prefix, `nickname_postfix` is required and the
  nickname is `<prefix>-<nickname_postfix>`.
- Profile: profile fields of the template are used for the fields missing in `user`; values
  sent in `user` win.
- Availability and preferences: copied from the template. `availability` and `user_preference`
  objects sent in the body are ignored.
- Teams: the teams of the template replace `teams` sent in the body.
- Calendar: when the template has an organization-wide calendar connection, it is applied to the
  user.

`template_id` is only supported by `POST /v2/users`, not by `PUT /v2/users/:user_id`.

**Response**

`201` when a user was created, `200` when an existing user was updated. The body is an object:

| Field | Type | Description |
|---|---|---|
| `user` | object | The [User object](#the-user-object). |
| `finish_signup_with` | string | `email`. Present only when it was requested. |
| `link` | string | URL where the user chooses a password. Present only when `finish_signup_with` is `email`. It carries a personal secret: transmit it to that user only. |

**Errors**

| Status | When |
|---|---|
| `400` | `organization` is missing; or `user` is missing; or `template_id` does not match any template; or the template has a nickname prefix and `nickname_postfix` is missing. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key is not an `organization` key; or `organization` is not the organization of the key; or `template_id` belongs to another organization. |
| `404` | `template_id` is malformed; or the organization no longer exists. |
| `422` | `vyteme.nickname` is already used by a booking page. Retry with another nickname. This also happens when you resend the user's own current nickname: omit `vyteme` when you do not need to change the page. |
| `500` | The operation failed, for example: the new email is already used by another user; a team entry lacks `name` or `extid`; an appointment type lacks `handle`; a value is invalid (malformed email, ...); the organization cannot accept a new member (member limit of the organization or of its plan reached). The body is a text message. Part of the operation may already have been applied (see [Notes and caveats](#notes-and-caveats)). |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/users' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "organization": "5f1e9b2a8c4d3e0012340000",
    "user": {
      "email": "jane.doe@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "language": "en",
      "timezone": "Europe/London",
      "account": { "organization": { "extid": "employee-1234" } }
    },
    "finish_signup_with": "email",
    "vyteme": {
      "nickname": "acme-jane-doe",
      "message": "Book a meeting with me"
    },
    "availability": {
      "timezone": "Europe/London",
      "days": {
        "monday": {
          "enabled": true,
          "slots": [
            { "start_time": "2026-01-05T09:00", "end_time": "2026-01-05T12:30" },
            { "start_time": "2026-01-05T14:00", "end_time": "2026-01-05T18:00" }
          ]
        }
      }
    },
    "teams": [
      { "extid": "agency-london", "name": "London agency", "admin": false }
    ]
  }'
```

```json
{
  "finish_signup_with": "email",
  "link": "https://www.vyte.in/login/email/password/reset?email=jane.doe%40example.com&token=PERSONAL_SIGNUP_TOKEN",
  "user": {
    "_id": "5f1e9b2a8c4d3e0012345678",
    "first_name": "Jane",
    "last_name": "Doe",
    "full_name": "Jane Doe",
    "emails": ["jane.doe@example.com"],
    "language": "en",
    "timezone": "Europe/London",
    "calendars": { "google": false, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false },
    "modules": { "brand": false, "assistant": false, "vyteme": true, "vyteme_pro": false, "availabilities": true, "group_pro": false, "team": false },
    "account": {
      "plan": "pro",
      "organization": { "id": "5f1e9b2a8c4d3e0012340000", "name": "ACME", "extid": "employee-1234" }
    },
    "signedup_with": "api",
    "created_by_org": "5f1e9b2a8c4d3e0012340000",
    "createdAt": "2026-01-12T09:30:00.000Z",
    "updatedAt": "2026-01-12T09:30:00.000Z"
  }
}
```

### Retrieve a user

`GET /v2/users/:user_id`

Returns one user reachable by the key.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | Identifier of the user. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the [User object](#the-user-object) (not wrapped). The booking page fields
(`nickname`, `pageActive`, `pagePlaces`) are not available on this endpoint.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not reachable by the key (not a member of the organization, not a member of the key's teams, or not the key's own user). |
| `404` | The user no longer exists; or the organization no longer exists. |
| `500` | Unexpected error. |

**Example**

```bash
curl 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "first_name": "Jane",
  "last_name": "Doe",
  "full_name": "Jane Doe",
  "emails": ["jane.doe@example.com"],
  "language": "en",
  "timezone": "Europe/London",
  "calendars": { "google": false, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false },
  "modules": { "brand": false, "assistant": false, "vyteme": true, "vyteme_pro": false, "availabilities": true, "group_pro": false, "team": false },
  "account": {
    "plan": "pro",
    "organization": { "id": "5f1e9b2a8c4d3e0012340000", "name": "ACME", "extid": "employee-1234" }
  },
  "signedup_with": "api",
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-01-12T09:30:00.000Z"
}
```

### Update a user

`PUT /v2/users/:user_id`

Updates the user designated by `:user_id`. It behaves exactly like
[Create or update a user](#create-or-update-a-user) with the target user forced to `:user_id`:
the same body fields are accepted (profile, `vyteme`, `appointmentTypes`, `availability`,
`user_preference`, `teams`, `form`, `calendars`, `login`, `finish_signup_with`) and the same
side effects apply. Differences:

- The user is identified by the path only; `extid` and `email` are not used for matching.
- `template_id` and `nickname_postfix` are not supported.
- `organization` is optional with an `organization` or `user` key. It is **required** with a
  `team` key and must be the organization of the key.
- The answer is always `200` on success.

The update rules of `POST /v2/users` apply: omitting `user.last_name` erases the last name,
omitting `user.brand` removes the brand, and `user.account.organization.extid` must be resent to
be preserved. A different `user.email` replaces the primary email immediately unless it is
already used by another user (`500`).

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | Identifier of the user to update. |

**Query parameters**

None.

**Request body**

Same fields as [Create or update a user](#create-or-update-a-user), except `template_id` and
`nickname_postfix`.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `user` | object | yes | - | Profile fields to change. May contain only the fields to change (but see the rules above). |
| `organization` | string (id) | only with a `team` key | the organization of the key | Identifier of your organization. |

**Response**

`200` with an object `{ "user": <User object> }`, plus `finish_signup_with` and `link` when
`finish_signup_with` was sent.

**Errors**

| Status | When |
|---|---|
| `400` | `user` is missing; or `organization` is missing with a `team` key. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not reachable by the key; or `organization` is not the organization of the key. |
| `404` | The organization no longer exists. |
| `422` | `vyteme.nickname` is already used by a booking page (including the user's own current page). |
| `500` | The operation failed (same causes as for `POST /v2/users`). The body is a text message. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "user": {
      "first_name": "Jane",
      "last_name": "Smith",
      "timezone": "Europe/Paris",
      "account": { "organization": { "extid": "employee-1234" } }
    }
  }'
```

```json
{
  "user": {
    "_id": "5f1e9b2a8c4d3e0012345678",
    "first_name": "Jane",
    "last_name": "Smith",
    "full_name": "Jane Smith",
    "emails": ["jane.doe@example.com"],
    "language": "en",
    "timezone": "Europe/Paris",
    "calendars": { "google": false, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false },
    "account": {
      "plan": "pro",
      "organization": { "id": "5f1e9b2a8c4d3e0012340000", "name": "ACME", "extid": "employee-1234" }
    },
    "signedup_with": "api",
    "createdAt": "2026-01-12T09:30:00.000Z",
    "updatedAt": "2026-02-03T14:05:00.000Z"
  }
}
```

### Remove a user from the organization

`DELETE /v2/users/:user_id`

Removes the user from the members (and administrators) of your organization and frees its seat.
Depending on who owns the account, the account is then either kept or permanently deleted.

Step 1 - always:

- The user is removed from the organization.
- If the user has no other source of paid plan (it belongs to no other organization and has no
  subscription of its own): the account is downgraded to the `free` plan, its link to the
  organization and its branded application URL are cleared, the paid modules are switched off,
  its appointment types are deactivated, your brand is removed from its booking pages and it is
  removed from your teams.
- If the user keeps a paid plan from elsewhere: it is only removed from the teams of your
  organization.

Step 2 - permanent deletion, only when **both** conditions are true:

- the user belongs to no other organization, and
- your organization owns the account: it was created through this API by your organization
  (`created_by_org`), or its primary email is on the email domain of your organization.

In that case the account and all its data are permanently deleted: booking pages, appointment
types, availabilities, preferences, calendar connections, sign-in credentials, team memberships
and the events it created. This cannot be undone. In every other case the account continues to
exist outside your organization.

The last administrator of an organization cannot be removed.

**Key scope:** organization

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | Identifier of the user to remove. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with a body: the organization as it is after the removal (this DELETE does not answer
`204`).

| Field | Type | Description |
|---|---|---|
| `_id` | string (id) | Identifier of the organization. |
| `name` | string | Name of the organization. |
| `lang` | string | Language of the organization. |
| `admins` | array of strings (ids) | Identifiers of the administrators. |
| `members` | array of objects | Remaining members, each reduced to the fields below. |
| `members[]._id` | string (id) | Identifier of the member. |
| `members[].full_name` | string | Full name. |
| `members[].emails` | array of strings | Email addresses. |
| `members[].picture_url` | string | Picture URL. |
| `members[].account.plan` | string | `free` or `pro`. |
| `members[].calendars` | object | Connected calendar flags, as in [The User object](#the-user-object). |
| `members[].nickname` | string | Booking page nickname, for members who have a booking page. |
| `members[].pageActive` | boolean | Whether that booking page is active, for members who have one. |
| `members[].pagePlaces` | array of objects | Fixed places of that booking page, for members who have one. |
| `createdAt` | string (ISO 8601 date-time) | Creation date of the organization. |
| `updatedAt` | string (ISO 8601 date-time) | Last modification date of the organization. |

Responses may contain additional fields not listed here; they are internal, may change without
notice and must not be relied upon.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key is not an `organization` key; or the user is not a member of the organization. |
| `404` | The organization no longer exists. |
| `500` | The removal failed, in particular when the user is the only administrator of the organization. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012340000",
  "name": "ACME",
  "lang": "en",
  "admins": ["5f1e9b2a8c4d3e0012345600"],
  "members": [
    {
      "_id": "5f1e9b2a8c4d3e0012345600",
      "full_name": "John Admin",
      "emails": ["john.admin@example.com"],
      "picture_url": "https://www.example.com/pictures/john.png",
      "account": { "plan": "pro" },
      "calendars": { "google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false },
      "nickname": "acme-john",
      "pageActive": true,
      "pagePlaces": []
    }
  ],
  "createdAt": "2025-09-01T08:00:00.000Z",
  "updatedAt": "2026-02-03T14:10:00.000Z"
}
```

### Batch create or update users

`POST /v2/users/batch`

`PUT /v2/users/batch` is an alias: same handler, same behaviour, same response.

Creates or updates several users in one call. Each entry of `users` is processed like
[Create or update a user](#create-or-update-a-user) (same identification by `extid` then
`email`, same upsert rules, same organization membership), after being merged with the shared
`defaults`. Users are processed one after the other, in the order of the array. Users created
this way have `signedup_with` = `api_batch`.

Differences with the single endpoint:

- **Emails are sent by default.** Each user newly added to the organization receives an email
  telling them they have joined the organization, signed by an administrator of the
  organization (and including the welcome message of the organization when one is configured).
  Send `opts.notify: false` to send nothing. Users who were already members receive nothing.
- Booking page nicknames are built as `defaults.vyteme.nickname_prefix` immediately followed by
  the user's `vyteme.nickname` (no separator is added).
- Per-user appointment types are sent in `users[].user.appointment_types` (snake_case, inside
  `user`), and merged by `handle` with `defaults.appointment_types`.
- `form`, `user_preference`, `finish_signup_with` and `template_id` are not supported.
- The response does not contain the users.

**Key scope:** organization

**Path parameters**

None.

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `organization` | string (id) | yes | - | Identifier of your organization. It must be the organization of the API key. |
| `users` | array of objects | yes | - | One entry per user. |
| `users[].user` | object | yes | - | Profile of the user: same `user.*` fields as in [Create or update a user](#create-or-update-a-user) (`email`, `account.organization.extid`, `first_name`, `last_name`, `language`, `timezone`, `phone`, `phone_country`, `picture_url`, `is_place`, `force_ics`, `brand`). Each field overrides the same field of `defaults.user`. |
| `users[].user.appointment_types` | array of objects | no | - | Appointment types of this user's booking page, each with a `handle`. An entry with the same `handle` as an entry of `defaults.appointment_types` is merged over it (the user's fields win); other entries are added. Only processed when the user has a `vyteme` object. |
| `users[].vyteme` | object | no | - | Booking page of the user, merged over `defaults.vyteme` (and `users[].vyteme.custom` over `defaults.vyteme.custom`). Requires `defaults.vyteme.nickname_prefix`. Without this object no booking page is created for that user, even if `defaults.vyteme` is set. |
| `users[].vyteme.nickname` | string | yes when `vyteme` is sent | - | End of the nickname. The final nickname is `defaults.vyteme.nickname_prefix` + this value. It must be unique within the batch and the final nickname must not be used by any existing booking page. |
| `users[].availability` | object | no | - | Default availability of the user, merged over `defaults.availability` (top-level fields only). Same rules as in the single endpoint. When `defaults.availability` is set, every user gets an availability even without this object. |
| `users[].teams` | array of objects | no | - | Teams of the user: same `teams[]` fields as in the single endpoint (`extid` and `name` required, `admin`, `level_name`, `private`, `tags`). Each entry is merged over `defaults.team`. |
| `users[].calendars` | array of objects | no | - | Exchange calendar accounts to connect, as in the single endpoint. |
| `users[].login` | object | no | - | Sign-in credentials of the user, as in the single endpoint (`login.credentials.username`, `login.credentials.password`). |
| `defaults` | object | no | `{}` | Values shared by all the users of the batch. |
| `defaults.user` | object | no | `{}` | Default profile fields (typically `language`, `timezone`). |
| `defaults.availability` | object | no | - | Default availability fields. |
| `defaults.vyteme` | object | no | - | Default booking page fields (`message`, `custom.*`, ...). |
| `defaults.vyteme.nickname_prefix` | string | yes as soon as one user has `vyteme.nickname` | - | Prefix of every booking page nickname of the batch. Include the separator you want in it (for example `acme-`). |
| `defaults.appointment_types` | array of objects | no | - | Appointment types given to every user who has a `vyteme` object, each with a `handle`. |
| `defaults.team` | object | no | - | Default fields for every `users[].teams[]` entry (typically `level_name`). |
| `opts` | object | no | `{ "notify": true }` | Processing options. When `opts` is sent, options left out are `false`: sending `opts: {}` disables the notification. |
| `opts.notify` | boolean | no | `true` when `opts` is absent, `false` when `opts` is sent without it | Send the "you have joined the organization" email to each user newly added to the organization. |
| `opts.ask_password_set` | boolean | no | `false` | When `true`, the notification email is always sent (whatever `opts.notify`) and contains a personal link where the user chooses a password. |

**Response**

`201` with an empty JSON object `{}`, whether users were created or updated. To get the ids of
the users, call [List users](#list-users) afterwards and match on `emails` or
`account.organization.extid`.

**Errors**

| Status | When |
|---|---|
| `400` | `organization` is missing; or `users` is missing; or a user has `vyteme.nickname` while `defaults.vyteme.nickname_prefix` is missing; or two users of the batch have the same `vyteme.nickname`. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key is not an `organization` key; or `organization` is not the organization of the key. |
| `404` | The organization no longer exists. |
| `422` | One of the final nicknames (prefix + nickname) is already used by a booking page. Nothing has been created. |
| `500` | The processing of one user failed (same causes as for `POST /v2/users`), or an entry of `users` has no `user` object. Processing stops at the first failure: **the users placed before it in the array have already been created or updated**, the following ones have not. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/users/batch' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "organization": "5f1e9b2a8c4d3e0012340000",
    "opts": { "notify": false },
    "defaults": {
      "user": { "language": "en", "timezone": "Europe/London" },
      "availability": {
        "timezone": "Europe/London",
        "past_as_busy": true,
        "days_after_as_busy": 60,
        "buffer_before": 10,
        "buffer_after": 10
      },
      "vyteme": {
        "nickname_prefix": "acme-",
        "message": "Book a meeting with your advisor",
        "custom": { "duration": 30, "ask_phone": true }
      },
      "team": { "level_name": "Agency" }
    },
    "users": [
      {
        "user": {
          "email": "jane.doe@example.com",
          "first_name": "Jane",
          "last_name": "Doe",
          "account": { "organization": { "extid": "employee-1234" } }
        },
        "vyteme": { "nickname": "jane-doe" },
        "teams": [ { "extid": "agency-london", "name": "London agency", "admin": true } ]
      },
      {
        "user": {
          "email": "john.smith@example.com",
          "first_name": "John",
          "last_name": "Smith",
          "account": { "organization": { "extid": "employee-5678" } }
        },
        "vyteme": { "nickname": "john-smith" },
        "teams": [ { "extid": "agency-london", "name": "London agency", "admin": false } ]
      }
    ]
  }'
```

```json
{}
```

### Set the modules of a user

`PUT /v2/users/:user_id/modules`

Switches product modules on or off for a user. Only the modules present in the body are changed.
A module can only be set (to `true` or to `false`) when the plan of the user allows it:

| Module | Meaning | Plans allowed | Side effect |
|---|---|---|---|
| `vyteme` | Booking page | `free`, `pro` | Activates (`true`) or deactivates (`false`) the user's booking page. |
| `vyteme_pro` | Advanced booking page customization | `pro` | None. |
| `availabilities` | Custom availability rules | `pro` | None. |
| `brand` | Custom branding | `pro` | Activates or deactivates the user's brand. |
| `assistant` | Assistant (delegation) | `pro` | Activates or deactivates the user's assistant. |
| `group_pro` | Advanced group scheduling | `pro` | None. |
| `team` | Team features | `pro` | None. |

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | Identifier of the user. |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `modules` | object | yes | - | Map of module name to boolean. Allowed names: `vyteme`, `vyteme_pro`, `availabilities`, `brand`, `assistant`, `group_pro`, `team`. Modules left out are unchanged. |

**Response**

`200` with the plain text body `OK` (not JSON). Call [Retrieve a user](#retrieve-a-user) to read
the resulting `modules`.

**Errors**

| Status | When |
|---|---|
| `400` | `modules` is missing. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not reachable by the key; or one of the modules is not allowed by the plan of the user. In that case the modules placed before it in the body may already have had their side effect, but no module value is saved. |
| `404` | The organization no longer exists. |
| `500` | A module name is unknown; or unexpected error. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/modules' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{ "modules": { "vyteme": true, "availabilities": true } }'
```

```
OK
```

### Change the email of a user

`GET /v2/users/:user_id/email/update`

Starts a verified change of the user's primary email. Despite being a `GET`, this call has side
effects: Vyte sends a verification email to the **new** address, in the language of the user,
containing a confirmation link. The email of the user is **not** changed by this call: it is
replaced only when the recipient opens the link. Until then the User object still shows the
former address. Once confirmed, the new address replaces the former one for notifications and
sign-in (an existing password is kept).

To change an email immediately, without verification, send `user.email` with
[Update a user](#update-a-user) instead.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | Identifier of the user. |

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `new_email` | string | yes | - | The new email address. URL-encode it. |

**Request body**

None.

**Response**

`200` with the plain text body `Email updated` (not JSON). It means the verification email has
been sent, not that the address has changed.

**Errors**

| Status | When |
|---|---|
| `400` | `new_email` is missing. Plain text body. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | Plain text body `taken`: the address is already the email of this user or of another Vyte account. Without that body: the user is not reachable by the key. |
| `404` | The user or the organization no longer exists. |
| `500` | Unexpected error. |

**Example**

```bash
curl 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/email/update?new_email=jane.smith%40example.com' \
  --header 'Authorization: YOUR_API_KEY'
```

```
Email updated
```

### Get a token to authenticate a user

`GET /v2/users/:user_id/token`

Returns a short-lived token that authenticates one user of your organization directly, without
that user typing a password. It is meant for integrations where your product has already
authenticated the person and wants to act in Vyte as that user (for example to open the Vyte
experience of that user from your own application) without exposing your API key to a browser.

How to use it:

- Call this endpoint from your **server** with your API key, each time you need a token.
- Give the token to the client acting for that user. The client presents it to Vyte either in
  the header `Authorization: Bearer <token>` or in the query parameter `token=<token>`.
- A request carrying the token is treated as made by that user, with that user's own rights
  only. The token does not replace an API key: the `/v2` endpoints of this reference still
  require an API key in the `Authorization` header (without `Bearer`).
- The token expires **1 hour** after it is issued; `exp` gives the exact instant. It cannot be
  refreshed: request a new one. Calling the endpoint again returns a new token and does not
  invalidate the previous ones.
- Treat the token like a password of that user for its lifetime: never log it, never put it in
  a URL that can be shared, and deliver it only to that user's session.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | Identifier of the user to authenticate. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with an object:

| Field | Type | Description |
|---|---|---|
| `token` | string | The token (an opaque string for the client). |
| `exp` | number | Expiry instant, as a Unix timestamp in **milliseconds** (1 hour after the call). |

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not reachable by the key (not a member of the organization, not a member of the key's teams, or not the key's own user). |
| `404` | The user or the organization no longer exists. |
| `500` | Unexpected error. |

**Example**

```bash
curl 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/token' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "token": "USER_TOKEN",
  "exp": 1768212600000
}
```

## Notes and caveats

- **`POST /v2/users` is an upsert.** `201` means created, `200` means an existing user was
  updated. Always send `user.account.organization.extid` and/or `user.email`, otherwise each
  call creates a new user.
- **Matching order.** `PUT /v2/users/:user_id` matches by id. `POST /v2/users` and the batch
  endpoint match by `extid` when it is sent, and by `email` only when no `extid` is sent. Keep
  your external ids unique and stable.
- **Fields to resend on every update:** `user.last_name` (omitting it erases the last name),
  `user.brand` (omitting it removes the brand) and `user.account.organization.extid` (omitting
  it does not preserve the external id).
- **`email` vs `emails`.** The request field is `user.email` (string); the response field is
  `emails` (array).
- **Timestamps are `createdAt` / `updatedAt`** (camelCase) on users and on the organization
  returned by `DELETE`.
- **No emails on single creation, emails on batch creation.** `POST /v2/users` and
  `PUT /v2/users/:user_id` never email the user. `POST|PUT /v2/users/batch` emails every newly
  added member unless `opts.notify` is `false`.
- **A booking page and an availability are not created implicitly.** They are created only when
  `vyteme` / `availability` (or a template) are part of the call. They can also be managed
  later with [Booking pages](/reference/vytemes/) and [Availabilities](/reference/availabilities/).
- **Booking page nicknames are global.** A nickname must be unique across all of Vyte, not only
  within your organization; prefix it with something specific to your organization. Resending
  an unchanged `vyteme.nickname` for an existing user is rejected with `422`.
- **Nickname composition differs.** With a template: `<template prefix>-<nickname_postfix>`
  (a dash is inserted). In batch: `<defaults.vyteme.nickname_prefix><vyteme.nickname>` (nothing
  is inserted).
- **Creation is not transactional.** The user is saved first, then membership, booking page,
  appointment types, availability, preferences, teams, calendars and credentials are applied.
  When one of these steps fails the answer is `500` but the user and the other steps may
  already be saved. The call is safe to repeat after fixing the payload (identify the user by
  `extid` or `email`, and drop `vyteme` if the page was already created).
- **Batch is sequential and stops at the first failure**, without rolling back the users
  already processed, and answers `201 {}` without the users on success.
- **Teams sent in a user payload are upserted by `extid`**, and their `name` is overwritten.
  A team entry without `admin: true` removes the administrator role of the user on that team.
- **`DELETE` may permanently delete the account** (see
  [Remove a user from the organization](#remove-a-user-from-the-organization)): users created
  by your organization through the API, or whose email is on your organization's domain, and
  who belong to no other organization, are deleted with all their data, events included.
  Other users only leave the organization.
- **`DELETE` returns `200` with the organization** as body, not `204`.
- **Plain text bodies.** `PUT /v2/users/:user_id/modules` answers `OK`,
  `GET /v2/users/:user_id/email/update` answers `Email updated` / `taken`, and most `400`, `403`
  and `500` answers of the creation endpoints are text, not JSON. Rely on the status code.
- **`GET /v2/users/:user_id/email/update` is a `GET` with side effects** (it sends an email).
  Do not let crawlers, link previewers or retries call it.
- **No pagination on `GET /v2/users`.** The whole list is returned at once.
- **Member limits.** An organization can refuse new members (seat limit of the organization,
  limits of the free plan and of trials, limits applied to recently created organizations).
  The creation endpoints then answer `500` with an explanatory text.
