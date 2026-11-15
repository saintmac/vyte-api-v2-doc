# Adding a simple locator to your scheduling experience

Imagine you have 30 shops, agencies or offices. How do you direct your clients to the nearest one before they book an appointment? This is what a **locator** is for: a "store locator" style public page that lists the places where your organization can be met, and lets a visitor find the ones nearest to an address or to their current position, or search them by name. Each place is a **location** and carries a link, usually the path of a Vyte booking page, so that the visitor first picks a place and then books an appointment there.

In this guide, we will create a locator with two locations, add a third one, adjust the settings of the page, and see what the visitor gets.

[[toc]]

## Prerequisites

- An API key with the `organization` scope (see [Get started](/guides/getting-started/)). The locator and location endpoints answer `403` to a `team` or `user` scoped key.
- A booking page for each place you want to list: the booking page of a user or of a team (see [Create and manage booking pages](/guides/create-and-manage-booking-pages/)). You only need its path, for example `/acme-paris-centre`.
- A `handle` for your locator. It is part of the address of the page (`https://vyte.in/locator/{handle}`), it is unique across all Vyte organizations and it cannot be changed after creation: pick a handle specific to your brand.

## Step 1: create the locator with its first locations

A locator is created with a `POST` request to `/v2/locators`. Only `handle` is required. The other fields hold the texts and the search settings of the page:

<attributes title="Main body parameters">

<attribute name="handle" type="string" :required=true>

Public identifier of the locator, used in the address of the locator page.

</attribute>
<attribute name="title" type="string">

Title displayed on the locator page.

</attribute>
<attribute name="message" type="string">

Introductory message displayed on the locator page.

</attribute>
<attribute name="lang" type="string">

Language of the locator page, as a two letter code.

</attribute>
<attribute name="geolocation" type="boolean" details="default is false">

Whether the page offers the visitor to search around their current position.

</attribute>
<attribute name="max_distance" type="number">

Search radius in **meters**: a search by address or by position only returns the locations within this distance of the searched point. When not set, `5000` (5 km) is used.

</attribute>
<attribute name="no_results" type="object">

What the page shows when a search returns no location: a `message` and a `button` with a `label` and a `link`.

</attribute>
<attribute name="back_button" type="object">

Settings of the "back" button that returns to the list of locations: a `label`.

</attribute>
<attribute name="locations" type="array of objects">

Complete list of the locations of the locator. Each item accepts `extid`, `name`, `address`, `location`, `picture_url` and `link`.

</attribute>

</attributes>

The other settings (`footer`, `picture_url`, `link_suffix`, `postcode_filter`, `address_postfix`, `address_region_bias`, `address_direct_search`) are described in the [Locator object](/reference/locators/#the-locator-object).

Let's create a locator for the stores of ACME, with two stores. The first one has explicit coordinates, the second one only has an address:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Flocators%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522handle%2522%253A%2520%2522acme-stores%2522%252C%250A%2520%2520%2522title%2522%253A%2520%2522Find%2520the%2520store%2520nearest%2520to%2520you%2522%252C%250A%2520%2520%2522message%2522%253A%2520%2522Type%2520your%2520address%2520or%2520use%2520your%2520current%2520position.%2522%252C%250A%2520%2520%2522lang%2522%253A%2520%2522en%2522%252C%250A%2520%2520%2522geolocation%2522%253A%2520true%252C%250A%2520%2520%2522max_distance%2522%253A%252015000%252C%250A%2520%2520%2522no_results%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522message%2522%253A%2520%2522No%2520store%2520was%2520found%2520in%2520your%2520area.%2522%252C%250A%2520%2520%2520%2520%2522button%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522label%2522%253A%2520%2522Contact%2520us%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522link%2522%253A%2520%2522https%253A%252F%252Fwww.example.com%252Fcontact%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%252C%250A%2520%2520%2522back_button%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522label%2522%253A%2520%2522Choose%2520another%2520store%2522%250A%2520%2520%257D%252C%250A%2520%2520%2522locations%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522extid%2522%253A%2520%2522store-001%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Acme%2520Paris%2520Centre%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522address%2522%253A%2520%252210%2520rue%2520de%2520Rivoli%252C%252075004%2520Paris%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522location%2522%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522type%2522%253A%2520%2522Point%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522coordinates%2522%253A%2520%255B2.3601%252C%252048.8553%255D%250A%2520%2520%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2520%2520%2522picture_url%2522%253A%2520%2522https%253A%252F%252Fwww.example.com%252Fimg%252Fstore-001.jpg%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522link%2522%253A%2520%2522%252Facme-paris-centre%2522%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522extid%2522%253A%2520%2522store-002%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Acme%2520Lyon%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522address%2522%253A%2520%25225%2520place%2520Bellecour%252C%252069002%2520Lyon%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522link%2522%253A%2520%2522%252Facme-lyon%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%250A%257D%27"
  style="width: 100%; height: 1070px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/locators' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "handle": "acme-stores",
  "title": "Find the store nearest to you",
  "message": "Type your address or use your current position.",
  "lang": "en",
  "geolocation": true,
  "max_distance": 15000,
  "no_results": {
    "message": "No store was found in your area.",
    "button": {
      "label": "Contact us",
      "link": "https://www.example.com/contact"
    }
  },
  "back_button": {
    "label": "Choose another store"
  },
  "locations": [
    {
      "extid": "store-001",
      "name": "Acme Paris Centre",
      "address": "10 rue de Rivoli, 75004 Paris",
      "location": {
        "type": "Point",
        "coordinates": [2.3601, 48.8553]
      },
      "picture_url": "https://www.example.com/img/store-001.jpg",
      "link": "/acme-paris-centre"
    },
    {
      "extid": "store-002",
      "name": "Acme Lyon",
      "address": "5 place Bellecour, 69002 Lyon",
      "link": "/acme-lyon"
    }
  ]
}'
```

The answer is `201` with the locator. The locations are not included in the response:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "org": "5f1e9b2a8c4d3e0012340000",
  "handle": "acme-stores",
  "title": "Find the store nearest to you",
  "message": "Type your address or use your current position.",
  "lang": "en",
  "geolocation": true,
  "max_distance": 15000,
  "no_results": {
    "message": "No store was found in your area.",
    "button": {
      "label": "Contact us",
      "link": "https://www.example.com/contact"
    }
  },
  "back_button": {
    "label": "Choose another store"
  }
}
```

