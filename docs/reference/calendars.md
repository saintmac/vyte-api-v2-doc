---
{ "pageClass": "reference-page" }
---

# Calendars

:::::panel

:::: left
Every Vyte [user](/reference/users/) has exactly one **calendar list**. It groups the user's **calendars** (one per connected calendar account: Google, Office 365, Exchange, CalDAV, iCloud, ICS feed, plus the built-in Vyte calendar and any [calendar of interest](/reference/calendar-of-interests/) added to the user). Each calendar contains **sub-calendars** (the individual agendas of that account, for example "Work" and "Personal"). The calendar list tells Vyte which sub-calendars make the user busy when availability is computed, which ones are displayed, and in which sub-calendar Vyte writes the events it creates. The Calendar events endpoint returns the content of the displayed sub-calendars over a period.

Authentication, key scopes, error format, dates and timezones are described in [conventions.md](/reference/).

Calendar accounts are connected by the user from Vyte (the provider's own consent / sign-in flow). The endpoints below read and configure calendars that are already connected; they do not connect a new account.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users/:user_id/calendars" href="#retrieve-the-calendars-of-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id/calendars" href="#update-the-calendars-of-a-user"></endpoint>
  <endpoint method="delete" path="/v2/users/:user_id/calendars/:calendar_id" href="#delete-a-calendar-of-a-user"></endpoint>
  <endpoint method="get" path="/v2/users/:user_id/calevents" href="#list-the-calendar-events-of-a-user"></endpoint>
</endpoints>
::::

:::::

## The Calendar list object

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `_id` | string (id) | no | Id of the calendar list. |
| `belongs_to` | string (id) | no | Id of the user who owns the calendar list. |
| `calendars[]` | array of Calendar | partly | Connected calendar accounts, see [The Calendar object](#the-calendar-object). Only `calendars[].subcalendars[].display` and `calendars[].subcalendars[].busy` are writable. |
| `default_calendar` | object | yes | Sub-calendar in which Vyte writes **confirmed** events of the user. Chosen automatically (primary writable sub-calendar of the primary account) when unset or invalid. |
| `default_calendar.source` | string | yes | `source` of the target calendar. |
| `default_calendar.calendar_id` | string | yes | `source_id` of the target calendar (not its `_id`). |
| `default_calendar.subcalendar_id` | string | yes | `source_id` of the target sub-calendar (not its `_id`). The sub-calendar must be `writable`. |
| `default_suggestions_calendar` | object | yes | Sub-calendar in which Vyte writes the **proposed dates** (options) of events that are not confirmed yet. Same three sub-fields as `default_calendar` (`source`, `calendar_id`, `subcalendar_id`). Chosen automatically when unset or invalid. |
| `sync_suggestions` | boolean | yes | Default `true`. When `true`, the proposed dates of the events the user **organizes** are written to the user's calendar. |
| `sync_suggestions_voted_only` | boolean | yes | Default `false`. When `true` (and `sync_suggestions` is `true`), only the proposed dates the user voted for are written. |
| `sync_invited_suggestions` | boolean | yes | Default `false`. When `true`, the proposed dates of the events the user is **invited to** are written to the user's calendar. |
| `sync_invited_suggestions_voted_only` | boolean | yes | Default `false`. When `true` (and `sync_invited_suggestions` is `true`), only the proposed dates the user voted for are written. |
| `watch_calendar` | boolean | yes | Default `false`. When `true`, Vyte watches the connected calendar (providers that support change notifications) and reflects on the Vyte event the changes the user makes directly in the calendar to an event created by Vyte (new date, new place, categories). |
| `category_occurred` | string | yes | Default `"occurred"`. Name of the calendar category that, when the user puts it on a Vyte event in the calendar, marks the Vyte event as having occurred. Requires `watch_calendar`. |
| `category_no_show` | string | yes | Default `"no_show"`. Name of the calendar category that, when the user puts it on a Vyte event in the calendar, marks the Vyte event as a no-show. Requires `watch_calendar`. |
| `never_add_invitees_to_calendar_events` | boolean | yes | Default `false`. When `true`, the calendar events Vyte writes in the user's calendar do not list the invitees as attendees. |
| `week_starts_on` | string | yes | First day of the week used when displaying the user's calendar. Values: `"Mon"`, `"Sun"`. No default (absent until set). The value is not validated. |
| `createdAt` | string (ISO 8601 date) | no | Creation date. |
| `updatedAt` | string (ISO 8601 date) | no | Last modification date. |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

### The Calendar object

One connected calendar account (or one built-in Vyte calendar).

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `_id` | string (id) | no | Id of the calendar. This is the `:calendar_id` used to delete it. |
| `name` | string | no | Display name. Usually the email address of the account; `"Vyte"` for the built-in calendar; the name of the calendar of interest for a calendar of interest. |
| `source` | string | no | Type of calendar, see [Calendar sources](#calendar-sources). |
| `source_id` | string | no | Identifier of the account at its source (account id or email for external providers, the user id for the Vyte calendar, the calendar of interest id for a calendar of interest). Together with `source` it identifies the calendar in update requests. |
| `primary` | boolean | no | Default `false`. `true` for the user's main calendar account. |
| `access_broken` | boolean | no | Default `false`. `true` when Vyte can no longer access the account (access revoked, password changed). The user must reconnect the account. While it is `true` the events of this account are not read, so they no longer make the user busy. |
| `subcalendars[]` | array of Sub-calendar | partly | Agendas of the account, see below. |

### The Sub-calendar object

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `_id` | string (id) | no | Id of the sub-calendar. |
| `name` | string | no | Name of the agenda, as defined at the provider. |
| `source` | string | no | Type of sub-calendar, see [Calendar sources](#calendar-sources). |
| `source_id` | string | no | Identifier of the agenda at its source. Together with `source` it identifies the sub-calendar in update requests, and it is the value expected in `default_calendar.subcalendar_id`. |
| `busy` | boolean | yes | When `true`, the events of this sub-calendar make the user unavailable: they are subtracted from the user's availability when free slots are computed. Cannot be changed on sub-calendars whose `source` is `vyte_team`. |
| `display` | boolean | yes | When `true`, the events of this sub-calendar are shown in the user's calendar view and returned by [List the calendar events of a user](#list-the-calendar-events-of-a-user). |
| `primary` | boolean | no | Default `false`. `true` for the main agenda of the account. |
| `writable` | boolean | no | `true` when Vyte can create events in this sub-calendar. Only writable sub-calendars can be used as `default_calendar` / `default_suggestions_calendar`. |
| `color_id` | string | no | Color identifier at the provider. |
| `bcolor` | string | no | Background color (hex, for example `"#c1defa"`). |
| `fcolor` | string | no | Foreground (text) color (hex). |

A sub-calendar discovered on an account that already had sub-calendars starts with `busy: false` and `display: false`: the user (or your integration) must opt it in.

### Calendar sources

| `source` | Found on | Meaning |
| --- | --- | --- |
| `google` | calendar, sub-calendar | Google Calendar account. |
| `office365` | calendar, sub-calendar | Microsoft 365 / Outlook account. |
| `exchange` | calendar, sub-calendar | Microsoft Exchange account. |
| `caldav` | calendar, sub-calendar | CalDAV account. |
| `icloud` | calendar, sub-calendar | Apple iCloud calendar. |
| `ics` | calendar, sub-calendar | Read-only ICS feed. |
| `vyte_user` | calendar, sub-calendar | Built-in Vyte calendar of the user (always the first calendar, named `"Vyte"`). As a sub-calendar (`"My Events"`): the confirmed Vyte events of the user. |
| `vyte_user_suggestions` | sub-calendar | Sub-calendar of the Vyte calendar (`"My Events OPTIONS"`): the proposed dates of the user's unconfirmed Vyte events. |
| `vyte_aptype` | sub-calendar | Sub-calendar of the Vyte calendar: the events booked on one of the user's appointment types (`source_id` is the appointment type id). |
| `vyte_team` | calendar, sub-calendar | Built-in calendar showing the events of the teams the user administers (`source_id` of a sub-calendar is the team id). Display only: `busy` cannot be set. |
| `vyte_calendar_of_interest` | calendar, sub-calendar | A [calendar of interest](/reference/calendar-of-interests/) added to the user (`source_id` of the calendar is the calendar of interest id; `source_id` of a sub-calendar is the id of the sub-calendar of interest). Read-only. |

Treat any other value as an external calendar account.

### Example

```json
{
  "_id": "5f1e9b2a8c4d3e0012345601",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "sync_suggestions": true,
  "sync_suggestions_voted_only": false,
  "sync_invited_suggestions": false,
  "sync_invited_suggestions_voted_only": false,
  "watch_calendar": false,
  "category_occurred": "occurred",
  "category_no_show": "no_show",
  "never_add_invitees_to_calendar_events": false,
  "default_calendar": {
    "source": "google",
    "calendar_id": "jane.doe@example.com",
    "subcalendar_id": "jane.doe@example.com"
  },
  "default_suggestions_calendar": {
    "source": "google",
    "calendar_id": "jane.doe@example.com",
    "subcalendar_id": "jane.doe@example.com"
  },
  "calendars": [
    {
      "_id": "5f1e9b2a8c4d3e0012345602",
      "name": "Vyte",
      "source": "vyte_user",
      "source_id": "5f1e9b2a8c4d3e0012345678",
      "primary": false,
      "access_broken": false,
      "subcalendars": [
        {
          "_id": "5f1e9b2a8c4d3e0012345603",
          "name": "My Events",
          "source": "vyte_user",
          "source_id": "5f1e9b2a8c4d3e0012345678",
          "display": true,
          "busy": true,
          "color_id": "d",
          "bcolor": "#c1defa",
          "fcolor": "#000000",
          "primary": false,
          "writable": false
        },
        {
          "_id": "5f1e9b2a8c4d3e0012345604",
          "name": "My Events OPTIONS",
          "source": "vyte_user_suggestions",
          "source_id": "5f1e9b2a8c4d3e0012345678",
          "display": true,
          "busy": true,
          "color_id": "d",
          "bcolor": "#c1defa",
          "fcolor": "#000000",
          "primary": false,
          "writable": false
        }
      ]
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345605",
      "name": "jane.doe@example.com",
      "source": "google",
      "source_id": "jane.doe@example.com",
      "primary": true,
      "access_broken": false,
      "subcalendars": [
        {
          "_id": "5f1e9b2a8c4d3e0012345606",
          "name": "jane.doe@example.com",
          "source": "google",
          "source_id": "jane.doe@example.com",
          "display": true,
          "busy": true,
          "color_id": "14",
          "bcolor": "#9fe1e7",
          "fcolor": "#000000",
          "primary": true,
          "writable": true
        },
        {
          "_id": "5f1e9b2a8c4d3e0012345607",
          "name": "Personal",
          "source": "google",
          "source_id": "personal-agenda@example.com",
          "display": false,
          "busy": false,
          "color_id": "7",
          "bcolor": "#42d692",
          "fcolor": "#000000",
          "primary": false,
          "writable": true
        }
      ]
    }
  ],
  "createdAt": "2026-03-12T16:30:31.835Z",
  "updatedAt": "2026-03-12T16:30:32.230Z"
}
```

## The Calendar event object

Returned by [List the calendar events of a user](#list-the-calendar-events-of-a-user). A calendar event is an entry read from one of the user's displayed sub-calendars. It is read-only. It is not the same thing as a Vyte event (a meeting scheduled with Vyte): a Vyte event shows up as a calendar event carrying a `vyte` object.

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `id` | string | no | Identifier of the entry in its sub-calendar. For a confirmed Vyte event: the Vyte event id. For a proposed date of an unconfirmed Vyte event: the Vyte event id, an underscore, and the id of the proposed date. |
| `summary` | string | no | Title of the entry. |
| `start` | object | no | Start of the entry. Contains either `dateTime` or `date`. |
| `start.dateTime` | string (ISO 8601 date-time) | no | Start instant of a timed entry. For Vyte events it is expressed with the UTC offset of the requested timezone, for example `"2026-12-11T11:00:00.000+01:00"`. |
| `start.date` | string | no | Start day of an all-day entry. |
| `end` | object | no | End of the entry, same shape as `start` (`end.dateTime` or `end.date`). |
| `location` | string | no | Place of the entry, when there is one. |
| `attendees[]` | array of object | no | Participants, when known. |
| `attendees[].email` | string | no | Email address of the participant. |
| `attendees[].displayName` | string | no | Name of the participant, when known. |
| `attendees[].responseStatus` | string | no | Answer of the participant, when known. |
| `attendees[].organizer` | boolean | no | `true` on the organizer. |
| `colorId` | string | no | Key of the entry's color in the `colors` map of the response. |
| `calendar` | object | no | Where the entry comes from. |
| `calendar.source` | string | no | `source` of the calendar the entry was read from. |
| `calendar.calendar_id` | string | no | `source_id` of that calendar. |
| `calendar.subcalendar_id` | string | no | `source_id` of that sub-calendar. |
| `calendar_sync` | object | no | Present when the same entry was found both in the Vyte calendar and in an external calendar and the two were merged: `calendar` then points to the Vyte calendar and `calendar_sync` (same three sub-fields) to the external copy. |
| `vyte` | object | no | Present only on entries that are Vyte events. |
| `vyte.event_id` | string (id) | no | Id of the Vyte event. |
| `vyte.confirmed` | boolean | no | `true` when the Vyte event is confirmed, `false` when the entry is one of its proposed dates. |
| `vyte.appointment_type` | string (id) | no | Id of the appointment type the event was booked on, when there is one. |

Entries read from external providers may carry additional provider-specific fields. Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

```json
{
  "id": "5f1e9b2a8c4d3e0012345abc",
  "summary": "Discovery call",
  "start": { "dateTime": "2026-12-11T11:00:00.000+01:00" },
  "end": { "dateTime": "2026-12-11T11:30:00.000+01:00" },
  "location": "Meeting room 2",
  "attendees": [
    { "organizer": true, "displayName": "Jane Doe", "email": "jane.doe@example.com" },
    { "displayName": "John Smith", "email": "john.smith@example.com" }
  ],
  "vyte": { "event_id": "5f1e9b2a8c4d3e0012345abc", "confirmed": true },
  "colorId": "vyte_usercd",
  "calendar": {
    "source": "vyte_user",
    "calendar_id": "5f1e9b2a8c4d3e0012345678",
    "subcalendar_id": "5f1e9b2a8c4d3e0012345678"
  }
}
```

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| `GET` | `/v2/users/:user_id/calendars` | Retrieve (and refresh) the calendar list of a user | organization, team, user |
| `PUT` | `/v2/users/:user_id/calendars` | Update the calendar settings of a user | organization, team, user |
| `DELETE` | `/v2/users/:user_id/calendars/:calendar_id` | Disconnect a calendar from a user | organization, team, user |
| `GET` | `/v2/users/:user_id/calevents` | List the calendar events of a user (requires the `calevents` permission) | organization, team, user |

For all four endpoints: an `organization` key can target any member of the organization, a `team` key any member of the key's teams, a `user` key only its own user. Otherwise the answer is `403`.

### Retrieve the calendars of a user

`GET /v2/users/:user_id/calendars`

Returns the calendar list of the user.

Side effects an integrator must know:

- If the user has no calendar list yet, it is created by this call (with the built-in Vyte calendar, plus the calendar of the account the user signs in with when there is one).
- Every call refreshes the list from the calendar providers: sub-calendars are re-read (new ones are added, removed ones disappear, names and colors are updated) and `default_calendar` / `default_suggestions_calendar` are re-validated and re-chosen when they no longer point to a writable sub-calendar. The call can therefore take a few seconds.
- If a provider reports that access was revoked, the calendar gets `access_broken: true` and the user is notified that the calendar is disconnected. A temporary provider failure leaves the calendar and its sub-calendars unchanged.
- The sub-calendars of a [calendar of interest](/reference/calendar-of-interests/) that was just added to the user appear after this refresh.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string (id) | Id of the user. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the [Calendar list object](#the-calendar-list-object).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not reachable with this key (not a member of the organization / of the key's teams, or not the key's own user). |
| `404` | The user does not exist. |
| `500` | Unexpected error while reading or refreshing the calendar list. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/calendars' \
  --header 'Authorization: YOUR_API_KEY'
```

Response: `200`, see the [example of the Calendar list object](#example).

### Update the calendars of a user

`PUT /v2/users/:user_id/calendars`

Partial update of the calendar settings of the user: which sub-calendars are busy / displayed, where Vyte writes events, and the synchronization options. Only the fields present in the body are changed. The calendar list is created first if the user has none.

How `calendars` is applied:

- Each element of `calendars` is matched to an existing calendar by the pair `source` + `source_id` (not by `_id`). Each element of its `subcalendars` is matched to an existing sub-calendar of that calendar by the pair `source` + `source_id`.
- On a matched sub-calendar, `display` and `busy` are applied when present. Every other property of a calendar or sub-calendar in the body is ignored (name, colors, `primary`, `access_broken`, `writable` cannot be changed).
- Elements that match nothing are ignored silently. Calendars and sub-calendars absent from the body are left untouched: this endpoint never adds nor removes a calendar.
- `busy` is ignored on sub-calendars whose `source` is `vyte_team`.

The simplest way to build the body is to take the object returned by the GET endpoint, change the flags, and send it back.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string (id) | Id of the user. |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `calendars` | array of object | yes | - | Must be present (send `[]` to change only the list-level settings). Calendars whose sub-calendars must be updated. |
| `calendars[].source` | string | yes (to match) | - | `source` of the calendar to update. |
| `calendars[].source_id` | string | yes (to match) | - | `source_id` of the calendar to update. |
| `calendars[].subcalendars` | array of object | no | - | Sub-calendars to update. |
| `calendars[].subcalendars[].source` | string | yes (to match) | - | `source` of the sub-calendar to update. |
| `calendars[].subcalendars[].source_id` | string | yes (to match) | - | `source_id` of the sub-calendar to update. |
| `calendars[].subcalendars[].busy` | boolean | no | unchanged | Whether the events of the sub-calendar make the user unavailable. |
| `calendars[].subcalendars[].display` | boolean | no | unchanged | Whether the events of the sub-calendar are displayed / returned by the calendar events endpoint. |
| `default_calendar` | object | no | unchanged | `{ "source", "calendar_id", "subcalendar_id" }` of the sub-calendar where confirmed events are written. Replaces the whole object. It must designate a writable sub-calendar of the user; a value that does not is discarded at the next refresh and a default is chosen again. |
| `default_suggestions_calendar` | object | no | unchanged | Same shape, for the proposed dates of unconfirmed events. |
| `sync_suggestions` | boolean | no | unchanged | See the object description. |
| `sync_suggestions_voted_only` | boolean | no | unchanged | See the object description. |
| `sync_invited_suggestions` | boolean | no | unchanged | See the object description. |
| `sync_invited_suggestions_voted_only` | boolean | no | unchanged | See the object description. |
| `watch_calendar` | boolean | no | unchanged | See the object description. |
| `category_occurred` | string | no | unchanged | See the object description. |
| `category_no_show` | string | no | unchanged | See the object description. |
| `never_add_invitees_to_calendar_events` | boolean | no | unchanged | See the object description. |
| `week_starts_on` | string | no | unchanged | `"Mon"` or `"Sun"`. An empty value is ignored. |

**Response**

`200` with the plain text body `OK`. The updated calendar list is **not** returned; call the GET endpoint to read it.

**Errors**

| Status | When |
| --- | --- |
| `400` | The body has no `calendars` field. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not reachable with this key. |
| `404` | The user does not exist. |
| `500` | Unexpected error while saving. |

**Example**

Make the "Personal" agenda of the Google account busy, and stop writing proposed dates to the calendar:

```bash
curl --request PUT 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/calendars' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "sync_suggestions": false,
    "calendars": [
      {
        "source": "google",
        "source_id": "jane.doe@example.com",
        "subcalendars": [
          {
            "source": "google",
            "source_id": "personal-agenda@example.com",
            "busy": true,
            "display": true
          }
        ]
      }
    ]
  }'
```

Response: `200`

```
OK
```

### Delete a calendar of a user

`DELETE /v2/users/:user_id/calendars/:calendar_id`

Disconnects one calendar account from the user: the calendar and all its sub-calendars are removed from the calendar list, and its events stop being taken into account for the user's availability. Events already written in that calendar by Vyte are not removed from it.

- If the removed calendar was the target of `default_calendar` or `default_suggestions_calendar`, the list is refreshed and a new default is chosen among the remaining writable sub-calendars.
- The built-in Vyte calendar is recreated automatically at the next refresh.
- Removing a calendar whose `source` is `vyte_calendar_of_interest` only detaches that calendar of interest from this user.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string (id) | Id of the user. |
| `calendar_id` | string (id) | `_id` of the calendar to remove (`calendars[]._id`, not its `source_id`). |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the plain text body `OK`. The same answer is returned when no calendar has this id (the call is idempotent).

**Errors**

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not reachable with this key. |
| `404` | The user does not exist. |
| `500` | Unexpected error while removing the calendar. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/calendars/5f1e9b2a8c4d3e0012345605' \
  --header 'Authorization: YOUR_API_KEY'
```

Response: `200`

```
OK
```

### List the calendar events of a user

`GET /v2/users/:user_id/calevents`

Returns the calendar entries of the user over a period, read live from every sub-calendar whose `display` is `true` (external calendars, the Vyte calendar, calendars of interest), together with the colors needed to render them.

**Permission required.** This endpoint is disabled by default. It only works for organizations for which Vyte has enabled the `calevents` API permission; ask Vyte support to enable it for your organization. Without it every call answers `403`, whatever the key.

Business rules:

- Only sub-calendars with `display: true` are read. `busy` is not considered here.
- Entries the user has declined are left out.
- When the same entry (same title, same start, same end) exists in several calendars, a single merged entry is returned; if one of the copies is in the Vyte calendar, `calendar` points to it and `calendar_sync` to the other copy.
- A calendar that cannot be read (broken or temporarily unavailable access) contributes no entries; the call still succeeds. A `200` with few entries therefore does not prove the calendar is empty: check `access_broken` on the calendar list.
- The call first refreshes the calendar list if it has not been refreshed recently (and creates it if the user has none).

Period selection, by priority:

1. `from` **and** `to` both present: that period.
2. else `next` present and numeric: the whole calendar month located `next` months after the current month (`0` = current month, `1` = next month, `-1` = previous month).
3. else: three calendar months, from the first day of the previous month to the last day of the next month.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string (id) | Id of the user. |

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `from` | string (date `YYYY-MM-DD` or ISO 8601 date-time) | no | see period selection | Start of the period, interpreted in `timezone`. Only used when `to` is also given. |
| `to` | string (date `YYYY-MM-DD` or ISO 8601 date-time) | no | see period selection | End of the period (exclusive), interpreted in `timezone`. A bare date means the beginning of that day: `to=2026-12-13` stops at the end of December 12. Only used when `from` is also given. |
| `timezone` | string (IANA timezone, for example `Europe/Paris`, or `UTC`) | no | the user's timezone | Timezone used to interpret `from` / `to` and to express the dates of Vyte events in the response. Always send it together with `from` / `to`. |
| `next` | integer | no | none | Month offset from the current month, used only when `from` / `to` are not both given. |

**Request body**

None.

**Response**

`200` with an object (not a bare array):

| Field | Type | Description |
| --- | --- | --- |
| `events[]` | array of [Calendar event](#the-calendar-event-object) | Entries of the period. Empty array when there are none. Not sorted. |
| `colors` | object | Map from a color key (the `colorId` of the entries) to `{ "background": "#rrggbb", "foreground": "#rrggbb" }`. May be empty. |
| `week_starts_on` | string | Present only when set on the user's calendar list (`"Mon"` or `"Sun"`). |

**Errors**

| Status | When |
| --- | --- |
| `400` | `timezone` is not a valid timezone name (body `{"message": "Invalid timezone parameter"}`), or `from` / `to` cannot be parsed as dates. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The `calevents` permission is not enabled for the organization, or the user is not reachable with this key. |
| `404` | The user does not exist. |
| `500` | Unexpected error while reading the calendars. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/calevents?from=2026-12-10&to=2026-12-13&timezone=Europe/Paris' \
  --header 'Authorization: YOUR_API_KEY'
```

Response: `200`

```json
{
  "colors": {
    "vyte_usercd": { "background": "#c1defa", "foreground": "#0d5cab" }
  },
  "events": [
    {
      "id": "5f1e9b2a8c4d3e0012345abc",
      "summary": "Discovery call",
      "start": { "dateTime": "2026-12-11T11:00:00.000+01:00" },
      "end": { "dateTime": "2026-12-11T11:30:00.000+01:00" },
      "vyte": { "event_id": "5f1e9b2a8c4d3e0012345abc", "confirmed": true },
      "colorId": "vyte_usercd",
      "calendar": {
        "source": "vyte_user",
        "calendar_id": "5f1e9b2a8c4d3e0012345678",
        "subcalendar_id": "5f1e9b2a8c4d3e0012345678"
      }
    }
  ],
  "week_starts_on": "Mon"
}
```

## Notes and caveats

- **Timestamps are camelCase here.** The calendar list carries `createdAt` / `updatedAt`.
- **GET is not a pure read.** `GET /v2/users/:user_id/calendars` creates the calendar list when missing, refreshes it from the providers and may flag a calendar as `access_broken` (which notifies the user). Do not poll it at high frequency.
- **PUT and DELETE return the text `OK`, not JSON.** Do not parse the body; rely on the status code and re-read with GET.
- **PUT requires `calendars`.** Even to change only `sync_suggestions` or `default_calendar`, send `"calendars": []`, otherwise the answer is `400`.
- **Matching is by `source` + `source_id`, never by `_id`**, in PUT (calendars and sub-calendars) and in `default_calendar` / `default_suggestions_calendar` (`calendar_id` and `subcalendar_id` are `source_id` values). The only place where a calendar `_id` is used is the `:calendar_id` of DELETE.
- **PUT is silent on mismatches.** A calendar or sub-calendar that is not found is skipped and the call still answers `200`. Re-read with GET to verify.
- **DELETE is idempotent**: an unknown `calendar_id` answers `200`.
- **`busy` vs `display`.** `busy` drives availability (free slot computation); `display` drives what the calendar events endpoint returns. They are independent.
- **New sub-calendars are opt-in.** An agenda that appears on an already connected account, and every sub-calendar of a calendar of interest, starts with `busy: false` and `display: false`.
- **Concurrent writes** on the same user's calendar list are serialized; a PUT or DELETE may wait for a running refresh to finish.
- **`calevents` needs activation by Vyte support** (`403` otherwise) and returns `{ "events": [...], "colors": {...} }`, not an array.
