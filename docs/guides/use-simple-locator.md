# Locators
Imagine, you have 30 different shops or offices or any other points. How to direct your client to the nearest ones? Now you can set up and use our simple (yet flexible) locators.

## Create locator
To create our first locator, let's just make a `POST` request at `/v2/locators` :

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/locators' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
  {
    "org": "60afc3fb228757001d737c11",
    "handle": "coaches",
    "picture_url": "https://picture.com/locator",
    "title": "Find the best coach for you",
    "message": "Enable geolocation",
    "footer": "Hey hey <a href='http://www.google.com'>yep</a>",
    "no_results": {
        "message": "nothing is found",
        "button": { label: "try again", link: "http://www.yahoo.com" }
        },
    "back_button": { label: "Choose another one" },
    "max_distance": 13000,
    "lang": "en",
    "locations": [
        {
        "name": "Mike",
        "address": "12 rue Berthollet, 75005 Paris",
        "location": [Object],
        "picture_url": "https://picture.com/123",
        "link": "/coach-bertho/coaching",
        "extid": "123"
        },
        {
        "name": "Phil",
        "address": "12 rue Maine, 75005 Paris",
        "location": [Object],
        "picture_url": "https://picture.com/123",
        "link": "/coach-phil/coaching",
        "extid": "456"
        },
        {
        "name": "Jake",
        "address": "12 rue Vagram, 75005 Paris",
        "location": [Object],
        "picture_url": "https://picture.com/123",
        "link": "/coach-jake/coaching",
        "extid": "789"
        }
    ]
    }
}'
```

## What does all that mean?
Locators have particular properties.

<attributes title="Properties">

<attribute name="org" type="ObjectId" :required=true>

The `_id` of organisation.

</attribute>
<attribute name="handle" type="string" :required=true>

Unique handle which will be be accessible at: `https://vyte.in/locator/handle`

</attribute>
<attribute name="picture_url" type="string">

The link to the locators picture.

</attribute>
<attribute name="title" type="string">

The title of locator.

</attribute>
<attribute name="message" type="string">

Custom messsage.

</attribute>
<attribute name="footer" type="string">

Custom footer message.

</attribute>
<attribute name="lang" type="string">

It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.

</attribute>
<attribute name="no_results" type="object">

What will happen if nothing is found?

</attribute>
<attributes :isChild=true>
<attribute name="message" type="string" :isChild=true :parentNames="['no_results']">

Custom your message. Like 'Nothing is found'.

</attribute>
<attribute name="button" type="object" :isChild=true :parentNames="['no_results']">

Custom the button, proposing the solution.

</attribute>
<attributes :isChild=true>
<attribute name="label" type="string" :isChild=true :parentNames="['no_results', 'button']">

Label of the custom button.

</attribute>
<attribute name="link" type="string" :isChild=true :parentNames="['no_results', 'button']">

Link of the custom button.

</attribute>
</attributes>
<attribute name="back_batton" type="object">

Custom your back button.

</attribute>
<attributes :isChild=true>
<attribute name="label" type="string" :isChild=true :parentNames="['back_button']">

Label of the custom back button.

</attribute>
</attributes>

<attribute name="max_distance" type="number">

Max distance from client's location in meters.

</attribute>
<attribute name="postcode_filter" type="string">

Add filtering by postcode.

</attribute>
<attribute name="address_postfix" type="string">

Add address postfix.

</attribute>
<attribute name="address_region_bias" type="string">

Choose default regions, could be comma separated values. ex: "fr,de".

</attribute>
<attribute name="geolocation" type="boolean">

Set `false` par default.

</attribute>

<attribute name="locations" type="array">

Array of locations of your points/stores/centers. It is an example of `Location` class,  every element includes name, address, coordinates, pictures and link to particular locator.

</attribute>

</attributes>


## List all locators
To list all the locators, you can use `GET` request at `/v2/locators` :
```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/locators' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx'
```
This one will return the array of created locators, if they exist. If you don't have locators yet, it will return empty array with `200` response.

## Retrieve locator
This one works quite the same as listing all the locators, we just need the `handle` of locator. So let's go to `/v2/locators/:handle` using `GET`:

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/locators/stores' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx'
```
It will return the particular locator, if it exists.

## Update or delete locator
To manipulate the locators we use `/v2/locators/:locator_id` endpoints. `PUT`for updating the locator, `DELETE` to delete. One important thing: above we mentioned `Locations`: basically every locator contains the array of `locations`. To modify them we are going to use separate endpoints.

# Locations
Basically `Location` is an element of `Locator`, so every locator can have several locations to show to the user.

## Create the location
There are two ways to create locations:
* Using `POST` at `/v2/locators` while creating the locator for the first time. Useful if you create the locator and already have the list of locations;
* Using `POST` at `/v2/locators/:locator_id/locations`. Useful if you need to add new location to the existing locator.

Let's have a look at the second one :
```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/locators/60afc3fb228757001d737c11/locations' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '
{
    name: "Jim"
    address: "96bis Boulevard Raspail"
    location:
        type: "Point"
        coordinates: [2.3, 48.8]
    picture_url: "https://picture.com/123"
    link: "https://www.agoranov.com/"
    extid: "1234352"
}
'
```

If everything is okay, it should create the object like this:
```json light-code
    {
        "location":
            { "type": "Point",
            "coordinates": ["Array"] },
        "_id": "60b4c4c3b66924001789ba3e",
        "name": "Jim",
        "locator": "0afc3fb228757001d737c11",
        "extid": "1",
        "address": "96bis Boulevard Raspail",
        "picture_url": "https://picture.com/123",
        "link": "https://www.agoranov.com/",
        "extid": "1234352",
        "org": "60b4c4c1b66924001789ba3a",
        "updatedAt": "2021-05-31T11:13:07.067Z",
        "createdAt": "2021-05-31T11:13:07.067Z",
        "__v": 0 }

```
### What do these properties mean?
<attributes title="Properties">

<attribute name="name" type="string">
The name of the point/store/center. Should be easy to identify.
</attribute>

<attribute name="address" type="string">
Address of the point.
</attribute>

<attribute name="location" type="Point">
Coordinates of the point. You can find coordinates in many geo services like [GoogleMaps](https://support.google.com/maps/answer/18539). Here we use the Point type which stores geographical coordinates in [GeoJSON](https://geojson.org) format.
</attribute>

<attribute name="picture_url" type="string">
Link to the picture used for this location.
</attribute>

<attribute name="link" type="string">
Redicrection if the location is chosen.
</attribute>

<attribute name="extid" type="string">
If you have the points in your own database with specific `ids` you can keep them stored as `external_id`.
</attribute>
</attributes>

## Retrieve, update or delete location
For all these manipulations you can you one endpoint: `/v2/locators/:locator_id/locations/:location_id` with `GET`, `PUT` or `DELETE`.
* `GET` will return the object with particular location
* `PUT` will update the location with provided data
* `DELETE` will delete the location with `200` status response

Looks quite easy, right? Let us know what do think!















