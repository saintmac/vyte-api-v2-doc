---
pageClass: reference-page
---

# Users

::::: panel
:::: left
You can use the `/v2/users` endpoints to manage the users for your organization.
With the User REST API, you will be able to automate the user creation task, and then to retrieve all the users linked to your organization. This API become really useful when it's used with the Team API, providing a full workflow to manage your users and to group them in teams.
Moreover, we provide a endpoint to batch create users to optimize the workflow in case you have a lot of users to create.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users" href="#list-all-users-linked-to-you-organization"></endpoint>
  <endpoint method="post" path="/v2/users" href="#create-a-user"></endpoint>
  <endpoint method="post" path="/v2/users/batch" href="#batch-create-users"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id" href="#update-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/batch" href="#batch-update-users"></endpoint>
  <endpoint method="delete" path="/v2/users/:user_id" href="#remove-a-user-from-your-organization"></endpoint>
</endpoints>
::::

:::::

## The user object

::::: panel
:::: left

<attributes title="Attributes">

<attribute name="id" type="string">

The `_id` of the user.

</attribute>

<attribute name="first_name" type="string">

The firstname of the user.

</attribute>

<attribute name="last_name" type="string">

The lastname of the user.

</attribute>

<attribute name="timezone" type="string">

The timezone of the user expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="language" type="string">

The language of the user. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="signedup_with" type="string">

The login method used to sign up.

</attribute>

<attribute name="calendarList" type="string">

Id of the user's calendar list.

</attribute>

<attribute name="picture_url" type="string">

Url of the user's picture.

</attribute>

<attribute name="account" type="hash">

Account information.

<attributes :isChild=true>
<attribute name="organization" type="hash"  :parentNames="['account']" :isChild=true>

User's organization information.

<attributes :isChild=true>
<attribute name="name" type="string"  :parentNames="['account', 'organization']" :isChild=true>
Name of the organization
</attribute>

<attribute name="id" type="string"  :parentNames="['account', 'organization']" :isChild=true>
Id of the organization.
</attribute>

<attribute name="admin" type="boolean"  :parentNames="['account', 'organization']" :isChild=true :isLast=true>
Whether or not the user is admin of the organization.
</attribute>
</attributes>

</attribute>

<attribute name="plan" type="string"  :parentNames="['account']" :isChild=true>

Type of plan. Possible values are : `free`, `pro`.

</attribute>

<attribute name="free_trial_days" type="number"  :parentNames="['account']" :isChild=true>

Duration (in days) of the free plan.

</attribute>

<attribute name="free_trial_started" type="date"  :parentNames="['account']" :isChild=true>

Date (expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601)) of beginning of the free trial period.

</attribute>

<attribute name="free_trial_until" type="date"  :parentNames="['account']" :isChild=true>

Date (expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601)) of ending of the free trial period.

</attribute>

<attribute name="app_url" type="string"  :parentNames="['account']" :isChild=true :isLast=true>

App url of the user

</attribute>
</attributes>
</attribute>

<attribute name="consent" type="hash">
<attributes :isChild=true>
<attribute name="terms" type="date" :parentNames="['consent']" :isChild=true :isLast=true>

Date (expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601)) the user accepts the terms

</attribute>
</attributes>
</attribute>

<attribute name="emails" type="array of strings">

Contact email of the user. **This is an array but it can contain only one email.**

</attribute>

<attribute name="calendars" type="hash">

Informations about calendars syncing.

<attributes :isChild=true>
<attribute name="google" type="boolean" :parentNames="['calendars']" :isChild=true>

Whether or not the user has connected their Google calendar.

</attribute>
<attribute name="office365" type="boolean" :parentNames="['calendars']" :isChild=true>

Whether or not the user has connected their Office365 calendar.

</attribute>
<attribute name="exchange" type="boolean" :parentNames="['calendars']" :isChild=true>

Whether or not the user has connected their Exchange calendar.

</attribute>
<attribute name="icloud" type="boolean" :parentNames="['calendars']" :isChild=true>

Whether or not the user has connected their ICloud calendar.

</attribute>
<attribute name="caldav" type="boolean" :parentNames="['calendars']" :isChild=true :isLast=true>

