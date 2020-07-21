# Introduction

::::: panel

:::: left
We provide a full [REST API](https://fr.wikipedia.org/wiki/Representational_state_transfer) to allow developpers to integate Vyte into their application.

::: warning
The V2 of the API is in beta mode. Feel free to contact us via <intercom-button /> or via email at [support@vyte.in](support@vyte.in) if you find a problem or have any suggestions.
:::

::::

:::: right
> BASE URL

``` url
https://api.vyte.in/
```

::::

:::::

## Authentification

::::: panel

:::: left
We use API keys to authenticate requests. Each organization has one API key that you can find on your [Vyte Dashboard](https://www.vyte.in/settings/organization/setup#api_key).

::::

:::: right
> REQUEST EXAMPLE

``` shell
curl \
--request GET 'https://api.vyte.in/v2/events' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

::::

:::::
