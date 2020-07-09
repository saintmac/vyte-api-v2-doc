# Users

::::: panel
:::: left
You can use the `/v2/users` endpoints to manage the users for your organization.
With the User REST API, you will be able to automate the user creation task, and then to retrieve all the users linked to your organization. This API become really useful when it's used with the Team API, providing a full workflow to manage your users and to group them in teams.
Moreover, we provide a endpoint to batch create users to optimize the workflow in case you have a lot of users to create.

::: warning
There is no DELETE endpoint provided for the User API. You can only unlink a user from your company, so that you are no longer billed for him.
:::

::::

:::: right

::: details THE USER OBJECT

```json
{
  "organization": "yourVyteOrganizationId",
  "finish_signup_with": "email",
  "user": {
    "email": "jean.dupont@acme.fr",
    "first_name": "Jean",
    "last_name": "Dupont",
    "language": "fr",
    "timezone": "Europe/Paris",
    "picture_url": "https://www.example.com/picture/jean",
    "account": {
      "organization": {
        "extid": "userIdInThirdPartyAppDatabase"
      }
    }
  },
  "teams": [
    {
      "admin": false,
      "name": "Management team",
      "extid": "teamIdInThirdPartyAppDatabase"
    }
  ],
  "availability": {
    "timezone": "Europe/Paris",
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
            "start_time": "2018-01-01T10:00",
            "end_time": "2018-01-01T12:30"
          },
          {
            "start_time": "2018-01-01T14:00",
            "end_time": "2018-01-01T18:30"
          }
        ]
      },
      "tuesday": {
        "enabled": true,
        "slots": [
          {
            "start_time": "2018-01-01T10:00",
            "end_time": "2018-01-01T12:30"
          },
          {
            "start_time": "2018-01-01T14:00",
            "end_time": "2018-01-01T18:30"
          }
        ]
      },
      "wednesday": {
        "enabled": true,
        "slots": [
          {
            "start_time": "2018-01-01T10:00",
            "end_time": "2018-01-01T17:30"
          }
        ]
      },
      "thursday": {
        "enabled": false
      },
      "friday": {
        "enabled": true,
        "slots": [
          {
            "start_time": "2018-01-01T10:00",
            "end_time": "2018-01-01T17:30"
          }
        ]
      },
      "saturday": {
        "enabled": true,
        "slots": [
          {
            "start_time": "2018-01-01T10:00",
            "end_time": "2018-01-01T17:30"
          }
        ]
      },
      "sunday": {
        "enabled": false
      }
    }
  },
  "vyteme": {
    "nickname": "appName-userIdInThidPartyAppDatabase",
    "message": "Bienvenue sur ma page de RDV",
    "custom": {
      "auto_message": "Merci d'avoir pris RDV avec moi, j'ai hate de vous rencontrer.",
      "auto_title": "RDV invitee / me",
      "ask_phone": true,
      "ask_company": false,
      "block_new_invitee": false,
      "duration": 30,
      "set_lang": true,
      "enable_api": true,
      "fixed_lang": "fr",
      "set_timezone": true,
      "fixed_timezone": "Europe/Paris",
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
  },
  "calendars": [
    {
      "source": "exchange",
      "credentials": {
        "server": "mail.exchangeserverdomain.com",
        "username": "calendarUserName",
        "password": "calendarPassword"
      }
    }
  ],
  "login": {
    "credentials": {
      "username": "jean.dupont@example.com",
      "password": "youllneverguessit"
    }
  }
}
```
:::

::::

:::::

## Get all users linked to you organization

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/users HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/users' \
--header 'Authorization: apiKey' \
```

:::

::: details RESPONSE SAMPLE
```json
[
    {
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
            "availabilities": true,
            "billing": false,
            "group_pro": false,
            "team": false
        },
        "account": {
            "organization": {
                "name": "yourVyteOrganizationName",
                "id": "yourVyteOrganizationId"
            },
            "plan": "pro",
            "app_url": "https://yourVyteOrganization.vyte.in"
        },
        "consent": {
            "terms": "2020-06-25T13:04:30.548Z"
        },
        "emails": [
            "jean.dupont@example.com"
        ],
        "_id": "5ef4a0bd136440c65930a3da",
        "first_name": "Jean",
        "last_name": "Dupont",
        "language": "en",
        "timezone": "Europe/Paris",
        "picture_url": "https://www.example.com/picture/jean",
        "signedup_with": "api",
        "full_name": "Jean Dupont",
        "updatedAt": "2020-06-25T14:20:34.652Z",
        "createdAt": "2020-06-25T13:03:57.791Z",
        "__v": 0
    }
]
```
:::
::::

:::::

## Create a user

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/users HTTP/1.1
```

To create a user perform a POST request to the `users` endpoint. With that request you can actually set up most of the settings for that user

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/users' \
--header 'Authorization: apiKey' \
```

:::

::: details RESPONSE SAMPLE

```json
{

}
```
:::
::::

:::::

## Update a user

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/users/:user_id HTTP/1.1
```

To update a user perform a PUT request to the `users` endpoint. With that request you can actually set up most of the settings for that user.

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request PUT 'https://api.vyte.in/v2/users/:user_id' \
--header 'Authorization: apiKey' \
```

:::

::: details RESPONSE SAMPLE

```json
{

}
```
:::
::::

:::::

## Create multiple users at once

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/users/batch HTTP/1.1
```

We provide a way to batch create users. It works almost in the same way that the `/api/v2` endpoint. 

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/users/batch' \
--header 'Authorization: apiKey' \
```

:::

::: details RESPONSE SAMPLE

```json
{

}
```
:::
::::

:::::

## Update multiple users at once

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/users HTTP/1.1
```

We provide a way to batch create users. It works almost in the same way that the `/api/v2` endpoint. 

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request PUT 'https://api.vyte.in/v2/users/batch' \
--header 'Authorization: apiKey' \
```

:::

::: details RESPONSE SAMPLE

```json
{

}
```
:::
::::

:::::
