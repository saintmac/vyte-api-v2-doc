---
{
  "pageClass": "reference-page"
}
---

# Team admin preferences

:::::panel

:::: left

You can use the `/v2/teams/:team_id/admin-preferences` endpoints to manage the administrative preferences of the team.

> This API is an extension of the Team API, that's why all url are prefixed with `/teams/:team_id/`. You can refer to the [Teams API reference](teams.md) to have more informations about teams creation.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/teams/:team_id/admin-preferences" href="#retrieve-admin-preferences"></endpoint>
  <endpoint method="post" path="/v2/teams/:team_id/admin-preferences" href="#create-admin-preferences"></endpoint>
  <endpoint method="put" path="/v2/teams/:team_id/admin-preferences" href="#update-admin-preferences"></endpoint>
  
</endpoints>
::::

## The Admin preferences object

::::: panel
:::: left

<attributes title="Attributes">

<attribute name="Belongs_to" type="ObjectId">

The `id` of Team connected with this Admin preferences.

</attribute>

<attribute name="Prefs" type="Object">

The object, which contains the particular settings and preferences.

</attribute>

<attribute name="email" type="Object">
  
The email object contains particular email settings for the team
  
</attribute>

<attributes :isChild=true>
<attribute name="attending" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get mails about visitors attending events of the team.
  
</attribute>

<attribute name="declined" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get mails about visitors declined events of the team.
  
</attribute>

<attribute name="event_cancelled" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get mails about events cancelled by others.
  
</attribute>

<attribute name="event_cancelled_admin" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get mails about events created and cancelled by your team.
  
</attribute>

<attribute name="event_confirmed" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get mails about events confirmed by others.
  
</attribute>

<attribute name="event_confirmed_admin" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get mails about events created and confirmed by your team.
  
</attribute>

<attribute name="new_event" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get mails about new events created by others.
  
</attribute>

<attribute name="new_event_admin" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get mails about new events created by your team.
  
</attribute>

<attribute name="new_message" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get messages of others about events you participate in or created.
  
</attribute>

<attribute name="new_suggestion" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get suggestions of others about your events.
  
</attribute>

<attribute name="new_suggestion_own" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get suggestions made by you.
  
</attribute>

<attribute name="vote_update" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get mails of people votes about your events.
  
</attribute>

<attribute name="vote_confirmation" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get confirmations of your votes.
  
</attribute>

<attribute name="vyteme_created_admin" type="boolean" :parentNames="['email']" :isChild=true>
  
This setting allows to get notifications when the event is created from your Vyteme page.
  
</attribute>
</attributes>
</attributes>


::::

:::: right

> THE ADMIN PREFERENCES OBJECT

```json light-code
{
  prefs: {
    email: {
      attending: true,
      declined: true,
      event_cancelled: true,
      event_cancelled_admin: true,
      event_confirmed: true,
      event_confirmed_admin: false,
      new_event: false,
      new_event_admin: false,
      new_message: false,
      new_suggestion: false,
      new_suggestion_own: false,
      vote_update: false,
      vote_confirmation: false,
      vyteme_created_admin: false
    }
  },
_id: 5fbd38e7198731eeaf57e4cb,
belongs_to: 5fbd38e7a6bb1d001c11863a,
updatedAt: 2020-11-24T16:46:31.666Z,
createdAt: 2020-11-24T16:46:31.666Z,
__v: 0
}

```

::::

:::::

## Retrieve the admin preferences for the team

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/teams/:team_id/admin-preferences HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="team_id" type="string">

The `_id`of the team.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<returns title="Returns">

The `admin-preferences` of the particular team.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/teams/5fbd38e7a6bb1d001c11863a/admin-preference' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
{
  prefs: {
    email: {
      attending: true,
      declined: true,
      event_cancelled: true,
      event_cancelled_admin: true,
      event_confirmed: true,
      event_confirmed_admin: false,
      new_event: false,
      new_event_admin: false,
      new_message: false,
      new_suggestion: false,
      new_suggestion_own: false,
      vote_update: false,
      vote_confirmation: false,
      vyteme_created_admin: false
    }
  },
_id: 5fbd38e7198731eeaf57e4cb,
belongs_to: 5fbd38e7a6bb1d001c11863a,
updatedAt: 2020-11-24T16:46:31.666Z,
createdAt: 2020-11-24T16:46:31.666Z,
__v: 0
}

