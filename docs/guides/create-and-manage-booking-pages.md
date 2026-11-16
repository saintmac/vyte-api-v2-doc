# Create and manage booking pages

You should now be able to access the API with your API key. If you aren't, read our [Get started guide](/guides/getting-started/).

Let's see how you can use Vyte API to automate your scheduling workflow.

In this guide, we will learn how to create a user with the API, set their availabilities and create their booking page (their Vyte Page).

[[toc]]

## Retrieve your organization

For the following requests, you will need the `_id` of your organization. The easiest way to retrieve it is to make a `GET` request to the `https://api.vyte.in/v2/auth/test` endpoint.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fauth%252Ftest%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 234px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/auth/test' \
--header 'Authorization: YOUR_API_KEY'
```

You receive in response an object containing information about your organization, and in particular the `_id`.

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012340000",
  "name": "ACME",
  "lang": "en",
  "admins": ["5f1e9b2a8c4d3e0012345600"],
  "members": ["5f1e9b2a8c4d3e0012345600"],
  "createdAt": "2026-01-14T09:12:44.000Z",
  "updatedAt": "2026-01-14T09:12:44.000Z"
}
```

## Create your first user

Now that we have the `_id` of your organization, we are able to create a first user.

> If you need more information about user creation, please refer to the [Users API Reference](/reference/users/#create-or-update-a-user).

To do this, we just have to perform a `POST` request to the `https://api.vyte.in/v2/users` endpoint.
The body of this request can do a lot more (it can also set up the booking page, the availability and the teams of the user in one call), but for the moment we will just give basic information about the user.

::: warning
In the following request, don't forget to replace the API key and the organization `_id` with yours.
:::

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fusers%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522organization%2522%253A%2520%25225f1e9b2a8c4d3e0012340000%2522%252C%250A%2520%2520%2522user%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522email%2522%253A%2520%2522john.doe%2540example.com%2522%252C%250A%2520%2520%2520%2520%2522first_name%2522%253A%2520%2522John%2522%252C%250A%2520%2520%2520%2520%2522last_name%2522%253A%2520%2522Doe%2522%252C%250A%2520%2520%2520%2520%2522language%2522%253A%2520%2522en%2522%252C%250A%2520%2520%2520%2520%2522timezone%2522%253A%2520%2522Europe%252FLondon%2522%252C%250A%2520%2520%2520%2520%2522picture_url%2522%253A%2520%2522https%253A%252F%252Fwww.example.com%252Fpictures%252Fjohn.png%2522%252C%250A%2520%2520%2520%2520%2522account%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522organization%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522extid%2522%253A%2520%2522userIdInThirdPartyAppDatabase%2522%250A%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%252C%250A%2520%2520%2522login%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522credentials%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522username%2522%253A%2520%2522john.doe%2540example.com%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522password%2522%253A%2520%2522CHOOSE_A_STRONG_PASSWORD%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%257D%27"
  style="width: 100%; height: 740px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/users' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "organization": "5f1e9b2a8c4d3e0012340000",
  "user": {
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "language": "en",
    "timezone": "Europe/London",
    "picture_url": "https://www.example.com/pictures/john.png",
    "account": {
      "organization": {
        "extid": "userIdInThirdPartyAppDatabase"
      }
    }
  },
  "login": {
    "credentials": {
      "username": "john.doe@example.com",
      "password": "CHOOSE_A_STRONG_PASSWORD"
    }
  }
}'
```

The answer is `201` with an object containing the created user:

```json light-code
{
  "user": {
    "_id": "5f1e9b2a8c4d3e0012345601",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "emails": ["john.doe@example.com"],
    "language": "en",
    "timezone": "Europe/London",
    "picture_url": "https://www.example.com/pictures/john.png",
    "calendars": {
      "google": false,
      "office365": false,
      "exchange": false,
      "icloud": false,
      "caldav": false,
      "zoho": false
    },
    "modules": {
      "brand": false,
      "assistant": false,
      "vyteme": false,
      "vyteme_pro": false,
      "availabilities": false,
      "group_pro": false,
      "team": false
    },
    "account": {
      "plan": "pro",
      "organization": {
        "id": "5f1e9b2a8c4d3e0012340000",
        "name": "ACME",
        "extid": "userIdInThirdPartyAppDatabase"
      }
    },
    "signedup_with": "api",
    "created_by_org": "5f1e9b2a8c4d3e0012340000",
    "createdAt": "2026-01-12T09:30:00.000Z",
    "updatedAt": "2026-01-12T09:30:00.000Z"
  }
}
```

We have created our first user with the Vyte API :clap:

A few things to know about this request:

- It is a "create or update": if a user with the same `user.account.organization.extid` (or, without `extid`, the same `user.email`) already exists, that user is updated and the answer is `200` instead of `201`.
- The user is added to the members of your organization, which uses one seat of your subscription.
- No email is sent to the user by this request.
- When you update a user that way, resend `user.last_name` and `user.account.organization.extid`: they are not preserved when omitted.

## Configure their Vyte Page

Now that our user is created, we will go further and create their Vyte Page. To sum up, we will use the API to create the Vyte Page as we would do directly on the [Vyte dashboard](https://www.vyte.in/pages?lang=en).

To create and set up the Vyte Page, we will first set our user's availabilities thanks to the [Availabilities API](/reference/availabilities/). Then, we will create the Vyte Page with the [Booking pages API](/reference/vytemes/).

### Set up availabilities

Let's set up the availabilities of our user John Doe. To do this, we will perform a `POST` request at `/v2/users/:user_id/availabilities`. Here is a reminder of the main body parameters of this request:

<attributes title="Body parameters">
<attribute name="timezone" type="string">

The timezone in which the availability is interpreted, expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Always send it: without a timezone, the weekly slots and the day-based settings below are not applied.

</attribute>

<attribute name="today_as_busy" type="boolean">

Prevent from booking on the same day.

</attribute>

<attribute name="past_as_busy" type="boolean">

Prevent from booking in the past.

</attribute>

<attribute name="days_after_as_busy" type="number">

Booking horizon: when set to `n`, every day that is `n` days after today or later is unavailable.

</attribute>

<attribute name="buffer_before" type="number">

Ensure users have at least n minutes free before each meeting.

</attribute>

<attribute name="buffer_after" type="number">

Ensure users have at least n minutes free after each meeting.

</attribute>

<attribute name="all_day_busy" type="boolean">

If the user has an all-day event in their calendars, the whole day is marked as busy on Vyte.

</attribute>

<attribute name="days" type="hash">

Here you can define the availabilities for each day of the week. **We present the structure only for monday, but it is the same for the other days.** When you send `days`, send the complete object with its seven weekdays.

<attributes :isChild=true>

<attribute name="monday" type="hash" :parentNames="['days']" :isChild=true :isLast=true>

Settings for monday.

<attributes :isChild=true>
<attribute name="enabled" type="boolean" :parentNames="['days', 'monday']" :isChild=true>

Whether or not we enable booking on that day.

</attribute>

<attribute name="slots" type="array of hashes" :parentNames="['days', 'monday']" :isChild=true :isLast=true>

An array of slots defining when the user is available. List them in chronological order and do not make them overlap.

<attributes :isChild=true>
<attribute name="start_time" type="date" :parentNames="['days', 'monday', 'slots[0]']" :isChild=true>

The start time of the slot, written as a complete [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) UTC date-time ending with `Z`. **Only the time of day is used, and it is read as local time in the `timezone` of the availability**: `2018-01-01T09:00:00.000Z` means 09:00 in that timezone. The date part doesn't matter.

</attribute>

<attribute name="end_time" type="date" :parentNames="['days', 'monday', 'slots[0]']" :isChild=true :isLast=true>

The end time of the slot, written the same way as `start_time`.

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>

</attributes>

So, here is an example request to set up the availabilities of our user. You can check the meaning of each parameter with the description given above.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fusers%252F5f1e9b2a8c4d3e0012345601%252Favailabilities%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522timezone%2522%253A%2520%2522Europe%252FLondon%2522%252C%250A%2520%2520%2522today_as_busy%2522%253A%2520false%252C%250A%2520%2520%2522past_as_busy%2522%253A%2520true%252C%250A%2520%2520%2522days_after_as_busy%2522%253A%252060%252C%250A%2520%2520%2522buffer_before%2522%253A%25200%252C%250A%2520%2520%2522buffer_after%2522%253A%25200%252C%250A%2520%2520%2522all_day_busy%2522%253A%2520true%252C%250A%2520%2520%2522days%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522monday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%253A00.000Z%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%253A00.000Z%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522tuesday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%253A00.000Z%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%253A00.000Z%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522wednesday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%253A00.000Z%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%253A00.000Z%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522thursday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%253A00.000Z%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%253A00.000Z%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522friday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%253A00.000Z%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%253A00.000Z%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522saturday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522sunday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%255D%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%257D%27"
  style="width: 100%; height: 1686px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345601/availabilities' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "timezone": "Europe/London",
  "today_as_busy": false,
  "past_as_busy": true,
  "days_after_as_busy": 60,
  "buffer_before": 0,
  "buffer_after": 0,
  "all_day_busy": true,
  "days": {
    "monday": {
      "enabled": true,
      "slots": [
        {
          "start_time": "2018-01-01T09:00:00.000Z",
          "end_time": "2018-01-01T17:00:00.000Z"
        }
      ]
    },
    "tuesday": {
      "enabled": true,
      "slots": [
        {
          "start_time": "2018-01-01T09:00:00.000Z",
          "end_time": "2018-01-01T17:00:00.000Z"
        }
      ]
    },
    "wednesday": {
      "enabled": true,
      "slots": [
        {
          "start_time": "2018-01-01T09:00:00.000Z",
          "end_time": "2018-01-01T17:00:00.000Z"
        }
      ]
    },
    "thursday": {
      "enabled": true,
      "slots": [
        {
          "start_time": "2018-01-01T09:00:00.000Z",
          "end_time": "2018-01-01T17:00:00.000Z"
        }
      ]
    },
    "friday": {
      "enabled": true,
      "slots": [
        {
          "start_time": "2018-01-01T09:00:00.000Z",
          "end_time": "2018-01-01T17:00:00.000Z"
        }
      ]
    },
    "saturday": {
      "enabled": false,
      "slots": []
    },
    "sunday": {
      "enabled": false,
      "slots": []
    }
  }
}'
```

