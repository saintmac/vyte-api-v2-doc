# Set up team booking

Thanks to the API, you are able to group your users by team. The [Teams API](/reference/teams/) is versatile, so that you can represent all types of organizational structure, from hierarchical to matrix structures.

Here we will learn how to create and manage our first team. At the end, we will see how to book a team event.

> NB: a team event isn't an event between the members of a team. A team event allows you to book an appointment with one member of the team. For instance, you can create an event with the Sales team, and it will automatically be assigned to someone of the sales team.

[[toc]]

## Create your first team

Let's create our first team. A team holds two independent lists of users: `members` (the bookable people of the team) and `admins` (the people who administer it). **The admins are not members of the team by default**: if you want an admin to be bookable in the team, you have to list them in `members` too.

So, for this guide, we will create a Sales team with 1 admin (who is also a member of the team) and another member. Note that all the ids are placeholders and are here only for the purpose of the example.

To create our first team, let's make a `POST` request to `/v2/teams`. `name` and `extid` (your own identifier for the team) are required:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522name%2522%253A%2520%2522Sales%2522%252C%250A%2520%2520%2522extid%2522%253A%2520%2522sales%2522%252C%250A%2520%2520%2522level_name%2522%253A%2520%2522department%2522%252C%250A%2520%2520%2522admins%2522%253A%2520%255B%250A%2520%2520%2520%2520%25225f1e9b2a8c4d3e0012345601%2522%250A%2520%2520%255D%252C%250A%2520%2520%2522members%2522%253A%2520%255B%250A%2520%2520%2520%2520%25225f1e9b2a8c4d3e0012345601%2522%252C%250A%2520%2520%2520%2520%25225f1e9b2a8c4d3e0012345602%2522%250A%2520%2520%255D%250A%257D%27"
  style="width: 100%; height: 520px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/teams' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Sales",
  "extid": "sales",
  "level_name": "department",
  "admins": [
    "5f1e9b2a8c4d3e0012345601"
  ],
  "members": [
    "5f1e9b2a8c4d3e0012345601",
    "5f1e9b2a8c4d3e0012345602"
  ]
}'
```

Our first team is now created :clap: The answer is `201` with the team:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales",
  "extid": "sales",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "level_name": "department",
  "tags": [],
  "public": false,
  "members": ["5f1e9b2a8c4d3e0012345601", "5f1e9b2a8c4d3e0012345602"],
  "admins": ["5f1e9b2a8c4d3e0012345601"],
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-01-12T09:30:00.000Z"
}
```

::: warning
This request is a "create or update" keyed on `extid`: sending it again with the same `extid` updates the existing team instead of creating a second one, and the `members` and `admins` lists you send replace the existing ones. A user reference that matches nobody in your organization is silently dropped, so always compare the returned `members` and `admins` with what you sent.
:::

## Manage your team

Oh! Someone new was just hired in the sales team. We have to add them to the team.

There is a dedicated endpoint to add members to a team without resending the whole list. Let's make a `POST` request to `/v2/teams/5f1e9b2a8c4d3e0012345678/members`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%252F5f1e9b2a8c4d3e0012345678%252Fmembers%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522members%2522%253A%2520%255B%250A%2520%2520%2520%2520%25225f1e9b2a8c4d3e0012345603%2522%250A%2520%2520%255D%250A%257D%27"
  style="width: 100%; height: 388px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/members' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "members": [
    "5f1e9b2a8c4d3e0012345603"
  ]
}'
```

The answer is `200` with the team after the change. In this response, each entry of `members` and `admins` is expanded to an object describing the user:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "name": "Sales",
  "extid": "sales",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "level_name": "department",
  "tags": [],
  "public": false,
  "members": [
    {
      "_id": "5f1e9b2a8c4d3e0012345601",
      "full_name": "John Doe",
      "emails": ["john.doe@example.com"],
      "calendars": { "google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false }
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345602",
      "full_name": "John Smith",
      "emails": ["john.smith@example.com"],
      "calendars": { "google": false, "office365": true, "exchange": false, "icloud": false, "caldav": false, "zoho": false }
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345603",
      "full_name": "Alex Martin",
      "emails": ["alex.martin@example.com"],
      "calendars": { "google": false, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false }
    }
  ],
  "admins": [
    {
      "_id": "5f1e9b2a8c4d3e0012345601",
      "full_name": "John Doe",
      "emails": ["john.doe@example.com"],
      "calendars": { "google": true, "office365": false, "exchange": false, "icloud": false, "caldav": false, "zoho": false }
    }
  ],
  "createdAt": "2026-01-12T09:30:00.000Z",
  "updatedAt": "2026-02-03T14:05:12.000Z"
}
```

And now our new Sales is part of the team.

