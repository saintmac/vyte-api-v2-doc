---
{ "pageClass": "reference-page" }
---

# Slots

:::::panel

:::: left
A slot is a bookable time range: a start and an end during which the targeted people are free. The Slots endpoints compute, on the fly, the free slots of one user, of several users together, or of one or several teams, by combining their [availabilities](/reference/availabilities/) (working hours, buffers, minimum notice), the events of their connected [calendars](/reference/calendars/) and their existing Vyte [events](/reference/events/). Slots are never stored: each call recomputes them. Use these endpoints to show a slot picker, then create the booking with the [Events](/reference/events/) endpoints. The reverse view (when people are busy) is given by [Busy](/reference/busy/). Authentication, key scopes, error format, dates and timezones are described in [conventions.md](/reference/).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/slots" href="#list-free-slots"></endpoint>
  <endpoint method="get" path="/v2/slots/days" href="#list-free-slots-grouped-per-day"></endpoint>
  <endpoint method="get" path="/v2/slots/best" href="#list-the-best-slots"></endpoint>
  <endpoint method="get" path="/v2/slots/best/:nSlots" href="#list-the-best-slots"></endpoint>
  <endpoint method="get" path="/v2/slots/next" href="#get-the-next-availability"></endpoint>
</endpoints>
::::

:::::

