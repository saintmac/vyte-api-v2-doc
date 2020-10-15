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

:::::

## The appointment type object

::::: panel
:::: left

<attributes title="Attributes">

<attribute name="Vyteme" type="ObjectId">

Required property, the `id` of Vyteme, whithin which the Appointment type is created.

</attribute>

<attribute name="name" type="string">

Name of the Appointment type, required.

</attribute>

<attribute name="handle" type="string">

The name of the Appointment type, used for identification and endpoints. Should be unique for particular Vyteme. Handle is generated from the name by urlifying.

</attribute>

<attribute name="active" type="boolean">

Par default all the Appointment types are created active. They are deactivated in two cases: by user or automatically with downgrading from 'pro' plan to 'free'.

</attribute>

<attribute name="availability" type="string">

The `id` of the availability, connected with this Appointment type.

</attribute>

<attribute name="description" type="string">

Description of an Appointment type.

</attribute>

<attribute name="message" type="string">

Message to send to invitees within this Appointment type.

</attribute>

<attribute name="public" type="boolean">

The Appointment types can be public and private.

</attribute>
</attributes>

<attributes title="Customs">
The custom settings are populated with events automatically. So if you create an event within particular Appointment type, all the custom settings of the Appointment type will be inherited by event.

<attribute name="auto_confirm" type="boolean">
Set auto-confirmation of proposed time and date.
</attribute>

<attribute name="auto_message" type="string">
Set the text of the message send to invitee after picking up the date and time.
</attribute>

<attribute name="auto_title" type="string">
Set up automatically generated title.
</attribute>

<attribute name="ask_phone" type="boolean">
Set up an option of asking the phone number.
</attribute>

<attribute name="ask_company" type="boolean">
Set up an option of asking the company name.
</attribute>

<attribute name="block_new_invitee" type="boolean">
Block events from inviting new invitees.
</attribute>

<attribute name="duration" type="number">
Set up the duration of events in minutes.
</attribute>

<attribute name="ask_company" type="boolean">
Set up an option of asking the company name.
</attribute>











</attributes>

::::

:::: right

> THE AVAILABILITY OBJECT

```json light-code
{
  "days": {
    "monday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e066227db71d493",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "tuesday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e066220c571d494",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "wednesday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e0662ab1b71d495",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "thursday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e0662590c71d496",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "friday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e06626d7871d497",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "saturday": {
      "enabled": false
    },
    "sunday": {
      "enabled": false
    }
  },
  "past_as_busy": true,
  "trim_scheduler": true,
  "_id": "5f2d4abf1e0662085171d476",
  "belongs_to": "5f2d4abf1e0662386371d475",
  "timezone": "Europe/London",
  "dates": [],
  "today_as_busy": false,
  "days_after_as_busy": 60,
  "buffer_before": 0,
  "buffer_after": 0,
  "all_day_busy": true,
}
```

::::

:::::

## Retrieve the availabilities of a user

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/users/:user_id/availabilities HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `id` of the user whose availability you want to retrieve.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<returns title="Returns">

An `Availability` object if there is no error.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/users/5f2d28fb1e0662e70071d46b/availabilities' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
{
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
}
```

:::::

::::::

## Set the availabilities of a user

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/users/:user_id/availabilities HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `id` of the user whose availability you want to create.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

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

<returns title="Returns">

The created `Availability` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request POST 'https://api.vyte.in/v2/users/5f2d28fb1e0662e70071d46b/availabilities' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
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

> RESPONSE SAMPLE

```json light-code
{
  "days": {
    "monday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e066227db71d493",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "tuesday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e066220c571d494",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "wednesday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e0662ab1b71d495",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "thursday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e0662590c71d496",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "friday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d70c51e06626d7871d497",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "saturday": {
      "enabled": false
    },
    "sunday": {
      "enabled": false
    }
  },
  "past_as_busy": true,
  "trim_scheduler": true,
  "_id": "5f2d4abf1e0662085171d476",
  "belongs_to": "5f2d4abf1e0662386371d475",
  "timezone": "Europe/London",
  "dates": [],
  "today_as_busy": false,
  "days_after_as_busy": 60,
  "buffer_before": 0,
  "buffer_after": 0,
  "all_day_busy": true,
  "updatedAt": "2020-08-07T15:18:29.263Z",
  "createdAt": "2020-08-07T12:36:16.024Z",
  "__v": 0
}
```

:::::

::::::

## Update the availabilities of a user

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/users/:user_id/availabilities HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `id` of the user whose availability you want to update.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

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

<returns title="Returns">

The updated `Availability` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl --request PUT 'https://api.vyte.in/v2/users/5f2d4abf1e0662386371d475/availabilities' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
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
      "enabled": true,
      "slots" : [
        {
          "start_time": "2018-01-01T09:00",
          "end_time": "2018-01-01T12:00"
        }
      ]
    },
    "sunday": {
      "enabled": false
    }
  }
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "days": {
    "monday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d712c1e0662346c71d499",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "tuesday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d712c1e0662419b71d49a",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "wednesday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d712c1e0662b11f71d49b",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "thursday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d712c1e06628d3971d49c",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "friday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d712c1e0662234a71d49d",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T16:00:00.000Z"
        }
      ]
    },
    "saturday": {
      "enabled": true,
      "slots": [
        {
          "_id": "5f2d712c1e0662502e71d49e",
          "start_time": "2018-01-01T08:00:00.000Z",
          "end_time": "2018-01-01T11:00:00.000Z"
        }
      ]
    },
    "sunday": {
      "enabled": false
    }
  },
  "past_as_busy": true,
  "trim_scheduler": true,
  "_id": "5f2d4abf1e0662085171d476",
  "belongs_to": "5f2d4abf1e0662386371d475",
  "timezone": "Europe/London",
  "dates": [],
  "today_as_busy": false,
  "days_after_as_busy": 60,
  "buffer_before": 0,
  "buffer_after": 0,
  "all_day_busy": true,
  "updatedAt": "2020-08-07T15:20:12.611Z",
  "createdAt": "2020-08-07T12:36:16.024Z",
  "__v": 0
}
```

:::::

::::::

## Delete the availabilities of a user

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
DELETE /v2/users/:user_id/availabilities HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `id` of the user whose availability you want to delete.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns an object containing the number of row affected and the status if there is no error, and returns an error otherwise.

</returns>

::::

:::: right

```shell
curl --request DELETE 'https://api.vyte.in/v2/users/5f2d4abf1e0662386371d475/availabilities' \
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