> To remove a user from the team, send a `DELETE` request to `/v2/teams/:team_id/members/:member_id`, where `member_id` is the `_id` of the user. You can also replace the whole `members` list with a `PUT` request to `/v2/teams/:team_id`. See the [Teams reference](/reference/teams/#endpoints) for all the endpoints, and the guide about [team admins](/guides/using-team-admins-for-notifications-and-event-management/) to keep managers informed of what happens in the team.

## Get available slots for your team

To get all the slots when at least one member of your team is available, you can use the `/v2/slots` or `/v2/slots/days` endpoints with the `team` query parameter:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fslots%253Fteam%253D5f1e9b2a8c4d3e0012345678%2526duration%253D30%2526from%253D2028-02-09%2526to%253D2028-02-10%2526timezone%253DEurope%252FParis%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 278px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/slots?team=5f1e9b2a8c4d3e0012345678&duration=30&from=2028-02-09&to=2028-02-10&timezone=Europe/Paris' \
--header 'Authorization: YOUR_API_KEY'
```

We get in response a list of slots, so you can let your user pick one.

```jsonp light-code
{
  "timezone": "Europe/Paris",
  "from": "2028-02-09",
  "to": "2028-02-10",
  "slots": [
    {
      "start": { "dateTime": "2028-02-09T09:00:00+01:00" },
      "end": { "dateTime": "2028-02-09T09:30:00+01:00" }
    },
    {
      "start": { "dateTime": "2028-02-09T09:30:00+01:00" },
      "end": { "dateTime": "2028-02-09T10:00:00+01:00" }
    },
    {
      "start": { "dateTime": "2028-02-09T10:00:00+01:00" },
      "end": { "dateTime": "2028-02-09T10:30:00+01:00" }
    },
    ...
  ]
}
```

> Add `showUsers=true` to the request to get, in each slot, a `users` array with the ids of the members who are free for that slot. Add `team_all_members=true` to only get the slots when all the members of the team are free at the same time. See the [Slots reference](/reference/slots/#targeting-modes).

## Create your first team event

As we explained before, the API allows you to create an event and automatically assign it to a member of the team who is available on the requested date.

It works quite the same as a classic booking creation, with a `POST` request to `/v2/teams/:team_id/events`. The differences are:

- you don't provide the creator (`created_by`): the member is chosen by the API;
- `dates` must contain exactly one date, which can't be an all-day date;
- `timezone` is required;
- `vyteme` must be set to `true`, and the first element of `invitees` is the person making the booking.

So, we are ready to create our first team event:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%252F5f1e9b2a8c4d3e0012345678%252Fevents%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522vyteme%2522%253A%2520true%252C%250A%2520%2520%2522timezone%2522%253A%2520%2522Europe%252FParis%2522%252C%250A%2520%2520%2522dates%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522date%2522%253A%2520%25222028-02-09T09%253A00%253A00%252B01%253A00%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522end_date%2522%253A%2520%25222028-02-09T09%253A30%253A00%252B01%253A00%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522places%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Meeting%2520room%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522invitees%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522email%2522%253A%2520%2522jane.doe%2540example.com%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522full_name%2522%253A%2520%2522Jane%2520Doe%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522confirmed%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522flag%2522%253A%2520true%250A%2520%2520%257D%250A%257D%27"
  style="width: 100%; height: 806px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/teams/5f1e9b2a8c4d3e0012345678/events' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "vyteme": true,
  "timezone": "Europe/Paris",
  "dates": [
    {
      "date": "2028-02-09T09:00:00+01:00",
      "end_date": "2028-02-09T09:30:00+01:00"
    }
  ],
  "places": [
    {
      "name": "Meeting room"
    }
  ],
  "invitees": [
    {
      "email": "jane.doe@example.com",
      "full_name": "Jane Doe"
    }
  ],
  "confirmed": {
    "flag": true
  }
}'
```

The answer is `201` with the created event (shortened here), and we can see in `created_by` that the member was automatically chosen:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345800",
  "title": "Meeting Jane Doe / Alex Martin",
  "vyteme": true,
  "api": true,
  "created_by": {
    "user": "5f1e9b2a8c4d3e0012345603",
    "email": "alex.martin@example.com",
    "full_name": "Alex Martin"
  },
  "confirmed": {
    "flag": true,
    "updated_at": "2028-02-01T09:12:44.000Z",
    "date_id": "5f1e9b2a8c4d3e0012345801",
    "place_id": "5f1e9b2a8c4d3e0012345802"
  },
  "dates": [
    {
      "_id": "5f1e9b2a8c4d3e0012345801",
      "date": "2028-02-09T08:00:00.000Z",
      "end_date": "2028-02-09T08:30:00.000Z",
      "all_day": false,
      "confirmed": true
    }
  ],
  "places": [
    { "_id": "5f1e9b2a8c4d3e0012345802", "name": "Meeting room", "source": "app" }
  ],
  "invitees": [
    {
      "_id": "5f1e9b2a8c4d3e0012345803",
      "user": "5f1e9b2a8c4d3e0012345620",
      "email": "jane.doe@example.com",
      "full_name": "Jane Doe"
    },
    {
      "_id": "5f1e9b2a8c4d3e0012345804",
      "user": "5f1e9b2a8c4d3e0012345603",
      "email": "alex.martin@example.com",
      "full_name": "Alex Martin"
    }
  ],
  "timezone": "Europe/Paris",
  "lang": "en",
  "locale": "en"
}
```

How is the member chosen? Every member of the team is checked for the requested slot, each against their own calendars, bookings and availability. Among the free members, the one who received the fewest bookings through this team in the 30 days around the slot is chosen. When several members are tied, the first one in the order of the team's `members` list is chosen.

::: warning
If no member of the team is free for the slot, nothing is created and the answer is `410` with the `dates` array you sent. Fetch fresh slots and let the person choose again.
:::

And that's how you can use the API to automate appointment requests with teams. The other ways to assign a team booking are described in the [Events reference](/reference/events/#book-a-team).
