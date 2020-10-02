# Create and manage booking pages

You should now be able to access the API with your API key, but if you aren't, read our [Get started guide](../guides/getting-started.md).

Let's see how you can use Vyte API to automate your scheduling workflow.

In this guide, we will learn how to create a user with the API, from his creation to setting his preferences for his booking page.

[[toc]]

## Retrieve your organization

For the following requests, you will need the `_id` of your organization. The easiest way to retrieve it is to make a `GET` request to the `https://api.vyte.in/v2/auth/test` endpoint.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=true&dsyoff=66px&dsblur=68px&wc=true&wa=true&pv=27px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520'https%253A%252F%252Fapi.vyte.in%252Fv2%252Fauth%252Ftest'%2520%255C%250A--header%2520'Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx'%2520%255C"
  style="width: 100%; height: 200px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/auth/test' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
```

You receive in response an object containing information about your organization, and in particular the `_id`.

```json light-code
{
  "lang": "en",
  "admins": ["5f198d23c1ac5d0bcafc00ee"],
  "members": ["5f198d23c1ac5d0bcafc00ee"],
  "private": false,
  "_id": "5f198da1c1ac5d1a30fc00f3",
  "name": "ACME",
  "plan": "pro",
  "superadmin_team": "5f198da1c1ac5d283ffc00f4",
  "updatedAt": "2020-07-23T13:16:17.129Z",
  "createdAt": "2020-07-23T13:16:17.125Z",
  "__v": 1
}
```

## Create your first user

Now that we have the `_id` of your organization, we are able to create a first user.

> If you need more information about user creation, please refer to the [User API Reference](/reference/users).

To do this, we just have to perform a `POST` request to the `https://api.vyte.in/v2/users` endpoint.
The body of the user creation can be really complex as we will see later, but for the moment, we will just give basic information about the user.

