# Set up webhooks to manage scheduling notifications

A webhook is a subscription that asks Vyte to call one of your HTTPS endpoints each time something happens: an event is created, confirmed or cancelled, an invitee answers, a user joins your organization. Webhooks replace polling: instead of repeatedly reading the events, your application is notified shortly after each change and can send its own notifications, update a CRM or keep a database in sync.

In this guide, we will subscribe to the confirmation and the cancellation of events, look at what Vyte sends to your endpoint, and learn how to monitor, update and delete a webhook.

[[toc]]

## How webhooks work

A webhook has two main properties:

- `target_url`: the URL of your endpoint, called by Vyte with a `POST` request;
- `action`: what the webhook subscribes to. An action name has the form `<resource>.<action>`, for example `event.confirmed`.

One webhook subscribes to exactly one action. To follow several actions, create one webhook per action; they may share the same `target_url`.

Here are the available actions:

| Action | Fires when |
| --- | --- |
| `event.created` | An event is created (confirmed or not). |
| `event.confirmed` | A final date and/or place is set on an event, including when the event is created already confirmed. |
| `event.updated` | An event that had been confirmed, then edited, is confirmed again (typically a rescheduling). |
| `event.cancelled` | An event, confirmed or not, is cancelled. |
| `event.invitees.added` | Invitees are added to an existing event. |
| `event.invitees.voted` | An invitee other than the organizer votes on the proposed dates or places of an event that is not confirmed. |
| `event.invitees.attending` | An invitee other than the organizer accepts a confirmed event. |
| `event.invitees.declined` | An invitee other than the organizer declines the event. |
| `event.invitees.new_suggestion` | A participant suggests a new date or a new place. |
| `event.messages.created` | A message is posted on an existing event by a participant. |
| `user.joined` | A user becomes a member of your organization. |
| `user.calendar_disconnected` | The access to one of the connected calendars of a user is broken. |
| `vyteme.updated` | A booking page of a member of your organization is created or modified. |

The exact conditions and the content delivered for each action are described in the [Webhooks reference](/reference/webhooks/#actions).

## Prerequisites

- An API key (see [Get started](/guides/getting-started/)). The scope of the key decides the scope of the webhook: with an `organization` scoped key, the webhook receives the events organized by any member of your organization.
- An endpoint of your own, reachable from the internet, that accepts `POST` requests with a JSON body and answers within 30 seconds.
- The URL of this endpoint must start with `https://` and may only contain letters, digits and the characters `-` `_` `.` `?` `&` `=` `#` `/`. A URL with a port, `%`-encoded characters, `+` or `~` is refused.

## Step 1: create a webhook

Let's subscribe to the confirmation of events with a `POST` request to `/v2/hooks`. We also send a `token`: Vyte will add the header `Authorization: Bearer <token>` to every call, so that your endpoint can check that the call comes from Vyte.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fhooks%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522action%2522%253A%2520%2522event.confirmed%2522%252C%250A%2520%2520%2522target_url%2522%253A%2520%2522https%253A%252F%252Fapi.example.com%252Fvyte%252Fhooks%253Fsource%253Dvyte%2522%252C%250A%2520%2520%2522token%2522%253A%2520%2522YOUR_ENDPOINT_TOKEN%2522%250A%257D%27"
  style="width: 100%; height: 366px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/hooks' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "action": "event.confirmed",
  "target_url": "https://api.example.com/vyte/hooks?source=vyte",
  "token": "YOUR_ENDPOINT_TOKEN"
}'
```

The answer is `201` with the created webhook:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345a01",
  "scope": "organization",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "action": "event.confirmed",
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

Keep the `_id`: you need it to update or delete the webhook.

Besides `token`, the body accepts two optional fields:

- `headers`: an object of custom HTTP headers (name and string value) that Vyte adds to every call;
- `object_root`: set it to `true` to receive a JSON object instead of an array of one object (see [step 3](#step-3-receive-the-calls)).

## Step 2: subscribe to another action

We also want to know when an event is cancelled. As a webhook follows a single action, we create a second one with the same `target_url`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fhooks%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522action%2522%253A%2520%2522event.cancelled%2522%252C%250A%2520%2520%2522target_url%2522%253A%2520%2522https%253A%252F%252Fapi.example.com%252Fvyte%252Fhooks%253Fsource%253Dvyte%2522%252C%250A%2520%2520%2522token%2522%253A%2520%2522YOUR_ENDPOINT_TOKEN%2522%250A%257D%27"
  style="width: 100%; height: 366px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/hooks' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "action": "event.cancelled",
  "target_url": "https://api.example.com/vyte/hooks?source=vyte",
  "token": "YOUR_ENDPOINT_TOKEN"
}'
```

