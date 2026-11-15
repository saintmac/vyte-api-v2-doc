---
{ "pageClass": "reference-page" }
---

# Events

:::::panel

:::: left
An Event is a meeting managed by Vyte. It is the central resource of the API: it holds the proposed dates and places, the people involved (one organizer and the invitees), the conversation, and the state of the meeting (pending, confirmed, cancelled). An event is either a **booking** (`vyteme: true`: a visitor books a [User](/reference/users/) or a [Team](/reference/teams/), usually through a [Booking page](/reference/vytemes/) and an [Appointment type](/reference/appointment-types/), on a free [Slot](/reference/slots/)) or a **group-scheduling event** (`vyteme: false`: an organizer proposes several dates and/or places and the invitees vote before the organizer confirms one). Creating, confirming and cancelling events writes to the connected [Calendars](/reference/calendars/) of the participants, sends emails, and fires [Webhooks](/reference/webhooks/). Answers to booking questions come from Forms.

Authentication, API key scopes, date formats, languages and error conventions are described in [Conventions](/reference/) and are not repeated here.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/events" href="#list-events"></endpoint>
  <endpoint method="post" path="/v2/events" href="#create-an-event"></endpoint>
  <endpoint method="get" path="/v2/events/:event_id" href="#retrieve-an-event"></endpoint>
  <endpoint method="put" path="/v2/events/:event_id" href="#update-the-dates-and-places-of-an-event"></endpoint>
  <endpoint method="post" path="/v2/events/:event_id/confirm" href="#confirm-an-event"></endpoint>
  <endpoint method="post" path="/v2/events/:event_id/cancel" href="#cancel-an-event"></endpoint>
  <endpoint method="post" path="/v2/events/:event_id/admin" href="#change-the-organizer-of-an-event"></endpoint>
  <endpoint method="post" path="/v2/events/:event_id/title" href="#change-the-title-of-an-event"></endpoint>
  <endpoint method="post" path="/v2/events/:event_id/invitees" href="#add-invitees-to-an-event"></endpoint>
  <endpoint method="delete" path="/v2/events/:event_id/invitees/:invitee_id" href="#remove-an-invitee-from-an-event"></endpoint>
  <endpoint method="get" path="/v2/events/:event_id/links" href="#get-the-invitees-event-page-links"></endpoint>
  <endpoint method="get" path="/v2/events/:event_id/ics" href="#download-the-icalendar-file-of-an-event"></endpoint>
  <endpoint method="get" path="/v2/events/:event_id/ics-links" href="#get-the-invitees-icalendar-links"></endpoint>
  <endpoint method="post" path="/v2/events/slots/ensure-available" href="#check-that-a-slot-is-still-available-for-a-user"></endpoint>
  <endpoint method="get" path="/v2/teams/:team_id/events" href="#list-the-events-of-a-team"></endpoint>
  <endpoint method="post" path="/v2/teams/:team_id/events" href="#book-a-team"></endpoint>
  <endpoint method="post" path="/v2/teams/:team_id/events/slots/ensure-available" href="#check-that-a-slot-is-still-available-for-a-team"></endpoint>
</endpoints>
::::

:::::

## Booking or group scheduling: the `vyteme` flag

