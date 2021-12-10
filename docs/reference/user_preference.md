---
{
  "pageClass": "reference-page"
}
---

# User preference

:::::panel

:::: left

You can use the `/v2/users/:user_id/preferences` endpoints to manage the preferences of your user.

> This API is an extension of the Users API, that's why all url are prefixed with `/users/:user_id/`. You can refer to the [User API reference](users.md) to have more informations about user creation.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users/:user_id/preferences" href="#retrieve-the-preferences-of-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id/preferences" href="#update-the-preferences-of-a-user"></endpoint>
</endpoints>
::::

:::::

## The preferences object

::::: panel
:::: left

<attributes title="Attributes">

<attribute name="belongs_to" type="ObjectId">

The `_id` of user, whom these preferences belong to.

</attribute>

<attribute name="log.push_enabled" type="boolean">

`Preferences` contains two types of preferences: `email` and `push`. Par default `push` are set to false. If `log.push_enabled` set to `true`, all push settings set to `true`.

</attribute>

<attribute name="prefs" type="hash">

Here you can define user's preferences.

<attributes :isChild=true>

<attribute name="email" type="hash" :parentNames="['prefs']" :isChild=true>

Settings for email.

<attributes :isChild=true>
<attribute name="attending" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about attendees of events you have created. Default is `true`.

</attribute>

<attribute name="declined" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about declining events you have created. Default is `true`.

</attribute>

<attribute name="event_cancelled" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about cancelling events by other users. Default is `true`.

</attribute>

<attribute name="event_cancelled_admin" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about cancelling events you have created. Default is `true`.

</attribute>

<attribute name="event_confirmed" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about confirming events by other users. Default is `true`.

</attribute>

<attribute name="event_confirmed_admin" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about confirming events you have created and confirmed. Default is `true`.

</attribute>

<attribute name="new_event" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about new events created by other (but not on your Vyte page). Default is `true`.

</attribute>

<attribute name="new_event_admin" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about new events created by you. Default is `true`.

</attribute>

<attribute name="new_message" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about messages for the events you have created or participate in. Default is `true`.

</attribute>

<attribute name="new_suggestion" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about suggestions for the events you have created or participate in. Default is `true`.

</attribute>

<attribute name="new_suggestions_own" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about suggestions made by you for the events you have created or participate in. Default is `true`.

</attribute>

<attribute name="vote_update" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about votes for the events you have created. Default is `true`.

</attribute>

<attribute name="vote_confirmation" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about votes made by you. Default is `false`.

</attribute>

<attribute name="vyteme_created_admin" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about events created from your Vyte page. Default is `true`.

</attribute>
</attributes>
</attributes>

<attributes :isChild=true>

<attribute name="push" type="hash" :parentNames="['prefs']" :isChild=true>

Settings for push notifications.

<attributes :isChild=true>
<attribute name="attending" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about attendees of events you have created. Default is `false`.

</attribute>

<attribute name="declined" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about declining events you have created. Default is `false`.

</attribute>

<attribute name="event_cancelled" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about cancelling events by other users. Default is `false`.

</attribute>

<attribute name="event_confirmed" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about confirming events by other users. Default is `false`.

</attribute>

<attribute name="new_event" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about new events created by other (but not on your Vyte page). Default is `false`.

</attribute>

<attribute name="new_message" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about messages for the events you have created or participate in. Default is `false`.

</attribute>

<attribute name="new_suggestion" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about suggestions for the events you have created or participate in. Default is `false`.

</attribute>

<attribute name="vote_update" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about votes for the events you have created. Default is `false`.

</attribute>

<attribute name="vyteme_created_admin" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about events created from your Vyte page. Default is `false`.

</attribute>
</attributes>
</attributes>


::::

:::: right

> THE PREFERENCE OBJECT

```json light-code

{
  "belongs_to": "5f2d70c51e066227db71d493",
  "log":
	  {"push_enabled": true}
  "prefs":
    { "email":
      { "attending": true,
      "declined": true,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": true,
      "new_event": true,
      "new_event_admin": true,
      "new_message": true,
      "new_suggestion": true,
      "new_suggestion_own": true,
      "vote_update": true,
      "vote_confirmation": false,
      "vyteme_created_admin": true },
      
    "push":
      { "attending": false,
      "declined": false,
      "event_cancelled": false,
      "event_confirmed": false,
      "new_event": false,
      "new_message": false,
      "new_suggestion": false,
      "vote_update": false,
      "vyteme_created_admin": false } 
        }
      }
```

::::

:::::

## Retrieve or create the preferences of a user

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/users/:user_id/preferences HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `id` of the user whose preferences you want to retrieve. If there are no preferences, the object will be created with `default` settings.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<returns title="Returns">

A `Prefs` object if there is no error. `Prefs` doesn't contain `belongs_to` and `log.push_enabled` properties.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/users/5f2d28fb1e0662e70071d46b/preferences' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code