Whether or not the user has connected their CalDav calendar.

</attribute>
</attributes>

</attribute>

<attribute name="google" type="hash">

Information about Google account.

<attributes :isChild=true>

<attribute name="id" type="string" :parentNames="['google']" :isChild=true>
Id of the Google account.
</attribute>

<attribute name="email" type="string" :parentNames="['google']" :isChild=true>
Email of the Google account.
</attribute>

<attribute name="picture" type="string" :parentNames="['google']" :isChild=true>
Picture url of the Google account.
</attribute>

<attribute name="token" type="string" :parentNames="['google']" :isChild=true>
Token of the Google account.
</attribute>

<attribute name="last_contacts_fetch" type="date" :parentNames="['google']" :isChild=true>

Date the contacts were last fetched, expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601).

</attribute>

<attribute name="last_profile_fetch" type="date" :parentNames="['google']" :isChild=true :isLast=true>

Date the profile infromation were last fetched, expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601).

</attribute>
</attributes>

</attribute>
</attributes>
::::

:::: right

> THE USER OBJECT

```json light-code
{
  "_id": "5f11747afb208c814fd24bb7",
  "first_name": "Jean",
  "last_name": "Dupont",
  "full_name": "Jean Dupont",
  "timezone": "Europe/Paris",
  "language": "fr",
  "signedup_with": "email",
  "calendarList": "5f1175516b229dad991a7949",
  "picture_url": "https://pictures-cdn.vyte.in/l0hev89qp5nla0bzhszy6.jpg",
  "account": {
    "organization": {
      "name": "My Organization",
      "id": "5f117442d7535f4c7ba5b3e7",
      "admin": true
    },
    "plan": "pro",
    "free_trial_days": 14,
    "free_trial_started": "2020-06-22T15:15:18.474Z",
    "free_trial_until": "2020-07-06T15:15:18.475Z",
    "app_url": "https://jean-dupont.vyte.in"
  },
  "consent": {
    "terms": "2020-06-24T09:42:41.225Z"
  },
  "emails": ["jean.dupont@example.com"],
  "calendars": {
    "google": true,
    "office365": false,
    "exchange": false,
    "icloud": false,
    "caldav": false
  },
  "google": {
    "id": "112448977134001874141",
    "email": "jean.dupont@example.com",
    "picture": "http://example.com/picture",
    "token": "5f1174267931de7e41cc729a",
    "last_contacts_fetch": "2020-07-13T15:45:04.688Z",
    "last_profile_fetch": "2020-07-14T09:36:22.997Z"
  }
}
```

::::

:::::

## List all users linked to you organization

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/users HTTP/1.1
```

<attributes title="Path parameters" :isEmpty=true />

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns an array of `User` objects if there is some existing users. Otherwise, returns an empty array.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl  --request GET 'https://api.vyte.in/v2/users' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
[
  {
    "_id": "5f11747afb208c814fd24bb7",
    "first_name": "Jean",
    "last_name": "Dupont",
    "full_name": "Jean Dupont",
    "timezone": "Europe/Paris",
    "language": "fr",
    "signedup_with": "email",
    "calendarList": "5f1175516b229dad991a7949",
    "picture_url": "https://pictures-cdn.vyte.in/l0hev89qp5nla0bzhszy6.jpg",
    "account": {
      "organization": {
        "name": "My Organization",
        "id": "5f117442d7535f4c7ba5b3e7",
        "admin": true
      },
      "plan": "pro",
      "free_trial_days": 14,
      "free_trial_started": "2020-06-22T15:15:18.474Z",
      "free_trial_until": "2020-07-06T15:15:18.475Z",
      "app_url": "https://jean-dupont.vyte.in"
    },
    "consent": {
      "terms": "2020-06-24T09:42:41.225Z"
    },
    "emails": ["jean.dupont@example.com"],
    "calendars": {
      "google": true,
      "office365": false,
      "exchange": false,
      "icloud": false,
      "caldav": false
    },
    "google": {
      "id": "112448977134001874141",
      "email": "jean.dupont@example.com",
      "picture": "http://example.com/picture",
      "token": "5f1174267931de7e41cc729a",
      "last_contacts_fetch": "2020-07-13T15:45:04.688Z",
      "last_profile_fetch": "2020-07-14T09:36:22.997Z"
    }
  }
]
```

