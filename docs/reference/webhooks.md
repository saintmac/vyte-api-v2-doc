---
{ "pageClass": "reference-page" }
---

# Webhooks

:::::panel

:::: left
A webhook is a subscription that asks Vyte to call one of your HTTPS endpoints (the
`target_url`) each time a given **action** happens on a resource you have access to: an
[Event](./events.md) is created, confirmed, updated or cancelled, an invitee answers, a
[User](./users.md) joins your organization, a [booking page](./vytemes.md) is modified. Webhooks
replace polling: instead of repeatedly reading events, you are notified shortly after each change.

Vocabulary: what most webhook systems call an "event" is called an **action** in Vyte, because
"Event" is already the name of Vyte's main resource (a meeting). An action name has the form
`<resource>.<action>`, for example `event.confirmed`.

One webhook subscribes to exactly one action and one target URL. To follow several actions,
create one webhook per action (they may share the same `target_url`).

Authentication, key scopes, id and date formats and the general error format are described in
[Conventions](./README.md).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/hooks" href="#list-webhooks"></endpoint>
  <endpoint method="post" path="/v2/hooks" href="#create-a-webhook"></endpoint>
  <endpoint method="get" path="/v2/hooks/:hook_id" href="#retrieve-a-webhook"></endpoint>
  <endpoint method="put" path="/v2/hooks/:hook_id" href="#update-a-webhook"></endpoint>
  <endpoint method="delete" path="/v2/hooks/:hook_id" href="#delete-a-webhook"></endpoint>
</endpoints>
::::

:::::