::: warning
In the following request, don't forget to replace the API key and the organization `id` with yours.
:::

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=true&dsyoff=66px&dsblur=68px&wc=true&wa=true&pv=27px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520'https%253A%252F%252Fapi.vyte.in%252Fv2%252Fusers'%2520%255C%250A--header%2520'Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx'%2520%255C%250A--header%2520'Content-Type%253A%2520application%252Fjson'%2520%255C%250A--data-raw%2520'%257B%250A%2520%2520%2522organization%2522%253A%2520%25225f198da1c1ac5d1a30fc00f3%2522%252C%250A%2520%2520%2522user%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522email%2522%253A%2520%2522john.doe%2540example.com%2522%252C%250A%2520%2520%2520%2520%2522first_name%2522%253A%2520%2522John%2522%252C%250A%2520%2520%2520%2520%2522last_name%2522%253A%2520%2522Doe%2522%252C%250A%2520%2520%2520%2520%2522language%2522%253A%2520%2522en%2522%252C%250A%2520%2520%2520%2520%2522timezone%2522%253A%2520%2522Europe%252FLondon%2522%252C%250A%2520%2520%2520%2520%2522picture_url%2522%253A%2520%2522https%253A%252F%252Fwww.example.com%252Fpicture%252Fjean%2522%252C%250A%2520%2520%2520%2520%2522account%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522organization%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522extid%2522%253A%2520%2522userIdInThirdPartyAppDatabase%2522%250A%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%252C%250A%2520%2520%2522login%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522credentials%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522username%2522%253A%2520%2522john.doe%2540example.com%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522password%2522%253A%2520%2522youllneverguessit%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%257D'"
  style="width: 100%; height: 700px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/users' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "organization": "5f198da1c1ac5d1a30fc00f3",
  "user": {
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "language": "en",
    "timezone": "Europe/London",
    "picture_url": "https://www.example.com/picture/jean",
    "account": {
      "organization": {
        "extid": "userIdInThirdPartyAppDatabase"
      }
    }
  },
  "login": {
    "credentials": {
      "username": "john.doe@example.com",
      "password": "youllneverguessit"
    }
  }
}'
```

The response should be the an object containing the created user :

```json light-code
{
  "user": {
    "calendars": {
      "google": false,
      "office365": false,
      "exchange": false,
      "icloud": false,
      "caldav": false
    },
    "modules": {
      "brand": false,
      "assistant": false,
      "vyteme": false,
      "vyteme_pro": false,
      "availabilities": false,
      "billing": false,
      "group_pro": false,
      "team": false
    },
    "account": {
      "organization": {
        "name": "ACME",
        "id": "5f198da1c1ac5d1a30fc00f3",
        "extid": "userIdInThirdPartyAppDatabase"
      },
      "plan": "pro",
      "app_url": "https://my-page.vyte.in"
    },
    "emails": ["john.doe@example.com"],
    "_id": "5f4e06da01326ebd4f69152d",
    "first_name": "John",
    "last_name": "Doe",
    "language": "en",
    "timezone": "Europe/London",
    "picture_url": "https://www.example.com/picture/jean",
    "signedup_with": "api",
    "full_name": "John Doe",
    "updatedAt": "2020-09-01T08:31:22.734Z",
    "createdAt": "2020-09-01T08:31:22.734Z",
    "__v": 0
  }
}
```

We have created our first user with Vyte API :clap:

## Configure his Vyte Page

Now that our user is created, we will go further and create his Vyte Page. To sum up, we will use the API to create the Vyte Page as we would do directly on the [Vyte dashboard](https://www.vyte.in/pages?lang=en).

To create and set up the Vyte Page, we will first set our user's availabilities thanks to the [Availabilities API](../reference/availabilities.md). Then, we will create his Vyte Page with the [Vyteme API](../reference/vytemes.md).

### Set up availabilities

Let's set up the availabilities of our user John Doe. To do this, we will perform a `POST` request at `/v2/users/:user_id/availabilities`. Here is a little reminder for the body parameters for this request:

<attributes title="Body parameters">
<attribute name="timezone" type="string">

The user timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="today_as_busy" type="boolean">

Prevent from booking on the same day.

</attribute>

<attribute name="past_as_busy" type="boolean">

Prevent from booking in the past.

</attribute>

<attribute name="days_after_as_busy" type="number">

Prevent from booking in more than n days.

</attribute>

<attribute name="buffer_before" type="number">

Ensure users have at least n minutes free before each meeting.

</attribute>

<attribute name="buffer_after" type="number">

Ensure users have at least n minutes free after each meeting.

</attribute>

<attribute name="all_day_busy" type="boolean">

If the user has busy all day events on its calendar the full day will be marked as busy on Vyte

</attribute>

<attribute name="days" type="hash">

Here you can define the availabilities for each day of the week. **We present the structure only for monday, but it is the same for the othe days.**

<attributes :isChild=true>

<attribute name="monday" type="hash" :parentNames="['days']" :isChild=true :isLast=true>

Settings for monday.

<attributes :isChild=true>
<attribute name="enabled" type="boolean" :parentNames="['days', 'monday']" :isChild=true>

Whether or not we enable booking on that day.

</attribute>

<attribute name="slots" type="array of hashes" :parentNames="['days', 'monday']" :isChild=true :isLast=true>

An array of slots defining when the user is available.

<attributes :isChild=true>
<attribute name="start_time" type="date" :parentNames="['days', 'monday', 'slots[0]']" :isChild=true>

The start time of the slot expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601). **Be careful, date part of the string doesn't matter.**

</attribute>

<attribute name="end_time" type="date" :parentNames="['days', 'monday', 'slots[0]']" :isChild=true :isLast=true>

The end time of the slot expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601). **Be careful, date part of the string doesn't matter.**

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>

</attributes>

So, here is as an example request to set up availabilities for our user. You can check up the meaning of each parameters with the object description given above.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fusers%252F5f4e06da01326ebd4f69152d%252Favailabilities%27%2520%255C%250A--header%2520%27Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522timezone%2522%253A%2520%2522Europe%252FLondon%2522%252C%250A%2520%2520%2522today_as_busy%2522%253A%2520false%252C%250A%2520%2520%2522past_as_busy%2522%253A%2520true%252C%250A%2520%2520%2522days_after_as_busy%2522%253A%252060%252C%250A%2520%2520%2522buffer_before%2522%253A%25200%252C%250A%2520%2520%2522buffer_after%2522%253A%25200%252C%250A%2520%2520%2522all_day_busy%2522%253A%2520true%252C%250A%2520%2520%2522days%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522monday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522tuesday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522wednesday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522thursday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522friday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2520%2520%2522slots%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522start_time%2522%253A%2520%25222018-01-01T09%253A00%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2522end_time%2522%253A%2520%25222018-01-01T17%253A00%2522%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%255D%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522saturday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520false%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2522sunday%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522enabled%2522%253A%2520false%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%257D%27"
  style="width: 100%; height: 1600px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/users/5f4e06da01326ebd4f69152d/availabilities' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
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
          "start_time": "2018-01-01T09:00",
          "end_time": "2018-01-01T17:00"
        }
      ]
    },
    "tuesday": {
      "enabled": true,
      "slots": [
        {
          "start_time": "2018-01-01T09:00",
          "end_time": "2018-01-01T17:00"
        }
      ]
    },
    "wednesday": {
      "enabled": true,
      "slots": [
        {
          "start_time": "2018-01-01T09:00",
          "end_time": "2018-01-01T17:00"
        }
      ]
    },
    "thursday": {
      "enabled": true,
      "slots": [
        {
          "start_time": "2018-01-01T09:00",
          "end_time": "2018-01-01T17:00"
        }
      ]
    },
    "friday": {
      "enabled": true,
      "slots": [
        {
          "start_time": "2018-01-01T09:00",
          "end_time": "2018-01-01T17:00"
        }
      ]
    },
    "saturday": {
      "enabled": false
    },
    "sunday": {
      "enabled": false
    }
  }
}'
```

