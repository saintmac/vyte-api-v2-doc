---
pageClass: reference-page
---

# Locators

::::: panel
:::: left
You can use the `/v2/locators` endpoints to manage the locators for your organization.
::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/locators" href="#list-all-locators"/>
  <endpoint method="get" path="/v2/locators/:handle" href="#retrieve-a-locator"/>
  <endpoint method="post" path="/v2/locators" href="#create-a-locator"/>
  <endpoint method="put" path="/v2/locators/:locator_id" href="#update-a-locator"/>
  <endpoint method="delete" path="/v2/locators/:locator_id" href="#delete-a-locator"/>
</endpoints>

::::

:::::

## The locator object

::::: panel
:::: left

<attributes title="Attributes">

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
Whether or not to show a Geolocation button on the address field.
</attribute>

<attribute name="_id" type="string">
Unique identifier for the locator.
</attribute>

<attribute name="handle" type="string">

A unique identifier that let you access the locator at `https://vyte.in/locators/:handle`

</attribute>

<attribute name="org" type="string">

The `id`of your organization.

</attribute>

<attribute name="postcode_filter" type="string">

A [Regex](https://en.wikipedia.org/wiki/Regular_expression) to restrain the adress to certain postcodes.

</attribute>

<attribute name="address_postfix" type="string">
An address part which will be added automatically to the address (for example, the country)
</attribute>

<attribute name="address_region_bias" type="string">
Used by Google API to restrict auto-completion proposals to a certain area.
</attribute>

<attribute name="lang" type="string" :isLast=true>

Language for the locator. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="max_distance" type="number">

Maximum distance (in meters) around the locations.

</attribute>

<attribute name="message" type="string">

Message shown on the locator page.

</attribute>

<attribute name="title" type="string">

Title on the locator page.

</attribute>
</attributes>

::::

:::: right

> THE LOCATOR OBJECT

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
    "label": "Back to locator"
  },
  "geolocation": false,
  "_id": "5ef9f3a3993a4d632a5c84f1",
  "handle": "my-locator",
  "org": "5ef0cb128f284274b2361323",
  "postcode_filter": "",
  "address_postfix": "England",
  "address_region_bias": "en",
  "lang": "en",
  "max_distance": 150000,
  "message": "Find on of our locations around you for the meeting.",
  "title": "Available locations"
}
```

::::

:::::

## List all locators

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/locators HTTP/1.1
```

<attributes title="Path parameters" :isEmpty=true />

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns an array of `Locator` objects if there is some existing locators. Otherwise, returns an empty array.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request GET 'https://api.vyte.in/v2/locators' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'
```

> RESPONSE SAMPLE

```json light-code
[
  {
    "no_results": {
      "button": {
        "label": "Label",
        "link": "https://vyte.com"
      },
      "message": "There is no locations available."
    },
    "back_button": {
      "label": "Back to locator"
    },
    "geolocation": false,
    "_id": "5ef9f3a3993a4d632a5c84f1",
    "handle": "my-locator",
    "org": "5ef0cb128f284274b2361323",
    "_v": 0,
    "postcode_filter": "",
    "address_postfix": "England",
    "address_region_bias": "en",
    "lang": "en",
    "max_distance": 150000,
    "message": "Find on of our locations around you for the meeting.",
    "title": "Available locations"
  }
]
```

::::

:::::

## Retrieve a locator

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/locators/:handle HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="handle" type="string" :required=true>

The `handle` of the locator.

</attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns a `Locator` object if a valid handle was provided, and returns an error otherwise.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request GET 'https://api.vyte.in/v2/locators/my-locator' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0'
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
    "label": "Back to locator"
  },
  "geolocation": false,
  "_id": "5ef9f3a3993a4d632a5c84f1",
  "handle": "my-locator",
  "org": "5ef0cb128f284274b2361323",
  "_v": 0,
  "postcode_filter": "",
  "address_postfix": "England",
  "address_region_bias": "en",
  "lang": "en",
  "max_distance": 150000,
  "message": "Find on of our locations around you for the meeting.",
  "title": "Available locations"
}
```

::::

:::::

## Create a locator

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/locators HTTP/1.1
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

A unique identifier set by yourself. _The namespace is global for all the organizations so the_ `handle` _must be unique in the global namespace._

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

Language for the locator. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="max_distance" type="number">

Maximum distance around the locations (in meters).

</attribute>

<attribute name="message" type="string">

Message shown on the locator page.

</attribute>

<attribute name="title" type="string">

Title on the locator page.

</attribute>
</attributes>

<returns title="Returns">

Returns the created `Locator` object if a valid handle was provided, and returns an error otherwise.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request POST 'https://api.vyte.in/v2/locators' \
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
    "label": "Back to locator"
  },
  "geolocation": false,
  "handle": "my-locator",
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
    "label": "Back to locator"
  },
  "geolocation": false,
  "_id": "5f0f64e22003d0340e2a9624",
  "handle": "my-locator",
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

## Update a locator

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
POST /v2/locators/:locator_id HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="locator_id" type="string" :required=true>

The `_id` of the locator. Be careful, this is not the `handle` but the `_id` given by Vyte to the locator.

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

A unique identifier set by yourself. _The namespace is global for all the organizations so the_ `handle` _must be unique in the global namespace._

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

Language for the locator. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
Default is `en`.

</attribute>

<attribute name="max_distance" type="number">

Maximum distance around the locations (in meters).

</attribute>

<attribute name="message" type="string">

Message shown on the locator page.

</attribute>

<attribute name="title" type="string">

Title on the locator page.

</attribute>
</attributes>

<returns title="Returns">

Returns the created `Locator` object if a valid handle was provided, and returns an error otherwise.

</returns>

::::

:::: right

> CODE SAMPLE

```shell
curl --request PUT 'https://api.vyte.in/v2/locators/5f0f64e22003d0340e2a9624' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '{
  "title": "This is my first locator."
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
    "label": "Back to locator"
  },
  "geolocation": false,
  "_id": "5f0f64e22003d0340e2a9624",
  "handle": "my-locator",
  "org": "5ef0cb128f284274b2361323",
  "__v": 0,
  "lang": "en",
  "max_distance": 150000,
  "message": "Find on of our locations around you for the meeting.",
  "title": "This is my first locator."
}
```

::::

:::::

## Delete a locator

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
DELETE /v2/locators/:locator_id HTTP/1.1
```

<attributes title="Path parameters">
<attribute name="locator_id" type="string" :required=true>

The `_id` of the locator. Be careful, this is not the `handle` but the `_id` given by Vyte to the locator.

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
curl --request DELETE 'https://api.vyte.in/v2/locators/5f0f64e22003d0340e2a9624' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
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
