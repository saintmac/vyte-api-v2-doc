# Events

::::: panel
:::: left
You can use the `/v2/events` endpoints to manage the events for your organization.

::: warning
There is no DELETE endpoint provided for the Event API.
:::

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

### Path parameters

Parameter | Type | Required | Description
--------- | ---- | -------- | -----------
`:event_id` | string |**true** | Id of the event. Found as `_id` in event resources.

### Body parameters

Parameter | Type | Required | Description
--------- | ---- | -------- | -----------
`dates` | array |**false** | array of the dates for that event. Existing dates will be replaced. Each array element should have the following format: {date: string, end_date: string} where date and end_date are iso representation of the new dates
`places` | array |**false** | array of places for that event. Existing places will be replaced

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

### Path parameters

Parameter | Type | Required | Description
--------- | ---- | -------- | -----------
`:event_id` | string |**true** | Id of the event. Found as `_id` in event resources.

### Query parameters

Parameter | Type | Required | Description
--------- | ---- | -------- | -----------
`d` | string |**false** | Id of the date that you want to confirm. Found as the `_id` of the relevant date object in the `dates` array property of the event. Optional if the event has only one date. If the event has more than one date and it is not provided the closest date with more votes will be used.
`p` | string |**false** | Id of the place that you want to confirm. Found as the `_id` of the relevant date object in the `places` array property of the event. Optional if the event has only one place. If the event has more than one place and it is not provided the first place with more votes will be used.

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

### Path parameters

Parameter | Type | Required | Description
--------- | ---- | -------- | -----------
`:event_id` | string |**true** | Id of the event. Found as `_id` in event resources.

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