## The Webhook object

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string | no | Id of the webhook. |
| `action` | string | yes | The action the webhook subscribes to. One of the names listed in [Actions](#actions). Required. |
| `event` | string | yes | Alias of `action`, accepted for tools that name this field `event`. On creation, when `event` is sent its value is copied into `action` (and takes precedence over an `action` sent in the same body). On update, `event` is stored but `action` is left unchanged: always use `action` to change the subscription. |
| `target_url` | string | yes | The URL Vyte calls. Required. Must start with `https://` and may only contain letters, digits and the characters `-` `_` `.` `?` `&` `=` `#` `/`. In particular a port (`:8443`), credentials (`user:pass@`), `%`-escapes, `+` and `~` are refused. |
| `scope` | string | no | `organization`, `team` or `user`. Set by Vyte from the API key used at creation and from `team_id` (see [Scope of a webhook](#scope-of-a-webhook)). |
| `organization` | string | no | Id of the organization owning the webhook. Present when `scope` is `organization` or `team`. |
| `user` | string | no | Id of the user owning the webhook. Present when `scope` is `user`. |
| `team_id` | string | yes | Id of the [Team](./teams.md) the webhook is restricted to. Sending it makes the webhook a `team` scoped webhook. |
| `team` | string | no | Id of the team of a `team` scoped webhook (same value as `team_id`). |
| `headers` | object | yes | Custom HTTP headers (name -> string value) that Vyte adds to every call to `target_url`. Use it to authenticate Vyte's calls on your side. `Content-Type` is always forced to `application/json`. Not set by default. |
| `token` | string | yes | Convenience for bearer authentication: when set, Vyte adds the header `Authorization: Bearer <token>` to `headers`. |
| `object_root` | boolean | yes | Shape of the delivered body. `false` (default): the body is a JSON **array** containing one notification object. `true`: the body is the notification **object** itself. |
| `last_call_at` | string (date-time) | no | Date of the last call attempted to `target_url`. Absent until the first call. |
| `last_status` | number | no | HTTP status code answered by your endpoint on the last call. Absent when the last call got no HTTP answer (connection error, timeout). |
| `last_error` | string | no | Error of the last call when it got no HTTP answer. Removed by the next call that gets an answer. |
| `consecutive_failures` | number | no | Number of failed calls in a row. Reset to `0` by a successful call and by any update of the webhook. |
| `disabled_at` | string (date-time) | no | Present when Vyte has disabled the webhook after too many failures (see [Automatic deactivation](#automatic-deactivation)). A disabled webhook is not called. |
| `disabled_reason` | string | no | Human readable reason of the deactivation. |
| `createdAt` | string (date-time) | no | Creation date. Note the camelCase name. |
| `updatedAt` | string (date-time) | no | Last modification date. Note the camelCase name. |

Responses may contain additional fields not listed here; they are internal, may change without
notice and must not be relied upon.

The values of `headers` and `token` are returned in clear text by the read endpoints to any API
key allowed to read the webhook.

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "scope": "organization",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "action": "event.confirmed",
  "target_url": "https://api.example.com/vyte/hooks?source=vyte",
  "headers": {
    "Authorization": "Bearer YOUR_ENDPOINT_TOKEN"
  },
  "token": "YOUR_ENDPOINT_TOKEN",
  "object_root": false,
  "last_call_at": "2026-03-02T16:40:03.000Z",
  "last_status": 200,
  "consecutive_failures": 0,
  "createdAt": "2026-01-14T09:12:44.000Z",
  "updatedAt": "2026-01-14T09:12:44.000Z"
}
```

## Actions

Complete list of the action names accepted in `action`. Any other value is refused with `400`.

### Event actions

For every event action, `resource` in the delivered body is the [Event](./events.md) object.
"Organizer" means the user designated by the event's `created_by` (for a booking made on a
booking page this is the **booked** user, not the visitor).

| Action | Fires when | Content of `payload` |
|---|---|---|
| `event.created` | An event is created. This covers events created unconfirmed (group scheduling poll, booking awaiting confirmation) and events created already confirmed (typical booking page booking). An event created already confirmed fires both `event.created` and `event.confirmed`. Exception: an event created already confirmed whose `invitees` list has at most one entry fires nothing. | Unconfirmed creation: no `payload`. Confirmed creation: `date` (string, human readable confirmed date, present when a date is confirmed), `place` (string, name of the confirmed place, present when a place is confirmed). |
| `event.confirmed` | A final date and/or place is set on an event: either an existing event gets confirmed, or the event is created already confirmed (see above). An event confirmed on several dates at once (multi-date confirmation) does not fire this action. | `date` (string, human readable confirmed date, when there is one), `place` (string, name of the confirmed place, when there is one). |
| `event.updated` | An event that had been confirmed, then edited (which un-confirms it), is confirmed again. Usually the date and/or place changed, without guarantee. `event.confirmed` is delivered as well for the same change. Not fired when the event is in the past. | No `payload`. |
| `event.cancelled` | An event, confirmed or not, is cancelled (for instance through `POST /v2/events/:event_id/cancel`, see [Events](./events.md)). Cancelling an already cancelled event fires nothing. | No `payload`. |
| `event.invitees.added` | Invitees are added to an existing event. | `users` (array, references to the users of the added invitees), `inviter` (string, name or email of the invitee who performed the addition, when identified), and when the event is confirmed `date` (string, human readable) and `place` (string, place name). |
| `event.invitees.voted` | An invitee other than the organizer votes on the proposed dates/places of an event that is **not** confirmed. Not fired when that vote automatically confirms the event (then `event.confirmed` fires). | `voter` (string, full name or email of the voter), `user_id` (string, user id of the voter), `title` (string, event title), `dates[]` (one entry per proposed date: `_id`, `all_day` boolean, `start_date` ISO date-time, `end_date` ISO date-time when the date has an end, `vote` = `"yes"` or `"no"`), `places[]` (one entry per proposed place: `_id`, `name`, `address`, `vote` = `"yes"` or `"no"`). |
| `event.invitees.attending` | An invitee other than the organizer accepts (answers without declining) an event that **is** confirmed. | `voter`, `user_id`, `title` as above, `start_date` (ISO date-time of the confirmed date) and `end_date` (ISO date-time, when the confirmed date has an end). |
| `event.invitees.declined` | An invitee other than the organizer declines the event. | `voter`, `user_id`, `title`. |
| `event.invitees.new_suggestion` | A participant suggests a new date or a new place on an event. | `voter` (string, full name or email of the participant), `title` (string, event title). |
| `event.messages.created` | A message is posted on an existing event by an identified participant. The message created together with the event and the automatic confirmation message do not fire it. | `message` (string, message body), `from_name` (string, first name of the author or the local part of their email, when it can be determined). |

`event.invitees.voted`, `event.invitees.attending`, `event.invitees.declined` and
`event.invitees.new_suggestion` are debounced per event and per participant: several answers of
the same participant on the same event within a short period (in the order of one to a few
minutes) produce a single delivery reflecting the final state.

### User actions

For user actions, `resource` is the [User](./users.md) object concerned (without its calendar
provider account details).

| Action | Fires when | Content of `payload` |
|---|---|---|
| `user.joined` | A user becomes a member of your organization. When an external id (`extid`) was supplied for that user when joining, it is available at `resource.account.organization.extid`. | No `payload`. |
| `user.calendar_disconnected` | Vyte detects that the access to one of the user's connected external calendars is broken (revoked or expired authorization, for instance) and marks it as disconnected. Fired once when the calendar becomes disconnected, not on every failed synchronization. | `calendarName` (string, name of the disconnected calendar). |

### Booking page actions

| Action | Fires when | Delivered content |
|---|---|---|
| `vyteme.updated` | A [booking page](./vytemes.md) of a member of your organization is created or modified. | `resource` is the booking page object; the notification also carries `user`, the [User](./users.md) object owning the page. No `payload`. |

## Scope of a webhook

The scope of a webhook is decided at creation and determines which occurrences of the action it
receives.

| API key scope | `team_id` in body | Resulting webhook `scope` | Owner fields |
|---|---|---|---|
| `organization` | absent | `organization` | `organization` = the key's organization |
| `organization` | present | `team` | `organization` = the key's organization, `team` = `team_id` |
| `team` | present (must be one of the key's teams, else `403`) | `team` | `organization` = the key's organization, `team` = `team_id` |
| `user` | absent | `user` | `user` = the key's user |

With a `team` scoped key always send `team_id`: a webhook created without it is not attached to
any team and is never called.

Which webhooks are called for each action:

| Action family | `organization` scoped webhook | `team` scoped webhook | `user` scoped webhook |
|---|---|---|---|
| `event.*` | Called when the event's organizer is a member of the organization. | Called when the event's organizer is a member of the team. | Called when the event's organizer is the user. |
| `user.calendar_disconnected` | Called when the user is a member of the organization. | Called when the user is a member of the team. | Called when it is the user's own calendar. |
| `user.joined` | Called for every user joining the organization. | Called for every user joining the webhook's organization (not limited to the team). | Never called. |
| `vyteme.updated` | Called for the booking pages of every member of the organization. | Called for the booking pages of every member of the webhook's organization (not limited to the team). | Never called. |

For event actions the criterion is the **organizer** of the event (`created_by`), not the other
invitees and not the team a booking page belongs to: a `team` scoped webhook receives all the
events organized by the members of that team, whichever booking page they were booked on.

## Receiving a webhook call

### Request sent by Vyte

`POST <target_url>`

| Header | Value |
|---|---|
| `Content-Type` | `application/json` (always) |
| each entry of the webhook's `headers` | as configured (for instance `Authorization: Bearer <token>` when `token` is set) |

The body is JSON. By default (`object_root: false`) it is an **array containing exactly one
notification object**. With `object_root: true` it is the notification object itself, for
receivers that only accept a JSON object.

Notification object:

| Property | Type | Present | Description |
|---|---|---|---|
| `action` | string | always | The action of the webhook, for instance `event.cancelled`. |
| `resource` | object | always | The resource the action happened on: an [Event](./events.md) object for `event.*`, a [User](./users.md) object for `user.*`, a [booking page](./vytemes.md) object for `vyteme.updated`. It is the full resource as it was when Vyte processed the action. It may contain fields that are not part of the documented resource; they are internal, may change without notice and must not be relied upon. |
| `payload` | object | for some actions | Small action specific summary, see the "Content of `payload`" columns above. Its `date` values are display strings whose format is not guaranteed: read dates from `resource`. |
| `organization` | string | `organization` and `team` scoped webhooks | Id of the organization owning the webhook. |
| `team` | string | `team` scoped webhooks | Present for `team` scoped webhooks. It currently carries the id of the **organization**, not the id of the team: do not use it to identify the team (give each team webhook a distinct `target_url` or custom header instead). |
| `user` | string or object | `user` scoped webhooks; `vyteme.updated` | For a `user` scoped webhook: id of the user owning the webhook. For `vyteme.updated`: the User object owning the booking page. |

Example: default delivery of `event.cancelled` to an `organization` scoped webhook (the
`resource` is shortened here; see [Events](./events.md) for the full object).

```http
POST /vyte/hooks?source=vyte HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer YOUR_ENDPOINT_TOKEN
```

```json
[
  {
    "action": "event.cancelled",
    "resource": {
      "_id": "5f1e9b2a8c4d3e0012349999",
      "title": "Discovery call",
      "vyteme": true,
      "cancelled": "2026-03-02T16:40:01.000Z",
      "confirmed": { "flag": true },
      "created_by": { "user": "5f1e9b2a8c4d3e0012340001" },
      "dates": [
        { "all_day": false, "date": "2026-03-10T10:00:00.000Z", "end_date": "2026-03-10T10:30:00.000Z" }
      ],
      "places": [
        { "name": "Head office", "address": "12 rue de Rivoli, 75004 Paris, France" }
      ],
      "invitees": [
        { "full_name": "Jane Doe", "email": "jane.doe@example.com" }
      ],
      "lang": "en",
      "timezone": "Europe/Paris"
    },
    "organization": "5f1e9b2a8c4d3e0012340000"
  }
]
```

Example: `event.invitees.attending` with `object_root: true`.

```json
{
  "action": "event.invitees.attending",
  "resource": { "_id": "5f1e9b2a8c4d3e0012349999", "title": "Discovery call" },
  "payload": {
    "voter": "Jane Doe",
    "user_id": "5f1e9b2a8c4d3e0012340042",
    "title": "Discovery call",
    "start_date": "2026-03-10T10:00:00.000Z",
    "end_date": "2026-03-10T10:30:00.000Z"
  },
  "organization": "5f1e9b2a8c4d3e0012340000"
}
```

Example: `user.joined`.

```json
[
  {
    "action": "user.joined",
    "resource": {
      "_id": "5f1e9b2a8c4d3e0012340042",
      "full_name": "John Smith",
      "account": { "organization": { "extid": "YOUR_INTERNAL_ID_42" } }
    },
    "organization": "5f1e9b2a8c4d3e0012340000"
  }
]
```

### What your endpoint must answer

| Your answer | Meaning for Vyte |
|---|---|
| Status `200`, `201`, `202`, `203`, `204`, `205`, `207`, `208` or `226` | Success. `consecutive_failures` is reset to `0`. The response body is ignored. |
| Any other status, including `3xx` redirections (they are not followed), `206`, `4xx` and `5xx` | Failure. |
| No answer within 30 seconds, connection or TLS error | Failure. |
| Status `410` from a `target_url` hosted on `zapier.com` (or a subdomain) | The webhook is deleted (this is how that platform unsubscribes). For any other host `410` is an ordinary failure. |

Answer quickly (acknowledge, then process asynchronously on your side).

### Delivery guarantees

- **Delay.** A call is made asynchronously, at the earliest about one second after the action.
  The debounced invitee actions listed above are delivered later (in the order of minutes).
- **No guaranteed retry.** A failed call must be considered lost: do not rely on Vyte calling
  again for the same occurrence. If you must not miss a change, reconcile periodically by
  reading the resources ([Events](./events.md)).
- **No ordering guarantee.** Calls for different actions are independent: for an event created
  already confirmed, `event.created` and `event.confirmed` may arrive in any order, as may
  `event.confirmed` and `event.updated`. Use the content of `resource` (and re-read the resource
  if needed) rather than the arrival order.
- **Duplicates are possible.** Make your processing idempotent (for instance keyed on action +
  `resource._id` + the resource's modification date).
- **One call per webhook.** Each webhook matching an occurrence is called separately; if two of
  your webhooks (for instance an organization one and a team one) match, you receive two calls.
- The notification carries no delivery id and no timestamp of its own.

### Automatic deactivation

Vyte counts the failed calls in a row for each webhook (`consecutive_failures`). After 20
consecutive failures the webhook is disabled: `disabled_at` and `disabled_reason` are set and
the webhook is no longer called. Occurrences that happen while it is disabled are not queued
and are not replayed later.

To re-enable a disabled webhook, update it with `PUT /v2/hooks/:hook_id` (any update, even one
that changes nothing, clears `disabled_at`, `disabled_reason` and resets
`consecutive_failures`). Monitor `disabled_at`, `last_status` and `last_error` through
`GET /v2/hooks` to detect a failing endpoint.

### Securing your endpoint

Vyte does **not** sign webhook calls: there is no signature header and no shared secret
computed over the body. To make sure a call comes from Vyte:

- Use an `https://` `target_url` (plain `http://` is refused) and treat the URL as a secret: put
  a long random component in its path or query string (for instance
  `https://api.example.com/vyte/hooks/3f9c0a7e5b1d4c2e8a6f?source=vyte`).
- And/or set `token` (sent as `Authorization: Bearer <token>`) or custom `headers` holding a
  secret that your endpoint verifies on every call.
- Treat the body as a notification, not as a source of truth for sensitive decisions: when in
  doubt re-read the resource with your API key.

## Endpoints

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/hooks` | List the webhooks visible to the key | organization, team, user |
| `POST` | `/v2/hooks` | Create a webhook | organization, team, user |
| `GET` | `/v2/hooks/:hook_id` | Retrieve a webhook | organization, team, user |
| `PUT` | `/v2/hooks/:hook_id` | Update (and re-enable) a webhook | organization, team, user |
| `DELETE` | `/v2/hooks/:hook_id` | Delete a webhook | organization, team, user |

The same five endpoints also answer without the `/v2` prefix (`/hooks`, `/hooks/:hook_id`) with
identical behaviour; this is a legacy alias. Use the `/v2/hooks` paths.

Access rule common to `GET`, `PUT` and `DELETE /v2/hooks/:hook_id`:

| Webhook `scope` | Keys allowed |
|---|---|
| `user` | A `user` scoped key of the same user. |
| `organization` | An `organization` scoped key of the same organization. |
| `team` | An `organization` scoped key of the same organization, or a `team` scoped key whose teams include the webhook's team. |

Any other key gets `403`.

### List webhooks

`GET /v2/hooks`

Returns the webhooks visible to the API key, enabled and disabled. There is no pagination and no
filter. The array is wrapped in an object under `hooks`.

| Key scope | Webhooks returned |
|---|---|
| `organization` | All `organization` and `team` scoped webhooks of the organization. |
| `team` | The `team` scoped webhooks of the key's teams. |
| `user` | The `user` scoped webhooks of the key's user. |

**Key scope:** organization, team, user

**Path parameters** None.

**Query parameters** None.

**Request body** None.

**Response** `200 OK` with an object:

| Field | Type | Description |
|---|---|---|
| `hooks` | Webhook[] | The webhooks. Empty array when there is none. |

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |

**Example**

```bash
curl 'https://api.vyte.in/v2/hooks' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "hooks": [
    {
      "_id": "5f1e9b2a8c4d3e0012345678",
      "scope": "organization",
      "organization": "5f1e9b2a8c4d3e0012340000",
      "action": "event.confirmed",
      "target_url": "https://api.example.com/vyte/hooks?source=vyte",
      "object_root": false,
      "consecutive_failures": 0,
      "last_call_at": "2026-03-02T16:40:03.000Z",
      "last_status": 200,
      "createdAt": "2026-01-14T09:12:44.000Z",
      "updatedAt": "2026-01-14T09:12:44.000Z"
    }
  ]
}
```

### Create a webhook

`POST /v2/hooks`

Creates a webhook for one action. The owner (`organization` or `user`) and the `scope` are
derived from the API key and from `team_id`; they cannot be chosen in the body. Creating the same
subscription twice creates two webhooks (and two calls per occurrence): there is no
de-duplication.

**Key scope:** organization, team, user

**Path parameters** None.

**Query parameters** None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `action` | string | yes (unless `event` is sent) | - | Action to subscribe to, see [Actions](#actions). |
| `event` | string | no | - | Alias of `action`. When present it is used as the action. |
| `target_url` | string | yes | - | HTTPS URL to call. See the allowed characters in [The Webhook object](#the-webhook-object). |
| `team_id` | string | no (yes in practice with a `team` scoped key) | - | Id of a [Team](./teams.md). Makes the webhook `team` scoped. With a `team` scoped key it must be one of the key's teams. Send the id of a team of your organization. |
| `headers` | object | no | none | Custom headers (name -> string value) added to each call. |
| `token` | string | no | none | Bearer token; adds `Authorization: Bearer <token>` to `headers`. |
| `object_root` | boolean | no | `false` | `true` to receive a JSON object instead of an array of one object. |

**Response** `201 Created` with the created Webhook object.

**Errors**

| Status | When |
|---|---|
| `400` | `target_url` or the action is missing; `target_url` is not an accepted `https://` URL; the action is not one of the listed names. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | `team` scoped key and `team_id` is not one of the key's teams. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/hooks' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "action": "event.cancelled",
    "target_url": "https://api.example.com/vyte/hooks?source=vyte",
    "token": "YOUR_ENDPOINT_TOKEN"
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "scope": "organization",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "action": "event.cancelled",
  "target_url": "https://api.example.com/vyte/hooks?source=vyte",
  "token": "YOUR_ENDPOINT_TOKEN",
  "headers": {
    "Authorization": "Bearer YOUR_ENDPOINT_TOKEN"
  },
  "object_root": false,
  "createdAt": "2026-01-14T09:12:44.000Z",
  "updatedAt": "2026-01-14T09:12:44.000Z"
}
```

### Retrieve a webhook

`GET /v2/hooks/:hook_id`

**Key scope:** organization, team, user (see the access rule above)

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `hook_id` | string | `_id` of the webhook. |

**Query parameters** None.

**Request body** None.

**Response** `200 OK` with the Webhook object.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key is not allowed to access this webhook. |
| `404` | No webhook has this id. |
| `500` | `hook_id` is not a well formed id. |

**Example**

```bash
curl 'https://api.vyte.in/v2/hooks/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "scope": "organization",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "action": "event.cancelled",
  "target_url": "https://api.example.com/vyte/hooks?source=vyte",
  "object_root": false,
  "createdAt": "2026-01-14T09:12:44.000Z",
  "updatedAt": "2026-01-14T09:12:44.000Z"
}
```

### Update a webhook

`PUT /v2/hooks/:hook_id`

Partial update: only the fields present in the body are changed, the others keep their value.
The result is validated like a creation (`action` and `target_url` must still be valid).

Side effect: every successful update re-enables the webhook. `consecutive_failures` is reset to
`0` and `disabled_at` / `disabled_reason` are removed, whatever the fields sent (an empty JSON
object `{}` is enough).

**Key scope:** organization, team, user (see the access rule above)

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `hook_id` | string | `_id` of the webhook. |

**Query parameters** None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `action` | string | no | unchanged | New action, see [Actions](#actions). |
| `target_url` | string | no | unchanged | New HTTPS URL. |
| `team_id` | string | no | unchanged | Id of a [Team](./teams.md) of your organization; the webhook becomes (or stays) `team` scoped on that team. With a `team` scoped key it must be one of the key's teams. |
| `headers` | object | no | unchanged | Replaces the whole custom headers object. |
| `token` | string | no | unchanged | New bearer token; `Authorization: Bearer <token>` is written into `headers`. Removing a token does not remove a previously written `Authorization` header: send `headers` without it to remove it. |
| `object_root` | boolean | no | unchanged | Body shape, see [The Webhook object](#the-webhook-object). |

**Response** `200 OK` with the updated Webhook object.

**Errors**

| Status | When |
|---|---|
| `400` | The resulting webhook is invalid (`target_url` not an accepted `https://` URL, unknown action). |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key is not allowed to access this webhook; or `team` scoped key and `team_id` is not one of the key's teams. |
| `404` | No webhook has this id. |
| `500` | `hook_id` is not a well formed id. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/hooks/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "action": "event.updated",
    "object_root": true
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "scope": "organization",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "action": "event.updated",
  "target_url": "https://api.example.com/vyte/hooks?source=vyte",
  "object_root": true,
  "consecutive_failures": 0,
  "createdAt": "2026-01-14T09:12:44.000Z",
  "updatedAt": "2026-03-02T16:45:10.000Z"
}
```

### Delete a webhook

`DELETE /v2/hooks/:hook_id`

Deletes the webhook permanently. Vyte stops calling its `target_url`. Calls already scheduled at
the time of the deletion may still be delivered.

**Key scope:** organization, team, user (see the access rule above)

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `hook_id` | string | `_id` of the webhook. |

**Query parameters** None.

**Request body** None.

**Response** `204 No Content`, empty body.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key is not allowed to access this webhook. |
| `404` | No webhook has this id (including a webhook already deleted). |
| `500` | `hook_id` is not a well formed id. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/hooks/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY'
```

