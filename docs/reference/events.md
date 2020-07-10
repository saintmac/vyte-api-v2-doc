# Events

::::: panel
:::: left
You can use the `/v2/events` endpoints to manage the events for your organization.

::: warning
There is no DELETE endpoint provided for the Event API.
:::

<attributes title="Attributes">
  <attribute name="id" type="string">
    The id of your your Organization. Found as _id when requesting your Organization.
  </attribute>
  <attribute name="user" type="object">
    lorem
  </attribute>
</attributes>

::::

:::: right

::: details THE EVENT OBJECT

```json
{

}
```

:::

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
  <attribute name="event_id" type="string" required="true">
Id of the event. Found as `_id` in event resources.

  </attribute>
</attributes>

<attributes title="Body parameters">
  <attribute name="dates" type="array" required="false">

array of the dates for that event. Existing dates will be replaced. Each array element should have the following format: `{date: string, end_date: string}` where date and end_date are iso representation of the new dates

  </attribute>
  <attribute name="places" type="array" required="false">

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
  <attribute name="event_id" type="string" required="true">

Id of the event. Found as `_id` in event resources.

  </attribute>
  <attribute name="p" type="string" required="false">

Id of the place that you want to confirm. Found as the `_id` of the relevant date object in the `places` array property of the event. Optional if the event has only one place. If the event has more than one place and it is not provided the first place with more votes will be used.

  </attribute>
</attributes>

<attributes title="Query parameters">
  <attribute name="d" type="string" required="false">

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
  <attribute name="event_id" type="string" required="true">
  
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
