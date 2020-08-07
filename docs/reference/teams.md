---
pageClass: reference-page
---

# Teams

::::: panel
:::: left
You can use the `/v2/teams` endpoints to manage the teams for your organization.
The `Team` object is really versatile so that you can represent all types of organizational structure, from structural to matrix structure.
That's why you can be admin of a team whereas you are not member of the team.
::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/teams" href="#list-all-teams"/>
  <endpoint method="get" path="/v2/teams/:team_id" href="#retrieve-a-team"/>
  <endpoint method="post" path="/v2/team" href="#create-a-team"/>
  <endpoint method="put" path="/v2/team/:team_id" href="#update-a-team"/>
  <endpoint method="delete" path="/v2/team/:team_id" href="#delete-a-team"/>
  <endpoint method="post" path="/v2/team/:team_id/events" href="#create-a-team-s-event"/>
  <endpoint method="get" path="/v2/team/:team_id/events" href="#list-all-team-s-event"/>
</endpoints>

::::

:::::

## The team object

::::: panel
:::: left

<attributes title="Attributes">
<attribute name="admins" type="array of string">

Array containing the `_id` of the admins of the team.

</attribute>

<attribute name="members" type="array of string">

Array containing the `_id` of the members of the team.

</attribute>

<attribute name="_id" type="string">

A unique identifier for the team.

</attribute>

<attribute name="organization" type="string">

The `_id` of the organization.

</attribute>

<attribute name="extid" type="string">

An external `id` set by yourself to identify the team on your side.

</attribute>

<attribute name="name" type="string">

The name of the team.

</attribute>

<attribute name="level_name" type="string">

The level name of the team.

</attribute>
</attributes>

::::

:::: right
> THE LOCATOR OBJECT

```json light-code light-code
{
  "admins": [
    "5f1077cf21f43b0b99660619"
  ],
  "members": [
    "5f1077cf21f43b0b99660619",
    "5f1077e1eaf7c424af51a847",
  ],
  "_id": "5ef9e5489b10b33ad0898ca3",
  "organization": "5ef0cb128f284274b2361323",
  "extid": "2",
  "name": "sales",
  "level_name": "agency",
}
```

::::

:::::

## List all teams

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/teams HTTP/1.1
```

<attributes title="Path parameters" :isEmpty=true />

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns an array of `Team` objects if there is some existing teams. Otherwise, returns an empty array.

</returns>

::::

:::: right
> CODE SAMPLE

```shell
curl --request GET 'https://api.vyte.in/v2/teams/' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
[
  {
    "admins": [
      "5f1077cf21f43b0b99660619"
    ],
    "members": [
      "5f1077cf21f43b0b99660619",
      "5f1077e1eaf7c424af51a847",
    ],
    "_id": "5ef9e5489b10b33ad0898ca3",
    "organization": "5ef0cb128f284274b2361323",
    "extid": "2",
    "name": "sales",
    "level_name": "agency",
  }
]
```

::::

:::::

## Retrieve a team

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/teams/:team_id HTTP/1.1
```

<attributes title="Path parameters"/>
<attribute name="team_id" type="string" :required=true>

The `_id` of the team.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns a `Team` object if a valid id was provided, and returns an error otherwise.

</returns>

::::

:::: right
> CODE SAMPLE

```shell
curl --request GET 'https://api.vyte.in/v2/teams/5ef9e5489b10b33ad0898ca3' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
{
  "admins": [
    "5f1077cf21f43b0b99660619"
  ],
  "members": [
    "5f1077cf21f43b0b99660619",
    "5f1077e1eaf7c424af51a847",
  ],
  "_id": "5ef9e5489b10b33ad0898ca3",
  "organization": "5ef0cb128f284274b2361323",
  "extid": "2",
  "name": "sales",
  "level_name": "agency",
}
```

::::

:::::

