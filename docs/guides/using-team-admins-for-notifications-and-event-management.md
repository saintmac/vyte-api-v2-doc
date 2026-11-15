# Using team admins for notifications and event management

In the [team booking guide](/guides/setup-team-booking/), we created a team and booked an appointment with one of its members. This guide shows how to use the **admins** of a team to keep managers or assistants informed of what happens on the events of the team's members, and how to follow and manage these events with the API.

At the end, a manager will receive a copy of the notification emails about the bookings of the team, and you will know how to list the events of the team, reassign one to another member and cancel one.

[[toc]]

## What team admins are for

A team holds two independent lists of users, `members` and `admins`, which gives three roles:

| Role | In `members` | In `admins` | Meaning |
| --- | --- | --- | --- |
| Member | yes | no | A bookable person of the team. |
| Admin | yes | yes | A bookable person of the team who also administers it. |
| Admin-only | no | yes | Administers the team without being bookable in it (for example a manager or an assistant). |

The admins of a team can receive a copy of the notification emails that Vyte sends about the events of the team's members, without being invitees of those events. Which emails are copied is decided by the **team admin preferences**: one object per team, shared by all its admins. With no preferences defined, or with all flags set to `false` (the default), the admins receive nothing.

## Prerequisites

- An API key with the `organization` scope (see [Get started](/guides/getting-started/)). The endpoints that change the roles of a team only accept this scope.
- A team created with the API, with at least one member. In this guide the `_id` of the team is `5f1e9b2a8c4d3e0012345678`, and its members are John Doe (`5f1e9b2a8c4d3e0012345601`) and Alex Martin (`5f1e9b2a8c4d3e0012345603`).
- The user who will become admin must already be a user of your organization. Team endpoints never create users. In this guide the manager is Sam Manager, whose `_id` is `5f1e9b2a8c4d3e0012345605`.

## Step 1: make a user an admin of the team

Sam manages the Sales team but must not receive bookings. We give Sam the **admin-only** role with a `POST` request to `/v2/teams/:team_id/members/:member_id/admin-only`, where `member_id` is the `_id` of the user. The request has no body.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%252F5f1e9b2a8c4d3e0012345678%252Fmembers%252F5f1e9b2a8c4d3e0012345605%252Fadmin-only%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 256px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/members/5f1e9b2a8c4d3e0012345605/admin-only' \
--header 'Authorization: YOUR_API_KEY'
```

The answer is `200` with the team after the change. Sam is now in `admins` and not in `members`:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales",
  "extid": "sales",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "level_name": "department",
  "tags": [],
  "public": false,
  "members": [
    {
      "_id": "5f1e9b2a8c4d3e0012345601",
      "full_name": "John Doe",
      "emails": ["john.doe@example.com"],
      "calendars": { "google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false }
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345603",
      "full_name": "Alex Martin",
      "emails": ["alex.martin@example.com"],
      "calendars": { "google": false, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false }
    }
  ],
  "admins": [
    {
      "_id": "5f1e9b2a8c4d3e0012345601",
      "full_name": "John Doe",
      "emails": ["john.doe@example.com"],
      "calendars": { "google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false }
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345605",
      "full_name": "Sam Manager",
      "emails": ["sam.manager@example.com"],
      "calendars": { "google": false, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false }
    }
  ],
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

The call is idempotent and no email is sent to the user.

> If the admin must also be bookable in the team, use `POST /v2/teams/:team_id/members/:member_id/admin` instead: the user is added to `admins` and, if not already there, to `members`. To remove the admin role, send a `DELETE` request to the same path; the `members` list is not modified.

## Step 2: choose the notifications sent to the admins

The preferences are set with a `PUT` (or `POST`, both behave identically) request to `/v2/teams/:team_id/admin-preferences`. The body carries a `prefs` object with two parts: `email` (the notification emails copied to the admins) and `calendar`.

In the table below, "the member" is the team member taking part in the event.

| Flag of `prefs.email` | The admins receive a copy when |
| --- | --- |
| `vyteme_created_admin` | An event was booked on the member's booking page. |
| `new_event` | An event was created by someone else and the member is invited to it. |
| `new_event_admin` | An event was created by the member. |
| `event_confirmed` | An event of the member was confirmed by someone else. |
| `event_confirmed_admin` | An event created by the member was confirmed by the member. |
| `event_cancelled` | An event of the member was cancelled by someone else. |
| `event_cancelled_admin` | An event created by the member was cancelled by the member. |
| `attending` | An invitee accepted an event created by the member. |
| `declined` | An invitee declined an event created by the member. |
| `new_message` | Someone else posted a message in an event the member takes part in or created. |
| `new_suggestion` | Someone else suggested a new date or place in an event of the member. |
| `new_suggestion_own` | The member suggested a new date or place. |
| `vote_update` | Someone voted on the dates or places of an event created by the member. |
| `vote_confirmation` | The member voted (confirmation email of their own vote). |

`prefs.calendar.blocker` is a separate option: when `true`, each confirmed event created by a member of the team also blocks the corresponding time in the calendars of the team's admins (except for an admin who is the creator of the event). The block is updated when the event changes and removed when the event is cancelled.

Sam wants to be told when an appointment is booked with a member of the team, and when one is confirmed or cancelled:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520PUT%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%252F5f1e9b2a8c4d3e0012345678%252Fadmin-preferences%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522prefs%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522email%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522vyteme_created_admin%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522event_confirmed%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522event_confirmed_admin%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522event_cancelled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522event_cancelled_admin%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522new_event%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522new_event_admin%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522attending%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522declined%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522new_message%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522new_suggestion%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522new_suggestion_own%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522vote_update%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522vote_confirmation%2522%253A%2520false%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522calendar%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522blocker%2522%253A%2520false%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%257D%27"
  style="width: 100%; height: 784px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request PUT 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/admin-preferences' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "prefs": {
    "email": {
      "vyteme_created_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": true,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "new_event": false,
      "new_event_admin": false,
      "attending": false,
      "declined": false,
      "new_message": false,
      "new_suggestion": false,
      "new_suggestion_own": false,
      "vote_update": false,
      "vote_confirmation": false
    },
    "calendar": {
      "blocker": false
    }
  }
}'
```

