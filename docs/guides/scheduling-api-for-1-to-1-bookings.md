# Scheduling API for 1-to-1 bookings

In the [previous guide](/guides/create-and-manage-booking-pages/), you learned how to use our API to set up a new booking page.

This guide will teach you how to completely dispense with the Vyte interface and fully manage 1-to-1 bookings using only the API.

> To sum up, we will retrieve the available slots of a user, create a booking request on one of them, and finally confirm (or cancel) the created event.

[[toc]]

## Get the available slots for a user

### Using the API

When someone wants an appointment with a user, the first thing to do is to retrieve when this user is available (to draw a parallel with the Vyte Page, we want to retrieve what is shown in the slot picker).

To achieve this, we will use the [Slots API](/reference/slots/) and make a `GET` request to the `/v2/slots` endpoint. Here is a reminder of the main query parameters:

<attributes title="Query parameters">
  <attribute name="users" type="string" :required=true details="you need either users or emails">

The `_id` of the user you want to book an appointment with. If several ids are provided, they must be separated with a comma and the API returns the slots at which all these users are free at the same time.

  </attribute>
  <attribute name="emails" type="string" :required=true details="you need either users or emails">

Email(s) of people who already have a Vyte account and with whom you want to book an appointment. If several emails are provided, they must be separated with a comma and the API returns the slots at which all these users are free at the same time.

  </attribute>
  <attribute name="from" type="string" :required=true>

First day of the search (included), formatted as `YYYY-MM-DD`.

  </attribute>
  <attribute name="to" type="string" :required=true>

Last day of the search (included), formatted as `YYYY-MM-DD`. The range between `from` and `to` must not exceed 31 days.

  </attribute>
  <attribute name="duration" type="number" details="default is 60">

Duration of the appointment in minutes, from 5 to 1440.

  </attribute>
  <attribute name="timezone" type="string">

The timezone used to interpret `from` and `to` and to format the response, expressed as a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Always send it when you target `users` or `emails`.

  </attribute>
</attributes>

In the rest of this guide, we will assume that Jane Doe wants a 1 hour meeting on February 9 or 10, 2028 with our user John Doe, whose id is `5f1e9b2a8c4d3e0012345601`.

So, to retrieve the availabilities of our user for these days, we make the following request:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fslots%253Fusers%253D5f1e9b2a8c4d3e0012345601%2526duration%253D60%2526from%253D2028-02-09%2526to%253D2028-02-10%2526timezone%253DEurope%252FParis%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 278px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/slots?users=5f1e9b2a8c4d3e0012345601&duration=60&from=2028-02-09&to=2028-02-10&timezone=Europe/Paris' \
--header 'Authorization: YOUR_API_KEY'
```

We get the following response:

```jsonp light-code
{
  "timezone": "Europe/Paris",
  "from": "2028-02-09",
  "to": "2028-02-10",
  "slots": [
    {
      "start": { "dateTime": "2028-02-09T09:00:00+01:00" },
      "end": { "dateTime": "2028-02-09T10:00:00+01:00" }
    },
    {
      "start": { "dateTime": "2028-02-09T10:00:00+01:00" },
      "end": { "dateTime": "2028-02-09T11:00:00+01:00" }
    },
    {
      "start": { "dateTime": "2028-02-10T10:00:00+01:00" },
      "end": { "dateTime": "2028-02-10T11:00:00+01:00" }
    },
    ...
  ]
}
```

> You can also retrieve these slots grouped by day by making the request to `/v2/slots/days` instead of `/v2/slots`. When nothing is free in the range, `slots` is empty and the response may carry a `nextAvailability` object with the first slot found after `to`.

Now that we have the available slots of John Doe, we can let Jane choose the one that works for her. You may also want to use some rules on your end to automatically determine which one is the best.

_We will consider here that February 10 from 10:00 to 11:00 a.m. is a good choice._

::: warning
A slot is not reserved when it is listed: it can be taken between the listing and the booking. The booking request of the next step checks the slot again.
:::

### (Optional) Using our web component

We provide a slot picker as a web component to easily let your users choose a slot. For more information, please check [this guide](/guides/use-our-web-components/).

## Create a new event

Let's create a new meeting request to John Doe for the chosen date. To achieve this, we create a new event with the [Events API](/reference/events/#create-an-event), with a `POST` request to `/v2/events`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fevents%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522vyteme%2522%253A%2520true%252C%250A%2520%2520%2522created_by%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522user%2522%253A%2520%25225f1e9b2a8c4d3e0012345601%2522%250A%2520%2520%257D%252C%250A%2520%2520%2522timezone%2522%253A%2520%2522Europe%252FParis%2522%252C%250A%2520%2520%2522dates%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522date%2522%253A%2520%25222028-02-10T10%253A00%253A00%252B01%253A00%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522end_date%2522%253A%2520%25222028-02-10T11%253A00%253A00%252B01%253A00%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522invitees%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522full_name%2522%253A%2520%2522Jane%2520Doe%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522email%2522%253A%2520%2522jane.doe%2540example.com%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522places%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Head%2520office%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522address%2522%253A%2520%25221%2520Example%2520Street%252C%252075001%2520Paris%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522messages%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522body%2522%253A%2520%2522I%2520would%2520like%2520to%2520discuss%2520your%2520offer.%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%250A%257D%27"
  style="width: 100%; height: 916px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/events' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "vyteme": true,
  "created_by": {
    "user": "5f1e9b2a8c4d3e0012345601"
  },
  "timezone": "Europe/Paris",
  "dates": [
    {
      "date": "2028-02-10T10:00:00+01:00",
      "end_date": "2028-02-10T11:00:00+01:00"
    }
  ],
  "invitees": [
    {
      "full_name": "Jane Doe",
      "email": "jane.doe@example.com"
    }
  ],
  "places": [
    {
      "name": "Head office",
      "address": "1 Example Street, 75001 Paris"
    }
  ],
  "messages": [
    {
      "body": "I would like to discuss your offer."
    }
  ]
}'
```

