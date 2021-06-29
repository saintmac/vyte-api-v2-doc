---
{ "pageClass": "reference-page" }
---

# Events

:::::panel

:::: left
You can use the `/v2/events` endpoints to manage the events for your organization.

::: warning
There is no DELETE endpoint provided for the Event API yet. Use the `/v2/events/:event_id/cancel` endpoint instead.
:::
::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/events" href="#list-all-events"></endpoint>
  <endpoint method="post" path="/v2/events" href="#create-an-event"></endpoint>
  <endpoint method="put" path="/v2/events/:event_id" href="#update-an-event"></endpoint>
  <endpoint method="post" path="/v2/events/:event_id/confirm" href="#confirm-an-event"></endpoint>
  <endpoint method="post" path="/v2/events/:event_id/cancel" href="#cancel-an-event"></endpoint>
  <endpoint method="post" path="/v2/events/:event_id/invitees" href="#add-invitees"></endpoint>
  <endpoint method="delete" path="/v2/events/:event_id/invitees/:invitee_id" href="#delete-invitee"></endpoint>
</endpoints>
::::

:::::

## The event object

::::: panel
:::: left

<attributes title="Attributes">

<attribute name="confirmed" type="hash">

Information about the status of the event.

<attributes isChild=true>
  <attribute name="flag" type="boolean" :parentNames="['confirmed']" isChild=true>

Whether or not the event is confirmed.

  </attribute>
  <attribute name="updated_at" type="date" :parentNames="['confirmed']" isChild=true>

Date the event was confirmed or canceled expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601).
  
  </attribute>
  <attribute name="date_id" type="string" :parentNames="['confirmed']" isChild=true>

`id` of the confirmed date for the event.

  </attribute>
  <attribute name="place_id" type="string" :parentNames="['confirmed']" isChild=true isLast=true>

`id` of the confirmed place for the event.

  </attribute>
</attributes>

</attribute>

<attribute name="created_by" type="hash">

Information about the user who creates the event. If it is a smart group scheduling event, the `created_by` is the user who creates the event; if it is a booking page event, the `created_by` is the user who exposed his availability.

<attributes isChild=true>
  <attribute name="email" type="string" :parentNames="['created_by']" isChild=true>
    The creator email.
  </attribute>

  <attribute name="user" type="string" :parentNames="['created_by']" isChild=true isLast=true>
    The creator id.
  </attribute>
</attributes>

</attribute>

<attribute name="dates" type="array of hashes">

Available dates for the event.

<attributes isChild=true>
  <attribute name="all_day" type="boolean" :parentNames="['dates']" isChild=true>
    Whether or not the event lasts all day long.
  </attribute>
  <attribute name="date" type="date" :parentNames="['dates']" isChild=true>

Starting date of the event. The date is expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601).

  </attribute>
  <attribute name="end_date" type="date" :parentNames="['dates']" isChild=true isLast=true>

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
  <attribute name="email" type="string" :parentNames="['invitees']" isChild=true>
    Email of the invitee.
  </attribute>
  <attribute name="phone" type="string" :parentNames="['invitees']" isChild=true>
    Phone number of the invitee.
  </attribute>
  <attribute name="user" type="string" :parentNames="['invitees']" isChild=true isLast=true>

If the invitee is an existing Vyte user, we automatically bind the invitee to the user through the `user_id`.

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

List of all messages sent on the event page.

<attributes isChild=true>
  <attribute name="created_by" type="hash" :parentNames="['messages']" isParentArray=true isChild=true>

Object referencing the message sender. It contains the `_id` of the user.

  </attribute>
  <attribute name="from" type="string" :parentNames="['messages']" isParentArray=true isChild=true>
    Email of the message sender.
  </attribute>
  <attribute name="body" type="string" :parentNames="['messages']" isParentArray=true isChild=true isLast=true>
    Body of the message.
  </attribute>
</attributes>

</attribute>

<attribute name="places" type="array of hashes">

Available places for the event.

<attributes isChild=true>
  <attribute name="name" type="string" :parentNames="['places']" isChild=true>
    Name of the places.
  </attribute>
  <attribute name="address" type="string" :parentNames="['places']" isChild=true isLast=true>

