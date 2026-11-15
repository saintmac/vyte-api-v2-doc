---
{ "pageClass": "reference-page" }
---

# Locations

:::::panel

:::: left
A location is one place listed on a [Locator](/reference/locators/) page: a shop, an agency, an office, a
coach, an advisor. It has a name, a postal address, geographic coordinates used to find the
places nearest to a visitor, an optional picture and a `link`. The `link` is where the visitor is
sent after choosing the place: in most cases the path of a Vyte booking page, that is the booking
page of a team or of a user (see [Teams](/reference/teams/) and [Users](/reference/users/)), optionally followed by
an appointment type. This is how a location is tied to the people who can be booked there: there
is no team id or user id on a location, only this link. A location belongs to one organization
and to one locator.

General rules (base URL, authentication, key scopes, ids, errors) are described in
[Conventions](/reference/).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/locators/:locator_id/locations" href="#list-the-locations-of-a-locator"></endpoint>
  <endpoint method="post" path="/v2/locators/:locator_id/locations" href="#create-a-location"></endpoint>
  <endpoint method="get" path="/v2/locators/:locator_id/locations/:location_id" href="#retrieve-a-location"></endpoint>
  <endpoint method="put" path="/v2/locators/:locator_id/locations/:location_id" href="#update-a-location"></endpoint>
  <endpoint method="delete" path="/v2/locators/:locator_id/locations/:location_id" href="#delete-a-location"></endpoint>
</endpoints>
::::

:::::

## The Location object

| Field | Type | Writable | Description |
|---|---|---|---|
| `_id` | string (id) | no | Unique identifier of the location. Used as `:location_id` in the paths. |
| `org` | string (id) | no | Identifier of the organization that owns the location. Set by Vyte from the API key. |
| `locator` | string (id) | no | Identifier of the [Locator](/reference/locators/) the location is listed on. Set by Vyte from the `:locator_id` of the creation path. |
| `extid` | string | create-only | Your own identifier for this place (for example the store code in your database). Optional but strongly recommended: it is the key that makes creation idempotent and it is required to update the location later. Must be unique within your organization (across all your locators). Cannot be changed after creation. |
| `name` | string | yes | Name of the place, displayed on the locator page and used by the search by name. Leading and trailing spaces are removed. No default. |
| `address` | string | yes | Postal address of the place, displayed on the locator page. Leading and trailing spaces are removed. When the location is saved without coordinates, Vyte converts this address to coordinates automatically. No default. |
| `location` | object | yes | Geographic position of the place, as a GeoJSON point. Absent when the location has neither coordinates nor an address that could be converted. |
| `location.type` | string | yes | Always `"Point"`. Default `"Point"`; may be omitted. |
| `location.coordinates` | array of 2 numbers | yes | `[longitude, latitude]` in decimal degrees (WGS 84). **Longitude comes first**, as in GeoJSON. Longitude must be between -180 and 180, latitude between -90 and 90. Example for Paris: `[2.3522, 48.8566]`. |
| `picture_url` | string (URL) | yes | Picture illustrating the place on the locator page. No default. |
| `link` | string | yes | Where the visitor is sent when choosing this place. Either a path relative to the Vyte booking site, usually a booking page (for example `/acme-paris-centre` for the booking page of a team or user, or `/jane-doe/first-meeting` for a given appointment type of a booking page), or an absolute `http(s)` URL. Stored as sent, without validation. No default. |
| `createdAt` | string (date-time) | no | Creation date. |
| `updatedAt` | string (date-time) | no | Date of the last modification. |

Responses may contain additional fields not listed here; they are internal, may change without
notice and must not be relied upon.

