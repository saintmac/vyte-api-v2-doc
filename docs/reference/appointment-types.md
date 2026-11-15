---
{ "pageClass": "reference-page" }
---

# Appointment types

:::::panel

:::: left
An **appointment type** is one kind of appointment that can be booked on a [booking page (Vyteme)](./vytemes.md): for example "First meeting - 30 min", "Phone call - 15 min" or "Store visit". Each appointment type belongs to exactly one booking page, is identified inside that page by its `handle`, has its own public URL, its own settings (duration, places, form, confirmation mode, notifications, redirection) and points at the [availability](./availabilities.md) that defines when it can be booked. Ad hoc booking pages are one-off invitation links created for an appointment type. The id of an appointment type can be passed to the slots and events endpoints (see [Slots](./slots.md) and [Events](./events.md)) so that its duration, availability and team are applied.

Authentication, key scopes, error format, dates and languages are described in [Conventions](./README.md).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/vytemes/:nickname/types" href="#list-appointment-types"></endpoint>
  <endpoint method="post" path="/v2/vytemes/:nickname/types" href="#create-an-appointment-type"></endpoint>
  <endpoint method="get" path="/v2/vytemes/:nickname/types/:handle" href="#retrieve-an-appointment-type"></endpoint>
  <endpoint method="put" path="/v2/vytemes/:nickname/types/:handle" href="#update-an-appointment-type"></endpoint>
  <endpoint method="delete" path="/v2/vytemes/:nickname/types/:handle" href="#delete-an-appointment-type"></endpoint>
  <endpoint method="post" path="/v2/appointmenttypes/update/batch" href="#batch-update-appointment-types"></endpoint>
</endpoints>
::::

:::::

## Concepts

### Public URL

The public path of an appointment type is `/<nickname>/<handle>`, where `nickname` is the nickname of its booking page:

`https://www.vyte.in/john-doe-acme/first-meeting`

The API does not return the URL: build it from the two values. Changing the `handle` of the appointment type or the `nickname` of the page changes the URL. An appointment type with `active: false` is not served publicly.

### Where each setting lives

| Setting | Where |
|---|---|
| Identifier in URLs | `handle` |
| Name and texts | `name`, `description`, `message`, `custom.invite_title`, `custom.auto_title`, `custom.auto_message`, `translations` |
| Duration | `custom.duration` (minutes) and `custom.durations[]` (choices offered to the booker) |
| Place, phone or video link | `custom.fixed_places[]`, `custom.hide_places`, `custom.forbid_add_places` |
| Confirmation mode | `custom.auto_confirm` (`true` = booked immediately, otherwise a request to confirm) |
| Visibility | `active` (bookable or not), `private` (hidden from the list of the page, bookable by direct URL) |
| Weekly hours, date ranges, buffers before/after, minimum notice, booking horizon, slot step, parallel bookings | Not on the appointment type: they are properties of the [availability](./availabilities.md) referenced by `availability` |
| Custom questions | `custom.form_template_id` -> form template; built-in fields with `custom.ask_phone`, `custom.ask_company`, `custom.title_*` |
| Team booking | `team`, `team_all_members`, `team_select_member` and the other `team_*` fields; see [Teams](./teams.md) |
| Group sessions | `session`, `session_max_spots` |
| Payment | `paid`, `pay_to_book`, `payment_price`, `payment_currency` |
| After booking | `custom.redirect_url`, `custom.redirect_delay` |
| Notifications | `custom.no_emails`, `custom.sms_*`, `custom.reminders[]` and the other notification keys of `custom` |
| Ordering | There is no position field. List responses have no guaranteed order; sort on your side (for example on `createdAt` or `name`). `group` can be used as a grouping label. |

### Availability of an appointment type

Every appointment type references one [availability](./availabilities.md) through `availability`.

- If you do not send `availability` when creating an appointment type, Vyte creates a **new private copy** of an availability and attaches it: the copy of the availability of the template appointment type when a `template` is given, otherwise a copy of the default availability of the page owner (which is created if the owner has none). The appointment type then has an availability of its own, which you can edit through the [availabilities](./availabilities.md) endpoints without affecting anything else.
- If you send `availability`, that availability is used as is. Several appointment types may share the same availability. It must exist and belong to a user the key can reach, otherwise the request is refused with `400`.