Keep the `_id` of the locator: the next requests use it as `:locator_id`.

A few things to know about the locations:

- `location.coordinates` is `[longitude, latitude]` in decimal degrees: **longitude comes first**.
- When a location is saved without coordinates but with an `address`, Vyte converts the address to coordinates automatically.
- `extid` is your own identifier for the place (for example the store code in your database). Give one to every location: it is what lets a later call update the location instead of creating it again.
- `link` is where the visitor is sent after choosing the place: a path relative to the Vyte booking site, usually a booking page (`/acme-paris-centre`) or a given appointment type of a booking page (`/jane-doe/first-meeting`), or an absolute `http(s)` URL.

::: warning
This request is a "create or replace" keyed on `handle`: sending it again updates the locator that has this handle. When the body contains a `locations` array, the locations of the locator are synchronized with it, and **every location of the locator that is not in the array is deleted**. Omit the `locations` field entirely to leave the locations untouched.
:::

## Step 2: check the locations

To read the locations of the locator, send a `GET` request to `/v2/locators/:locator_id/locations`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Flocators%252F5f1e9b2a8c4d3e0012345678%252Flocations%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 256px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678/locations' \
--header 'Authorization: YOUR_API_KEY'
```

The answer is `200` with an array of locations:

```json light-code
[
  {
    "_id": "5f1e9b2a8c4d3e0012345679",
    "org": "5f1e9b2a8c4d3e0012340000",
    "locator": "5f1e9b2a8c4d3e0012345678",
    "extid": "store-001",
    "name": "Acme Paris Centre",
    "address": "10 rue de Rivoli, 75004 Paris",
    "location": { "type": "Point", "coordinates": [2.3601, 48.8553] },
    "picture_url": "https://www.example.com/img/store-001.jpg",
    "link": "/acme-paris-centre",
    "createdAt": "2026-01-15T09:30:00.000Z",
    "updatedAt": "2026-01-15T09:30:00.000Z"
  },
  {
    "_id": "5f1e9b2a8c4d3e001234567a",
    "org": "5f1e9b2a8c4d3e0012340000",
    "locator": "5f1e9b2a8c4d3e0012345678",
    "extid": "store-002",
    "name": "Acme Lyon",
    "address": "5 place Bellecour, 69002 Lyon",
    "location": { "type": "Point", "coordinates": [4.8320, 45.7578] },
    "link": "/acme-lyon",
    "createdAt": "2026-01-15T09:30:00.000Z",
    "updatedAt": "2026-01-15T09:30:00.000Z"
  }
]
```

The address of the second store was converted to coordinates. Check the `location` field of each location: if no position was found for an address, the location is saved without `location` and cannot be found by a search by address or by position.

## Step 3: add a location

A new store opens in Marseille. To add it without resending the whole list, send a `POST` request to `/v2/locators/:locator_id/locations`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Flocators%252F5f1e9b2a8c4d3e0012345678%252Flocations%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522extid%2522%253A%2520%2522store-003%2522%252C%250A%2520%2520%2522name%2522%253A%2520%2522Acme%2520Marseille%2522%252C%250A%2520%2520%2522address%2522%253A%2520%252220%2520quai%2520du%2520Port%252C%252013002%2520Marseille%2522%252C%250A%2520%2520%2522location%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522type%2522%253A%2520%2522Point%2522%252C%250A%2520%2520%2520%2520%2522coordinates%2522%253A%2520%255B5.3698%252C%252043.2965%255D%250A%2520%2520%257D%252C%250A%2520%2520%2522picture_url%2522%253A%2520%2522https%253A%252F%252Fwww.example.com%252Fimg%252Fstore-003.jpg%2522%252C%250A%2520%2520%2522link%2522%253A%2520%2522%252Facme-marseille%2522%250A%257D%27"
  style="width: 100%; height: 520px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678/locations' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "extid": "store-003",
  "name": "Acme Marseille",
  "address": "20 quai du Port, 13002 Marseille",
  "location": {
    "type": "Point",
    "coordinates": [5.3698, 43.2965]
  },
  "picture_url": "https://www.example.com/img/store-003.jpg",
  "link": "/acme-marseille"
}'
```

