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

Custom your message. Like 'Nothing is found'

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

Maxx distance from client's location in meters.

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

## Retrieve locator

## Update locator

## Delete locator


