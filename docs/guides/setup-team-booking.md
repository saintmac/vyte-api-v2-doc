# Set up team booking

Thanks to the API, you are able to group your user by team. The [team API](../reference/teams.md) is really versatile so that you can represent all types of organizational structure, from structural to matrix structure.

Here we will learn how to create and manage our first team. At the end, we will see how to create a team's event.

> NB: a team's event isn't an event between the member of a team. A team event allow you to create new appointment with someone of the team. For instance, you can create an event with the Sales team, and it will automatically assign the event to someone of the sales team (based on some parameters you can set up).

[[toc]]

## Create your first team

Let's create our first team. But to begin, a team is composed of admins and members. But don't forget that **the admins are not member of the team by default**. If you want an admin to be part of the team, you have to add him as a member too.

So, for this guide, we will create a Sales team with 1 admin (who is also member of the team) and an other member. Note that all the `ids` are fake and are here only for the purpose of the example.

To create our first team, let's just make a `POST` request at `/v2/teams` :

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%27%2520%255C%250A--header%2520%27Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522admins%2522%253A%2520%255B%250A%2520%2520%2520%2520%25225eecc40bb2181073ac6ff375%2522%250A%2520%2520%255D%252C%250A%2520%2520%2522members%2522%253A%2520%255B%250A%2520%2520%2520%2520%25225eecc40bb2181073ac6ff375%2522%252C%250A%2520%2520%2520%2520%25225f198d23c1ac5d0bcafc00ee%2522%250A%2520%2520%255D%252C%250A%2520%2520%2522extid%2522%253A%2520%25221%2522%252C%250A%2520%2520%2522name%2522%253A%2520%2522sales%2522%252C%250A%2520%2520%2522level_name%2522%253A%2520%2522company%2522%250A%257D%27"
  style="width: 100%; height: 530px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```bash screen-hidden
curl --request POST 'https://api.vyte.in/v2/teams' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "admins": [
    "5eecc40bb2181073ac6ff375"
  ],
  "members": [
    "5eecc40bb2181073ac6ff375",
    "5f198d23c1ac5d0bcafc00ee"
  ],
  "extid": "1",
  "name": "sales",
  "level_name": "company"
}'
```

Our first team is now created :clap:

```json light-code
{
  "admins": ["5eecc40bb2181073ac6ff375"],
  "members": ["5eecc40bb2181073ac6ff375", "5f198d23c1ac5d0bcafc00ee"],
  "_id": "5f47af4d2285550793c632c4",
  "organization": "5f198da1c1ac5d1a30fc00f3",
  "extid": "1",
  "name": "sales",
  "level_name": "company",
  "updatedAt": "2020-08-27T13:06:28.430Z",
  "createdAt": "2020-08-27T13:04:13.588Z",
  "__v": 2
}
```

## Manage your team

Oh! Someone new was just hired in the sales team. We have to add him to the sales team.

As there is no dedicated endpoint to add or remove members for a team, we will use the update team's endpoint and modify the `members` array.

Let's make a `PUT` request at `/v2/team/5f47af4d2285550793c632c4` :

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--location%2520--request%2520PUT%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%252F5f47af4d2285550793c632c4%27%2520%255C%250A--header%2520%27Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522members%2522%253A%2520%255B%250A%2520%2520%2520%2520%2520%2520%25225eecc40bb2181073ac6ff375%2522%252C%250A%2520%2520%2520%2520%2520%2520%25225f198d23c1ac5d0bcafc00ee%2522%252C%250A%2520%2520%2520%2520%2520%2520%25225f2809b0f678a7a0227f94ac%2522%250A%2520%2520%255D%250A%257D%27"
  style="width: 100%; height: 450px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```bash screen-hidden
curl --location --request PUT 'https://api.vyte.in/v2/teams/5f47af4d2285550793c632c4' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "members": [
      "5eecc40bb2181073ac6ff375",
      "5f198d23c1ac5d0bcafc00ee",
      "5f2809b0f678a7a0227f94ac"
  ]
}'
```

And now our new Sales is part of the team.

## Create your first team's event

As we explained before, the Team API allow you to create events and automatically assign the event to someone of the team who is available on the requested date.

It works quite the same as a classic event creation. The only things to change is that you can't send several dates and you don't have to provide creator information (because he will be automatically chosen by the API).

So, we'are ready to create our first team's event :

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--location%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fteams%252F5f47af4d2285550793c632c4%252Fevents%27%2520%255C%250A--header%2520%27Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522title%2522%253A%2520%2522First%2520created%2520event%2522%252C%250A%2520%2520%2522dates%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522all_day%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522date%2522%253A%2520%25222020-09-16T09%253A00%253A00%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522end_date%2522%253A%2520%25222020-09-16T10%253A00%253A00%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522places%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Place%2520for%2520the%2520meeting.%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522timezone%2522%253A%2520%2522Europe%252FParis%2522%250A%257D%27"
  style="width: 100%; height: 630px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```bash screen-hidden
