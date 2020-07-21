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

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users" href="#list-all-users-linked-to-you-organization"></endpoint>
  <endpoint method="post" path="/v2/users" href="#create-a-user"></endpoint>
  <endpoint method="post" path="/v2/users/batch" href="#batch-create-users"></endpoint>
  <endpoint method="put" path="/v2/users" href="#update-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/batch" href="#batch-update-users"></endpoint>
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

<attribute name="emails" type="array of string">

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
  "emails": [
    "jean.dupont@example.com",
  ],
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
  },
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
curl --location --request GET 'https://api.vyte.in/v2/users' \
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
    "emails": [
      "jean.dupont@example.com",
    ],
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
    },
  }
]
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

<attribute name="organization" type="string" :isRequired=true>
Id of your organization.
</attribute>

<attribute name="user" type="hash" :isRequired=true>

Information about the user.

<attributes :isChild=true>

<attribute name="emails" type="string" :parentNames="['user']" :isChild=true>

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

</attributes>

::::

:::: right

> CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/users' \
--header 'Authorization: apiKey' \
```

> RESPONSE SAMPLE

```json
{
  "organization": "5ef0cb128f284274b2361323",
  "user": {
      "email": "gavecok307@inmail92.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "language": "fr",
      "timezone": "Europe/Paris",
      "picture_url": "https://www.example.com/picture/jean",
      "account": {
          "organization": {
              "extid": "123456"
          }
      }
  },
  "login": {
      "credentials": {
          "username": "gavecok307@inmail92.com",
          "password": "12345678"
      }
  }
}
```

::::

:::::

## Batch create users

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

## Batch update users

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
