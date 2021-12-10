---
{ "pageClass": "reference-page" }
---

# Vytemes

:::::panel

:::: left
You can use the `/v2/vytemes` endpoints to manage the Vyte Page of your users.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/vytemes/:nickname" href="#retrieve-a-vyteme"></endpoint>
  <endpoint method="post" path="/v2/vytemes/" href="#create-a-vyteme"></endpoint>
  <endpoint method="put" path="/v2/vytemes/:nickname" href="#update-a-vyteme"></endpoint>
  <endpoint method="delete" path="/v2/vytemes/:nickname" href="#delete-a-vyteme"></endpoint>
</endpoints>
::::

:::::

## The vyteme object

::::: panel
:::: left

<attributes title="Attributes">

<attribute name="nickname" type="string">

Nickname for the user Vyte Page. The nickname is the last part of the path to access the Vyte booking page. Ex: if the nickname is `john-doe`, the booking page will be accessible at `https://vyte.in/john-doe`.

</attribute>

<attribute name="message" type="string">

Message shown on the Vyte page.

</attribute>

<attribute name="belongs_to" type="string">

The `id` of the user who own the Vyte Page.

</attribute>

<attribute name="secondary" type="boolean">

Set to true if you want to set a second Vyte page for the user. Secondary Vyte Pages can only be set and customized through the API.

</attribute>

<attribute name="active" type="boolean">

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

<attribute name="title_label" type="string" :parentNames="['custom']" :isChild=true>

Label of the title field.

</attribute>

<attribute name="title_placeholder" type="string" :parentNames="['custom']" :isChild=true>

Placeholder of the title field.

</attribute>

<attribute name="title_mandatory" type="boolean" :parentNames="['custom']" :isChild=true>

Make the title mandatory, if set `true`.

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

::::

:::: right

> THE VYTEME OBJECT

```json light-code
{
  "nickname": "john-doe-acme",
  "message": "Welcome to my booking page",
  "belongs_to": "5f1b018dc1ac5dc46efc0139",
  "secondary": false,
  "active": true,
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
    "title_label": "The subject of meeting",
    "title_placeholder": "Discuss the project",
    "title_mandatory": true,
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
```

::::

:::::

## Retrieve a vyteme

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/vytemes/:nickname HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="nickname" type="string">

The nickname of the Vyte Page.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<returns title="Returns">

An `Vyteme` object if there is no error.

</returns>
:::::

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/users/:user_id/vyteme HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `_id` of user, whom the Vyte Page belongs to.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<returns title="Returns">

An `Vyteme` object if there is no error. It returns the primary `Vyteme`, where property `secondary` is not true.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/vytemes/john-doe-acme' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/users/5fd356f7e34eaa001c4844cc/vyteme' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
{
  "nickname": "john-doe-acme",
  "message": "Welcome to my booking page",
  "secondary": false,
  "active": true,
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
    "title_label": "The subject of meeting",
    "title_placeholder": "Discuss the project",
    "title_mandatory": true,
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
```

:::::

::::::

## List all Vyteme pages of the user

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/users/:user_id/vytemes HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `_id` of user, whom the Vyte Page belongs to.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<returns title="Returns">

An array of `Vyteme` objects if there is no error.

</returns>
:::::

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/users/5fd359112162de001c023573/vytemes' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code

[ { "custom":
    { "set_lang": false,
      "set_timezone": false,
      "min_dates": 1,
      "no_emails": false,
      "one_slot": true,
      "auto_confirm": true,
      "fixed_places": [] },
    "hub": false,
    "urls":
      [ "http://twitter.com/sample",
        "http://facebook.com/sample" ],
     "active": true,
     "_id": "5fd35911bbeb07f575771da1",
     "nickname": "sample",
     "belongs_to": "5fd359112162de001c023573",
     "message": "Hello everyone",
     "updatedAt": "2020-12-11T11:33:38.211Z",
     "createdAt": "2020-12-11T11:33:38.046Z",
     "__v": 1 },
   { "custom":
      { "set_lang": false,
        "set_timezone": false,
        "min_dates": 1,
        "no_emails": false,
        "one_slot": true,
        "auto_confirm": true,
        "fixed_places": [] },
     "hub": false,
     "urls": [],
     "active": true,
     "_id": "5fd359122162de001c023578",
     "nickname": "sampletwo",
     "message": "kikoo",
     "belongs_to": "5fd359112162de001c023573",
     "updatedAt": "2020-12-11T11:33:38.303Z",
     "createdAt": "2020-12-11T11:33:38.303Z",
     "__v": 0 } ]

```

:::::

::::::



## Create a vyteme

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/vytemes HTTP/1.1
```

<attributes title="Path parameters" :isEmpty=true></attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<attributes title="Body parameters">

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

<attribute name="title_label" type="string" :parentNames="['custom']" :isChild=true>

Label of the title field.

</attribute>

<attribute name="title_placeholder" type="string" :parentNames="['custom']" :isChild=true>

Placeholder of the title field.

</attribute>

<attribute name="title_mandatory" type="boolean" :parentNames="['custom']" :isChild=true>

Make the title mandatory, if set `true`.

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

<returns title="Returns">

The created `Vyteme` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request POST 'https://api.vyte.in/v2/vytemes' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
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
    "title_label": "The subject of meeting",
    "title_placeholder": "Discuss the project",
    "title_mandatory": true,
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
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "nickname": "john-doe-acme",
  "message": "Welcome to my booking page",
  "secondary": false,
  "active": true,
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
    "title_label": "The subject of meeting",
    "title_placeholder": "Discuss the project",
    "title_mandatory": true,
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
```

:::::

::::::

## Update a vyteme

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/vytemes/:nickname HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="nickname" type="string">

The nickname of the Vyte Page.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<attributes title="Body parameters">

<attribute name="nickname" type="string">

Nickname for the user Vyte Page. The nickname is the last part of the path to access the Vyte booking page. Ex: if the nickname is `john-doe`, the booking page will be accessible at `https://vyte.in/john-doe`.

</attribute>

<attribute name="message" type="string">

Message shown on the Vyte page.

</attribute>

<attribute name="belongs_to" type="string">

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

<attribute name="title_label" type="string" :parentNames="['custom']" :isChild=true>

Label of the title field.

</attribute>

<attribute name="title_placeholder" type="string" :parentNames="['custom']" :isChild=true>

Placeholder of the title field.

</attribute>

<attribute name="title_mandatory" type="boolean" :parentNames="['custom']" :isChild=true>

Make the title mandatory, if set `true`.

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

<returns title="Returns">

The updated `Vyteme` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request PUT 'https://api.vyte.in/v2/vytemes/john-doe-acme' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
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
    "title_label": "The subject of phone call",
    "title_placeholder": "Discuss the new project",
    "title_mandatory": true,
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
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "nickname": "john-doe-acme",
  "message": "Welcome to my booking page",
  "secondary": false,
  "active": true,
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
    "title_label": "The subject of phone call",
    "title_placeholder": "Discuss the new project",
    "title_mandatory": true,
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
```

:::::

::::::

## Delete a vyteme

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
DELETE /v2/vytemes/:nickname HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="nickname" type="string">

The nickname of the Vyte Page.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns an object containing the number of row affected and the status if there is no error, and returns an error otherwise.

</returns>

::::

:::: right

```shell
curl --request DELETE 'https://api.vyte.in/v2/vytemes/john-doe-acme' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'
```

> RESPONSE SAMPLE

```json light-code
{
  "n": 1,
  "ok": 1
}
```

::::

:::::