The answer is again `201` with the new webhook:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345a02",
  "scope": "organization",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "action": "event.cancelled",
  "target_url": "https://api.example.com/vyte/hooks?source=vyte",
  "token": "YOUR_ENDPOINT_TOKEN",
  "headers": {
    "Authorization": "Bearer YOUR_ENDPOINT_TOKEN"
  },
  "object_root": false,
  "createdAt": "2026-01-14T09:13:02.000Z",
  "updatedAt": "2026-01-14T09:13:02.000Z"
}
```

::: warning
Creating the same subscription twice creates two webhooks, and therefore two calls for each occurrence. List your webhooks (see [step 4](#step-4-list-and-monitor-your-webhooks)) before creating one in a provisioning script.
:::

### Restrict a webhook to a team

To only receive the events organized by the members of one team, add the `_id` of the team in `team_id`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fhooks%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522action%2522%253A%2520%2522event.confirmed%2522%252C%250A%2520%2520%2522target_url%2522%253A%2520%2522https%253A%252F%252Fapi.example.com%252Fvyte%252Fhooks%252Fsales%2522%252C%250A%2520%2520%2522team_id%2522%253A%2520%25225f1e9b2a8c4d3e0012345678%2522%250A%257D%27"
  style="width: 100%; height: 366px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/hooks' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "action": "event.confirmed",
  "target_url": "https://api.example.com/vyte/hooks/sales",
  "team_id": "5f1e9b2a8c4d3e0012345678"
}'
```

