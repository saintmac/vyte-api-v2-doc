---
{ "pageClass": "reference-page" }
---

# Reports

:::::panel

:::: left
Reports are read-only CSV exports of the activity and configuration of an organization: the
events booked with its users, the bookable slots of its users for the coming week, the
availability settings of its users, the composition of its [teams](/reference/teams/) and the
appointment types of its teams. They are meant to be opened in a spreadsheet or loaded into a
BI tool. Every report exists in two variants: an organization-wide path (`/v2/reports/...`) and
a team path (`/v2/teams/:team_id/reports/...`).

Authentication, key scopes, error format and languages are described in
[conventions.md](/reference/). Related resources: [Users](/reference/users/), [Teams](/reference/teams/),
[Events](/reference/events/), [Availabilities](/reference/availabilities/),
[Appointment types](/reference/appointment-types/), [Booking pages](/reference/vytemes/).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/reports/events" href="#events-report"></endpoint>
  <endpoint method="get" path="/v2/teams/:team_id/reports/events" href="#events-report"></endpoint>
  <endpoint method="get" path="/v2/reports/availability" href="#availability-report"></endpoint>
  <endpoint method="get" path="/v2/teams/:team_id/reports/availability" href="#availability-report"></endpoint>
  <endpoint method="get" path="/v2/reports/availability-settings" href="#availability-settings-report"></endpoint>
  <endpoint method="get" path="/v2/teams/:team_id/reports/availability-settings" href="#availability-settings-report"></endpoint>
  <endpoint method="get" path="/v2/reports/team-members" href="#team-members-report"></endpoint>
  <endpoint method="get" path="/v2/teams/:team_id/reports/team-members" href="#team-members-report"></endpoint>
  <endpoint method="get" path="/v2/reports/team-appointment-types" href="#team-appointment-types-report"></endpoint>
  <endpoint method="get" path="/v2/teams/:team_id/reports/team-appointment-types" href="#team-appointment-types-report"></endpoint>
</endpoints>
::::

:::::

## The Report file

There is no JSON report object. Every report endpoint answers with a CSV file. There is no
`format` parameter: JSON and XLSX outputs do not exist.

