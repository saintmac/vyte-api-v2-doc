---
{ "pageClass": "reference-page" }
---

# Endpoint index

Flat list of every endpoint of the Vyte API v2, grouped by resource. The "Key scope" column lists the API key scopes accepted (see [Conventions](/reference/#api-key-scopes)). Follow the resource link for parameters, responses and errors.

All paths are relative to `https://api.vyte.in`.

## Authentication

Documented in [Conventions](/reference/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/auth/test` | Check a key and return its organization | organization, team, user |
| `GET` | `/v2/auth/key/deactivate` | Permanently deactivate the key used for the call | organization, team, user |

## Users

Documented in [Users](/reference/users/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/users` | List users | organization, team, user |
| `POST` | `/v2/users` | Create or update a user | organization |
| `GET` | `/v2/users/:user_id` | Retrieve a user | organization, team, user |
| `PUT` | `/v2/users/:user_id` | Update a user | organization, team, user |
| `DELETE` | `/v2/users/:user_id` | Remove a user from the organization | organization |
| `POST` | `/v2/users/batch` | Batch create or update users | organization |
| `PUT` | `/v2/users/batch` | Alias of `POST /v2/users/batch` (same behaviour) | organization |
| `PUT` | `/v2/users/:user_id/modules` | Set the modules of a user | organization, team, user |
| `GET` | `/v2/users/:user_id/email/update` | Change the email of a user | organization, team, user |
| `GET` | `/v2/users/:user_id/token` | Get a token to authenticate a user | organization, team, user |

## User preferences

Documented in [User preferences](/reference/user_preference/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/users/:user_id/preferences` | Retrieve the preferences of a user | organization, team, user |
| `PUT` | `/v2/users/:user_id/preferences` | Update (or create) the preferences of a user | organization, team, user |

## Assistant

Documented in [Assistant](/reference/assistant/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/users/:user_id/assistant` | Check whether the user has an assistant access | organization, user |
| `PUT` | `/v2/users/:user_id/assistant` | Create the assistant access or change its password | organization, user |

## Group scheduling options

Documented in [Group Pro](/reference/group-pro/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/users/:user_id/group-pro` | Retrieve the Group Pro defaults of a user | organization, user |
| `PUT` | `/v2/users/:user_id/group-pro` | Update (or create) the Group Pro defaults of a user | organization, user |

## Video conferencing

Documented in [Video conferencing (Webex and Zoom)](/reference/video-conferencing/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/users/:user_id/webex` | Check the Webex connection of a user | organization, team, user |
| `GET` | `/users/webex/setup` | Start connecting a Webex account (browser redirect, not under `/v2`) | user token |
| `DELETE` | `/v2/users/:user_id/webex` | Remove the Webex connection of a user | organization, team, user |
| `GET` | `/v2/users/:user_id/zoom` | Check the Zoom connection of a user | organization, team, user |
| `GET` | `/users/zoom/setup` | Start connecting a Zoom account (browser redirect, not under `/v2`) | user token |
| `DELETE` | `/v2/users/:user_id/zoom` | Remove the Zoom connection of a user | organization, team, user |

## Calendars

Documented in [Calendars](/reference/calendars/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/users/:user_id/calendars` | Retrieve (and refresh) the calendar list of a user | organization, team, user |
| `PUT` | `/v2/users/:user_id/calendars` | Update the calendar settings of a user | organization, team, user |
| `DELETE` | `/v2/users/:user_id/calendars/:calendar_id` | Disconnect a calendar from a user | organization, team, user |
| `GET` | `/v2/users/:user_id/calevents` | List the calendar events of a user (requires the `calevents` permission) | organization, team, user |

## Calendars of interest

Documented in [Calendars of interest](/reference/calendar-of-interests/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/calendar-of-interests` | List the calendars of interest available to the organization | organization |
| `POST` | `/v2/calendar-of-interests` | Create a calendar of interest | organization |
| `PUT` | `/v2/calendar-of-interests/:calendar_of_interest_id` | Update a calendar of interest and its sub-calendars | organization |
| `DELETE` | `/v2/calendar-of-interests/:calendar_of_interest_id` | Delete a calendar of interest | organization |
| `POST` | `/v2/calendar-of-interests/:calendar_of_interest_id/rules` | Create a rule | organization |
| `PUT` | `/v2/calendar-of-interests/:calendar_of_interest_id/rules/:cal_event_rule_id` | Update a rule | organization |
| `DELETE` | `/v2/calendar-of-interests/:calendar_of_interest_id/rules/:cal_event_rule_id` | Delete a rule | organization |
| `POST` | `/v2/calendar-of-interests/:calendar_of_interest_id/add_to/org` | Add the calendar to every member of the organization | organization |
| `GET` | `/v2/calendar-of-interests/:calendar_of_interest_id/add_to/org` | Alias of the `POST` above (same effect) | organization |
| `DELETE` | `/v2/calendar-of-interests/:calendar_of_interest_id/add_to/org` | Remove the calendar from every member of the organization | organization |
| `POST` | `/v2/calendar-of-interests/:calendar_of_interest_id/add_to/team/:team_id` | Add the calendar to every member of a team | organization |
| `GET` | `/v2/calendar-of-interests/:calendar_of_interest_id/add_to/team/:team_id` | Alias of the `POST` above (same effect) | organization |
| `DELETE` | `/v2/calendar-of-interests/:calendar_of_interest_id/add_to/team/:team_id` | Remove the calendar from every member of a team | organization |
| `POST` | `/v2/calendar-of-interests/:calendar_of_interest_id/add_to/user/:user_id` | Add the calendar to one user | organization |
| `GET` | `/v2/calendar-of-interests/:calendar_of_interest_id/add_to/user/:user_id` | Alias of the `POST` above (same effect) | organization |
| `DELETE` | `/v2/calendar-of-interests/:calendar_of_interest_id/add_to/user/:user_id` | Remove the calendar from one user | organization |

## Availabilities

Documented in [Availabilities](/reference/availabilities/).

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

## Booking pages (Vytemes)

Documented in [Booking pages (Vytemes)](/reference/vytemes/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `POST` | `/v2/vytemes` | Create the booking page of a user (or update it if the user already has one) | organization, team, user |
| `GET` | `/v2/vytemes/:nickname` | Retrieve a booking page by nickname | organization, team, user |
| `PUT` | `/v2/vytemes/:nickname` | Update a booking page | organization, team, user |
| `DELETE` | `/v2/vytemes/:nickname` | Delete a booking page | organization, team, user |
| `GET` | `/v2/users/:user_id/vyteme` | Retrieve the primary booking page of a user | organization, team, user |
| `GET` | `/v2/users/:user_id/vytemes` | List all booking pages of a user | organization, team, user |

## Appointment types

Documented in [Appointment types](/reference/appointment-types/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/vytemes/:nickname/types` | List the appointment types of a booking page | organization, team, user |
| `POST` | `/v2/vytemes/:nickname/types` | Create an appointment type | organization, team, user |
| `GET` | `/v2/vytemes/:nickname/types/:handle` | Retrieve an appointment type | organization, team, user |
| `PUT` | `/v2/vytemes/:nickname/types/:handle` | Update an appointment type | organization, team, user |
| `DELETE` | `/v2/vytemes/:nickname/types/:handle` | Delete an appointment type | organization, team, user |
| `POST` | `/v2/appointmenttypes/update/batch` | Apply the same changes to all appointment types sharing a handle | organization, team, user |

## Slots

Documented in [Slots](/reference/slots/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/slots` | Free slots as one flat list | organization, team, user |
| `GET` | `/v2/slots/days` | Free slots grouped per day | organization, team, user |
| `GET` | `/v2/slots/best` | A short selection of the best slots (5) | organization, team, user |
| `GET` | `/v2/slots/best/:nSlots` | A short selection of the best `nSlots` slots | organization, team, user |
| `GET` | `/v2/slots/next` | The next available slot only | organization, team, user |

## Busy times

Documented in [Busy](/reference/busy/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/busy` | Busy periods of users or teams over a date range | organization, team, user |

## Events

Documented in [Events](/reference/events/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/events` | List the events of the users reachable by the key | organization, team, user |
| `POST` | `/v2/events` | Create a booking or a group-scheduling event | organization, team, user |
| `GET` | `/v2/events/:event_id` | Retrieve an event | organization, team, user |
| `PUT` | `/v2/events/:event_id` | Replace the dates and/or places of an event | organization, team, user |
| `POST` | `/v2/events/:event_id/confirm` | Confirm an event | organization, team, user |
| `POST` | `/v2/events/:event_id/cancel` | Cancel an event | organization, team, user |
| `POST` | `/v2/events/:event_id/admin` | Change the organizer of an event | organization, team, user |
| `POST` | `/v2/events/:event_id/title` | Change the title of an event | organization, team, user |
| `POST` | `/v2/events/:event_id/invitees` | Add invitees to an event | organization, team, user |
| `DELETE` | `/v2/events/:event_id/invitees/:invitee_id` | Remove an invitee from an event | organization, team, user |
| `GET` | `/v2/events/:event_id/links` | Personal event-page link of each invitee | organization, team, user |
| `GET` | `/v2/events/:event_id/ics` | Download the iCalendar file of a confirmed event | organization, team, user |
| `GET` | `/v2/events/:event_id/ics-links` | iCalendar download link of each invitee | organization, team, user |
| `POST` | `/v2/events/slots/ensure-available` | Check that a slot is still free for a user, without creating anything | organization, team, user |
| `GET` | `/v2/teams/:team_id/events` | List the events of the members of a team | organization, team |
| `POST` | `/v2/teams/:team_id/events` | Book a team: a member is assigned automatically | organization, team |
| `POST` | `/v2/teams/:team_id/events/slots/ensure-available` | Check that a slot is still free for a team, without creating anything | organization, team, user |

## Teams

Documented in [Teams](/reference/teams/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/teams` | List teams | organization, team |
| `POST` | `/v2/teams` | Create or update a team (upsert on `extid`) | organization |
| `POST` | `/v2/teams/batch` | Create or update several teams | organization |
| `GET` | `/v2/teams/:team_id` | Retrieve a team | organization, team |
| `PUT` | `/v2/teams/:team_id` | Update a team | organization, team |
| `DELETE` | `/v2/teams/:team_id` | Delete a team | organization, team |
| `POST` | `/v2/teams/:team_id/members` | Add members to a team | organization |
| `DELETE` | `/v2/teams/:team_id/members/:member_id` | Remove a user from a team | organization |
| `POST` | `/v2/teams/:team_id/members/:member_id/admin` | Make a user an admin of a team | organization |
| `DELETE` | `/v2/teams/:team_id/members/:member_id/admin` | Remove the admin role of a user | organization |
| `POST` | `/v2/teams/:team_id/members/:member_id/admin-only` | Make a user an admin-only of a team | organization |
| `DELETE` | `/v2/teams/:team_id/members/:member_id/admin-only` | Remove the admin role of a user (alias) | organization |
| `GET` | `/v2/teams/:team_id/public` | Retrieve the public view of a team | none (no API key) |

## Team admin preferences

Documented in [Team admin preferences](/reference/team_admin_preferences/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/teams/:team_id/admin-preferences` | Retrieve the admin preferences of a team | organization, team |
| `POST` | `/v2/teams/:team_id/admin-preferences` | Set the admin preferences of a team | organization, team |
| `PUT` | `/v2/teams/:team_id/admin-preferences` | Set the admin preferences of a team (alias of `POST`) | organization, team |

## Locators

Documented in [Locators](/reference/locators/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/locators` | List the locators of the organization | organization |
| `POST` | `/v2/locators` | Create a locator, or replace the one that has the same handle, optionally with its locations | organization |
| `GET` | `/v2/locators/:handle` | Retrieve a locator by its handle | public (no key) |
| `PUT` | `/v2/locators/:locator_id` | Update a locator | organization |
| `DELETE` | `/v2/locators/:locator_id` | Delete a locator | organization |

## Locations

Documented in [Locations](/reference/locations/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/locators/:locator_id/locations` | List the locations of a locator | organization |
| `POST` | `/v2/locators/:locator_id/locations` | Create a location (or update the one with the same `extid`) | organization |
| `GET` | `/v2/locators/:locator_id/locations/:location_id` | Retrieve a location | organization |
| `PUT` | `/v2/locators/:locator_id/locations/:location_id` | Update a location | organization |
| `DELETE` | `/v2/locators/:locator_id/locations/:location_id` | Delete a location | organization |

## Webhooks

Documented in [Webhooks](/reference/webhooks/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/hooks` | List the webhooks visible to the key | organization, team, user |
| `POST` | `/v2/hooks` | Create a webhook | organization, team, user |
| `GET` | `/v2/hooks/:hook_id` | Retrieve a webhook | organization, team, user |
| `PUT` | `/v2/hooks/:hook_id` | Update (and re-enable) a webhook | organization, team, user |
| `DELETE` | `/v2/hooks/:hook_id` | Delete a webhook | organization, team, user |

## Reports

Documented in [Reports](/reference/reports/).

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/reports/events` | Events booked with the covered users, by booking date | organization, team, user |
| `GET` | `/v2/teams/:team_id/reports/events` | Same report for the members of one team | organization, team |
| `GET` | `/v2/reports/availability` | Bookable slots of the covered users for the next 7 days | organization, team, user |
| `GET` | `/v2/teams/:team_id/reports/availability` | Same report for the members of one team | organization, team |
| `GET` | `/v2/reports/availability-settings` | Weekly availability settings of the covered users | organization, team, user |
| `GET` | `/v2/teams/:team_id/reports/availability-settings` | Same report for the members of one team | organization, team |
| `GET` | `/v2/reports/team-members` | Admins and members of every covered team | organization, team |
| `GET` | `/v2/teams/:team_id/reports/team-members` | Same report for one team | organization, team |
| `GET` | `/v2/reports/team-appointment-types` | Appointment types of every covered team, with their availability settings | organization, team |
| `GET` | `/v2/teams/:team_id/reports/team-appointment-types` | Same report for one team | organization, team |