| | Booking (`vyteme: true`) | Group scheduling (`vyteme: false`, default) |
|---|---|---|
| Typical use | A visitor takes an appointment with a user or a team member. | A user organizes a meeting with several people and lets them vote. |
| `created_by` (the organizer) | The **booked** user (the one whose availability is exposed). Not the visitor. | The user who organizes the meeting. |
| `invitees[0]` | The visitor who books. The organizer is appended automatically at the end of `invitees`. | Any invitee. The organizer is appended automatically at the end of `invitees`. |
| `title` | Optional. When omitted it is generated (see [title placeholders](#title-placeholders)). | Required. |
| Author of the first message, of the dates and of the places sent at creation | The visitor (`invitees[0]`). | The organizer. |
| Availability check at creation | Yes: the request fails with `410` when the organizer is not free (see [Availability check](#availability-check-on-creation)). | No check. |
| Options inherited | Those of the appointment type (`appointment_type`), else of the booking page (`vyteme_page`), else of the organizer's default booking page. | None. |
| Emails | Booking request / booking confirmation emails to the visitor and the organizer. | Invitation to vote sent to the invitees. |

An event is automatically a booking as soon as `appointment_type` or `vyteme_page` is set at creation.

## Life cycle

```
                 POST /v2/events                       POST /v2/events (confirmed.flag = true,
                 (no confirmed.flag)                    or booking page with automatic confirmation)
                        |                                              |
                        v                                              v
                   +---------+     POST .../confirm              +-----------+
                   | PENDING | --------------------------------> | CONFIRMED | <--+ POST .../confirm again
                   +---------+                                   +-----------+ ---+ (other date / place)
                        |                                              |
                        | POST .../cancel                              | POST .../cancel
                        v                                              v
                                    +-----------+
                                    | CANCELLED |   (final through this API)
                                    +-----------+
```

| State | How to recognise it | Meaning |
|---|---|---|
| Pending | `confirmed.flag` is `false` and `cancelled` is absent | Dates and places are proposals. Invitees can vote on the event page. The proposed dates are held as tentative entries in the participants' connected calendars. |
| Confirmed | `confirmed.flag` is `true` and `cancelled` is absent | One date (`confirmed.date_id`) and, when there are places, one place (`confirmed.place_id`) are final. The meeting is written in the organizer's calendar and the invitees receive an invitation. |
| Cancelled | `cancelled` is present (a date-time) | The meeting will not take place. `confirmed.flag` keeps the value it had before the cancellation. |

Other changes do not change the state: `PUT /v2/events/:event_id` (replace dates/places), `POST .../title`, `POST .../admin` (change organizer), `POST .../invitees`, `DELETE .../invitees/:invitee_id`.

There is no endpoint to delete an event, to un-confirm it or to un-cancel it. Use cancel.

## The Event object

"Writable" values: **create-only** = accepted in the body of `POST /v2/events` and `POST /v2/teams/:team_id/events` only; **yes** = can also be changed later through the endpoint named in the description; **no** = read-only, set by Vyte.

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string | no | Id of the event (24 hexadecimal characters). |
| `title` | string | yes | Title of the meeting. Leading and trailing spaces are removed and HTML is sanitized. Required at creation for group-scheduling events, optional for bookings (see [title placeholders](#title-placeholders)). Changed with `POST /v2/events/:event_id/title`. |
| `vyteme` | boolean | create-only | `true` for a booking, `false` or absent for a group-scheduling event. Forced to `true` when `appointment_type` or `vyteme_page` is set. See [the `vyteme` flag](#booking-or-group-scheduling-the-vyteme-flag). |
| `created_by` | object | yes | The organizer of the event. Changed with `POST /v2/events/:event_id/admin`. |
| `created_by.user` | string | yes | Id of the organizer [User](/reference/users/). At creation, send `created_by.user` or `created_by.email`. |
| `created_by.email` | string | yes | Email of the organizer (lowercased, trimmed). When only the email is sent at creation it must be the email of an existing user. Filled from the user when only `user` is sent. |
| `created_by.full_name` | string | no | Full name of the organizer, copied from the user. |
| `created_by.picture_url` | string | no | Picture of the organizer, when there is one. |
| `invitees[]` | array of objects | yes | The participants, organizer included. See [The Invitee object](#the-invitee-object). Added with `POST .../invitees`, removed with `DELETE .../invitees/:invitee_id`. |
| `dates[]` | array of objects | yes | The proposed dates. See [The Date object](#the-date-object). Always returned sorted by start then end. Replaced with `PUT /v2/events/:event_id`. |
| `places[]` | array of objects | yes | The proposed places. See [The Place object](#the-place-object). Replaced with `PUT /v2/events/:event_id`. |
| `messages[]` | array of objects | create-only | The conversation of the event. See [The Message object](#the-message-object). At creation only the first element is meaningful: it is the initial message, quoted in the first email. Messages are added later by the `message` field of confirm and cancel, and by participants on the event page or by email reply. |
| `confirmed` | object | yes | Confirmation state. |
| `confirmed.flag` | boolean | yes | `true` once the event is confirmed. Default `false`. Send `true` at creation to create an already confirmed event. Set later with `POST .../confirm`. |
| `confirmed.updated_at` | string (date-time) or null | no | When the event was last confirmed. `null` while it has never been confirmed. |
| `confirmed.date_id` | string | no | `_id` of the confirmed element of `dates[]`. |
| `confirmed.place_id` | string | no | `_id` of the confirmed element of `places[]`. Absent when the event has no place. |
| `cancelled` | string (date-time) | no | Present only when the event is cancelled: date of the cancellation. Set with `POST .../cancel`. |
| `cancelled_by` | string | no | Id of the user recorded as author of the cancellation. Through this API it is always the organizer. |
| `declines[]` | array of objects | no | Invitees who declined the meeting on the event page: `declines[].user` is the user id. |
| `timezone` | string | create-only | IANA timezone of the event (for example `Europe/Paris`), used to render dates in emails, in calendar entries and on the event page. Default at creation: the timezone fixed by the booking page or appointment type when it fixes one, else the timezone of the organizer's main availability, else the organizer's timezone, else `Europe/Paris`. |
| `lang` | string | create-only | Language of the emails and of the event page: two-letter code (only the first two characters are kept, so `fr-FR` becomes `fr`). Supported: `de`, `en`, `es`, `fr`, `it`, `nl`, `pl`, `pt`, `sv`, `ru`. Default `en`. A booking page or appointment type that fixes a language overrides the value sent. |
| `locale` | string | create-only | Locale used to format dates and times: two-letter code (truncated like `lang`). Default: the value of `lang`. |
| `appointment_type` | string | create-only | Id of the [Appointment type](/reference/appointment-types/) booked. Makes the event a booking, fills `appointment_type_name` and `vyteme_page`, and applies the options of the appointment type (automatic confirmation, default place, automatic message, reminders, email options, default metadata). |
| `appointment_type_name` | string | no | Name of the appointment type at the time of the booking. |
| `vyteme_page` | string | create-only | Id of the [Booking page](/reference/vytemes/) the booking belongs to. Makes the event a booking and applies the options of the page when no appointment type is given. Filled automatically from `appointment_type`. |
| `availability` | string | create-only | Id of the [Availability](/reference/availabilities/) the booking is made on. Used by the availability check; default: the availability of the appointment type, else of the booking page. |
| `team_availability_name` | string | create-only | For team bookings: name of the availability to use for every team member. Default: the one of the appointment type. |
| `buffer_before` | number | no | Minutes kept free before the meeting, copied from the availability at booking time. |
| `buffer_after` | number | no | Minutes kept free after the meeting, copied from the availability at booking time. |
| `form_id` | string | create-only | Id of a Form holding the answers given by the visitor. The answers are merged into `metadata`. |
| `metadata` | object | create-only | Free key/value data attached to the event: answers to the booking questions (from `form_id`), tracking parameters (`utm_source`, ...), and any key you send. Default values defined on the booking page / appointment type are added for the keys you do not send. |
| `pretty_metadata` | object | no | Display version of `metadata`: keys replaced by the label of the question (the `utm_` prefix is removed), values converted to text, empty values dropped. |
| `description` | string | no | Text generated from the invitees' company / phone / email and from `pretty_metadata` (one `label: value` per line). It is used as the description of the calendar entry. |
| `attachments[]` | array of strings | no | Ids of the files uploaded in the form. |
| `third_party` | object | create-only | Reference to the external application the event comes from. See Third parties. |
| `third_party.app` | string | create-only | Id of the third-party application. Filterable with `app_id`. |
| `third_party.name` | string | create-only | Name of the third-party application. |
| `third_party.group_ids[]` | array of strings | create-only | Your own grouping identifiers (project id, customer id, ...). Filterable with `group_ids`. |
| `alias` | string | create-only | Your own unique identifier for the event, used for de-duplication at creation: see [Idempotent creation with `alias`](#idempotent-creation-with-alias). |
| `confirmation_message` | string | create-only | Text automatically posted as a message, and included in the confirmation email, the first time the event is confirmed with `POST .../confirm` without a `message`. May contain placeholders <code v-pre>{{date}}</code>, <code v-pre>{{time}}</code>, <code v-pre>{{address}}</code>, <code v-pre>{{event_admin}}</code>, or <code v-pre>{{&lt;key&gt;}}</code> for a key of `metadata`. HTML is sanitized. |
| `settings` | object | create-only | Per-event options. Normally inherited from the booking page / appointment type; can be sent at creation. See [Event settings](#event-settings). |
| `reminders[]` | array of strings | no | Ids of the reminders that will be sent to the invitees before the meeting. Inherited from the booking page / appointment type. |
| `conference_data` | object | no | Present when a video-conference was generated at confirmation. See [Video-conference places](#video-conference-places). |
| `conference_data.source` | string | no | Provider of the meeting. |
| `conference_data.link` | string | no | URL to join the meeting. Also copied in the `address` of the confirmed place. |
| `conference_data.conf_id` | string | no | Identifier of the meeting at the provider. |
| `categories[]` | array of strings | no | Calendar categories of the meeting. |
| `attendance_status` | string | no | `scheduled` (default), `occurred` or `no_show`. |
| `session` | boolean | no | `true` when the event is a group session (several visitors register for the same slot). Copied from the appointment type. |
| `session_max_spots` | number | no | Number of seats of the group session. |
| `email` | string | no | Email address of the event conversation: an email sent to it is posted as a message of the event. Absent when messages are disabled on the event. |
| `first_start_date` | string (date-time) | no | Start of the confirmed date when confirmed, else start of the earliest proposed date. |
| `last_end_date` | string (date-time) | no | End of the confirmed date when confirmed, else end of the latest proposed date. Used by the `filter` parameter of the list endpoint. |
| `reassigned` | boolean | no | `true` once the organizer has been changed with `POST .../admin`. |
| `anonymised` | boolean | no | `true` once the personal data of the event has been erased by a data-retention policy. |
| `api` | boolean | no | `true` when the event was created with an API key. |
| `org` | string | no | Id of the organization the event belongs to. |
| `links` | object or null | no | `null`, except on the list endpoints called with `includeInviteesLinks=true`: map of user id to personal event-page URL. |
| `createdAt` | string (date-time) | no | Creation date. Note the camelCase name. |
| `updatedAt` | string (date-time) | no | Last modification date. Note the camelCase name. |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

### The Invitee object

Element of `invitees[]`. The organizer is always one of the invitees.

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string | no | Id of the invitee **within the event**. This is the `:invitee_id` of the delete endpoint. It is not a user id. |
| `user` | string | create-only | Id of the Vyte user behind the invitee. Every invitee has one: when an `email` is not known yet, a user record is created for it automatically. Send `user` instead of `email` to invite an existing user by id. |
| `email` | string | create-only | Email (lowercased, trimmed). Required unless `user` is sent. When `user` is sent without `email`, the first email of that user is used. |
| `full_name` | string | create-only | Full name. When omitted: `first_name + " " + last_name` if sent, else the name already known for this email. |
| `first_name` | string | create-only | First name. |
| `last_name` | string | create-only | Last name. |
| `phone` | string | create-only | Phone number. Every character other than digits and `+` is removed. For an existing user who has a phone number, the user's number replaces the value sent. |
| `phone_country` | string | create-only | Two-letter country code of the phone number, for example `fr`. |
| `company` | string | create-only | Company of the invitee. |
| `metadata` | object | create-only | Free data attached to this invitee. |
| `alias` | string | create-only | Your own identifier for the invitee. When it starts with `alias_` it can be used in place of `_id` in the path of the delete endpoint. |
| `timezone` | string | no | Timezone of the invitee, copied from the user when known. |
| `locale` | string | no | Language of the invitee, copied from the user when known. |
| `picture_url` | string | no | Picture of the invitee, when known. |
| `is_place` | boolean | no | `true` when the invitee is a bookable resource (a room, a piece of equipment) rather than a person. |
| `created_by.user` | string | no | Id of the user who added this invitee. |
| `createdAt`, `updatedAt` | string (date-time) | no | Timestamps. |

Two invitees resolving to the same user are merged: the duplicate is dropped.

### The Date object

Element of `dates[]`.

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string | no | Id of the date. Value to send as `d` when confirming. |
| `date` | string (date-time) | yes | Start. ISO 8601, preferably with an offset (`2028-02-09T16:45:00+01:00`). Returned in UTC. |
| `end_date` | string (date-time) | yes | End. Required for a timed date. |
| `all_day` | boolean | yes | `true` for a whole-day date. Default `false`. |
| `description` | string | yes | Optional label of the date. |
| `alias` | string | yes | Your own identifier. When it starts with `alias_` it can be sent as `d` when confirming. |
| `confirmed` | boolean | no | `true` on the confirmed date. |
| `created_by.user` | string | no | Id of the user who proposed the date. |
| `votes.yes[]` | array of objects | no | Positive votes: `votes.yes[].created_by.user` is the voter's user id. The author of a date automatically votes yes for it. |
| `votes.no[]` | array of objects | no | Negative votes, same shape. |
| `createdAt`, `updatedAt` | string (date-time) | no | Timestamps. |

Two dates with the same start, end and description are merged.

### The Place object

Element of `places[]`.

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string | no | Id of the place. Value to send as `p` when confirming. |
| `name` | string | yes | Name of the place (`"Head office"`, `"Phone call"`, `"Zoom"`). |
| `address` | string | yes | Postal address, URL, phone number, or any text locating the meeting. Leave empty for a video-conference place: it is filled with the join link at confirmation. |
| `latitude` | number | yes | Latitude of the place. |
| `longitude` | number | yes | Longitude of the place. |
| `source` | string | yes | Origin of the place. Default `app`. Use `Zoom`, `Webex` or `kMeet` to request a video-conference (see below). |
| `source_id` | string | yes | Identifier of the place at its source. |
| `icon` | string | yes | Icon of the place. |
| `alias` | string | yes | Your own identifier. When it starts with `alias_` it can be sent as `p` when confirming. |
| `created_by.user` | string | no | Id of the user who proposed the place. |
| `votes.yes[]`, `votes.no[]` | array of objects | no | Votes, same shape as for dates. |
| `createdAt`, `updatedAt` | string (date-time) | no | Timestamps. |

Two places with the same name and address are merged. When a booking is created without `places` and the booking page / appointment type defines a place, that place is used.

#### Video-conference places

When the **confirmed** place designates a video-conference provider and has an empty `address`, Vyte creates the online meeting at confirmation time, writes the join URL in the `address` of the place and fills `conference_data`.

| Provider | How the place designates it | Requirement |
|---|---|---|
| Zoom | `source` or `name` equal to `Zoom` | The organizer has connected a Zoom account. See [Video conferencing](/reference/video-conferencing/). |
| Webex | `source` or `name` equal to `Webex` | The organizer has connected a Webex account. See [Video conferencing](/reference/video-conferencing/). |
| Google Meet | `source` or `name` containing `Google Meet` or `Hangouts` (case-insensitive) | The organizer has a connected Google calendar. The link is created with the calendar entry. |
| Microsoft Teams | `source` or `name` containing `Teams` or `Office365` (case-insensitive) | The organizer has a connected Microsoft calendar or a Microsoft Teams connection. |
| kMeet | `source` equal to `kMeet`, or `name` containing `kmeet` (case-insensitive) | None. A room is generated. |

Rules: a place that already has an `address` is left untouched (it is treated as a plain location, or as an existing meeting link). When the event is cancelled, the Zoom, Webex or Microsoft Teams meeting is deleted and the `address` of the place is emptied. When a confirmed Webex event is confirmed again on another date, the existing meeting is rescheduled and keeps its link. An `address` containing an email address is discarded at confirmation.

### The Message object

Element of `messages[]`.

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string | no | Id of the message. |
| `body` | string | create-only | Text of the message. HTML is sanitized. |
| `from` | string | no | Email of the author. For the initial message: the visitor's email for a booking, the organizer's email otherwise. |
| `created_by.user` | string | no | Id of the author. |
| `creation` | boolean | no | `true` on the initial message sent at creation. |
| `confirmation` | boolean | no | `true` on a message added by `POST .../confirm` (or generated from `confirmation_message`). |
| `cancellation` | boolean | no | `true` on a message added by `POST .../cancel`. |
| `createdAt`, `updatedAt` | string (date-time) | no | Timestamps. |

When a booking is created without message and the booking page / appointment type defines an automatic message, that message is added.

### Event settings

All fields are optional booleans unless stated otherwise, default absent (= `false`). For a booking they are first filled from the options of the appointment type or booking page; a value sent in the body is kept unless the page option forces it to `true`.

| Field | Type | Description |
|---|---|---|
| `settings.no_emails` | boolean | No email at all is sent about this event, to anyone, at any stage. |
| `settings.no_invitation_email` | boolean | The initial invitation email of a **pending** event is not sent. Later emails (confirmation, cancellation) are still sent. |
| `settings.email_only_admin` | boolean | Only the organizer receives emails about this event. |
| `settings.hide_messages` | boolean | Disables the conversation: the event has no conversation email address. |
| `settings.reply_to_organizer` | boolean | Replies to the emails of the event go to the organizer instead of all participants. |
| `settings.no_calendar_description` | boolean | The calendar entry is written without description. |
| `settings.calendar_send_updates` | string | For Google Calendar only: whether Google itself notifies the attendees when the calendar entry is written. `all` or `none`. Default `none`. |
| `settings.block_new.date` | boolean | Invitees other than the organizer cannot propose new dates on the event page. |
| `settings.block_new.place` | boolean | Invitees other than the organizer cannot propose new places on the event page. |
| `settings.block_new.invitee` | boolean | Invitees other than the organizer cannot invite other people on the event page. |
| `settings.hide.invitees` | boolean | On the event page, an invitee does not see the other invitees. |
| `settings.hide.description` | boolean | On the event page, invitees do not see `description`. |
| `settings.hide.metadata` | boolean | On the event page, invitees do not see `metadata`. |
| `settings.hide.admin_email` | boolean | On the event page, invitees do not see the organizer's email. |
| `settings.hide.support` | boolean | The link to Vyte support is hidden on the event page. |
| `settings.custom.button.title` | string | Label of an extra button displayed on the event page. |
| `settings.custom.button.href` | string | URL opened by that button. |
| `settings.auto_confirm` | boolean | Read-only. `true` when the booking was confirmed automatically because of the booking page / appointment type option. |
| `settings.sms_confirmation` | boolean | Read-only. `true` when an SMS confirmation is sent, as configured on the booking page / appointment type. |

These settings only affect emails, calendar entries and what invitees see on the event page. They never restrict what an API key can read or do.

### Title placeholders

For a booking (`vyteme: true`):

- when `title` is omitted, the title template of the booking page / appointment type is used, else <code v-pre>Meeting {{invitee}} / {{me}}</code>;
- in the resulting title (sent or generated) these placeholders are replaced once each: <code v-pre>{{me}}</code> (organizer's full name), <code v-pre>{{invitee}}</code> (full name of `invitees[0]`), <code v-pre>{{company}}</code> (company of `invitees[0]`), <code v-pre>{{appointment_type}}</code> (name of the appointment type). A missing value is replaced by an empty string.

### Example

A confirmed booking.

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "title": "Meeting Jane Doe / John Smith",
  "vyteme": true,
  "api": true,
  "org": "5f1e9b2a8c4d3e0012340001",
  "created_by": {
    "user": "5f1e9b2a8c4d3e0012340010",
    "email": "john.smith@example.com",
    "full_name": "John Smith"
  },
  "invitees": [
    {
      "_id": "5f1e9b2a8c4d3e0012345680",
      "user": "5f1e9b2a8c4d3e0012340020",
      "email": "jane.doe@example.com",
      "full_name": "Jane Doe",
      "first_name": "Jane",
      "last_name": "Doe",
      "phone": "+33612345678",
      "company": "Example Corp",
      "created_by": { "user": "5f1e9b2a8c4d3e0012340010" },
      "createdAt": "2028-02-01T09:12:44.000Z",
      "updatedAt": "2028-02-01T09:12:44.000Z"
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345681",
      "user": "5f1e9b2a8c4d3e0012340010",
      "email": "john.smith@example.com",
      "full_name": "John Smith",
      "timezone": "Europe/Paris",
      "locale": "fr",
      "created_by": { "user": "5f1e9b2a8c4d3e0012340010" },
      "createdAt": "2028-02-01T09:12:44.000Z",
      "updatedAt": "2028-02-01T09:12:44.000Z"
    }
  ],
  "dates": [
    {
      "_id": "5f1e9b2a8c4d3e0012345690",
      "date": "2028-02-09T15:45:00.000Z",
      "end_date": "2028-02-09T16:30:00.000Z",
      "all_day": false,
      "confirmed": true,
      "created_by": { "user": "5f1e9b2a8c4d3e0012340020" },
      "votes": {
        "yes": [
          { "_id": "5f1e9b2a8c4d3e0012345691", "created_by": { "user": "5f1e9b2a8c4d3e0012340020" } },
          { "_id": "5f1e9b2a8c4d3e0012345692", "created_by": { "user": "5f1e9b2a8c4d3e0012340010" } }
        ],
        "no": []
      },
      "createdAt": "2028-02-01T09:12:44.000Z",
      "updatedAt": "2028-02-01T09:12:44.000Z"
    }
  ],
  "places": [
    {
      "_id": "5f1e9b2a8c4d3e00123456a0",
      "name": "Head office",
      "address": "1 Example Street, 75001 Paris",
      "source": "app",
      "created_by": { "user": "5f1e9b2a8c4d3e0012340020" },
      "votes": {
        "yes": [
          { "_id": "5f1e9b2a8c4d3e00123456a1", "created_by": { "user": "5f1e9b2a8c4d3e0012340020" } },
          { "_id": "5f1e9b2a8c4d3e00123456a2", "created_by": { "user": "5f1e9b2a8c4d3e0012340010" } }
        ],
        "no": []
      },
      "createdAt": "2028-02-01T09:12:44.000Z",
      "updatedAt": "2028-02-01T09:12:44.000Z"
    }
  ],
  "messages": [
    {
      "_id": "5f1e9b2a8c4d3e00123456b0",
      "body": "I would like to discuss your offer.",
      "from": "jane.doe@example.com",
      "created_by": { "user": "5f1e9b2a8c4d3e0012340020" },
      "creation": true,
      "createdAt": "2028-02-01T09:12:44.000Z",
      "updatedAt": "2028-02-01T09:12:44.000Z"
    }
  ],
  "confirmed": {
    "flag": true,
    "updated_at": "2028-02-01T09:12:44.000Z",
    "date_id": "5f1e9b2a8c4d3e0012345690",
    "place_id": "5f1e9b2a8c4d3e00123456a0"
  },
  "declines": [],
  "timezone": "Europe/Paris",
  "lang": "fr",
  "locale": "fr",
  "appointment_type": "5f1e9b2a8c4d3e0012340030",
  "appointment_type_name": "Discovery call",
  "vyteme_page": "5f1e9b2a8c4d3e0012340040",
  "availability": "5f1e9b2a8c4d3e0012340050",
  "metadata": { "subject": "Pricing", "utm_source": "newsletter" },
  "pretty_metadata": { "Subject of the meeting": "Pricing", "source": "newsletter" },
  "description": "Jane Doe:\nExample Corp\n+33612345678\njane.doe@example.com\nSubject of the meeting: Pricing\nsource: newsletter",
  "third_party": { "group_ids": ["customer-42"] },
  "alias": "3f6c1e0e-8a51-4f0b-9d0a-2f6b7d5c9e11",
  "settings": { "hide": {}, "block_new": {}, "custom": { "button": {} } },
  "reminders": [],
  "categories": [],
  "attachments": [],
  "attendance_status": "scheduled",
  "first_start_date": "2028-02-09T15:45:00.000Z",
  "last_end_date": "2028-02-09T16:30:00.000Z",
  "email": "reply-meeting-jane-doe-john-smith-abcdefghi@example.com",
  "links": null,
  "createdAt": "2028-02-01T09:12:44.000Z",
  "updatedAt": "2028-02-01T09:12:44.000Z"
}
```

## Endpoints

| Method | Path | Description | Key scope |
|---|---|---|---|
| GET | `/v2/events` | List the events of the users reachable by the key | organization, team, user |
| POST | `/v2/events` | Create a booking or a group-scheduling event | organization, team, user |
| GET | `/v2/events/:event_id` | Retrieve an event | organization, team, user |
| PUT | `/v2/events/:event_id` | Replace the dates and/or places of an event | organization, team, user |
| POST | `/v2/events/:event_id/confirm` | Confirm an event | organization, team, user |
| POST | `/v2/events/:event_id/cancel` | Cancel an event | organization, team, user |
| POST | `/v2/events/:event_id/admin` | Change the organizer of an event | organization, team, user |
| POST | `/v2/events/:event_id/title` | Change the title of an event | organization, team, user |
| POST | `/v2/events/:event_id/invitees` | Add invitees to an event | organization, team, user |
| DELETE | `/v2/events/:event_id/invitees/:invitee_id` | Remove an invitee from an event | organization, team, user |
| GET | `/v2/events/:event_id/links` | Personal event-page link of each invitee | organization, team, user |
| GET | `/v2/events/:event_id/ics` | Download the iCalendar file of a confirmed event | organization, team, user |
| GET | `/v2/events/:event_id/ics-links` | iCalendar download link of each invitee | organization, team, user |
| POST | `/v2/events/slots/ensure-available` | Check that a slot is still free for a user, without creating anything | organization, team, user |
| GET | `/v2/teams/:team_id/events` | List the events of the members of a team | organization, team |
| POST | `/v2/teams/:team_id/events` | Book a team: a member is assigned automatically | organization, team |
| POST | `/v2/teams/:team_id/events/slots/ensure-available` | Check that a slot is still free for a team, without creating anything | organization, team, user |

### Which events can a key reach

This rule applies to every endpoint that has `:event_id` in its path. The event is reachable when its **organizer** (`created_by`) is:

| Key scope | Condition on the organizer |
|---|---|
| organization | A member of the key's organization. |
| team | A member of at least one of the key's teams. |
| user | The key's own user. |

Otherwise the answer is `403`. An event whose organizer is only known by email is matched through the user owning that email. The shared errors of these endpoints are:

| Status | When |
|---|---|
| `400` | `:event_id` is not a well formed id. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The event is not reachable by the key (rule above). |
| `404` | No event with this id. |
| `500` | Unexpected error, or the request could not obtain its turn on the event (see [Concurrency](#concurrency)). |

---

### List events

`GET /v2/events`

Returns the events in which **at least one user reachable by the key is an invitee** (the organizer of an event is always one of its invitees). Reachable users are: every member of the organization (organization key), the members of the key's teams (team key), the key's own user (user key).

All filters are combined with AND. Pending, confirmed and cancelled events are all returned unless `filter` is used. Events created from a group-scheduling poll and bookings are both returned.

**Key scope:** organization, team, user.

**Path parameters**

None.

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `limit` | integer | no | `10000` | Maximum number of events returned. A value that is not a positive integer is ignored. There is no offset or cursor parameter: see [Pagination](#pagination-and-sorting). |
| `filter` | string | no | none | State filter. One of `confirmed`, `to_confirm`, `pending`, `upcoming` (table below). Any other value is ignored. |
| `q` | string | no | none | Text search. If the value contains an email address, returns the events having an invitee with exactly the value as email. Otherwise case-insensitive "contains" search of the literal value (no wildcard, no regular expression) in: the title, the name of a place, the address of a place, the full name of an invitee, the email of an invitee. An empty or blank value is ignored. |
| `creator_users` | string | no | none | Comma-separated user ids. Keeps the events whose organizer (`created_by.user`) is one of them. |
| `creator_emails` | string | no | none | Comma-separated emails. Keeps the events whose `created_by.email` is one of them. Ignored when `creator_users` is present. |
| `invitee_users` | string | no | none | Comma-separated user ids. Keeps the events having at least one of them as invitee. Ids that are not reachable by the key are silently dropped; if none remains the result is empty. |
| `invitee_emails` | string | no | none | Comma-separated emails. Keeps the events having at least one invitee with one of these emails. Ignored when `invitee_users` is present. Emails are stored lowercased: send them lowercased. |
| `appointment_type` | string | no | none | Id of an appointment type. Keeps the bookings of that appointment type. |
| `vyteme` | string | no | none | Id of a booking page (despite its name this is not a boolean). Keeps the bookings whose `vyteme_page` is this page. |
| `app_id` | string | no | none | Id of a third-party application. Keeps the events whose `third_party.app` is this id. |
| `group_ids` | string | no | none | Comma-separated values. Keeps the events whose `third_party.group_ids` contains **all** of them. |
| `includeInviteesLinks` | string | no | `false` | When exactly `true`, each event carries `links`: an object mapping each invitee's user id to that invitee's personal event-page URL (see [Get the invitees' event-page links](#get-the-invitees-event-page-links)). |

There is no date-range parameter (`from` / `to`) on this endpoint. Use `filter` for "not finished yet", or the [event reports](/reference/reports/) for a period.

Values of `filter`. "Not finished" means: the event has no date at all, or its `last_end_date` is in the future.

| Value | Events kept |
|---|---|
| `confirmed` | Confirmed, not cancelled, not finished. |
| `to_confirm` | Not confirmed, not cancelled, not finished. |
| `pending` | Not cancelled, not finished - confirmed or not (union of the two above). |
| `upcoming` | Not cancelled, with a `last_end_date` in the future - confirmed or not. Events without any date are excluded. |

#### Pagination and sorting

| `filter` | Order |
|---|---|
| `confirmed`, `upcoming` | `first_start_date` ascending (soonest first). |
| any other value, or absent | `updatedAt` descending (most recently modified first). |

The order cannot be changed. Only `limit` exists; there is no way to request "the next page". To work on large volumes, narrow the request with the filters above, and prefer [Webhooks](/reference/webhooks/) to polling.

**Response**

`200` with a JSON **array** of [Event objects](#the-event-object) (not wrapped in an object). An empty array when nothing matches.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | User-scoped key whose user is no longer a member of the organization. |
| `500` | Unexpected error, including an `appointment_type` or `vyteme` value that is not a well formed id. |

**Example**

```bash
curl 'https://api.vyte.in/v2/events?filter=upcoming&creator_users=5f1e9b2a8c4d3e0012340010&limit=50' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345678",
    "title": "Meeting Jane Doe / John Smith",
    "vyteme": true,
    "created_by": { "user": "5f1e9b2a8c4d3e0012340010", "email": "john.smith@example.com", "full_name": "John Smith" },
    "confirmed": { "flag": true, "updated_at": "2028-02-01T09:12:44.000Z", "date_id": "5f1e9b2a8c4d3e0012345690" },
    "dates": [
      { "_id": "5f1e9b2a8c4d3e0012345690", "date": "2028-02-09T15:45:00.000Z", "end_date": "2028-02-09T16:30:00.000Z", "all_day": false, "confirmed": true }
    ],
    "places": [],
    "invitees": [
      { "_id": "5f1e9b2a8c4d3e0012345680", "user": "5f1e9b2a8c4d3e0012340020", "email": "jane.doe@example.com", "full_name": "Jane Doe" },
      { "_id": "5f1e9b2a8c4d3e0012345681", "user": "5f1e9b2a8c4d3e0012340010", "email": "john.smith@example.com", "full_name": "John Smith" }
    ],
    "messages": [],
    "timezone": "Europe/Paris",
    "lang": "fr",
    "locale": "fr",
    "first_start_date": "2028-02-09T15:45:00.000Z",
    "last_end_date": "2028-02-09T16:30:00.000Z",
    "links": null,
    "createdAt": "2028-02-01T09:12:44.000Z",
    "updatedAt": "2028-02-01T09:12:44.000Z"
  }
]
```

(Example shortened: each element is a full Event object.)

---

### Create an event

`POST /v2/events`

Creates a booking or a group-scheduling event for one organizer. To let Vyte choose the organizer among the members of a team, use [Book a team](#book-a-team) instead.

What you send decides what is created:

| Goal | Send |
|---|---|
| **Confirmed booking** on a slot | `vyteme: true`, `created_by`, `timezone`, exactly one element in `dates` (with `date` and `end_date`), the visitor as `invitees[0]`, and `confirmed: { "flag": true }`. Optionally `appointment_type` and/or `vyteme_page`, `places`, `messages`, `metadata`, `form_id`. `confirmed.flag` may be omitted when the appointment type or booking page is configured to confirm automatically. |
| **Booking request** to be confirmed later by the organizer | Same, without `confirmed.flag` (and with a booking page / appointment type that does not confirm automatically). Several `dates` may be sent. Confirm later with `POST .../confirm`. |
| **Group-scheduling poll** | `title`, `created_by`, `invitees`, and several `dates` and/or `places`. No `vyteme`, no `confirmed.flag`. The invitees receive an email to vote; confirm later with `POST .../confirm`. |
| **Confirmed meeting** without poll | `title`, `created_by`, `invitees`, one date, optionally one place, `confirmed: { "flag": true }`. |

When `confirmed.flag` is `true` and several dates (or places) are sent, the earliest date (the first place) is the confirmed one: send exactly one of each to avoid ambiguity.

#### Availability check on creation

The check runs only when the body contains **`vyteme: true` and a non-empty `dates` array**. Send `vyteme: true` explicitly even when `appointment_type` or `vyteme_page` is present, and identify the organizer with `created_by.user` (the id), otherwise the booking is not checked.

- Each element of `dates` is compared with the busy periods of the organizer between the earliest `date` and the latest `end_date`, computed in `timezone` with the same rules as the [Slots](/reference/slots/) endpoints: events of the organizer's connected calendars, existing Vyte bookings and tentative holds, buffers, and the opening hours and rules of the availability.
- The availability used is, in order: the query parameter `availability_id`, the body field `availability`, the availability of `appointment_type`. `team_availability_name` (body, else the one of the appointment type) is applied when present.
- If at least one date overlaps a busy period, nothing is created and the answer is **`410 Gone`** with a JSON array containing the conflicting elements of `dates`, exactly as you sent them:

```json
[
  { "date": "2028-02-09T16:45:00+01:00", "end_date": "2028-02-09T17:30:00+01:00" }
]
```

On `410`, fetch fresh [slots](/reference/slots/) and let the visitor choose again. Group-scheduling events (`vyteme` absent or `false`) are never checked.

The check and the creation are two successive steps of the same request, not one atomic operation: two simultaneous requests for the same organizer and the same slot can both succeed. Use `alias` to protect against your own retries, and see [Concurrency](#concurrency).

#### Idempotent creation with `alias`

When the body contains `alias`:

- requests carrying the same `alias` are processed one at a time;
- if an event with this `alias` already exists, **no event is created, nothing is sent**, and the answer is `200` (not `201`) with the existing event as body;
- otherwise the event is created and stores the `alias`.

This makes a creation safe to retry after a timeout: generate one `alias` per booking attempt and resend the same request. The alias must be unique across the whole Vyte platform, not only within your organization: use a long random value such as a UUID, never a short or guessable one (order number, counter). Do not start it with `alias_`.

#### Side effects

| Event created as | Emails | Calendars | Webhooks | Other |
|---|---|---|---|---|
| Pending (`confirmed.flag` false) | Invitation email (group scheduling) or booking-request email (booking) to the participants. Not sent when `settings.no_invitation_email` or `settings.no_emails` is set. | A tentative hold is written in the connected calendar of each participant for every proposed date. | `event.created` | Push notification to the Vyte mobile apps of the participants. |
| Confirmed, with at least one invitee besides the organizer | Confirmation email with an iCalendar invitation to the participants. Not sent when `settings.no_emails` is set; restricted to the organizer when `settings.email_only_admin` is set. | The meeting is written in the organizer's connected calendar. | `event.created` then `event.confirmed` | SMS confirmation when enabled on the booking page / appointment type; reminders are scheduled for the invitees; the connected CRM, if any, is updated; the video-conference is created (see [Video-conference places](#video-conference-places)). |
| Confirmed, with the organizer as only participant | None. | The meeting is written in the organizer's connected calendar. | None. | None. |

Each recipient's own notification preferences (see [User preferences](/reference/user_preference/)) are honoured on top of the event settings. Emails and calendar writes are asynchronous: they happen shortly after the response.

**Key scope:** organization, team, user. The organizer designated by `created_by` must be a member of the key's organization (organization key), a member of one of the key's teams (team key), or the key's own user (user key).

**Path parameters**

None.

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `availability_id` | string | no | none | Id of the [Availability](/reference/availabilities/) to use for the availability check. Takes precedence over the body field `availability`. |

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `created_by` | object | yes | - | The organizer. For a booking: the booked user. |
| `created_by.user` | string | one of `user` / `email` | - | Id of the organizer. Preferred. |
| `created_by.email` | string | one of `user` / `email` | - | Email of the organizer. Must be the email of an existing user. Used only when `user` is absent. |
| `title` | string | yes when `vyteme` is not `true` | generated for bookings | Title. See [title placeholders](#title-placeholders). |
| `vyteme` | boolean | no | `false` | `true` for a booking. |
| `dates` | array of objects | no | `[]` | Proposed dates. Must be an array when present. An event may be created without date (group scheduling: participants propose dates on the event page). |
| `dates[].date` | string (date-time) | yes | - | Start. |
| `dates[].end_date` | string (date-time) | yes unless `all_day` | - | End. |
| `dates[].all_day` | boolean | no | `false` | Whole-day date. |
| `dates[].description` | string | no | none | Label of the date. |
| `dates[].alias` | string | no | none | Your identifier for the date. |
| `places` | array of objects | no | `[]`, or the place of the booking page / appointment type | Proposed places. |
| `places[].name` | string | yes | - | Name of the place. |
| `places[].address` | string | no | none | Address, URL, phone number. |
| `places[].latitude` | number | no | none | Latitude. |
| `places[].longitude` | number | no | none | Longitude. |
| `places[].source` | string | no | `app` | See [Video-conference places](#video-conference-places). |
| `places[].source_id` | string | no | none | Identifier of the place at its source. |
| `places[].alias` | string | no | none | Your identifier for the place. |
| `invitees` | array of objects | no | `[]` | Participants other than the organizer (the organizer is added automatically, last). For a booking the first element must be the visitor. At most 10 invitees, organizer included. |
| `invitees[].email` | string | yes unless `user` is sent | - | Email of the invitee. Must be a valid email. |
| `invitees[].user` | string | no | resolved from `email` | Id of an existing user to invite. |
| `invitees[].full_name` | string | no | built from first/last name, else the known name | Full name. |
| `invitees[].first_name` | string | no | none | First name. |
| `invitees[].last_name` | string | no | none | Last name. |
| `invitees[].phone` | string | no | none | Phone number. |
| `invitees[].phone_country` | string | no | none | Two-letter country code of the phone. |
| `invitees[].company` | string | no | none | Company. |
| `invitees[].metadata` | object | no | none | Free data. |
| `invitees[].alias` | string | no | none | Your identifier for the invitee. |
| `messages` | array of objects | no | `[]`, or the automatic message of the booking page / appointment type | Only the first element is used: the initial message. |
| `messages[].body` | string | yes | - | Text of the message. |
| `confirmed.flag` | boolean | no | `false` | `true` to create the event already confirmed. |
| `timezone` | string | no (strongly recommended; needed for a meaningful availability check) | see the [Event object](#the-event-object) | IANA timezone. |
| `lang` | string | no | `en` | Language. |
| `locale` | string | no | value of `lang` | Date formatting locale. |
| `appointment_type` | string | no | none | Id of the appointment type booked. An unknown id is rejected with `404`. |
| `vyteme_page` | string | no | from `appointment_type` | Id of the booking page. |
| `availability` | string | no | from `appointment_type` | Id of the availability to check and to record. |
| `team_availability_name` | string | no | from `appointment_type` | Name of the availability to use for team members. |
| `form_id` | string | no | none | Id of the Form holding the visitor's answers. |
| `metadata` | object | no | none | Free key/value data. |
| `third_party` | object | no | none | `app` (string), `name` (string), `group_ids` (array of strings). |
| `alias` | string | no | none | De-duplication key. See [Idempotent creation with `alias`](#idempotent-creation-with-alias). |
| `confirmation_message` | string | no | none | Message posted at the first confirmation. |
| `settings` | object | no | inherited | See [Event settings](#event-settings). |

Fields of the Event object marked "no" in the Writable column are ignored or overwritten.

**Response**

`201` with the created [Event object](#the-event-object). `200` with the already existing event when `alias` matched (see above).

**Errors**

| Status | When |
|---|---|
| `400` | `created_by` is missing (body `{"message": "Missing created_by property in the request body"}`), or contains neither `user` nor `email`. |
| `400` | `dates` is present but is not an array. |
| `400` | The event is rejected by validation: missing `title` on a group-scheduling event, invalid email, invitee with neither `email` nor `user`, or content refused by the anti-abuse checks. The body is empty. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The organizer is not reachable by the key, or `created_by.email` matches no user. |
| `403` | More than 10 invitees (organizer included). |
| `404` | Unknown `appointment_type` (body `{"message": "appointment_type not found"}`). |
| `410` | Booking only: the organizer is not free on at least one date. Body: array of the conflicting dates. |
| `500` | Unexpected error. |

**Example: confirmed booking**

```bash
curl --request POST 'https://api.vyte.in/v2/events' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "vyteme": true,
    "alias": "3f6c1e0e-8a51-4f0b-9d0a-2f6b7d5c9e11",
    "created_by": { "user": "5f1e9b2a8c4d3e0012340010" },
    "appointment_type": "5f1e9b2a8c4d3e0012340030",
    "timezone": "Europe/Paris",
    "lang": "fr",
    "dates": [
      { "date": "2028-02-09T16:45:00+01:00", "end_date": "2028-02-09T17:30:00+01:00" }
    ],
    "places": [ { "name": "Head office", "address": "1 Example Street, 75001 Paris" } ],
    "invitees": [
      { "email": "jane.doe@example.com", "first_name": "Jane", "last_name": "Doe", "phone": "+33 6 12 34 56 78", "company": "Example Corp" }
    ],
    "messages": [ { "body": "I would like to discuss your offer." } ],
    "metadata": { "subject": "Pricing" },
    "confirmed": { "flag": true }
  }'
```

Response `201`: the Event object shown in [Example](#example).

**Example: group-scheduling poll**

```bash
curl --request POST 'https://api.vyte.in/v2/events' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "title": "Quarterly review",
    "created_by": { "email": "john.smith@example.com" },
    "timezone": "Europe/Paris",
    "dates": [
      { "date": "2028-03-06T10:00:00+01:00", "end_date": "2028-03-06T11:00:00+01:00" },
      { "date": "2028-03-07T14:00:00+01:00", "end_date": "2028-03-07T15:00:00+01:00" }
    ],
    "places": [ { "name": "Meeting room A" }, { "name": "Zoom", "source": "Zoom" } ],
    "invitees": [
      { "email": "jane.doe@example.com", "full_name": "Jane Doe" },
      { "email": "sam.lee@example.com", "full_name": "Sam Lee" }
    ],
    "messages": [ { "body": "Please vote for the dates that suit you." } ]
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345700",
  "title": "Quarterly review",
  "created_by": { "user": "5f1e9b2a8c4d3e0012340010", "email": "john.smith@example.com", "full_name": "John Smith" },
  "confirmed": { "flag": false, "updated_at": null },
  "dates": [
    { "_id": "5f1e9b2a8c4d3e0012345701", "date": "2028-03-06T09:00:00.000Z", "end_date": "2028-03-06T10:00:00.000Z", "all_day": false, "confirmed": false,
      "created_by": { "user": "5f1e9b2a8c4d3e0012340010" },
      "votes": { "yes": [ { "_id": "5f1e9b2a8c4d3e0012345711", "created_by": { "user": "5f1e9b2a8c4d3e0012340010" } } ], "no": [] } },
    { "_id": "5f1e9b2a8c4d3e0012345702", "date": "2028-03-07T13:00:00.000Z", "end_date": "2028-03-07T14:00:00.000Z", "all_day": false, "confirmed": false,
      "created_by": { "user": "5f1e9b2a8c4d3e0012340010" },
      "votes": { "yes": [ { "_id": "5f1e9b2a8c4d3e0012345712", "created_by": { "user": "5f1e9b2a8c4d3e0012340010" } } ], "no": [] } }
  ],
  "places": [
    { "_id": "5f1e9b2a8c4d3e0012345703", "name": "Meeting room A", "source": "app", "created_by": { "user": "5f1e9b2a8c4d3e0012340010" },
      "votes": { "yes": [ { "_id": "5f1e9b2a8c4d3e0012345713", "created_by": { "user": "5f1e9b2a8c4d3e0012340010" } } ], "no": [] } },
    { "_id": "5f1e9b2a8c4d3e0012345704", "name": "Zoom", "source": "Zoom", "created_by": { "user": "5f1e9b2a8c4d3e0012340010" },
      "votes": { "yes": [ { "_id": "5f1e9b2a8c4d3e0012345714", "created_by": { "user": "5f1e9b2a8c4d3e0012340010" } } ], "no": [] } }
  ],
  "invitees": [
    { "_id": "5f1e9b2a8c4d3e0012345705", "user": "5f1e9b2a8c4d3e0012340020", "email": "jane.doe@example.com", "full_name": "Jane Doe" },
    { "_id": "5f1e9b2a8c4d3e0012345706", "user": "5f1e9b2a8c4d3e0012340021", "email": "sam.lee@example.com", "full_name": "Sam Lee" },
    { "_id": "5f1e9b2a8c4d3e0012345707", "user": "5f1e9b2a8c4d3e0012340010", "email": "john.smith@example.com", "full_name": "John Smith" }
  ],
  "messages": [
    { "_id": "5f1e9b2a8c4d3e0012345708", "body": "Please vote for the dates that suit you.", "from": "john.smith@example.com",
      "created_by": { "user": "5f1e9b2a8c4d3e0012340010" }, "creation": true }
  ],
  "declines": [],
  "timezone": "Europe/Paris",
  "lang": "en",
  "locale": "en",
  "api": true,
  "first_start_date": "2028-03-06T09:00:00.000Z",
  "last_end_date": "2028-03-07T14:00:00.000Z",
  "links": null,
  "createdAt": "2028-02-01T09:12:44.000Z",
  "updatedAt": "2028-02-01T09:12:44.000Z"
}
```

---

### Retrieve an event

`GET /v2/events/:event_id`

Returns one event, whatever its state (pending, confirmed, cancelled).

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event (`_id`). |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the [Event object](#the-event-object).

**Errors**

The [shared errors](#which-events-can-a-key-reach) (`400`, `401`, `403`, `404`, `500`).

**Example**

```bash
curl 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY'
```

Response `200`: the Event object shown in [Example](#example).

---

### Update the dates and places of an event

`PUT /v2/events/:event_id`

Replaces the `dates` array and/or the `places` array of an event. This is the endpoint to use to propose other dates, or to reschedule. No other field can be changed here (see the dedicated endpoints for the title, the organizer and the invitees).

Rules:

- An array that is sent **replaces the whole existing array**; an array that is not sent is left untouched. To keep an existing element, send it back as it was returned (with its `_id`). An element sent without `_id` is a new element and gets a new id.
- For a booking (`vyteme: true`), when `dates` is non-empty, the [availability check](#availability-check-on-creation) is run again for the organizer with the availability recorded on the event (`availability`, `team_availability_name`). On conflict nothing is saved and the answer is `410` with the conflicting dates. Group-scheduling events are not checked.
- The confirmation state is not modified: `confirmed.flag` and `confirmed.date_id` / `confirmed.place_id` keep their values. After replacing the dates or places of a **confirmed** event, call [`POST .../confirm`](#confirm-an-event) with the new date (`d`) and place (`p`) so that the confirmed date is the new one and participants are notified.
- This endpoint alone sends no email, fires no webhook and does not rewrite calendar entries. Those happen at the confirmation that follows.

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |

**Query parameters**

None.

**Request body**

At least one of `dates` and `places` is required.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `dates` | array of objects | one of `dates` / `places` | unchanged | New list of dates. Same element fields as at creation: `date`, `end_date`, `all_day`, `description`, `alias`; plus `_id` to keep an existing date. |
| `places` | array of objects | one of `dates` / `places` | unchanged | New list of places. Same element fields as at creation: `name`, `address`, `latitude`, `longitude`, `source`, `source_id`, `alias`; plus `_id` to keep an existing place. |
| `timezone` | string | no | the event's `timezone` | Timezone used for the availability check only. It is not saved on the event. |

**Response**

`200` with the updated [Event object](#the-event-object).

**Errors**

The [shared errors](#which-events-can-a-key-reach), plus:

| Status | When |
|---|---|
| `400` | Neither `dates` nor `places` in the body (body `{"message": "Body should contain a dates and / or places array"}`). |
| `410` | Booking only: the organizer is not free on at least one of the new dates. Body: array of the conflicting dates. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "dates": [
      { "date": "2028-02-10T10:00:00+01:00", "end_date": "2028-02-10T10:45:00+01:00" }
    ]
  }'
```

Response `200`: the Event object, whose `dates` now contains the single new date (with a new `_id`, for example `5f1e9b2a8c4d3e0012345799`). To finish the rescheduling of a confirmed booking:

```bash
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678/confirm' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{ "d": "5f1e9b2a8c4d3e0012345799" }'
```

---

### Confirm an event

`POST /v2/events/:event_id/confirm`

Confirms the event on one date and one place. It can be called on a pending event, and again on an already confirmed event to move it to another date or place (rescheduling).

How the date and the place are chosen:

- `d` given: that date is confirmed. `p` given: that place is confirmed.
- `d` omitted: the best date is chosen. A date the organizer voted for always wins over a date the organizer did not vote for; then the date with the most positive votes; on a tie, the earliest date. An event with a single date therefore never needs `d`.
- `p` omitted: the same rule applied to the places (on a tie, the first place of the list). An event without place is confirmed without place.

**Side effects**

| | |
|---|---|
| Emails | A confirmation email with an iCalendar invitation is sent to the participants (subject to `settings.no_emails`, `settings.email_only_admin` and each recipient's preferences). No confirmation email is sent when the confirmed date is already in the past. |
| Calendars | The meeting is written in the organizer's connected calendar; the tentative holds of the other proposed dates are removed from every participant's calendar. |
| Video-conference | Created when the confirmed place asks for one (see [Video-conference places](#video-conference-places)). |
| Webhooks | `event.confirmed`. |
| Other | Push notifications; SMS confirmation when enabled; reminders are (re)scheduled for the invitees; the connected CRM, if any, is updated. |

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `d` | string | no | best date | `_id` of the element of `dates[]` to confirm (or its `alias` when it starts with `alias_`). Takes precedence over the body field `d`. |
| `p` | string | no | best place | `_id` of the element of `places[]` to confirm (or its `alias` when it starts with `alias_`). Takes precedence over the body field `p`. |

**Request body**

The body is optional.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `d` | string | no | best date | Same as the query parameter `d`. |
| `p` | string | no | best place | Same as the query parameter `p`. |
| `message` | string | no | none | Message from the organizer. It is added to `messages[]` (with `confirmation: true`) and included in the confirmation email. When omitted and the event has a `confirmation_message` and has never been confirmed, that text is used instead. |

**Response**

`201` (not `200`) with the confirmed [Event object](#the-event-object).

**Errors**

The [shared errors](#which-events-can-a-key-reach), plus:

| Status | When |
|---|---|
| `500` | `d` or `p` does not designate a date / place of this event; or the video-conference could not be created. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345700/confirm?d=5f1e9b2a8c4d3e0012345702&p=5f1e9b2a8c4d3e0012345703' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{ "message": "See you all on Tuesday." }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345700",
  "title": "Quarterly review",
  "confirmed": {
    "flag": true,
    "updated_at": "2028-02-02T08:00:00.000Z",
    "date_id": "5f1e9b2a8c4d3e0012345702",
    "place_id": "5f1e9b2a8c4d3e0012345703"
  },
  "first_start_date": "2028-03-07T13:00:00.000Z",
  "last_end_date": "2028-03-07T14:00:00.000Z"
}
```

(Example shortened: the response is the full Event object.)

---

### Cancel an event

`POST /v2/events/:event_id/cancel`

Cancels the event, pending or confirmed. The event is kept and can still be read; `cancelled` holds the date of the cancellation and `cancelled_by` the organizer's id.

The call is idempotent: cancelling an event that is already cancelled answers `200` with the event and triggers nothing again.

**Side effects** (first cancellation only)

| | |
|---|---|
| Emails | A cancellation email is sent to the participants (subject to `settings.no_emails`, `settings.email_only_admin` and each recipient's preferences). It includes `message` when given. |
| Calendars | The meeting is removed from the organizer's connected calendar and the tentative holds are removed from every participant's calendar. |
| Video-conference | A Zoom, Webex or Microsoft Teams meeting generated for the event is deleted and the `address` of the place is emptied. |
| Webhooks | `event.cancelled`; plus `event.messages.created` when `message` is given. |
| Other | Push notifications; pending reminders are cancelled; the connected CRM, if any, is updated; for a group session the seat is released. |

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |

**Query parameters**

None.

**Request body**

The body is optional.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `message` | string | no | none | Reason or message from the organizer. Added to `messages[]` (with `cancellation: true`) and included in the cancellation email. |

**Response**

`200` with the cancelled [Event object](#the-event-object).

**Errors**

The [shared errors](#which-events-can-a-key-reach).

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678/cancel' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{ "message": "John is unavailable that day, sorry." }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "title": "Meeting Jane Doe / John Smith",
  "confirmed": { "flag": true, "updated_at": "2028-02-01T09:12:44.000Z", "date_id": "5f1e9b2a8c4d3e0012345690" },
  "cancelled": "2028-02-03T14:20:00.000Z",
  "cancelled_by": "5f1e9b2a8c4d3e0012340010"
}
```

(Example shortened: the response is the full Event object.)

---

### Change the organizer of an event

`POST /v2/events/:event_id/admin`

Transfers the event to another organizer: `created_by` becomes the new user, who is added to the invitees if not already one. Use it to reassign a booking to a colleague.

- With `keep_as_invitee` absent or `false`, the previous organizer is removed from the invitees, their votes are removed, and the dates, places, invitees and messages they had created are attributed to the new organizer.
- With `keep_as_invitee: true`, the previous organizer stays as a plain invitee.
- The state of the event (pending / confirmed / cancelled), its dates and places are unchanged. `reassigned` becomes `true`.
- No availability check is made on the new organizer: check their [slots](/reference/slots/) first if needed.
- The new organizer should be a user of your organization. After a transfer to a user that your key cannot reach, the event is no longer reachable by your key.

**Side effects**

| | |
|---|---|
| Emails | A notification of the change of organizer is sent. |
| Calendars | The meeting (or the tentative holds) is removed from the previous organizer's calendar. For a confirmed event the meeting is written in the new organizer's calendar; for a pending event tentative holds are written in it. |
| Webhooks | None. |

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach) (evaluated on the current organizer).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `user` | string | one of `user` / `email` | - | Id of the new organizer. Takes precedence over `email`. |
| `email` | string | one of `user` / `email` | - | Email of the new organizer. |
| `keep_as_invitee` | boolean | no | `false` | `true` to keep the previous organizer as an invitee. |

**Response**

`200` with the updated [Event object](#the-event-object).

**Errors**

The [shared errors](#which-events-can-a-key-reach), plus:

| Status | When |
|---|---|
| `400` | Neither `user` nor `email` in the body. The body of the response is empty. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678/admin' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{ "user": "5f1e9b2a8c4d3e0012340011", "keep_as_invitee": false }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "title": "Meeting Jane Doe / John Smith",
  "created_by": { "user": "5f1e9b2a8c4d3e0012340011", "email": "alex.martin@example.com", "full_name": "Alex Martin" },
  "reassigned": true,
  "invitees": [
    { "_id": "5f1e9b2a8c4d3e0012345680", "user": "5f1e9b2a8c4d3e0012340020", "email": "jane.doe@example.com", "full_name": "Jane Doe" },
    { "_id": "5f1e9b2a8c4d3e0012345682", "user": "5f1e9b2a8c4d3e0012340011", "email": "alex.martin@example.com", "full_name": "Alex Martin" }
  ]
}
```

(Example shortened: the response is the full Event object.)

---

### Change the title of an event

`POST /v2/events/:event_id/title`

Replaces the title. The calendar entry of the organizer is updated. No email is sent and no webhook is fired.

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | string | yes | - | New title, not empty. Placeholders are not replaced here. |

**Response**

`200` with the plain-text body `OK` (not JSON, not the event). Retrieve the event to read it back.

**Errors**

The [shared errors](#which-events-can-a-key-reach), plus:

| Status | When |
|---|---|
| `400` | `title` missing or empty. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678/title' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{ "title": "Discovery call - Example Corp" }'
```

```
OK
```

---

### Add invitees to an event

`POST /v2/events/:event_id/invitees`

Adds one or several invitees to an existing event, on behalf of the organizer. Works on pending and confirmed events.

- The body is a JSON **array** (not an object) of invitee objects.
- An invitee whose email (or user) is already an invitee of the event is ignored.
- The total number of invitees, organizer included, cannot exceed 10.

**Side effects**

| | |
|---|---|
| Emails | Each new invitee receives the invitation (with the iCalendar invitation when the event is confirmed), subject to `settings.no_emails` and `settings.email_only_admin`. |
| Calendars | The organizer's calendar entry is updated with the new attendees; tentative holds are written in the new invitees' connected calendars for a pending event. |
| Webhooks | `event.invitees.added`. |
| Other | Push notification to the new invitees; reminders are scheduled for them when the event has reminders. |

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |

**Query parameters**

None.

**Request body**

A non-empty JSON array. Each element:

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `email` | string | yes unless `user` is sent | - | Email of the invitee. |
| `user` | string | no | resolved from `email` | Id of an existing user to invite. |
| `full_name` | string | no | built from first/last name, else the known name | Full name. |
| `first_name` | string | no | none | First name. |
| `last_name` | string | no | none | Last name. |
| `phone` | string | no | none | Phone number. |
| `phone_country` | string | no | none | Two-letter country code of the phone. |
| `company` | string | no | none | Company. |
| `metadata` | object | no | none | Free data. |
| `alias` | string | no | none | Your identifier for the invitee. |

**Response**

`201` with a JSON array: **all** the invitees of the event after the addition (not only the new ones), each an [Invitee object](#the-invitee-object).

**Errors**

The [shared errors](#which-events-can-a-key-reach), plus:

| Status | When |
|---|---|
| `400` | The body is not an array, or is an empty array. |
| `403` | The addition would exceed the maximum number of invitees. |
| `500` | An invitee is refused (invalid email, or email refused by the anti-abuse checks). Nothing is added. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678/invitees' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '[ { "email": "sam.lee@example.com", "full_name": "Sam Lee" } ]'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345680",
    "user": "5f1e9b2a8c4d3e0012340020",
    "email": "jane.doe@example.com",
    "full_name": "Jane Doe",
    "created_by": { "user": "5f1e9b2a8c4d3e0012340010" }
  },
  {
    "_id": "5f1e9b2a8c4d3e0012345681",
    "user": "5f1e9b2a8c4d3e0012340010",
    "email": "john.smith@example.com",
    "full_name": "John Smith",
    "created_by": { "user": "5f1e9b2a8c4d3e0012340010" }
  },
  {
    "_id": "5f1e9b2a8c4d3e0012345683",
    "user": "5f1e9b2a8c4d3e0012340021",
    "email": "sam.lee@example.com",
    "full_name": "Sam Lee",
    "created_by": { "user": "5f1e9b2a8c4d3e0012340010" }
  }
]
```

---

### Remove an invitee from an event

`DELETE /v2/events/:event_id/invitees/:invitee_id`

Removes an invitee, on behalf of the organizer. The invitee's votes and decline are removed with them, and their pending reminders are cancelled. The organizer cannot be removed: use [Change the organizer](#change-the-organizer-of-an-event) first.

**Side effects**

| | |
|---|---|
| Emails | None. The removed invitee is not notified by Vyte. |
| Calendars | The organizer's calendar entry is updated (the attendee is removed); the event is removed from the removed invitee's connected calendar. |
| Webhooks | None. |

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |
| `invitee_id` | string | `_id` of the element of `invitees[]` to remove (**not** the user id), or its `alias` when it starts with `alias_`. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with the plain-text body `OK` (not JSON).

**Errors**

The [shared errors](#which-events-can-a-key-reach), plus:

| Status | When |
|---|---|
| `403` | The invitee is the organizer of the event. |
| `404` | No invitee with this id in the event. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678/invitees/5f1e9b2a8c4d3e0012345683' \
  --header 'Authorization: YOUR_API_KEY'
```

```
OK
```

---

### Get the invitees' event-page links

`GET /v2/events/:event_id/links`

Returns, for each invitee (organizer included), the personal URL of the event page. Opening the URL shows the event page as that invitee, without login: the invitee can vote, post a message, decline, and the organizer can confirm or cancel. Use it to send the link through your own channel (email, SMS, customer area).

**Treat each URL as a secret of the invitee it belongs to**: anyone holding it acts on the event as that person. Never expose one invitee's link to another person, and do not log them.

The same map can be obtained for many events at once with `includeInviteesLinks=true` on the list endpoints.

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with a JSON object: one property per invitee, whose name is the invitee's **user id** (`invitees[].user`) and whose value is the URL (string).

**Errors**

The [shared errors](#which-events-can-a-key-reach).

**Example**

```bash
curl 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678/links' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "5f1e9b2a8c4d3e0012340020": "https://EVENT_PAGE_HOST/events/5f1e9b2a8c4d3e0012345678?u=5f1e9b2a8c4d3e0012340020&s=PERSONAL_ACCESS_CODE",
  "5f1e9b2a8c4d3e0012340010": "https://EVENT_PAGE_HOST/events/5f1e9b2a8c4d3e0012345678?u=5f1e9b2a8c4d3e0012340010&s=PERSONAL_ACCESS_CODE"
}
```

`EVENT_PAGE_HOST` stands for the host of the Vyte event page of your account (a custom domain when your booking pages use one). Use the URLs as returned; do not build them yourself.

---

### Download the iCalendar file of an event

`GET /v2/events/:event_id/ics`

Returns the iCalendar (`.ics`) file of a **confirmed** event, generated for one invitee: the file contains the confirmed date and place, the description, the attendees, and that invitee's personal event-page link.

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `user` | string | no | the first invitee who is not the organizer | User id (`invitees[].user`) of the invitee the file is generated for. Pass the organizer's id to get the organizer's file. `user_id` is accepted as a synonym and takes precedence when both are sent. |

**Request body**

None.

**Response**

`200` with the iCalendar text as body, and the headers `Content-Type: text/calendar` and `Content-Disposition: attachment; filename="event.ics"`.

**Errors**

The [shared errors](#which-events-can-a-key-reach), plus:

| Status | When |
|---|---|
| `400` | `user` is omitted and the event has no invitee other than the organizer (body `{"message": "No eligible invitee found for event"}`). |
| `403` | The event is not confirmed (body `{"message": "Event is not confirmed"}`). |
| `403` | `user` is not an invitee of the event (body `{"message": "Access denied"}`). |

**Example**

```bash
curl 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678/ics?user=5f1e9b2a8c4d3e0012340020' \
  --header 'Authorization: YOUR_API_KEY' \
  --output event.ics
```

```
BEGIN:VCALENDAR
VERSION:2.0
...
BEGIN:VEVENT
SUMMARY:Meeting Jane Doe / John Smith
DTSTART:20280209T154500Z
DTEND:20280209T163000Z
...
END:VEVENT
END:VCALENDAR
```

---

### Get the invitees' iCalendar links

`GET /v2/events/:event_id/ics-links`

Returns, for each invitee (organizer included), a ready-to-use URL that downloads that invitee's iCalendar file **without API key**. Hand the URL to a browser or put it behind an "Add to my calendar" button. The download itself only works once the event is confirmed; the links can be requested before.

Like the event-page links, each URL is personal to one invitee: do not expose it to anyone else.

**Key scope:** organization, team, user. See [Which events can a key reach](#which-events-can-a-key-reach).

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `event_id` | string | Id of the event. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200` with a JSON object: one property per invitee, whose name is the invitee's user id and whose value is the download URL (string).

**Errors**

The [shared errors](#which-events-can-a-key-reach).

**Example**

```bash
curl 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345678/ics-links' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "5f1e9b2a8c4d3e0012340020": "https://api.vyte.in/events/5f1e9b2a8c4d3e0012345678/ics?u=5f1e9b2a8c4d3e0012340020&s=PERSONAL_ACCESS_CODE",
  "5f1e9b2a8c4d3e0012340010": "https://api.vyte.in/events/5f1e9b2a8c4d3e0012345678/ics?u=5f1e9b2a8c4d3e0012340010&s=PERSONAL_ACCESS_CODE"
}
```

Use the URLs as returned; do not build them yourself.

---

### Check that a slot is still available for a user

`POST /v2/events/slots/ensure-available`

Runs the [availability check](#availability-check-on-creation) of a booking **without creating anything**. It takes the same body as `POST /v2/events` and answers `200` when the booking would pass the check, `410` otherwise. It is meant for booking interfaces: call it when the visitor selects a slot, before showing the form, so that a slot taken in the meantime is detected early.

Send your API key as on every other endpoint, and call it from your server. It returns no data about the user other than free / not free for the submitted dates.

A `200` is not a reservation: the slot can still be taken before the booking is created, and `POST /v2/events` runs the check again.

**Key scope:** organization, team, user.

**Path parameters**

None.

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `availability_id` | string | no | none | Id of the availability to check against. Takes precedence over the body field `availability`. |

**Request body**

Only the fields below are read; the other fields of an event body are accepted and ignored, so the future creation body can be sent as is.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `vyteme` | boolean | yes | - | Must be `true`. Otherwise no check is made and the answer is `200`. |
| `created_by.user` | string | yes | - | Id of the user to check (the booked user). |
| `dates` | array of objects | yes | - | Dates to check: `dates[].date` and `dates[].end_date`. With an empty or missing array no check is made and the answer is `200`. |
| `timezone` | string | yes | - | IANA timezone of the booking. |
| `appointment_type` | string | no | none | Id of the appointment type: its availability and team availability name are used unless given explicitly. |
| `availability` | string | no | from `appointment_type` | Id of the availability to check against. |
| `team_availability_name` | string | no | from `appointment_type` | Name of the availability to use. |

**Response**

`200` with the plain-text body `OK`: every date is free.

**Errors**

| Status | When |
|---|---|
| `400` | `dates` is present but is not an array. |
| `404` | Unknown `appointment_type` (body `{"message": "appointment_type not found"}`). |
| `410` | At least one date is not free. Body: JSON array of the conflicting elements of `dates`, as sent. |
| `500` | Unexpected error (for example a missing `created_by`). |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/events/slots/ensure-available' \
  --header 'Content-Type: application/json' \
  --data '{
    "vyteme": true,
    "created_by": { "user": "5f1e9b2a8c4d3e0012340010" },
    "appointment_type": "5f1e9b2a8c4d3e0012340030",
    "timezone": "Europe/Paris",
    "dates": [ { "date": "2028-02-09T16:45:00+01:00", "end_date": "2028-02-09T17:30:00+01:00" } ]
  }'
```

Slot free: `200`

```
OK
```

Slot taken: `410`

```json
[
  { "date": "2028-02-09T16:45:00+01:00", "end_date": "2028-02-09T17:30:00+01:00" }
]
```

---

### List the events of a team

`GET /v2/teams/:team_id/events`

Same as [List events](#list-events) - same query parameters, same filters, same ordering, same response - but restricted to the events in which **at least one member of the team is an invitee** (organizer included). Team admins who are not members are not taken into account.

`team_id` may be the literal value `all`: the events of the members of every team of the organization are returned.

**Key scope:** organization, team. With a team-scoped key, `team_id` must be one of the key's teams; `all` is refused with `403`.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `team_id` | string | Id of a [Team](/reference/teams/) of the organization, or `all`. |

**Query parameters**

Identical to [List events](#list-events): `limit`, `filter`, `q`, `creator_users`, `creator_emails`, `invitee_users`, `invitee_emails`, `appointment_type`, `vyteme`, `app_id`, `group_ids`, `includeInviteesLinks`. `invitee_users` is intersected with the members of the team.

**Request body**

None.

**Response**

`200` with a JSON array of [Event objects](#the-event-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | Team-scoped key and `team_id` is not one of its teams (including `all`). |
| `404` | No team with this id in the organization of the key; or `all` and the organization has no team. |
| `500` | Unexpected error, including a `team_id` that is neither `all` nor a well formed id. |

**Example**

```bash
curl 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012340060/events?filter=confirmed' \
  --header 'Authorization: YOUR_API_KEY'
```

Response `200`: an array of Event objects, as in [List events](#list-events).

---

### Book a team

`POST /v2/teams/:team_id/events`

Creates a booking with a team: Vyte chooses the organizer among the members of the team, then creates the event exactly like [Create an event](#create-an-event) (same body, same response, same side effects, same `alias` de-duplication). A "team event" is therefore not a meeting between the members of the team: it is an appointment with **one** member, picked for you.

Requirements specific to team bookings:

- `dates` must contain **exactly one** element, which must not be `all_day`.
- `timezone` is required.
- Send `vyteme: true`. (Without it the event is created as a group-scheduling event: `title` becomes required and the final availability check on the chosen member is skipped.)
- The team must have at least one member.

#### How the member is assigned

Default mode (no `team_all_members`):

1. **Who is free.** Every member of the team is checked for the requested slot with the same rules as the [availability check](#availability-check-on-creation), each against their own calendars, bookings and availability. `availability_id` / `availability` and `team_availability_name` select which availability of each member applies; with `appointment_type`, those of the appointment type are used by default.
2. **Who gets it (round-robin).** Among the free members, the one who received the **fewest bookings through this team** in the 30 days around the slot (15 days before to 15 days after the date of the slot) is chosen.
3. **Tie-break.** When several members are tied, the first one in the order of the team's `members` list is chosen. Ordering the members of the [Team](/reference/teams/) is thus the way to express a priority.
4. If nobody is free, nothing is created and the answer is `410` with the `dates` array you sent.

The chosen member becomes `created_by` of the event; any `created_by` sent in the body is ignored in this mode. Read `created_by` in the response to know who was assigned.

Variants you can select:

| Variant | How to select it | Behaviour |
|---|---|---|
| Nearest member | Query parameter `address`, or a `places[]` element with a physical `address` (a place designating a video-conference is ignored). Applies only when travel time is enabled on the availability used. | The free member with the shortest travel time to the address is chosen, instead of the round-robin. When travel time is not enabled the default mode applies. See [Slots: travel time](/reference/slots/#travel-time). |
| All members together | Query parameter `team_all_members=true` | Nobody is "picked": **every** member of the team is added to `invitees`, and one of them is designated organizer: going through the team's `members` in order, the first member who is either the user designated by `created_by` (or, without `created_by`, the owner of the booking page `vyteme_page`) or an admin of the team; if there is none, the first member of the team. The availability check then applies to that organizer. |
| Members common to several teams | `team_id` = `<A>.<B>` (ids separated by dots) | The candidates are the members of team `A` who also belong to every other listed team. |
| One member per team | `team_id` = `<A>,<B>` (ids separated by commas) | One member is assigned in each team, independently, with the rules above. The member of the first team is the organizer; the members of the other teams are added to `invitees`. If any team has nobody free the answer is `410`. With `team_all_members=true`, the members of all listed teams are invited and the organizer is designated within the first team. |

Other assignment strategies (for example random choice among the free members, or a different round-robin period) exist but cannot be selected through request parameters: they are configured by Vyte for your account. Contact Vyte support.

**Key scope:** organization, team. With a team-scoped key, `team_id` must be exactly the id of one of the key's teams (the multi-team forms `A.B` and `A,B` are refused with `403`). The team must belong to your organization.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `team_id` | string | Id of the [Team](/reference/teams/), or a multi-team expression (see the table above). |

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `team_all_members` | string | no | `false` | Exactly `true` to book all the members together (see above). |
| `address` | string | no | the first physical address of `places` | Destination used to choose the nearest member when travel time is enabled. |
| `availability_id` | string | no | none | Id of the availability to use. Takes precedence over the body field `availability`. |

**Request body**

Same fields as [Create an event](#create-an-event), with these differences:

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `created_by` | object | no | chosen by Vyte | Ignored in the default mode. With `team_all_members=true`: preferred organizer (`created_by.user` or `created_by.email`), used if that user is a member of the team. |
| `dates` | array of objects | yes | - | Exactly one element with `date` and `end_date`, not `all_day`. |
| `timezone` | string | yes | - | IANA timezone. |
| `vyteme` | boolean | yes (send `true`) | `false` | See the requirements above. |
| `invitees` | array of objects | yes for a real booking | `[]` | `invitees[0]` is the visitor. |
| `vyteme_page` | string | no | from `appointment_type` | With `team_all_members=true` and no `created_by`, its owner is the preferred organizer. |
| any other field of [Create an event](#create-an-event) | | no | | `title`, `places`, `messages`, `confirmed.flag`, `lang`, `locale`, `appointment_type`, `availability`, `team_availability_name`, `form_id`, `metadata`, `third_party`, `alias`, `confirmation_message`, `settings`. |

**Response**

`201` with the created [Event object](#the-event-object); `200` with the existing event when `alias` matched.

**Errors**

| Status | When |
|---|---|
| `400` | `dates` missing, empty, or with more than one element; the date is `all_day`; `timezone` missing. The body of the response is not meaningful. |
| `400` | The event is rejected by validation (see [Create an event](#create-an-event)). |
| `401` | Missing, unknown or deactivated API key. |
| `403` | Team-scoped key and `team_id` is not one of its teams; or a team has no member; or too many invitees. |
| `404` | Unknown team (or one unknown team in a multi-team expression); or unknown `appointment_type`. |
| `410` | No member is free for the slot (body: the `dates` array sent), or the designated organizer is not free (body: the conflicting dates). |
| `500` | Unexpected error. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012340060/events' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "vyteme": true,
    "alias": "9b8d2c4e-1f37-4a6b-8c55-0d2e7f1a3b90",
    "timezone": "Europe/Paris",
    "dates": [ { "date": "2028-02-09T16:45:00+01:00", "end_date": "2028-02-09T17:30:00+01:00" } ],
    "places": [ { "name": "Meeting room" } ],
    "invitees": [ { "email": "jane.doe@example.com", "full_name": "Jane Doe" } ],
    "confirmed": { "flag": true }
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345800",
  "title": "Meeting Jane Doe / Alex Martin",
  "vyteme": true,
  "api": true,
  "alias": "9b8d2c4e-1f37-4a6b-8c55-0d2e7f1a3b90",
  "created_by": { "user": "5f1e9b2a8c4d3e0012340011", "email": "alex.martin@example.com", "full_name": "Alex Martin" },
  "confirmed": { "flag": true, "updated_at": "2028-02-01T09:12:44.000Z", "date_id": "5f1e9b2a8c4d3e0012345801", "place_id": "5f1e9b2a8c4d3e0012345802" },
  "dates": [
    { "_id": "5f1e9b2a8c4d3e0012345801", "date": "2028-02-09T15:45:00.000Z", "end_date": "2028-02-09T16:30:00.000Z", "all_day": false, "confirmed": true }
  ],
  "places": [ { "_id": "5f1e9b2a8c4d3e0012345802", "name": "Meeting room", "source": "app" } ],
  "invitees": [
    { "_id": "5f1e9b2a8c4d3e0012345803", "user": "5f1e9b2a8c4d3e0012340020", "email": "jane.doe@example.com", "full_name": "Jane Doe" },
    { "_id": "5f1e9b2a8c4d3e0012345804", "user": "5f1e9b2a8c4d3e0012340011", "email": "alex.martin@example.com", "full_name": "Alex Martin" }
  ],
  "timezone": "Europe/Paris",
  "lang": "en",
  "locale": "en"
}
```

(Example shortened: the response is the full Event object.)

---

### Check that a slot is still available for a team

`POST /v2/teams/:team_id/events/slots/ensure-available`

Runs the member assignment and the availability check of [Book a team](#book-a-team) **without creating anything and without recording the assignment**. It takes the same path, query parameters and body as `POST /v2/teams/:team_id/events` and answers `200` when a booking would currently succeed, `410` when no member is free. The response does not say which member would be assigned.

Like its single-user counterpart, this endpoint requires your API key, and a `200` is not a reservation.

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `team_id` | string | Id of the team, or a multi-team expression (see [Book a team](#book-a-team)). |

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `team_all_members` | string | no | `false` | Exactly `true` to check the "all members together" mode. |
| `address` | string | no | the first physical address of `places` | Destination, when travel time is enabled. |
| `availability_id` | string | no | none | Id of the availability to use. |

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `dates` | array of objects | yes | - | Exactly one element with `date` and `end_date`, not `all_day`. |
| `timezone` | string | yes | - | IANA timezone. |
| `vyteme` | boolean | yes (send `true`) | `false` | Needed for the final check on the assigned member. |
| `appointment_type` | string | no | none | Id of the appointment type: its availability and team availability name are used unless given explicitly. |
| `availability` | string | no | from `appointment_type` | Id of the availability to use. |
| `team_availability_name` | string | no | from `appointment_type` | Name of the availability to use for each member. |
| `places` | array of objects | no | none | Used only to find a physical address for the "nearest member" variant. |
| `created_by`, `vyteme_page` | | no | none | Used only with `team_all_members=true`, to designate the organizer to check. |

**Response**

`200` with the plain-text body `OK`.

**Errors**

| Status | When |
|---|---|
| `400` | `dates` missing, empty or with more than one element; the date is `all_day`; `timezone` missing. |
| `403` | A team has no member. |
| `404` | Unknown team; or unknown `appointment_type`. |
| `410` | No member is free (body: the `dates` array sent), or the designated organizer is not free (body: the conflicting dates). |
| `500` | Unexpected error. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012340060/events/slots/ensure-available' \
  --header 'Content-Type: application/json' \
  --data '{
    "vyteme": true,
    "timezone": "Europe/Paris",
    "dates": [ { "date": "2028-02-09T16:45:00+01:00", "end_date": "2028-02-09T17:30:00+01:00" } ]
  }'
```

```
OK
```

## Notes and caveats

### Concurrency

- **One request at a time per event.** Requests on the same `:event_id` (update, confirm, cancel, change organizer, title, invitees, links) are serialized: a request waits until the previous one on the same event is finished. Reads with `GET /v2/events/:event_id`, `.../ics` and `.../ics-links` do not wait.
- A waiting request can be delayed by several seconds. In particular, a request sent immediately after `PUT /v2/events/:event_id`, `POST .../admin` or `GET .../links` on the same event may wait up to about 5 seconds before being processed. Chain calls on one event sequentially (wait for each response) and use a client timeout of at least 30 seconds.
- A request that cannot obtain its turn after about 20 seconds fails with `500`. Retrying it is safe for cancel (idempotent); for the others, retrieve the event first to see whether the previous attempt was applied.
- **One request at a time per `alias`** at creation: see [Idempotent creation with `alias`](#idempotent-creation-with-alias). Without `alias`, sending the same creation twice creates two events.
- The availability check and the creation are not atomic (see [Availability check on creation](#availability-check-on-creation)). Two different visitors booking the same slot of the same user at the very same instant can both succeed. For team bookings the same applies to the assignment.

### Statuses and bodies that differ from the usual conventions

- `POST .../confirm` answers `201`, not `200`.
- `POST /v2/events` answers `200` instead of `201` when the `alias` already exists: compare the status code to know whether your request created the event.
- `POST .../title`, `DELETE .../invitees/:invitee_id` and the two `ensure-available` endpoints answer `200` with the text `OK`, not JSON.
- `POST .../invitees` takes a bare JSON array as body and returns the complete invitee list.
- A slot that is no longer free is reported with `410 Gone`, whose body is an array of dates, not an error object.
- Most `400`, `403` and `404` answers of these endpoints have an empty body or a short text; rely on the status code.
- Timestamps of events and of their sub-objects are named `createdAt` and `updatedAt` (camelCase).

### Things the API does not prevent

- Confirming a cancelled event is not rejected: the event is marked confirmed, notifications are sent, but it remains cancelled. Check `cancelled` before confirming.
- Replacing the dates of a confirmed event with `PUT` does not move the confirmation: until you confirm again, `confirmed.date_id` still designates the previous date, which no longer exists in `dates[]`. Always follow such a `PUT` with `POST .../confirm`.
- `POST .../admin` does not check that the new organizer is free.
- Group-scheduling events are never checked against calendars.

### Emails, calendars and webhooks

- All side effects are asynchronous. The response of the API reflects the stored event; emails, calendar entries, video-conference links written by the calendar provider (Google Meet, Microsoft Teams) and webhooks follow within seconds. A Google Meet / Microsoft Teams link may therefore appear in `places[].address` slightly after the confirmation response: retrieve the event again or listen to the `event.confirmed` webhook.
- Parameters that control emails: `settings.no_emails` (nothing is sent), `settings.no_invitation_email` (no initial invitation for a pending event), `settings.email_only_admin` (only the organizer), and the corresponding options of the [Booking page](/reference/vytemes/) / [Appointment type](/reference/appointment-types/), which are copied to the event at creation. They cannot be changed after creation through this API.
- `settings.calendar_send_updates` controls whether Google Calendar sends its own notifications in addition to Vyte's emails. Leave it unset to avoid duplicates.
- Webhooks fired by the endpoints of this file: `event.created`, `event.confirmed`, `event.cancelled`, `event.invitees.added`, `event.messages.created`. See [Webhooks](/reference/webhooks/). Updating dates/places, changing the title, changing the organizer and removing an invitee fire no webhook.
- Creating an invitee with an unknown email creates a user record for that email in Vyte (not a member of your organization). This is how invitees get an id in `invitees[].user`.

### Identifiers

- `:invitee_id` is the `_id` of the invitee entry in the event, not the user id. The objects returned by the links endpoints are keyed by **user id**.
- `d` and `p` of confirm are `_id` values of `dates[]` and `places[]` of that event. Ids of dates and places change when the element is re-created by a `PUT` without `_id`.
- An `alias` on a date, a place or an invitee can replace its id in `d`, `p` and `:invitee_id` only if the alias starts with `alias_`. The `alias` of the event itself cannot be used in the path: `:event_id` must be the event `_id`.
