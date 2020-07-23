---
pageClass: reference-page
---

# Locations

::::: panel
:::: left

`Locators` are composed of `Locations`.

To manage the `Locations` of a `Locator`, you can use the `/v2/locators/:locator_id/locations` endpoints.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/locators/:locator_id/locations" href="#list-all-locations"/>
  <endpoint method="get" path="/v2/locators/:locator_id/locations/:locations_id" href="#retrieve-a-location"/>
  <endpoint method="post" path="/v2/locators/:locator_id/locations" href="#create-a-location"/>
  <endpoint method="put" path="/v2/locators/:locator_id/locations/:location_id" href="#update-a-location"/>
  <endpoint method="delete" path="/v2/locators/:locator_id/locations/:location_id" href="#delete-a-location"/>
</endpoints>

::::

:::::

## The location object

::::: panel
:::: left

<attributes title="Attributes">

<attribute name="location" type="hash">

Geolocation information of the location.

<attributes :isChild=true>

<attribute name="type" type="string" :isChild=true :isLast=true :parentNames="['location']">

Type of coordinates. Default is `Point`.

</attribute>

<attribute name="coordinates" type="array of numbers" :parentNames="['location']" :isChild=true>

Coordinates of the location. The first one is the latitude and the second one is the longitude, both expressed in [decimal degress](https://en.wikipedia.org/wiki/Decimal_degrees).

</attribute>

</attributes>
</attribute>

<attribute name="_id" type="string">
Unique identifier for the location.
</attribute>

<attribute name="name" type="string">
Name of the location.
</attribute>

<attribute name="address" type="string">
Address of the location. In case there is no coordinates provided, we use this address to retrieve them.
</attribute>

<attribute name="picture_url" type="string">
Picture url to illustrate the location.
</attribute>

<attribute name="link" type="string">
Link of the location.
</attribute>

<attribute name="extid" type="string">

An external `id` set by yourself to identify the location on your side.

</attribute>

<attribute name="org" type="string">

The `id` of your organization.

</attribute>

<attribute name="locator" type="string">

The locator `id`.

</attribute>

</attributes>

::::

:::: right

> THE LOCATION OBJECT

```json light-code
{
  "location": {
    "type": "Point",
    "coordinates": [
      33.631839,
      27.380583
    ]
  },
  "_id": "5ef202a1fe70c73e37549514",
  "name": "Desert Breath",
  "address": "Egypt",
  "picture_url": "https://twistedsifter.files.wordpress.com/2014/03/desert-breath-land-art-installation-sahara-egypt-crop-circle-dast-arteam-2.jpg",
  "link": "/exam-desert-breath",
  "extid": "our-mysterious-meeting-place",
  "org": "5ef0cb128f284274b2361323",
  "locator": "5ef9f3a3993a4d632a5c73e0",
}
```

::::

:::::

## List all locations

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/locators/:locator_id/locations HTTP/1.1
```

<attributes title="Path parameters" :isEmpty=true />

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns an array of `location` objects if there is some existing locations. Otherwise, returns an empty array.

</returns>

::::

:::: right
> CODE SAMPLE

```shell
curl --request GET 'https://api-dev2.vyte.in/v2/locators/5ef9f3a3993a4d632a5c73e0/locations' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'
```

> RESPONSE SAMPLE

```json light-code
[
  {
    "location": {
      "type": "Point",
      "coordinates": [
        33.631839,
        27.380583
      ]
    },
    "_id": "5ef202a1fe70c73e37549514",
    "name": "Desert Breath",
    "address": "Egypt",
    "picture_url": "https://twistedsifter.files.wordpress.com/2014/03/desert-breath-land-art-installation-sahara-egypt-crop-circle-dast-arteam-2.jpg",
    "link": "/exam-desert-breath",
    "extid": "our-mysterious-meeting-place",
    "org": "5ef0cb128f284274b2361323",
    "locator": "5ef9f3a3993a4d632a5c73e0",
  },
]
```

::::

:::::

## Retrieve a location

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/locators/:locator_id/locations/:location_id HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="locator_id" type="string" :required=true>

The `id` of the locator.

</attribute>
<attribute name="location_id" type="string" :required=true>

The `id` of the location.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns a `location` object if a valid `locator_id` and `location_id` were provided, and returns an error otherwise.

</returns>

::::

:::: right
> CODE SAMPLE

```shell
curl --request GET 'https://api-dev2.vyte.in/v2/locators/5ef9f3a3993a4d632a5c73e0/locations/5ef202a1fe70c73e37549514' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'
```

> RESPONSE SAMPLE

```json light-code
{
  "location": {
    "type": "Point",
    "coordinates": [
      33.631839,
      27.380583
    ]
  },
  "_id": "5ef202a1fe70c73e37549514",
  "name": "Desert Breath",
  "address": "Egypt",
  "picture_url": "https://twistedsifter.files.wordpress.com/2014/03/desert-breath-land-art-installation-sahara-egypt-crop-circle-dast-arteam-2.jpg",
  "link": "/exam-desert-breath",
  "extid": "our-mysterious-meeting-place",
  "org": "5ef0cb128f284274b2361323",
  "locator": "5ef9f3a3993a4d632a5c73e0",
}
```

::::

:::::

## Create a location

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/locations HTTP/1.1
```

<attributes title="Path parameters" :isEmpty=true />

<attributes title="Query parameters" :isEmpty=true />

<attributes title="Body parameters">

<attribute name="location" type="hash" :required=true>

Geolocation information of the location. **Required if no address is provided.**

<attributes :isChild=true>

<attribute name="type" type="string" :isChild=true :isLast=true :parentNames="['location']" :required=true>

Type of coordinates. Default is `Point`.

</attribute>

<attribute name="coordinates" type="array of numbers" :parentNames="['location']" :isChild=true :required=true>

Coordinates of the location. The first one is the latitude and the second one is the longitude, both expressed in [decimal degress](https://en.wikipedia.org/wiki/Decimal_degrees).

</attribute>

</attributes>
</attribute>

<attribute name="name" type="string" :required=true>
Name of the location.
</attribute>

<attribute name="address" type="string" :required=true>

Address of the location. **Required if no coordinates are provided.**

</attribute>

<attribute name="picture_url" type="string">
Picture url to illustrate the location.
</attribute>

<attribute name="link" type="string">
Link of the location.
</attribute>

<attribute name="extid" type="string" :required=true>

An external `id` set by yourself to identify the location on your side.

</attribute>

</attributes>

<returns title="Returns">

Returns the created `location` if a valid body was provided, and returns an error otherwise.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request POST 'https://api-dev2.vyte.in/v2/locations' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
  "location": {
    "type": "Point",
    "coordinates": [
      33.631839,
      27.380583
    ]
  },
  "name": "Desert Breath",
  "address": "Egypt",
  "picture_url": "https://twistedsifter.files.wordpress.com/2014/03/desert-breath-land-art-installation-sahara-egypt-crop-circle-dast-arteam-2.jpg",
  "link": "/exam-desert-breath",
  "extid": "our-mysterious-meeting-place",
  "org": "5ef0cb128f284274b2361323",
  "locator": "5ef9f3a3993a4d632a5c73e0",
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "location": {
    "type": "Point",
    "coordinates": [
      33.631839,
      27.380583
    ]
  },
  "_id": "5ef202a1fe70c73e37549514",
  "name": "Desert Breath",
  "address": "Egypt",
  "picture_url": "https://twistedsifter.files.wordpress.com/2014/03/desert-breath-land-art-installation-sahara-egypt-crop-circle-dast-arteam-2.jpg",
  "link": "/exam-desert-breath",
  "extid": "our-mysterious-meeting-place",
  "org": "5ef0cb128f284274b2361323",
  "locator": "5ef9f3a3993a4d632a5c73e0",
}
```

::::

:::::

## Update a location

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/locators/:locator_id/locations/:location_id HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="locator_id" type="string" :required=true>

The `id` of the locator.

</attribute>
<attribute name="location_id" type="string" :required=true>

The `id` of the location.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<attributes title="Body parameters">

<attribute name="location" type="hash">

Geolocation information of the location.

<attributes :isChild=true>

<attribute name="type" type="string" :isChild=true :isLast=true :parentNames="['location']">

Type of coordinates. Default is `Point`.

</attribute>

<attribute name="coordinates" type="array of numbers" :parentNames="['location']" :isChild=true>

Coordinates of the location. The first one is the latitude and the second one is the longitude, both expressed in [decimal degress](https://en.wikipedia.org/wiki/Decimal_degrees).

</attribute>

</attributes>
</attribute>

<attribute name="name" type="string">
Name of the location.
</attribute>

<attribute name="address" type="string">

Address of the location.

</attribute>

<attribute name="picture_url" type="string">
Picture url to illustrate the location.
</attribute>

<attribute name="link" type="string">
Link of the location.
</attribute>

<attribute name="extid" type="string">

An external `id` set by yourself to identify the location on your side.

</attribute>

</attributes>

<returns title="Returns">

Returns the updated `location` if a valid body was provided, and returns an error otherwise.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request PUT 'https://api-dev2.vyte.in/v2/locators/5ef9f3a3993a4d632a5c73e0/locations/5ef202a1fe70c73e37549514' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Mysterious place",
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "location": {
    "type": "Point",
    "coordinates": [
      33.631839,
      27.380583
    ]
  },
  "_id": "5ef202a1fe70c73e37549514",
  "name": "Mysterious place",
  "address": "Egypt",
  "picture_url": "https://twistedsifter.files.wordpress.com/2014/03/desert-breath-land-art-installation-sahara-egypt-crop-circle-dast-arteam-2.jpg",
  "link": "/exam-desert-breath",
  "extid": "our-mysterious-meeting-place",
  "org": "5ef0cb128f284274b2361323",
  "locator": "5ef9f3a3993a4d632a5c73e0",
}
```

::::

:::::

## Delete a location

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
DELETE /v2/locators/:locator_id/locations/:location_id HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="locator_id" type="string" :required=true>

The `id` of the locator.

</attribute>
<attribute name="location_id" type="string" :required=true>

The `id` of the location.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns an object containing the number of row affected and the status if there is no error, and returns an error otherwise.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request DELETE 'https://api-dev2.vyte.in/v2/locators/5ef9f3a3993a4d632a5c73e0/locations/5ef202a1fe70c73e37549514' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'
```

> RESPONSE SAMPLE

```json light-code
{
  "n": 1,
  "ok": 1
}
```

::::

:::::
