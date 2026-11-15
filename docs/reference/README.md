---
{ "pageClass": "reference-page" }
---

# Introduction

::::: panel

:::: left
We provide a full [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer) to allow developers to integrate Vyte into their application: provision the users and teams of an organization, configure their availability and booking pages, compute free slots, create and manage bookings, and be notified of changes through webhooks.

Each page of this reference covers one resource: the object model first, then every endpoint with its parameters, responses, errors and an example. The rules on this page (authentication, API key scopes, formats) apply to every endpoint and are not repeated in the resource pages. Errors are described in [Errors](./errors.md), and [Endpoint index](./endpoints.md) lists every endpoint with the key scopes it accepts.

::: warning
The V2 of the API is in beta mode. Feel free to contact us via <intercom-button /> or via email at [support@vyte.in](mailto:support@vyte.in) if you find a problem or have any suggestions.
:::

::::

:::: right
> BASE URL

``` url
https://api.vyte.in/v2
```

::::

:::::

## Quick start

```bash
# 1. Check your key
curl 'https://api.vyte.in/v2/auth/test' --header 'Authorization: YOUR_API_KEY'

# 2. List the users of your organization
curl 'https://api.vyte.in/v2/users' --header 'Authorization: YOUR_API_KEY'

# 3. Find free 30 minute slots for a user
curl 'https://api.vyte.in/v2/slots?duration=30&users=USER_ID&from=2026-11-20&to=2026-11-27&timezone=Europe/Paris' \
  --header 'Authorization: YOUR_API_KEY'
```

## Core concepts

| Concept | Meaning | Reference |
|---|---|---|
| Organization | The account of a company on Vyte. An API key belongs to one organization and only reaches its data. | [Conventions](./README.md) |
| User | A person of the organization who can be booked and who owns calendars, availabilities and booking pages. | [Users](./users.md) |
| Team | A group of users of the organization. A team can have its own booking page where a booking is assigned to one of its members. | [Teams](./teams.md) |
| Availability | The weekly opening hours and booking rules of a user (when they accept to be booked). | [Availabilities](./availabilities.md) |
| Calendars | The external calendars (Google, Microsoft, ...) connected by a user. Their events make the user busy, and bookings are written to them. | [Calendars](./calendars.md) |
| Booking page ("Vyteme") | A public page, identified by a `nickname`, where visitors book a user or a team. | [Booking pages](./vytemes.md) |
| Appointment type | A kind of meeting offered on a booking page (duration, place, questions, rules), identified by a `handle`. | [Appointment types](./appointment-types.md) |
| Slot | A period during which the requested user(s) or team are free and bookable. | [Slots](./slots.md) |
| Event | A meeting: either a booking made through a booking page, or a group-scheduling poll. | [Events](./events.md) |
| Form template / Form | The questions asked when booking / the answers given for one event. | Form templates, Forms |
| Locator / Location | A "find a place near me" page listing the physical locations of an organization, each leading to a booking page. | [Locators](./locators.md), [Locations](./locations.md) |
| Webhook | An HTTPS callback fired by Vyte when something happens (event created, confirmed, cancelled, ...). | [Webhooks](./webhooks.md) |

