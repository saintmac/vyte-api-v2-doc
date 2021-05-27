# Use team admins notifications

Team admins notifications help to set up email notifications for different event changes. It uses following preferences:

<attributes title="Preferences">

<attribute name="attending" type="boolean" default="false">

Send notification if user is attending the event you have created.

</attribute>
<attribute name="declined" type="boolean" default="false">

Send notification if user declined the event you have created.

</attribute>
<attribute name="event_cancelled" type="boolean" default="false">

Send notification if the event cancelled by others.

</attribute>
<attribute name="event_cancelled_admin" type="boolean" default="false">

Send notification if the event is cancelled by you.

</attribute>

<attribute name="event_confirmed" type="boolean" default="false">

Send notification if the event is confirmed by other.

</attribute>

<attribute name="event_confirmed_admin" type="boolean" default="false">

Send notification if the event is confirmed by you.

</attribute>

<attribute name="new_event" type="boolean" default="false">

Send notification about new events created by others (but not on your Vyte page).

</attribute>

<attribute name="new_event_admin" type="boolean" default="false">

Send notification about new events created by you.

</attribute>

<attribute name="new_message" type="boolean" default="false">

Send notification about new messages sent by others in the events you participate in or have created.

</attribute>

<attribute name="new_suggestion" type="boolean" default="false">

Send notification about new suggestions made by others in the events you participate in or have created.

</attribute>

<attribute name="new_suggestion_own" type="boolean" default="false">

Send notification about new suggestions made by you in the events you participate in or have created.

</attribute>

<attribute name="vote_update" type="boolean" default="false">

Send notification about updates of other's votes.

</attribute>

<attribute name="vote_confirmation" type="boolean" default="false">

Send notification about your own votes.

</attribute>

<attribute name="vyteme_created_admin" type="boolean" default="false">

Send notification, when new event is created from your Vyte page. As an owner of Vyte page you are always considered as an event creator.

</attribute>

## Set up your team admin preferences
To set up your team admin preferences you can use the `/teams/:team_id/admin-preferences` endpoint with your team `_id` and POST method. If some preferences are not defined they will be set up `false` par default.

```shell screen-hidden
curl --request POST 'https://api.vyte.in/teams/:team_id/admin-preferences' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prefs":
        "email":
            "attending": true
            "declined": true
            "event_cancelled": true
            "event_cancelled_admin": true
            "event_confirmed": true

  }'
```

## Get your team admin preferences
To get your team admin preferences you can use the `/teams/:team_id/admin-preferences` endpoint with your team `_id` and GET method. The response should be the an object containing the preferences :

```json light-code
    {
    "prefs":
        "email":
            "attending": true
            "declined": true
            "event_cancelled": true
            "event_cancelled_admin": true
            "event_confirmed": true
            "event_confirmed_admin": false
            "new_event": false
            "new_event_admin": false
            "new_message": false
            "new_suggestion": false
            "new_suggestion_own": false
            "vote_update": false
            "vote_confirmation": false
            "vyteme_created_admin": false
        }'

```

## Modify your team admin preferences
To modify your team admin preferences you can use the `/teams/:team_id/admin-preferences` endpoint with your team `_id` and PUT method.

```shell screen-hidden
curl --request PUT 'https://api.vyte.in/teams/:team_id/admin-preferences' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prefs":
        "email":
            "vote_update": true
            "vote_confirmation": true
            "vyteme_created_admin": true
  }'
```

The response should be the an object containing the updated preferences :

```json light-code
    {
    "prefs":
        "email":
            "attending": true
            "declined": true
            "event_cancelled": true
            "event_cancelled_admin": true
            "event_confirmed": true
            "event_confirmed_admin": false
            "new_event": false
            "new_event_admin": false
            "new_message": false
            "new_suggestion": false
            "new_suggestion_own": false
            "vote_update": true
            "vote_confirmation": true
            "vyteme_created_admin": true
        }'

```

The main idea of team admin preferences is to keep control over the team events event if you are not the person who created them. You can get notifications about your team activities and stay informed all the time.