## Create a team

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/teams HTTP/1.1
```

<attributes title="Path parameters" :isEmpty=true />

<attributes title="Query parameters" :isEmpty=true />

<attributes title="Body parameters">
<attribute name="admins" type="array of string">

Array containing the `_id` of the admins of the team.

</attribute>

<attribute name="members" type="array of string">

Array containing the `_id` of the members of the team.

</attribute>

<attribute name="extid" type="string" :required=true>

An external `id` set by yourself to identify the team on your side.

</attribute>

<attribute name="name" type="string" :required=true>

The name of the team.

</attribute>

<attribute name="level_name" type="string">

The level name of the team.

</attribute>
</attributes>

<returns title="Returns">

Returns the created `Team` object if a valid body was provided, and returns an error otherwise.

</returns>

::::

:::: right

```shell
curl --location --request POST 'https://api.vyte.in/v2/teams' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
  "admins": [
    "5f1077cf21f43b0b99660619"
  ],
  "members": [
    "5f1077cf21f43b0b99660619",
    "5f1077e1eaf7c424af51a847",
  ],
  "organization": "5ef0cb128f284274b2361323",
  "extid": "2",
  "name": "sales",
  "level_name": "agency",
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "admins": [
    "5f1077cf21f43b0b99660619"
  ],
  "members": [
    "5f1077cf21f43b0b99660619",
    "5f1077e1eaf7c424af51a847",
  ],
  "_id": "5ef9e5489b10b33ad0898ca3",
  "organization": "5ef0cb128f284274b2361323",
  "extid": "2",
  "name": "sales",
  "level_name": "agency",
}
```

::::

:::::

## Udpate a team

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/teams/:team_id HTTP/1.1
```

<attributes title="Path parameters"/>
<attribute name="team_id" type="string" :required=true>

The `_id` of the team.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<attributes title="Body parameters">
<attribute name="admins" type="array of string">

Array containing the `_id` of the admins of the team.

</attribute>

<attribute name="members" type="array of string">

Array containing the `_id` of the members of the team.

</attribute>

<attribute name="extid" type="string">

An external `id` set by yourself to identify the team on your side.

</attribute>

<attribute name="name" type="string">

The name of the team.

</attribute>

<attribute name="level_name" type="string">

The level name of the team.

</attribute>
</attributes>

<returns title="Returns">

Returns the updated `Team` object if a valid body was provided, and returns an error otherwise.

</returns>

::::

:::: right

```shell
curl --location --request PUT 'https://api.vyte.in/v2/teams/5ef9e5489b10b33ad0898ca3' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
  "level_name": "company",
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "admins": [
    "5f1077cf21f43b0b99660619"
  ],
  "members": [
    "5f1077cf21f43b0b99660619",
    "5f1077e1eaf7c424af51a847",
  ],
  "_id": "5ef9e5489b10b33ad0898ca3",
  "organization": "5ef0cb128f284274b2361323",
  "extid": "2",
  "name": "sales",
  "level_name": "company",
}
```

::::

:::::

## Delete a team

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
DELETE /v2/teams/:team_id HTTP/1.1
```

<attributes title="Path parameters"/>
<attribute name="team_id" type="string" :required=true>

The `_id` of the team.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns an object containing the number of row affected and the status if there is no error, and returns an error otherwise.

</returns>

::::

:::: right

```shell
curl --request DELETE 'https://api.vyte.in/v2/teams/5ef9e5489b10b33ad0898ca3' \
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

