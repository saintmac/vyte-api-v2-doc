# Locators

::::: panel
:::: left
You can use the `/v2/locators` endpoints to manage the locators for your organization.
::::

:::: right

::: details THE LOCATOR OBJECT

```json
{

}
```
:::

::: details THE LOCATION OBJECT

```json
{

}
```
:::

::::

:::::

## Retrieve the locators

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/locators HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/locators' \
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

## Retrieve a locator

## Retrieve the locators

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/locators/:handle HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/locators/:handle' \
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


## Create a locator

## Retrieve the locators

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/locators HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/locators' \
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

## Delete a locator

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
DELETE /v2/locators/:handle HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request DELETE 'https://api.vyte.in/v2/locators/:hnadle' \
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

## Retrieve locator's locations

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/locators/:locator_id/locations HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/locators/:locator_id/locations' \
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


## Retrieve one locator's location

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/locators/:locator_id/locations/:location_id HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/locators/:locator_id/locations/:location_id' \
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

## Update one locator's location

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/locators/:locator_id/locations/:location_id HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request PUT 'https://api.vyte.in/v2/locators/:locator_id/locations/:location_id' \
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