```json
{
  "_id": "5f1e9b2a8c4d3e0012345679",
  "org": "5f1e9b2a8c4d3e0012345600",
  "locator": "5f1e9b2a8c4d3e0012345678",
  "extid": "store-001",
  "name": "Acme Paris Centre",
  "address": "10 rue de Rivoli, 75004 Paris",
  "location": {
    "type": "Point",
    "coordinates": [2.3601, 48.8553]
  },
  "picture_url": "https://www.example.com/img/store-001.jpg",
  "link": "/acme-paris-centre",
  "createdAt": "2026-01-15T09:30:00.000Z",
  "updatedAt": "2026-01-15T09:30:00.000Z"
}
```

### Coordinates and address

| What you send | What is stored |
|---|---|
| `location.coordinates` (with or without `address`) | The coordinates you sent. The address is kept for display only and is not checked against them. |
| `address` only | The address is converted to coordinates by Vyte when the location is saved. If no position is found for the address, the location is saved **without** `location`. |
| Neither | The location is saved without `location`. |

A location without `location` is never returned by a search by address or by position on the
locator page; it can only be found by name (or by address text when the locator uses
`address_direct_search`, see [Locators](/reference/locators/#how-a-search-on-the-locator-page-works)).
Sending explicit coordinates is the most reliable option.

The automatic conversion only happens when the location has no coordinates. Changing the
`address` of a location that already has coordinates does **not** move it: send the new
`location.coordinates` in the same request.

## Endpoints

| Method | Path | Description | Key scope |
|---|---|---|---|
| `GET` | `/v2/locators/:locator_id/locations` | List the locations of a locator | organization |
| `POST` | `/v2/locators/:locator_id/locations` | Create a location (or update the one with the same `extid`) | organization |
| `GET` | `/v2/locators/:locator_id/locations/:location_id` | Retrieve a location | organization |
| `PUT` | `/v2/locators/:locator_id/locations/:location_id` | Update a location | organization |
| `DELETE` | `/v2/locators/:locator_id/locations/:location_id` | Delete a location | organization |

`:locator_id` is always the `_id` of the locator, never its handle.

To write all the locations of a locator in one call, see
[Create or replace a locator](/reference/locators/#create-or-replace-a-locator).

### List the locations of a locator

`GET /v2/locators/:locator_id/locations`

Returns all the locations of the given locator that belong to the organization of the API key.
This is a back-office listing: it takes no geographic or text search parameter and returns every
location, whatever its position.

**Key scope:** organization. A `team` or `user` scoped key is answered with `403`.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `locator_id` | string (id) | The `_id` of the locator. |

**Query parameters**

None. There is no pagination, filtering, search or sorting: the whole list is returned, in no
guaranteed order.

**Request body**

None.

**Response**

`200 OK` with a JSON array of [Location objects](#the-location-object). The array is empty when
the locator has no location, and also when `locator_id` is unknown or designates a locator of
another organization (no `404` in that case).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key scope is not `organization`. |
| `500` | Malformed `locator_id`, or unexpected error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678/locations' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
[
  {
    "_id": "5f1e9b2a8c4d3e0012345679",
    "org": "5f1e9b2a8c4d3e0012345600",
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
    "org": "5f1e9b2a8c4d3e0012345600",
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

### Create a location

`POST /v2/locators/:locator_id/locations`

Adds a location to a locator of the organization.

The call is an **upsert keyed on `extid`**:

- with an `extid` that no location of your organization has yet, a new location is created;
- with an `extid` already carried by a location of your organization, that location is updated
  with the fields of the body and attached to `:locator_id` (even if it was listed on another of
  your locators). No duplicate is created;
- without `extid`, a new location is created on every call.

If the body has no `location.coordinates` but has an `address`, the address is converted to
coordinates (see [Coordinates and address](#coordinates-and-address)).

**Key scope:** organization. A `team` or `user` scoped key is answered with `403`.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `locator_id` | string (id) | The `_id` of the locator. It must belong to the organization of the key. |

**Query parameters**

None.

**Request body**

No field is mandatory, but a useful location has at least a `name`, a `link`, an `extid`, and
either `location.coordinates` or an `address`.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `extid` | string | no (recommended) | none | Your identifier for the place; upsert key. See above. |
| `name` | string | no (recommended) | none | Name of the place. |
| `address` | string | no | none | Postal address. Converted to coordinates when `location.coordinates` is absent. |
| `location.type` | string | no | `"Point"` | Must be `"Point"` when sent. |
| `location.coordinates` | array of 2 numbers | no | derived from `address` when possible | `[longitude, latitude]` in decimal degrees. |
| `picture_url` | string | no | none | Picture of the place. |
| `link` | string | no (recommended) | none | Booking page path or absolute URL opened when the visitor chooses the place. |

**Response**

`201 Created` with the [Location object](#the-location-object), both when the location was
created and when an existing one (same `extid`) was updated.

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key scope is not `organization`, or the locator belongs to another organization. |
| `404` | No locator has this `locator_id`. |
| `500` | Malformed `locator_id`; invalid data (for example coordinates out of range or not in `[longitude, latitude]` order); temporary failure while converting the address to coordinates; or unexpected error. |

**Example**

```bash
curl --request POST 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678/locations' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "extid": "store-003",
    "name": "Acme Marseille",
    "address": "20 quai du Port, 13002 Marseille",
    "location": { "type": "Point", "coordinates": [5.3698, 43.2965] },
    "picture_url": "https://www.example.com/img/store-003.jpg",
    "link": "/acme-marseille"
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e001234567b",
  "org": "5f1e9b2a8c4d3e0012345600",
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

### Retrieve a location

`GET /v2/locators/:locator_id/locations/:location_id`

Returns one location of the organization. The location is looked up by `location_id` within the
organization of the key.

**Key scope:** organization. A `team` or `user` scoped key is answered with `403`.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `locator_id` | string (id) | The `_id` of the locator the location is listed on. |
| `location_id` | string (id) | The `_id` of the location. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with the [Location object](#the-location-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key scope is not `organization`. |
| `404` | No location with this id belongs to the organization of the key. Empty body. |
| `500` | Malformed `location_id`, or unexpected error. |

**Example**

```bash
curl --request GET 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678/locations/5f1e9b2a8c4d3e0012345679' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345679",
  "org": "5f1e9b2a8c4d3e0012345600",
  "locator": "5f1e9b2a8c4d3e0012345678",
  "extid": "store-001",
  "name": "Acme Paris Centre",
  "address": "10 rue de Rivoli, 75004 Paris",
  "location": { "type": "Point", "coordinates": [2.3601, 48.8553] },
  "picture_url": "https://www.example.com/img/store-001.jpg",
  "link": "/acme-paris-centre",
  "createdAt": "2026-01-15T09:30:00.000Z",
  "updatedAt": "2026-01-15T09:30:00.000Z"
}
```

### Update a location

`PUT /v2/locators/:locator_id/locations/:location_id`

Updates a location of the organization. Only the fields present in the body are changed (partial
update). The merge is done at the top level: when you send `location`, send it complete
(`coordinates`, and optionally `type`).

Restrictions:

- **Only a location that has an `extid` can be updated.** For a location created without
  `extid` the request fails with `500`; delete it and create it again with an `extid`.
- `extid`, `_id`, `org` and `locator` are not updatable: do not send them. To move a location to
  another locator, use [Create a location](#create-a-location) on the target locator with the
  same `extid`.
- Changing `address` alone does not recompute the coordinates; send `location.coordinates` too.

**Key scope:** organization. A `team` or `user` scoped key is answered with `403`.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `locator_id` | string (id) | The `_id` of the locator the location is listed on. |
| `location_id` | string (id) | The `_id` of the location. |

**Query parameters**

None.

**Request body**

All fields are optional.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | string | no | unchanged | Name of the place. |
| `address` | string | no | unchanged | Postal address (display only when the location already has coordinates). |
| `location` | object | no | unchanged | Replaces the whole position: `{"type": "Point", "coordinates": [longitude, latitude]}`. |
| `picture_url` | string | no | unchanged | Picture of the place. |
| `link` | string | no | unchanged | Booking page path or absolute URL. |

**Response**

`200 OK` with the updated [Location object](#the-location-object).

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key scope is not `organization`. |
| `404` | No location with this id belongs to the organization of the key (unknown id, malformed id, or location of another organization). Empty body. |
| `500` | The location has no `extid`; an attempt to change `extid`; invalid data (for example coordinates out of range); or unexpected error. |

**Example**

```bash
curl --request PUT 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678/locations/5f1e9b2a8c4d3e0012345679' \
  --header 'Authorization: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "Acme Paris Rivoli",
    "link": "/acme-paris-rivoli"
  }'
```

```json
{
  "_id": "5f1e9b2a8c4d3e0012345679",
  "org": "5f1e9b2a8c4d3e0012345600",
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

### Delete a location

`DELETE /v2/locators/:locator_id/locations/:location_id`

Deletes a location of the organization. It disappears from the locator page immediately. The
booking page designated by its `link` is not affected.

**Key scope:** organization. A `team` or `user` scoped key is answered with `403`.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `locator_id` | string (id) | The `_id` of the locator the location is listed on. |
| `location_id` | string (id) | The `_id` of the location. |

**Query parameters**

None.

**Request body**

None.

**Response**

`200 OK` with a JSON object summarizing the deletion (this `DELETE` returns a body):

| Field | Type | Description |
|---|---|---|
| `n` | number | Number of locations deleted: `1`. |
| `ok` | number | `1` when the operation was executed. |

**Errors**

| Status | When |
|---|---|
| `401` | Missing, unknown or deactivated API key. |
| `403` | The key scope is not `organization`. |
| `404` | No location with this id belongs to the organization of the key. The body is the same summary object with `n` equal to `0`. |
| `500` | Malformed `location_id`, or unexpected error. |

**Example**

```bash
curl --request DELETE 'https://api.vyte.in/v2/locators/5f1e9b2a8c4d3e0012345678/locations/5f1e9b2a8c4d3e0012345679' \
  --header 'Authorization: YOUR_API_KEY'
```

```json
{
  "n": 1,
  "ok": 1
}
```

## Notes and caveats

- **Coordinates are `[longitude, latitude]`**, longitude first. Swapping them either fails or
  puts the place somewhere else on the globe.
- **Always set an `extid`.** It makes `POST` idempotent (safe to retry and to re-run a full
  synchronization) and it is required by `PUT`. A `POST` without `extid` creates a duplicate on
  every call.
- **`extid` is unique per organization, not per locator.** A `POST` with an `extid` that exists
  on another of your locators moves that location to the locator of the path.
- **`POST` always answers `201`**, whether the location was created or updated.
- **The location is identified by `location_id` within your organization** for `GET`, `PUT` and
  `DELETE`; always pass the `locator_id` of the locator it is listed on.
- **Listing an unknown locator returns `200` with an empty array**, not `404`.
- **Address conversion is best effort.** When only an `address` is sent and no position is found
  for it, the location is created without `location` and cannot be found by proximity. Check the
  `location` field of the response, or send coordinates yourself.
- **Changing the address does not move the point.** Send new coordinates with the new address.
- **Bulk synchronization.** `POST /v2/locators` with a `locations` array replaces the whole list
  of a locator in one call and deletes the locations missing from the array; see
  [Create or replace a locator](/reference/locators/#create-or-replace-a-locator).
- **Deleting a locator does not delete its locations.** Delete them explicitly.
- **`link` is not validated.** Vyte does not check that the path designates an existing booking
  page; a wrong path sends visitors to a page that does not exist.
- Location data (name, address, coordinates, picture, link, `extid`) is displayed to the public
  by the locator page: do not store confidential information in it.
- Lists are not paginated.