::::

:::::

## Retrieve a particular user

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/users/5f11747afb208c814fd24bb7 HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="user_id" type="string" :required=true>

The `id` of the user.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns a `User` object if there is no error.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl  --request GET 'https://api.vyte.in/v2/users/5f11747afb208c814fd24bb7' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code

  {
    "_id": "5f11747afb208c814fd24bb7",
    "first_name": "Jean",
    "last_name": "Dupont",
    "full_name": "Jean Dupont",
    "timezone": "Europe/Paris",
    "language": "fr",
    "signedup_with": "email",
    "calendarList": "5f1175516b229dad991a7949",
    "picture_url": "https://pictures-cdn.vyte.in/l0hev89qp5nla0bzhszy6.jpg",
    "account": {
      "organization": {
        "name": "My Organization",
        "id": "5f117442d7535f4c7ba5b3e7",
        "admin": true
      },
      "plan": "pro",
      "free_trial_days": 14,
      "free_trial_started": "2020-06-22T15:15:18.474Z",
      "free_trial_until": "2020-07-06T15:15:18.475Z",
      "app_url": "https://jean-dupont.vyte.in"
    },
    "consent": {
      "terms": "2020-06-24T09:42:41.225Z"
    },
    "emails": ["jean.dupont@example.com"],
    "calendars": {
      "google": true,
      "office365": false,
      "exchange": false,
      "icloud": false,
      "caldav": false
    },
    "google": {
      "id": "112448977134001874141",
      "email": "jean.dupont@example.com",
      "picture": "http://example.com/picture",
      "token": "5f1174267931de7e41cc729a",
      "last_contacts_fetch": "2020-07-13T15:45:04.688Z",
      "last_profile_fetch": "2020-07-14T09:36:22.997Z"
    }
  }

```

::::

:::::


## Create a user

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/users HTTP/1.1
```

<attributes title="Path parameters" :isEmpty=true />

<attributes title="Query parameters" :isEmpty=true />

<attributes title="Body parameters">

<attribute name="organization" type="string" :required=true>
Id of your organization.
</attribute>

<attribute name="finish_signup_with" type="string" :required=false>

If you want your user to finish signing up on Vyte to set their password, then set that to `email` (the actual "email" string, not the email of the user), otherwise don't use it.
With this set, the response will contain a link which the user can complete the registration with.

</attribute>

<attribute name="user" type="hash" :required=true>

Information about the user.

<attributes :isChild=true>

<attribute name="emails" type="array of strings" :parentNames="['user']" :isChild=true>

Email of the user.

</attribute>

<attribute name="first_name" type="string" :parentNames="['user']" :isChild=true>

The firstname of the user.

</attribute>

<attribute name="last_name" type="string" :parentNames="['user']" :isChild=true>

The lastname of the user.

</attribute>

<attribute name="timezone" type="string" :parentNames="['user']" :isChild=true>

The timezone of the user expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="language" type="string" :parentNames="['user']" :isChild=true>

The language of the user. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="picture_url" type="string" :parentNames="['user']" :isChild=true>

Url of the user's picture.

</attribute>

<attribute name="account" type="hash" :parentNames="['user']" :isChild=true :isLast=true>

Account information.

<attributes :isChild=true>
<attribute name="organization" type="hash"  :parentNames="['user', 'account']" :isChild=true>

User's organization information.

<attributes :isChild=true>
<attribute name="extid" type="string"  :parentNames="['user', 'account', 'organization']" :isChild=true>
External id of the user.
</attribute>
</attributes>

</attribute>
</attributes>
</attribute>

</attributes>
</attribute>

<attribute name="login" type="hash">

To set username and password login credentials for the user. It can't be used with `finish_signup_with` set to `email`.

<attributes :isChild=true>
<attribute name="credentials" :parentNames="['login']" :isChild=true :isLast=true>

Credentials information.

<attributes :isChild=true>
<attribute name="username" type="string" :parentNames="['login', 'credentials']" :isChild=true>
Username for the user.
</attribute>