Address of the places. It can be a _url_, a _mailing address_, a _phone number_ or whatever you consider as a meeting place.

  </attribute>
</attributes>

</attribute>

<attribute name="timezone" type="string">

The event timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="title" type="string">
The event title.
</attribute>

<attribute name="vyteme" type="boolean">

Whether or not it is a `vyteme` event. If you need information about `vyteme` event, please check up the [introduction](README.md#vyteme-or-not-vyteme) part.

</attribute>

<attribute name="third_party" type="hash" isLast=true>

Information about third-party. Useful if the event was created thanks to the third-party API. For more informations, please check the [third-parties](./thirdParties.md) page.

<attributes isChild=true>
  <attribute name="ct" type="string" :parentNames="['third_party']" isChild=true>
    Creator token of the third-party.
  </attribute>
  <attribute name="app" type="string" :parentNames="['third_party']" isChild=true>
    Creator token of the third-party.
  </attribute>
  <attribute name="group_ids" type="array of strings" :parentNames="['third_party']" isChild=true isLast=true>
    List of groups to which you want to link the event.
  </attribute>
</attributes>

</attribute>

</attributes>

::::

:::: right

> THE EVENT OBJECT

```json light-code
{
  "confirmed": {
    "flag": true,
    "updated_at": "2020-08-31T09:22:37.910Z",
    "date_id": "5f4cc0d72285556ee2c6332d",
    "place_id": "5f4cc0d72285555c38c6332e"
  },
  "created_by": {
    "email": "user.name@domain.com"
  },
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
            "_id": "5f4cc0d72285556728c63330"
          }
        ],
        "no": []
      },
      "all_day": false,
      "confirmed": false,
      "confirmed_invitees": [],
      "_id": "5f4cc0d72285556ee2c6332d",
      "date": "2020-07-16T07:00:00.000Z",
      "end_date": "2020-07-16T08:00:00.000Z",
      "updatedAt": "2020-08-31T09:22:37.930Z",
      "createdAt": "2020-08-31T09:20:23.360Z"
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
            "_id": "5f4cc0d722855508bac63331"
          }
        ],
        "no": []
      },
      "all_day": false,
      "confirmed": false,
      "confirmed_invitees": [],
      "_id": "5f4cc0d72285557bfcc6332c",
      "date": "2020-07-16T13:00:00.000Z",
      "end_date": "2020-07-16T13:00:00.000Z",
      "updatedAt": "2020-08-31T09:22:37.930Z",
      "createdAt": "2020-08-31T09:20:23.360Z"
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
            "_id": "5f4cc0d72285550744c63332"
          }
        ],
        "no": []
      },
      "source": "app",
      "_id": "5f4cc0d72285555c38c6332e",
      "name": "Place for the meeting.",
      "updatedAt": "2020-08-31T09:22:37.930Z",
      "createdAt": "2020-08-31T09:20:23.360Z"
    }
  ],
  "invitees": [
    {
      "full_name": "Person booking a slot name",
      "email": "jean.dupont@domain.com",
      "phone": "0601020304"
    }
  ],
  "lang": "fr",
  "locale": "fr",
  "messages": [
    {
      "created_by": {
        "_id": "userId"
      },
      "from": "user@example.com",
      "body": "I’m booking appointment about this"
    }
  ],
  "timezone": "Europe/Paris",
  "title": "Appointment about topic",
  "vyteme": true,
  "third_party": {
    "ct": "creator_token",
    "app": "app_id",
    "group_ids": [
      "user123",
      "group456",
      "companyABC"
    ]
  }
}
```

::::

:::::

## List all events

:::::: panel
::::: left

List all the events that belong to your organization. You can filter those events using the parameters described below

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/events HTTP/1.1
```

<attributes title="Query parameters">
  <attribute name="limit" type="string">

Limits the number of events you want in return.

  </attribute>
  <attribute name="q" type="regex">

Search events by title using a regex.

  </attribute>
  <attribute name="filter" type="string">

Filter events by status. Value can be `confirmed` or `upcoming`.
*If no value is provided all events will be returned.*

  </attribute>

  <attribute name="creator_users" type="string">
    Returns events created by particular creators.
  </attribute>
  
 <attribute name="creator_emails" type="string" detail="ignored if creator_users set">
    Returns events created by particular creators, but search with emails.
  </attribute>
  
 <attribute name="invitee_users" type="string">
    Returns events with particular invitees. If there are several invitees in query, returns all events with these invitees.
  </attribute>
  
 <attribute name="invitee_emails" type="string" detail="ignored if invitee_users set">
    Returns events with particular invitees, but search with emails. You can use both `invitee_emails` and `invitee_users` parameters in the same query.
  </attribute>
  
 <attribute name="app_id" type="string">
    Returns events, which belongs to the particular third party application.
  </attribute>
  
 <attribute name="group_ids" type="string">
    Returns events of particular groups within one third party application.
  </attribute>
</attributes>

<returns title="Returns">

An array of `Event` objects. If no events match the query parameters, returns an empty array.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in//v2/events/?app_id=5f6b14c1282630001ceeb22f&group_ids=abc&creator_users=5f6b14c1282630001ceeb22a&invitee_emails=test1@mail.com&filter=confirmed' \
--header 'Authorization: 'jwut3wa4jp7xzdle57x5t0pr7f9xvwa8y2qd0lsongiruijdoc' \
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


## Create an event

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/events HTTP/1.1
```

<attributes title="Body parameters">

<attribute name="confirmed" type="hash">

Information about the status of the event.

<attributes isChild=true>
  <attribute name="flag" type="boolean" :parentNames="['confirmed']" isChild=true isLast=true>
    Whether or not the event is confirmed.
  </attribute>
</attributes>

</attribute>

<attribute name="created_by" type="hash" :required="true">

Information about the user who creates the event. If it is a smart group scheduling event, the `created_by` is the user who creates the event; if it is a booking page event, the `created_by` is the user who exposed his availability.

<attributes isChild=true>
  <attribute name="email" type="string" :parentNames="['created_by']" isChild=true :required="true" details="if no user id is provided">
    The creator email.
  </attribute>

  <attribute name="user" type="string" :parentNames="['created_by']" isChild=true isLast=true :required=true details="if no email is provided">
    The creator id.
  </attribute>
</attributes>

</attribute>

<attribute name="dates" type="array of hashes">

Available dates for the event. _If no dates are provided, the first user will be able to propose some dates._

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

Address of the places. It can be a _url_, a _mailing address_, a _phone number_ or whatever you consider as a meeting place.

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

Whether or not it is a `vyteme` event. If you need information about `vyteme` event, please check up the [introduction](README.md#vyteme-or-not-vyteme) part.
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
curl --request POST 'https://api.vyte.in/v2/events' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "First created event",
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
  "title": "First created event",
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

## Update an event

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/events/:event_id HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="event_id" type="string" required=true>

Id of the event you want to update. Found as `_id` in event resources.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty="true"/>

<attributes title="Body parameters">

<attribute name="dates" type="array of hashes">

Available dates for the event. _If no dates are provided, the first user will be able to propose some dates._

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

<attribute name="places" type="array of hashes">

Available places for the event.

<attributes isChild=true>
  <attribute name="name" type="string" :parentNames="['places']" isChild=true :required="true">
    Name of the places.
  </attribute>
  <attribute name="address" type="string" :parentNames="['places']" isChild=true isLast=true>

Address of the places. It can be a _url_, a _mailing address_, a _phone number_ or whatever you consider as a meeting place.

  </attribute>
</attributes>

</attribute>

</attributes>

<returns title="Returns">

An `Event` object if there is no error.

</returns>
::::

:::: right

> CODE SAMPLE

```shell
curl --request PUT 'https://api.vyte.in/v2/events/5f0d7eb02003d0971e2a961a' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "First created event (updated)",
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
    "flag": true,
    "updated_at": "2020-07-15T16:10:52.855Z",
    "date_id": "5f0d7eb02003d0174a2a961c",
    "place_id": "5f0d7eb02003d081072a961d"
  },
  "third_party": {
    "group_ids": []
  },
  "ics_sequence": 0,
  "version": 0,
  "group_pro": false,
  "identification_alternatives": [],
  "_id": "5f0d7eb02003d0971e2a961a",
  "title": "First created event (updated)",
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

## Confirm an event

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/events/:event_id/confirm HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="event_id" type="string" required=true>

Id of the event. Found as `_id` in event resources.

  </attribute>
</attributes>

<attributes title="Query parameters">
  <attribute name="d" type="string">

Id of the date that you want to confirm. Found as the `_id` of the relevant date object in the `dates` array property of the event. Optional if the event has only one date. If the event has more than one date and it is not provided the closest date with more votes will be used.

  </attribute>
  <attribute name="p" type="string" required="false">

Id of the place that you want to confirm. Found as the `_id` of the relevant date object in the `places` array property of the event. Optional if the event has only one place. If the event has more than one place and it is not provided the first place with more votes will be used.

  </attribute>
</attributes>

<returns title="Returns">

The `Event` object if there is no error.

</returns>
::::

:::: right

> CODE SAMPLE

```shell
curl  --request POST 'https://api.vyte.in/v2/events/5f0d7eb02003d0971e2a961a/confirm' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'
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
    "flag": true,
    "updated_at": "2020-07-15T16:10:52.855Z",
    "date_id": "5f0d7eb02003d0174a2a961c",
    "place_id": "5f0d7eb02003d081072a961d"
  },
  "third_party": {
    "group_ids": []
  },
  "ics_sequence": 0,
  "version": 0,
  "group_pro": false,
  "identification_alternatives": [],
  "_id": "5f0d7eb02003d0971e2a961a",
  "title": "First created event (updated)",
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

## Cancel an event

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/events/:event_id/cancel HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="event_id" type="string" required=true>
  
Id of the event. Found as `_id` in event resources.

  </attribute>
</attributes>

<returns title="Returns">

`OK` if there is no error.

</returns>
::::

:::: right

> CODE SAMPLE

```shell
curl  --request POST 'https://api.vyte.in/v2/events/5f0d7eb02003d0971e2a961a/cancel' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'
```

::::

:::::

## Add invitee(s)

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/events/:event_id/invitees HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="event_id" type="string" required=true>

Id of the event. Found as `_id` in event resources.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty="true"/>

<attributes title="Body parameters">

<attribute name="" type="array">

Takes array of invitees `email`, which should be added to the event.

  </attribute>
</attributes>

<returns title="Returns">

The `invitees` array if there is no error.

</returns>
::::

:::: right

> CODE SAMPLE

```shell
curl  --request POST 'https://api.vyte.in/v2/events/5f0d7eb02003d0971e2a961a/invitees' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'
--data-raw '[{
              "email": "newinviteetoadd@gmail.com"
              },
            {
              "email": "anotherinviteetoadd@mail.com"
              }]'
```

> RESPONSE SAMPLE

```json light-code

[
  {
    "created_by": { "user": "60db26c587f89b0021659a5c" },
    "star": false,
    "_id": "60db26c687f89b0021659a64",
    "email": "invitee1@gmail.com",
    "user": "60db26c587f89b0021659a5c" },

    {
    "created_by": { "user": "60db26c587f89b0021659a5c" },
    "star": false,
    "_id": "60db26d5d8f21a477b09538a",
    "email": "newinviteetoadd@gmail.com",
    "user": "60db26c6d8f21a74f4095363" },

    {
    "created_by": { "user": "60db26c587f89b0021659a5c" },
    "star": false,
    "_id": "60db26d5d8f21a030409538b",
    "email": "anotherinviteetoadd@mail.com",
    "user": "60db26d5d8f21a5adb09538c" },

]


```

::::

:::::

## Delete invitee

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/events/:event_id/invitees/:invitee_id HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="event_id" type="string" required=true>

Id of the event. Found as `_id` in event resources.

  </attribute>

  <attribute name="invitee_id" type="string" required=true>

Id of the invitee to delete. Attention: `invitee_id` and `user_id` are different things. You can access to `invitee_id` by `invitees[i]._id` and to invitee `user_id` by `invitees[i].user`.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty="true"/>

<attributes title="Body parameters" :isEmpty="true"/>

<returns title="Returns">

Returns `OK` if there is no error.

</returns>
::::

:::: right

> CODE SAMPLE

```shell
curl  --request POST 'https://api.vyte.in/v2/events/5f0d7eb02003d0971e2a961a/invitees/60db26c587f89b0021659a5c' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'

```

::::

:::::


