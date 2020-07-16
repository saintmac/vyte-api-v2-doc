# Locations

::::: panel
:::: left

`Locators` are composed of `Locations`.

To manage the `Locations` of a `Locator`, you can use the `/v2/locators/:locator_id/locations` endpoints.


::::

:::: right

<endpoints>
  <endpoint method="get" path="/v2/locators/:locator_id/locations" href="#list-all-locations"/>
  <endpoint method="get" path="/v2/locators/:locator_id/locations/:locations_id" href="#retrieve-a-location"/>
  <endpoint method="post" path="/v2/locators/:locator_id/locations" href="#create-a-location"/>
  <endpoint method="put" path="/v2/locators/:locator_id/locations/:location_id" href="#update-a-location"/>
  <endpoint method="delete" path="/v2/locators/:locator_id/locations/:location_id" href="#dekete-a-location"/>
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

<attribute name="no_results" type="hash">

Define how it would look like if there is no results.

<attributes :isChild=true>
<attribute name="button" type="hash" :parentNames="['no_results']" :isChild=true>

Options for the button.

  <attributes :isChild=true>
    <attribute name="label" type="string" :parentNames="['no_results', 'button']" :isChild=true>
      Button label.
    </attribute>
    <attribute name="link" type="string" :parentNames="['no_results', 'button']" :isChild=true :isLast=true>
      Button link.
    </attribute>
  </attributes>
</attribute>

<attribute name="message" type="string" :isChild=true :isLast=true :parentNames="['no_results']">
Message if no results.
</attribute>

</attributes>
</attribute>

<attribute name="back_button" type="hash">

Options for the back button.

<attributes :isChild=true>
<attribute name="label" type="string" :isChild=true :isLast=true :parentNames="['back_button']">
Button label.
</attribute>
</attributes>
</attribute>

<attribute name="geolocation" type="boolean">
Whether or not you to activate the around me feature.
</attribute>

<attribute name="handle" type="string" :required=true>

A unique identifier set by yourself. *The namespace is global for all the organizations so the* `handle` *must be unique in the global namespace.*

</attribute>

<attribute name="postcode_filter" type="string">
If you want to restrain the adress to a certain Postcode.
</attribute>

<attribute name="address_postfix" type="string">
An address part which will be added automatically to the address (for example, the country)
</attribute>

<attribute name="address_region_bias" type="string">
Used by Google API to restrict auto-completion proposals to a certain area.
</attribute>

<attribute name="lang" type="string" :isLast=true>

Language for the location. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="max_distance" type="number">

Maximum distance around the locations (in meters).

</attribute>

<attribute name="message" type="string">

Message shown on the location page.

</attribute>

<attribute name="title" type="string">

Title on the location page.

</attribute>
</attributes>

<returns title="Returns">

Returns the created `location` object if a valid handle was provided, and returns an error otherwise.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request POST 'https://api-dev2.vyte.in/v2/locations' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
  "no_results": {
    "button": {
      "label": "Label",
      "link": "https://vyte.com"
    },
    "message": "There is no locations available."
  },
  "back_button": {
    "label": "Back to location"
  },
  "geolocation": false,
  "handle": "my-location",
  "org": "5ef0cb128f284274b2361323",
  "lang": "en",
  "max_distance": 150000,
  "message": "Find on of our locations around you for the meeting.",
  "title": "Available locations"
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "no_results": {
    "button": {
      "label": "Label",
      "link": "https://vyte.com"
    },
    "message": "There is no locations available."
  },
  "back_button": {
    "label": "Back to location"
  },
  "geolocation": false,
  "_id": "5f0f64e22003d0340e2a9624",
  "handle": "my-location",
  "org": "5ef0cb128f284274b2361323",
  "__v": 0,
  "lang": "en",
  "max_distance": 150000,
  "message": "Find on of our locations around you for the meeting.",
  "title": "Available locations"
}
```

::::

:::::

## Update a location

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/locations HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="location_id" type="string" :required=true>

The `_id` of the location. Be careful, this is not the `handle` but the `_id` given by Vyte to the location.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<attributes title="Body parameters">

<attribute name="no_results" type="hash">

Define how it would look like if there is no results.

<attributes :isChild=true>
<attribute name="button" type="hash" :parentNames="['no_results']" :isChild=true>

Options for the button.

  <attributes :isChild=true>
    <attribute name="label" type="string" :parentNames="['no_results', 'button']" :isChild=true>
      Button label.
    </attribute>
    <attribute name="link" type="string" :parentNames="['no_results', 'button']" :isChild=true :isLast=true>
      Button link.
    </attribute>
  </attributes>
</attribute>

<attribute name="message" type="string" :isChild=true :isLast=true :parentNames="['no_results']">
Message if no results.
</attribute>

</attributes>
</attribute>

<attribute name="back_button" type="hash">

Options for the back button.

<attributes :isChild=true>
<attribute name="label" type="string" :isChild=true :isLast=true :parentNames="['back_button']">
Button label.
</attribute>
</attributes>
</attribute>

<attribute name="geolocation" type="boolean">
Whether or not you to activate the around me feature.
</attribute>

<attribute name="handle" type="string">

A unique identifier set by yourself. *The namespace is global for all the organizations so the* `handle` *must be unique in the global namespace.*

</attribute>

<attribute name="postcode_filter" type="string">
If you want to restrain the adress to a certain Postcode.
</attribute>

<attribute name="address_postfix" type="string">
An address part which will be added automatically to the address (for example, the country)
</attribute>

<attribute name="address_region_bias" type="string">
Used by Google API to restrict auto-completion proposals to a certain area.
</attribute>

<attribute name="lang" type="string" :isLast=true>

Language for the location. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="max_distance" type="number">

Maximum distance around the locations (in meters).

</attribute>

<attribute name="message" type="string">

Message shown on the location page.

</attribute>

<attribute name="title" type="string">

Title on the location page.

</attribute>
</attributes>

<returns title="Returns">

Returns the created `location` object if a valid handle was provided, and returns an error otherwise.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request PUT 'https://api-dev2.vyte.in/v2/locations/5f0f64e22003d0340e2a9624' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
  "title": "This is my first location."
}'
```

> RESPONSE SAMPLE

```json light-code
{
  "no_results": {
    "button": {
      "label": "Label",
      "link": "https://vyte.com"
    },
    "message": "There is no locations available."
  },
  "back_button": {
    "label": "Back to location"
  },
  "geolocation": false,
  "_id": "5f0f64e22003d0340e2a9624",
  "handle": "my-location",
  "org": "5ef0cb128f284274b2361323",
  "__v": 0,
  "lang": "en",
  "max_distance": 150000,
  "message": "Find on of our locations around you for the meeting.",
  "title": "This is my first location."
}
```

::::

:::::

## Update a location

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/locations HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="location_id" type="string" :required=true>

The `_id` of the location. Be careful, this is not the `handle` but the `_id` given by Vyte to the location.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns the created `location` object if a valid handle was provided, and returns an error otherwise.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request DELETE 'https://api-dev2.vyte.in/v2/locations/5f0f64e22003d0340e2a9624' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code

```

::::

:::::
