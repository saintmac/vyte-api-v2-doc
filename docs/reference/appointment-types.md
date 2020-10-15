---
{
  "pageClass": "reference-page"
}
---

# Appointment types

:::::panel

:::: left

You can use the `/v2/vytemes/:nickname/types` endpoints to manage the availabilities of your users.

> This API is an extension of the Vyteme API, that's why all url are prefixed with `/vyteme/:nickname/`. You can refer to the [Vyteme API reference](vytemes.md) to have more informations about Vyteme creation.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/vytemes/:nickname/types" href="#list-all-appointment-types"></endpoint>
  <endpoint method="post" path="/v2/vytemes/:nickname/types" href="#create-appointment-type"></endpoint>
  <endpoint method="get" path="/v2/vytemes/:nickname/types/:handle" href="#retrieve-appointment-type"></endpoint>
  <endpoint method="post" path="/v2/vytemes/:nickname/types/:handle" href="#update-appointment-type"></endpoint>
  <endpoint method="delete" path="/v2/vytemes/:nickname/types/:handle" href="#delete-appointment-type"></endpoint>
  
</endpoints>
::::

## The Appointment type object

::::: panel
:::: left

<attributes title="Attributes">

<attribute name="vyteme" type="ObjectId">

The `id` of Vyteme page connected with this Appointment type.

</attribute>

<attribute name="availability" type="ObjectId">

The `id` of Availability page connected with this Appointment type.

</attribute>

<attribute name="name" type="string">
  
  Name of the Appointment type
  
</attribute>
 
<attribute name="handle" type="string">
  
Handle is used at the endpoints as a unique identificator of the Appointment type. Created atomatically from the name by urlifying. For example, name `Conference lunch` will be transfomed into `conference-lunch`.
  
</attribute>

<attribute name="active" type="boolean">

Whether or not the Appointment type is active.

</attribute>

<attribute name="message" type="string">

Message shown on the Appointment type page.

</attribute>

<attribute name="description" type="string">

Description shown on the Appointment type page.

</attribute>

<attribute name="public" type="boolean">

Whether or not the Appointment type is public.

</attribute>

<attribute name="custom" type="hash">

Custom settings for the user Appointment type.

<attributes :isChild=true>
<attribute name="auto_message" type="string" :parentNames="['custom']" :isChild=true>

Auto response message when someone book a meeting at this Appointment type.

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

<attribute name="enable_api" type="boolean" :parentNames="['custom']" :isChild=true>

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

Hide support button from the booking page (recommended for an integration).

</attribute>

<attribute name="hide_title" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not people booking can set a title / subject for the event.

</attribute>

<attribute name="forbid_add_places" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not you forbid from suggesting other places from the booking page.

</attribute>

<attribute name="min_dates" type="number" :parentNames="['custom']" :isChild=true>

Enforces a minimum number of slots on the booking page (only works for calendar view, not slots view).

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

</attribute>

</attribute>

</attributes>

</attribute>

</attributes>

::::

:::: right

> THE APPOINTMENT TYPE OBJECT

```json light-code
{
  "vyteme": "5f1b018dc1ac5dc46efc8763",
  "name": "Lunch or dinner",
  "handle": "lunch-or-dinner",
  "message": "Welcome to my booking page",
  "active": true,
  "availability": "5f1b018dc1ac5dc46efc64b8"
  "public": true
  "description": "My conference appointment type"
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
        "address": "Office address"
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

## List all appointment types

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/vytemes/:nickname/types HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="nickname" type="string">

The nickname of the Vyte Page.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<returns title="Returns">

All `Appointment type` objects of this Vyteme if there is no error.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/vytemes/john-doe/types' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
{
  "name": "Lunch or dinner",
  "handle": "lunch-or-dinner",
  "message": "Welcome to my booking page",
  "active": true,
  "availability": "5f1b018dc1ac5dc46efc64b8"
  "public": true
  "description": "My conference appointment type"
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
        "address": "Office address"
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

## Create an appointment type

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/vytemes/:nickname/types HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="nickname" type="string">

The nickname of the Vyte Page.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<attributes title="Body parameters">
  
<attribute name="nickname" type="string">

Nickname for the user Vyte Page. Appointment types are created within Vyteme pages. Ex: if the nickname is `john-doe`, the appointment type page will be accessible at `https://vyte.in/john-doe/types/:handle`.

</attribute>

<attribute name="availability" type="ObjectId">

The `id` of Availability page connected with this Appointment type.

</attribute>

<attribute name="name" type="string">
  
  Name of the Appointment type
  
</attribute>
 
<attribute name="handle" type="string">
  
Handle is used at the endpoints as a unique identificator of the Appointment type. Created atomatically from the name by urlifying. For example, name `Conference lunch` will be transfomed into `conference-lunch`.
  
</attribute>

<attribute name="active" type="boolean">

Whether or not the Appointment type is active.

</attribute>

<attribute name="message" type="string">

Message shown on the Appointment type page.

</attribute>

<attribute name="description" type="string">

Description shown on the Appointment type page.

</attribute>

<attribute name="public" type="boolean">

Whether or not the Appointment type is public.

</attribute>

<attribute name="custom" type="hash">

Custom settings for the user Appointment type.

<attributes :isChild=true>
<attribute name="auto_message" type="string" :parentNames="['custom']" :isChild=true>

Auto response message when someone book a meeting at this Appointment type.

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

<attribute name="enable_api" type="boolean" :parentNames="['custom']" :isChild=true>

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

Hide support button from the booking page (recommended for an integration).