See also [Vyteme or not Vyteme ?](#vyteme-or-not-vyteme) below for the two kinds of events.

## Typical integration flows

**Provision an organization**

1. Create users: [`POST /v2/users`](./users.md) or the batch variant.
2. Group them: [`POST /v2/teams`](./teams.md), then add members.
3. Set opening hours: [Availabilities](./availabilities.md).
4. Configure what can be booked: [Booking pages](./vytemes.md) and
   [Appointment types](./appointment-types.md).

**Book a meeting from your own interface**

1. Fetch free slots: [`GET /v2/slots`](./slots.md) for a user, several users or a team.
2. Create the booking: [`POST /v2/events`](./events.md) (one user) or
   [`POST /v2/teams/:team_id/events`](./events.md) (a team member is assigned).
3. Follow changes with [Webhooks](./webhooks.md); reschedule or cancel through
   [Events](./events.md).

**Keep your system in sync**

Register [Webhooks](./webhooks.md) for event creation, confirmation, update and cancellation
instead of polling [`GET /v2/events`](./events.md).

## Base URL and versioning

```
https://api.vyte.in/v2
```

- All endpoints documented here are served under the `/v2` prefix, over HTTPS only.
- The only exception is the browser redirect used to connect a Webex or Zoom account, which is
  not under `/v2` and is authenticated with a user token; see
  [Video conferencing](./video-conferencing.md).
- Paths are case sensitive. Do not add a trailing slash.

## Authentication

Every request is authenticated with an **API key**, unless an endpoint is explicitly marked
"public" in its own section (a public team view and the retrieval of a locator by handle).

Send the key **as is** in the `Authorization` header. There is no `Bearer` (or other) scheme
prefix.

```bash
curl --request GET 'https://api.vyte.in/v2/auth/test' \
  --header 'Authorization: YOUR_API_KEY'
```

| Way to send the key | Format | Notes |
|---|---|---|
| `Authorization` header (recommended) | `Authorization: YOUR_API_KEY` | Raw key, no prefix. |
| `api_key` query parameter | `?api_key=YOUR_API_KEY` | Accepted on every endpoint. Takes precedence over the header when both are present. Avoid it: URLs end up in logs and browser history. |

The key must be a plain string. A request without a key, with an unknown key, with a deactivated
key, or with a key that is not a plain string is answered with `401 Unauthorized` and an empty
body.

An API key gives access to the data of your organization. Treat it like a password: keep it
server side, never embed it in a web page, a mobile application or a public repository.

### Getting a key

API keys are created from the Vyte web application by an administrator of the organization, in
the organization settings (API key tab). You need an organization to use the API v2. Keys cannot
be created through the API.

### API key scopes

Each key has exactly one **scope**, fixed when the key is created. The scope decides which
users, teams and events the key can reach.

| Scope | Reach | Typical use |
|---|---|---|
| `organization` | Every user, team, booking page and event of the organization. Required by most endpoints that create, delete or reorganize resources. | Back-office integration, provisioning users and teams. |
| `team` | Only the teams attached to the key, the members of those teams, and the events of those members. | An integration delegated to one or several teams of a large organization. |
| `user` | Only the user who owns the key (while that user is a member of the organization). | Personal automation. |

Rules that apply everywhere:

- **Organization only endpoints.** When an endpoint section says "Key scope: organization", a
  key with another scope receives `403 Forbidden`.
- **Team scoped keys and `team_id`.** With a `team` scoped key, any `team_id` given in the path
  or in the JSON body must be one of the key's teams, otherwise the answer is `403 Forbidden`.
- **User ids in the path.** A `:user_id` path parameter must designate a member of the key's
  organization (for a `team` scoped key: a member of one of the key's teams; for a `user` scoped
  key: the key's own user). Otherwise the answer is `403 Forbidden`.
- **Events.** An event is reachable when the user it was created for (`created_by`) is within
  the key's reach as described above. Otherwise the answer is `403 Forbidden`.
- **Lists are filtered silently.** List endpoints only return what the key can reach; they do
  not fail when other data exists.

Each endpoint section carries a "Key scope" line listing the scopes it accepts.

### Testing a key

`GET /v2/auth/test`

Checks that a key is valid and returns the organization it belongs to. Accepted by every key
that carries an organization.

**Response** `200 OK` with the organization:

| Field | Type | Description |
|---|---|---|
| `_id` | string | Id of the organization. |
| `name` | string | Name of the organization. |
| `lang` | string | Default language of the organization (see [Languages](#languages)). |
| `domain` | string | Email domain attached to the organization, when one is set. |
| `admins` | string[] | Ids of the users who administer the organization. |
| `members` | string[] | Ids of all the users of the organization (administrators included). |
| `createdAt` | string (date-time) | Creation date. |
| `updatedAt` | string (date-time) | Last modification date. |

Responses may contain additional fields not listed here; they are internal, may change without
notice and must not be relied upon.

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Acme",
  "lang": "en",
  "admins": ["5f1e9b2a8c4d3e0012340001"],
  "members": ["5f1e9b2a8c4d3e0012340001", "5f1e9b2a8c4d3e0012340002"],
  "createdAt": "2025-01-14T09:12:44.000Z",
  "updatedAt": "2026-03-02T16:40:03.000Z"
}
```

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated key. |
| `404` | The organization of the key no longer exists. |

### Deactivating a key

`GET /v2/auth/key/deactivate`

Permanently deactivates **the key used to make the request**. Use it when a key may have leaked.
The effect is immediate and cannot be undone through the API: every later request made with
that key is answered with `401`. Create a replacement key from the web application.

Note that this endpoint uses the `GET` method although it changes state. Never call it from a
health check, a link preview or a crawler.

**Response** `200 OK` with the plain text body `API key deactivated`.

| Status | When |
|---|---|
| `401` | Missing, unknown or already deactivated key. |

## Requests

- Request bodies are JSON. Send `Content-Type: application/json`.
- The maximum size of a request body is 1 MB. Split larger batch operations into several calls.
- Query parameters holding a list are written as a comma separated string (for example
  `users=5f1e...01,5f1e...02`) unless the endpoint says otherwise. URL-encode values (an email address
  containing `+` must be sent as `%2B`).
- Booleans in query strings are the literal strings `true` and `false`.
- Unknown body fields are ignored, not rejected. A misspelled field therefore fails silently:
  compare the response with what you sent.
- `PUT` behaviour differs between resources: some endpoints update only the fields sent, others
  reset fields that are omitted, and several `POST` / `PUT` endpoints are "create or update"
  (upsert) operations keyed on an external id, a nickname or the owner. Each endpoint states its
  rule. When in doubt, read the resource, modify it, and send the complete object back. Arrays,
  when sent, replace the stored array as a whole.
- Several resources accept an `extid`: your own identifier for the resource. Sending the same
  `extid` again updates the existing resource instead of creating a duplicate, which makes
  provisioning calls safe to repeat.

## Responses

- Responses are JSON (`Content-Type: application/json`), except where an endpoint states another
  type (calendar files, report files, plain-text confirmations).
- A single resource is returned as a JSON object. Lists are returned either as a bare JSON array
  or wrapped in an object; each endpoint documents its exact shape.
- Responses may contain fields that are not documented. They are internal, may change without
  notice and must not be relied upon. Write clients that ignore unknown fields.
- Some endpoints answer with a status code only and an empty or plain text body (`OK`,
  `Created`, `Forbidden`...). Do not assume that every body parses as JSON; branch on the status
  code first.

### Identifiers

- Every resource has an `_id`: a string of 24 hexadecimal characters, for example
  `5f1e9b2a8c4d3e0012345678`. Some responses also expose the same value as `id`.
- A reference to another resource is its `_id` as a string, unless the endpoint documents that
  the referenced object is embedded.
- A malformed id in an event path (`/v2/events/:event_id...`) is answered with `400`. On other
  resources a malformed or unknown id is answered with `400`, `404` or `500` depending on the
  endpoint: always send well formed ids.
- Several resources also have a human readable handle (a booking page `nickname`, an appointment
  type `handle`, a locator `handle`). Handles are unique in their scope and appear in public
  booking URLs.

### Timestamps

Most resources carry two read-only fields maintained by Vyte. Note the camelCase spelling, which differs from the snake_case used by other fields. Nested objects may have their own dated fields with other names (for example `confirmed.updated_at` on an event); they are documented where they occur.

| Field | Type | Description |
|---|---|---|
| `createdAt` | string (date-time) | When the resource was created. |
| `updatedAt` | string (date-time) | When the resource was last modified. |

## Dates, times and time zones

| Kind of value | Format | Example |
|---|---|---|
| Instant (date and time) | ISO 8601 with a UTC designator or an offset. Responses use UTC with milliseconds. | `2026-11-20T14:30:00.000Z`, `2026-11-20T15:30:00+01:00` |
| Calendar day (date only, as used by `from` / `to` query parameters) | `YYYY-MM-DD`, interpreted in the time zone given by the `timezone` parameter of the same request | `2026-11-20` |
| Time of day (weekly availability slots) | Documented per resource; see [Availabilities](./availabilities.md) | |
| Duration | Integer number of **minutes**, unless stated otherwise | `30` |
| Time zone | IANA time zone name | `Europe/Paris`, `America/New_York`, `UTC` |

- Always send an explicit offset or `Z` with instants. An instant without offset is ambiguous.
- When an endpoint accepts a `timezone` parameter and you omit it, the time zone of the
  concerned user or resource is used when one is known. Pass it explicitly to get predictable
  results.
- A `timezone` value that is not an IANA `Area/Location` name (or `UTC`) is answered with `400`
  on the endpoints that validate it.

## Languages

Emails, notifications and public pages are localized. Language fields (`lang`, and `locale` when
present) take a two letter ISO 639-1 code among:

`de`, `en`, `es`, `fr`, `it`, `nl`, `pl`, `pt`, `sv`, `ru`

An unsupported or missing language falls back to English (`en`). A longer tag such as `fr-FR` is
reduced to its first two letters.

## Concurrency

Requests that modify the same event are processed one at a time, in arrival order. A request that
cannot obtain its turn in time fails with `500`; retry it after a short delay.

## Pagination

There is no global pagination scheme. List endpoints that can return large collections document
their own parameters (for example `limit` on events). Lists without such parameters return the
whole collection.

## Fair use

Keep request rates reasonable: run batch jobs sequentially or with low concurrency, prefer the
batch endpoints ([Users](./users.md), [Teams](./teams.md), [Availabilities](./availabilities.md),
[Appointment types](./appointment-types.md)) to loops of single calls, and use
[Webhooks](./webhooks.md) rather than polling to follow events.

## Cross-origin requests

The API is designed for server-to-server calls. Do not call it with an API key from a browser:
the key would be exposed to every visitor.

## Support

Questions and feature activation requests (some features are enabled per organization):
`support@vyte.in`.

## Vyteme or not Vyteme ?

There is, in the `Event` object, a boolean named `vyteme`. To understand clearly what it means, we have to present the two way of using Vyte.

> TL;DR: in an event, if `vyteme` is set to true, you are in the booking page use case and the `created_by.user` is the `id` of the user who owns the Vyte Page; on the contrary, the `created_by.user` will be the `id` of the user who has created the event.

::::: panel

:::: left
### Vyte as a smart group scheduling tool

The first use case of Vyte is to allow a group of people to decide on dates and/or places to meet.

The idea is that one person will **create an event** and **invite people** to this event. Then, these invitees will have **to agree on a date and a place** for this event.

::: danger
In this case, what we called the *creator* (the person corresponding to created_by.user) of the event is the Vyte user who create the event.
:::

*Example: I want to organize a meeting with all the dev team to speak about a new feature. I will create a new event and invite the all team. Then, we will be able to vote for a date and a place for the meeting, and everybody will be informed about where and when we meet once the event is confirmed. So here, the `created_by.user` is mine.*

::::

:::: right

![alt text](https://assets.website-files.com/5ae6992ba0a8293227bae459/5af64961147ee3482e3bb284_VyteGroup.svg "Smart group scheduling")

::::

:::::

::::: panel

:::: left

![alt text](https://assets.website-files.com/5ae6992ba0a8293227bae459/5afc11d3bb0a6959e21ab60f_VytePage.svg "Booking page")

::::

:::: right

### Vyte as a booking page

The seconde use case of Vyte is to present a user availabilties to someone who wants to meet with him. **This is what we call a Vyteme/Booking Page**.

In this case, if someone want to meet with me, I will provide them with the link of my *Vyteme Page*. He will be able to see my availabilities, pick one or several and create an event.

So, here comes the `vyteme` term. In the following documentation, when the `vyteme` key of an `Event` object is set to `true`, that means we are in this use case.

::: danger
Here is the tricky part. When an event is a Vyteme event, **the creator is the person who owns the Vyteme Page**.
:::

*Example: as a Sales of the company, I want to meet with a new customer to make a demo of our product. I will send to him the link of my Vyte Page. The customer will be able to book a meeting according to his availabilities. Here, the `created_by.user` is the `id` of the Sales.*

::::

:::::

### To sum up

Here is a table to sum up the differences in the `Event` object between the two use cases :

|        Use case        | `vyteme` |                  `created_by.user`                  |
|:----------------------:|:--------:|:----------------------------------------------:|
|      Booking page      |  `true`  | The `id` of the user who has the booking page. |
| Smart group scheduling |  `false` |   The `id` of the user who create the event.   |