curl --location --request POST 'https://api.vyte.in/v2/teams/5f47af4d2285550793c632c4/events' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "title": "First created event",
  "dates": [
    {
      "all_day": false,
      "date": "2020-09-16T09:00:00",
      "end_date": "2020-09-16T10:00:00"
    }
  ],
  "places": [
    {
      "name": "Place for the meeting."
    }
  ],
  "timezone": "Europe/Paris"
}'
```

We get in response the create event and we can see that the creator was automatically chose by the API:

```json light-code
{
  "created_by": {
    "user": "5f3feb7821046c3bb9327e6a",
    "full_name": "John Doe",
    "email": "john.doe@example.com"
  },
  "confirmed": {
    "flag": false,
    "updated_at": null,
    "multi": false
  },
  "third_party": {
    "group_ids": []
  },
  "ics_sequence": 0,
  "version": 0,
  "group_pro": false,
  "identification_alternatives": [],
  "_id": "5f47b6c4228555e2d6c63311",
  "title": "Second created event",
  "dates": [
    {
      "created_by": {
        "user": "5f3feb7821046c3bb9327e6a"
      },
      "votes": {
        "yes": [
          {
            "created_by": {
              "user": "5f3feb7821046c3bb9327e6a"
            },
            "_id": "5f47b6c4228555e269c63315"
          }
        ],
        "no": []
      },
      "all_day": false,
      "confirmed": false,
      "confirmed_invitees": [],
      "_id": "5f47b6c42285550d40c63312",
      "date": "2020-09-16T07:00:00.000Z",
      "end_date": "2020-09-16T08:00:00.000Z",
      "updatedAt": "2020-08-27T13:36:04.246Z",
      "createdAt": "2020-08-27T13:36:04.246Z"
    }
  ],
  "places": [
    {
      "created_by": {
        "user": "5f3feb7821046c3bb9327e6a"
      },
      "votes": {
        "yes": [
          {
            "created_by": {
              "user": "5f3feb7821046c3bb9327e6a"
            },
            "_id": "5f47b6c422855573b8c63316"
          }
        ],
        "no": []
      },
      "source": "app",
      "_id": "5f47b6c42285554c63c63313",
      "name": "Place for the meeting.",
      "updatedAt": "2020-08-27T13:36:04.246Z",
      "createdAt": "2020-08-27T13:36:04.246Z"
    }
  ],
  "timezone": "Europe/Paris",
  "invitees": [
    {
      "created_by": {
        "user": "5f3feb7821046c3bb9327e6a"
      },
      "stats": {
        "voted": {
          "dates": true,
          "places": true
        }
      },
      "star": false,
      "_id": "5f47b6c42285551c4fc63314",
      "user": "5f3feb7821046c3bb9327e6a",
      "email": "john.doe@example.com",
      "su": true,
      "full_name": "John Doe",
      "timezone": "Europe/London",
      "locale": "en"
    }
  ],
  "messages": [],
  "declines": [],
  "lang": "en",
  "locale": "en",
  "updatedAt": "2020-08-27T13:36:04.246Z",
  "createdAt": "2020-08-27T13:36:04.246Z",
  "invitees_length": 1,
  "email": "reply-to-participants-to-second-created-event-dvumxzapx@vytein.mailgun.org",
  "key_store": {
    "_id": "5f47b6c42285554f44c63317",
    "hash": {
      "5f3feb7821046c3bb9327e6a": "msg0ls0oxjvtjtg3"
    },
    "updatedAt": "2020-08-27T13:36:04.252Z",
    "createdAt": "2020-08-27T13:36:04.252Z",
    "__v": 0
  },
  "links": null,
  "__v": 0
}
```

And that's how you can use the API to automate appointment requests with teams.
