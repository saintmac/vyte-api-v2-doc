---
{ "pageClass": "reference-page" }
---

# Availabilities

:::::panel

:::: left
An **availability** is a set of rules describing *when a user can be booked*: weekly opening hours (`days`), optional date ranges (`dates`), a timezone, buffers around meetings, minimum notice and booking horizon, and a few slot-generation settings. Vyte combines these rules with the busy times of the user's connected calendars to compute bookable slots (see [Slots](./slots.md)). An availability belongs to a [user](./users.md) (`belongs_to`) or, more rarely, only to the organization. [Appointment types](./appointment-types.md) reference an availability by id through their `availability` field, and the batch endpoints of this page update the availabilities of all the appointment types sharing the same handle across a [team](./teams.md) or the whole organization.

General rules (authentication, key scopes, error format, dates, timezones) are described in [Conventions](./README.md).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users/:user_id/availabilities" href="#retrieve-the-primary-availability-of-a-user"></endpoint>
  <endpoint method="post" path="/v2/users/:user_id/availabilities" href="#create-or-update-the-primary-availability-of-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id/availabilities" href="#create-or-update-the-primary-availability-of-a-user"></endpoint>
  <endpoint method="delete" path="/v2/users/:user_id/availabilities" href="#delete-the-primary-availability-of-a-user"></endpoint>
  <endpoint method="post" path="/v2/users/:user_id/availabilities/secondary" href="#create-a-secondary-availability-for-a-user"></endpoint>
  <endpoint method="get" path="/v2/users/:user_id/availabilities/:availability_id" href="#retrieve-one-availability-of-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id/availabilities/:availability_id" href="#update-one-availability-of-a-user"></endpoint>
  <endpoint method="delete" path="/v2/users/:user_id/availabilities/:availability_id" href="#delete-one-availability-of-a-user"></endpoint>
  <endpoint method="post" path="/v2/availabilities" href="#organization-level-availabilities"></endpoint>
  <endpoint method="get" path="/v2/availabilities" href="#list-the-availabilities-attached-to-the-organization"></endpoint>
  <endpoint method="get" path="/v2/availabilities/:availability_id" href="#retrieve-an-availability-attached-to-the-organization"></endpoint>
  <endpoint method="put" path="/v2/availabilities/:availability_id" href="#update-an-availability-attached-to-the-organization"></endpoint>
  <endpoint method="delete" path="/v2/availabilities/:availability_id" href="#delete-an-availability-attached-to-the-organization"></endpoint>
  <endpoint method="post" path="/v2/availabilities/batch" href="#batch-update-availabilities-for-the-whole-organization"></endpoint>
  <endpoint method="post" path="/v2/teams/:team_id/availabilities/batch" href="#batch-update-availabilities-for-a-team"></endpoint>
</endpoints>
::::

:::::

## Concepts

### Primary and secondary availabilities

A user can own several availabilities. They are told apart by the `secondary` field.

| | Primary (default) availability | Secondary availability |
|---|---|---|
| `secondary` value | absent (or `false`) | `true` |
| How many per user | One. The endpoints without an `:availability_id` always address it. | Any number. |
| Created by | `POST` or `PUT /v2/users/:user_id/availabilities` (created if missing). Also created automatically by Vyte when the availabilities module of the user is switched on (see [Users](./users.md)) or when an appointment type is created for a user who has none. | `POST /v2/users/:user_id/availabilities/secondary`. Also created automatically as a copy of the primary one when an appointment type is created without an explicit `availability` (see [Appointment types](./appointment-types.md)). |
| Addressed by | `/v2/users/:user_id/availabilities` or `/v2/users/:user_id/availabilities/:availability_id` | `/v2/users/:user_id/availabilities/:availability_id` only |
| Used for | The user's general bookability: bookings that are not tied to a specific availability, and the user's own constraints when the user is booked as a member of a team. | The specific rules of the appointment type(s) that reference it. |

The `secondary` flag is fixed at creation: it cannot be changed by any endpoint.

The primary availability is only taken into account when the user's `modules.availabilities` flag is `true` (see [Users](./users.md)). Creating the primary availability through `POST` or `PUT /v2/users/:user_id/availabilities` switches this flag on automatically. Updating or deleting an availability never changes the flag.

When Vyte creates a primary availability automatically, its content is: `timezone` = the user's timezone (or the platform default), Monday to Friday enabled with one slot `11:00`-`21:00` each, Saturday and Sunday disabled, `buffer_disable_at_edges: true`, `buffer_appointments_only: true`, and the defaults listed in the object table for every other field.

### How appointment types use an availability

An appointment type holds the id of one availability in its `availability` field (see [Appointment types](./appointment-types.md)).

- The referenced availability must exist and must be owned (`belongs_to`) by a user reachable by the API key. Otherwise the appointment type request is rejected.
- Several appointment types may reference the same availability. They then share its rules, and its `max_parallel_events` capacity.
- If an appointment type is created without `availability`, Vyte gives it its own new secondary availability, copied from the primary availability of the booking page owner.
- When slots are computed for an appointment type of a **single user**, only the appointment type's availability is applied (the user's primary availability is not).
- When slots are computed for a **team** or for **several users**, each member's primary availability is applied *and* the appointment type's availability is applied on top as a common constraint (a slot must satisfy both). The buffers used are the largest of the values involved. A team appointment type may also designate, by `name`, which availability of each member to use instead of the primary one (see `team_availability_name` in [Appointment types](./appointment-types.md)); members who have no availability with that name fall back to their primary one.

### Organization-level availabilities

`POST /v2/availabilities` creates an availability that is attached to the organization (`organization` is set) and to no user (`belongs_to` is absent). Such an availability is a stored set of rules: it is never applied to a user's bookings on its own, and it cannot be referenced by an appointment type (an appointment type only accepts an availability owned by a user). The `/v2/availabilities` and `/v2/availabilities/:availability_id` endpoints only see availabilities whose `organization` field equals the organization of the API key (see [Notes and caveats](#notes-and-caveats)).