The answer is `201` with the location:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e001234567b",
  "org": "5f1e9b2a8c4d3e0012340000",
  "locator": "5f1e9b2a8c4d3e0012345678",
  "extid": "store-003",
  "name": "Acme Marseille",
  "address": "20 quai du Port, 13002 Marseille",
  "location": { "type": "Point", "coordinates": [5.3698, 43.2965] },
  "picture_url": "https://www.example.com/img/store-003.jpg",
  "link": "/acme-marseille",
  "createdAt": "2026-01-15T09:30:00.000Z",
  "updatedAt": "2026-01-15T09:30:00.000Z"
}
```

This request is keyed on `extid` too: sending it again with the same `extid` updates the location instead of creating a duplicate. Without `extid`, a new location is created on every call.

## Step 4: update a location or the locator

The store of Paris moves to a new booking page. To update a location, send a `PUT` request to `/v2/locators/:locator_id/locations/:location_id` with the fields to change:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520PUT%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Flocators%252F5f1e9b2a8c4d3e0012345678%252Flocations%252F5f1e9b2a8c4d3e0012345679%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522name%2522%253A%2520%2522Acme%2520Paris%2520Rivoli%2522%252C%250A%2520%2520%2522link%2522%253A%2520%2522%252Facme-paris-rivoli%2522%250A%257D%27"
  style="width: 100%; height: 366px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request PUT 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678/locations/5f1e9b2a8c4d3e0012345679' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Acme Paris Rivoli",
  "link": "/acme-paris-rivoli"
}'
```

The answer is `200` with the updated location:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345679",
  "org": "5f1e9b2a8c4d3e0012340000",
  "locator": "5f1e9b2a8c4d3e0012345678",
  "extid": "store-001",
  "name": "Acme Paris Rivoli",
  "address": "10 rue de Rivoli, 75004 Paris",
  "location": { "type": "Point", "coordinates": [2.3601, 48.8553] },
  "picture_url": "https://www.example.com/img/store-001.jpg",
  "link": "/acme-paris-rivoli",
  "createdAt": "2026-01-15T09:30:00.000Z",
  "updatedAt": "2026-02-02T14:05:12.000Z"
}
```

Only a location that has an `extid` can be updated this way. Changing the `address` alone does not move the point: send the new `location.coordinates` in the same request.

The texts and the search settings of the locator itself are updated with a `PUT` request to `/v2/locators/:locator_id`. Let's change the title and widen the search radius to 20 km:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520PUT%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Flocators%252F5f1e9b2a8c4d3e0012345678%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522title%2522%253A%2520%2522Find%2520your%2520Acme%2520store%2522%252C%250A%2520%2520%2522max_distance%2522%253A%252020000%250A%257D%27"
  style="width: 100%; height: 366px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request PUT 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678' \
--header 'Authorization: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "title": "Find your Acme store",
  "max_distance": 20000
}'
```

The answer is `201` (not `200`) with the updated locator:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "org": "5f1e9b2a8c4d3e0012340000",
  "handle": "acme-stores",
  "title": "Find your Acme store",
  "message": "Type your address or use your current position.",
  "lang": "en",
  "geolocation": true,
  "max_distance": 20000,
  "no_results": {
    "message": "No store was found in your area.",
    "button": {
      "label": "Contact us",
      "link": "https://www.example.com/contact"
    }
  },
  "back_button": {
    "label": "Choose another store"
  }
}
```

Only the fields present in the body are changed, but an object field (`no_results`, `back_button`) that is present replaces the stored object as a whole: to change `no_results.message` without losing `no_results.button`, send the complete `no_results` object.

## What happens next

Your locator page is online at `https://vyte.in/locator/acme-stores` _(with your own handle)_. Here is what the visitor can do on it:

| Visitor action | Result |
| --- | --- |
| Types an address | The address is converted to coordinates and the locations within `max_distance` meters are returned, nearest first, each with its distance. |
| Uses their current position (when `geolocation` is `true`) | Same as above, starting from the coordinates of the visitor. |
| Searches by name | The locations whose `name` contains the typed text are returned, sorted by name. |

When the visitor chooses a place, they are sent to its `link`: usually the booking page where they book the appointment. When a search returns no location, the page shows the `no_results` message and button.

The page loads its texts and settings with a public request that needs no API key, `GET /v2/locators/:handle`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Flocators%252Facme-stores%27"
  style="width: 100%; height: 212px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/locators/acme-stores'
```

The answer is `200` with the locator, without its locations:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "org": "5f1e9b2a8c4d3e0012340000",
  "handle": "acme-stores",
  "title": "Find your Acme store",
  "message": "Type your address or use your current position.",
  "lang": "en",
  "geolocation": true,
  "max_distance": 20000,
  "no_results": {
    "message": "No store was found in your area.",
    "button": {
      "label": "Contact us",
      "link": "https://www.example.com/contact"
    }
  },
  "back_button": {
    "label": "Choose another store"
  }
}
```

Each call to this endpoint is counted as a display of the locator page in the usage statistics of the locator: for your back-office needs, list your locators with `GET /v2/locators` instead. As everything stored in a locator and in its locations is displayed to the public, only store public information in them.

## Step 5: remove a location or the locator

When a store closes, delete its location with a `DELETE` request to `/v2/locators/:locator_id/locations/:location_id`. It disappears from the locator page immediately; the booking page designated by its `link` is not affected.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520DELETE%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Flocators%252F5f1e9b2a8c4d3e0012345678%252Flocations%252F5f1e9b2a8c4d3e001234567a%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 256px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request DELETE 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678/locations/5f1e9b2a8c4d3e001234567a' \
--header 'Authorization: YOUR_API_KEY'
```

The answer is `200` with a summary of the deletion:

```json light-code
{
  "n": 1,
  "ok": 1
}
```

A locator is deleted the same way, with a `DELETE` request to `/v2/locators/:locator_id`, which answers with the same summary. The locations of a locator are **not** deleted with it: delete them first.

## Common mistakes

- **Swapping latitude and longitude.** Coordinates are `[longitude, latitude]`, longitude first. For Paris: `[2.3522, 48.8566]`.
- **Using the handle where the `_id` is expected.** `GET /v2/locators/:handle` takes the handle; `PUT` and `DELETE /v2/locators/:locator_id` and all the location endpoints take the `_id` of the locator.
- **Creating locations without `extid`.** A `POST` without `extid` creates a new location on every call, and such a location cannot be updated with `PUT`.
- **Sending a partial `locations` array to `POST /v2/locators`.** The array is the complete list: the locations missing from it are deleted, and an empty array deletes them all.
- **Reusing an `extid` in another locator.** `extid` is unique within your organization, not per locator: a `POST` with an `extid` that exists on another of your locators moves that location to the locator of the request.
- **Changing an address and expecting the point to move.** The automatic conversion only happens when the location has no coordinates. Send new coordinates with the new address.
- **Sending a partial `no_results` or `back_button` object.** Object fields are replaced as a whole.
- **Trying to change the handle.** `handle` cannot be changed after creation: create a new locator and delete the old one.
- **Expecting `200` when updating a locator.** `POST /v2/locators` and `PUT /v2/locators/:locator_id` both answer `201`.
- **Mistyping a `link`.** The link is stored as sent: a wrong path sends visitors to a page that does not exist.
- **Expecting a `404` when listing the locations of an unknown locator.** The answer is `200` with an empty array.

## Reference

- [Locators](/reference/locators/): [the Locator object](/reference/locators/#the-locator-object), [how a search on the locator page works](/reference/locators/#how-a-search-on-the-locator-page-works), [create or replace a locator](/reference/locators/#create-or-replace-a-locator), [update a locator](/reference/locators/#update-a-locator).
- [Locations](/reference/locations/): [the Location object](/reference/locations/#the-location-object), [coordinates and address](/reference/locations/#coordinates-and-address), [create a location](/reference/locations/#create-a-location), [update a location](/reference/locations/#update-a-location).
- [Booking pages](/reference/vytemes/) and [Appointment types](/reference/appointment-types/), for the pages the locations link to.