### Create and set up the Vyte Page

Now that we've set up the availabilities of our user, we can create the Vyte Page. There is a lot of parameters to personalize the Vyte Page and here is a description of the `Vyteme` object:

<attributes title="Vyteme object">
<attribute name="nickname" type="string" :required=true>

Nickname for the user Vyte Page.

</attribute>

<attribute name="message" type="string">

Message shown on the Vyte page.

</attribute>

<attribute name="belongs_to" type="string" :required=true>

The `id` of the user who own the Vyte Page.

</attribute>

<attribute name="secondary" type="boolean" details="default to false">

Set to true if you want to set a second Vyte page for the user. Secondary Vyte Pages can only be set and customized through the API.

</attribute>

<attribute name="active" type="boolean" details="default to true">

Whether or not the Vyte page is active.

</attribute>

<attribute name="custom" type="hash">

Custom settings for the user Vyte Page.

<attributes :isChild=true>
<attribute name="auto_message" type="string" :parentNames="['custom']" :isChild=true>

Auto response message when someone book a meeting on the Vyte Page.

</attribute>

<attribute name="auto_title" type="string" :parentNames="['custom']" :isChild=true>

Auto title for the event.

</attribute>

<attribute name="ask_phone" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not the user must the user must provide their phone number.

</attribute>

<attribute name="ask_company" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not the user must the user must provide their company.

</attribute>

<attribute name="block_new_invitee" type="boolean" :parentNames="['custom']" :isChild=true>

If enabled, it prevents people that have booked events on that Vyte booking page to add other invitees to those events.
Defaults to `false`.

</attribute>

<attribute name="duration" type="number" :parentNames="['custom']" :isChild=true>

Default duration for the event.

</attribute>

<attribute name="set_lang" type="boolean" :parentNames="['custom']" :isChild=true>

Only use if you only accept bookings in one language.

</attribute>

<attribute name="enable_api" type="bollean" :parentNames="['custom']" :isChild=true>

To enable API variables.

</attribute>

<attribute name="fixed_lang" type="string" :parentNames="['custom']" :isChild=true>

Fixed lang expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.

</attribute>

<attribute name="set_timezone" type="boolean" :parentNames="['custom']" :isChild=true>

Only use if you only accept bookings from people on your own timezone.

</attribute>

<attribute name="fixed_timezone" type="string" :parentNames="['custom']" :isChild=true>

Fixed timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="event_hide_decline" type="number" :parentNames="['custom']" :isChild=true>

Allow you to set how long (in hours) before the begining of the event the decline button will be hidden.
Ex: if set to 24, the decline button will be hidden on the event page 24h before the confirmed date of the event.

</attribute>

<attribute name="hide_places" type="boolean" :parentNames="['custom']" :isChild=true>

Hide places from the booking page.

</attribute>

<attribute name="hide_support" type="boolean" :parentNames="['custom']" :isChild=true>

Hide Vyte support button from the booking page (recommended for an integration).

</attribute>

<attribute name="hide_title" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not people booking can set a title / subject for the event.

</attribute>

<attribute name="forbid_add_places" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not you forbid from suggesting other places from the booking page.

</attribute>

<attribute name="min_dates" type="number" :parentNames="['custom']" :isChild=true>

Enforces a minimum number of slots on the booking page (only works for calendar vie, not slots view).

</attribute>

<attribute name="one_slot" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not only one slot can be suggested on the calendar view.

</attribute>

<attribute name="auto_confirm" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not the event will be booked as confirmed automatically.

</attribute>

<attribute name="invite_title" type="string" :parentNames="['custom']" :isChild=true>

Customize the wording on the booking page.

</attribute>

<attribute name="redirect_url" type="string" :parentNames="['custom']" :isChild=true>

Url to redirect people after the booking is made.

</attribute>

<attribute name="fixed_places" type="array of hashes" :parentNames="['custom']" :isChild=true :isLast=true>

Set up a list of places on the booking page

<attributes :isChild=true>
<attribute name="name" type="string" :parentNames="['custom', 'fixed_places']" :isChild=true>

Name for the place.

</attribute>

<attribute name="adress" type="string" :parentNames="['custom', 'fixed_places']" :isChild=true>

Address for the place.

</attribute>

<attribute name="source" type="string" :parentNames="['custom', 'fixed_places']" :isChild=true>

