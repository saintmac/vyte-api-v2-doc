---
{ "pageClass": "reference-page" }
---

# Slots

:::::panel

:::: left
You can use the `/v2/slots` endpoints to get the free slots of a Vyte user.

::: warning
If the user you are requesting available slots for has no availability in the requested time frame, Vyte’s API will tell you their next availability.

In this case you will have `slots: []` if you’ve used [/slots](#list-all-free-slots) or `days: {}` for [/slots/days](#list-all-free-slots-grouped-by-days).

The response will include a nextAvailability object formatted as in the example.
:::

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/slots" href="#list-all-free-slots"></endpoint>
  <endpoint method="get" path="/v2/slots/days" href="#list-all-free-slots-grouped-by-days"></endpoint>
</endpoints>
::::

:::::

## List all free slots

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/slots HTTP/1.1
```

<attributes title="Query parameters">
  <attribute name="duration" type="number" :required=true>

Duration of the appointment in minutes.

  </attribute>
  <attribute name="emails" type="string" :required=true details="you need either emails, user_ids or team">

Email(s) of people that already have a Vyte account and with whom you want to book an appointment. If several emails are provided, they must be separated with a comma and and the API returns the slots at which all users are available.

  </attribute>
  <attribute name="users" type="string" :required=true details="you need either emails, user_ids or team">

List of `user_id` you want to book an appointment with. If several `user_id` are provided, they must be separated with a comma and and the API returns the slots at which all users are available.

  </attribute>
  <attribute name="team" type="string" :required=true details="you need either emails, user_ids or team">

Id of a team you want to get the available slots for members of. If several team members are available at the same time, only one slot will be returned.

  </attribute>
  <attribute name="from" type="string" :required=true>

Date from when you want to get available slots (included) formatted as `YYYY-MM-DD`.

  </attribute>
  <attribute name="to" type="string" :required=true>

Date until when you want to get available slots (included) formatted as `YYYY-MM-DD`.

  </attribute>
  <attribute name="timezone" type="string">

The timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

  </attribute>
</attributes>

<returns title="Returns">

An object with a `slots` array containing all the free slots.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl --request GET 'https://api.vyte.in/v2/slots?duration=30&emails=john.doe@example.com&from=2020-09-01&to=2020-09-02' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```jsonp light-code
{
  "timezone": "Europe/Paris",
  "from": "2020-09-01",
  "to": "2020-09-02",
  "slots": [
    {
      "start": {
        "dateTime": "2020-09-01T00:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T00:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T00:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T01:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T01:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T01:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T01:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T02:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T02:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T02:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T02:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T03:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T03:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T03:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T03:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T04:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T04:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T04:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T04:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T05:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T05:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T05:30:00+02:00"
      }
    },
    ...
  ]
}
```

:::::

::::::

## List all free slots grouped by days

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/slots/days HTTP/1.1
```

<attributes title="Path parameters" :isEmpty=true></attributes>

<attributes title="Query parameters">
  <attribute name="duration" type="number" :required=true>

Duration of the appointment in minutes.

  </attribute>
  <attribute name="emails" type="string" :required=true details="you need either emails or user_ids">

Email(s) of people that already have a Vyte account and with whom you want to book an appointment. If several emails are provided, they must be separated with a comma and and the API returns the slots at which all users are available.

  </attribute>
  <attribute name="users" type="string" :required=true details="you need either emails or user_ids">

List of `user_id` you want to book an appointment with. If several `user_id` are provided, they must be separated with a comma and and the API returns the slots at which all users are available.

  </attribute>
  <attribute name="from" type="string" :required=true>

Date from when you want to get available slots (included) formatted as `YYYY-MM-DD`.

  </attribute>
  <attribute name="to" type="string" :required=true>

Date until when you want to get available slots (included) formatted as `YYYY-MM-DD`.

  </attribute>
  <attribute name="timezone" type="string">

The timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

  </attribute>
</attributes>

<returns title="Returns">

An object with a `slots` array containing all the free slots.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl --request GET 'https://api.vyte.in/v2/slots/days?duration=30&emails=john.doe@example.com&from=2020-09-01&to=2020-09-02' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```jsonp light-code
{
  "timezone": "Europe/Paris",
  "from": "2020-09-01",
  "to": "2020-09-02",
  "days": {
    "2020-09-01": {
      "slots": [
        {
          "start": {
            "dateTime": "2020-09-01T00:00:00+02:00"
          },
          "end": {
            "dateTime": "2020-09-01T00:30:00+02:00"
          }
        },
        {
          "start": {
            "dateTime": "2020-09-01T00:30:00+02:00"
          },
          "end": {
            "dateTime": "2020-09-01T01:00:00+02:00"
          }
        },
        {
          "start": {
            "dateTime": "2020-09-01T01:00:00+02:00"
          },
          "end": {
            "dateTime": "2020-09-01T01:30:00+02:00"
          }
        },
        ...
      ]
    },
    "2020-09-02": {
      "slots": [
        {
          "start": {
            "dateTime": "2020-09-02T00:00:00+02:00"
          },
          "end": {
            "dateTime": "2020-09-02T00:30:00+02:00"
          }
        },
        {
          "start": {
            "dateTime": "2020-09-02T00:30:00+02:00"
          },
          "end": {
            "dateTime": "2020-09-02T01:00:00+02:00"
          }
        },
        ...
      ]
    }
  }
}
```

:::::

::::::

## List all busy slots

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/busy HTTP/1.1
```

  <attribute name="emails" type="string" :required=true details="you need either emails, user_ids or team">

Email(s) of people that already have a Vyte account and with whom you want to see busy slots of. If several emails are provided, they must be separated with a comma and and the API returns the slots at which all users are available.

  </attribute>
  <attribute name="users" type="string" :required=true details="you need either emails, user_ids or team">

List of `user_id` you want to see busy slots of. If several `user_id` are provided, they must be separated with a comma and and the API returns the slots at which all users are available.

  </attribute>
  <attribute name="team" type="string" :required=true details="you need either emails, user_ids or team">

Id of a team you want to get the busy slots for members of. Only slots where all the team members are busy will be returned.

  </attribute>

  <attribute name="from" type="string" :required=true>

Date from when you want to get available slots (included) formatted as `YYYY-MM-DD`.

  </attribute>
  <attribute name="to" type="string" :required=true>

Date until when you want to get available slots (included) formatted as `YYYY-MM-DD`.

  </attribute>
  <attribute name="timezone" type="string">

The timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

  </attribute>
</attributes>

<returns title="Returns">

An object with a `slots` array containing all the busy slots.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl --request GET 'https://api.vyte.in/v2/busy?emails=john.doe@example.com&from=2020-09-01&to=2020-09-02' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```jsonp light-code
{
  "timezone": "Europe/Paris",
  "from": "2020-09-01",
  "to": "2020-09-02",
  "slots": [
    {
      "start": {
        "dateTime": "2020-09-01T00:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T00:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T00:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T01:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T01:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T01:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T01:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T02:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T02:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T02:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T02:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T03:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T03:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T03:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T03:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T04:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T04:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T04:30:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T04:30:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T05:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-09-01T05:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-09-01T05:30:00+02:00"
      }
    },
    ...
  ]
}
```

:::::

::::::