## Create a team's event

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/teams/:team_id/events HTTP/1.1
```

<attributes title="Path parameters"/>
<attribute name="team_id" type="string" :required=true>

The `_id` of the team.

</attribute>
</attributes>

<attributes title="Body parameters">

<attribute name="confirmed" type="hash">

Information about the status of the event.

<attributes isChild=true>
  <attribute name="flag" type="boolean" :parentNames="['confirmed']" isChild=true isLast=true>
    Whether or not the event is confirmed.
  </attribute>
</attributes>

</attribute>

<attribute name="created_by" type="hash">

Information about the user who created the event. If it is a smart group scheduling event, the `created_by` is the user who create the event; if it is a booking page event, the `created_by` is the user who exposed his availability.

<attributes isChild=true>
  <attribute name="email" type="string" :parentNames="['created_by']" isChild=true isLast=true :required="true">
    The creator email.
  </attribute>
</attributes>

</attribute>

<attribute name="dates" type="array of hashes">

Available dates for the event. *If no dates are provided, the first user will be able to propose some dates.*

<attributes isChild=true>
  <attribute name="all_day" type="boolean" :parentNames="['dates']" isChild=true>
    Whether or not the event lasts all day long.
  </attribute>
  <attribute name="date" type="date" :parentNames="['dates']" isChild=true :required="true">

Starting date of the event. The date is expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601).

  </attribute>
  <attribute name="end_date" type="date" :parentNames="['dates']" isChild=true isLast=true :required="true">

Ending date of the event. The date is expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601).

  </attribute>
</attributes>

</attribute>

<attribute name="invitees" type="array of hashes">

Information about the invitees.

<attributes isChild=true>
  <attribute name="full_name" type="string" :parentNames="['invitees']" isChild=true>
    Full name of the invitee.
  </attribute>
  <attribute name="email" type="string" :parentNames="['invitees']" isChild=true :required="true">
    Email of the invitee.
  </attribute>
  <attribute name="phone" type="string" :parentNames="['invitees']" isChild=true>
    Phone number of the invitee.
  </attribute>
</attributes>

</attribute>

<attribute name="lang" type="string">

Language of the event. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="locale" type="string">

Locale of the event used for date formatting. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="messages" type="list of hashes">

You can provide a first message sent in the event conversation. Moreover, this message will be in the body of the first mail sent to the event invitees.

<attributes isChild=true>
  <attribute name="body" type="string" :parentNames="['messages']" isParentArray=true isChild=true isLast=true :required="true">
    Body of the message.
  </attribute>
</attributes>

</attribute>

<attribute name="places" type="array of hashes">

Available places for the event.

<attributes isChild=true>
  <attribute name="name" type="string" :parentNames="['places']" isChild=true :required="true">
    Name of the places.
  </attribute>
  <attribute name="address" type="string" :parentNames="['places']" isChild=true isLast=true>

Address of the places. It can be a *url*, a *mailing address*, a *phone number* or whatever you consider as a meeting place.

  </attribute>
</attributes>

</attribute>

<attribute name="timezone" type="string">

The event timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="title" type="string" :required="true">
The event title.
</attribute>

<attribute name="vyteme" type="boolean">

Whether or not it is a `vyteme` event. If you need information about `vyteme` event, please check up the [introduction](/reference/) part.
Default is `false`.

</attribute>

</attributes>

<returns title="Returns">

An `Event` object if there is no error.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request POST 'https://api.vyte.in/v2/teams/5ef9e5489b10b33ad0898ca3/events' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "First team event",
    "created_by": {
        "email": "creator@example.com"
    },
    "dates": [
        {
            "all_day": false,
            "date": "2020-07-16T09:00:00",
            "end_date": "2020-07-16T10:00:00"
        },
        {
            "all_day": false,
            "date": "2020-07-16T14:00:00+0100",
            "end_date": "2020-07-16T15:00:00"
        }
    ],
    "places": [
        {
            "name": "Place for the meeting."
        }
    ]
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "created_by": {
    "email": "creator@example.com",
    "user": "5eecc40bb2181073ac6ff375",
    "picture_url": "",
    "full_name": "Jean Dupont"
  },
  "confirmed": {
    "flag": false,
    "updated_at": null,
    "multi": false
  },
  "third_party": {
    "group_ids": []
  },
  "ics_sequence": 0,
  "version": 0,
  "group_pro": false,
  "identification_alternatives": [],
  "_id": "5f0d7eb02003d0971e2a961a",
  "title": "First team event",
  "dates": [
    {
      "created_by": {
        "user": "5eecc40bb2181073ac6ff375"
      },
      "votes": {
        "yes": [
          {
            "created_by": {
              "user": "5eecc40bb2181073ac6ff375"
            },
            "_id": "5f0d7eb02003d04dab2a961f"
          }
        ],
        "no": []
      },
      "all_day": false,
      "confirmed": false,
      "confirmed_invitees": [],
      "_id": "5f0d7eb02003d0174a2a961c",
      "date": "2020-07-16T07:00:00.000Z",
      "end_date": "2020-07-16T08:00:00.000Z",
      "updatedAt": "2020-07-14T09:45:20.862Z",
      "createdAt": "2020-07-14T09:45:20.862Z"
    },
    {
      "created_by": {
        "user": "5eecc40bb2181073ac6ff375"
      },
      "votes": {
        "yes": [
          {
            "created_by": {
              "user": "5eecc40bb2181073ac6ff375"
            },
            "_id": "5f0d7eb02003d04ac22a9620"
          }
        ],
        "no": []
      },
      "all_day": false,
      "confirmed": false,
      "confirmed_invitees": [],
      "_id": "5f0d7eb02003d04b512a961b",
      "date": "2020-07-16T13:00:00.000Z",
      "end_date": "2020-07-16T13:00:00.000Z",
      "updatedAt": "2020-07-14T09:45:20.862Z",
      "createdAt": "2020-07-14T09:45:20.862Z"
    }
  ],
  "places": [
    {
      "created_by": {
        "user": "5eecc40bb2181073ac6ff375"
      },
      "votes": {
        "yes": [
          {
            "created_by": {
              "user": "5eecc40bb2181073ac6ff375"
            },
            "_id": "5f0d7eb02003d05ff72a9621"
          }
        ],
        "no": []
      },
      "source": "app",
      "_id": "5f0d7eb02003d081072a961d",
      "name": "Place for the meeting.",
      "updatedAt": "2020-07-14T09:45:20.862Z",
      "createdAt": "2020-07-14T09:45:20.862Z"
    }
  ],
  "api": true,
  "invitees": [
    {
      "created_by": {
        "user": "5eecc40bb2181073ac6ff375"
      },
      "stats": {
        "voted": {
          "dates": true,
          "places": true
        }
      },
      "star": false,
      "_id": "5f0d7eb02003d097742a961e",
      "email": "creator@example.com",
      "user": "5eecc40bb2181073ac6ff375",
      "su": true,
      "full_name": "Jean Dupont",
      "picture_url": "",
      "timezone": "Europe/Paris",
      "locale": "fr"
    }
  ],
  "messages": [],
  "declines": [],
  "lang": "en",
  "locale": "en",
  "updatedAt": "2020-07-14T09:45:20.862Z",
  "createdAt": "2020-07-14T09:45:20.862Z",
  "invitees_length": 1,
  "email": "reply-to-participants-to-first-created-event-atpcovzku@vytein.mailgun.org",
  "key_store": {
    "_id": "5f0d7eb02003d0f6e32a9622",
    "hash": {
      "5eecc40bb2181073ac6ff375": "a2nv79gx86d5i0o3"
    },
    "updatedAt": "2020-07-14T09:45:20.870Z",
    "createdAt": "2020-07-14T09:45:20.870Z",
    "__v": 0
  },
  "links": null,
  "__v": 0
}
```

