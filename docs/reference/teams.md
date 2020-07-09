# Teams

::::: panel
:::: left
You can use the `/v2/teams` endpoints to manage the teams for your organization.
::::

:::: right

::: details THE TEAM OBJECT

```json
{

}
```
:::

::::

:::::

## Retrieve the teams

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/teams HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/teams' \
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

## Retrieve a team

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/teams/:team_id HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/teams/:team_id' \
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


## Create a team

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/teams HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/teams' \
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

## Update a team

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/teams/:team_id HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request PUT 'https://api.vyte.in/v2/teams/:team_id' \
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

## Delete a team
::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/teams/:team_id HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request PUT 'https://api.vyte.in/v2/teams/:team_id' \
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

## Get team's events

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/teams/:team_id/events HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request GET 'https://api.vyte.in/v2/teams/:team_id/events' \
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

## Create a team's event

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/teams/:team_id/events HTTP/1.1
```

::::

:::: right
::: details CODE SAMPLE

```shell
curl --location --request POST 'https://api.vyte.in/v2/teams/:team_id/events' \
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