<attribute name="password" type="string" :parentNames="['login', 'credentials']" :isChild=true :isLast=true>
Password for the user.
</attribute>
</attributes>

</attribute>
</attributes>

</attribute>

<attribute name="availability" type="hash">

To setup the availabilities of the user, just as they would set them on [https://www.vyte.in/pages/1#availabilities](https://www.vyte.in/pages/1#availabilities).

<attributes :isChild=true>
<attribute name="timezone" type="string" :parentNames="['availability']" :isChild=true>

The user timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="today_as_busy" type="boolean" :parentNames="['availability']" :isChild=true>

Prevent from booking on the same day.

</attribute>

<attribute name="past_as_busy" type="boolean" :parentNames="['availability']" :isChild=true>

Prevent from booking in the past.

</attribute>

<attribute name="days_after_as_busy" type="number" :parentNames="['availability']" :isChild=true>

Prevent from booking in more than n days.

</attribute>

<attribute name="buffer_before" type="number" :parentNames="['availability']" :isChild=true>

Ensure users have at least n minutes free before each meeting.

</attribute>

<attribute name="buffer_after" type="number" :parentNames="['availability']" :isChild=true>

Ensure users have at least n minutes free after each meeting.

</attribute>

<attribute name="all_day_busy" type="boolean" :parentNames="['availability']" :isChild=true>

If the user has busy all day events on its calendar the full day will be marked as busy on Vyte

</attribute>

<attribute name="days" type="hash" :parentNames="['availability']" :isChild=true>

Here you can define the availabilities for each day of the week. **We present the structure only for monday, but it is the same for the othe days.**

<attributes :isChild=true>

<attribute name="monday" type="hash" :parentNames="['availability', 'days']" :isChild=true :isLast=true>

Settings for monday.

<attributes :isChild=true>
<attribute name="enabled" type="boolean" :parentNames="['availability', 'days', 'monday']" :isChild=true>

Whether or not we enable booking on that day.

</attribute>

<attribute name="slots" type="array of hashes" :parentNames="['availability', 'days', 'monday']" :isChild=true :isLast=true>

An array of slots defining when the user is available.

<attributes :isChild=true>
<attribute name="start_time" type="date" :parentNames="['availability', 'days', 'monday', 'slots[0]']" :isChild=true>

The start time of the slot expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601). **Be careful, date part of the string doesn't matter.**

</attribute>

<attribute name="end_time" type="date" :parentNames="['availability', 'days', 'monday', 'slots[0]']" :isChild=true :isLast=true>

The end time of the slot expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601). **Be careful, date part of the string doesn't matter.**

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>

<attribute name="vyteme" type="hash">

Useful to create a Vyte booking Page. If you need more informations, please refer to the [introduction](/reference/) part.

<attributes :isChild=true>
<attribute name="nickname" type="string" :parentNames="['vyteme']" :isChild=true>

Nickname for the user Vyte Page.

</attribute>

<attribute name="message" type="string" :parentNames="['vyteme']" :isChild=true>

Message for the user Vyte Page.

</attribute>

<attribute name="custom" type="hash" :parentNames="['vyteme']" :isChild=true :isLast=true>

Custom settings for the user Vyte Page.

<attributes :isChild=true>
<attribute name="auto_message" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Auto response message when someone books a meeting on the Vyte Page.

</attribute>

<attribute name="auto_title" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Auto title for the event.

</attribute>

<attribute name="ask_phone" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true details="default to false">

Whether or not the person making the booking must provide their phone number.

</attribute>

<attribute name="ask_company" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true details="default to false">

Whether or not the person making the booking must provide their company name.

</attribute>

<attribute name="block_new_invitee" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

If enabled, it prevents people that have booked events on that Vyte booking page to add other invitees to those events.
Defaults to `false`.

</attribute>

<attribute name="duration" type="number" :parentNames="['vyteme', 'custom']" :isChild=true>

Default duration for the event.

</attribute>

<attribute name="set_lang" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Only use if you only accept bookings in one language.

</attribute>

<attribute name="enable_api" type="bollean" :parentNames="['vyteme', 'custom']" :isChild=true>

To enable API variables.

</attribute>

<attribute name="fixed_lang" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Fixed lang expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.

</attribute>

