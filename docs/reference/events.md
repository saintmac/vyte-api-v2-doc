# Events

You can use the `/v2/events` endpoints to manage the events for your organization.

::: warning
There is no DELETE endpoint provided for the Event API.
:::

## The event object

::::: panel
:::: left

<attributes title="Attributes">

<attribute name="confirmed" type="object">

The id of your your Organization. Found as `_id` when requesting your Organization.

<attributes isChild=true>
  <attribute name="flag" type="boolean" :parentNames="['confirmed']" isChild=true isLast=true>
    lorem
  </attribute>
</attributes>

</attribute>

<attribute name="created_by" type="object">

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

<attribute name="third_party" type="object" isLast=true>

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

> THE EVENT OBJECT

```json
{
  "confirmed":{
    "flag":true
  },
  "created_by":{
    "email":"user.name@domain.com"
  },
  "dates":[
    {
      "all_day":false,
      "date":"2017-11-10T11:00:00.000Z",
      "end_date":"2017-11-10T12:00:00.000Z"
    }
  ],
  "invitees":[
    {
      "full_name":"Person booking a slot name",
      "email":"jean.dupont@domain.com",
      "phone":"0601020304"
    }
  ],
  "lang":"fr",
  "locale":"fr",
  "messages":[
    {
      "body":"I’m booking appointment about this"
    }
  ],
  "places":[
    {
      "name":"Office name",
      "address":"12 rue de Rivoli, 75004, Paris, France"
    }
  ],
  "timezone":"Europe/Paris",
  "title":"Appointment about topic",
  "vyteme":true,
  "third_party":{
    "ct":"creator_token",
    "app":"app_id",
    "group_ids":[
      "user123",
      "group456",
      "companyABC"
    ]
  }
}
```

::::

:::::

## Retrieve the events

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/events HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/events' \
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

## Create an event

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/events HTTP/1.1
```

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

<attributes title="Query parameters">
  <attribute name="event_id" type="string" required=true>

Id of the event. Found as `_id` in event resources.

  </attribute>
  <attribute name="p" type="string">

Id of the place that you want to confirm. Found as the `_id` of the relevant date object in the `places` array property of the event. Optional if the event has only one place. If the event has more than one place and it is not provided the first place with more votes will be used.

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
POST /v2/events/:event_id/confirm HTTP/1.1
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