The answer is `200` with the saved preferences (also when they were just created):

```json light-code
{
  "_id": "5f1e9b2a8c4d3e00123456bb",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "prefs": {
    "email": {
      "attending": false,
      "declined": false,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": true,
      "new_event": false,
      "new_event_admin": false,
      "new_message": false,
      "new_suggestion": false,
      "new_suggestion_own": false,
      "vote_update": false,
      "vote_confirmation": false,
      "vyteme_created_admin": true
    },
    "calendar": {
      "blocker": false
    }
  },
  "createdAt": "2026-02-03T14:05:12.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

::: warning
Treat `prefs` as a full replacement: always send the complete set of flags. A flag that is not present in the `prefs` you send must be considered reset to `false`, and this also applies to `prefs.calendar` when you only send `prefs.email`. To change a single flag, retrieve the current object (next step), modify it and send the whole `prefs` back.
:::

> The preferences can also be set when the team is created or updated, with the `admin_preference` field of `POST /v2/teams` (an object of the form <code v-pre>{"prefs": {...}}</code>).

## Step 3: check the preferences

To read the preferences of the team, send a `GET` request to the same path:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%252F5f1e9b2a8c4d3e0012345678%252Fadmin-preferences%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 256px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/admin-preferences' \
--header 'Authorization: YOUR_API_KEY'
```

The answer is `200` with the same object as in the previous step:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e00123456bb",
  "belongs_to": "5f1e9b2a8c4d3e0012345678",
  "prefs": {
    "email": {
      "attending": false,
      "declined": false,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": true,
      "new_event": false,
      "new_event_admin": false,
      "new_message": false,
      "new_suggestion": false,
      "new_suggestion_own": false,
      "vote_update": false,
      "vote_confirmation": false,
      "vyteme_created_admin": true
    },
    "calendar": {
      "blocker": false
    }
  },
  "createdAt": "2026-02-03T14:05:12.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