<attribute name="set_timezone" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Only use if you only accept bookings from people on your own timezone.

</attribute>

<attribute name="fixed_timezone" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Fixed timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="event_hide_decline" type="number" :parentNames="['vyteme', 'custom']" :isChild=true>

Allow you to set how long (in hours) before the begining of the event the decline button will be hidden.
Ex: if set to 24, the decline button will be hidden on the event page 24h before the confirmed date of the event.

</attribute>

<attribute name="hide_places" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Hide places from the booking page.

</attribute>

<attribute name="hide_support" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Hide Vyte support button from the booking page (recommended for an integration).

</attribute>

<attribute name="hide_title" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Whether or not people booking can set a title / subject for the event.

</attribute>

<attribute name="forbid_add_places" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Whether or not you forbid from suggesting other places from the booking page.

</attribute>

<attribute name="min_dates" type="number" :parentNames="['vyteme', 'custom']" :isChild=true details="default to 1">

Enforces a minimum number of slots on the booking page (only works for calendar view, not slots view).

</attribute>

<attribute name="one_slot" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Whether or not only one slot can be suggested on the calendar view.

</attribute>

<attribute name="auto_confirm" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Whether or not the event will be booked as confirmed automatically.

</attribute>

<attribute name="invite_title" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Customize the wording on the booking page.

</attribute>

<attribute name="redirect_url" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Url to redirect people after the booking is made.

</attribute>

<attribute name="fixed_places" type="array of hashes" :parentNames="['vyteme', 'custom']" :isChild=true :isLast=true>

Set up a list of places on the booking page

<attributes :isChild=true>
<attribute name="name" type="string" :parentNames="['vyteme', 'custom', 'fixed_places']" :isChild=true>

Name for the place.

</attribute>

<attribute name="adress" type="string" :parentNames="['vyteme', 'custom', 'fixed_places']" :isChild=true>

Address for the place.

</attribute>

<attribute name="source" type="string" :parentNames="['vyteme', 'custom', 'fixed_places']" :isChild=true>

Source of the place.

</attribute>

<attribute name="source_id" type="string" :parentNames="['vyteme', 'custom', 'fixed_places']" :isChild=true :isLast=true>

Id of the place in your own database/source.

</attribute>
</attributes>

</attribute>

</attributes>

</attribute>

</attributes>

</attribute>

<attribute name="calendars" type="array of hashes">

If you have access to your users' Exchange credentials you can set their calendars on Vyte directly.

<attributes :isChild=true>

<attribute name="source" type="string" :parentNames="['calendars']" :isChild=true>

Will always be equal to `exchange`.

</attribute>

<attribute name="credentials" :parentNames="['calendars']" :isChild=true :isLast=true>

Credentials for Exchange calendar.

<attributes :isChild=true>
<attribute name="server" type="string" :parentNames="['calendars', 'credentials']" :isChild=true>
Exchange server.
</attribute>

<attribute name="username" type="string" :parentNames="['calendars', 'credentials']" :isChild=true>
Exchange username.
</attribute>

<attribute name="password" type="string" :parentNames="['calendars', 'credentials']" :isChild=true :isLast=true>
Exchange password.
</attribute>
</attributes>

</attribute>

</attributes>

</attribute>

</attributes>

<returns title="Returns">

An object containing a `user` key whith the `User` object. If `finish_signup_with` was set to `email`, the link to complete the registration is also returned.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl  --request POST 'https://api.vyte.in/v2/users' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
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