A few things to note about this request:

- `vyteme` is set to `true`: the event is a booking. If you need more information, please refer to [this part](/reference/#vyteme-or-not-vyteme).
- `created_by` is the **booked** user (John Doe), not the person who books.
- `invitees` is an array and its first element is the person who books (Jane Doe). The booked user is added to the invitees automatically.
- The dates carry an explicit UTC offset, and `timezone` is sent.
- `title` is optional for a booking: when omitted, it is generated.

The answer is `201` with the created event (shortened here):

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345700",
  "title": "Meeting Jane Doe / John Doe",
  "vyteme": true,
  "api": true,
  "created_by": {
    "user": "5f1e9b2a8c4d3e0012345601",
    "email": "john.doe@example.com",
    "full_name": "John Doe"
  },
  "confirmed": { "flag": false, "updated_at": null },
  "dates": [
    {
      "_id": "5f1e9b2a8c4d3e0012345701",
      "date": "2028-02-10T09:00:00.000Z",
      "end_date": "2028-02-10T10:00:00.000Z",
      "all_day": false,
      "confirmed": false
    }
  ],
  "places": [
    {
      "_id": "5f1e9b2a8c4d3e0012345702",
      "name": "Head office",
      "address": "1 Example Street, 75001 Paris",
      "source": "app"
    }
  ],
  "invitees": [
    {
      "_id": "5f1e9b2a8c4d3e0012345703",
      "user": "5f1e9b2a8c4d3e0012345620",
      "email": "jane.doe@example.com",
      "full_name": "Jane Doe"
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345704",
      "user": "5f1e9b2a8c4d3e0012345601",
      "email": "john.doe@example.com",
      "full_name": "John Doe"
    }
  ],
  "timezone": "Europe/Paris",
  "lang": "en",
  "locale": "en"
}
```

Congrats :clap:
We created our first booking request by using only the API. A booking-request email is sent to the participants and the proposed date is held as a tentative entry in their connected calendars.

::: warning
If John Doe is not free on the requested date, nothing is created and the answer is `410` with an array containing the conflicting dates. In that case, fetch fresh slots and let the person choose again.
:::

> To create the booking already confirmed, add `"confirmed": { "flag": true }` to the body. The event is also confirmed immediately, without this field, when the booking page of the user is configured to confirm automatically (`custom.auto_confirm`). The next step is then not needed.

## Confirm or cancel the event

The last step in this workflow is to confirm (or cancel) the meeting as soon as our user John Doe is okay.

To confirm, send a `POST` request to `/v2/events/:event_id/confirm`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fevents%252F5f1e9b2a8c4d3e0012345700%252Fconfirm%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 256px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345700/confirm' \
--header 'Authorization: YOUR_API_KEY'
```

The answer is `201` with the confirmed event (shortened here). As the event has a single date and a single place, there is no need to tell which ones to confirm:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345700",
  "title": "Meeting Jane Doe / John Doe",
  "confirmed": {
    "flag": true,
    "updated_at": "2028-02-02T08:00:00.000Z",
    "date_id": "5f1e9b2a8c4d3e0012345701",
    "place_id": "5f1e9b2a8c4d3e0012345702"
  },
  "first_start_date": "2028-02-10T09:00:00.000Z",
  "last_end_date": "2028-02-10T10:00:00.000Z"
}
```

A confirmation email with a calendar invitation is sent to the participants and the meeting is written in the connected calendar of John Doe.

To cancel instead, send a `POST` request to `/v2/events/:event_id/cancel`. The body is optional and may carry a `message` that is included in the cancellation email:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fevents%252F5f1e9b2a8c4d3e0012345700%252Fcancel%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522message%2522%253A%2520%2522John%2520is%2520unavailable%2520that%2520day%252C%2520sorry.%2522%250A%257D%27"
  style="width: 100%; height: 344px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/events/5f1e9b2a8c4d3e0012345700/cancel' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "message": "John is unavailable that day, sorry."
}'
```

The answer is `200` with the event, which now carries the date of the cancellation in `cancelled` (shortened here):

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345700",
  "title": "Meeting Jane Doe / John Doe",
  "confirmed": { "flag": false, "updated_at": null },
  "cancelled": "2028-02-03T14:20:00.000Z",
  "cancelled_by": "5f1e9b2a8c4d3e0012345601"
}
```

Here we are! We managed a new booking request from end to end with the API only.

To be notified of these changes instead of reading the events again, have a look at the [webhooks guide](/guides/set-up-webhooks/).