Until preferences have been set once for a team, this request answers `404` even though the team exists. Treat this `404` as "all flags `false`".

## What happens next

The change applies to the notifications sent after the call; no email is sent by the call itself. From now on:

- An event "concerns" the team when one of its participants is a Vyte user who is in the team's `members`.
- Each time Vyte sends a notification email about such an event to that member, and the matching flag is `true`, every admin of the team receives a copy of that email at their primary address. With the preferences above, when a visitor books John Doe on his booking page, Sam receives a copy of the email John receives, then another one if the appointment is cancelled.
- The copy is sent whatever the member's own notification preferences are. The admins are notified in addition to the member, not instead of them.
- An admin who administers several teams concerned by the same event receives each notification only once.
- Only the events of `members` trigger notifications: events in which only an admin-only user takes part do not notify the other admins.

## Step 4: follow the events of the team

Besides emails, your application can show a manager all the events of the team. Send a `GET` request to `/v2/teams/:team_id/events`: it returns the events in which at least one member of the team is an invitee (organizer included). The `filter` query parameter accepts `confirmed`, `to_confirm`, `pending` or `upcoming`.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%252F5f1e9b2a8c4d3e0012345678%252Fevents%253Ffilter%253Dupcoming%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 256px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/events?filter=upcoming' \
--header 'Authorization: YOUR_API_KEY'
```

The answer is `200` with an array of events (each element is shortened here):

```json light-code
[
  {
    "_id": "5f1e9b2a8c4d3e0012345800",
    "title": "Meeting Jane Doe / John Doe",
    "vyteme": true,
    "created_by": {
      "user": "5f1e9b2a8c4d3e0012345601",
      "email": "john.doe@example.com",
      "full_name": "John Doe"
    },
    "confirmed": {
      "flag": true,
      "updated_at": "2028-02-01T09:12:44.000Z",
      "date_id": "5f1e9b2a8c4d3e0012345801"
    },
    "dates": [
      {
        "_id": "5f1e9b2a8c4d3e0012345801",
        "date": "2028-02-09T15:45:00.000Z",
        "end_date": "2028-02-09T16:30:00.000Z",
        "all_day": false,
        "confirmed": true
      }
    ],
    "places": [],
    "invitees": [
      {
        "_id": "5f1e9b2a8c4d3e0012345803",
        "user": "5f1e9b2a8c4d3e0012345620",
        "email": "jane.doe@example.com",
        "full_name": "Jane Doe"
      },
      {
        "_id": "5f1e9b2a8c4d3e0012345804",
        "user": "5f1e9b2a8c4d3e0012345601",
        "email": "john.doe@example.com",
        "full_name": "John Doe"
      }
    ],
    "timezone": "Europe/Paris",
    "first_start_date": "2028-02-09T15:45:00.000Z",
    "last_end_date": "2028-02-09T16:30:00.000Z",
    "links": null,
    "createdAt": "2028-02-01T09:12:44.000Z",
    "updatedAt": "2028-02-01T09:12:44.000Z"
  }
]
```

With the `upcoming` and `confirmed` filters, the events are sorted by start date, soonest first.

## Step 5: reassign or cancel an event of the team

John Doe is finally unavailable for this appointment and the manager wants Alex Martin to take it. To transfer an event to another organizer, send a `POST` request to `/v2/events/:event_id/admin` with the `_id` of the new organizer in `user`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fevents%252F5f1e9b2a8c4d3e0012345800%252Fadmin%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522user%2522%253A%2520%25225f1e9b2a8c4d3e0012345603%2522%252C%250A%2520%2520%2522keep_as_invitee%2522%253A%2520false%250A%257D%27"
  style="width: 100%; height: 366px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345800/admin' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "user": "5f1e9b2a8c4d3e0012345603",
  "keep_as_invitee": false
}'
```