> RESPONSE SAMPLE

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
    "_id": "5f2d28fb1e0662e70071d46b",
    "first_name": "John",
    "last_name": "Doe",
    "language": "en",
    "timezone": "Europe/London",
    "picture_url": "https://www.example.com/picture/jean",
    "signedup_with": "api",
    "full_name": "John Doe",
    "updatedAt": "2020-08-07T10:12:11.260Z",
    "createdAt": "2020-08-07T10:12:11.260Z",
    "__v": 0
  }
}
```

::::

:::::

## Update a user

::::: panel
:::: left

::: warning

Please note that the POST endpoint is idempotent. To perform an idempotent request, you can pass either the user `id` or the `extid` you gave during creation.

But, to be more RESTful, we also provide a PUT endpoint to update the user.
:::

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/users/:user_id HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="user_id" type="string" :required=true>

The `id` of the user.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<attributes title="Body parameters">

<attribute name="organization" type="string">
Id of your organization.
</attribute>

<attribute name="finish_signup_with" type="string" :required=false>

If you want your user to finish signing up on Vyte to set their password, then set that to `email` (the actual "email" string, not the email of the user), otherwise don't use it.

</attribute>

<attribute name="user" type="hash">

Information about the user.

<attributes :isChild=true>

<attribute name="emails" type="array of strings" :parentNames="['user']" :isChild=true>

Email of the user.

</attribute>

<attribute name="first_name" type="string" :parentNames="['user']" :isChild=true>

The firstname of the user.

</attribute>

<attribute name="last_name" type="string" :parentNames="['user']" :isChild=true>

The lastname of the user.

</attribute>

<attribute name="timezone" type="string" :parentNames="['user']" :isChild=true>

The timezone of the user expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="language" type="string" :parentNames="['user']" :isChild=true>

The language of the user. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="picture_url" type="string" :parentNames="['user']" :isChild=true>

Url of the user's picture.

</attribute>

<attribute name="account" type="hash" :parentNames="['user']" :isChild=true :isLast=true>

Account information.

<attributes :isChild=true>
<attribute name="organization" type="hash"  :parentNames="['user', 'account']" :isChild=true>

User's organization information.

<attributes :isChild=true>
<attribute name="extid" type="string"  :parentNames="['user', 'account', 'organization']" :isChild=true>
External id of the user.
</attribute>
</attributes>

</attribute>
</attributes>
</attribute>

</attributes>
</attribute>

<attribute name="login" type="hash">

To set username and password login credentials for the user. It can't be used with `finish_signup_with` set to `email`.

<attributes :isChild=true>
<attribute name="credentials" :parentNames="['login']" :isChild=true :isLast=true>

Credentials information.

<attributes :isChild=true>
<attribute name="username" type="string" :parentNames="['login', 'credentials']" :isChild=true>
Username for the user.
</attribute>

<attribute name="password" type="string" :parentNames="['login', 'credentials']" :isChild=true :isLast=true>
Password for the user.
</attribute>
</attributes>

</attribute>
</attributes>

</attribute>

<attribute name="availability" type="hash">

To setup the availabilities of the user, just as they would set them on [https://www.vyte.in/pages/1#availabilities](https://www.vyte.in/pages/1#availabilities).

<attributes :isChild=true>
<attribute name="today" type="date" :parentNames="['availability']" :isChild=true>

The user timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="today_as_busy" type="boolean" :parentNames="['availability']" :isChild=true>

Prevent from booking on the same day.

</attribute>

<attribute name="past_as_busy" type="boolean" :parentNames="['availability']" :isChild=true>

Prevent from booking in the past.

</attribute>

<attribute name="days_after_as_busy" type="number" :parentNames="['availability']" :isChild=true>

Prevent from booking in more than n days.

</attribute>

<attribute name="buffer_before" type="number" :parentNames="['availability']" :isChild=true>

Ensure users have at least n minutes free before each meeting.

</attribute>

<attribute name="buffer_after" type="number" :parentNames="['availability']" :isChild=true>

Ensure users have at least n minutes free after each meeting.

</attribute>

<attribute name="all_day_busy" type="boolean" :parentNames="['availability']" :isChild=true>

If the user has busy all day events on its calendar the full day will be marked as busy on Vyte

</attribute>

<attribute name="days" type="hash" :parentNames="['availability']" :isChild=true>

Here you can define the availabilities for each day of the week. **We present the structure only for monday, but it is the same for the othe days.**

<attributes :isChild=true>

<attribute name="monday" type="hash" :parentNames="['availability', 'days']" :isChild=true :isLast=true>

Settings for monday.

<attributes :isChild=true>
<attribute name="enabled" type="boolean" :parentNames="['availability', 'days', 'monday']" :isChild=true>

Whether or not we enable booking on that day.

</attribute>

<attribute name="slots" type="array of hashes" :parentNames="['availability', 'days', 'monday']" :isChild=true :isLast=true>

An array of slots defining when the user is available.

<attributes :isChild=true>
<attribute name="start_time" type="date" :parentNames="['availability', 'days', 'monday', 'slots[0]']" :isChild=true>

The start time of the slot expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601). **Be careful, date part of the string doesn't matter.**

</attribute>

<attribute name="end_time" type="date" :parentNames="['availability', 'days', 'monday', 'slots[0]']" :isChild=true :isLast=true>

The end time of the slot expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601). **Be careful, date part of the string doesn't matter.**

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>
</attributes>

</attribute>

<attribute name="vyteme" type="hash">

Useful to create a Vyte booking Page. If you need more informations, please refer to the [introduction](/reference/) part.

<attributes :isChild=true>
<attribute name="nickname" type="string" :parentNames="['vyteme']" :isChild=true>

Nickname for the user Vyte Page.

</attribute>

<attribute name="message" type="string" :parentNames="['vyteme']" :isChild=true>

Message for the user Vyte Page.

</attribute>

<attribute name="custom" type="hash" :parentNames="['vyteme']" :isChild=true :isLast=true>

Custom settings for the user Vyte Page.

<attributes :isChild=true>
<attribute name="auto_message" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Auto response message when someone books a meeting on the Vyte Page.

</attribute>

<attribute name="auto_title" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Auto title for the event.

</attribute>

<attribute name="ask_phone" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true details="default to false">

Whether or not the person making the booking must provide their phone number.

</attribute>

<attribute name="ask_company" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true details="default to false">

Whether or not the person making the booking must provide their company name.

</attribute>

<attribute name="block_new_invitee" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

If enabled, it prevents people that have booked events on that Vyte booking page to add other invitees to those events.
Defaults to `false`.

</attribute>

<attribute name="duration" type="number" :parentNames="['vyteme', 'custom']" :isChild=true>

Default duration for the event.

</attribute>

<attribute name="set_lang" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Only use if you only accept bookings in one language.

</attribute>

<attribute name="enable_api" type="bollean" :parentNames="['vyteme', 'custom']" :isChild=true>

To enable API variables.

</attribute>

<attribute name="fixed_lang" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Fixed lang expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.

</attribute>

<attribute name="set_timezone" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Only use if you only accept bookings from people on your own timezone.

</attribute>

<attribute name="fixed_timezone" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Fixed timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="event_hide_decline" type="number" :parentNames="['vyteme', 'custom']" :isChild=true>

Allow you to set how long (in hours) before the begining of the event the decline button will be hidden.
Ex: if set to 24, the decline button will be hidden on the event page 24h before the confirmed date of the event.

</attribute>

<attribute name="hide_places" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Hide places from the booking page.

</attribute>

<attribute name="hide_support" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Hide Vyte support button from the booking page (recommended for an integration).

</attribute>

<attribute name="hide_title" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Whether or not people booking can set a title / subject for the event.

</attribute>

<attribute name="forbid_add_places" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true>

Whether or not you forbid from suggesting other places from the booking page.

</attribute>

<attribute name="min_dates" type="number" :parentNames="['vyteme', 'custom']" :isChild=true details="default to 1">

Enforces a minimum number of slots on the booking page (only works for calendar view, not slots view).

</attribute>

<attribute name="one_slot" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true details="default to false">

Whether or not only one slot can be suggested on the calendar view.

</attribute>

<attribute name="auto_confirm" type="boolean" :parentNames="['vyteme', 'custom']" :isChild=true details="default to false">

Whether or not the event will be booked as confirmed automatically.

</attribute>

<attribute name="invite_title" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Customize the wording on the booking page.

</attribute>

<attribute name="redirect_url" type="string" :parentNames="['vyteme', 'custom']" :isChild=true>

Url to redirect people after the booking is made.

</attribute>

<attribute name="fixed_places" type="array of hashes" :parentNames="['vyteme', 'custom']" :isChild=true :isLast=true>

Set up a list of places on the booking page

<attributes :isChild=true>
<attribute name="name" type="string" :parentNames="['vyteme', 'custom', 'fixed_places']" :isChild=true>

Name for the place.

</attribute>

<attribute name="adress" type="string" :parentNames="['vyteme', 'custom', 'fixed_places']" :isChild=true>

Address for the place.

</attribute>

<attribute name="source" type="string" :parentNames="['vyteme', 'custom', 'fixed_places']" :isChild=true>

Source of the place.

</attribute>

<attribute name="source_id" type="string" :parentNames="['vyteme', 'custom', 'fixed_places']" :isChild=true :isLast=true>

Id of the place in your own database/source.

</attribute>
</attributes>

</attribute>

</attributes>

</attribute>

</attributes>

</attribute>

<attribute name="calendars" type="array of hashes">

If you have access to your users' Exchange credentials you can set their calendars on Vyte directly.

<attributes :isChild=true>

<attribute name="source" type="string" :parentNames="['calendars']" :isChild=true>

Will always be equal to `exchange`.

</attribute>

<attribute name="credentials" :parentNames="['calendars']" :isChild=true :isLast=true>

Credentials for Exchange calendar.

<attributes :isChild=true>
<attribute name="server" type="string" :parentNames="['calendars', 'credentials']" :isChild=true>
Exchange server.
</attribute>

<attribute name="username" type="string" :parentNames="['calendars', 'credentials']" :isChild=true>
Exchange username.
</attribute>

<attribute name="password" type="string" :parentNames="['calendars', 'credentials']" :isChild=true :isLast=true>
Exchange password.
</attribute>
</attributes>

</attribute>

</attributes>

</attribute>

</attributes>

<returns title="Returns">

An object containing a `user` key whith the `User` object. If `finish_signup_with` was set to `true`, the link to complete the registration is also returned.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl  --request PUT 'https://api.vyte.in/v2/users/5f2d28fb1e0662e70071d46b' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
  "organization": "5f198da1c1ac5d1a30fc00f3",
  "user": {
    "last_name": "Snow"
  }
}'
```