{ "email":
      { "attending": true,
      "declined": true,
      "event_cancelled": true,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": true,
      "new_event": true,
      "new_event_admin": true,
      "new_message": true,
      "new_suggestion": true,
      "new_suggestion_own": true,
      "vote_update": true,
      "vote_confirmation": false,
      "vyteme_created_admin": true },
      
    "push":
      { "attending": false,
      "declined": false,
      "event_cancelled": false,
      "event_confirmed": false,
      "new_event": false,
      "new_message": false,
      "new_suggestion": false,
      "vote_update": false,
      "vyteme_created_admin": false } 
        }

```

:::::

::::::



## Update the preferences of a user

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/users/:user_id/preferences HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `id` of the user whose preference you want to update.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<attributes title="Body parameters">

<attribute name="email" type="hash" :parentNames="['prefs']" :isChild=true>

Settings for email.

<attributes :isChild=true>
<attribute name="attending" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about attendees of events you have created. Default is `true`.

</attribute>

<attribute name="declined" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about declining events you have created. Default is `true`.

</attribute>

<attribute name="event_cancelled" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about cancelling events by other users. Default is `true`.

</attribute>

<attribute name="event_cancelled_admin" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about cancelling events you have created. Default is `true`.

</attribute>

<attribute name="event_confirmed" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about confirming events by other users. Default is `true`.

</attribute>

<attribute name="event_confirmed_admin" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about confirming events you have created and confirmed. Default is `true`.

</attribute>

<attribute name="new_event" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about new events created by other (but not on your Vyte page). Default is `true`.

</attribute>

<attribute name="new_event_admin" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about new events created by you. Default is `true`.

</attribute>

<attribute name="new_message" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about messages for the events you have created or participate in. Default is `true`.

</attribute>

<attribute name="new_suggestion" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about suggestions for the events you have created or participate in. Default is `true`.

</attribute>

<attribute name="new_suggestions_own" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about suggestions made by you for the events you have created or participate in. Default is `true`.

</attribute>

<attribute name="vote_update" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about votes for the events you have created. Default is `true`.

</attribute>

<attribute name="vote_confirmation" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about votes made by you. Default is `false`.

</attribute>

<attribute name="vyteme_created_admin" type="boolean" :parentNames="['prefs', 'email']" :isChild=true>

Whether or not you will get emails about events created from your Vyte page. Default is `true`.

</attribute>
</attributes>
</attributes>

<attributes :isChild=true>

<attribute name="push" type="hash" :parentNames="['prefs']" :isChild=true>

Settings for push notifications.

<attributes :isChild=true>
<attribute name="attending" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about attendees of events you have created. Default is `false`.

</attribute>

<attribute name="declined" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about declining events you have created. Default is `false`.

</attribute>

<attribute name="event_cancelled" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about cancelling events by other users. Default is `false`.

</attribute>

<attribute name="event_confirmed" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about confirming events by other users. Default is `false`.

</attribute>

<attribute name="new_event" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about new events created by other (but not on your Vyte page). Default is `false`.

</attribute>

<attribute name="new_message" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about messages for the events you have created or participate in. Default is `false`.

</attribute>

<attribute name="new_suggestion" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about suggestions for the events you have created or participate in. Default is `false`.

</attribute>

<attribute name="vote_update" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about votes for the events you have created. Default is `false`.

</attribute>

<attribute name="vyteme_created_admin" type="boolean" :parentNames="['prefs', 'push']" :isChild=true>

Whether or not you will get push notifications about events created from your Vyte page. Default is `false`.

</attribute>
</attributes>

</attributes>

<returns title="Returns">

The updated `Prefs` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl --request PUT 'https://api.vyte.in/v2/users/5f2d4abf1e0662386371d475/preferences' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '
    { "email":
      { "attending": false,
      "declined": false,
      "event_cancelled": false,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": true,
      "new_event": true,
      "new_event_admin": true,
      "new_message": true,
      "new_suggestion": true,
      "new_suggestion_own": true,
      "vote_update": true,
      "vote_confirmation": false,
      "vyteme_created_admin": true },
      
    "push":
      { "attending": false,
      "declined": false,
      "event_cancelled": false,
      "event_confirmed": false,
      "new_event": false,
      "new_message": false,
      "new_suggestion": false,
      "vote_update": false,
      "vyteme_created_admin": false } 
        }
    '
```

> RESPONSE SAMPLE

```json light-code

{ "email":
      { "attending": false,
      "declined": false,
      "event_cancelled": false,
      "event_cancelled_admin": true,
      "event_confirmed": true,
      "event_confirmed_admin": true,
      "new_event": true,
      "new_event_admin": true,
      "new_message": true,
      "new_suggestion": true,
      "new_suggestion_own": true,
      "vote_update": true,
      "vote_confirmation": false,
      "vyteme_created_admin": true },
      
    "push":
      { "attending": false,
      "declined": false,
      "event_cancelled": false,
      "event_confirmed": false,
      "new_event": false,
      "new_message": false,
      "new_suggestion": false,
      "vote_update": false,
      "vyteme_created_admin": false } 
        }

```

:::::

::::::