The answer is `200` with the updated event (shortened here). `created_by` is the new organizer and `reassigned` is `true`:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345800",
  "title": "Meeting Jane Doe / John Doe",
  "created_by": {
    "user": "5f1e9b2a8c4d3e0012345603",
    "email": "alex.martin@example.com",
    "full_name": "Alex Martin"
  },
  "reassigned": true,
  "invitees": [
    {
      "_id": "5f1e9b2a8c4d3e0012345803",
      "user": "5f1e9b2a8c4d3e0012345620",
      "email": "jane.doe@example.com",
      "full_name": "Jane Doe"
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345805",
      "user": "5f1e9b2a8c4d3e0012345603",
      "email": "alex.martin@example.com",
      "full_name": "Alex Martin"
    }
  ]
}
```

A notification of the change of organizer is sent, the meeting is removed from the calendar of the previous organizer and written in the calendar of the new one. The state of the event, its dates and its places are unchanged. With `keep_as_invitee` set to `true`, the previous organizer stays in the event as a plain invitee.

::: warning
No availability check is made on the new organizer. Check their [slots](/reference/slots/) first if needed.
:::

If the appointment must not take place at all, cancel it with a `POST` request to `/v2/events/:event_id/cancel`. The optional `message` is included in the cancellation email:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fevents%252F5f1e9b2a8c4d3e0012345800%252Fcancel%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522message%2522%253A%2520%2522We%2520have%2520to%2520cancel%2520this%2520appointment%252C%2520sorry.%2522%250A%257D%27"
  style="width: 100%; height: 344px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345800/cancel' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "message": "We have to cancel this appointment, sorry."
}'
```

The answer is `200` with the cancelled event (shortened here):

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345800",
  "title": "Meeting Jane Doe / John Doe",
  "confirmed": {
    "flag": true,
    "updated_at": "2028-02-01T09:12:44.000Z",
    "date_id": "5f1e9b2a8c4d3e0012345801"
  },
  "cancelled": "2028-02-03T14:20:00.000Z",
  "cancelled_by": "5f1e9b2a8c4d3e0012345603"
}
```

A cancellation email is sent to the participants and the meeting is removed from the organizer's connected calendar. The admins of the team receive their copy according to the `event_cancelled` and `event_cancelled_admin` flags.

## Common mistakes

- **Sending only the flags to change.** `prefs` is replaced as a whole: the flags you omit go back to `false`. Always send the complete object.
- **Sending the flags at the root of the body.** The flags must be wrapped in `prefs.email` (and `prefs.calendar`). Unknown fields are ignored, so a misplaced flag is not reported.
- **Expecting different preferences per admin.** There is one preferences object per team, shared by all its admins. Who receives the notifications is defined by the team's `admins` list.
- **Reading `404` on `GET` as an error.** It only means that no preferences have been set for the team yet.
- **Using `/admin` for a manager who must not be booked.** `/admin` also adds the user to `members`; use `/admin-only` for an administrator who must not receive team bookings.
- **Listing a user only in `admins` when creating a team and expecting them to be bookable.** In `POST /v2/teams` and `PUT /v2/teams/:team_id`, `admins` and `members` are independent, and each list you send replaces the existing one.
- **Looking for a way to delete the preferences.** There is no `DELETE`: to stop all admin notifications, send a `prefs` object with every flag set to `false`.
- **Expecting `201` on the first call.** `POST` and `PUT` on the preferences both answer `200`.

## Reference

- [Teams](/reference/teams/): [roles in a team](/reference/teams/#roles-in-a-team), [make a user an admin](/reference/teams/#make-a-user-an-admin-of-a-team), [make a user an admin-only](/reference/teams/#make-a-user-an-admin-only-of-a-team), [remove the admin role](/reference/teams/#remove-the-admin-role-of-a-user).
- [Team admin preferences](/reference/team_admin_preferences/): [the object](/reference/team_admin_preferences/#the-team-admin-preferences-object), [set the preferences](/reference/team_admin_preferences/#set-the-admin-preferences-of-a-team).
- [Events](/reference/events/): [list the events of a team](/reference/events/#list-the-events-of-a-team), [change the organizer](/reference/events/#change-the-organizer-of-an-event), [cancel an event](/reference/events/#cancel-an-event).
- [Webhooks](/reference/webhooks/), to be notified in your own system rather than by email (see the [webhooks guide](/guides/set-up-webhooks/)).