</attribute>

<attribute name="hide_title" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not people booking can set a title / subject for the event.

</attribute>

<attribute name="forbid_add_places" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not you forbid from suggesting other places from the booking page.

</attribute>

<attribute name="min_dates" type="number" :parentNames="['custom']" :isChild=true>

Enforces a minimum number of slots on the booking page (only works for calendar view, not slots view).

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

</attribute>

</attribute>

</attributes>

</attribute>

</attributes>


<returns title="Returns">

The created `Appointment type` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request POST 'https://api.vyte.in/v2/vytemes/john-doe/types' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{

  "name": "Lunch or dinner",
  "handle": "lunch-or-dinner",
  "message": "Welcome to my booking page",
  "active": true,
  "availability": "5f1b018dc1ac5dc46efc64b8"
  "public": true
  "description": "My conference appointment type"
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
        "address": "Office address"
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
  "name": "Lunch or dinner",
  "handle": "lunch-or-dinner",
  "message": "Welcome to my booking page",
  "active": true,
  "availability": "5f1b018dc1ac5dc46efc64b8"
  "public": true
  "description": "My conference appointment type"
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
        "address": "Office address"
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

## Retrieve an Appointment type

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/vytemes/:nickname/types/:handle HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="nickname" type="string">
    
The nickname of the Vyte Page.

  </attribute>
  <attribute name="handle" type="string">
    
The handle of the Appointment type (urlified from the name par default).

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<returns title="Returns">

The particular `Appointment type` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/vytemes/john-doe/types' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
{
  "name": "Lunch or dinner",
  "handle": "lunch-or-dinner",
  "message": "Welcome to my booking page",
  "active": true,
  "availability": "5f1b018dc1ac5dc46efc64b8"
  "public": true
  "description": "My conference appointment type"
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
        "address": "Office address"
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

## Update an Appointment type

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/vytemes/:nickname/types/:handle HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="nickname" type="string">
    
The nickname of the Vyte Page.

  </attribute>
  <attribute name="handle" type="string">
    
The handle of the Appointment type (urlified from the name par default).

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<attributes title="Body parameters">

<attribute name="nickname" type="string">

Nickname for the user Vyte Page. Appointment types are created within Vyteme pages. Ex: if the nickname is `john-doe`, the appointment type page will be accessible at `https://vyte.in/john-doe/types/:handle`.

</attribute>

<attribute name="availability" type="ObjectId">

The `id` of Availability page connected with this Appointment type.

</attribute>

<attribute name="name" type="string">
  
  Name of the Appointment type
  
</attribute>
 
<attribute name="handle" type="string">
  
Handle is used at the endpoints as a unique identificator of the Appointment type. Created atomatically from the name by urlifying. For example, name `Conference lunch` will be transfomed into `conference-lunch`.
  
</attribute>

<attribute name="active" type="boolean">

Whether or not the Appointment type is active.

</attribute>

<attribute name="message" type="string">

Message shown on the Appointment type page.

</attribute>

<attribute name="description" type="string">

Description shown on the Appointment type page.

</attribute>

<attribute name="public" type="boolean">

Whether or not the Appointment type is public.

</attribute>

<attribute name="custom" type="hash">

Custom settings for the user Appointment type.

<attributes :isChild=true>
<attribute name="auto_message" type="string" :parentNames="['custom']" :isChild=true>

Auto response message when someone book a meeting at this Appointment type.

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

<attribute name="enable_api" type="boolean" :parentNames="['custom']" :isChild=true>

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

Hide support button from the booking page (recommended for an integration).

</attribute>

<attribute name="hide_title" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not people booking can set a title / subject for the event.

</attribute>

<attribute name="forbid_add_places" type="boolean" :parentNames="['custom']" :isChild=true>

Whether or not you forbid from suggesting other places from the booking page.

</attribute>

<attribute name="min_dates" type="number" :parentNames="['custom']" :isChild=true>

Enforces a minimum number of slots on the booking page (only works for calendar view, not slots view).

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

</attribute>

</attribute>

</attributes>

</attribute>

</attributes>


<returns title="Returns">

The updated `Appointment type` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request PUT 'https://api.vyte.in/v2/vytemes/john-doe/types/lunch-or-dinner' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
      "name": "Lunch or dinner",
      "handle": "lunch-or-dinner",
      "message": "Welcome to my VERY NEW page",
      "active": true,
      "availability": "5f1b018dc1ac5dc46efc64b8"
      "public": true
      "description": "My ANOTHER appointment type"
      "custom": {
        "auto_message": "Thank you for your booking. See you soon IN 2021.",
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
            "address": "Office address"
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
      "name": "Lunch or dinner",
      "handle": "lunch-or-dinner",
      "message": "Welcome to my VERY NEW page",
      "active": true,
      "availability": "5f1b018dc1ac5dc46efc64b8"
      "public": true
      "description": "My ANOTHER appointment type"
      "custom": {
        "auto_message": "Thank you for your booking. See you soon IN 2021.",
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
            "address": "Office address"
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

## Delete an Appointment type

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
DELETE /v2/vytemes/:nickname/types/:handle HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="nickname" type="string">

The nickname of the Vyte Page.

  </attribute>
  <attribute name="handle" type="string">
    
The handle of the Appointment type (urlified from the name par default).

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns an object containing the number of row affected and the status if there is no error, and returns an error otherwise.

</returns>

::::

:::: right

```shell
curl --request DELETE 'https://api.vyte.in/v2/vytemes/john-doe/types/lunch-or-dinner' \
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