Response: `204 No Content`.

## Notes and caveats

- **Paths.** Use `/v2/hooks`. The un-prefixed `/hooks` paths shown in older documentation are a
  legacy alias of the same endpoints.
- **One action per webhook.** There is no wildcard and no list of actions: create one webhook
  per action.
- **List wrapper.** `GET /v2/hooks` returns `{ "hooks": [...] }`, not a bare array.
- **Timestamps are camelCase** on this resource: `createdAt` and `updatedAt`.
- **Array by default.** Unless `object_root` is `true`, the delivered body is an array of one
  notification. Always read the first element rather than assuming an object, and tolerate
  arrays of more than one element.
- **`target_url` character set.** URLs with a port, `%`-encoded characters, `+`, `~`, `@`, `,` or
  `;` are refused with `400`. Use a plain host name, path and simple query string.
- **No signature.** Calls are not signed; protect the endpoint with a secret URL and/or a
  `token` / custom `headers` (see [Securing your endpoint](#securing-your-endpoint)).
- **No retry, no replay.** A failed call is not guaranteed to be retried and occurrences missed
  while a webhook is disabled are lost. Reconcile with the read endpoints when completeness
  matters.
- **Deactivation after 20 consecutive failures.** Any `PUT` on the webhook re-enables it.
- **`event.created` + `event.confirmed`.** A booking made on a booking page is usually created
  already confirmed and therefore produces both actions. Subscribe to `event.confirmed` if you
  only care about bookings with a final date.
- **`event.updated` comes with `event.confirmed`.** A rescheduled event produces both.
- **Deleted events.** `event.cancelled` is reliably fired by a cancellation. Do not rely on a
  notification when an event is deleted instead of cancelled: cancel an event before deleting
  it if a downstream system must be told.
- **Team webhooks and events.** A `team` scoped webhook follows the events organized by the
  team's members; for `user.joined` and `vyteme.updated` it behaves like an organization
  webhook.
- **`team` in the notification** is not the team id (see
  [Request sent by Vyte](#request-sent-by-vyte)).
- **`resource` is a snapshot** taken when the action was processed. If you process the call
  late, read the resource again to get its current state.
- **Malformed ids** in `:hook_id` are answered with `500`, not `400` or `404`: always send
  24 hexadecimal character ids.