Source of the place.

</attribute>

<attribute name="source_id" type="string" :parentNames="['custom', 'fixed_places']" :isChild=true :isLast=true>

Id of the place in your own database/source.

</attribute>
</attributes>

</attribute>

</attributes>

</attribute>
</attributes>

With all these information, we can perform this example request to set up our first Vyte Page. If you need more information, have a look at the [Vyteme reference](../reference/vytemes.md).

::: warning
Remember that the namespace for the Vyte Page nickname is global. So, in the following request, please replace the nickname with a new one.
:::

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fvytemes%27%2520%255C%250A--header%2520%27Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522nickname%2522%253A%2520%2522john-doe-acme%2522%252C%250A%2520%2520%2522message%2522%253A%2520%2522Welcome%2520to%2520my%2520booking%2520page%2522%252C%250A%2520%2520%2522belongs_to%2522%253A%2520%25225f4e16c301326e82fa691552%2522%252C%250A%2520%2520%2522custom%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522auto_message%2522%253A%2520%2522Thank%2520you%2520for%2520your%2520booking.%2520See%2520you%2520soon.%2522%252C%250A%2520%2520%2520%2520%2522auto_title%2522%253A%2520%2522RDV%2520%257B%257Binvitee%257D%257D%2520%252F%2520%257B%257Bme%257D%257D%2522%252C%250A%2520%2520%2520%2520%2522ask_phone%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522ask_company%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2522block_new_invitee%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2522duration%2522%253A%252030%252C%250A%2520%2520%2520%2520%2522set_lang%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522enable_api%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522fixed_lang%2522%253A%2520%2522en%2522%252C%250A%2520%2520%2520%2520%2522set_timezone%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522fixed_timezone%2522%253A%2520%2522Europe%252FLondon%2522%252C%250A%2520%2520%2520%2520%2522event_hide_decline%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2522hide_places%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2522hide_support%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522hide_title%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522forbid_add_places%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522min_dates%2522%253A%25201%252C%250A%2520%2520%2520%2520%2522one_slot%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522slot_view%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522auto_confirm%2522%253A%2520true%252C%250A%2520%2520%2520%2520%2522invite_title%2522%253A%2520%2522Book%2520a%2520short%2520appointment%2520with%2522%252C%250A%2520%2520%2520%2520%2522redirect_url%2522%253A%2520%2522https%253A%252F%252Fwww.example.com%252Fthanks-for-booking%2522%252C%250A%2520%2520%2520%2520%2522fixed_places%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Office%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522address%2522%253A%2520%2522Office%2520address%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522source%2522%253A%2520%2522appName%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522source_id%2522%253A%2520%2522placeIdInThirdPartyAppDatabase%2522%250A%2520%2520%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Phone%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522address%2522%253A%2520%25220102030405%2522%250A%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%255D%250A%2520%2520%257D%250A%257D%27"
  style="width: 100%; height: 1160px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request PUT 'https://api.vyte.in/v2/users' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "organization": "5f198da1c1ac5d1a30fc00f3",
  "user": {
    "email": "john.doe@example.com",
    "account": {
      "organization": {
        "extid": "userIdInThirdPartyAppDatabase"
      }
    }
  },
  "vyteme": {
    "nickname": "john-doe-acme",
    "message": "Welcome to my booking page",
    "custom": {
      "auto_message": "Thank you for your booking. See you soon.",
      "auto_title": "RDV {{invitee}} / {{me}}",
      "ask_phone": true,
      "ask_company": false,
      "block_new_invitee": false,
      "duration": 30,
      "set_lang": true,
      "enable_api": true,
      "fixed_lang": "en",
      "set_timezone": true,
      "fixed_timezone": "Europe/London",
      "event_hide_decline": false,
      "hide_places": false,
      "hide_support": true,
      "hide_title": true,
      "forbid_add_places": true,
      "min_dates": 1,
      "one_slot": true,
      "auto_confirm": true,
      "invite_title": "Book a short appointment with",
      "redirect_url": "https://www.example.com/thanks-for-booking",
      "fixed_places": [
        {
          "name": "Office",
          "address": "Office address",
          "source": "appName",
          "source_id": "placeIdInThirdPartyAppDatabase"
        },
        {
          "name": "Phone",
          "address": "0102030405"
        }
      ]
    }
  }
}'
```

## Access the Vyte page

Congrats! Our first Vyte Page is created :clap:

This page is now accessible at [https://www.vyte.in/john-doe-acme](https://www.vyte.in/john-doe-acme) _(don't forget to replace the nickname with your own one)_ and will look like this:

<asset-image srcHtml="img/vyte-page.png" altHtml="Vyte Page" titleHtml="Vyte Page"/>