```

:::::

::::::

## Create an admin preferences

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/teams/5fbd38e7a6bb1d001c11863a/admin-preferences HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="team_id" type="string">

The `_id`of the team.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<attributes title="Body parameters">
  
  <attribute name="attending" type="boolean">
  
This setting allows to get mails about visitors attending events of the team.
  
</attribute>

<attribute name="declined" type="boolean">
  
This setting allows to get mails about visitors declined events of the team.
  
</attribute>

<attribute name="event_cancelled" type="boolean">
  
This setting allows to get mails about events cancelled by others.
  
</attribute>

<attribute name="event_cancelled_admin" type="boolean">
  
This setting allows to get mails about events created and cancelled by your team.
  
</attribute>

<attribute name="event_confirmed" type="boolean">
  
This setting allows to get mails about events confirmed by others.
  
</attribute>

<attribute name="event_confirmed_admin" type="boolean">
  
This setting allows to get mails about events created and confirmed by your team.
  
</attribute>

<attribute name="new_event" type="boolean">
  
This setting allows to get mails about new events created by others.
  
</attribute>

<attribute name="new_event_admin" type="boolean">
  
This setting allows to get mails about new events created by your team.
  
</attribute>

<attribute name="new_message" type="boolean">
  
This setting allows to get messages of others about events you participate in or created.
  
</attribute>

<attribute name="new_suggestion" type="boolean">
  
This setting allows to get suggestions of others about your events.
  
</attribute>

<attribute name="new_suggestion_own" type="boolean">
  
This setting allows to get suggestions made by you.
  
</attribute>

<attribute name="vote_update" type="boolean">
  
This setting allows to get mails of people votes about your events.
  
</attribute>

<attribute name="vote_confirmation" type="boolean">
  
This setting allows to get confirmations of your votes.
  
</attribute>

<attribute name="vyteme_created_admin" type="boolean">
  
This setting allows to get notifications when the event is created from your Vyteme page.
  
</attribute>
</attributes>

 <returns title="Returns">

The created `Admin preferences` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request POST 'https://api.vyte.in/v2/teams/5fbe426b28fd0e0016ca3ff5/admin-preferences' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '
    {
      prefs: {
        email: {
          attending: true,
          declined: true,
          event_cancelled: true,
          event_cancelled_admin: true,
          event_confirmed: true,
          new_event: true
        }
    }
}'
```

> RESPONSE SAMPLE

```json light-code
{
  prefs: {
    email: {
      attending: true,
      declined: true,
      event_cancelled: true,
      event_cancelled_admin: true,
      event_confirmed: true,
      event_confirmed_admin: false,
      new_event: true,
      new_event_admin: false,
      new_message: false,
      new_suggestion: false,
      new_suggestion_own: false,
      vote_update: false,
      vote_confirmation: false,
      vyteme_created_admin: false
    }
  },
_id: 5fbd38e7198731eeaf57e4cb,
belongs_to: 5fbd38e7a6bb1d001c11863a,
updatedAt: 2020-11-24T16:46:31.666Z,
createdAt: 2020-11-24T16:46:31.666Z,
__v: 0
}

```

:::::

::::::

## Update the admin preferences of the team

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2//v2/teams/5fbe426b28fd0e0016ca3ff5/admin-preferences HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="team_id" type="string">

The `_id`of the team.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<attributes title="Body parameters">
  
  <attribute name="attending" type="boolean">
  
This setting allows to get mails about visitors attending events of the team.
  
</attribute>

<attribute name="declined" type="boolean">
  
This setting allows to get mails about visitors declined events of the team.
  
</attribute>

<attribute name="event_cancelled" type="boolean">
  
This setting allows to get mails about events cancelled by others.
  
</attribute>

<attribute name="event_cancelled_admin" type="boolean">
  
This setting allows to get mails about events created and cancelled by your team.
  
</attribute>

<attribute name="event_confirmed" type="boolean">
  
This setting allows to get mails about events confirmed by others.
  
</attribute>

<attribute name="event_confirmed_admin" type="boolean">
  
This setting allows to get mails about events created and confirmed by your team.
  
</attribute>

<attribute name="new_event" type="boolean">
  
This setting allows to get mails about new events created by others.
  
</attribute>

<attribute name="new_event_admin" type="boolean">
  
This setting allows to get mails about new events created by your team.
  
</attribute>

<attribute name="new_message" type="boolean">
  
This setting allows to get messages of others about events you participate in or created.
  
</attribute>

<attribute name="new_suggestion" type="boolean">
  
This setting allows to get suggestions of others about your events.
  
</attribute>

<attribute name="new_suggestion_own" type="boolean">
  
This setting allows to get suggestions made by you.
  
</attribute>

<attribute name="vote_update" type="boolean">
  
This setting allows to get mails of people votes about your events.
  
</attribute>

<attribute name="vote_confirmation" type="boolean">
  
This setting allows to get confirmations of your votes.
  
</attribute>

<attribute name="vyteme_created_admin" type="boolean">
  
This setting allows to get notifications when the event is created from your Vyteme page.
  
</attribute>
</attributes>

 <returns title="Returns">

The updated `Admin preferences` object if no error occurred.

</returns>

:::::

::::: right

> CODE SAMPLE

```shell
curl --request PUT 'https://api.vyte.in/v2/teams/5fbe426b28fd0e0016ca3ff5/admin-preferences' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '
 {
      prefs: {
        email: {
          attending: true,
          declined: true,
          event_cancelled: true,
           event_cancelled_admin: true,
          event_confirmed: true,
          new_event: false
          vite_confirmation: true
        }
    }
}
'
```

> RESPONSE SAMPLE
```json light-code
{
  prefs: {
    email: {
      attending: true,
      declined: true,
      event_cancelled: true,
      event_cancelled_admin: true,
      event_confirmed: true,
      event_confirmed_admin: false,
      new_event: false,
      new_event_admin: false,
      new_message: false,
      new_suggestion: false,
      new_suggestion_own: false,
      vote_update: false,
      vote_confirmation: true,
      vyteme_created_admin: false
    }
  },
_id: 5fbd38e7198731eeaf57e4cb,
belongs_to: 5fbd38e7a6bb1d001c11863a,
updatedAt: 2020-11-24T16:46:31.666Z,
createdAt: 2020-11-24T16:46:31.666Z,
__v: 0
}

```

:::::

::::::

  