## The Slot object

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `start.dateTime` | string | no | Start of the slot, ISO 8601 with UTC offset, formatted `YYYY-MM-DDTHH:mm:ssZ` (example `2028-02-09T10:30:00+01:00`), expressed in the timezone of the response. |
| `end.dateTime` | string | no | End of the slot, same format. `end - start` equals the requested duration. |
| `users[]` | array of strings | no | Only on team requests made with `showUsers` (see [targeting modes](#targeting-modes)): ids of the team members who are free for this exact slot. |
| `travel_time` | number | no | Only when travel time applies (see [`address`](#travel-time)): travel time in minutes, rounded, between the slot and the closest neighbouring appointment. |
| `travel_from` | string | no | Only when travel time applies: address of the neighbouring appointment the travel time is computed from. |
| `spots_max` | number | no | Only for slots that come from a predefined list of group slots attached to the availability: total number of seats. |
| `spots_remaining` | number | no | Only for predefined group slots: seats still free (always greater than 0). |
| `event` | string | no | Only for predefined group slots: id of the event already attached to the slot, when there is one. |
| `score` | number | no | Only on `GET /v2/slots/best` when a selection was made: relative ranking value. Informational, its scale may change; do not rely on it. |

```json
{
  "start": { "dateTime": "2028-02-09T10:30:00+01:00" },
  "end": { "dateTime": "2028-02-09T11:15:00+01:00" }
}
```

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

### The NextAvailability object

Returned when a request finds no slot in the requested range (and by `GET /v2/slots/next`): the soonest slot found after the range.

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `availableDate` | string | no | Day of the slot, `YYYY-MM-DD`, in the timezone of the response. |
| `availableSlot` | object | no | A Slot object (`start.dateTime`, `end.dateTime`). |

```json
{
  "availableDate": "2028-02-16",
  "availableSlot": {
    "start": { "dateTime": "2028-02-16T10:30:00+01:00" },
    "end": { "dateTime": "2028-02-16T11:15:00+01:00" }
  }
}
```

## Targeting modes

Every endpoint needs to know whose slots to compute. This is given by `users`, `emails`, `team` / `teams`, or indirectly by `appointment_type`.

| Mode | Parameters | Slots returned |
| --- | --- | --- |
| Single user | `users=<user id>` or `emails=<email>` | Times when that user is free. |
| Several users | `users=<id1>,<id2>` or `emails=<a>,<b>` (comma separated) | Times when **all** listed users are free at the same time. |
| Team, any member | `team=<team id>` | Times when **at least one** member of the team is free. Each member's slots are computed with that member's own availability, then merged: a slot offered by several members appears once. Add `showUsers=true` to get, in each slot, `users[]` = the ids of the members free for that slot. |
| Team, all members | `team=<team id>&team_all_members=true` | Times when **all** members of the team are free at the same time (same computation as "several users"). |
| Members common to several teams | `teams=<A>.<B>` (dot separated) | Like "Team, any member", but restricted to the members of team `A` who also belong to every other listed team. If one of the ids does not exist, the team is considered not found. |
| Several teams | `teams=<A>,<B>` (comma separated) | Times when **every** listed team has at least one member free **at the same time** (one free person per team, for instance one salesperson and one technician). This is intentional and is not the union of the teams' slots. Teams of a comma separated list that do not exist are ignored. |

Rules:

- **Priority on the slot list endpoints** (`/v2/slots`, `/v2/slots/days`): `users` wins over `team` / `teams`, which wins over `emails`. On `/v2/slots/next`, `users` or `emails` win over `team` / `teams`. `/v2/slots/best` only supports `emails`.
- **`team` vs `teams`**: `teams` is the full syntax (`.` = members in common, `,` = several teams, both can be combined: `teams=A.B,C`). `team` is the historical parameter: `team=<id>` targets one team; a comma inside `team` is read as a dot (`team=A,B` means `teams=A.B`, members in common). When `teams` is present, `team` is ignored for targeting.
- **`team_mode`** overrides how team slots are computed: `parallel` forces the "any member, per-member slots merged" computation (default for one team), `aggregate` forces the "every listed team has someone free" computation (default for several teams). With `aggregate`, free time ranges are computed first for the whole group and then cut into slots, so slot start times follow one common grid instead of each member's own grid, and `showUsers` has no effect.
- **A team without any member** gives `slots: []` (and no `nextAvailability`).
- **Unknown users**: on `/v2/slots` and `/v2/slots/days`, if one of the ids or emails does not match a Vyte user, that person is treated as always busy and the result is empty, unless `unknownAsFree=true` is sent, in which case unknown people are ignored. Emails must be emails of existing Vyte accounts.

## How slots are computed

1. **Search window.** `from` and `to` are calendar days (`YYYY-MM-DD`), both included, interpreted in the response timezone. Times in the past are never returned. With `users` / `emails` (and in `aggregate` team mode), slots starting less than 30 minutes from now are also dropped.
2. **Availability (working hours).** For each user the *main* availability is used. If `team_availability_name` is given (directly or through the appointment type), the user's availability carrying that name is used instead, falling back to the main one. If `availability_id` is given (directly, through `appointment_type`, or through `event`):
   - one single user targeted, no team: only that availability is used, instead of the user's main one;
   - a team or several users targeted: it is applied **in addition** to each person's own availability (a time must be open in both).
   Outside of the availability's opening hours, and outside of its date ranges when it has some, the person is busy. A user for whom availability management is not enabled is only limited by calendar events.
3. **Minimum notice and horizon.** The availability settings `past_as_busy`, `today_as_busy` (no same-day booking), `hours_before_as_busy` (minimum notice in hours from now) and `days_after_as_busy` (no booking further than N days ahead) remove the corresponding times.
4. **Connected calendars and Vyte events.** Every event marked busy in the calendars the user selected for conflict checking blocks its time range, as do the user's Vyte events (for team requests, pending proposals included). All-day calendar events block the day only when the availability has `all_day_busy` enabled. A calendar that cannot be reached is counted as empty. With `max_parallel_events` greater than 1 on the availability, a time is blocked only once that number of simultaneous bookings is reached.
5. **Buffers.** `buffer_before` / `buffer_after` (minutes) of the availability, and the buffers carried by existing bookings, extend the blocked time around existing events so that the new slot keeps its own buffers. When `buffer_appointments_only` is on, only buffers carried by bookings themselves are applied, not around other calendar events. The availability setting `buffer_disable_at_edges` controls whether buffers also apply at the edges of the opening hours (first and last slot of an opening period). When several availabilities apply, the largest buffer wins. Buffers cannot be passed as query parameters.
6. **Cutting into slots.** Each remaining free range is cut into slots of `duration` minutes, starting at the beginning of the range, back to back, leaving `buffer_before + buffer_after` minutes between two consecutive slots. If the availability defines `overlapping_slots_granularity` (minutes), slots instead start every that many minutes and may overlap. Free ranges are aligned on a grid whose step is the availability's `start_slots_step` (default 15 minutes).
7. **Predefined slots.** If an availability is attached to a predefined list of slots, those that intersect the window and still have seats are merged into the result (duplicates removed, sorted by start).
8. **Next availability.** When the result is empty, the API searches forward after `to`, up to 120 days, and returns the first slot found as `nextAvailability` (omitted if none is found, and never computed when `noNextAvailability` is sent).

### Travel time

If `address` (free text postal address of the appointment) is sent and the applicable availability has travel time enabled, the travel time between that address and the located appointments of the day is added around those appointments, slots that would require more travel than the availability's maximum are removed, and the response carries a top-level `travel_time` object: `address` (string, echoed), `add` (boolean, whether travel time was applied), `mode` (`driving`, `walking`, `bicycling` or `transit`), `max_duration` (minutes, when a maximum is set). Slots then may carry `travel_time` and `travel_from`.

## Common query parameters

These parameters are shared by the endpoints below; each endpoint lists which of them it accepts and its own additions.

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `users` | string | one of `users`, `emails`, `team`, `teams`, or an `appointment_type` linked to a team | none | One user id, or several separated by commas. See [targeting modes](#targeting-modes). |
| `emails` | string | see `users` | none | One email of an existing Vyte user, or several separated by commas. |
| `team` | string | see `users` | none | A team id. |
| `teams` | string | see `users` | none | Team expression: ids separated by `.` (members in common) and/or `,` (several teams, everyone-at-once). |
| `team_all_members` | string | no | not set | Any non-empty value (send `true`): require all members of the team(s) to be free together. |
| `team_mode` | string | no | `parallel` for one team, `aggregate` for several | `parallel` or `aggregate`. Ignored with `team_all_members`. |
| `showUsers` | string | no | not set | Any non-empty value (send `true`): in team "any member" (`parallel`) mode, add `users[]` to each slot. |
| `duration` | number | no | `60` | Slot length in minutes, from `5` to `1440`. A missing, non numeric or out of range value is silently replaced by `60` (no error). When `appointment_type` is sent without `duration`, the appointment type's duration is used. |
| `timezone` | string | no | timezone of the applicable availability, else `Europe/Paris` | IANA timezone name (example `America/New_York`) used to interpret `from` / `to` and to format the response. |
| `appointment_type` | string | no | none | Id of an [appointment type](/reference/appointment-types/) (booking page). Fills, when not already sent explicitly: `availability_id`, `team_availability_name`, `duration`, `team` and `team_all_members` from the appointment type. If the appointment type lets the booker choose a team member and `users` is sent, the team is not applied and the slots are those of the chosen user. Bookings of the same appointment type count towards its `max_parallel_events` capacity. |
| `availability_id` | string | no | none | Id of an [availability](/reference/availabilities/) to use (see step 2 above). |
| `team_availability_name` | string | no | none | Name of the availability to pick for each user instead of the main one. |
| `address` | string | no | none | Address of the appointment, enables [travel time](#travel-time) when configured. |
| `event` | string | no | none | Id of an existing [event](/reference/events/) being rescheduled: the event's own availability and team availability name are applied (unless `availability_id` / `team_availability_name` are sent), so the slots match the rules used when it was booked. This parameter requires the request to be additionally authenticated as a participant of that event; with an API key alone the answer is `401`. |

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| GET | `/v2/slots` | Free slots as one flat list | organization, team, user |
| GET | `/v2/slots/days` | Free slots grouped per day | organization, team, user |
| GET | `/v2/slots/best` | A short selection of the best slots (5) | organization, team, user |
| GET | `/v2/slots/best/:nSlots` | A short selection of the best `nSlots` slots | organization, team, user |
| GET | `/v2/slots/next` | The next available slot only | organization, team, user |

### List free slots

`GET /v2/slots`

Returns all the free slots of the target between `from` and `to`, as a single chronological list.

**Key scope:** organization, team, user. Use it for users and teams of your organization.

**Path parameters**

None.

**Query parameters**

All the [common query parameters](#common-query-parameters), plus:

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `from` | string | yes | none | First day, included, `YYYY-MM-DD`. |
| `to` | string | yes | none | Last day, included, `YYYY-MM-DD`. `to - from` must not exceed 31 days. |
| `unknownAsFree` | string | no | `false` | Exactly `true` to ignore ids / emails that match no Vyte user instead of returning an empty result. Only for `users` / `emails`. |
| `noNextAvailability` | string | no | not set | Any non-empty value (send `true`): do not search for `nextAvailability` when the result is empty (faster). |

**Request body**

None.

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `timezone` | string | Timezone of the slots. With `users` / `emails` it is the `timezone` you sent and is absent when you sent none (read the offset in each `dateTime`); with teams it is always present. |
| `from` | string | Echo of `from`. |
| `to` | string | Echo of `to`. |
| `slots` | array of Slot | Chronological list, `[]` when nothing is free. |
| `nextAvailability` | NextAvailability | Only when `slots` is empty and a later slot was found. |
| `travel_time` | object | Only with `address`, see [travel time](#travel-time). |
| `hide` | object | Only with `users` / `emails` when the availability asks for a trimmed display: display hint for a calendar UI, `hide.hours.before` / `hide.hours.after` (hours outside opening hours) and `hide.days.saturday` / `hide.days.sunday` (`true` when closed). Does not affect the slots. |

**Errors**

| Status | When |
| --- | --- |
| 400 | `from` or `to` missing, or not a valid date, or range longer than 31 days; none of `users`, `emails`, `team`, `teams` resolved (body `{"message": "..."}`). |
| 401 | Missing, unknown or deactivated API key; `event` sent without participant authentication. |
| 404 | `appointment_type` not found (body `{"message": "appointment_type not found"}`); team(s) not found (empty body); `event` not found or malformed id (empty body). |
| 500 | Malformed id (user, team, availability, appointment type), unknown `availability_id`, or a computation failure. |

**Example**

```bash
curl "https://api.vyte.in/v2/slots?emails=jane.doe@example.com&from=2028-02-09&to=2028-02-09&duration=45&timezone=Europe/Paris" \
  -H "Authorization: YOUR_API_KEY"
```

```json
{
  "timezone": "Europe/Paris",
  "from": "2028-02-09",
  "to": "2028-02-09",
  "slots": [
    { "start": { "dateTime": "2028-02-09T10:30:00+01:00" }, "end": { "dateTime": "2028-02-09T11:15:00+01:00" } },
    { "start": { "dateTime": "2028-02-09T11:15:00+01:00" }, "end": { "dateTime": "2028-02-09T12:00:00+01:00" } },
    { "start": { "dateTime": "2028-02-09T12:00:00+01:00" }, "end": { "dateTime": "2028-02-09T12:45:00+01:00" } }
  ]
}
```

Nothing free in the range:

```json
{
  "timezone": "Europe/Paris",
  "from": "2028-02-10",
  "to": "2028-02-12",
  "nextAvailability": {
    "availableDate": "2028-02-16",
    "availableSlot": {
      "start": { "dateTime": "2028-02-16T10:30:00+01:00" },
      "end": { "dateTime": "2028-02-16T11:15:00+01:00" }
    }
  },
  "slots": []
}
```

Team request with members reported:

```bash
curl "https://api.vyte.in/v2/slots?team=5f1e9b2a8c4d3e0012345678&showUsers=true&from=2028-02-08&to=2028-02-12&duration=45&timezone=Europe/Paris" \
  -H "Authorization: YOUR_API_KEY"
```

```json
{
  "timezone": "Europe/Paris",
  "from": "2028-02-08",
  "to": "2028-02-12",
  "slots": [
    {
      "start": { "dateTime": "2028-02-09T16:00:00+01:00" },
      "end": { "dateTime": "2028-02-09T16:45:00+01:00" },
      "users": ["5f1e9b2a8c4d3e0012345601", "5f1e9b2a8c4d3e0012345602"]
    }
  ]
}
```

### List free slots grouped per day

`GET /v2/slots/days`

Same computation, parameters, key scopes and errors as [List free slots](#list-free-slots). Only the response shape differs: slots are grouped under their day.

**Path parameters**

None.

**Query parameters**

Identical to `GET /v2/slots`.

**Request body**

None.

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `timezone`, `from`, `to` | string | As for `GET /v2/slots`. |
| `days` | object | Keys are days (`YYYY-MM-DD`, in the response timezone, day of the slot start); each value is `{ "slots": [Slot, ...] }`. Days without any slot have no key. `{}` when nothing is free. |
| `nextAvailability` | NextAvailability | Only when `days` is empty and a later slot was found. |
| `travel_time`, `hide` | object | As for `GET /v2/slots`. |

There is no top-level `slots` field, with these exceptions where the body is `{"timezone", "from", "to", "slots": []}` instead of `days: {}`: a team that has no member, and several teams (or `team_mode=aggregate`) whose availabilities leave no possible day in the range. Treat a missing `days` as empty.

**Errors**

Same as `GET /v2/slots`.

**Example**

```bash
curl "https://api.vyte.in/v2/slots/days?users=5f1e9b2a8c4d3e0012345678&from=2028-02-07&to=2028-02-11&duration=45&timezone=Europe/Paris" \
  -H "Authorization: YOUR_API_KEY"
```

```json
{
  "timezone": "Europe/Paris",
  "from": "2028-02-07",
  "to": "2028-02-11",
  "days": {
    "2028-02-09": {
      "slots": [
        { "start": { "dateTime": "2028-02-09T10:30:00+01:00" }, "end": { "dateTime": "2028-02-09T11:15:00+01:00" } },
        { "start": { "dateTime": "2028-02-09T11:15:00+01:00" }, "end": { "dateTime": "2028-02-09T12:00:00+01:00" } }
      ]
    }
  }
}
```

### List the best slots

`GET /v2/slots/best`

`GET /v2/slots/best/:nSlots`

Both paths run the same operation; the first one is the second with `nSlots` = `5`. It computes the free slots exactly like `GET /v2/slots`, then keeps only a small, varied selection suited to "propose a few times" use cases.

What makes a slot "best", from a caller's point of view:

- the earliest free slot of the range is always part of the selection;
- the others are picked to favour the middle of the week (Tuesday to Thursday) over Monday and Friday, and weekdays far over weekends;
- mid-morning and mid-afternoon are favoured over early morning, lunch time and late afternoon, and those over evenings and nights (the local time of the slot is used);
- variety: once a day or a part of the day is represented in the selection, further slots on the same day or part of the day are less likely to be picked, so the proposals are spread over several days and times.

The only tuning parameters are `nSlots` (how many), and those that change the underlying free slots: `from` / `to`, `duration`, `timezone`, `availability_id`, `appointment_type`, `team_availability_name`. If the range has fewer free slots than `nSlots`, all of them are returned unchanged.

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `nSlots` | integer | Number of slots wanted, a positive integer. Optional (use `/v2/slots/best`): default `5`. |

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `emails` | string | yes | none | One email or several separated by commas (all must be free together). This endpoint only supports `emails`: `users`, `team` and `teams` are not accepted as targets. Emails matching no Vyte user are ignored. |
| `from` | string | yes | none | First day, included, `YYYY-MM-DD`. |
| `to` | string | yes | none | Last day, included, `YYYY-MM-DD`, at most 31 days after `from`. |
| `duration` | number | no | `60` | See [common query parameters](#common-query-parameters). |
| `timezone` | string | no | see common parameters | IANA timezone name. |
| `appointment_type` | string | no | none | See common parameters. |
| `availability_id` | string | no | none | See common parameters. |
| `team_availability_name` | string | no | none | See common parameters. |
| `address` | string | no | none | See [travel time](#travel-time). |
| `event` | string | no | none | See common parameters. |
| `noNextAvailability` | string | no | not set | Do not search for `nextAvailability` when nothing is free. |

**Request body**

None.

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `slots` | array of Slot | The selection, sorted chronologically. When a selection was made each slot also carries `score`. `[]` when nothing is free. |
| `nextAvailability` | NextAvailability | Only when nothing is free in the range and a later slot was found. |

Unlike `GET /v2/slots`, the body has no `timezone`, `from` or `to`.

**Errors**

| Status | When |
| --- | --- |
| 400 | `emails`, `from` or `to` missing (plain text body), or invalid dates / range longer than 31 days (body `{"message": "..."}`). |
| 401 | Missing, unknown or deactivated API key; `event` sent without participant authentication. |
| 404 | `appointment_type` or `event` not found. |

**Example**

```bash
curl "https://api.vyte.in/v2/slots/best/3?emails=jane.doe@example.com&from=2028-02-07&to=2028-02-18&duration=30&timezone=Europe/Paris" \
  -H "Authorization: YOUR_API_KEY"
```

```json
{
  "slots": [
    { "start": { "dateTime": "2028-02-07T09:00:00+01:00" }, "end": { "dateTime": "2028-02-07T09:30:00+01:00" }, "score": 1 },
    { "start": { "dateTime": "2028-02-08T10:00:00+01:00" }, "end": { "dateTime": "2028-02-08T10:30:00+01:00" }, "score": 0.25 },
    { "start": { "dateTime": "2028-02-09T15:00:00+01:00" }, "end": { "dateTime": "2028-02-09T15:30:00+01:00" }, "score": 0.25 }
  ]
}
```

### Get the next availability

`GET /v2/slots/next`

Returns only the soonest free slot of the target, searching forward from `start` (or from now) for up to 120 days. No `from` / `to` are needed. It follows the same rules as the slot lists (availabilities, calendars, buffers, minimum notice, travel time).

**Key scope:** organization, team, user.

**Path parameters**

None.

**Query parameters**

The [common query parameters](#common-query-parameters) `users`, `emails`, `team`, `teams`, `team_all_members`, `team_mode`, `duration`, `timezone`, `appointment_type`, `availability_id`, `team_availability_name`, `address`, `event`, plus:

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `start` | string | no | now | Day from which to search, strictly `YYYY-MM-DD`. A date in the past is treated as now. |

`from`, `to`, `unknownAsFree`, `noNextAvailability` and `showUsers` are not used by this endpoint. Ids or emails that match no Vyte user are ignored.

**Request body**

None.

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `timezone` | string | Timezone used: the `timezone` sent, else the one of the applicable availability, else `Europe/Paris`. |
| `nextAvailability` | NextAvailability, `{}` or `null` | The soonest slot. `{}` (empty object) when no slot exists within the search horizon. `null` when the targeted team has no member. |

With `users` / `emails`, the returned slot starts on a 5 minute mark (for example `10:35`), as soon as the person is free; it is not necessarily aligned with the slots listed by `GET /v2/slots`.

**Errors**

| Status | When |
| --- | --- |
| 400 | `start` not formatted `YYYY-MM-DD`; none of `users`, `emails`, `team`, `teams` resolved (body `{"message": "..."}`). |
| 401 | Missing, unknown or deactivated API key; `event` sent without participant authentication. |
| 404 | `appointment_type` not found; team(s) not found (empty body); `event` not found. |
| 500 | Malformed id, unknown `availability_id`, or a computation failure. |

**Example**

```bash
curl "https://api.vyte.in/v2/slots/next?team=5f1e9b2a8c4d3e0012345678&duration=30&start=2028-02-10" \
  -H "Authorization: YOUR_API_KEY"
```

```json
{
  "timezone": "Europe/Paris",
  "nextAvailability": {
    "availableDate": "2028-02-16",
    "availableSlot": {
      "start": { "dateTime": "2028-02-16T10:30:00+01:00" },
      "end": { "dateTime": "2028-02-16T11:00:00+01:00" }
    }
  }
}
```

## Notes and caveats

- **Response shapes differ per endpoint**: `/v2/slots` gives `slots[]`; `/v2/slots/days` gives `days{ "YYYY-MM-DD": { slots[] } }`; `/v2/slots/best` gives `slots[]` without `timezone` / `from` / `to`; `/v2/slots/next` gives `nextAvailability` only.
- **`duration` never fails**: an invalid value silently becomes 60 minutes. Check the length of the returned slots if you build the value dynamically.
- **Maximum range is 31 days** between `from` and `to`. Page through longer periods with several calls, or use `nextAvailability` to jump to the next period that has slots.
- **`nextAvailability` is not always present** on empty results: it is omitted when no slot exists in the following 120 days, when `noNextAvailability` is sent, when a user is unknown, and for a team without members. On `/v2/slots/next`, test `nextAvailability.availableSlot` rather than the mere presence of `nextAvailability`.
- **Always send `timezone`** when targeting `users` / `emails`: otherwise the response has no `timezone` field and the days are interpreted in the availability's timezone.
- **Several teams separated by commas means everyone-at-once**, not "any of these teams". To offer the slots of any member of several teams, call the endpoint once per team and merge on your side.
- **Slots are not reserved**: a slot can be taken between the listing and the booking. The booking endpoints of [Events](/reference/events/) check the slot again.
- **Slot start times** depend on each person's free ranges (slots are cut from the start of each free range), so two members of the same team may offer slots on different minute offsets.
- Results are computed live from connected calendars; response time grows with the number of people and the length of the range. Prefer short ranges and `noNextAvailability=true` when you do not need the fallback.