## The AppointmentType object

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string (id) | no | Identifier of the appointment type. This is the value expected by the `appointment_type` parameter of other endpoints. |
| `vyteme` | string (id) | no | Id of the [booking page](./vytemes.md) the appointment type belongs to. |
| `name` | string | yes | Display name. Required. HTML is sanitized. |
| `handle` | string | yes | Identifier of the appointment type inside its page, used in API paths and in the public URL. See [Handle rules](#handle-rules). |
| `description` | string | yes | Description displayed on the booking page. HTML is sanitized. |
| `message` | string | yes | Welcome text displayed on the appointment type page. HTML is sanitized. |
| `active` | boolean | yes (update only) | Whether the appointment type can be booked. Default `true`; always `true` at creation. |
| `private` | boolean | yes | When `true`, the appointment type is not listed on its page when the page is a [hub](./vytemes.md#hub); it remains bookable through its direct URL. Default `false`. |
| `public` | boolean | yes | Deprecated, use `private`. Default `true`; forced to `false` at creation when `private` is `true`. |
| `availability` | string (id) | yes | Id of the [availability](./availabilities.md) that defines when the appointment type can be booked. See [Availability of an appointment type](#availability-of-an-appointment-type). |
| `group` | string | yes | Free label used to group appointment types. |
| `urls[]` | array of strings | yes | Links displayed on the page. Default `[]`. |
| `brand` | string (id) | yes | Id of the brand (logo, colours) applied. At creation defaults to the brand of the template, else of the page. |
| `team` | string (id) | yes | Id of the [team](./teams.md) the appointment type books for. |
| `team_all_members` | boolean | yes | Team booking: a slot is offered only if all members of the team are free at the same time. |
| `team_select_member` | boolean | yes | Team booking: the visitor can select the team member to book. |
| `team_select_member_title` | string | yes | Title of the member selector. HTML is sanitized. |
| `team_select_member_default_option_label` | string | yes | Label of the default option of the member selector. HTML is sanitized. |
| `team_select_member_without_preference` | string | yes | Label of the "no preference" option of the member selector. HTML is sanitized. |
| `team_select_member_force_selection` | boolean | yes | The visitor must select a member. Default `false`. |
| `team_availability_name` | string | yes (update only) | Team booking: name of the [availability](./availabilities.md) to use for each team member (the availability of each member carrying this name). HTML is sanitized. |
| `session` | boolean | yes | When `true`, the appointment type is a group session: several bookers can book the same slot. |
| `session_max_spots` | number | yes | Maximum number of participants of a session. |
| `paid` | boolean | yes | Whether the appointment is a paid one. |
| `pay_to_book` | boolean | yes | When `true` (together with `paid`), the booker has to pay online to book. |
| `payment_price` | number | yes | Price, in units of the currency (e.g. `49.9`). |
| `payment_currency` | string | yes | Currency code of the price. |
| `custom` | object | yes | Texts, display options and booking rules of the appointment type. Same keys as [the `custom` object of a booking page](./vytemes.md#the-custom-object); the most used ones are listed [below](#most-used-custom-keys). |
| `translations` | object | yes | Per-language overrides of the texts, keyed by language code. Each language may carry text overrides such as `message` and a `custom` object holding overrides of `custom` text keys, e.g. <code v-pre>{"fr": {"message": "Bienvenue", "custom": {"title_label": "Sujet"}}}</code>. |
| `tag` | string | yes (update only) | Free label you can use to recognise an appointment type even after its `handle` or `name` changed. HTML is sanitized. |
| `version` | number | yes (update only) | Free version number you can use to track your own roll-outs of settings. |
| `createdAt` | string (date-time) | no | Creation date. Note the camelCase name on this resource. |
| `updatedAt` | string (date-time) | no | Last modification date. Note the camelCase name on this resource. |

Responses may contain additional fields not listed here; they are internal, may change without notice and must not be relied upon.

### Handle rules

| Rule | Detail |
|---|---|
| Default | When no `handle` is given, it is generated from `name`: lowercased, spaces replaced by `-`, special characters removed or transliterated. `"Conference lunch"` gives `conference-lunch`. |
| Case and spaces | Lowercased and trimmed before being stored. Use the lowercase form in API paths. |
| Allowed characters | Letters `a`-`z`, digits `0`-`9`, `-`, `_`, `.`, `@`. |
| Digits only | A handle made only of digits (e.g. `1984`) is refused. Digits mixed with other characters are accepted. |
| Uniqueness | Unique within its booking page only. Two different pages may each have a `first-meeting` appointment type - this is what the [batch update](#batch-update-appointment-types) relies on. |

### Most used `custom` keys

The complete list (types, defaults, allowed values) is in [the `custom` object](./vytemes.md#the-custom-object). All its keys apply to appointment types.

| Field | Type | Default | Description |
|---|---|---|---|
| `custom.duration` | number | none | Duration of the appointment, in minutes. Used as the default duration when the appointment type is passed to the slots endpoints. |
| `custom.durations[]` | array of numbers | none | Durations, in minutes, the booker can choose from. Values that are not greater than 0 are removed. |
| `custom.auto_confirm` | boolean | none | `true`: a booking is confirmed immediately. Otherwise it is a request the organizer confirms. |
| `custom.fixed_places[]` | array of objects | `[]` | Places (address, phone number, video link) of the appointment; each with `name`, `address`, and optionally `latitude`, `longitude`, `source`, `source_id`, `icon`. |
| `custom.form_template_id` | string (id) | none | Form template holding the custom questions asked to the booker. |
| `custom.ask_phone` | boolean | none | Ask the booker's phone number. |
| `custom.title_label`, `custom.title_placeholder`, `custom.title_mandatory`, `custom.hide_title` | string, string, boolean, boolean | none | Subject field of the booking form. `hide_title: true` forces `title_mandatory` to `false`. |
| `custom.slot_view` | boolean | none | Show a list of slots instead of the calendar view. |
| `custom.langs[]`, `custom.set_lang`, `custom.fixed_lang` | array of strings, boolean, string | none, `false`, none | Languages of the page. |
| `custom.set_timezone`, `custom.fixed_timezone` | boolean, string | `false`, none | Forced time zone. |
| `custom.redirect_url`, `custom.redirect_delay` | string, number | none | Redirection after booking and its delay in seconds. |
| `custom.reminders[]` | array of strings (ids) | none | Reminders attached to the booked events. Duplicate ids are removed. |
| `custom.sms_confirmation`, `custom.sms_confirmation_message` | boolean, string | none | Confirmation SMS. |
| `custom.metadata` | object | none | Key/value pairs copied into the `metadata` of the booked [events](./events.md). |

### Example

```json
{
  "_id": "5f1e9b2a8c4d3e0012345700",
  "vyteme": "5f1e9b2a8c4d3e0012345678",
  "name": "First meeting",
  "handle": "first-meeting",
  "description": "A 30 minute call to get to know each other",
  "message": "Pick the time that suits you best",
  "active": true,
  "private": false,
  "public": true,
  "availability": "5f1e9b2a8c4d3e0012345710",
  "urls": [],
  "team_select_member_force_selection": false,
  "custom": {
    "duration": 30,
    "durations": [30, 60],
    "auto_confirm": true,
    "slot_view": true,
    "slot_view_customize": false,
    "slot_view_ndays": 5,
    "slot_view_first_week_day": 1,
    "ask_phone": true,
    "title_label": "Subject",
    "title_placeholder": "What would you like to talk about?",
    "title_mandatory": true,
    "form_template_id": "5f1e9b2a8c4d3e0012345720",
    "langs": ["en", "fr"],
    "set_lang": false,
    "set_timezone": false,
    "time_format": "auto",
    "min_dates": 1,
    "no_emails": false,
    "redirect_url": "https://www.example.com/thanks-for-booking",
    "redirect_delay": 5,
    "reminders": [],
    "fixed_places": [
      {
        "_id": "5f1e9b2a8c4d3e0012345730",
        "name": "Video call",
        "address": "https://meet.example.com/john-doe",
        "count": 1
      }
    ]
  },
  "translations": {
    "fr": {
      "message": "Choisissez le créneau qui vous convient",
      "custom": {
        "title_label": "Sujet"
      }
    }
  },
  "createdAt": "2026-01-12T09:35:00.000Z",
  "updatedAt": "2026-01-12T09:35:00.000Z"
}
```

## Endpoints

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/vytemes/:nickname/types` | List the appointment types of a booking page | organization, team, user |
| `POST` | `/v2/vytemes/:nickname/types` | Create an appointment type | organization, team, user |
| `GET` | `/v2/vytemes/:nickname/types/:handle` | Retrieve an appointment type | organization, team, user |
| `PUT` | `/v2/vytemes/:nickname/types/:handle` | Update an appointment type | organization, team, user |
| `DELETE` | `/v2/vytemes/:nickname/types/:handle` | Delete an appointment type | organization, team, user |
| `POST` | `/v2/appointmenttypes/update/batch` | Apply the same changes to all appointment types sharing a handle | organization, team, user |

For every endpoint, the booking pages a key can reach are those owned by the users the key can reach: all members of the organization for an `organization` key, the members of the key's teams for a `team` key, the key's own user for a `user` key (see [API key scopes](./README.md#api-key-scopes)). A page owned by any other user answers `404`.

### List appointment types

`GET /v2/vytemes/:nickname/types`

Returns all appointment types of the booking page: active and inactive, private or not. The result is a bare JSON array (no wrapping object, no pagination, no guaranteed order).

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `nickname` | string | Nickname of the [booking page](./vytemes.md), in lowercase. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with an array of [AppointmentType objects](#the-appointmenttype-object). Empty array when the page has none.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `404` | No booking page with this nickname among the pages the key can reach. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/vytemes/john-doe-acme/types' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345700",
    "vyteme": "5f1e9b2a8c4d3e0012345678",
    "name": "First meeting",
    "handle": "first-meeting",
    "active": true,
    "private": false,
    "public": true,
    "availability": "5f1e9b2a8c4d3e0012345710",
    "urls": [],
    "team_select_member_force_selection": false,
    "custom": {
      "duration": 30,
      "auto_confirm": true,
      "min_dates": 1,
      "fixed_places": []
    },
    "createdAt": "2026-01-12T09:35:00.000Z",
    "updatedAt": "2026-01-12T09:35:00.000Z"
  },
  {
    "_id": "5f1e9b2a8c4d3e0012345701",
    "vyteme": "5f1e9b2a8c4d3e0012345678",
    "name": "Phone call",
    "handle": "phone-call",
    "active": true,
    "private": true,
    "public": false,
    "availability": "5f1e9b2a8c4d3e0012345711",
    "urls": [],
    "team_select_member_force_selection": false,
    "custom": {
      "duration": 15,
      "auto_confirm": true,
      "min_dates": 1,
      "fixed_places": []
    },
    "createdAt": "2026-01-12T09:40:00.000Z",
    "updatedAt": "2026-01-12T09:40:00.000Z"
  }
]
```

### Create an appointment type

`POST /v2/vytemes/:nickname/types`

Creates an appointment type on the booking page.

Business rules:

- **A new appointment type always starts from a template.** The template is the booking page itself by default, or another appointment type of the same page when `template` is given. Every setting you do not send is copied from the template (see the "Default" column below). In particular `custom` starts as a copy of the template's `custom`, on top of which the keys of the body `custom` are applied.
- For the fields marked "body value, else template value (truthy)" below, a falsy body value (`false`, `0`, `""`) does **not** override a truthy template value at creation. To switch such a setting off, update the appointment type after creating it.
- `active`, `team_availability_name`, `tag` and `version` are not taken into account at creation. The appointment type is created active; use `PUT` to change them.
- The availability is resolved as described in [Availability of an appointment type](#availability-of-an-appointment-type).
- When `private` is `true`, `public` is set to `false`.

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `nickname` | string | Nickname of the [booking page](./vytemes.md), in lowercase. |

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | string | yes | - | Display name. |
| `handle` | string | no | generated from `name` | See [Handle rules](#handle-rules). |
| `template` | string | no | `/<nickname>` (the page itself) | What to copy the settings from: `/<nickname>` for the page, or `/<nickname>/<handle>` for an existing appointment type of the **same** page. `<nickname>` must be the nickname of the path. |
| `availability` | string (id) | no | a new copy (see above) | Existing [availability](./availabilities.md) to use as is. Must belong to a user the key can reach. |
| `description` | string | no | template value | Description. |
| `message` | string | no | template value | Welcome text. |
| `private` | boolean | no | template value, else `false` | Hide from the hub list of the page. |
| `public` | boolean | no | template value, else `true` | Deprecated. |
| `custom` | object | no | copy of the template `custom` | Keys of [the `custom` object](./vytemes.md#the-custom-object). Applied on top of the template's `custom` (key by key). |
| `translations` | object | no | template value | Per-language text overrides. Languages of the body replace the same languages of the template; other languages of the template are kept. |
| `urls` | array of strings | no | template value | Used only when not empty. |
| `brand` | string (id) | no | template value | Body value, else template value (truthy). |
| `team` | string (id) | no | template value | Body value, else template value (truthy). |
| `team_all_members` | boolean | no | template value | Body value, else template value (truthy). |
| `team_select_member` | boolean | no | template value | Body value, else template value (truthy). |
| `team_select_member_title` | string | no | template value | Body value, else template value (truthy). |
| `team_select_member_default_option_label` | string | no | template value | Body value, else template value (truthy). |
| `team_select_member_without_preference` | string | no | template value | Body value, else template value (truthy). |
| `team_select_member_force_selection` | boolean | no | template value, else `false` | Body value, else template value (truthy). |
| `session` | boolean | no | template value | Body value, else template value (truthy). |
| `session_max_spots` | number | no | template value | Body value, else template value (truthy). |
| `group` | string | no | template value | Body value, else template value (truthy). |
| `paid` | boolean | no | template value | Body value, else template value (truthy). |
| `pay_to_book` | boolean | no | template value | Body value, else template value (truthy). |
| `payment_price` | number | no | template value | Body value, else template value (truthy). |
| `payment_currency` | string | no | template value | Body value, else template value (truthy). |

**Response**

`201 Created` with the created [AppointmentType object](#the-appointmenttype-object).

**Errors**

| Status | When |
|---|---|
| `400` | `name` is missing (empty body). |
| `400` | `availability` does not exist or does not belong to a user the key can reach. Body: `{"message": "invalid availability <id>"}`. |
| `401` | Missing, unknown or deactivated API key. |
| `404` | No booking page with this nickname among the pages the key can reach. |
| `409` | The page already has an appointment type with this handle. Empty body. |
| `500` | The `handle` contains a forbidden character or is made only of digits; the `template` is malformed or refers to another page; or an unexpected error. Validate handles on your side: an invalid handle is reported as `500`, not `400`, by this endpoint. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/vytemes/john-doe-acme/types' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "First meeting",
    "handle": "first-meeting",
    "description": "A 30 minute call to get to know each other",
    "custom": {
      "duration": 30,
      "auto_confirm": true,
      "title_label": "Subject",
      "title_mandatory": true,
      "langs": ["en", "fr"]
    },
    "translations": {
      "fr": {
        "message": "Choisissez le créneau qui vous convient",
        "custom": { "title_label": "Sujet" }
      }
    }
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345700",
  "vyteme": "5f1e9b2a8c4d3e0012345678",
  "name": "First meeting",
  "handle": "first-meeting",
  "description": "A 30 minute call to get to know each other",
  "message": "Welcome to my booking page",
  "active": true,
  "private": false,
  "public": true,
  "availability": "5f1e9b2a8c4d3e0012345710",
  "urls": [],
  "team_select_member_force_selection": false,
  "custom": {
    "duration": 30,
    "durations": [],
    "auto_confirm": true,
    "title_label": "Subject",
    "title_mandatory": true,
    "langs": ["en", "fr"],
    "set_lang": false,
    "set_timezone": false,
    "min_dates": 1,
    "no_emails": false,
    "slot_view_customize": false,
    "slot_view_ndays": 5,
    "slot_view_first_week_day": 1,
    "time_format": "auto",
    "reminders": [],
    "fixed_places": []
  },
  "translations": {
    "fr": {
      "message": "Choisissez le créneau qui vous convient",
      "custom": { "title_label": "Sujet" }
    }
  },
  "createdAt": "2026-01-12T09:35:00.000Z",
  "updatedAt": "2026-01-12T09:35:00.000Z"
}
```

### Retrieve an appointment type

`GET /v2/vytemes/:nickname/types/:handle`

Returns one appointment type of the booking page, active or not.

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `nickname` | string | Nickname of the [booking page](./vytemes.md), in lowercase. |
| `handle` | string | Handle of the appointment type, in lowercase. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with the [AppointmentType object](#the-appointmenttype-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `404` | No booking page with this nickname among the pages the key can reach, or no appointment type with this handle on the page. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/vytemes/john-doe-acme/types/first-meeting' \
  --header 'Authorization: YOUR_API_KEY'
```

The response is the object shown in [Example](#example).

### Update an appointment type

`PUT /v2/vytemes/:nickname/types/:handle`

Partially updates an appointment type: only the fields present in the body are changed.

Business rules:

- Top-level fields present in the body **replace** the stored value (this includes `translations` and `urls`, which are replaced as a whole).
- `custom` is merged: the keys you send replace the stored keys, the other stored keys are kept.
- Body fields whose name starts with `_` are ignored (so you can send back an object you read, including its `_id`).
- `availability`: when it differs from the current one, it must exist and belong to a user the key can reach, otherwise `400`. Sending the current value back is always accepted.
- Changing `handle` changes the path of the appointment type in the API and its public URL. The new handle must respect the [Handle rules](#handle-rules).
- If the update leaves the page without any active appointment type, the `hub` mode of the page is switched off (see [Hub](./vytemes.md#hub)).

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `nickname` | string | Nickname of the [booking page](./vytemes.md), in lowercase. |
| `handle` | string | Current handle of the appointment type, in lowercase. |

**Query parameters**

None.

**Request body**

Any writable field of [the AppointmentType object](#the-appointmenttype-object). All are optional; an omitted field is unchanged.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | string | no | unchanged | Display name. Cannot be emptied. |
| `handle` | string | no | unchanged | New handle. |
| `description` | string | no | unchanged | Description. |
| `message` | string | no | unchanged | Welcome text. |
| `active` | boolean | no | unchanged | Bookable or not. |
| `private` | boolean | no | unchanged | Hidden from the hub list of the page. |
| `public` | boolean | no | unchanged | Deprecated. |
| `availability` | string (id) | no | unchanged | [Availability](./availabilities.md) to use. |
| `group` | string | no | unchanged | Grouping label. |
| `urls` | array of strings | no | unchanged | Replaces the list. |
| `brand` | string (id) | no | unchanged | Brand applied. |
| `team` | string (id) | no | unchanged | Team booked. |
| `team_all_members` | boolean | no | unchanged | All members must be free. |
| `team_select_member` | boolean | no | unchanged | Visitor selects a member. |
| `team_select_member_title` | string | no | unchanged | Title of the member selector. |
| `team_select_member_default_option_label` | string | no | unchanged | Default option label. |
| `team_select_member_without_preference` | string | no | unchanged | "No preference" label. |
| `team_select_member_force_selection` | boolean | no | unchanged | Selection is mandatory. |
| `team_availability_name` | string | no | unchanged | Name of the availability used for each team member. |
| `session` | boolean | no | unchanged | Group session. |
| `session_max_spots` | number | no | unchanged | Maximum participants of a session. |
| `paid` | boolean | no | unchanged | Paid appointment. |
| `pay_to_book` | boolean | no | unchanged | Online payment required to book. |
| `payment_price` | number | no | unchanged | Price. |
| `payment_currency` | string | no | unchanged | Currency code. |
| `custom` | object | no | unchanged | Keys of [the `custom` object](./vytemes.md#the-custom-object) to change. Merged key by key. |
| `translations` | object | no | unchanged | Replaces all translations. |
| `tag` | string | no | unchanged | Free label. |
| `version` | number | no | unchanged | Free version number. |

**Response**

`200 OK` with the updated [AppointmentType object](#the-appointmenttype-object).

**Errors**

| Status | When |
|---|---|
| `400` | A value is invalid: handle with a forbidden character, handle made only of digits, handle already used by another appointment type of the page, empty `name`, value outside the allowed values of a `custom` key. The body describes the validation error. |
| `400` | The new `availability` does not exist or does not belong to a user the key can reach. Body: `{"message": "invalid availability <id>"}`. |
| `401` | Missing, unknown or deactivated API key. |
| `404` | No booking page with this nickname among the pages the key can reach, or no appointment type with this handle on the page. |
| `409` | Handle conflict detected at write time (two concurrent requests giving the same handle). Empty body. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/vytemes/john-doe-acme/types/first-meeting' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Discovery call",
    "custom": {
      "duration": 45,
      "sms_confirmation": true,
      "sms_confirmation_message": "Your appointment is confirmed."
    }
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345700",
  "vyteme": "5f1e9b2a8c4d3e0012345678",
  "name": "Discovery call",
  "handle": "first-meeting",
  "description": "A 30 minute call to get to know each other",
  "active": true,
  "private": false,
  "public": true,
  "availability": "5f1e9b2a8c4d3e0012345710",
  "urls": [],
  "team_select_member_force_selection": false,
  "custom": {
    "duration": 45,
    "auto_confirm": true,
    "sms_confirmation": true,
    "sms_confirmation_message": "Your appointment is confirmed.",
    "title_label": "Subject",
    "title_mandatory": true,
    "min_dates": 1,
    "fixed_places": []
  },
  "createdAt": "2026-01-12T09:35:00.000Z",
  "updatedAt": "2026-03-02T16:10:00.000Z"
}
```

### Delete an appointment type

`DELETE /v2/vytemes/:nickname/types/:handle`

Permanently deletes the appointment type. Its public URL stops working. Events already booked are not affected. If the page is left without any active appointment type, its `hub` mode is switched off (see [Hub](./vytemes.md#hub)).

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `nickname` | string | Nickname of the [booking page](./vytemes.md), in lowercase. |
| `handle` | string | Handle of the appointment type, in lowercase. |

**Query parameters**

None.

**Request body**

None.

**Response**

`204 No Content` with an empty body.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `404` | No booking page with this nickname among the pages the key can reach, or no appointment type with this handle on the page. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/vytemes/john-doe-acme/types/first-meeting' \
  --header 'Authorization: YOUR_API_KEY'
```

```
HTTP/1.1 204 No Content
```

### Batch update appointment types

`POST /v2/appointmenttypes/update/batch`

Applies the same changes to **every appointment type that has a given handle**, across all booking pages owned by the users the key can reach. Typical use: each of your users has a `first-meeting` appointment type on their own page and you want to change its duration, texts or availability for everybody in one call.

How the targets are selected:

| Dimension | Rule |
|---|---|
| Appointment types | Those whose `handle` equals the body `handle` (after trimming and lowercasing). `target` must be `"handle"`; no other targeting mode exists. |
| Users | The owners of the pages are restricted by the API key, not by the body: all members of the organization for an `organization` key, the members of the key's teams for a `team` key, the key's own user for a `user` key. All pages of those users are searched (primary and additional). |
| Teams | There is no team filter in the body. To restrict the update to the members of some teams, call the endpoint with a `team` scoped key limited to those teams. |

How the data is applied to each targeted appointment type:

| In `appointment_type` | Effect |
|---|---|
| Field absent | Left untouched. |
| Field with a value | Replaces the stored value. |
| Field set to `null` | Reset: back to its default value when the field has one (e.g. `active` -> `true`, `private` -> `false`), removed otherwise. |
| `custom` object | Merged key by key: keys present replace the stored keys, keys set to `null` are reset to their default or removed, other stored keys are kept. |
| `custom` set to `null` | Every `custom` key is reset to its default or removed. |
| `vyteme`, fields starting with `_`, unknown fields | Ignored. |
| `availability` | Must be an id string of an [availability](./availabilities.md) that belongs to a user the key can reach. It is checked once, before anything is changed; if invalid the whole request is refused with `400`. All targeted appointment types then share that availability. |

The update is **not atomic**: every targeted appointment type is attempted independently. Those that succeed are saved and returned in `updated`; those that fail are left unchanged and reported in `errors`. The same validation as a single update applies to each one (for example, changing `handle` fails with `409` on a page that already has an appointment type with the new handle).

If `active` is part of the data, the `hub` mode of every page left without an active appointment type is switched off.

**Key scope:** organization, team, user. A `team` scoped key whose teams do not all belong to the organization of the key is refused with `403`.

**Path parameters**

None.

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `target` | string | yes | - | Targeting mode. Only `"handle"` is supported. |
| `handle` | string | yes | - | Handle of the appointment types to update. Trimmed and lowercased; must not be empty. |
| `appointment_type` | object | yes | - | The changes to apply: any writable field of [the AppointmentType object](#the-appointmenttype-object), with the semantics above. Must be a JSON object (not an array, not a string). |

**Response**

A JSON object, for the statuses `200`, `400`, `409` and `500` that result from applying the data:

| Field | Type | Description |
|---|---|---|
| `updated[]` | array of [AppointmentType objects](#the-appointmenttype-object) | The appointment types that were saved, in their new state. |
| `errors[]` | array of objects | One entry per appointment type that could not be saved. |
| `errors[]._id` | string (id) | Id of the appointment type. |
| `errors[].vyteme` | string (id) | Id of its booking page. |
| `errors[].handle` | string | Its handle before the update. |
| `errors[].status` | number | Status of this failure: `409` (handle already used on that page), `400` (invalid value) or `500` (unexpected error). |
| `errors[].message` | string | Human-readable message. Its wording is not stable; do not parse it. |

Status code of the response:

| Status | When |
|---|---|
| `200` | `errors` is empty: every targeted appointment type was updated. |
| `409` | Every failure is a `409`. Some appointment types may have been updated: read `updated`. |
| `400` | At least one failure, not all of them `409`, none of them `500`. Some appointment types may have been updated: read `updated`. |
| `500` | At least one failure is a `500`. Some appointment types may have been updated: read `updated`. |

**Errors**

Requests refused before anything is changed:

| Status | When |
|---|---|
| `400` | `appointment_type` is missing or is not a JSON object. Body: `{"error": "missing appointment_type property"}`. |
| `400` | `target` is missing. Body: `{"error": "missing target property"}`. |
| `400` | `target` is not `"handle"`. Body: `{"error": "Target not supported"}`. |
| `400` | `handle` is missing, is not a string, or is empty after trimming. Body: `{"error": "missing handle property"}`. |
| `400` | `appointment_type.availability` is not an id string, does not exist, or does not belong to a user the key can reach (including a `team` key whose teams have no member). Body: `{"message": "invalid availability <id>"}` or `{"message": "invalid availability"}`. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key with a team outside the organization of the key. |
| `404` | No appointment type with this handle on the pages of the users the key can reach. Body: `{"error": "No appointment type with handle <handle> for the targeted users"}`. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/appointmenttypes/update/batch' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "target": "handle",
    "handle": "first-meeting",
    "appointment_type": {
      "description": "A 45 minute discovery call",
      "group": null,
      "custom": {
        "duration": 45,
        "redirect_url": null
      }
    }
  }'
```

```json
{
  "updated": [
    {
      "_id": "5f1e9b2a8c4d3e0012345700",
      "vyteme": "5f1e9b2a8c4d3e0012345678",
      "name": "First meeting",
      "handle": "first-meeting",
      "description": "A 45 minute discovery call",
      "active": true,
      "private": false,
      "public": true,
      "availability": "5f1e9b2a8c4d3e0012345710",
      "urls": [],
      "team_select_member_force_selection": false,
      "custom": {
        "duration": 45,
        "auto_confirm": true,
        "min_dates": 1,
        "fixed_places": []
      },
      "createdAt": "2026-01-12T09:35:00.000Z",
      "updatedAt": "2026-03-02T16:10:00.000Z"
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345750",
      "vyteme": "5f1e9b2a8c4d3e0012345690",
      "name": "First meeting",
      "handle": "first-meeting",
      "description": "A 45 minute discovery call",
      "active": true,
      "private": false,
      "public": true,
      "availability": "5f1e9b2a8c4d3e0012345760",
      "urls": [],
      "team_select_member_force_selection": false,
      "custom": {
        "duration": 45,
        "auto_confirm": true,
        "min_dates": 1,
        "fixed_places": []
      },
      "createdAt": "2026-01-15T11:00:00.000Z",
      "updatedAt": "2026-03-02T16:10:00.000Z"
    }
  ],
  "errors": []
}
```

Example of a partial failure (renaming the handle, one page already has the new handle) - the response status is `409`:

```json
{
  "updated": [
    {
      "_id": "5f1e9b2a8c4d3e0012345700",
      "vyteme": "5f1e9b2a8c4d3e0012345678",
      "name": "First meeting",
      "handle": "discovery-call"
    }
  ],
  "errors": [
    {
      "_id": "5f1e9b2a8c4d3e0012345750",
      "vyteme": "5f1e9b2a8c4d3e0012345690",
      "handle": "first-meeting",
      "status": 409,
      "message": "Validation failed"
    }
  ]
}
```

(The objects of `updated` are complete AppointmentType objects; they are shortened here.)

## Notes and caveats

- **Update uses `PUT`** on `/v2/vytemes/:nickname/types/:handle`; it is a partial update despite the method. There is no `POST` on that path.
- **New appointment types inherit from their page.** Without `template`, the page's `custom`, `message`, `urls`, `brand` and team settings are copied at creation time. Later changes to the page are not propagated.
- **Falsy values at creation.** For the team, session, group and payment fields, `false`/`0`/`""` in the creation body cannot override a truthy value of the template; update the appointment type afterwards.
- **Invalid handle: `500` on create, `400` on update.** Duplicate handle: `409` on create, `400` on update (`409` only for a conflict detected at write time), `409` per item in the batch.
- **Null handling differs.** In the batch update `null` resets a field to its default. In the single `PUT`, send the value you want instead of `null`.
- **`custom` is always merged, never replaced**, by `PUT` and by the batch update. To remove a `custom` key, use the batch update with that key set to `null`.
- **The batch update can partially succeed** and still answer `400`, `409` or `500`. Always read `updated` and `errors`.
- **The batch update is scoped by the API key**, not by the body: use a `team` scoped key to limit it to the members of given teams.
- **Buffers, minimum notice, booking horizon and opening hours** are properties of the [availability](./availabilities.md), not of the appointment type. When no `availability` is given at creation, the appointment type gets its own copy, so editing that copy affects only this appointment type. An availability explicitly shared between appointment types is edited for all of them at once.
- **Deleting an appointment type does not delete its availability.**
- **Lists are not ordered and not paginated.** There is no position field.
- **Timestamps are `createdAt` / `updatedAt`** (camelCase) on appointment types.
- **Error bodies are not uniform**: empty, plain text, `{"message": ...}` or `{"error": ...}` depending on the case. Rely on the status code.
- **Inactive and private appointment types are returned by the API.** `active: false` removes the appointment type from the public site; `private: true` only hides it from the hub list of its page.
