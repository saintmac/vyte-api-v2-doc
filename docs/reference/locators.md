---
{ "pageClass": "reference-page" }
---

# Locators

:::::panel

:::: left
A locator is a "store locator" style public page for an organization: it lists the places where
the organization can be met (shops, agencies, offices, coaches, advisors) and lets a visitor find
the ones nearest to an address or to their current position, or search them by name. Each place
is a [Location](/reference/locations/); each location carries a link, usually the path of a Vyte booking
page of a team or of a user (see [Teams](/reference/teams/) and [Users](/reference/users/)), so the visitor first
picks a place and then books an appointment there. A locator belongs to exactly one organization
and is identified publicly by its `handle`, which is part of the page address
(`https://vyte.in/locator/{handle}`).

The locator object holds the texts and the search settings of the page. The places themselves
are managed with the [Locations](/reference/locations/) endpoints, or in bulk when creating the locator
(see [Create or replace a locator](#create-or-replace-a-locator)).

General rules (base URL, authentication, key scopes, ids, languages, errors) are described in
[Conventions](/reference/).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/locators" href="#list-locators"></endpoint>
  <endpoint method="post" path="/v2/locators" href="#create-or-replace-a-locator"></endpoint>
  <endpoint method="get" path="/v2/locators/:handle" href="#retrieve-a-locator-by-handle-public"></endpoint>
  <endpoint method="put" path="/v2/locators/:locator_id" href="#update-a-locator"></endpoint>
  <endpoint method="delete" path="/v2/locators/:locator_id" href="#delete-a-locator"></endpoint>
</endpoints>
::::

:::::

## The Locator object

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string (id) | no | Unique identifier of the locator. Used as `:locator_id` in the paths. |
| `org` | string (id) | no | Identifier of the organization that owns the locator. Always set by Vyte from the API key; a value sent in a request is not taken into account. |
| `handle` | string | create-only | Public identifier of the locator, used in the address of the locator page and in [Retrieve a locator by handle](#retrieve-a-locator-by-handle-public). Required. Unique across **all** Vyte organizations (global namespace). Cannot be changed after creation. |
| `title` | string | yes | Title displayed on the locator page. No default. |
| `message` | string | yes | Introductory message displayed on the locator page. No default. |
| `footer` | string | yes | Footer of the locator page. May contain HTML links. No default. |
| `picture_url` | string (URL) | yes | Picture (logo or banner) displayed on the locator page. No default. |
| `lang` | string | yes | Language of the locator page, as a two letter code (see [Conventions](/reference/#languages)). The value is stored as sent, without validation. No default is stored. |
| `link_suffix` | string | yes | Text associated with the links of the locations of this locator (for example a query string to add to every booking link). Stored and returned as sent. No default. |
| `no_results` | object | yes | What the page shows when a search returns no location. |
| `no_results.message` | string | yes | Message displayed when no location is found. No default. |
| `no_results.button` | object | yes | Button displayed when no location is found. |
| `no_results.button.label` | string | yes | Label of that button. No default. |
| `no_results.button.link` | string (URL) | yes | Address opened by that button. No default. |
| `back_button` | object | yes | Settings of the "back" button that returns to the list of locations. |
| `back_button.label` | string | yes | Label of the back button. No default. |
| `geolocation` | boolean | yes | Whether the page offers the visitor to search around their current position. Default `false`. |
| `max_distance` | number | yes | Search radius in **meters**: a search by address or by position only returns the locations within this distance of the searched point. When not set, `5000` (5 km) is used. |
| `postcode_filter` | string | yes | Regular expression restricting the area served by the locator. For a search by address or by position, the postal code of the searched point is tested against this expression; when it does not match, the search returns no location. Not applied to searches by name. Example: `^(75|92)` to serve only postal codes starting with 75 or 92. No default (no restriction). |
| `address_postfix` | string | yes | Text meant to be appended to the address typed by the visitor to remove ambiguity, for example a country name (`France`). No default. |
| `address_region_bias` | string | yes | Region code used to favour results of a given country when the typed address is converted to coordinates, for example `fr`. Several comma separated values are accepted, for example `fr,de`. No default. |
| `address_direct_search` | boolean | yes | When `true`, the address typed by the visitor is not converted to coordinates; instead the locator returns the locations whose `name` or `address` contains the typed text (case insensitive), sorted by name. `max_distance` and `postcode_filter` do not apply in that mode. No default (behaves as `false`). |

Responses may contain additional fields not listed here; they are internal, may change without
notice and must not be relied upon.

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "org": "5f1e9b2a8c4d3e0012345600",
  "handle": "acme-stores",
  "title": "Find the store nearest to you",
  "message": "Type your address or use your current position.",
  "footer": "<a href='https://www.example.com/privacy'>Privacy policy</a>",
  "picture_url": "https://www.example.com/img/stores.png",
  "lang": "en",
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
  "geolocation": true,
  "max_distance": 15000,
  "postcode_filter": "^(75|92)",
  "address_postfix": "France",
  "address_region_bias": "fr"
}
```

### How a search on the locator page works

This explains the meaning of the search settings above; the search itself is performed by the
locator page.

| Visitor action | Result |
|---|---|
| Types an address (default mode) | The address is converted to coordinates (favouring `address_region_bias`). If `postcode_filter` is set and the postal code of that point does not match, no location is returned. Otherwise the locations that have coordinates within `max_distance` meters are returned, nearest first, each with its distance. |
| Uses their current position (`geolocation` is `true`) | Same as above, starting from the coordinates of the visitor. |
| Types an address while `address_direct_search` is `true` | The locations whose `name` or `address` contains the typed text are returned, sorted by name. |
| Searches by name | The locations whose `name` contains the typed text (case insensitive) are returned, sorted by name. |

A location without coordinates can only be found by name or by direct address search; see
[Locations](/reference/locations/).

## Endpoints

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/locators` | List the locators of the organization | organization |
| `POST` | `/v2/locators` | Create a locator, or replace the one that has the same handle, optionally with its locations | organization |
| `GET` | `/v2/locators/:handle` | Retrieve a locator by its handle | public (no key) |
| `PUT` | `/v2/locators/:locator_id` | Update a locator | organization |
| `DELETE` | `/v2/locators/:locator_id` | Delete a locator | organization |

`GET /v2/locators/:handle` and `PUT|DELETE /v2/locators/:locator_id` share the same path
position: with `GET` the last segment is the **handle**, with `PUT` and `DELETE` it is the
**`_id`** of the locator.

### List locators

`GET /v2/locators`

Returns every locator owned by the organization of the API key. The locations are not included;
use [List the locations of a locator](/reference/locations/#list-the-locations-of-a-locator).

**Key scope:** organization. A `team` or `user` scoped key is answered with `403`.

**Path parameters**

None.

**Query parameters**

None. There is no pagination, filtering or sorting: the whole list is returned.

**Request body**

None.

**Response**

`200 OK` with a JSON array of [Locator objects](#the-locator-object). The array is empty when
the organization has no locator.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key scope is not `organization`. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/locators' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345678",
    "org": "5f1e9b2a8c4d3e0012345600",
    "handle": "acme-stores",
    "title": "Find the store nearest to you",
    "lang": "en",
    "geolocation": true,
    "max_distance": 15000
  }
]
```

### Create or replace a locator

`POST /v2/locators`

Creates a locator for the organization of the API key. The call is an **upsert keyed on
`handle`**: if the organization already owns a locator with this handle, that locator is updated
with the fields of the body instead of a second one being created. Sending the same body twice
therefore has no additional effect.

- Top level fields that are absent from the body are left unchanged on an existing locator.
- An object field (`no_results`, `back_button`) that is present replaces the stored object as a
  whole.
- When the body contains a `locations` array, the locations of the locator are **synchronized**
  with that array:
  - an item whose `extid` matches a location of the organization updates that location (and
    attaches it to this locator);
  - an item whose `extid` is unknown, or that has no `extid`, creates a new location;
  - every location of the locator that is not in the array is **deleted**. An empty array
    deletes all the locations of the locator.
- When the body has no `locations` field, the existing locations are left untouched.

**Key scope:** organization. A `team` or `user` scoped key is answered with `403`.

**Path parameters**

None.

**Query parameters**

None.

**Request body**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `handle` | string | yes | | Public identifier of the locator. Must not be used by a locator of another organization. |
| `title` | string | no | none | See [The Locator object](#the-locator-object). |
| `message` | string | no | none | See [The Locator object](#the-locator-object). |
| `footer` | string | no | none | See [The Locator object](#the-locator-object). |
| `picture_url` | string | no | none | See [The Locator object](#the-locator-object). |
| `lang` | string | no | none | See [The Locator object](#the-locator-object). |
| `link_suffix` | string | no | none | See [The Locator object](#the-locator-object). |
| `no_results` | object | no | none | See [The Locator object](#the-locator-object). |
| `no_results.message` | string | no | none | Message displayed when no location is found. |
| `no_results.button.label` | string | no | none | Label of the button displayed when no location is found. |
| `no_results.button.link` | string | no | none | Address opened by that button. |
| `back_button.label` | string | no | none | Label of the back button. |
| `geolocation` | boolean | no | `false` | See [The Locator object](#the-locator-object). |
| `max_distance` | number | no | none (5000 m used by searches) | Search radius in meters. |
| `postcode_filter` | string | no | none | See [The Locator object](#the-locator-object). |
| `address_postfix` | string | no | none | See [The Locator object](#the-locator-object). |
| `address_region_bias` | string | no | none | See [The Locator object](#the-locator-object). |
| `address_direct_search` | boolean | no | none | See [The Locator object](#the-locator-object). |
| `locations` | array of objects | no | none | Complete list of the locations of the locator. Each item accepts the writable fields of the [Location object](/reference/locations/#the-location-object): `name`, `address`, `location.type`, `location.coordinates`, `picture_url`, `link`, `extid`. Give every item an `extid` so that a later call updates the location instead of recreating it. |

**Response**

`201 Created` with the [Locator object](#the-locator-object), both when the locator was created
and when an existing one was updated. The locations are **not** included in the response; read
them with [List the locations of a locator](/reference/locations/#list-the-locations-of-a-locator).

**Errors**

| Status | When |
|---|---|
| `400` | `handle` is missing. Empty body. |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key scope is not `organization`; or the handle is already taken by another organization (body `{"message": "Handle already taken"}`). |
| `500` | Unexpected error, including a location that could not be saved (for example its address could not be converted to coordinates because of a temporary failure). A handle already taken by another organization can also be reported with this status. |

**Example**

```bash
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
      "button": { "label": "Contact us", "link": "https://www.example.com/contact" }
    },
    "back_button": { "label": "Choose another store" },
    "locations": [
      {
        "extid": "store-001",
        "name": "Acme Paris Centre",
        "address": "10 rue de Rivoli, 75004 Paris",
        "location": { "type": "Point", "coordinates": [2.3601, 48.8553] },
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

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "org": "5f1e9b2a8c4d3e0012345600",
  "handle": "acme-stores",
  "title": "Find the store nearest to you",
  "message": "Type your address or use your current position.",
  "lang": "en",
  "geolocation": true,
  "max_distance": 15000,
  "no_results": {
    "message": "No store was found in your area.",
    "button": { "label": "Contact us", "link": "https://www.example.com/contact" }
  },
  "back_button": { "label": "Choose another store" }
}
```

### Retrieve a locator by handle (public)

`GET /v2/locators/:handle`

Returns the locator that has the given handle. This endpoint is **public**: it needs no API key
and is the one used by the locator page to load its texts and settings. It works for the locator
of any organization, so everything stored in a locator must be considered public information.

Each call is counted as a display of the locator page in the usage statistics of the locator,
together with the query parameters of the request (for example `utm_source`). Do not call it for
back-office purposes; use [List locators](#list-locators) instead.

There is no endpoint to retrieve a locator by its `_id`: an `_id` passed here is read as a
handle.

**Key scope:** none (public). An `Authorization` header, if sent, is not used.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `handle` | string | The `handle` of the locator (not its `_id`). |

**Query parameters**

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| any | string | no | none | No query parameter changes the response. Parameters such as `utm_source`, `utm_medium`, `utm_campaign` are recorded with the display statistics. |

**Request body**

None.

**Response**

`200 OK` with the [Locator object](#the-locator-object). The locations are not included.

**Errors**

| Status | When |
|---|---|
| `404` | No locator has this handle. Empty body. |
| `500` | Unexpected error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/locators/acme-stores'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "org": "5f1e9b2a8c4d3e0012345600",
  "handle": "acme-stores",
  "title": "Find the store nearest to you",
  "message": "Type your address or use your current position.",
  "lang": "en",
  "geolocation": true,
  "max_distance": 15000,
  "no_results": {
    "message": "No store was found in your area.",
    "button": { "label": "Contact us", "link": "https://www.example.com/contact" }
  },
  "back_button": { "label": "Choose another store" }
}
```

### Update a locator

`PUT /v2/locators/:locator_id`

Updates a locator of the organization. Only the fields present in the body are changed (partial
update), with one caveat: the merge is done at the top level only, so an object field
(`no_results`, `back_button`) that is present replaces the stored object as a whole. To change
`no_results.message` without losing `no_results.button`, send the complete `no_results` object.

`handle`, `_id` and `org` are not updatable: do not send them. To change a handle, create a new
locator and delete the old one. This endpoint does not accept a `locations` array; manage
locations with the [Locations](/reference/locations/) endpoints or with
[Create or replace a locator](#create-or-replace-a-locator).

**Key scope:** organization. A `team` or `user` scoped key is answered with `403`.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `locator_id` | string (id) | The `_id` of the locator (not its handle). |

**Query parameters**

None.

**Request body**

All fields are optional.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | string | no | unchanged | See [The Locator object](#the-locator-object). |
| `message` | string | no | unchanged | See [The Locator object](#the-locator-object). |
| `footer` | string | no | unchanged | See [The Locator object](#the-locator-object). |
| `picture_url` | string | no | unchanged | See [The Locator object](#the-locator-object). |
| `lang` | string | no | unchanged | See [The Locator object](#the-locator-object). |
| `link_suffix` | string | no | unchanged | See [The Locator object](#the-locator-object). |
| `no_results` | object | no | unchanged | Replaces the whole object: `message`, `button.label`, `button.link`. |
| `back_button` | object | no | unchanged | Replaces the whole object: `label`. |
| `geolocation` | boolean | no | unchanged | See [The Locator object](#the-locator-object). |
| `max_distance` | number | no | unchanged | Search radius in meters. |
| `postcode_filter` | string | no | unchanged | See [The Locator object](#the-locator-object). |
| `address_postfix` | string | no | unchanged | See [The Locator object](#the-locator-object). |
| `address_region_bias` | string | no | unchanged | See [The Locator object](#the-locator-object). |
| `address_direct_search` | boolean | no | unchanged | See [The Locator object](#the-locator-object). |

**Response**

`201 Created` (not `200`) with the updated [Locator object](#the-locator-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key scope is not `organization`. |
| `404` | No locator with this id belongs to the organization of the key (unknown id, malformed id, or locator of another organization). Empty body. |
| `500` | Unexpected error, including an attempt to change `handle`. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "title": "Find your Acme store",
    "max_distance": 20000
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345678",
  "org": "5f1e9b2a8c4d3e0012345600",
  "handle": "acme-stores",
  "title": "Find your Acme store",
  "message": "Type your address or use your current position.",
  "lang": "en",
  "geolocation": true,
  "max_distance": 20000,
  "no_results": {
    "message": "No store was found in your area.",
    "button": { "label": "Contact us", "link": "https://www.example.com/contact" }
  },
  "back_button": { "label": "Choose another store" }
}
```

### Delete a locator

`DELETE /v2/locators/:locator_id`

Deletes a locator of the organization. The locator page stops working immediately and the handle
becomes available again.

The locations of the locator are **not** deleted with it. Delete them first with
[Delete a location](/reference/locations/#delete-a-location) (they remain listable and deletable through
the Locations endpoints with the id of the deleted locator).

**Key scope:** organization. A `team` or `user` scoped key is answered with `403`.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `locator_id` | string (id) | The `_id` of the locator (not its handle). |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with a JSON object summarizing the deletion (this `DELETE` returns a body):

| Field | Type | Description |
|---|---|---|
| `n` | number | Number of locators deleted: `1`. |
| `ok` | number | `1` when the operation was executed. |

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key scope is not `organization`. |
| `404` | No locator with this id belongs to the organization of the key (unknown id or locator of another organization). The body is the same summary object with `n` equal to `0`. |
| `500` | Malformed `locator_id`, or unexpected error. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "n": 1,
  "ok": 1
}
```

## Notes and caveats

- **Handle versus id.** `GET /v2/locators/:handle` takes the handle; `PUT` and `DELETE` take the
  `_id`. Get the `_id` from the response of the creation, from [List locators](#list-locators)
  or from the public retrieval.
- **Global handle namespace.** A handle is unique across all Vyte organizations. Pick a handle
  specific to your brand.
- **`POST` is an upsert and always answers `201`.** It never fails because the locator already
  exists in your organization; it updates it. The status code does not tell whether the locator
  was created or updated.
- **`PUT` answers `201`**, not `200`.
- **`locations` in `POST /v2/locators` is a full replacement list.** Any location of the locator
  missing from the array is deleted. Omit the field entirely to leave locations untouched. Items
  without `extid` are recreated (with a new `_id`) on every call.
- **`extid` is matched across the whole organization**, not per locator: reusing in one locator
  an `extid` that exists in another locator of your organization moves that location to the
  locator being written.
- **Object fields are replaced as a whole** (`no_results`, `back_button`) by both `POST` and
  `PUT`.
- **No validation of values.** `lang`, `postcode_filter`, URLs and `max_distance` are stored as
  sent. An invalid regular expression in `postcode_filter` breaks the searches of the locator
  page: test it before saving. Fields that are not part of the Locator object are ignored.
- **Everything in a locator is public** through the retrieval by handle. Do not store
  confidential information in it.
- **Deleting a locator does not delete its locations.**
- **No timestamps.** Unlike most resources, the Locator object is not guaranteed to carry
  creation and modification dates.
- Lists are not paginated.
