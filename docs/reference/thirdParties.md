---
pageClass: reference-page
---

# Third-parties

::::: panel
:::: left
You can use the `/v2/third-parties` endpoints to manage the third-parties for your organization.
::::

:::: right

::: details THE THIRD-PARTY OBJECT

```json
{

}
```
:::

::::

:::::

## Retrieve the third-parties

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/third-parties HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/third-parties' \
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

## Create a third-party

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/third-parties HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/third-parties' \
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

## Generate a third-party token

::::: panel
:::: left

> ENDPOINT

```http
GET /v2/third-parties/token HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/third-parties/token' \
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