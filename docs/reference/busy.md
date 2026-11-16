---
{ "pageClass": "reference-page" }
---

# Busy

:::::panel

:::: left
Busy times are the periods during which users (or whole teams) cannot be booked. The Busy endpoint computes them on the fly from the same sources as the [Slots](/reference/slots/) endpoints: the users' [availabilities](/reference/availabilities/) (everything outside opening hours is busy, as are the periods excluded by minimum notice and booking horizon rules), the events of their connected [calendars](/reference/calendars/) and their Vyte [events](/reference/events/), with buffers applied. It is the raw material for drawing a calendar or scheduler view where unavailable periods are greyed out; to get directly bookable time ranges of a given duration, use [Slots](/reference/slots/) instead. Authentication, key scopes, error format, dates and timezones are described in [Conventions](/reference/).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/busy" href="#list-busy-periods"></endpoint>
</endpoints>
::::

:::::

## The Busy period object

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `start.dateTime` | string | no | Start of a timed busy period, ISO 8601 with milliseconds and UTC offset (example `2028-02-10T09:00:00.000+01:00`), in the requested `timezone`. Present for timed periods. |
| `end.dateTime` | string | no | End of a timed busy period, same format. |
| `start.date` | string | no | For an all-day busy period (all-day calendar event): first day, `YYYY-MM-DD`. Present instead of `start.dateTime`. |
| `end.date` | string | no | For an all-day busy period: the day **after** the last busy day (exclusive end), `YYYY-MM-DD`. |
| `users[]` | array of strings | no | Who is busy during the period. In user modes: ids of the busy users, sorted. In team mode: ids of the teams that are fully busy (see [targeting modes](#targeting-modes)). Absent on the periods returned for a team without members. |

```json
{
  "start": { "dateTime": "2028-02-10T09:00:00.000+01:00" },
  "end": { "dateTime": "2028-02-10T10:30:00.000+01:00" },
  "users": ["5f1e9b2a8c4d3e0012345678"]
}
```

How periods are built:

- Time is divided in steps (15 minutes by default, see `start_slots_step`). Consecutive steps with exactly the same set of busy people are merged into one period; a change in the set starts a new period, so periods of different people are split where they overlap.
- A timed period never crosses midnight: a busy time spanning several days is returned as one period per day.
- A user with several simultaneous bookings allowed by their availability (`max_parallel_events` greater than 1) is reported busy only when that capacity is reached.

## Targeting modes

| Mode | Parameters | Meaning of `users[]` in each period |
| --- | --- | --- |
| Users by id | `users=<id1>,<id2>` | The listed users who are busy during the period. Ids matching no user are ignored. |
| Users by email | `emails=<a>,<b>` | The users (found by email) who are busy. Emails matching no Vyte user are ignored. The response adds `ids`, a map from each recognised email to the user id. |
| Team, team view | `team=<team id>` or `teams=<expression>` | Ids of the **teams** for which **every** member is busy during the period, meaning nobody in that team can take a booking. A period is only reported when at least one team is fully busy. With several teams separated by commas, each period lists the teams that are fully busy at that time; a time is bookable for "one person of each team at once" only when none of the teams is listed. This everyone-at-once reading of several teams is intentional. |
| Team, all members | `team=<team id>&team_all_members=true` | Ids of the team **members** who are busy: a period is reported as soon as at least one member is busy (use it when all the members must attend). Only one team id, or a dot expression, is supported in this mode. |
| Participants of an event | `event=<event id>` | See the `event` parameter. |

Priority when several are sent: `event`, then `users`, then `team` / `teams`, then `emails`.

`team` and `teams` follow the same syntax as on [Slots](/reference/slots/#targeting-modes): `teams=A.B` restricts team `A` to the members who also belong to `B`; `teams=A,B` targets several teams; `team=A,B` (historical parameter) is read as `teams=A.B`.

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| GET | `/v2/busy` | Busy periods of users or teams over a date range | organization, team, user |

### List busy periods

`GET /v2/busy`

Returns the busy periods of the target over the requested days. Read-only, no side effect.

What makes a period busy:

- **Availability**: every time outside the opening hours of the user's applicable availability, the days outside its date ranges, and the times excluded by `past_as_busy`, `today_as_busy`, `hours_before_as_busy` (minimum notice) and `days_after_as_busy` (booking horizon). The applicable availability is the user's main one, or the one named `team_availability_name`, combined with or replaced by `availability_id` under the same rules as for [Slots](/reference/slots/#how-slots-are-computed).
- **Calendars and Vyte events**: every event marked busy in the calendars the user selected for conflict checking, and the user's Vyte events. All-day calendar events are returned as all-day periods (`start.date` / `end.date`); when the availability has `all_day_busy` enabled they are returned as timed periods covering the day instead.
- **Buffers**: the availability's `buffer_before` / `buffer_after` and the buffers carried by existing bookings widen the busy periods around events (with `buffer_appointments_only`, only around bookings).
- **Travel time**: with `address`, when the availability has travel time enabled, the travel time to and from located appointments is added around them.

**Key scope:** organization, team, user. Use it for users and teams of your organization.

**Path parameters**

None.

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `users` | string | one of `users`, `emails`, `team`, `teams`, `event`, or an `appointment_type` linked to a team | none | One user id or several separated by commas. |
| `emails` | string | see `users` | none | One email or several separated by commas. |
| `team` | string | see `users` | none | A team id. |
| `teams` | string | see `users` | none | Team expression (`.` = members in common, `,` = several teams). |
| `team_all_members` | string | no | not set | Any non-empty value (send `true`): report busy members instead of fully busy teams. |
| `from` | string | no | Monday of the current week | First day, included, `YYYY-MM-DD`. Must be sent together with `to`; if only one of the two is sent, both are ignored. |
| `to` | string | no | two weeks after the default `from` | Last day, included, `YYYY-MM-DD`. |
| `next` | integer | no | none | Only used when `from` / `to` are not sent: return one single week, the one starting on the Monday `next` weeks after the current week (`0` = current week, `1` = next week). Without `from`, `to` and `next`, the current week and the following one are returned. |
| `timezone` | string | no | none | IANA timezone name (for example `Europe/Paris`) or `UTC`, used to interpret `from` / `to` and to format the response. Strongly recommended: without it the offsets of the returned times are not guaranteed. |
| `appointment_type` | string | no | none | Id of an [appointment type](/reference/appointment-types/). Fills, when not sent explicitly, `availability_id`, `team_availability_name`, `team` and `team_all_members` from the appointment type, and bookings of that appointment type count towards its `max_parallel_events` capacity. If the appointment type lets the booker choose a member and `users` is sent, the team is not applied. |
| `availability_id` | string | no | none | Id of an [availability](/reference/availabilities/) to apply. |
| `team_availability_name` | string | no | none | Name of the availability to use for each user instead of the main one (falls back to the main one). |
| `start_slots_step` | number | no | `15` | Size in minutes of the time steps used to build periods. |
| `dur` | number | no | none | Intended meeting duration in minutes. Only effect: when `start_slots_step` is not sent and `dur` is not a multiple of 15, the step becomes 5 minutes. |
| `address` | string | no | none | Address of the appointment, to take travel time into account when configured. |
| `event` | string | no | none | Id of an existing [event](/reference/events/): returns the busy periods of the participants of that event who have a Vyte account, computed for rescheduling that event: the availability the event was booked with is applied, and `hide` is never returned. This parameter requires the request to be additionally authenticated as a participant of that event; with an API key alone the answer is `401`. |

**Request body**

None.

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `events` | array of Busy period | All-day periods first (chronological), then timed periods (chronological). `[]` when nobody is busy. |
| `names` | object | Display names: map from user id to the user's full name (users without a name are absent). In team view requested with the `team` parameter, map from team id to team name instead; in team view requested with `teams`, map from member id to member name. |
| `ids` | object | Only with `emails`: map from email to user id, for the emails that match a user. |
| `hide` | object | Only when every applicable availability asks for a trimmed display: `hide.hours.before` and `hide.hours.after` (hours of the day before / after which nothing is open) and `hide.days.saturday` / `hide.days.sunday` (`true` when closed). When present, the hours outside this window are **not** reported in `events`: treat them as busy. |
| `week_starts_on` | string or number | Only when the first user's calendar settings define it: first day of the week to use in a calendar view. |
| `travel_time` | object | Only with `address`: `address` (echo), `add` (boolean, travel time applied), `mode` (`driving`, `walking`, `bicycling`, `transit`), `max_duration` (minutes, when a maximum travel time is configured). |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

Special case: when one of the targeted teams (team view) has no member, the response is `{"names": {}, "events": [...]}` with one full-day timed period (midnight to midnight) per day of the range, without `users`.

**Errors**

| Status | When |
| --- | --- |
| 400 | `timezone` is neither `UTC` nor of the form `Area/City` (body `{"message": "Invalid timezone parameter"}`); `from` or `to` is not a valid date; no target (`users`, `emails`, `team`, `teams`, `event`) could be determined (plain text body). |
| 401 | Missing, unknown or deactivated API key; `event` sent without participant authentication. |
| 404 | `appointment_type` not found (body `{"message": "appointment_type not found"}`); team(s) not found in team view (empty body); `event` not found or malformed id (empty body). |
| 500 | Malformed id, team not found with `team_all_members`, or a failure while reading a calendar. |

**Example**

```bash
curl "https://api.vyte.in/v2/busy?emails=jane.doe@example.com&from=2028-02-10&to=2028-02-11&timezone=Europe/Paris" \
  -H "Authorization: YOUR_API_KEY"
```

```json
{
  "names": {
    "5f1e9b2a8c4d3e0012345678": "Jane Doe"
  },
  "events": [
    {
      "start": { "date": "2028-02-11" },
      "end": { "date": "2028-02-12" },
      "users": ["5f1e9b2a8c4d3e0012345678"]
    },
    {
      "start": { "dateTime": "2028-02-10T00:00:00.000+01:00" },
      "end": { "dateTime": "2028-02-10T09:00:00.000+01:00" },
      "users": ["5f1e9b2a8c4d3e0012345678"]
    },
    {
      "start": { "dateTime": "2028-02-10T11:00:00.000+01:00" },
      "end": { "dateTime": "2028-02-10T12:15:00.000+01:00" },
      "users": ["5f1e9b2a8c4d3e0012345678"]
    },
    {
      "start": { "dateTime": "2028-02-10T18:00:00.000+01:00" },
      "end": { "dateTime": "2028-02-11T00:00:00.000+01:00" },
      "users": ["5f1e9b2a8c4d3e0012345678"]
    },
    {
      "start": { "dateTime": "2028-02-11T00:00:00.000+01:00" },
      "end": { "dateTime": "2028-02-11T09:00:00.000+01:00" },
      "users": ["5f1e9b2a8c4d3e0012345678"]
    },
    {
      "start": { "dateTime": "2028-02-11T18:00:00.000+01:00" },
      "end": { "dateTime": "2028-02-12T00:00:00.000+01:00" },
      "users": ["5f1e9b2a8c4d3e0012345678"]
    }
  ],
  "ids": {
    "jane.doe@example.com": "5f1e9b2a8c4d3e0012345678"
  }
}
```

Team view for two teams (each period lists the teams in which nobody is free):

```bash
curl "https://api.vyte.in/v2/busy?teams=5f1e9b2a8c4d3e00123456a1,5f1e9b2a8c4d3e00123456a2&from=2028-02-10&to=2028-02-10&timezone=Europe/Paris" \
  -H "Authorization: YOUR_API_KEY"
```

```json
{
  "names": {
    "5f1e9b2a8c4d3e0012345678": "Jane Doe",
    "5f1e9b2a8c4d3e0012345679": "John Smith"
  },
  "events": [
    {
      "start": { "dateTime": "2028-02-10T00:00:00.000+01:00" },
      "end": { "dateTime": "2028-02-10T09:00:00.000+01:00" },
      "users": ["5f1e9b2a8c4d3e00123456a1", "5f1e9b2a8c4d3e00123456a2"]
    },
    {
      "start": { "dateTime": "2028-02-10T14:00:00.000+01:00" },
      "end": { "dateTime": "2028-02-10T15:00:00.000+01:00" },
      "users": ["5f1e9b2a8c4d3e00123456a2"]
    }
  ]
}
```

## Notes and caveats

- **Date format differs from Slots**: busy periods use `YYYY-MM-DDTHH:mm:00.000+hh:mm` (with milliseconds), slots use `YYYY-MM-DDTHH:mm:ss+hh:mm`. Both are valid ISO 8601.
- **`users[]` holds team ids in team view**, user ids in every other mode. In team view a member who is busy while a colleague is free produces no period at all.
- **Closed hours are busy periods.** Outside of opening hours the owner of the availability is reported busy, so a user with an availability typically has a period from midnight to opening time and from closing time to midnight every day, unless `hide` is returned, in which case those hours are simply left out.
- **All-day periods are listed before timed ones** and use `date` instead of `dateTime`, with an exclusive `end.date`.
- **`from` and `to` go together.** Sending only one silently falls back to the default range (current week and the next one).
- **Unknown users are ignored**, they are not reported as busy. Compare `names` / `ids` with what you asked for if you need to detect them.
- **Several teams separated by commas** are evaluated together (which teams have nobody free at each time); this mirrors the everyone-at-once behaviour of [Slots](/reference/slots/) for several teams.
- Results are computed live from connected calendars; keep the range short (a few weeks) for good response times.
