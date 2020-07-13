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
  <attribute name="flag" type="boolean" :parentNames="['confirmed']" isChild=true isLast=true>
    Whether or not the event is confirmed.
  </attribute>
</attributes>

</attribute>

<attribute name="created_by" type="hash">

Information about the user who created the event. If it is a smart group scheduling event, the `created_by` is the user who create the event; if it is a booking page event, the `created_by` is the user who exposed his availability.

<attributes isChild=true>
  <attribute name="email" type="string" :parentNames="['created_by']" isChild=true isLast=true>
    The creator email.
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

Address of the places. It can be a *url*, a *mailing address*, a *phone number* or whatever you consider as a meeting place.

  </attribute>
</attributes>

<attribute name="timezone" type="string">

The event timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>

<attribute name="title" type="string">
The event title.
</attribute>

<attribute name="vyteme" type="boolean">

Whether or not it is a `vyteme` event. If you need information about `vyteme` event, please check up the [introduction](/reference/) part.

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

</attribute>

</attributes>

::::

:::: right

> THE EVENT OBJECT

```json light-code
{
  "confirmed": {
    "flag": true
  },
  "created_by": {
    "email": "user.name@domain.com"
  },
  "dates": [
    {
      "all_day": false,
      "date": "2017-11-10T11:00:00.000Z",
      "end_date": "2017-11-10T12:00:00.000Z"
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
      "body": "I’m booking appointment about this",
    }
  ],
  "places": [
    {
      "name": "Office name",
      "address": "12 rue de Rivoli, 75004, Paris, France"
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

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/events HTTP/1.1
```

:::::

::::: right

:::: tabs type:card
::: tab cURL

```shell
curl \
--request GET 'https://api.vyte.in/v2/events' \
--header 'Authorization: apiKey' \
```

:::
::::

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

<attributes title="Body">

<attribute name="confirmed" type="hash">

The id of your your Organization. Found as `_id` when requesting your Organization.

<attributes isChild=true>
  <attribute name="flag" type="boolean" :parentNames="['confirmed']" isChild=true isLast=true>
    lorem
  </attribute>
</attributes>

</attribute>

<attribute name="created_by" type="hash">

The id of your your Organization. Found as `_id` when requesting your Organization.

<attributes isChild=true>
  <attribute name="email" type="string" :parentNames="['created_by']" isChild=true isLast=true>
    lorem
  </attribute>
</attributes>

</attribute>

<attribute name="dates" type="array">

The id of your your Organization. Found as `_id` when requesting your Organization.

<attributes isChild=true>
  <attribute name="all_day" type="boolean" :parentNames="['dates']" isParentArray=true isChild=true>
    lorem
  </attribute>
  <attribute name="date" type="date" :parentNames="['dates']" isParentArray=true isChild=true>
    lorem
  </attribute>
  <attribute name="end_date" type="date" :parentNames="['dates']" isParentArray=true isChild=true isLast=true>
    lorem
  </attribute>
</attributes>

</attribute>

<attribute name="invitees" type="array">

The id of your your Organization. Found as `_id` when requesting your Organization.

<attributes isChild=true>
  <attribute name="full_name" type="string" :parentNames="['invitees']" isParentArray=true isChild=true>
    lorem
  </attribute>
  <attribute name="email" type="string" :parentNames="['invitees']" isParentArray=true isChild=true>
    lorem
  </attribute>
  <attribute name="phone" type="string" :parentNames="['invitees']" isParentArray=true isChild=true isLast=true>
    lorem
  </attribute>
</attributes>

</attribute>

<attribute name="lang" type="string">
The event language.
</attribute>

<attribute name="locale" type="string">
The event locale.
</attribute>

<attribute name="messages" type="array">

The id of your your Organization. Found as `_id` when requesting your Organization.

<attributes isChild=true>
  <attribute name="body" type="string" :parentNames="['messages']" isParentArray=true isChild=true isLast=true>
    lorem
  </attribute>
</attributes>

</attribute>

<attribute name="places" type="array">

The id of your your Organization. Found as `_id` when requesting your Organization.

<attributes isChild=true>
  <attribute name="name" type="string" :parentNames="['places']" isParentArray=true isChild=true>
    lorem
  </attribute>
  <attribute name="address" type="string" :parentNames="['places']" isParentArray=true isChild=true isLast=true>
    lorem
  </attribute>
</attributes>

<attribute name="timezone" type="string">
The event timezone.
</attribute>

<attribute name="title" type="string">
The event title.
</attribute>

<attribute name="vyteme" type="boolean">
True if it's a vyteme event.
</attribute>

<attribute name="third_party" type="hash" isLast=true>

The id of your your Organization. Found as `_id` when requesting your Organization.

<attributes isChild=true>
  <attribute name="ct" type="string" :parentNames="['third_party']" isChild=true>
    lorem
  </attribute>
  <attribute name="app" type="string" :parentNames="['third_party']" isChild=true>
    lorem
  </attribute>
  <attribute name="group_ids" type="array" :parentNames="['third_party']" isChild=true isLast=true>
    <attributes isChild=true>
      <attribute name="ids" type="string" :parentNames="['third_party', 'group_ids']" isChild=true isLast=true>
        lorem
      </attribute>
    </attributes>
  </attribute>
</attributes>

</attribute>

</attribute>

</attributes>
::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/events' \
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

## Update an event

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/events/:event_id HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="event_id" type="string" required=true>
Id of the event. Found as `_id` in event resources.

  </attribute>
</attributes>

<attributes title="Body parameters">
  <attribute name="dates" type="array">

array of the dates for that event. Existing dates will be replaced. Each array element should have the following format: `{date: string, end_date: string}` where date and end_date are iso representation of the new dates

  </attribute>
  <attribute name="places" type="array">

array of places for that event. Existing places will be replaced

  </attribute>
</attributes>

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request PUT 'https://api.vyte.in/v2/events/:event_id' \
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

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/events/:event_id/confirm' \
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

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/events/:event_id/cancel' \
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
