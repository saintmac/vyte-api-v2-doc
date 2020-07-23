---
pageClass: reference-page
---

# Introduction

::::: panel

:::: left
We provide a full [REST API](https://fr.wikipedia.org/wiki/Representational_state_transfer) to allow developpers to integate Vyte into their application.

::: warning
The V2 of the API is in beta mode. Feel free to contact us via <intercom-button /> or via email at [support@vyte.in](mailto:support@vyte.in) if you find a problem or have any suggestions.
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

We use API keys to authenticate requests.

If you haven’t already, you will first have to [create an organization](https://www.vyte.in/settings/organization/setup). Then, you will be able to retrieve your key on the [API key tab](https://www.vyte.in/settings/organization/setup#api_key).

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

## Vyteme or not Vyteme ?

There is, in the `Event` object, a boolean named `vyteme`. To understand clearly what it means, we have to present the two way of using Vyte.

> TL;DR: in an event, if `vyteme` is set to true, you are in the booking page use case and the `created_by.user` is the `id` of the user who owns the Vyte Page; on the contrary, the `created_by.user` will be the `id` of the user who has created the event.

::::: panel

:::: left
### Vyte as a smart group scheduling tool

The first use case of Vyte is to allow a group of people to decide on dates and/or places to meet.

The idea is that one person will **create an event** and **invite people** to this event. Then, these invitees will have **to agree on a date and a place** for this event.

::: danger
In this case, what we called the *creator* (the person corresponding to created_by.user) of the event is the Vyte user who create the event.
:::

*Example: I want to organize a meeting with all the dev team to speak about a new feature. I will create a new event and invite the all team. Then, we will be able to vote for a date and a place for the meeting, and everybody will be informed about where and when we meet once the event is confirmed. So here, the `created_by.user` is mine.*

::::

:::: right

![alt text](https://assets.website-files.com/5ae6992ba0a8293227bae459/5af64961147ee3482e3bb284_VyteGroup.svg "Smart group scheduling")

::::

:::::

::::: panel

:::: left

![alt text](https://assets.website-files.com/5ae6992ba0a8293227bae459/5afc11d3bb0a6959e21ab60f_VytePage.svg "Booking page")

::::

:::: right

### Vyte as a booking page

The seconde use case of Vyte is to present a user availabilties to someone who wants to meet with him. **This is what we call a Vyteme/Booking Page**.

In this case, if someone want to meet with me, I will provide them with the link of my *Vyteme Page*. He will be able to see my availabilities, pick one or several and create an event.

So, here comes the `vyteme` term. In the following documentation, when the `vyteme` key of an `Event` object is set to `true`, that means we are in this use case.

::: danger
Here is the tricky part. When an event is a Vyteme event, **the creator is the person who owns the Vyteme Page**.
:::

*Example: as a Sales of the company, I want to meet with a new customer to make a demo of our product. I will send to him the link of my Vyte Page. The customer will be able to book a meeting according to his availabilities. Here, the `created_by.user` is the `id` of the Sales.*

::::

:::::

### To sum up

Here is a table to sum up the differences in the `Event` object between the two use cases :

|        Use case        | `vyteme` |                  `created_by.user`                  |
|:----------------------:|:--------:|:----------------------------------------------:|
|      Booking page      |  `true`  | The `id` of the user who has the booking page. |
| Smart group scheduling |  `false` |   The `id` of the user who create the event.   |