::::

:::::

## List all team's events

List all the events in which team members are involved to (as an administrator or an invitee).

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/teams/:team_id/events HTTP/1.1
```

<attributes title="Path parameters"/>
<attribute name="team_id" type="string" :required=true>

The `_id` of the team.

</attribute>
</attributes>

<attributes title="Query parameters">
  <attribute name="limit" type="string">

Limits the number of events you want in return.

  </attribute>
  <attribute name="q" type="regex">

Search events by title using a regex.

  </attribute>
  <attribute name="filter" type="string">

Filter events by status. Value can be `confirmed` or `upcoming`.

  </attribute>
</attributes>

<returns title="Returns">

An array of `Event` objects. If there is no events available, return an empty array.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/teams/5ef9e5489b10b33ad0898ca3/events' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
[
    {
        "_id": "569c3b6105dc780300951bd0",
        "key_store": "569c3b6105dc780300951bd7",
        "email": "reply-to-participants-to-meeting-for-project-vqdhhcxqd@vyte.in",
        "invitees_length": 3,
        "createdAt": "2016-01-18T01:09:53.477Z",
        "updatedAt": "2016-01-18T01:10:05.670Z",
        "alias": "alias_web_522984fb35eaa70200000007_1453079356811",
        "app_url": "https://www.vyte.in",
        "lang": "en",
        "locale": "en",
        "timezone": "Europe/Paris",
        "title": "Meeting for project",
        "__v": 3,
        "version": 3,
        "third_party": {
            "app": "569c2e2fa28cc30300778c4c",
            "group_ids": ["project_85fc5"],
            "name": "superapp"
        },
        "ics_sequence": 0,
        "confirmed": {
            "updated_at": null,
            "flag": false
        },
        "places": [
            {
                "createdAt": "2016-01-18T01:09:53.290Z",
                "updatedAt": "2016-01-18T01:10:05.665Z",
                "name": "Appear.in",
                "address": "http://appear.in/cool-meeting",
                "icon": "P",
                "_id": "569c3b6105dc780300951bd3",
                "votes": {
                    "no": [],
                    "yes": [
                        {
                            "_id": "569c3b6105dc780300951bd6",
                            "createdAt": "2016-01-18T01:09:54.161Z",
                            "updatedAt": "2016-01-18T01:10:05.664Z",
                            "created_by": {
                                "user": "522984fb35eaa70200000007"
                            }
                        }
                    ]
                },
                "created_by": {
                    "user": "522984fb35eaa70200000007"
                },
                "source": "Appear.in"
            }
        ],
        "dates": [
            {
                "createdAt": "2016-01-18T01:10:05.665Z",
                "updatedAt": "2016-01-18T01:10:05.665Z",
                "date": "2016-01-22T10:00:00.000Z",
                "end_date": "2016-01-22T11:00:00.000Z",
                "_id": "569c3b6da28cc30300778c72",
                "votes": {
                    "no": [],
                    "yes": [
                        {
                            "_id": "569c3b6da28cc30300778c74",
                            "created_by": {
                                "user": "522984fb35eaa70200000007"
                            }
                        }
                    ]
                },
                "created_by": {
                    "user": "522984fb35eaa70200000007"
                },
                "all_day": false
            },
            {
                "createdAt": "2016-01-18T01:10:05.665Z",
                "updatedAt": "2016-01-18T01:10:05.665Z",
                "date": "2016-01-22T15:00:00.000Z",
                "end_date": "2016-01-22T16:00:00.000Z",
                "_id": "569c3b6da28cc30300778c73",
                "votes": {
                    "no": [],
                    "yes": [
                        {
                            "_id": "569c3b6da28cc30300778c76",
                            "created_by": {
                                "user": "522984fb35eaa70200000007"
                            }
                        }
                    ]
                },
                "created_by": {
                    "user": "522984fb35eaa70200000007"
                },
                "all_day": false
            }
        ],
        "declines": [],
        "messages": [
            {
                "from": "martin.saintmac@gmail.com",
                "createdAt": "2016-01-18T01:09:53.290Z",
                "updatedAt": "2016-01-18T01:10:05.664Z",
                "body": "Another meeting for that project",
                "_id": "569c3b6105dc780300951bd4",
                "created_by": {
                    "user": "522984fb35eaa70200000007"
                }
            }
        ],
        "invitees": [],
        "created_by": {
            "full_name": "Martin Saint-Macary",
            "picture_url": "https://lh3.googleusercontent.com/-PWeG6KmcyVw/AAAAAAAAAAI/AAAAAAAAJa4/kcQXhsmUmTQ/photo.jpg",
            "user": "522984fb35eaa70200000007",
            "email": "martin.saintmac@gmail.com"
        }
    },
    {
        "_id": "569c3afaa28cc30300778c69",
        "key_store": "569c3afba28cc30300778c71",
        "email": "reply-to-participants-to-meeting-martin-saint-macary-martin-saint-macary-awtdmgsnm@vyte.in",
        "invitees_length": 2,
        "createdAt": "2016-01-18T01:08:11.524Z",
        "updatedAt": "2016-01-18T01:08:12.691Z",
        "alias": "alias_web_522984fb35eaa70200000007_1453079284514",
        "app_url": "https://www.vyte.in",
        "lang": "en",
        "locale": "en",
        "timezone": "Europe/Paris",
        "title": "Meeting Martin Saint-Macary, Martin Saint-Macary",
        "__v": 1,
        "version": 1,
        "third_party": {
            "app": "569c2e2fa28cc30300778c4c",
            "group_ids": ["project_85fc5"],
            "name": "superapp"
        },
        "ics_sequence": 0,
        "confirmed": {
            "updated_at": null,
            "flag": false
        },
        "places": [
            {
                "createdAt": "2016-01-18T01:08:10.933Z",
                "updatedAt": "2016-01-18T01:08:12.688Z",
                "name": "Skype",
                "address": "martin.saint-macary",
                "_id": "569c3afaa28cc30300778c6c",
                "votes": {
                    "no": [],
                    "yes": [
                        {
                            "_id": "569c3afba28cc30300778c6f",
                            "createdAt": "2016-01-18T01:08:12.688Z",
                            "updatedAt": "2016-01-18T01:08:12.688Z",
                            "created_by": {
                                "user": "522984fb35eaa70200000007"
                            }
                        }
                    ]
                },
                "created_by": {
                    "user": "522984fb35eaa70200000007"
                },
                "source": "app"
            },
            {
                "createdAt": "2016-01-18T01:08:10.934Z",
                "updatedAt": "2016-01-18T01:08:12.689Z",
                "name": "Google Hangouts",
                "address": "martin@vytein.com",
                "_id": "569c3afaa28cc30300778c6b",
                "votes": {
                    "no": [],
                    "yes": [
                        {
                            "_id": "569c3afba28cc30300778c70",
                            "createdAt": "2016-01-18T01:08:12.688Z",
                            "updatedAt": "2016-01-18T01:08:12.688Z",
                            "created_by": {
                                "user": "522984fb35eaa70200000007"
                            }
                        }
                    ]
                },
                "created_by": {
                    "user": "522984fb35eaa70200000007"
                },
                "source": "app"
            }
        ],
        "dates": [],
        "declines": [],
        "messages": [
            {
                "from": "martin.saintmac@gmail.com",
                "createdAt": "2016-01-18T01:08:10.934Z",
                "updatedAt": "2016-01-18T01:08:12.688Z",
                "body": "Hi Martin, please find my suggestions for our 15 min call setup session on vyte.in. Best",
                "_id": "569c3afaa28cc30300778c6d",
                "created_by": {
                    "user": "522984fb35eaa70200000007"
                }
            }
        ],
        "invitees": [],
        "created_by": {
            "full_name": "Martin Saint-Macary",
            "picture_url": "https://lh3.googleusercontent.com/-PWeG6KmcyVw/AAAAAAAAAAI/AAAAAAAAJa4/kcQXhsmUmTQ/photo.jpg",
            "user": "522984fb35eaa70200000007",
            "email": "martin.saintmac@gmail.com"
        }
    }
]
```

:::::

::::::