## The Availability object

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string (id) | no | Identifier of the availability. |
| `belongs_to` | string (user id) | no | Owner of the availability. Set from the `:user_id` of the path. Absent on organization-level availabilities. |
| `organization` | string (organization id) | no | Organization the availability is attached to. Set by the API (see [Notes and caveats](#notes-and-caveats)). May be absent. |
| `secondary` | boolean | no | `true` for a secondary availability. Absent on a primary availability. See [Primary and secondary availabilities](#primary-and-secondary-availabilities). |
| `name` | string | yes | Free label. Also used to select a member's availability by name for team appointment types (`team_availability_name`). No default. |
| `timezone` | string | yes | IANA timezone name (for example `Europe/Paris`) in which `days`, `dates` and the day-based settings are interpreted. No default is applied by the endpoints of this page: always send it. **Without a `timezone`, the weekly slots, the date ranges, `past_as_busy`, `today_as_busy` and `days_after_as_busy` are not applied at all.** |
| `days` | object | yes | Weekly opening hours. Exactly these seven keys: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`. See [Weekly time slots](#weekly-time-slots-days). |
| `days.<weekday>.enabled` | boolean | yes | `true`: the user can be booked that weekday, within `slots`. `false` or absent: the whole weekday is unavailable and `slots` is ignored. No default. |
| `days.<weekday>.slots[]` | array of objects | yes | Bookable periods of that weekday. Default `[]`. An enabled day with no slot is entirely unavailable. |
| `days.<weekday>.slots[]._id` | string (id) | no | Identifier of the slot, generated on save. |
| `days.<weekday>.slots[].start_time` | string (ISO 8601 date-time) | yes | Start of the period. Required in each slot. Only the time of day is meaningful. See [Weekly time slots](#weekly-time-slots-days). |
| `days.<weekday>.slots[].end_time` | string (ISO 8601 date-time) | yes | End of the period. Required in each slot. Only the time of day is meaningful. |
| `dates[]` | array of objects | yes | Date ranges restricting or overriding the weekly hours. Default `[]`. See [Date ranges and overrides](#date-ranges-and-overrides-dates). |
| `dates[]._id` | string (id) | no | Identifier of the range, generated on save. |
| `dates[].start_date` | string (ISO 8601 date-time) | yes | First day of the range (inclusive). |
| `dates[].end_date` | string (ISO 8601 date-time) | yes | Last day of the range (inclusive). |
| `dates[].specific_days` | boolean | yes | `true`: inside the range, `dates[].days` replaces the weekly `days`. `false`: inside the range, the weekly `days` apply. Default `false`. |
| `dates[].days` | object | yes | Same structure as `days` (seven weekdays, each with `enabled` and `slots[]`). Only used when `specific_days` is `true`. |
| `dates[].specific_times` | boolean | no | Reserved. Returned as `false`. Do not send it: when it is `true`, `specific_days` is forced to `false` on save. |
| `dates[].slots[]` | array | no | Reserved. Returned as `[]`. Do not send it. |
| `stay_available_outside_of_dates` | boolean | yes | Only meaningful when `dates` is not empty. `false` or absent: days outside every range are unavailable. `true`: days outside every range follow the weekly `days`. No default. |
| `past_as_busy` | boolean | yes | `true`: days before today are unavailable. Default `true`. |
| `today_as_busy` | boolean | yes | `true`: the current day is unavailable (no same-day booking). No default (behaves as `false`). |
| `days_after_as_busy` | number (days) | yes | Booking horizon. When set to `N` (greater than 0), every day that is `N` days after today or later is unavailable: bookable days are today to today + `N` - 1. Absent or `0`: no horizon. No default. |
| `hours_before_as_busy` | number (hours) | yes | Minimum notice. When set to `N` (greater than 0), the period from now to now + `N` hours is unavailable. Absent or `0`: no minimum notice. No default. |
| `buffer_before` | number (minutes) | yes | Free time required before each meeting. No default (behaves as `0`). See [Buffers](#buffers). |
| `buffer_after` | number (minutes) | yes | Free time required after each meeting. No default (behaves as `0`). See [Buffers](#buffers). |
| `buffer_appointments_only` | boolean | yes | `true`: existing calendar events are only padded with the buffers they carry themselves (Vyte appointments booked with buffers); other calendar events are not padded with this availability's buffers. `false` or absent: every existing calendar event is padded with `buffer_before` and `buffer_after`. No default. |
| `buffer_disable_at_edges` | boolean | yes | `true`: buffers are not applied at the edges of the opening hours (a meeting may start exactly at a slot's `start_time` and end exactly at its `end_time`). `false`: the closed periods are extended by the buffers, so the buffers must also fit inside the opening hours. Default `false`. |
| `all_day_busy` | boolean | yes | `true`: an all-day event in the user's calendars makes the whole day (in the availability `timezone`) unavailable. `false` or absent: all-day events do not block time slots. No default. |
| `max_parallel_events` | number | yes | Number of bookings accepted on the same time slot. Absent: `1`. When greater than 1, a slot stays bookable until that many bookings of the appointment type(s) using this availability overlap it; any other calendar event still blocks the slot entirely. Appointment types that reference the same availability share this capacity. No default. |
| `start_slots_step` | number (minutes) | yes | Step of the time grid on which busy times and slot starts are aligned. Default `15`. |
| `overlapping_slots_granularity` | number (minutes) | yes | When set, proposed slots inside a free period start every `N` minutes and may overlap each other (for example a 60-minute meeting proposed at 09:00, 09:15, 09:30). Absent: proposed slots are consecutive, one meeting duration apart. No default. |
| `trim_scheduler` | boolean | yes | `true`: slot responses carry a display hint telling booking interfaces which weekend days and which hours outside the opening hours can be hidden. `false`: no hint. Default `true`. |
| `travel_time_add` | boolean | yes | `true`: when a slot request provides a meeting address, travel time between that address and the surrounding meetings is taken into account. Default `false`. |
| `travel_time_mode` | string | yes | Transport mode used for travel time. One of `driving`, `walking`, `bicycling`, `transit`. Default `driving`. |
| `travel_time_max_duration` | number (minutes) | yes | When travel time is active, slots requiring a longer travel time than this are not proposed. No default (no limit). |
| `createdAt` | string (ISO 8601 date-time) | no | Creation date. Note the camelCase name. |
| `updatedAt` | string (ISO 8601 date-time) | no | Last modification date. Note the camelCase name. |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

Fields that have no default are simply absent from the object until they are set.

### Weekly time slots (`days`)

Each weekday holds `enabled` and an array of `slots`. A slot is `{ "start_time": ..., "end_time": ... }`.

- `start_time` and `end_time` are ISO 8601 date-times, but **only the hours and minutes, read in UTC, are used**, and they are interpreted as **wall-clock time in the availability's `timezone`**. The date part is ignored. Example: with `"timezone": "Europe/Paris"`, the slot `{"start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T17:30:00.000Z"}` means "from 09:00 to 17:30, Paris time", in winter and in summer alike.
- Always send complete UTC date-times ending with `Z` (as in the example above). Do not convert the times to UTC yourself: write the local time of day and append `Z`.
- Both `start_time` and `end_time` are required in every slot; a slot missing one of them, or carrying an unparsable value, makes the request fail.
- On save, the date part of `end_time` is replaced by the date part of `start_time`; the time of day is kept. Any date may be used; `2018-01-01` is a convenient fixed one.
- Within a weekday, list the slots in chronological order and do not make them overlap. Several slots express a break: `09:00`-`12:00` and `14:00`-`18:00`.
- A slot cannot span midnight. To stay available until the end of the day, use `23:59` (or `00:00`, which is read as the end of the day when used as an `end_time`).
- When you send `days`, send the complete object with its seven weekdays: `days` is replaced as a whole.

```json
"days": {
  "monday":    { "enabled": true,  "slots": [
    { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T12:00:00.000Z" },
    { "start_time": "2018-01-01T14:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" }
  ] },
  "tuesday":   { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
  "wednesday": { "enabled": false, "slots": [] },
  "thursday":  { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
  "friday":    { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T16:00:00.000Z" } ] },
  "saturday":  { "enabled": false, "slots": [] },
  "sunday":    { "enabled": false, "slots": [] }
}
```

### Date ranges and overrides (`dates`)

`dates` is an array of ranges `{ start_date, end_date, specific_days, days }`. It has two uses: limiting the availability to given periods, and overriding the weekly hours during given periods.

Which hours apply on a given day:

| Situation | Hours applied that day |
|---|---|
| `dates` is empty | Weekly `days`. |
| The day is inside a range with `specific_days: true` | That range's own `dates[].days` (the weekday entry matching the day). |
| The day is inside a range with `specific_days: false` | Weekly `days`. |
| The day is outside every range and `stay_available_outside_of_dates` is `true` | Weekly `days`. |
| The day is outside every range and `stay_available_outside_of_dates` is `false` or absent | The whole day is unavailable. |

Rules:

- `start_date` and `end_date` are both **inclusive calendar days**. The day a bound denotes is determined as follows: if the value is exactly midnight UTC (`2026-12-24T00:00:00.000Z`), it is that UTC date (24 December); otherwise it is the date of that instant in the availability's `timezone` (for example `2026-12-23T23:00:00.000Z` with `Europe/Paris` is also 24 December). The simplest form is midnight UTC of the wanted day.
- A one-day override uses the same day for `start_date` and `end_date`.
- Ranges are sorted by `start_date` on save, whatever the order sent.
- Ranges must not overlap or touch: the `end_date` of a range must be strictly before the `start_date` of the next one, and `start_date` must not be after `end_date`. Otherwise the request fails.
- `dates[].days` has exactly the same format as the weekly `days` (see above), including the slot time format.
- To close a period completely (holidays), add a range with `specific_days: true` whose seven weekdays are `enabled: false`, and set `stay_available_outside_of_dates: true` so that the rest of the calendar keeps following the weekly hours.
- When you send `dates`, send the complete array: it is replaced as a whole.

```json
"stay_available_outside_of_dates": true,
"dates": [
  {
    "start_date": "2026-12-24T00:00:00.000Z",
    "end_date": "2026-12-24T00:00:00.000Z",
    "specific_days": true,
    "days": {
      "monday":    { "enabled": false, "slots": [] },
      "tuesday":   { "enabled": false, "slots": [] },
      "wednesday": { "enabled": false, "slots": [] },
      "thursday":  { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T12:00:00.000Z" } ] },
      "friday":    { "enabled": false, "slots": [] },
      "saturday":  { "enabled": false, "slots": [] },
      "sunday":    { "enabled": false, "slots": [] }
    }
  }
]
```

### Buffers

- `buffer_before` / `buffer_after` (minutes) keep free time before / after each meeting booked with this availability: a slot is only proposed if the buffers around it are free too.
- `buffer_appointments_only` decides whether the user's *other* existing calendar events are themselves padded with these buffers (`false` or absent) or not (`true`).
- `buffer_disable_at_edges` decides whether the buffers must also fit inside the opening hours (`false`) or may spill outside of them (`true`).
- When several availabilities apply at once (team bookings), the largest `buffer_before` and the largest `buffer_after` are used.

### Complete example

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "belongs_to": "5f1e9b2a8c4d3e00123456aa",
  "organization": "5f1e9b2a8c4d3e00123456bb",
  "name": "Office hours",
  "timezone": "Europe/Paris",
  "days": {
    "monday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345601", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "tuesday":   { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345602", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "wednesday": { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345603", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "thursday":  { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345604", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "friday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345605", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T16:00:00.000Z" } ] },
    "saturday":  { "enabled": false, "slots": [] },
    "sunday":    { "enabled": false, "slots": [] }
  },
  "dates": [],
  "past_as_busy": true,
  "today_as_busy": false,
  "days_after_as_busy": 60,
  "hours_before_as_busy": 4,
  "buffer_before": 10,
  "buffer_after": 10,
  "buffer_appointments_only": true,
  "buffer_disable_at_edges": true,
  "all_day_busy": true,
  "start_slots_step": 15,
  "trim_scheduler": true,
  "travel_time_add": false,
  "travel_time_mode": "driving",
  "createdAt": "2026-03-02T09:12:45.120Z",
  "updatedAt": "2026-03-02T09:12:45.120Z"
}
```

### Writable fields accepted in request bodies

Every create and update endpoint of this page, and the `availability` object of the batch endpoints, accept the same fields: all the fields marked "Writable: yes" in the table above, namely `name`, `timezone`, `days`, `dates`, `stay_available_outside_of_dates`, `past_as_busy`, `today_as_busy`, `days_after_as_busy`, `hours_before_as_busy`, `buffer_before`, `buffer_after`, `buffer_appointments_only`, `buffer_disable_at_edges`, `all_day_busy`, `max_parallel_events`, `start_slots_step`, `overlapping_slots_granularity`, `trim_scheduler`, `travel_time_add`, `travel_time_mode`, `travel_time_max_duration`.

All of them are optional. On creation, omitted fields take the defaults of the table. On update, omitted fields are left unchanged; `days` and `dates` are each replaced as a whole when present. Fields whose name starts with `_`, the `secondary` field and unknown fields are ignored. Do not send the read-only fields.

## Endpoints

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/users/:user_id/availabilities` | Retrieve the primary availability of a user | organization, team, user |
| `POST` | `/v2/users/:user_id/availabilities` | Create or update the primary availability of a user | organization, team, user |
| `PUT` | `/v2/users/:user_id/availabilities` | Create or update the primary availability of a user (alias of `POST`) | organization, team, user |
| `DELETE` | `/v2/users/:user_id/availabilities` | Delete the primary availability of a user | organization, team, user |
| `POST` | `/v2/users/:user_id/availabilities/secondary` | Create a secondary availability for a user | organization, team, user |
| `GET` | `/v2/users/:user_id/availabilities/:availability_id` | Retrieve one availability (primary or secondary) of a user | organization, team, user |
| `PUT` | `/v2/users/:user_id/availabilities/:availability_id` | Update one availability (primary or secondary) of a user | organization, team, user |
| `DELETE` | `/v2/users/:user_id/availabilities/:availability_id` | Delete one availability (primary or secondary) of a user | organization, team, user |
| `POST` | `/v2/availabilities` | Create an organization-level availability | organization, team, user |
| `GET` | `/v2/availabilities` | List the availabilities attached to the organization | organization, team, user |
| `GET` | `/v2/availabilities/:availability_id` | Retrieve an availability attached to the organization | organization, team, user |
| `PUT` | `/v2/availabilities/:availability_id` | Update an availability attached to the organization | organization, team, user |
| `DELETE` | `/v2/availabilities/:availability_id` | Delete an availability attached to the organization | organization, team, user |
| `POST` | `/v2/availabilities/batch` | Update the availability of an appointment type handle for every member of the organization | organization |
| `POST` | `/v2/teams/:team_id/availabilities/batch` | Update the availability of an appointment type handle for every member of a team | organization |

Scope rules for the `/v2/users/:user_id/...` endpoints: with an `organization` key, `:user_id` must be a member of the organization; with a `team` key, a member of one of the key's teams; with a `user` key, the key's own user. Otherwise the answer is `403`.

Differences between the path variants (they share the same behaviour otherwise):

| Path family | Which availability is addressed |
|---|---|
| `/v2/users/:user_id/availabilities` | The **primary** availability of `:user_id`. `POST`/`PUT` create it when it does not exist. |
| `/v2/users/:user_id/availabilities/:availability_id` | The availability with that id, **provided it is owned by `:user_id`** (primary or secondary). Never creates. |
| `/v2/availabilities/:availability_id` | The availability with that id, **provided its `organization` field equals the key's organization**. The owner is not considered. Never creates. |

---

### Retrieve the primary availability of a user

`GET /v2/users/:user_id/availabilities`

Returns the primary availability of the user. Despite the plural path, the response is a single object, not an array.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | The user whose primary availability is returned. |

**Query parameters**

None.

**Request body**

None.

**Response** `200` with the [Availability object](#the-availability-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user_id` is not reachable by the API key. |
| `404` | The user has no primary availability. |
| `500` | Unexpected error (including a malformed id). |

**Example**

```bash
curl 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e00123456aa/availabilities' \
  -H 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "belongs_to": "5f1e9b2a8c4d3e00123456aa",
  "timezone": "Europe/Paris",
  "days": {
    "monday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345601", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "tuesday":   { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345602", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "wednesday": { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345603", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "thursday":  { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345604", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "friday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345605", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "saturday":  { "enabled": false, "slots": [] },
    "sunday":    { "enabled": false, "slots": [] }
  },
  "dates": [],
  "past_as_busy": true,
  "buffer_disable_at_edges": false,
  "start_slots_step": 15,
  "trim_scheduler": true,
  "travel_time_add": false,
  "travel_time_mode": "driving",
  "createdAt": "2026-03-02T09:12:45.120Z",
  "updatedAt": "2026-03-02T09:12:45.120Z"
}
```

---

### Create or update the primary availability of a user

`POST /v2/users/:user_id/availabilities`

`PUT /v2/users/:user_id/availabilities`

Both methods behave identically (upsert):

- If the user already has a primary availability, the fields present in the body are updated; the others are left unchanged.
- If the user has no primary availability, one is created from the body (omitted fields take their defaults), and the user's `modules.availabilities` flag is switched on.

Secondary availabilities of the user are never touched by this endpoint.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | The user whose primary availability is created or updated. |

**Query parameters**

None.

**Request body**

Any of the [writable fields](#writable-fields-accepted-in-request-bodies). All optional. `timezone` should always be provided when creating.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `timezone` | string | no (strongly recommended) | none | IANA timezone of the availability. |
| `days` | object | no | every weekday without `enabled` and with empty `slots` (nothing bookable) | Weekly opening hours, see [Weekly time slots](#weekly-time-slots-days). |
| `dates` | array | no | `[]` | Date ranges, see [Date ranges and overrides](#date-ranges-and-overrides-dates). |
| any other writable field | see object table | no | see object table | See [The Availability object](#the-availability-object). |

**Response** `200` with the saved [Availability object](#the-availability-object). The status is `200` in both cases, including when the availability has just been created.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user_id` is not reachable by the API key. |
| `500` | The body failed validation (slot without `start_time` or `end_time`, invalid date, overlapping date ranges, `travel_time_mode` outside the allowed values, value of the wrong type) or an unexpected error occurred. |

**Example**

```bash
curl -X POST 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e00123456aa/availabilities' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "timezone": "Europe/Paris",
    "past_as_busy": true,
    "days_after_as_busy": 60,
    "hours_before_as_busy": 4,
    "buffer_before": 10,
    "buffer_after": 10,
    "days": {
      "monday":    { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
      "tuesday":   { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
      "wednesday": { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
      "thursday":  { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
      "friday":    { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T16:00:00.000Z" } ] },
      "saturday":  { "enabled": false, "slots": [] },
      "sunday":    { "enabled": false, "slots": [] }
    }
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "belongs_to": "5f1e9b2a8c4d3e00123456aa",
  "organization": "5f1e9b2a8c4d3e00123456bb",
  "timezone": "Europe/Paris",
  "days": {
    "monday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345601", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "tuesday":   { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345602", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "wednesday": { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345603", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "thursday":  { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345604", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
    "friday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345605", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T16:00:00.000Z" } ] },
    "saturday":  { "enabled": false, "slots": [] },
    "sunday":    { "enabled": false, "slots": [] }
  },
  "dates": [],
  "past_as_busy": true,
  "days_after_as_busy": 60,
  "hours_before_as_busy": 4,
  "buffer_before": 10,
  "buffer_after": 10,
  "buffer_disable_at_edges": false,
  "start_slots_step": 15,
  "trim_scheduler": true,
  "travel_time_add": false,
  "travel_time_mode": "driving",
  "createdAt": "2026-03-02T09:12:45.120Z",
  "updatedAt": "2026-03-02T09:12:45.120Z"
}
```

---

### Delete the primary availability of a user

`DELETE /v2/users/:user_id/availabilities`

Deletes the primary availability of the user. Secondary availabilities are kept. The user's `modules.availabilities` flag is not changed. The call succeeds even when the user has no primary availability.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | The user whose primary availability is deleted. |

**Query parameters**

None.

**Request body**

None.

**Response** `200` with the plain-text body `OK` (not JSON).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user_id` is not reachable by the API key. |
| `500` | Unexpected error. |

**Example**

```bash
curl -X DELETE 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e00123456aa/availabilities' \
  -H 'Authorization: YOUR_API_KEY'
```

```
OK
```

---

### Create a secondary availability for a user

`POST /v2/users/:user_id/availabilities/secondary`

Always creates a new availability owned by `:user_id` with `secondary: true`. The primary availability of the user is not modified and the user's `modules.availabilities` flag is not changed. The returned `_id` is what you put in the `availability` field of an [appointment type](./appointment-types.md). Keep it: there is no endpoint listing the secondary availabilities of a user (see [Notes and caveats](#notes-and-caveats)).

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | The owner of the new secondary availability. |

**Query parameters**

None.

**Request body**

Any of the [writable fields](#writable-fields-accepted-in-request-bodies). All optional; omitted fields take the defaults of the object table. No default `timezone` is applied: send it.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `timezone` | string | no (strongly recommended) | none | IANA timezone of the availability. |
| `days` | object | no | every weekday without `enabled` and with empty `slots` (nothing bookable) | Weekly opening hours. |
| `dates` | array | no | `[]` | Date ranges. |
| any other writable field | see object table | no | see object table | See [The Availability object](#the-availability-object). |

**Response** `201` with the created [Availability object](#the-availability-object) (`secondary` is `true`, `belongs_to` is `:user_id`).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user_id` is not reachable by the API key. |
| `500` | The body failed validation or an unexpected error occurred. |

**Example**

```bash
curl -X POST 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e00123456aa/availabilities/secondary' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Demo calls",
    "timezone": "Europe/Paris",
    "buffer_after": 15,
    "days": {
      "monday":    { "enabled": false, "slots": [] },
      "tuesday":   { "enabled": true,  "slots": [ { "start_time": "2018-01-01T14:00:00.000Z", "end_time": "2018-01-01T17:00:00.000Z" } ] },
      "wednesday": { "enabled": false, "slots": [] },
      "thursday":  { "enabled": true,  "slots": [ { "start_time": "2018-01-01T14:00:00.000Z", "end_time": "2018-01-01T17:00:00.000Z" } ] },
      "friday":    { "enabled": false, "slots": [] },
      "saturday":  { "enabled": false, "slots": [] },
      "sunday":    { "enabled": false, "slots": [] }
    }
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345699",
  "belongs_to": "5f1e9b2a8c4d3e00123456aa",
  "organization": "5f1e9b2a8c4d3e00123456bb",
  "secondary": true,
  "name": "Demo calls",
  "timezone": "Europe/Paris",
  "buffer_after": 15,
  "days": {
    "monday":    { "enabled": false, "slots": [] },
    "tuesday":   { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345611", "start_time": "2018-01-01T14:00:00.000Z", "end_time": "2018-01-01T17:00:00.000Z" } ] },
    "wednesday": { "enabled": false, "slots": [] },
    "thursday":  { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345612", "start_time": "2018-01-01T14:00:00.000Z", "end_time": "2018-01-01T17:00:00.000Z" } ] },
    "friday":    { "enabled": false, "slots": [] },
    "saturday":  { "enabled": false, "slots": [] },
    "sunday":    { "enabled": false, "slots": [] }
  },
  "dates": [],
  "past_as_busy": true,
  "buffer_disable_at_edges": false,
  "start_slots_step": 15,
  "trim_scheduler": true,
  "travel_time_add": false,
  "travel_time_mode": "driving",
  "createdAt": "2026-03-02T09:20:11.003Z",
  "updatedAt": "2026-03-02T09:20:11.003Z"
}
```

---

### Retrieve one availability of a user

`GET /v2/users/:user_id/availabilities/:availability_id`

Returns the availability with that id if it is owned by `:user_id`. Works for the primary and for secondary availabilities.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | The owner of the availability. |
| `availability_id` | string (id) | The availability to retrieve. |

**Query parameters**

None.

**Request body**

None.

**Response** `200` with the [Availability object](#the-availability-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user_id` is not reachable by the API key. |
| `404` | No availability with this id is owned by `user_id`. |
| `500` | Unexpected error (including a malformed `availability_id`). |

**Example**

```bash
curl 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e00123456aa/availabilities/5f1e9b2a8c4d3e0012345699' \
  -H 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345699",
  "belongs_to": "5f1e9b2a8c4d3e00123456aa",
  "secondary": true,
  "name": "Demo calls",
  "timezone": "Europe/Paris",
  "buffer_after": 15,
  "days": {
    "monday":    { "enabled": false, "slots": [] },
    "tuesday":   { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345611", "start_time": "2018-01-01T14:00:00.000Z", "end_time": "2018-01-01T17:00:00.000Z" } ] },
    "wednesday": { "enabled": false, "slots": [] },
    "thursday":  { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345612", "start_time": "2018-01-01T14:00:00.000Z", "end_time": "2018-01-01T17:00:00.000Z" } ] },
    "friday":    { "enabled": false, "slots": [] },
    "saturday":  { "enabled": false, "slots": [] },
    "sunday":    { "enabled": false, "slots": [] }
  },
  "dates": [],
  "past_as_busy": true,
  "buffer_disable_at_edges": false,
  "start_slots_step": 15,
  "trim_scheduler": true,
  "travel_time_add": false,
  "travel_time_mode": "driving",
  "createdAt": "2026-03-02T09:20:11.003Z",
  "updatedAt": "2026-03-02T09:20:11.003Z"
}
```

---

### Update one availability of a user

`PUT /v2/users/:user_id/availabilities/:availability_id`

Updates the availability with that id if it is owned by `:user_id` (primary or secondary). Only the fields present in the body are changed; `days` and `dates` are each replaced as a whole when present. Unlike the endpoint without `:availability_id`, this one never creates an availability. Every appointment type referencing the availability is affected immediately.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | The owner of the availability. |
| `availability_id` | string (id) | The availability to update. |

**Query parameters**

None.

**Request body**

Any of the [writable fields](#writable-fields-accepted-in-request-bodies). All optional.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| any writable field | see object table | no | unchanged | See [The Availability object](#the-availability-object). |

**Response** `200` with the updated [Availability object](#the-availability-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user_id` is not reachable by the API key. |
| `404` | No availability with this id is owned by `user_id`. |
| `500` | The body failed validation, `availability_id` is malformed, or an unexpected error occurred. |

**Example**

```bash
curl -X PUT 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e00123456aa/availabilities/5f1e9b2a8c4d3e0012345699' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{ "buffer_before": 5, "hours_before_as_busy": 24 }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345699",
  "belongs_to": "5f1e9b2a8c4d3e00123456aa",
  "organization": "5f1e9b2a8c4d3e00123456bb",
  "secondary": true,
  "name": "Demo calls",
  "timezone": "Europe/Paris",
  "buffer_before": 5,
  "buffer_after": 15,
  "hours_before_as_busy": 24,
  "days": {
    "monday":    { "enabled": false, "slots": [] },
    "tuesday":   { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345611", "start_time": "2018-01-01T14:00:00.000Z", "end_time": "2018-01-01T17:00:00.000Z" } ] },
    "wednesday": { "enabled": false, "slots": [] },
    "thursday":  { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345612", "start_time": "2018-01-01T14:00:00.000Z", "end_time": "2018-01-01T17:00:00.000Z" } ] },
    "friday":    { "enabled": false, "slots": [] },
    "saturday":  { "enabled": false, "slots": [] },
    "sunday":    { "enabled": false, "slots": [] }
  },
  "dates": [],
  "past_as_busy": true,
  "buffer_disable_at_edges": false,
  "start_slots_step": 15,
  "trim_scheduler": true,
  "travel_time_add": false,
  "travel_time_mode": "driving",
  "createdAt": "2026-03-02T09:20:11.003Z",
  "updatedAt": "2026-03-02T10:02:37.415Z"
}
```

---

### Delete one availability of a user

`DELETE /v2/users/:user_id/availabilities/:availability_id`

Deletes the availability with that id if it is owned by `:user_id` (primary or secondary). The call succeeds even when nothing matches. Appointment types referencing the availability are **not** checked nor updated: point them to another availability first (see [Appointment types](./appointment-types.md)).

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | The owner of the availability. |
| `availability_id` | string (id) | The availability to delete. |

**Query parameters**

None.

**Request body**

None.

**Response** `200` with the plain-text body `OK` (not JSON), whether or not an availability was deleted.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user_id` is not reachable by the API key. |
| `500` | Unexpected error (including a malformed `availability_id`). |

**Example**

```bash
curl -X DELETE 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e00123456aa/availabilities/5f1e9b2a8c4d3e0012345699' \
  -H 'Authorization: YOUR_API_KEY'
```

```
OK
```

---

### Create an organization-level availability

`POST /v2/availabilities`

Creates an availability attached to the organization of the API key and to no user (see [Organization-level availabilities](#organization-level-availabilities)). To create an availability for a user, use the `/v2/users/:user_id/availabilities` endpoints instead.

**Key scope:** organization, team, user

**Path parameters**

None.

**Query parameters**

None.

**Request body**

Any of the [writable fields](#writable-fields-accepted-in-request-bodies). All optional; omitted fields take the defaults of the object table.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `timezone` | string | no (strongly recommended) | none | IANA timezone of the availability. |
| `days` | object | no | every weekday without `enabled` and with empty `slots` | Weekly opening hours. |
| `dates` | array | no | `[]` | Date ranges. |
| any other writable field | see object table | no | see object table | See [The Availability object](#the-availability-object). |

**Response** `201` with the created [Availability object](#the-availability-object) (`organization` is set, `belongs_to` is absent).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user` scoped key whose user is no longer a member of the organization. |
| `500` | The body failed validation or an unexpected error occurred. |

**Example**

```bash
curl -X POST 'https://api.vyte.in/v2/availabilities' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Standard office hours",
    "timezone": "Europe/Paris",
    "days_after_as_busy": 43,
    "hours_before_as_busy": 3,
    "buffer_before": 45,
    "buffer_after": 20,
    "days": {
      "monday":    { "enabled": false, "slots": [] },
      "tuesday":   { "enabled": false, "slots": [] },
      "wednesday": { "enabled": true,  "slots": [ { "start_time": "2018-01-01T10:00:00.000Z", "end_time": "2018-01-01T14:00:00.000Z" } ] },
      "thursday":  { "enabled": false, "slots": [] },
      "friday":    { "enabled": false, "slots": [] },
      "saturday":  { "enabled": false, "slots": [] },
      "sunday":    { "enabled": false, "slots": [] }
    }
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e00123456cc",
  "organization": "5f1e9b2a8c4d3e00123456bb",
  "name": "Standard office hours",
  "timezone": "Europe/Paris",
  "days_after_as_busy": 43,
  "hours_before_as_busy": 3,
  "buffer_before": 45,
  "buffer_after": 20,
  "days": {
    "monday":    { "enabled": false, "slots": [] },
    "tuesday":   { "enabled": false, "slots": [] },
    "wednesday": { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345621", "start_time": "2018-01-01T10:00:00.000Z", "end_time": "2018-01-01T14:00:00.000Z" } ] },
    "thursday":  { "enabled": false, "slots": [] },
    "friday":    { "enabled": false, "slots": [] },
    "saturday":  { "enabled": false, "slots": [] },
    "sunday":    { "enabled": false, "slots": [] }
  },
  "dates": [],
  "past_as_busy": true,
  "buffer_disable_at_edges": false,
  "start_slots_step": 15,
  "trim_scheduler": true,
  "travel_time_add": false,
  "travel_time_mode": "driving",
  "createdAt": "2026-03-02T11:00:00.000Z",
  "updatedAt": "2026-03-02T11:00:00.000Z"
}
```

---

### List the availabilities attached to the organization

`GET /v2/availabilities`

Returns every availability whose `organization` field equals the organization of the API key: the organization-level availabilities, plus the user availabilities that carry the organization (see [Notes and caveats](#notes-and-caveats)). This is **not** a complete list of the availabilities of all the users of the organization. The response is a bare JSON array, without pagination and without filtering.

**Key scope:** organization, team, user

**Path parameters**

None.

**Query parameters**

None.

**Request body**

None.

**Response** `200` with an array of [Availability objects](#the-availability-object) (possibly empty).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user` scoped key whose user is no longer a member of the organization. |
| `500` | Unexpected error. |

**Example**

```bash
curl 'https://api.vyte.in/v2/availabilities' \
  -H 'Authorization: YOUR_API_KEY'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e00123456cc",
    "organization": "5f1e9b2a8c4d3e00123456bb",
    "name": "Standard office hours",
    "timezone": "Europe/Paris",
    "days": {
      "monday":    { "enabled": false, "slots": [] },
      "tuesday":   { "enabled": false, "slots": [] },
      "wednesday": { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345621", "start_time": "2018-01-01T10:00:00.000Z", "end_time": "2018-01-01T14:00:00.000Z" } ] },
      "thursday":  { "enabled": false, "slots": [] },
      "friday":    { "enabled": false, "slots": [] },
      "saturday":  { "enabled": false, "slots": [] },
      "sunday":    { "enabled": false, "slots": [] }
    },
    "dates": [],
    "past_as_busy": true,
    "buffer_disable_at_edges": false,
    "start_slots_step": 15,
    "trim_scheduler": true,
    "travel_time_add": false,
    "travel_time_mode": "driving",
    "createdAt": "2026-03-02T11:00:00.000Z",
    "updatedAt": "2026-03-02T11:00:00.000Z"
  }
]
```

---

### Retrieve an availability attached to the organization

`GET /v2/availabilities/:availability_id`

Returns the availability with that id if its `organization` field equals the organization of the API key. An availability of a user that does not carry the organization is answered `404` here: use `GET /v2/users/:user_id/availabilities/:availability_id` for it.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `availability_id` | string (id) | The availability to retrieve. |

**Query parameters**

None.

**Request body**

None.

**Response** `200` with the [Availability object](#the-availability-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user` scoped key whose user is no longer a member of the organization. |
| `404` | No availability with this id is attached to the key's organization. |
| `500` | Unexpected error (including a malformed `availability_id`). |

**Example**

```bash
curl 'https://api.vyte.in/v2/availabilities/5f1e9b2a8c4d3e00123456cc' \
  -H 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e00123456cc",
  "organization": "5f1e9b2a8c4d3e00123456bb",
  "name": "Standard office hours",
  "timezone": "Europe/Paris",
  "days": {
    "monday":    { "enabled": false, "slots": [] },
    "tuesday":   { "enabled": false, "slots": [] },
    "wednesday": { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345621", "start_time": "2018-01-01T10:00:00.000Z", "end_time": "2018-01-01T14:00:00.000Z" } ] },
    "thursday":  { "enabled": false, "slots": [] },
    "friday":    { "enabled": false, "slots": [] },
    "saturday":  { "enabled": false, "slots": [] },
    "sunday":    { "enabled": false, "slots": [] }
  },
  "dates": [],
  "past_as_busy": true,
  "buffer_disable_at_edges": false,
  "start_slots_step": 15,
  "trim_scheduler": true,
  "travel_time_add": false,
  "travel_time_mode": "driving",
  "createdAt": "2026-03-02T11:00:00.000Z",
  "updatedAt": "2026-03-02T11:00:00.000Z"
}
```

---

### Update an availability attached to the organization

`PUT /v2/availabilities/:availability_id`

Updates the availability with that id if its `organization` field equals the organization of the API key. Only the fields present in the body are changed; `days` and `dates` are each replaced as a whole when present. Never creates an availability. No default `timezone` is applied when the body has none: the stored value is kept.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `availability_id` | string (id) | The availability to update. |

**Query parameters**

None.

**Request body**

Any of the [writable fields](#writable-fields-accepted-in-request-bodies). All optional.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| any writable field | see object table | no | unchanged | See [The Availability object](#the-availability-object). |

**Response** `200` with the updated [Availability object](#the-availability-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user` scoped key whose user is no longer a member of the organization. |
| `404` | No availability with this id is attached to the key's organization. |
| `500` | The body failed validation, `availability_id` is malformed, or an unexpected error occurred. |

**Example**

```bash
curl -X PUT 'https://api.vyte.in/v2/availabilities/5f1e9b2a8c4d3e00123456cc' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{ "days_after_as_busy": 10 }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e00123456cc",
  "organization": "5f1e9b2a8c4d3e00123456bb",
  "name": "Standard office hours",
  "timezone": "Europe/Paris",
  "days_after_as_busy": 10,
  "hours_before_as_busy": 3,
  "buffer_before": 45,
  "buffer_after": 20,
  "days": {
    "monday":    { "enabled": false, "slots": [] },
    "tuesday":   { "enabled": false, "slots": [] },
    "wednesday": { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345621", "start_time": "2018-01-01T10:00:00.000Z", "end_time": "2018-01-01T14:00:00.000Z" } ] },
    "thursday":  { "enabled": false, "slots": [] },
    "friday":    { "enabled": false, "slots": [] },
    "saturday":  { "enabled": false, "slots": [] },
    "sunday":    { "enabled": false, "slots": [] }
  },
  "dates": [],
  "past_as_busy": true,
  "buffer_disable_at_edges": false,
  "start_slots_step": 15,
  "trim_scheduler": true,
  "travel_time_add": false,
  "travel_time_mode": "driving",
  "createdAt": "2026-03-02T11:00:00.000Z",
  "updatedAt": "2026-03-02T11:30:00.000Z"
}
```

---

### Delete an availability attached to the organization

`DELETE /v2/availabilities/:availability_id`

Deletes the availability with that id if its `organization` field equals the organization of the API key. The call succeeds even when nothing matches. Appointment types referencing the availability are not checked nor updated.

**Key scope:** organization, team, user

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `availability_id` | string (id) | The availability to delete. |

**Query parameters**

None.

**Request body**

None.

**Response** `200` with the plain-text body `OK` (not JSON), whether or not an availability was deleted.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `user` scoped key whose user is no longer a member of the organization. |
| `500` | Unexpected error (including a malformed `availability_id`). |

**Example**

```bash
curl -X DELETE 'https://api.vyte.in/v2/availabilities/5f1e9b2a8c4d3e00123456cc' \
  -H 'Authorization: YOUR_API_KEY'
```

```
OK
```

---

### Batch update availabilities for the whole organization

`POST /v2/availabilities/batch`

Applies the same availability settings to the availability of **every appointment type with a given handle**, across the booking pages of **every member of the organization**. Typical use: all the members have an appointment type with the handle `demo`, and you want to change its opening hours or buffers for everybody in one call.

How the targets are selected:

1. The targeted users are all the members of the organization of the API key. There is no way to pass an explicit list of users or of availability ids: targeting is done only by the route (whole organization here, one team with the [team variant](#batch-update-availabilities-for-a-team)) and by the appointment type handle.
2. Among the booking pages of these users, every appointment type whose `handle` equals `appointment_type_handle` is selected (exact match).
3. For each selected appointment type, its availability is taken. If the appointment type has no availability, or references one that no longer exists, a new secondary availability is created for it first (a copy of the page owner's primary availability, or an empty one if the owner has none) and attached to the appointment type.
4. Only the availabilities owned by a member of the organization are updated. An appointment type that references an availability owned by a user outside the organization is skipped.
5. The fields of the `availability` object are applied to each remaining availability (same rules as a `PUT`: only the fields present are changed, `days` and `dates` are replaced as a whole).

Primary availabilities of the users, and appointment types with another handle, are not touched (unless an appointment type with the handle explicitly references a primary availability).

**Key scope:** organization only (`team` and `user` keys receive `403`)

**Path parameters**

None.

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `target` | string | yes | none | What the batch targets. The only accepted value is `"appointment_type"`. |
| `appointment_type_handle` | string | yes | none | Handle of the appointment types whose availability is updated. Must be a non-empty string. |
| `availability` | object | yes | none | The settings to apply. Must be a JSON object (not an array, not a scalar). Accepts the [writable fields](#writable-fields-accepted-in-request-bodies) of the Availability object: `name`, `timezone`, `days`, `dates`, `stay_available_outside_of_dates`, `past_as_busy`, `today_as_busy`, `days_after_as_busy`, `hours_before_as_busy`, `buffer_before`, `buffer_after`, `buffer_appointments_only`, `buffer_disable_at_edges`, `all_day_busy`, `max_parallel_events`, `start_slots_step`, `overlapping_slots_granularity`, `trim_scheduler`, `travel_time_add`, `travel_time_mode`, `travel_time_max_duration`. The fields `secondary`, `belongs_to` and `organization`, the fields starting with `_` and unknown fields are ignored: each availability keeps its owner. |

**Response** `200` with a JSON array of the updated [Availability objects](#the-availability-object), one entry per selected appointment type. An availability shared by several selected appointment types appears once per appointment type.

**Errors**

| Status | When |
|---|---|
| `400` | `availability` or `target` is missing; `availability` is not an object; `target` is not `"appointment_type"`; `appointment_type_handle` is missing, empty or not a string. The body is `{ "error": "<message>" }`. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The API key is not `organization` scoped. |
| `404` | No appointment type with this handle exists for the targeted users, or none of the matching availabilities is owned by a member of the organization. The body is `{ "error": "<message>" }`. |
| `500` | The `availability` data failed validation or an unexpected error occurred. Availabilities processed before the failure may already have been updated. |

**Example**

```bash
curl -X POST 'https://api.vyte.in/v2/availabilities/batch' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "target": "appointment_type",
    "appointment_type_handle": "demo",
    "availability": {
      "timezone": "America/New_York",
      "buffer_after": 15,
      "hours_before_as_busy": 24
    }
  }'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345699",
    "belongs_to": "5f1e9b2a8c4d3e00123456aa",
    "secondary": true,
    "timezone": "America/New_York",
    "buffer_after": 15,
    "hours_before_as_busy": 24,
    "days": {
      "monday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345631", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
      "tuesday":   { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345632", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
      "wednesday": { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345633", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
      "thursday":  { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345634", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
      "friday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345635", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T18:00:00.000Z" } ] },
      "saturday":  { "enabled": false, "slots": [] },
      "sunday":    { "enabled": false, "slots": [] }
    },
    "dates": [],
    "past_as_busy": true,
    "buffer_disable_at_edges": false,
    "start_slots_step": 15,
    "trim_scheduler": true,
    "travel_time_add": false,
    "travel_time_mode": "driving",
    "createdAt": "2026-03-02T09:20:11.003Z",
    "updatedAt": "2026-03-03T08:00:00.000Z"
  },
  {
    "_id": "5f1e9b2a8c4d3e00123456dd",
    "belongs_to": "5f1e9b2a8c4d3e00123456ab",
    "secondary": true,
    "timezone": "America/New_York",
    "buffer_after": 15,
    "hours_before_as_busy": 24,
    "days": {
      "monday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345641", "start_time": "2018-01-01T10:00:00.000Z", "end_time": "2018-01-01T16:00:00.000Z" } ] },
      "tuesday":   { "enabled": false, "slots": [] },
      "wednesday": { "enabled": false, "slots": [] },
      "thursday":  { "enabled": false, "slots": [] },
      "friday":    { "enabled": false, "slots": [] },
      "saturday":  { "enabled": false, "slots": [] },
      "sunday":    { "enabled": false, "slots": [] }
    },
    "dates": [],
    "past_as_busy": true,
    "buffer_disable_at_edges": false,
    "start_slots_step": 60,
    "trim_scheduler": true,
    "travel_time_add": false,
    "travel_time_mode": "driving",
    "createdAt": "2026-03-03T08:00:00.000Z",
    "updatedAt": "2026-03-03T08:00:00.000Z"
  }
]
```

---

### Batch update availabilities for a team

`POST /v2/teams/:team_id/availabilities/batch`

Same operation, same request body and same response as [Batch update availabilities for the whole organization](#batch-update-availabilities-for-the-whole-organization). The only difference is step 1 of the target selection: the targeted users are the **members of the team** `:team_id` instead of all the members of the organization.

Details specific to this variant:

- The team must belong to the organization of the API key; otherwise the answer is `404`.
- Step 4 is unchanged: an availability is updated when its owner is a member of the **organization**, even if that owner is not a member of the team. This happens when a team member's appointment type references an availability shared by a colleague outside the team.

**Key scope:** organization only (`team` and `user` keys receive `403`, including a `team` key restricted to this very team)

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `team_id` | string (id) | The team whose members are targeted. |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `target` | string | yes | none | The only accepted value is `"appointment_type"`. |
| `appointment_type_handle` | string | yes | none | Handle of the appointment types whose availability is updated. Non-empty string. |
| `availability` | object | yes | none | The settings to apply. Same accepted and ignored fields as in the [organization variant](#batch-update-availabilities-for-the-whole-organization). |

**Response** `200` with a JSON array of the updated [Availability objects](#the-availability-object), one entry per selected appointment type.

**Errors**

| Status | When |
|---|---|
| `400` | `availability` or `target` is missing; `availability` is not an object; `target` is not `"appointment_type"`; `appointment_type_handle` is missing, empty or not a string. The body is `{ "error": "<message>" }`. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The API key is not `organization` scoped. |
| `404` | The team does not exist in the key's organization; no appointment type with this handle exists for the team members; or none of the matching availabilities is owned by a member of the organization. |
| `500` | The `availability` data failed validation, `team_id` is malformed, or an unexpected error occurred. Availabilities processed before the failure may already have been updated. |

**Example**

```bash
curl -X POST 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e00123456ee/availabilities/batch' \
  -H 'Authorization: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "target": "appointment_type",
    "appointment_type_handle": "demo",
    "availability": {
      "days": {
        "monday":    { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T12:00:00.000Z" } ] },
        "tuesday":   { "enabled": true,  "slots": [ { "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T12:00:00.000Z" } ] },
        "wednesday": { "enabled": false, "slots": [] },
        "thursday":  { "enabled": false, "slots": [] },
        "friday":    { "enabled": false, "slots": [] },
        "saturday":  { "enabled": false, "slots": [] },
        "sunday":    { "enabled": false, "slots": [] }
      }
    }
  }'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345699",
    "belongs_to": "5f1e9b2a8c4d3e00123456aa",
    "secondary": true,
    "timezone": "Europe/Paris",
    "days": {
      "monday":    { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345651", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T12:00:00.000Z" } ] },
      "tuesday":   { "enabled": true,  "slots": [ { "_id": "5f1e9b2a8c4d3e0012345652", "start_time": "2018-01-01T09:00:00.000Z", "end_time": "2018-01-01T12:00:00.000Z" } ] },
      "wednesday": { "enabled": false, "slots": [] },
      "thursday":  { "enabled": false, "slots": [] },
      "friday":    { "enabled": false, "slots": [] },
      "saturday":  { "enabled": false, "slots": [] },
      "sunday":    { "enabled": false, "slots": [] }
    },
    "dates": [],
    "past_as_busy": true,
    "buffer_disable_at_edges": false,
    "start_slots_step": 15,
    "trim_scheduler": true,
    "travel_time_add": false,
    "travel_time_mode": "driving",
    "createdAt": "2026-03-02T09:20:11.003Z",
    "updatedAt": "2026-03-03T08:05:00.000Z"
  }
]
```

## Notes and caveats

- **Singular resource behind a plural path.** `GET /v2/users/:user_id/availabilities` returns one object (the primary availability), not an array. Only `GET /v2/availabilities` returns an array.
- **No listing of a user's secondary availabilities.** Keep the `_id` returned by `POST /v2/users/:user_id/availabilities/secondary`, or read the `availability` field of the user's [appointment types](./appointment-types.md).
- **`POST` on the user path is an upsert answering `200`.** `POST /v2/users/:user_id/availabilities` and `PUT /v2/users/:user_id/availabilities` are the same operation; neither answers `201`. Only `POST /v2/users/:user_id/availabilities/secondary` and `POST /v2/availabilities` answer `201`. Calling the upsert twice never creates a second primary availability.
- **`POST .../secondary` is not idempotent.** Each call creates a new secondary availability.
- **`DELETE` returns a plain-text `OK`**, with status `200` even when nothing was deleted. It is safe to repeat.
- **Deleting does not cascade.** Appointment types that reference a deleted availability are not updated. Reassign them first. The batch endpoints give a new availability to the appointment types they select when the referenced one no longer exists.
- **When the `organization` field is set.** It is set to the key's organization on availabilities created with `POST /v2/availabilities`, and on user availabilities created or updated through a `/v2/users/:user_id/availabilities...` endpoint with an `organization` or `user` scoped key. It is not set when such a request is made with a `team` scoped key, nor on a default primary availability created automatically by Vyte. An availability created as a copy of another one (for a new appointment type, or by the batch endpoints) has the same `organization` value as its source. Only availabilities carrying the organization are returned by `GET /v2/availabilities` and addressable through `/v2/availabilities/:availability_id`; the `/v2/users/:user_id/availabilities/:availability_id` endpoints work in every case and are the recommended way to address a user's availability.
- **Updates are partial at the top level only.** A field absent from the body is kept, but `days` and `dates` are replaced entirely when present: always send the seven weekdays and all the date ranges.
- **Slot ids change.** The `_id` of slots and date ranges are regenerated whenever `days` or `dates` is replaced; do not store them.
- **Time-of-day convention.** Slot times are wall-clock times of the availability's `timezone` written as UTC date-times (`...T09:00:00.000Z` means 09:00 local). Changing `timezone` therefore moves the opening hours to the same local times in the new timezone. Always send a full date-time ending with `Z`.
- **Always set `timezone`.** The endpoints of this page do not fill it in. An availability without timezone does not restrict the weekly hours at all.
- **Validation failures are answered `500`**, not `400`, on the single-availability endpoints and inside the batch endpoints (invalid slot, invalid or overlapping date ranges, wrong value type, unknown `travel_time_mode`).
- **Malformed ids are answered `500`**, not `404`.
- **Timestamps are `createdAt` / `updatedAt`** (camelCase) on this resource.
- **The primary availability needs the user's availabilities module.** It is ignored while the user's `modules.availabilities` is `false`. The upsert endpoint switches the module on only when it creates the availability; if the module was switched off afterwards, switch it back on through the [Users](./users.md) API.
- **Batch updates are not atomic.** Availabilities are updated one after the other; on a `500` some may already be updated. Re-sending the same request is safe.
- **Batch endpoints may create availabilities** (for selected appointment types that had none) even when the request finally answers `404`.