The created webhook has the `team` scope:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345a03",
  "scope": "team",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "team": "5f1e9b2a8c4d3e0012345678",
  "team_id": "5f1e9b2a8c4d3e0012345678",
  "action": "event.confirmed",
  "target_url": "https://api.example.com/vyte/hooks/sales",
  "object_root": false,
  "createdAt": "2026-01-14T09:15:27.000Z",
  "updatedAt": "2026-01-14T09:15:27.000Z"
}
```

For event actions the criterion is the organizer of the event: a `team` scoped webhook receives all the events organized by the members of that team, whichever booking page they were booked on.

## Step 3: receive the calls

Each time the action happens, Vyte sends a `POST` request to your `target_url`, with the header `Content-Type: application/json` and the headers configured on the webhook.

By default, the body is a JSON **array containing one notification object**. Here is what our endpoint receives when an event is cancelled (the `resource` is shortened):

```json light-code
[
  {
    "action": "event.cancelled",
    "resource": {
      "_id": "5f1e9b2a8c4d3e0012349999",
      "title": "Discovery call",
      "vyteme": true,
      "cancelled": "2026-03-02T16:40:01.000Z",
      "confirmed": { "flag": true },
      "created_by": { "user": "5f1e9b2a8c4d3e0012345601" },
      "dates": [
        {
          "all_day": false,
          "date": "2026-03-10T10:00:00.000Z",
          "end_date": "2026-03-10T10:30:00.000Z"
        }
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

The notification object has the following properties:

| Property | Description |
| --- | --- |
| `action` | The action of the webhook, for instance `event.cancelled`. |
| `resource` | The resource the action happened on, as it was when Vyte processed the action: an [Event](/reference/events/#the-event-object) for `event.*` actions, a [User](/reference/users/#the-user-object) for `user.*` actions, a [booking page](/reference/vytemes/#the-vyteme-object) for `vyteme.updated`. |
| `payload` | For some actions only: a small summary specific to the action. For `event.confirmed` it carries `date` and `place` as display strings; read the dates from `resource`. |
| `organization` | The `_id` of the organization owning the webhook. |

With `object_root` set to `true` on the webhook, the body is the notification object itself. Here is an `event.invitees.attending` notification delivered that way:

```json light-code
{
  "action": "event.invitees.attending",
  "resource": { "_id": "5f1e9b2a8c4d3e0012349999", "title": "Discovery call" },
  "payload": {
    "voter": "Jane Doe",
    "user_id": "5f1e9b2a8c4d3e0012345642",
    "title": "Discovery call",
    "start_date": "2026-03-10T10:00:00.000Z",
    "end_date": "2026-03-10T10:30:00.000Z"
  },
  "organization": "5f1e9b2a8c4d3e0012340000"
}
```

Your endpoint must answer quickly with a success status (`200`, `201`, `202` or `204` for instance); the response body is ignored. Any other status, including a redirection, and the absence of answer within 30 seconds are counted as a failure. The best practice is to acknowledge the call, then process it asynchronously on your side.

## What happens next

Once the two webhooks above exist, here is what you can expect:

- **A booking is made on a booking page that confirms automatically.** The event is created already confirmed: your endpoint receives `event.confirmed`. A webhook subscribed to `event.created` would be called for the same booking.
- **A pending event is confirmed** (for instance with `POST /v2/events/:event_id/confirm`): your endpoint receives `event.confirmed`.
- **A confirmed event is rescheduled**: your endpoint receives `event.confirmed` again. A webhook subscribed to `event.updated` would be called as well.
- **An event is cancelled** (for instance with `POST /v2/events/:event_id/cancel`): your endpoint receives `event.cancelled`. Cancelling an event that is already cancelled fires nothing.

A few rules to keep in mind when you write your endpoint:

- Calls are made asynchronously, at the earliest about one second after the action. The answers of invitees (`event.invitees.*` actions) are grouped per event and per participant and delivered later, in the order of minutes.
- There is no ordering guarantee between calls: `event.created` and `event.confirmed` of the same booking may arrive in any order. Rely on the content of `resource` rather than on the arrival order.
- A failed call must be considered lost: do not rely on Vyte calling again for the same occurrence. If you must not miss a change, reconcile periodically by reading the [events](/reference/events/#list-events).
- Duplicates are possible: make your processing idempotent.
- `resource` is a snapshot taken when the action was processed. If you process the call late, read the resource again to get its current state.

## Step 4: list and monitor your webhooks

To list the webhooks visible to your key, send a `GET` request to `/v2/hooks`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fhooks%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 234px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/hooks' \
--header 'Authorization: YOUR_API_KEY'
```

The answer is `200` with an object holding the webhooks in `hooks`:

```json light-code
{
  "hooks": [
    {
      "_id": "5f1e9b2a8c4d3e0012345a01",
      "scope": "organization",
      "organization": "5f1e9b2a8c4d3e0012340000",
      "action": "event.confirmed",
      "target_url": "https://api.example.com/vyte/hooks?source=vyte",
      "token": "YOUR_ENDPOINT_TOKEN",
      "headers": {
        "Authorization": "Bearer YOUR_ENDPOINT_TOKEN"
      },
      "object_root": false,
      "consecutive_failures": 0,
      "last_call_at": "2026-03-02T16:40:03.000Z",
      "last_status": 200,
      "createdAt": "2026-01-14T09:12:44.000Z",
      "updatedAt": "2026-01-14T09:12:44.000Z"
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345a02",
      "scope": "organization",
      "organization": "5f1e9b2a8c4d3e0012340000",
      "action": "event.cancelled",
      "target_url": "https://api.example.com/vyte/hooks?source=vyte",
      "token": "YOUR_ENDPOINT_TOKEN",
      "headers": {
        "Authorization": "Bearer YOUR_ENDPOINT_TOKEN"
      },
      "object_root": false,
      "createdAt": "2026-01-14T09:13:02.000Z",
      "updatedAt": "2026-01-14T09:13:02.000Z"
    }
  ]
}
```

Once a webhook has been called, it carries the date of the last call (`last_call_at`), the status answered by your endpoint (`last_status`), or `last_error` when the call got no HTTP answer, and the number of failed calls in a row (`consecutive_failures`).

After 20 consecutive failures, the webhook is disabled: `disabled_at` and `disabled_reason` are set and the webhook is no longer called. What happens while it is disabled is not queued and is not replayed later. Monitor these fields to detect a failing endpoint.

> A single webhook can be retrieved with a `GET` request to `/v2/hooks/:hook_id`.

## Step 5: update or re-enable a webhook

To change a webhook, send a `PUT` request to `/v2/hooks/:hook_id`. Only the fields present in the body are changed. Here we ask to receive a JSON object instead of an array:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520PUT%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fhooks%252F5f1e9b2a8c4d3e0012345a01%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522object_root%2522%253A%2520true%250A%257D%27"
  style="width: 100%; height: 344px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request PUT 'https://api.vyte.in/v2/hooks/5f1e9b2a8c4d3e0012345a01' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "object_root": true
}'
```

The answer is `200` with the updated webhook:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345a01",
  "scope": "organization",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "action": "event.confirmed",
  "target_url": "https://api.example.com/vyte/hooks?source=vyte",
  "token": "YOUR_ENDPOINT_TOKEN",
  "headers": {
    "Authorization": "Bearer YOUR_ENDPOINT_TOKEN"
  },
  "object_root": true,
  "consecutive_failures": 0,
  "last_call_at": "2026-03-02T16:40:03.000Z",
  "last_status": 200,
  "createdAt": "2026-01-14T09:12:44.000Z",
  "updatedAt": "2026-03-02T16:45:10.000Z"
}
```

Every successful update also re-enables the webhook: `consecutive_failures` is reset to `0` and `disabled_at` and `disabled_reason` are removed, whatever the fields sent. To re-enable a disabled webhook once your endpoint is fixed, an empty JSON object `{}` is enough.

## Step 6: delete a webhook

If you want Vyte to stop calling your endpoint, delete the webhook with a `DELETE` request to `/v2/hooks/:hook_id`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520DELETE%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fhooks%252F5f1e9b2a8c4d3e0012345a02%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 256px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request DELETE 'https://api.vyte.in/v2/hooks/5f1e9b2a8c4d3e0012345a02' \
--header 'Authorization: YOUR_API_KEY'
```

The answer is `204` with an empty body. Calls already scheduled at the time of the deletion may still be delivered.

## Common mistakes

- **Using an old path.** The endpoints are `/v2/hooks` and `/v2/hooks/:hook_id`.
- **Using an old action name.** The names are the ones listed [above](#how-webhooks-work), for instance `event.invitees.added` or `event.invitees.voted`. Any other value is refused with `400`.
- **Expecting an object by default.** Unless `object_root` is `true`, the delivered body is an array of one notification. Always read the first element.
- **Expecting a bare array from the list.** `GET /v2/hooks` returns an object with a `hooks` array.
- **Trying to subscribe to several actions at once.** There is no wildcard and no list of actions: create one webhook per action.
- **Sending a `target_url` that is refused.** `http://` URLs, URLs with a port, `%`-encoded characters, `+`, `~` or `@` are answered with `400`. Use a plain host name, path and simple query string.
- **Answering with a redirection or after a long processing.** Redirections are not followed and an answer that takes more than 30 seconds is a failure. After 20 failures in a row the webhook is disabled.
- **Counting on a retry.** A failed call is not guaranteed to be retried, and what happens while a webhook is disabled is lost. Reconcile with the read endpoints when completeness matters.
- **Processing `event.created` and `event.confirmed` as two bookings.** A booking made on a booking page is usually created already confirmed and produces both actions. Subscribe to `event.confirmed` only if you just care about bookings with a final date.
- **Creating a webhook with a `team` scoped key without `team_id`.** Such a webhook is not attached to any team and is never called.
- **Reading `team` in the notification as the id of the team.** Give each team webhook a distinct `target_url` or custom header to tell them apart.

## Reference

- [Webhooks](/reference/webhooks/): [the Webhook object](/reference/webhooks/#the-webhook-object), [actions](/reference/webhooks/#actions), [scope of a webhook](/reference/webhooks/#scope-of-a-webhook), [receiving a webhook call](/reference/webhooks/#receiving-a-webhook-call), [automatic deactivation](/reference/webhooks/#automatic-deactivation).
- [Events](/reference/events/), for the content of `resource` on `event.*` actions.
- [Users](/reference/users/) and [Booking pages](/reference/vytemes/), for the content of `resource` on `user.*` and `vyteme.updated` actions.