The answer is `200` with the saved availability. This request is a "create or update" too: calling it again updates the availability of the user and never creates a second one. The other settings of an availability (date ranges, minimum notice, slot step...) are described in the [Availability object](/reference/availabilities/#the-availability-object).

### Create and set up the Vyte Page

Now that we've set up the availabilities of our user, we can create the Vyte Page. There are a lot of parameters to personalize the Vyte Page. Here is a description of the main fields of the `Vyteme` object:

<attributes title="Vyteme object">
<attribute name="nickname" type="string" :required=true>

Nickname of the Vyte Page, used in its public URL. It is stored in lowercase, must have at least 3 characters and may only contain letters, digits, `-`, `_`, `.` and `@`.

</attribute>

<attribute name="message" type="string">

Message shown on the Vyte page.

</attribute>

<attribute name="belongs_to" type="string" :required=true>

The `_id` of the user who owns the Vyte Page.

</attribute>

<attribute name="custom" type="hash">

Custom settings of the Vyte Page. Sending `custom` requires a plan that includes the advanced booking page customization.

<attributes :isChild=true>
<attribute name="auto_message" type="string" :parentNames="['custom']" :isChild=true>

Message automatically posted on the event, on behalf of the user, when a booking is made and the person booking left no message.

</attribute>

<attribute name="auto_title" type="string" :parentNames="['custom']" :isChild=true>

Title given automatically to the events booked on the page. Supports the placeholders <code v-pre>{{invitee}}</code> and <code v-pre>{{me}}</code>.

</attribute>

<attribute name="ask_phone" type="boolean" :parentNames="['custom']" :isChild=true>

Ask the phone number of the person booking.

</attribute>

<attribute name="ask_company" type="boolean" :parentNames="['custom']" :isChild=true>

Ask the company of the person booking.

</attribute>

<attribute name="block_new_invitee" type="boolean" :parentNames="['custom']" :isChild=true>

If enabled, it prevents people who have booked events on that Vyte Page from adding other invitees to those events.

</attribute>

<attribute name="duration" type="number" :parentNames="['custom']" :isChild=true>

Duration of the appointment, in minutes.

</attribute>

<attribute name="set_lang" type="boolean" :parentNames="['custom']" :isChild=true>

Only use if you only accept bookings in one language.

</attribute>

<attribute name="fixed_lang" type="string" :parentNames="['custom']" :isChild=true>

Language used when `set_lang` is `true`, expressed according to [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes). The available languages are: `de`, `en`, `es`, `fr`, `it`, `nl`, `pl`, `pt`, `sv`, `ru`.

</attribute>

<attribute name="set_timezone" type="boolean" :parentNames="['custom']" :isChild=true>

Only use if you only accept bookings from people on your own timezone.

</attribute>

<attribute name="fixed_timezone" type="string" :parentNames="['custom']" :isChild=true>

Timezone used when `set_timezone` is `true`, expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="event_hide_decline" type="number" :parentNames="['custom']" :isChild=true>

Number of hours before the start of the event from which the decline button is hidden.
Ex: if set to 24, the decline button is hidden on the event page during the last 24 hours before the event.

</attribute>

<attribute name="hide_places" type="boolean" :parentNames="['custom']" :isChild=true>

Hide places from the booking page.

</attribute>

<attribute name="hide_support" type="boolean" :parentNames="['custom']" :isChild=true>

Hide Vyte support button from the booking page (recommended for an integration).

</attribute>

<attribute name="hide_title" type="boolean" :parentNames="['custom']" :isChild=true>

Hide the title (subject) field of the booking form.

</attribute>

<attribute name="forbid_add_places" type="boolean" :parentNames="['custom']" :isChild=true>

Forbid participants to suggest other places.

</attribute>

<attribute name="min_dates" type="number" :parentNames="['custom']" :isChild=true>

Minimum number of slots the person booking must propose (only used by the calendar view, not by the slot view).

</attribute>

<attribute name="one_slot" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not only one slot can be suggested on the calendar view.

</attribute>

<attribute name="slot_view" type="boolean" :parentNames="['custom']" :isChild=true>

When `true`, the page shows a list of bookable slots instead of the calendar view.

</attribute>

<attribute name="auto_confirm" type="boolean" :parentNames="['custom']" :isChild=true>

When `true`, a booking is confirmed immediately. Otherwise the booking is a request that the user has to confirm.

</attribute>

<attribute name="invite_title" type="string" :parentNames="['custom']" :isChild=true>

Headline of the booking page.

</attribute>

<attribute name="redirect_url" type="string" :parentNames="['custom']" :isChild=true>

Url to redirect people after the booking is made.

</attribute>

<attribute name="fixed_places" type="array of hashes" :parentNames="['custom']" :isChild=true :isLast=true>

Places proposed on the booking page. When an event is booked without a place, the first one becomes the place of the event.

<attributes :isChild=true>
<attribute name="name" type="string" :parentNames="['custom', 'fixed_places']" :isChild=true>

Name for the place.

</attribute>

<attribute name="address" type="string" :parentNames="['custom', 'fixed_places']" :isChild=true>

Address, phone number or link of the place.

</attribute>

<attribute name="source" type="string" :parentNames="['custom', 'fixed_places']" :isChild=true>

Name of the system the place comes from (for example the name of your application).

</attribute>

<attribute name="source_id" type="string" :parentNames="['custom', 'fixed_places']" :isChild=true :isLast=true>

Id of the place in that system.

</attribute>
</attributes>

</attribute>

</attributes>

</attribute>
</attributes>

With all this information, we can make a `POST` request at `/v2/vytemes` to set up our first Vyte Page. If you need more information, have a look at the [Booking pages reference](/reference/vytemes/#create-a-booking-page).

::: warning
Remember that the namespace of the Vyte Page nicknames is global: a nickname used by any Vyte account is unavailable. So, in the following request, please replace the nickname with your own one (prefixing it with something specific to your organization is a good idea).
:::

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fvytemes%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522nickname%2522%253A%2520%2522john-doe-acme%2522%252C%250A%2520%2520%2522message%2522%253A%2520%2522Welcome%2520to%2520my%2520booking%2520page%2522%252C%250A%2520%2520%2522belongs_to%2522%253A%2520%25225f1e9b2a8c4d3e0012345601%2522%252C%250A%2520%2520%2522custom%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522auto_message%2522%253A%2520%2522Thank%2520you%2520for%2520your%2520booking.%2520See%2520you%2520soon.%2522%252C%250A%2520%2520%2520%2520%2522auto_title%2522%253A%2520%2522Meeting%2520%257B%257Binvitee%257D%257D%2520%252F%2520%257B%257Bme%257D%257D%2522%252C%250A%2520%2520%2520%2520%2522ask_phone%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522ask_company%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2522block_new_invitee%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2522duration%2522%253A%252030%252C%250A%2520%2520%2520%2520%2522set_lang%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522fixed_lang%2522%253A%2520%2522en%2522%252C%250A%2520%2520%2520%2520%2522set_timezone%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522fixed_timezone%2522%253A%2520%2522Europe%252FLondon%2522%252C%250A%2520%2520%2520%2520%2522event_hide_decline%2522%253A%252024%252C%250A%2520%2520%2520%2520%2522hide_places%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2522hide_support%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522hide_title%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522forbid_add_places%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522min_dates%2522%253A%25201%252C%250A%2520%2520%2520%2520%2522one_slot%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522slot_view%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522auto_confirm%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522invite_title%2522%253A%2520%2522Book%2520a%2520short%2520appointment%2520with%2522%252C%250A%2520%2520%2520%2520%2522redirect_url%2522%253A%2520%2522https%253A%252F%252Fwww.example.com%252Fthanks-for-booking%2522%252C%250A%2520%2520%2520%2520%2522fixed_places%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Office%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522address%2522%253A%2520%25221%2520Example%2520Street%252C%2520London%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522source%2522%253A%2520%2522my-app%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522source_id%2522%253A%2520%2522placeIdInThirdPartyAppDatabase%2522%250A%2520%2520%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Phone%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522address%2522%253A%2520%2522%252B44%252020%25207946%25200000%2522%250A%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%255D%250A%2520%2520%257D%250A%257D%27"
  style="width: 100%; height: 1136px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/vytemes' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "nickname": "john-doe-acme",
  "message": "Welcome to my booking page",
  "belongs_to": "5f1e9b2a8c4d3e0012345601",
  "custom": {
    "auto_message": "Thank you for your booking. See you soon.",
    "auto_title": "Meeting {{invitee}} / {{me}}",
    "ask_phone": true,
    "ask_company": false,
    "block_new_invitee": false,
    "duration": 30,
    "set_lang": true,
    "fixed_lang": "en",
    "set_timezone": true,
    "fixed_timezone": "Europe/London",
    "event_hide_decline": 24,
    "hide_places": false,
    "hide_support": true,
    "hide_title": true,
    "forbid_add_places": true,
    "min_dates": 1,
    "one_slot": true,
    "slot_view": true,
    "auto_confirm": true,
    "invite_title": "Book a short appointment with",
    "redirect_url": "https://www.example.com/thanks-for-booking",
    "fixed_places": [
      {
        "name": "Office",
        "address": "1 Example Street, London",
        "source": "my-app",
        "source_id": "placeIdInThirdPartyAppDatabase"
      },
      {
        "name": "Phone",
        "address": "+44 20 7946 0000"
      }
    ]
  }
}'
```

The answer is `200` with the plain text body `OK` (not JSON):

```text light-code
OK
```

To read the page you have just created, make a `GET` request at `/v2/vytemes/:nickname`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fvytemes%252Fjohn-doe-acme%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 234px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/vytemes/john-doe-acme' \
--header 'Authorization: YOUR_API_KEY'
```

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345640",
  "nickname": "john-doe-acme",
  "belongs_to": "5f1e9b2a8c4d3e0012345601",
  "active": true,
  "hub": false,
  "message": "Welcome to my booking page",
  "urls": [],
  "custom": {
    "auto_message": "Thank you for your booking. See you soon.",
    "auto_title": "Meeting {{invitee}} / {{me}}",
    "ask_phone": true,
    "ask_company": false,
    "block_new_invitee": false,
    "duration": 30,
    "set_lang": true,
    "fixed_lang": "en",
    "set_timezone": true,
    "fixed_timezone": "Europe/London",
    "event_hide_decline": 24,
    "hide_places": false,
    "hide_support": true,
    "hide_title": true,
    "forbid_add_places": true,
    "min_dates": 1,
    "one_slot": true,
    "slot_view": true,
    "auto_confirm": true,
    "invite_title": "Book a short appointment with",
    "redirect_url": "https://www.example.com/thanks-for-booking",
    "fixed_places": [
      {
        "_id": "5f1e9b2a8c4d3e0012345641",
        "name": "Office",
        "address": "1 Example Street, London",
        "source": "my-app",
        "source_id": "placeIdInThirdPartyAppDatabase"
      },
      {
        "_id": "5f1e9b2a8c4d3e0012345642",
        "name": "Phone",
        "address": "+44 20 7946 0000"
      }
    ]
  },
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-01-12T09:30:00.000Z"
}
```

::: warning
If the user already has a Vyte Page, this `POST` request does not create a second one: it updates the existing page, which includes renaming it to the `nickname` of the body. A nickname that is too short, reserved or already used is refused with `403` and the body `taken`.
:::

To change the page later, make a `PUT` request at `/v2/vytemes/:nickname` (see [Update a booking page](/reference/vytemes/#update-a-booking-page)).

## Access the Vyte page

Congrats! Our first Vyte Page is created :clap:

This page is now accessible at `https://www.vyte.in/john-doe-acme` _(don't forget to replace the nickname with your own one)_ and will look like this:

<asset-image srcHtml="img/vyte-page.png" altHtml="Vyte Page" titleHtml="Vyte Page"/>

## What's next?

- [Scheduling API for 1-to-1 bookings](/guides/scheduling-api-for-1-to-1-bookings/): book this user with the API only.
- [Appointment types](/reference/appointment-types/): offer several kinds of meetings on the same Vyte Page.
- [Calendars](/reference/calendars/): the external calendars connected by the user, whose events make the user busy.
