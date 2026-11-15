---
{ "pageClass": "reference-page" }
---

# Booking pages (Vytemes)

:::::panel

:::: left
A **Vyteme** is a public booking page: the page on which people outside your organization pick a time slot and book an appointment with one of your [users](./users.md) or with a [team](./teams.md). Every booking page belongs to one user (its owner, `belongs_to`) and is reachable under a globally unique `nickname`. A page carries the texts, display options and booking rules (`custom`) applied to the bookings made on it, and it is the container of [appointment types](./appointment-types.md) (the different kinds of appointments that can be booked on the page, each with its own settings and its own URL). One-off invitation links for a given appointment type are described in Ad hoc booking pages. The time slots offered on a page come from the owner's [availabilities](./availabilities.md).

Authentication, key scopes, error format, dates and languages are described in [Conventions](./README.md).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="post" path="/v2/vytemes" href="#create-a-booking-page"></endpoint>
  <endpoint method="get" path="/v2/vytemes/:nickname" href="#retrieve-a-booking-page"></endpoint>
  <endpoint method="put" path="/v2/vytemes/:nickname" href="#update-a-booking-page"></endpoint>
  <endpoint method="delete" path="/v2/vytemes/:nickname" href="#delete-a-booking-page"></endpoint>
  <endpoint method="get" path="/v2/users/:user_id/vyteme" href="#retrieve-the-primary-booking-page-of-a-user"></endpoint>
  <endpoint method="get" path="/v2/users/:user_id/vytemes" href="#list-the-booking-pages-of-a-user"></endpoint>
</endpoints>
::::

:::::

## Concepts

### Public URL of a booking page

The path of a booking page on the Vyte web app is derived from its nickname, and the path of an appointment type from the nickname and the appointment type `handle`:

| Resource | Path | Example |
|---|---|---|
| Booking page | `/<nickname>` | `https://www.vyte.in/john-doe-acme` |
| [Appointment type](./appointment-types.md) of the page | `/<nickname>/<handle>` | `https://www.vyte.in/john-doe-acme/first-meeting` |

The API does not return the full URL: build it from these two values. Only pages with `active: true` are served publicly; an inactive page (or an inactive appointment type) answers "not found" to visitors.

### User page and team page

| Kind | How to recognise it | Slots offered |
|---|---|---|
| User page | `team` is not set | The free slots of the owner (`belongs_to`). |
| Team page | `team` holds the id of a [team](./teams.md) | The free slots of the members of the team. By default a slot is offered when at least one member is free; with `team_all_members: true` a slot is offered only when all members are free at the same time. With `team_select_member: true` the visitor can choose the member to meet. |

A team page still has an owner (`belongs_to`): the user the page is attached to and whose plan and brand apply.

### Several pages for one user

A user has one **primary** page (`secondary` is not `true`) and may have additional pages (`secondary: true`).