| Property | Value |
| --- | --- |
| Generation | Synchronous. The file is produced and streamed in the response to the `GET` request. Nothing is emailed, queued or polled. |
| Status | `200` as soon as the parameters are accepted. See [Notes and caveats](#notes-and-caveats) for failures that happen after that point. |
| `Content-Type` | `text/csv` |
| `Content-Disposition` | `attachment` with a file name (pattern given per report) |
| Encoding | UTF-8, starting with a byte order mark (`U+FEFF`) so that spreadsheet software detects the encoding |
| Field delimiter | `;` (semicolon) |
| Quoting | A cell containing `;`, `"` or a line break is wrapped in double quotes, `"` being doubled. Several reports use multi-line cells. |
| First line | Column headers |
| Pagination | None. The whole report is returned in one response. |
| Limits | No maximum date range and no maximum number of rows are enforced. Large organizations and long ranges produce long-running requests: use a generous client timeout and prefer several smaller ranges. |

### Which users and teams a report covers

| Key scope | Organization-wide path (`/v2/reports/...`) | Team path (`/v2/teams/:team_id/reports/...`) |
| --- | --- | --- |
| `organization` | User-based reports: every member of the organization. Team-based reports: every team of the organization. | The team given in the path, which must belong to the key's organization. |
| `team` | User-based reports: the members of the key's teams (each user once). Team-based reports: the key's teams. | The team given in the path, which must be one of the key's teams (`403` otherwise). |
| `user` | `events`, `availability`, `availability-settings`: only the key's own user, who must be a member of the organization (`403` otherwise). Not supported for `team-members` and `team-appointment-types`. | Not supported. |

The user-based reports are `events`, `availability` and `availability-settings`. The team-based
reports are `team-members` and `team-appointment-types`.

"Members of a team" means the users listed as members of the team. A team admin who is not also
a member of the team is not covered by the user-based reports.

### The special team id `all`

In the team path, `:team_id` may be the literal string `all` instead of a team id. It is only
accepted with an `organization` scoped key (a `team` scoped key gets `403`).

| Report | Behaviour with `all` |
| --- | --- |
| `events`, `availability`, `availability-settings` | Covers every user who is a member of at least one team of the organization (each user once). Organization members who belong to no team are not covered: this is the difference with the organization-wide path. The file name contains the name of one of the organization's teams, without any guarantee on which one. |
| `team-members`, `team-appointment-types` | Not supported: the report only contains one team of the organization. Use the organization-wide path instead. |

`404` is returned when the organization has no team.

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| GET | `/v2/reports/events` | Events booked with the covered users, by booking date | organization, team, user |
| GET | `/v2/teams/:team_id/reports/events` | Same report for the members of one team | organization, team |
| GET | `/v2/reports/availability` | Bookable slots of the covered users for the next 7 days | organization, team, user |
| GET | `/v2/teams/:team_id/reports/availability` | Same report for the members of one team | organization, team |
| GET | `/v2/reports/availability-settings` | Weekly availability settings of the covered users | organization, team, user |
| GET | `/v2/teams/:team_id/reports/availability-settings` | Same report for the members of one team | organization, team |
| GET | `/v2/reports/team-members` | Admins and members of every covered team | organization, team |
| GET | `/v2/teams/:team_id/reports/team-members` | Same report for one team | organization, team |
| GET | `/v2/reports/team-appointment-types` | Appointment types of every covered team, with their availability settings | organization, team |
| GET | `/v2/teams/:team_id/reports/team-appointment-types` | Same report for one team | organization, team |

The team path of a report runs the same report as the organization-wide path; only the set of
users or teams covered, and the name used in the file name, differ.

### Events report

`GET /v2/reports/events`

`GET /v2/teams/:team_id/reports/events`

Exports one row per event that was **created (booked)** between `from` and `to` and in which at
least one covered user takes part as a participant. The date range filters on the booking date,
not on the appointment date. Cancelled events are included (they are flagged in the `Cancelled`
columns). Rows are sorted by booking date, oldest first.

**Key scope:** organization, team, user (organization-wide path); organization, team (team path).
See [Which users and teams a report covers](#which-users-and-teams-a-report-covers).

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | Team path only. Id of the team whose members are covered, or the literal `all` (see [The special team id `all`](#the-special-team-id-all)). |

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `from` | string (date, `YYYY-MM-DD`) | yes | none | First booking day included in the report. The whole day is included, from 00:00:00.000. |
| `to` | string (date, `YYYY-MM-DD`) | yes | none | Last booking day included in the report. The whole day is included, until 23:59:59.999. |
| `template` | string | no | `default` | Column layout. Allowed values: `default`, `b2b`, `b2c_at` (see the column tables below). Any other value makes the request fail. |
| `at` | string | no | none | Handle of an appointment type (the last segment of its booking URL). Only events booked through an appointment type with exactly this handle are exported (case-sensitive). The handle is also appended to the name in the file name. |
| `subdomain` | string | no | none | Only export events booked on the branded site `https://<subdomain>.vyte.in`. |

There is no time zone parameter and no language parameter. The boundaries of the `from` and `to`
days are evaluated on the server clock; they are not shifted to the time zone of the events.
Dates and times inside the file are expressed in the time zone of each event (column
`Timezone`), or in UTC when the event has no time zone.

**Request body**

None.

**Response**

`200` with a CSV file (see [The Report file](#the-report-file)).

File name: `vyte_reporting_events_<name><from>_<to>.csv` where `<name>` is the team name (team
path) or the organization name (organization-wide path), followed by `_<at>` when the `at`
parameter is given, and `<from>` / `<to>` are written `YYYY-M-D` without zero padding (example:
`vyte_reporting_events_Sales2026-4-1_2026-4-30.csv`). There is no separator between the name and
the first date, and the name is not sanitized.

Columns, in order, for each `template` value. Every layout starts with the `#` column and ends
with the metadata columns described below.

| `template` | Columns |
| --- | --- |
| `default` | `#`, `Booking Date`, `Booking time`, `Place`, `Appointment Date`, `Appointment Time`, `Timezone`, `Appointment Type ID`, `Appointment Type Name`, `Team ID`, `Team Name`, `Name`, `Email`, `Phone`, `Confirmed`, `Cancelled`, `Cancelled by`, `Cancellation date`, `Cancellation time`, `Cancellation reason` |
| `b2b` | `#`, `Booking Date`, `Booking time`, `Account`, `Place`, `Appointment Date`, `Appointment Time`, `Timezone`, `Subject`, `Team ID`, `Team Name`, `Name`, `Email`, `Phone`, `Company`, `Confirmed`, `Cancelled`, `Cancelled by`, `Cancellation date`, `Cancellation time`, `Cancellation reason`, `UTM Source`, `UTM Medium`, `UTM Campaign`, `Gclid` |
| `b2c_at` | `#`, `Booking Date`, `Booking time`, `Appointment Date`, `Appointment Time`, `Account`, `Timezone`, `Place`, `Appointment Type ID`, `Appointment Type Name`, `Subject`, `Name`, `Email`, `Confirmed`, `Cancelled`, `Cancelled by`, `Cancellation date`, `Cancellation time`, `Cancellation reason` |

Meaning of each column:

| Column header | Format | Meaning |
| --- | --- | --- |
| `#` | integer | Row number, starting at 1. |
| `Booking Date` | `YYYY-MM-DD` | Day the event was created (booked). |
| `Booking time` | `HH:mm` (24 h) | Time the event was created. |
| `Account` | email | Email address of the creator of the event. |
| `Place` | text | Name of the first place of the event. Empty when the event has no place. |
| `Appointment Date` | `YYYY-MM-DD` | Day of the appointment: the retained date of the event, or its first proposed date. Empty when the event has no date. |
| `Appointment Time` | `HH:mm` (24 h) | Start time of the appointment. Empty when the event has no date. |
| `Timezone` | IANA name, e.g. `Europe/Paris` | Time zone of the event, used for every date and time of the row. Empty when the event has none (dates and times are then in UTC). |
| `Appointment Type ID` | id | Id of the appointment type the event was booked through. Empty otherwise. |
| `Appointment Type Name` | text | Name of that appointment type. Empty otherwise. |
| `Team ID` | id | Id of the team through which the event was booked (team booking). Empty when the event was not a team booking or when the team no longer exists. |
| `Team Name` | text | Name of that team. Empty in the same cases. |
| `Subject` | text | Title of the event. |
| `Name` | text | Full name of the first invitee of the event. |
| `Email` | email | Email address of the first invitee. |
| `Phone` | text | Phone number of the first invitee. |
| `Company` | text | Company of the first invitee. |
| `Confirmed` | `yes` or empty | `yes` when the event is confirmed. |
| `Cancelled` | `yes` or empty | `yes` when the event is cancelled. |
| `Cancelled by` | `Internal`, `External` or empty | `Internal` when the event was cancelled by its creator, `External` when it was cancelled by anyone else. Empty when not cancelled. |
| `Cancellation date` | `YYYY-MM-DD` | Day of the cancellation. Empty when not cancelled. |
| `Cancellation time` | `HH:mm` (24 h) | Time of the cancellation. Empty when not cancelled. |
| `Cancellation reason` | text | Message given with the cancellation. Empty when none was given or when not cancelled. |
| `UTM Source`, `UTM Medium`, `UTM Campaign`, `Gclid` | text | Value of the event metadata keys `utm_source`, `utm_medium`, `utm_campaign` and `gclid`. Empty when the event does not carry the key. |

Metadata columns: after the columns of the layout, the file has one extra column per distinct
metadata key found on the events of the date range (see event `metadata` in
[Events](/reference/events/)). The header of such a column is the metadata key itself (a few keys have a
predefined human-readable header) and the cell is the value for that event, empty when the event
does not carry the key. The set and order of these columns therefore changes from one export to
another: always locate columns by header, never by position. With the `b2b` layout, a metadata
key named `utm_source`, `utm_medium`, `utm_campaign` or `gclid` appears twice: once as the fixed
column of the layout and once as a metadata column.

Language: headers and values are in English. On the organization-wide path, when the language
of the organization is French, the five cancellation headers become `Annulé`, `Annulé par`,
`Date d'annulation`, `Heure d'annulation`, `Motif d'annulation` and the `Cancelled by` values
become `Interne` / `Externe`; every other header stays in English.

**Errors**

| Status | When |
| --- | --- |
| `400` | `from` or `to` is missing (JSON body with a `message`). Organization-wide path: the key is not attached to an organization. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key and `team_id` is not one of its teams (including `all`). `user` scoped key whose user is not a member of the organization. |
| `404` | Team path: the team does not exist or belongs to another organization, or `all` was used and the organization has no team. Organization-wide path: the organization of the key no longer exists. |
| `500` | Unexpected error, including a `team_id` that is neither a valid id nor `all`, an unparsable `from` / `to`, or an unknown `template`. |

**Example**

```bash
curl -H "Authorization: YOUR_API_KEY" \
  -o events.csv \
  "https://api.vyte.in/v2/reports/events?from=2026-04-01&to=2026-04-30"
```

```
HTTP/1.1 200 OK
Content-Type: text/csv
```

```
#;Booking Date;Booking time;Place;Appointment Date;Appointment Time;Timezone;Appointment Type ID;Appointment Type Name;Team ID;Team Name;Name;Email;Phone;Confirmed;Cancelled;Cancelled by;Cancellation date;Cancellation time;Cancellation reason;customer_ref
1;2026-04-02;09:14;Paris office;2026-04-09;14:00;Europe/Paris;5f1e9b2a8c4d3e0012345678;Discovery call;5f1e9b2a8c4d3e00123456aa;Sales;Jane Doe;jane.doe@example.com;+33100000000;yes;;;;;;A-1042
2;2026-04-03;16:40;;2026-04-10;10:30;Europe/Paris;5f1e9b2a8c4d3e0012345678;Discovery call;;;John Smith;john.smith@example.com;;yes;yes;External;2026-04-05;08:12;No longer available;
```

### Availability report

`GET /v2/reports/availability`

`GET /v2/teams/:team_id/reports/availability`

Exports, for each covered user, the bookable time slots of the next 7 days (today included),
one column per day of the week. The slots are derived from the availability settings only: the
opening hours that apply to each date (weekly hours and date-specific ranges) are cut into
consecutive slots of the booking duration, taking the buffers configured on the availability
into account. Calendar events, existing bookings, minimum notice and other booking rules are
**not** taken into account: for real free slots use [Slots](/reference/slots/).

Without `at`, the report uses the default availability of each user and the duration of the
user's booking page (60 minutes when the page defines none). With `at`, it uses the own
availability and the duration of the appointment type with that handle on each user's booking
page (60 minutes when the appointment type defines none).

**Key scope:** organization, team, user (organization-wide path); organization, team (team path).
See [Which users and teams a report covers](#which-users-and-teams-a-report-covers).

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | Team path only. Id of the team whose members are covered, or the literal `all` (see [The special team id `all`](#the-special-team-id-all)). |

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `at` | string | no | none | Handle of an appointment type. Reports the slots of that appointment type instead of the slots of the user's main booking page, and appends the handle to the name in the file name. Must match the handle exactly. |
| `template` | string | no | `default` | Column layout. The only allowed value is `default`. Any other value makes the request fail. |

There is no date range parameter (the period is always the 7 days starting today), no time zone
parameter and no language parameter.

**Request body**

None.

**Response**

`200` with a CSV file (see [The Report file](#the-report-file)).

File name: `vyte_reporting_availabilities_<YYYY>-<M>-<D>-<name>.csv` where the date is the day
of generation without zero padding and `<name>` is the team name (team path) or the
organization name (organization-wide path), followed by `_<at>` when `at` is given. The name is
not sanitized.

Lines of the file:

1. Header line. The headers are always in French: `Compte`, `Email`, `Lien Vyte`, `Lundi`,
   `Mardi`, `Mercredi`, `Jeudi`, `Vendredi`, `Samedi`, `Dimanche`.
2. Date line: the first three cells contain a single space, the seven following cells contain
   the calendar date (`DD/MM`) that each weekday column stands for in this export. Because the
   period starts today, the dates are not in ascending order from left to right unless today is
   a Monday. This line can be missing (see [Notes and caveats](#notes-and-caveats)): recognise
   it by its blank first cell.
3. One line per user.

| Column header | Format | Meaning |
| --- | --- | --- |
| `Compte` | text | Full name of the user. |
| `Email` | email | First email address of the user. |
| `Lien Vyte` | URL | Public booking link: the user's booking page, or the appointment type page (`<booking page URL>/<handle>`) when `at` is given. Empty when the user has no booking page or no default availability. |
| `Lundi` (Monday), `Mardi` (Tuesday), `Mercredi` (Wednesday), `Jeudi` (Thursday), `Vendredi` (Friday), `Samedi` (Saturday), `Dimanche` (Sunday) | multi-line text | Slots of the date shown in the date line, each written `HH:mm - HH:mm` (24 h, in the time zone of the availability). Slots are separated by `;` followed by a line break (CR LF) inside the quoted cell. Empty when the user is not available that day. |

Which users get a line:

| Situation | Without `at` | With `at` |
| --- | --- | --- |
| User has a booking page and an availability | Full line | Full line |
| User has no booking page, or no default availability | Line with `Compte` and `Email` only | No line |
| User has no appointment type with this handle, or that appointment type has no availability of its own | Not applicable | No line |

The order of the user lines is not guaranteed and can change between two calls. When no user is
covered the file is empty (no header line).

**Errors**

| Status | When |
| --- | --- |
| `400` | Organization-wide path: the key is not attached to an organization. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key and `team_id` is not one of its teams (including `all`). `user` scoped key whose user is not a member of the organization. |
| `404` | Team path: the team does not exist or belongs to another organization, or `all` was used and the organization has no team. Organization-wide path: the organization of the key no longer exists. |
| `500` | Unexpected error, including a `team_id` that is neither a valid id nor `all`, or an unknown `template`. |

**Example**

```bash
curl -H "Authorization: YOUR_API_KEY" \
  -o availability.csv \
  "https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e00123456aa/reports/availability?at=discovery-call"
```

Response generated on Wednesday 15 April 2026 (cells shortened to two slots for readability):

```
Compte;Email;Lien Vyte;Lundi;Mardi;Mercredi;Jeudi;Vendredi;Samedi;Dimanche
 ; ; ;20/04;21/04;15/04;16/04;17/04;18/04;19/04
Jane Doe;jane.doe@example.com;https://acme.vyte.in/jane-doe/discovery-call;"09:00 - 10:00;
10:00 - 11:00";"09:00 - 10:00;
10:00 - 11:00";"09:00 - 10:00;
10:00 - 11:00";"09:00 - 10:00;
10:00 - 11:00";"09:00 - 10:00;
10:00 - 11:00";;
```

### Availability settings report

`GET /v2/reports/availability-settings`

`GET /v2/teams/:team_id/reports/availability-settings`

Exports the availability settings of each covered user: one row for the user's default
availability, then one row per named additional availability of the user (the availabilities
used by team appointment types), sorted by name. Only the weekly hours are exported;
date-specific ranges are only flagged in the last column. Additional availabilities without a
name are not exported.

**Key scope:** organization, team, user (organization-wide path); organization, team (team path).
See [Which users and teams a report covers](#which-users-and-teams-a-report-covers).

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | Team path only. Id of the team whose members are covered, or the literal `all` (see [The special team id `all`](#the-special-team-id-all)). |

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `lang` | string | no | `en` | Language of the headers and of the fixed values. Allowed values: `en`, `fr`. Any other value gives English. |

**Request body**

None.

**Response**

`200` with a CSV file (see [The Report file](#the-report-file)).

File name: `availability_settings_<name>_export.csv` where `<name>` is the team name (team
path) or the organization name (organization-wide path with an `organization` or `user` scoped
key), every character other than `a-z`, `A-Z`, `0-9`, `_` and `-` being replaced by `_`. With a
`team` scoped key on the organization-wide path the name is the literal `organization`.

| # | Header (`en`) | Header (`fr`) | Format | Meaning |
| --- | --- | --- | --- | --- |
| 1 | `ID` | `ID` | id | Id of the user. |
| 2 | `External ID` | `ID externe` | text | External id of the user in the organization (see [Users](/reference/users/)). Empty when none. |
| 3 | `First name` | `Prénom` | text | First name of the user. |
| 4 | `Last name` | `Nom` | text | Last name of the user. |
| 5 | `Email` | `Email` | email | First email address of the user. |
| 6 | `Availability` | `Disponibilité` | text | `Default` (`Par défaut` in French) for the default availability, otherwise the name of the additional availability. |
| 7 | `Timezone` | `Fuseau horaire` | IANA name | Time zone of the availability. |
| 8 to 14 | `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday` | `Lundi`, `Mardi`, `Mercredi`, `Jeudi`, `Vendredi`, `Samedi`, `Dimanche` | multi-line text | Opening hours of that weekday, one `HH:mm - HH:mm` range per line (ranges separated by a line feed inside the quoted cell), sorted by start time, in the time zone of column 7. Empty when the day is not enabled. |
| 15 | `Working days` | `Jours travaillés` | text | Enabled weekdays, abbreviated and separated by `, `: `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun` (`Lun`, `Mar`, `Mer`, `Jeu`, `Ven`, `Sam`, `Dim` in French). |
| 16 | `Same hours every working day` | `Mêmes horaires chaque jour travaillé` | `Yes` / `No` (`Oui` / `Non`) | `Yes` when at least one day is enabled and all enabled days have exactly the same hours. |
| 17 | `Start step (min)` | `Pas de début (min)` | integer or empty | Interval in minutes between two possible start times of a slot. Empty when not set. |
| 18 | `Starts on the hour` | `Commence à l'heure pile` | `Yes` / `No` (`Oui` / `Non`) | `Yes` when the start step is set and is a multiple of 60. |
| 19 | `Has date-specific overrides` | `Exceptions par date` | `Yes` / `No` (`Oui` / `Non`) | `Yes` when the availability has date-specific ranges, which this report does not detail. |

A user without a default availability still gets a `Default` row, with columns 7 to 19 empty.
The order of the users is not guaranteed.

When no user is covered, the file contains the header line followed by one line whose first cell
is `No users found`. When the data cannot be read, that line is
`Error occurred while fetching data`. Both come with status `200` and are always in English.

**Errors**

| Status | When |
| --- | --- |
| `400` | Organization-wide path: the key is not attached to an organization. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key and `team_id` is not one of its teams (including `all`). `user` scoped key whose user is not a member of the organization. |
| `404` | Team path: the team does not exist or belongs to another organization, or `all` was used and the organization has no team. Organization-wide path: the organization of the key no longer exists. |
| `500` | Unexpected error, including a `team_id` that is neither a valid id nor `all`. |

**Example**

```bash
curl -H "Authorization: YOUR_API_KEY" \
  -o availability_settings.csv \
  "https://api.vyte.in/v2/reports/availability-settings?lang=en"
```

```
ID;External ID;First name;Last name;Email;Availability;Timezone;Monday;Tuesday;Wednesday;Thursday;Friday;Saturday;Sunday;Working days;Same hours every working day;Start step (min);Starts on the hour;Has date-specific overrides
5f1e9b2a8c4d3e0012345601;EMP-001;Jane;Doe;jane.doe@example.com;Default;Europe/Paris;"09:00 - 12:00
14:00 - 18:00";"09:00 - 12:00
14:00 - 18:00";"09:00 - 12:00
14:00 - 18:00";"09:00 - 12:00
14:00 - 18:00";"09:00 - 12:00
14:00 - 18:00";;;Mon, Tue, Wed, Thu, Fri;Yes;30;No;No
5f1e9b2a8c4d3e0012345601;EMP-001;Jane;Doe;jane.doe@example.com;Showroom;Europe/Paris;;;10:00 - 16:00;;;10:00 - 13:00;;Wed, Sat;No;60;Yes;Yes
5f1e9b2a8c4d3e0012345602;;John;Smith;john.smith@example.com;Default;;;;;;;;;;;;;
```

### Team members report

`GET /v2/reports/team-members`

`GET /v2/teams/:team_id/reports/team-members`

Exports one row per team and user, for the admins and the members of every covered team. A user
who belongs to several teams has one row per team; a user who is both admin and member of a team
has a single row for that team, with the role `Admin`. Rows are sorted by team name, then admins
before members, then by last name.

The organization-wide administrative team that only mirrors the list of all organization members
is not a real team and is never exported, even when it is the team of the path (the report then
contains the `No users found` line).

**Key scope:** organization, team. On the organization-wide path an `organization` scoped key
covers every team of the organization and a `team` scoped key covers its own teams. On the team
path only the team of the path is covered.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | Team path only. Id of the team to export. The literal `all` is not supported for this report (see [The special team id `all`](#the-special-team-id-all)): use `GET /v2/reports/team-members`. |

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `lang` | string | no | `en` | Language of the headers and of the fixed values. Allowed values: `en`, `fr`. Do not send any other value. |

**Request body**

None.

**Response**

`200` with a CSV file (see [The Report file](#the-report-file)).

File name: `team_members_<name>_export.csv` where `<name>` is the team name on the team path
(every character other than `a-z`, `A-Z`, `0-9`, `_` and `-` replaced by `_`) and the literal
`organization` on the organization-wide path (`team_members_organization_export.csv`).

| # | Header (`en`) | Header (`fr`) | Format | Meaning |
| --- | --- | --- | --- | --- |
| 1 | `Team ID` | `ID de l'équipe` | id | Id of the team. |
| 2 | `Team external ID` | `ID externe de l'équipe` | text | External id of the team (see [Teams](/reference/teams/)). Empty when none. |
| 3 | `Team name` | `Nom de l'équipe` | text | Name of the team. |
| 4 | `ID` | `ID` | id | Id of the user. |
| 5 | `External ID` | `ID externe` | text | External id of the user in the organization. Empty when none. |
| 6 | `First name` | `Prénom` | text | First name of the user. |
| 7 | `Last name` | `Nom` | text | Last name of the user. |
| 8 | `Email` | `Email` | email | First email address of the user. |
| 9 | `Role in team` | `Rôle dans l'équipe` | `Admin` / `Member` (`Admin` / `Membre`) | `Admin` when the user is an admin of the team, `Member` otherwise. |
| 10 | `Organization admin` | `Admin de l'organisation` | `Yes` / `No` (`Oui` / `Non`) | Whether the user is an admin of the organization. |

When no user is found, the file contains the header line followed by one line whose first cell
is `No users found`. When the data cannot be read, that line is
`Error occurred while fetching data`. Both come with status `200` and are always in English.

**Errors**

| Status | When |
| --- | --- |
| `400` | Organization-wide path: the key is not attached to an organization. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key and `team_id` is not one of its teams. |
| `404` | Team path: the team does not exist or belongs to another organization. |
| `500` | Unexpected error, including a `team_id` that is not a valid id. |

**Example**

```bash
curl -H "Authorization: YOUR_API_KEY" \
  -o team_members.csv \
  "https://api.vyte.in/v2/reports/team-members"
```

```
Team ID;Team external ID;Team name;ID;External ID;First name;Last name;Email;Role in team;Organization admin
5f1e9b2a8c4d3e00123456aa;AG-PARIS;Paris agency;5f1e9b2a8c4d3e0012345601;EMP-001;Jane;Doe;jane.doe@example.com;Admin;Yes
5f1e9b2a8c4d3e00123456aa;AG-PARIS;Paris agency;5f1e9b2a8c4d3e0012345602;;John;Smith;john.smith@example.com;Member;No
5f1e9b2a8c4d3e00123456ab;;Support;5f1e9b2a8c4d3e0012345602;;John;Smith;john.smith@example.com;Member;No
```

### Team appointment types report

`GET /v2/reports/team-appointment-types`

`GET /v2/teams/:team_id/reports/team-appointment-types`

Exports one row per appointment type attached to a covered team, active or not, with its public
URL and the weekly settings of its own availability. When an appointment type relies on a named
availability of each team member (`Team availability name`), only that name is reported: the
members' availabilities are exported by the
[Availability settings report](#availability-settings-report). Rows are sorted by team name,
then by appointment type name.

**Key scope:** organization, team. On the organization-wide path an `organization` scoped key
covers every team of the organization and a `team` scoped key covers its own teams. On the team
path only the team of the path is covered.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `team_id` | string | Team path only. Id of the team to export. The literal `all` is not supported for this report (see [The special team id `all`](#the-special-team-id-all)): use `GET /v2/reports/team-appointment-types`. |

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `lang` | string | no | `en` | Language of the headers and of the `Yes` / `No` values. Allowed values: `en`, `fr`. Any other value gives English. |
| `subdomain` | string | no | none | Builds every URL of the `Appointment type URL` column on `https://<subdomain>.vyte.in` instead of the default site of the booking page owner. Allowed characters: letters, digits, `-` and `_`. |

**Request body**

None.

**Response**

`200` with a CSV file (see [The Report file](#the-report-file)).

File name: `team_appointment_types_<name>_export.csv` where `<name>` is the team name (team
path) or the organization name (organization-wide path), every character other than `a-z`,
`A-Z`, `0-9`, `_` and `-` being replaced by `_`.

| # | Header (`en`) | Header (`fr`) | Format | Meaning |
| --- | --- | --- | --- | --- |
| 1 | `Team ID` | `ID de l'équipe` | id | Id of the team. |
| 2 | `Team name` | `Nom de l'équipe` | text | Name of the team. |
| 3 | `Appointment type ID` | `ID du type de rendez-vous` | id | Id of the appointment type. |
| 4 | `Appointment type name` | `Nom du type de rendez-vous` | text | Name of the appointment type. |
| 5 | `Appointment type URL` | `Lien du type de rendez-vous` | URL | Public booking URL: `<site>/<booking page nickname>/<appointment type handle>`. `<site>` is `https://<subdomain>.vyte.in` when `subdomain` is given, otherwise the branded site of the owner of the booking page, otherwise the default Vyte site. Empty when the booking page no longer exists. The URL is given even for inactive appointment types, which cannot be booked. |
| 6 | `Active` | `Actif` | `Yes` / `No` (`Oui` / `Non`) | Whether the appointment type is active. |
| 7 | `Private` | `Privé` | `Yes` / `No` (`Oui` / `Non`) | Whether the appointment type is private. |
| 8 | `Team availability name` | `Nom de la disponibilité d'équipe` | text | Name of the availability of each team member that the appointment type uses. Empty when none. |
| 9 | `Timezone` | `Fuseau horaire` | IANA name | Time zone of the appointment type's own availability. |
| 10 to 16 | `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday` | `Lundi`, `Mardi`, `Mercredi`, `Jeudi`, `Vendredi`, `Samedi`, `Dimanche` | multi-line text | Opening hours of that weekday, one `HH:mm - HH:mm` range per line, sorted by start time. Empty when the day is not enabled. |
| 17 | `Working days` | `Jours travaillés` | text | Enabled weekdays, abbreviated and separated by `, `: `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun` (`Lun`, `Mar`, `Mer`, `Jeu`, `Ven`, `Sam`, `Dim` in French). |
| 18 | `Same hours every working day` | `Mêmes horaires chaque jour travaillé` | `Yes` / `No` (`Oui` / `Non`) | `Yes` when at least one day is enabled and all enabled days have exactly the same hours. |
| 19 | `Start step (min)` | `Pas de début (min)` | integer or empty | Interval in minutes between two possible start times of a slot. |
| 20 | `Starts on the hour` | `Commence à l'heure pile` | `Yes` / `No` (`Oui` / `Non`) | `Yes` when the start step is set and is a multiple of 60. |
| 21 | `Has date-specific overrides` | `Exceptions par date` | `Yes` / `No` (`Oui` / `Non`) | `Yes` when the availability has date-specific ranges, which this report does not detail. |

Columns 9 to 21 are empty when the appointment type has no availability of its own.

Formula protection: in columns 2, 4 and 8, a value starting with `=`, `+`, `-`, `@`, a tab or a
carriage return is prefixed with a single quote (`'`) so that spreadsheet software does not
evaluate it as a formula. Strip a leading `'` if you need the raw value.

When there is no covered team or no appointment type, the file contains the header line followed
by one line whose first cell is `No appointment types found`. When the data cannot be read, that
line is `Error occurred while fetching data`. Both come with status `200` and are always in
English.

**Errors**

| Status | When |
| --- | --- |
| `400` | `subdomain` contains a character other than letters, digits, `-` and `_` (JSON body with a `message`). Organization-wide path: the key is not attached to an organization. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key and `team_id` is not one of its teams. |
| `404` | Team path: the team does not exist or belongs to another organization. Organization-wide path: the organization of the key no longer exists. |
| `500` | Unexpected error, including a `team_id` that is not a valid id. |

**Example**

```bash
curl -H "Authorization: YOUR_API_KEY" \
  -o team_appointment_types.csv \
  "https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e00123456aa/reports/team-appointment-types?subdomain=acme"
```

```
Team ID;Team name;Appointment type ID;Appointment type name;Appointment type URL;Active;Private;Team availability name;Timezone;Monday;Tuesday;Wednesday;Thursday;Friday;Saturday;Sunday;Working days;Same hours every working day;Start step (min);Starts on the hour;Has date-specific overrides
5f1e9b2a8c4d3e00123456aa;Paris agency;5f1e9b2a8c4d3e0012345678;Discovery call;https://acme.vyte.in/paris-agency/discovery-call;Yes;No;;Europe/Paris;09:00 - 17:00;09:00 - 17:00;09:00 - 17:00;09:00 - 17:00;09:00 - 17:00;;;Mon, Tue, Wed, Thu, Fri;Yes;60;Yes;No
5f1e9b2a8c4d3e00123456aa;Paris agency;5f1e9b2a8c4d3e0012345679;Showroom visit;https://acme.vyte.in/paris-agency/showroom-visit;No;Yes;Showroom;;;;;;;;;;;;;
```

## Notes and caveats

- **CSV only, synchronous.** No report can be requested as JSON or XLSX, none is emailed, and
  there is nothing to poll. Parse the body as semicolon-delimited CSV with a UTF-8 byte order
  mark and support quoted multi-line cells.
- **Status `200` does not guarantee a complete file.** The status is sent before the data is
  read. `availability-settings`, `team-members` and `team-appointment-types` signal a late
  failure with a single line after the headers, whose first cell is
  `Error occurred while fetching data`; an empty result is signalled the same way with
  `No users found` or `No appointment types found`. Check the first cell of the second line
  before processing these files. For `events` and `availability`, a late failure shows as a
  truncated or empty body or a broken connection.
- **`from` and `to` filter on the booking date** (creation of the event), not on the date of the
  appointment. To get the appointments taking place in a period, export a wider booking range
  and filter on the `Appointment Date` column.
- **Locate columns by header.** The events report appends a variable number of metadata columns,
  and its fixed columns depend on `template`.
- **Languages differ per report.** `availability-settings`, `team-members` and
  `team-appointment-types` take `lang` (`en` or `fr`). `events` has no `lang` parameter (English,
  with the cancellation columns in French for French-language organizations on the
  organization-wide path). `availability` is always in French.
- **Date formats differ per report.** Events: `YYYY-MM-DD` and `HH:mm`. Availability date line:
  `DD/MM`. File names of `events` and `availability`: `YYYY-M-D` without zero padding.
- **File names of `events` and `availability` are not reliable.** They embed the raw team or
  organization name, and the name part is not meaningful with a `team` scoped key on the
  organization-wide path or with `all`. Choose your own output file name instead of relying on
  the `Content-Disposition` header.
- **The availability report shows theoretical slots.** It ignores calendars and existing
  bookings. Its date line is only written when the first user processed has an availability, so
  it can be missing; the mapping between weekday columns and dates can then be rebuilt from the
  generation date (the period is the 7 days starting on the day of the call).
- **`all` is not equivalent to the organization-wide path.** It covers the members of the
  organization's teams only, and is not supported by `team-members` and `team-appointment-types`.
- **Team membership.** User-based reports on a team cover the members of the team, not its admins
  who are not also members. The team members report lists both.
- **No pagination and no enforced limit.** Keep date ranges reasonable and allow long timeouts
  for large organizations.