> RESPONSE SAMPLE

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
    "_id": "5f2d28fb1e0662e70071d46b",
    "first_name": "John",
    "last_name": "Snow",
    "language": "en",
    "timezone": "Europe/London",
    "picture_url": "https://www.example.com/picture/jean",
    "signedup_with": "api",
    "full_name": "John Snow",
    "updatedAt": "2020-08-07T10:12:11.260Z",
    "createdAt": "2020-08-07T10:12:11.260Z",
    "__v": 0
  }
}
```

::::

:::::

## Remove a user from your organization

This endpoint doesn't allow you to totally remove a user from Vyte. You can only unlink a user from your company, so that you are no longer billed for him.

If you need to delete a Vyte account, please contact our support via <intercom-button /> or via email at [support@vyte.in](mailto:support@vyte.in).

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
DELETE /v2/users/:user_id HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="user_id" type="string" :required=true>

The `id` of the user.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

An `Organization` object if there is no error.

</returns>
::::

:::: right

```shell
curl --request DELETE 'https://api-dev2.vyte.in/v2/users/5f4f70bd74f686ee5d46b5bc' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
```

```json light-code
{
  "lang": "en",
  "admins": [
      "5f4e16c301326e82fa691552"
  ],
  "members": [
      {
          "calendars": {
              "google": false,
              "office365": false,
              "exchange": false,
              "icloud": false,
              "caldav": false
          },
          "account": {
              "plan": "pro"
          },
          "emails": [
              "john.doe@example.com"
          ],
          "_id": "5f4e16c301326e82fa691552",
          "picture_url": "https://images.pexels.com/photos/2853664/pexels-photo-2853664.jpeg",
          "full_name": "John Doe"
      }
  ],
  "private": false,
  "_id": "5f198da1c1ac5d1a30fc00f3",
  "name": "ACME",
  "plan": "pro",
  "superadmin_team": "5f198da1c1ac5d283ffc00f4",
  "updatedAt": "2020-09-04T09:31:01.381Z",
  "createdAt": "2020-07-23T13:16:17.125Z",
  "__v": 69,
  "free_trial_days": 14,
  "free_trial_started": "2020-07-23T13:14:18.924Z",
  "free_trial_until": "2020-08-06T13:14:18.924Z",
  "brand": "5f1ac17cc1ac5d4fbefc012a"
}
```

::::
:::::