- `GET /v2/users/:user_id/vyteme` returns the primary page.
- `GET /v2/users/:user_id/vytemes` returns all pages of the user.
- `POST /v2/vytemes` creates the page of a user who has none. If the user already has a page, the same call **updates that page** (see [Create a booking page](#create-a-booking-page)); it never creates an additional one. `secondary` is read-only in this API.

### Hub

When `hub` is `true`, the public page displays the list of its active, non-private [appointment types](./appointment-types.md) (titled with `hub_list_title`) and the visitor picks one. Vyte automatically sets `hub` back to `false` when the page is left without any active appointment type (after an appointment type is deleted or deactivated).

## The Vyteme object

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string (id) | no | Identifier of the booking page. |
| `nickname` | string | yes | Public handle of the page and identifier used in the API paths. Globally unique across Vyte. See [Nickname rules](#nickname-rules). |
| `belongs_to` | string (id) | create-only | Id of the [user](./users.md) who owns the page. |
| `active` | boolean | yes (update only) | Whether the page is publicly available. Default `true`. |
| `secondary` | boolean | no | `true` for an additional page of the user. Absent or `false` for the primary page. |
| `message` | string | yes | Welcome text displayed on the booking page. HTML is sanitized. |
| `urls[]` | array of strings | create-only | Links (website, social profiles) displayed on the page. Default `[]`. |
| `hub` | boolean | yes | Whether the page lists its appointment types. Default `false`. See [Hub](#hub). |
| `hub_list_title` | string | yes | Title displayed above the list of appointment types of a hub page. HTML is sanitized. |
| `brand` | string (id) | yes (update only) | Id of the brand (logo, colours) applied to the page. At creation it is set automatically to the owner's active brand or, failing that, to the brand of the owner's organization. Must be a brand of the owner or of the owner's organization. |
| `team` | string (id) | yes (update only) | Id of the [team](./teams.md) the page books for. Makes the page a team page. |
| `team_all_members` | boolean | yes (update only) | Team page: when `true`, a slot is offered only if all members of the team are free at the same time. |
| `team_select_member` | boolean | yes (update only) | Team page: when `true`, the visitor can select the team member to book. |
| `team_select_member_title` | string | yes (update only) | Team page: title of the member selector. HTML is sanitized. |
| `team_select_member_default_option_label` | string | yes (update only) | Team page: label of the default option of the member selector. HTML is sanitized. |
| `team_select_member_without_preference` | string | yes (update only) | Team page: label of the "no preference" option of the member selector. HTML is sanitized. |
| `team_select_member_force_selection` | boolean | yes (update only) | Team page: when `true`, the visitor must select a member. Default `false`. |
| `team_availability_name` | string | yes (update only) | Team page: name of the [availability](./availabilities.md) to use for each team member (the availability of each member carrying this name) instead of their default one. HTML is sanitized. |
| `custom` | object | yes | Texts, display options and booking rules. See [The `custom` object](#the-custom-object). |
| `translations` | object | no | Per-language overrides of the texts, keyed by language code, e.g. <code v-pre>{"fr": {"custom": {"phone_placeholder": "Votre numéro"}}}</code>. Returned when present; not writable through the booking page endpoints (it is writable on [appointment types](./appointment-types.md)). |
| `tag` | string | no | Free label carried by the page. Returned when present. |
| `version` | number | no | Free version number carried by the page. Returned when present. |
| `createdAt` | string (date-time) | no | Creation date. Note the camelCase name on this resource. |
| `updatedAt` | string (date-time) | no | Last modification date. Note the camelCase name on this resource. |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

### Nickname rules

| Rule | Detail |
|---|---|
| Case | Converted to lowercase before being stored. Always use the lowercase form in API paths. |
| Minimum length | 3 characters. A shorter nickname is refused with `403` and the body `taken`. |
| Allowed characters | Letters `a`-`z`, digits `0`-`9`, `-`, `_`, `.`, `@`. Anything else (space, `/`, accent) is refused with `400`. |
| Reserved words | `404`, `add_details`, `add_invitees`, `assistant`, `contacts`, `error`, `event`, `events`, `locator`, `locators`, `loggedin`, `login`, `logout`, `meeting`, `meetings`, `pages`, `pricing`, `settings`, `signin`, `signout`, `signup`, `user`, `users`. Refused with `403` and the body `taken`. |
| Uniqueness | Unique across all Vyte accounts, not only within your organization. A nickname already in use is refused with `403` and the body `taken`. |

### The `custom` object

`custom` groups the settings applied to the booking page and to the events booked through it. The same object, with the same keys, exists on [appointment types](./appointment-types.md); a new appointment type starts from a copy of the `custom` object of its page.

All keys are optional and writable. Unless a default is stated, a key is absent until set. Text values are sanitized (HTML is escaped or stripped).

**Identity and texts**

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.full_name` | string | none | Name displayed on the page instead of the owner's full name. |
| `custom.short_name` | string | none | Short name displayed on the page instead of the owner's first name. |
| `custom.picture_url` | string (URL) | none | Picture displayed on the page instead of the owner's picture. |
| `custom.invite_title` | string | none | Headline of the booking page (e.g. `"Book a short appointment with"`). |
| `custom.dates_footer` | string | none | Text displayed under the list of time slots (e.g. `"None of these suits you?"`). |
| `custom.booking_button1_label` | string | none | Custom label of the first booking button. |
| `custom.booking_button2_label` | string | none | Custom label of the second booking button. |
| `custom.auto_title` | string | none | Title given automatically to the events booked on the page. Supports the placeholders <code v-pre>{{invitee}}</code> and <code v-pre>{{me}}</code>, e.g. <code v-pre>"Meeting {{invitee}} / {{me}}"</code>. |
| `custom.auto_message` | string | none | Message automatically posted on the event, on behalf of the organizer, when a booking is made and the booker left no message. |

**Language, time zone and time format**

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.set_lang` | boolean | `false` | When `true`, the page is forced to the language `custom.fixed_lang`. Use it if you accept bookings in one language only. |
| `custom.fixed_lang` | string | none | Language code used when `custom.set_lang` is `true`. See [Languages](./README.md#languages). |
| `custom.langs[]` | array of strings | none | Languages supported by the page, e.g. `["en", "fr"]`. |
| `custom.set_timezone` | boolean | `false` | When `true`, the page is forced to the time zone `custom.fixed_timezone`, and events booked without a time zone get that one. Use it if bookers are all in your own time zone. |
| `custom.fixed_timezone` | string | none | IANA time zone name (e.g. `Europe/London`) used when `custom.set_timezone` is `true`. |
| `custom.time_format` | string | `"auto"` | Hour format on the page. One of `"auto"`, `"12h"`, `"24h"`. |

**Duration and slot display**

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.duration` | number | none | Duration of the appointment, in minutes. |
| `custom.durations[]` | array of numbers | none | Durations, in minutes, the booker can choose from. Values that are not greater than 0 are removed when saving. |
| `custom.slot_view` | boolean | none | When `true`, the page shows a list of bookable slots instead of the calendar view. |
| `custom.slot_view_customize` | boolean | `false` | Must be `true` for the `custom.slot_view_*` options below to apply. |
| `custom.slot_view_ndays` | number | `5` | Number of days displayed at once in the slot view. One of `1`, `2`, `3`, `4`, `5`, `6`, `7`, `10`, `14`, `31`. |
| `custom.slot_view_week_view` | boolean | none | Slot view displayed as a week. |
| `custom.slot_view_first_week_day` | number | `1` | First day of the week in the slot view: `0` = Sunday, `1` = Monday. |
| `custom.slot_view_start_at_first_availability` | boolean | none | Slot view opens on the first day with a free slot instead of today. |
| `custom.one_slot` | boolean | none | Calendar view: when `true`, the booker can propose one slot only. |
| `custom.min_dates` | number | `1` | Calendar view: minimum number of slots the booker must propose. Not used by the slot view. |

**Confirmation**

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.auto_confirm` | boolean | none | When `true`, a booking is confirmed immediately. Otherwise the booking is a request the organizer has to confirm. |

**Booking form**

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.ask_phone` | boolean | none | Ask the booker's phone number. |
| `custom.phone_placeholder` | string | none | Placeholder of the phone field. |
| `custom.ask_company` | boolean | none | Ask the booker's company. |
| `custom.ask_separate_first_last_names` | boolean | none | Ask first name and last name in two separate fields. |
| `custom.dont_ask_name` | boolean | none | Do not ask the booker's name. |
| `custom.dont_ask_email` | boolean | none | Do not ask the booker's email address; bookings are then accepted from a booker without email. |
| `custom.hide_title` | boolean | none | Hide the title (subject) field. When `true`, `custom.title_mandatory` is forced to `false`. |
| `custom.title_label` | string | none | Label of the title field. |
| `custom.title_placeholder` | string | none | Placeholder of the title field. |
| `custom.title_mandatory` | boolean | none | Make the title field mandatory. |
| `custom.hide_message_section` | boolean | none | Hide the message field of the booking form. |
| `custom.form_template_id` | string (id) | none | Id of the form template (custom questions) the booker has to fill in. |
| `custom.metadata` | object | none | Free key/value pairs copied into the `metadata` of every [event](./events.md) booked on the page (a key already set on the event is kept). |

**Places**

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.fixed_places[]` | array of objects | `[]` | Places proposed on the page. When an event is booked without a place, the first one becomes the place of the event. |
| `custom.fixed_places[].name` | string | none | Name of the place (e.g. `"Office"`, `"Phone"`). |
| `custom.fixed_places[].address` | string | none | Address, phone number or link of the place. |
| `custom.fixed_places[].latitude` | number | none | Latitude. |
| `custom.fixed_places[].longitude` | number | none | Longitude. |
| `custom.fixed_places[].source` | string | none | Name of the system the place comes from (e.g. your application name). |
| `custom.fixed_places[].source_id` | string | none | Id of the place in that system. |
| `custom.fixed_places[].icon` | string | none | Icon of the place. |
| `custom.hide_places` | boolean | none | Hide the places on the booking page. |
| `custom.forbid_add_places` | boolean | none | Forbid participants to suggest other places. |
| `custom.auto_set_creator_place` | boolean | none | When `true`, the place of the event is the first `fixed_places` entry of the primary booking page of the event organizer, instead of the first `fixed_places` entry of this page. |
| `custom.auto_set_invitee_place` | boolean | none | When `true`, for each invitee of the booking that is flagged as a place, the first `fixed_places` entry of that invitee's primary booking page is added to the places of the event. |
| `custom.locator` | string (id) | none | Id of the [locator](./locators.md) (store/branch finder) the page is listed in. Must belong to the organization of the page owner. When the page is active and has exactly one `fixed_places` entry with an address, Vyte keeps a matching [location](./locations.md) in that locator. |
| `custom.location` | string (id) | none | Read-only. Id of the [location](./locations.md) maintained by Vyte for this page in `custom.locator`. |

**Event page options** (applied to the events booked on the page)

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.block_new_invitee` | boolean | none | Participants cannot add other invitees to the event. |
| `custom.forbid_add_dates` | boolean | none | Participants cannot suggest other dates. |
| `custom.hide_invitees` | boolean | none | Hide the list of invitees on the event page. |
| `custom.hide_messages` | boolean | none | Hide the messages on the event page. |
| `custom.hide_description` | boolean | none | Hide the description on the event page. Also hides the metadata. |
| `custom.hide_metadata` | boolean | none | Hide the metadata on the event page. |
| `custom.hide_support` | boolean | none | Hide the Vyte support button (recommended for an integration). |
| `custom.hide_admin_email` | boolean | none | Hide the organizer's email address in the event page and emails. |
| `custom.event_hide_decline` | number | none | Number of hours before the start of the event from which the decline button is hidden. Example: `24` hides it during the last 24 hours. |
| `custom.event_custom_button_title` | string | none | Label of an extra button displayed on the event page. Used only together with `custom.event_custom_button_href`. |
| `custom.event_custom_button_href` | string (URL) | none | Target of the extra button. |
| `custom.cancellation_motives_set` | string (id) | none | Id of the set of cancellation reasons proposed when the event is cancelled. |
| `custom.disable_connect_google` | boolean | none | Do not offer the booker to connect a Google calendar. |
| `custom.disable_connect_office365` | boolean | none | Do not offer the booker to connect a Microsoft 365 calendar. |

**After booking**

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.redirect_url` | string (URL) | none | URL the booker is redirected to once the booking is made. |
| `custom.redirect_delay` | number | none | Delay before the redirection, in seconds. |

**Notifications**

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.no_emails` | boolean | `false` | No email at all is sent about the events booked on the page, whatever the participants' own settings. |
| `custom.no_invitation_email` | boolean | none | The invitation email is not sent. |
| `custom.email_only_admin` | boolean | none | Only the organizer receives emails about the event. |
| `custom.custom_confirmation_email` | boolean | none | Use the customized confirmation email. |
| `custom.email_confirmation_title` | string | none | Title of the confirmation email. |
| `custom.email_cta_label` | string | none | Label of the main button of the confirmation email. |
| `custom.sms_confirmation` | boolean | none | Send an SMS when the event is confirmed. |
| `custom.sms_confirmation_message` | string | none | Text of the confirmation SMS. |
| `custom.sms_no_show` | boolean | none | Send an SMS when the event is marked as a no-show. |
| `custom.sms_no_show_message` | string | none | Text of the no-show SMS. |
| `custom.sms_occurred` | boolean | none | Send an SMS when the event is marked as occurred. |
| `custom.sms_occurred_message` | string | none | Text of the "occurred" SMS. |
| `custom.reminders[]` | array of strings (ids) | none | Ids of the reminders attached to the events booked on the page. Duplicates are removed on appointment types. |

**CRM**

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.crm_sync` | boolean | none | Synchronize the events booked on the page with the connected CRM. |
| `custom.crm_sync_disable_deal_create` | boolean | none | Do not create a deal in the CRM for these events. |

### Example

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "nickname": "john-doe-acme",
  "belongs_to": "5f1e9b2a8c4d3e0012345601",
  "active": true,
  "hub": false,
  "message": "Welcome to my booking page",
  "urls": ["https://www.example.com"],
  "brand": "5f1e9b2a8c4d3e0012345610",
  "team_select_member_force_selection": false,
  "custom": {
    "auto_confirm": true,
    "auto_message": "Thank you for your booking. See you soon.",
    "auto_title": "Meeting {{invitee}} / {{me}}",
    "ask_phone": true,
    "ask_company": false,
    "duration": 30,
    "durations": [],
    "set_lang": true,
    "fixed_lang": "en",
    "langs": [],
    "set_timezone": true,
    "fixed_timezone": "Europe/London",
    "time_format": "auto",
    "slot_view": true,
    "slot_view_customize": false,
    "slot_view_ndays": 5,
    "slot_view_first_week_day": 1,
    "min_dates": 1,
    "one_slot": true,
    "no_emails": false,
    "hide_support": true,
    "invite_title": "Book a short appointment with",
    "redirect_url": "https://www.example.com/thanks-for-booking",
    "title_label": "Subject of the meeting",
    "title_placeholder": "Discuss the project",
    "title_mandatory": true,
    "reminders": [],
    "fixed_places": [
      {
        "_id": "5f1e9b2a8c4d3e0012345620",
        "name": "Office",
        "address": "1 Example Street, London",
        "source": "my-app",
        "source_id": "place-42",
        "count": 1
      },
      {
        "_id": "5f1e9b2a8c4d3e0012345621",
        "name": "Phone",
        "address": "+44 20 7946 0000",
        "count": 1
      }
    ]
  },
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-01-12T09:30:00.000Z"
}
```

## Endpoints

| Method | Path | Description | Key scope |
|---|---|---|---|
| `POST` | `/v2/vytemes` | Create the booking page of a user (or update it if the user already has one) | organization, team, user |
| `GET` | `/v2/vytemes/:nickname` | Retrieve a booking page by nickname | organization, team, user |
| `PUT` | `/v2/vytemes/:nickname` | Update a booking page | organization, team, user |
| `DELETE` | `/v2/vytemes/:nickname` | Delete a booking page | organization, team, user |
| `GET` | `/v2/users/:user_id/vyteme` | Retrieve the primary booking page of a user | organization, team, user |
| `GET` | `/v2/users/:user_id/vytemes` | List all booking pages of a user | organization, team, user |

For every endpoint, the pages that a key can reach are the pages owned by the users the key can reach: all members of the organization for an `organization` key, the members of the key's teams for a `team` key, the key's own user for a `user` key (see [API key scopes](./README.md#api-key-scopes)). A page owned by any other user is treated as not found (`404`) or forbidden (`403`), as detailed per endpoint.

### Create a booking page

`POST /v2/vytemes`

Creates the booking page of the user `belongs_to`.

Business rules:

- **Upsert on the owner.** If the user `belongs_to` already has a booking page, no new page is created: the existing page is updated exactly as described in [Update a booking page](#update-a-booking-page), which includes **renaming it** to the `nickname` of the body. Call `GET /v2/users/:user_id/vyteme` first if you need to know whether a page exists.
- On a real creation, only `nickname`, `belongs_to`, `message`, `urls`, `hub`, `hub_list_title` and `custom` are taken into account. Set the other writable fields (`active`, `brand`, `team` and the `team_*` fields) with a subsequent `PUT`.
- The brand of the new page is set automatically (owner's active brand, else the brand of the owner's organization).
- Sending `custom` turns on the advanced booking page customization feature for the owner. It requires a plan that includes that feature, otherwise the request is refused with `403`.
- The response has **no JSON body**. Retrieve the page with `GET /v2/vytemes/:nickname` to read it.
- A `vyteme_updated` [webhook](./webhooks.md) is sent to the organization(s) of the owner.

**Key scope:** organization, team, user. `belongs_to` must be a user the key can reach.

**Path parameters**

None.

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `nickname` | string | yes | - | Nickname of the page. See [Nickname rules](#nickname-rules). |
| `belongs_to` | string (id) | yes | - | Id of the user who owns the page. Must be a user the key can reach. |
| `message` | string | no | none | Welcome text of the page. |
| `urls` | array of strings | no | `[]` | Links displayed on the page. |
| `hub` | boolean | no | `false` | Whether the page lists its appointment types. |
| `hub_list_title` | string | no | none | Title of the list of appointment types. |
| `custom` | object | no | defaults of [the `custom` object](#the-custom-object) | Settings of the page. Requires a plan that includes advanced customization. |

**Response**

`200 OK` with the plain text body `OK` (not JSON).

**Errors**

| Status | When |
|---|---|
| `400` | `nickname` is missing or contains a character that is not allowed. Empty body. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | Body `taken`: the nickname is shorter than 3 characters, is a reserved word, is already used by another page, or another value of the body is invalid (for example a `custom.time_format` outside the allowed values). |
| `403` | `belongs_to` is not a user the key can reach (plain text message). |
| `403` | `custom` was sent and the plan of the owner does not include advanced booking page customization. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/vytemes' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "nickname": "john-doe-acme",
    "belongs_to": "5f1e9b2a8c4d3e0012345601",
    "message": "Welcome to my booking page",
    "urls": ["https://www.example.com"],
    "custom": {
      "auto_confirm": true,
      "duration": 30,
      "slot_view": true,
      "ask_phone": true,
      "redirect_url": "https://www.example.com/thanks-for-booking"
    }
  }'
```

```
HTTP/1.1 200 OK

OK
```

### Retrieve a booking page

`GET /v2/vytemes/:nickname`

Returns the booking page with this nickname, whether it is active or not, provided it is owned by a user the key can reach.

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `nickname` | string | Nickname of the page, in lowercase. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with [the Vyteme object](#the-vyteme-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `404` | No page with this nickname among the pages the key can reach (plain text body). |
| `500` | Unexpected error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/vytemes/john-doe-acme' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "nickname": "john-doe-acme",
  "belongs_to": "5f1e9b2a8c4d3e0012345601",
  "active": true,
  "hub": false,
  "message": "Welcome to my booking page",
  "urls": ["https://www.example.com"],
  "team_select_member_force_selection": false,
  "custom": {
    "auto_confirm": true,
    "duration": 30,
    "durations": [],
    "slot_view": true,
    "ask_phone": true,
    "redirect_url": "https://www.example.com/thanks-for-booking",
    "set_lang": false,
    "set_timezone": false,
    "min_dates": 1,
    "no_emails": false,
    "slot_view_customize": false,
    "slot_view_ndays": 5,
    "slot_view_first_week_day": 1,
    "time_format": "auto",
    "langs": [],
    "reminders": [],
    "fixed_places": []
  },
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-01-12T09:30:00.000Z"
}
```

### Update a booking page

`PUT /v2/vytemes/:nickname`

Updates a booking page. `POST /v2/vytemes` applies exactly the same rules when the user `belongs_to` already has a page.

Which page is updated:

- Without `belongs_to` in the body: the page whose nickname is `:nickname`. It must exist; create pages with `POST /v2/vytemes`.
- With `belongs_to` in the body: the page of that user, **whatever `:nickname` is**. If that user has no page yet, one is created as in [Create a booking page](#create-a-booking-page). If the user has several pages, the page that gets updated is not defined: omit `belongs_to` and address the page by its nickname instead.

Nickname after the update: the `nickname` of the body when present, otherwise `:nickname`. To rename a page, call `PUT /v2/vytemes/<current nickname>` with the new `nickname` in the body. Renaming changes the public URL of the page and of all its appointment types. When `belongs_to` is sent, make sure `:nickname` (or the body `nickname`) is the nickname you want the page to have.

How each field is applied - this is **not** a uniform partial update:

| Behaviour | Fields |
|---|---|
| Changed only when present in the body; left untouched when omitted | `active`, `hub`, `message` (must be a string), `team_select_member_title`, `team_availability_name`, `custom` |
| **Replaced on every update: cleared when omitted** | `hub_list_title`, `brand`, `team`, `team_all_members`, `team_select_member`, `team_select_member_default_option_label`, `team_select_member_without_preference`, `team_select_member_force_selection` |
| Not modifiable with this endpoint | `belongs_to`, `urls`, `secondary`, `translations`, `tag`, `version` |

`custom` is merged key by key into the existing `custom` object: the keys you send are replaced, the other keys are kept.

To avoid clearing fields unintentionally, read the page first and send back the fields of the second row with their current values.

Side effects:

- Sending `custom` turns on the advanced booking page customization feature for the owner; sending `active` turns the booking page feature of the owner on or off accordingly (which also applies the same `active` value to the owner's primary page). Both require a plan that includes the feature, otherwise the request is refused with `403`.
- A `vyteme_updated` [webhook](./webhooks.md) is sent to the organization(s) of the owner.
- The response has **no JSON body**.

**Key scope:** organization, team, user. The page must be owned by a user the key can reach.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `nickname` | string | Current nickname of the page, in lowercase. When the body has no `nickname`, this value is validated against the [Nickname rules](#nickname-rules) and kept as the nickname of the page. |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `nickname` | string | no | `:nickname` | New nickname of the page. See [Nickname rules](#nickname-rules). |
| `belongs_to` | string (id) | no | none | Id of the owner. When present, the page is looked up by owner instead of by `:nickname` (see above). Must be a user the key can reach. |
| `active` | boolean | no | unchanged | Whether the page is publicly available. |
| `message` | string | no | unchanged | Welcome text of the page. |
| `hub` | boolean | no | unchanged | Whether the page lists its appointment types. |
| `hub_list_title` | string | no | cleared | Title of the list of appointment types. |
| `brand` | string (id) | no | cleared | Brand applied to the page. Must be a brand of the page owner or of the owner's organization. |
| `team` | string (id) | no | cleared | Team the page books for. |
| `team_all_members` | boolean | no | cleared | Require all team members to be free. |
| `team_select_member` | boolean | no | cleared | Let the visitor select a team member. |
| `team_select_member_default_option_label` | string | no | cleared | Label of the default option of the member selector. |
| `team_select_member_without_preference` | string | no | cleared | Label of the "no preference" option. |
| `team_select_member_force_selection` | boolean | no | cleared | Force the visitor to select a member. |
| `team_select_member_title` | string | no | unchanged | Title of the member selector. |
| `team_availability_name` | string | no | unchanged | Name of the availability used for each team member. |
| `custom` | object | no | unchanged | Keys of [the `custom` object](#the-custom-object) to change. Merged key by key. |

**Response**

`200 OK` with the plain text body `OK` (not JSON).

**Errors**

| Status | When |
|---|---|
| `400` | The nickname contains a character that is not allowed. Empty body. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | Body `taken`: the nickname is shorter than 3 characters, is a reserved word, is already used by another page, or another value of the body is invalid. |
| `403` | `belongs_to`, or the owner of the page found, is not a user the key can reach (plain text message). |
| `403` | `brand` is not a brand of the page owner or of the owner's organization (plain text message). |
| `403` | `custom` or `active` was sent and the plan of the owner does not include the corresponding feature. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/vytemes/john-doe-acme' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "message": "Book a call with me",
    "team": "5f1e9b2a8c4d3e0012345630",
    "team_select_member": true,
    "team_select_member_title": "Who would you like to meet?",
    "custom": {
      "duration": 45
    }
  }'
```

```
HTTP/1.1 200 OK

OK
```

### Delete a booking page

`DELETE /v2/vytemes/:nickname`

Permanently deletes the booking page. Its public URL stops working immediately.

The [appointment types](./appointment-types.md) of the page are **not** deleted by this call. Delete them first with `DELETE /v2/vytemes/:nickname/types/:handle`: once the page is gone they can no longer be reached through the API. Events already booked are not affected.

**Key scope:** organization, team, user. The page must be owned by a user the key can reach.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `nickname` | string | Nickname of the page, in lowercase. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with a small JSON object reporting the deletion. Only the status code is meaningful; do not rely on the content of the body.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `404` | No page with this nickname among the pages the key can reach. The body is the same kind of JSON object as for a success, reporting that nothing was deleted. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/vytemes/john-doe-acme' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "n": 1,
  "ok": 1,
  "deletedCount": 1
}
```

### Retrieve the primary booking page of a user

`GET /v2/users/:user_id/vyteme`

Returns the primary booking page of the user (the page whose `secondary` is not `true`), whether it is active or not.

The `nickname` field is omitted from the response when the page was generated automatically for the user and has not been given a public nickname yet.

**Key scope:** organization, team, user. `:user_id` must be a user the key can reach.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | Id of the [user](./users.md). |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with [the Vyteme object](#the-vyteme-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `:user_id` is not a user the key can reach. |
| `404` | The user has no primary booking page. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345601/vyteme' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "nickname": "john-doe-acme",
  "belongs_to": "5f1e9b2a8c4d3e0012345601",
  "active": true,
  "hub": false,
  "message": "Welcome to my booking page",
  "urls": [],
  "team_select_member_force_selection": false,
  "custom": {
    "auto_confirm": true,
    "one_slot": true,
    "set_lang": false,
    "set_timezone": false,
    "min_dates": 1,
    "no_emails": false,
    "slot_view_customize": false,
    "slot_view_ndays": 5,
    "slot_view_first_week_day": 1,
    "time_format": "auto",
    "durations": [],
    "langs": [],
    "reminders": [],
    "fixed_places": []
  },
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-01-12T09:30:00.000Z"
}
```

### List the booking pages of a user

`GET /v2/users/:user_id/vytemes`

Returns all booking pages owned by the user: the primary page and the additional ones, active or not. The result is a bare JSON array (no wrapping object, no pagination). The order is not guaranteed.

**Key scope:** organization, team, user. `:user_id` must be a user the key can reach.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `user_id` | string (id) | Id of the [user](./users.md). |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with an array of [Vyteme objects](#the-vyteme-object). The array is empty when the user has no page.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | `:user_id` is not a user the key can reach. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345601/vytemes' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345678",
    "nickname": "john-doe-acme",
    "belongs_to": "5f1e9b2a8c4d3e0012345601",
    "active": true,
    "hub": false,
    "message": "Welcome to my booking page",
    "urls": [],
    "team_select_member_force_selection": false,
    "custom": {
      "auto_confirm": true,
      "one_slot": true,
      "min_dates": 1,
      "fixed_places": []
    },
    "createdAt": "2026-01-12T09:30:00.000Z",
    "updatedAt": "2026-01-12T09:30:00.000Z"
  },
  {
    "_id": "5f1e9b2a8c4d3e0012345679",
    "nickname": "john-doe-acme-support",
    "belongs_to": "5f1e9b2a8c4d3e0012345601",
    "secondary": true,
    "active": true,
    "hub": false,
    "message": "Book a support call",
    "urls": [],
    "team_select_member_force_selection": false,
    "custom": {
      "auto_confirm": true,
      "min_dates": 1,
      "fixed_places": []
    },
    "createdAt": "2026-02-03T14:00:00.000Z",
    "updatedAt": "2026-02-03T14:00:00.000Z"
  }
]
```

## Notes and caveats

- **Create and update return no object.** `POST /v2/vytemes` and `PUT /v2/vytemes/:nickname` answer `200` with the plain text `OK`. Follow with a `GET` to read the stored page.
- **`POST` is an upsert on the owner.** Posting for a user who already has a page updates (and renames) that page instead of creating a second one.
- **`PUT` clears some fields when they are omitted** (`hub_list_title`, `brand`, `team`, `team_all_members`, `team_select_member`, `team_select_member_default_option_label`, `team_select_member_without_preference`, `team_select_member_force_selection`). Always send their current values back. `custom`, on the contrary, is merged key by key.
- **`PUT` with `belongs_to` ignores the nickname of the path to find the page** and then gives the page the nickname of the path (or of the body). Omit `belongs_to` when you address a page by nickname.
- **`urls` can only be set at creation** through this API.
- **`403` with the body `taken`** is returned for every refused nickname (too short, reserved, already used) and also when another value of the body is invalid. `400` is returned only for a missing nickname or forbidden characters.
- **Nicknames are global.** A nickname used by any Vyte account is unavailable; prefix nicknames with something specific to your organization (for example `john-doe-acme`).
- **Use lowercase nicknames in paths.** Nicknames are stored in lowercase and path lookups are case-sensitive.
- **Error bodies are not uniform** on these endpoints: some are empty, some are plain text, some are JSON. Rely on the status code.
- **Timestamps are `createdAt` / `updatedAt`** (camelCase) on booking pages.
- **Deleting a page does not delete its appointment types.** Delete them first.
- **Inactive pages are returned by the API** (all `GET` endpoints) but are not served publicly.
- New [appointment types](./appointment-types.md) copy the settings of their page at creation time; later changes to the page are not propagated to existing appointment types. To change many appointment types at once, use the [batch update](./appointment-types.md#batch-update-appointment-types).
