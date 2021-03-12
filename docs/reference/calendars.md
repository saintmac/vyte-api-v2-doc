---
{
  "pageClass": "reference-page"
}
---

# Calendars

:::::panel

:::: left

You can use the `/v2/users/:user_id/calendars` endpoints to manage the calendars of your users.

> This API is an extension of the Users API, that's why all url are prefixed with `/users/:user_id/`. You can refer to the [User API reference](users.md) to have more informations about user creation.

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users/:user_id/calendars" href="#retrieve-the-calendars-of-a-user"></endpoint>
  <endpoint method="put" path="/v2/users/:user_id/calendars" href="#update-the-calendars-of-a-user"></endpoint>
  <endpoint method="delete" path="/v2/users/:user_id/calendars/:calendar_id" href="#delete-the-calendar-of-a-user"></endpoint>
</endpoints>
::::

:::::

## The calendar object

::::: panel
:::: left

GET method return the `calendarList` objects, which contains `calendars` of the user. Every `calendar` might contain several `subcalendars`.

<attributes title="Attributes">
<attribute name="sync_suggestions" type="Boolean">
  Property of `calendarList` object, if set true - synchronize suggested dates with calendars. Default is true.
 </attribute>

<attribute name="_id" type="ObjectId">
  The `_id` of calendarList.
 </attribute>
 
 <attribute name="belongs_to" type="ObjectId">
  The `_id` of user of calendarList.
 </attribute>

</attributes>
 
 ###Calendar properties
 <attributes title="Attributes">
<attribute name="access_broken" type="Boolean">
  Connection status, false by default.
 </attribute>

<attribute name="_id" type="ObjectId">
  The `_id` of calendar.
 </attribute>
 
<attribute name="primary" type="Boolean">
  The user can have several calendars, but only one will be the main calendar.
 </attribute>
 
<attribute name="name" type="String">
  The name of calendar defined by user.
 </attribute>
 
<attribute name="source" type="String">
  The source of calendar. It might be Vyte, Google, Office 365 and other sources.
 </attribute>
 
<attribute name="source_id" type="String">
  The `_id` of source of the calendar.
 </attribute>
 
<attribute name="subcalendars" type="Array">
  Array of `subcalendar` Objects.
 </attribute>
</attributes>

###Subcalendar properties
 <attributes title="Attributes">

<attribute name="_id" type="ObjectId">
  The `_id` of calendar.
 </attribute>
 
<attribute name="name" type="String">
  The name of calendar defined by user.
 </attribute>
 
<attribute name="source" type="String">
  The source of calendar. It might be Vyte, Google, Office 365 and other sources.
 </attribute>
 
<attribute name="source_id" type="String">
  The `_id` of source of the calendar.
 </attribute>
 
<attribute name="primary" type="Boolean">
  The user can have several subcalendars, but only one will be the main calendar.
 </attribute>
 
<attribute name="display" type="Boolean">
  If set true, the subcalendar is visible in users calendar.
 </attribute>
 
<attribute name="busy" type="Boolean">
  If set true, the subcalendar will be displayed as busy.
 </attribute>
 
<attribute name="bcolor" type="String">
  Defines the background colour for the subcalendar.
 </attribute>
 
<attribute name="fcolor" type="String">
  Defines the font colour for the subcalendar.
 </attribute>
 
<attribute name="writable" type="Boolean">
 If set true, the user can add and delete events.
 </attribute>
 
</attributes>
 



::::

:::: right

> THE CALENDAR_LIST OBJECT

```json light-code
{ "sync_suggestions": true,
	"_id": "604b9727a7a147a3195f72d2",
	"calendars":
		[ { "access_broken": false,
		"primary": false,
		"_id": "604b9727a7a14726d85f72d6",
		"name": "Vyte",
		"source": "vyte_user",
		"source_id": "604b97276793f6001ef96d7e",
		"subcalendars": 
			[
			{"name": "My Events",
			"source": "vyte_user",
			"source_id": "604b97276793f6001ef96d7e",
			"display": false,
			"busy": true,
			"color_id": "d",
			"bcolor": "#c1defa",
			"primary": false,
			"writable": false
			},
			{"name": "My Events OPTIONS",
			"source": "vyte_user_suggestions",
			"source_id": "604b97276793f6001ef96d7e",
			"display": false,
			"busy": true,
			"color_id": "d",
			"bcolor": "#c1defa",
			"primary": false,
			"writable": false
			}
			]
 			},
		{ "access_broken": true,
		"primary": true,
		"_id": "604b9727a7a147d4d45f72d1",
		"source": "google",
		"name": "testuser@gmail.com",
		"token": "604b97276793f6001ef96d7f",
		"subcalendars": [] } ],
		"belongs_to": "604b97276793f6001ef96d7e",
		"updatedAt": "2021-03-12T16:30:32.230Z",
		"createdAt": "2021-03-12T16:30:31.835Z",
		"__v": 1 }

```

::::

:::::

## Retrieve the calendars of a user

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
GET /v2/users/:user_id/calendars HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `id` of the user whose calendars you want to retrieve.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<returns title="Returns">

An `CalendarList` object if there is no error.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl \
--request GET 'https://api.vyte.in/v2/users/5f2d28fb1e0662e70071d46b/calendars' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
```

> RESPONSE SAMPLE

```json light-code
{ "sync_suggestions": true,
	"_id": "604b9727a7a147a3195f72d2",
	"calendars":
		[ { "access_broken": false,
		"primary": false,
		"_id": "604b9727a7a14726d85f72d6",
		"name": "Vyte",
		"source": "vyte_user",
		"source_id": "604b97276793f6001ef96d7e",
		"subcalendars": 
			[
			{"name": "My Events",
			"source": "vyte_user",
			"source_id": "604b97276793f6001ef96d7e",
			"display": false,
			"busy": true,
			"color_id": "d",
			"bcolor": "#c1defa",
			"primary": false,
			"writable": false
			},
			{"name": "My Events OPTIONS",
			"source": "vyte_user_suggestions",
			"source_id": "604b97276793f6001ef96d7e",
			"display": false,
			"busy": true,
			"color_id": "d",
			"bcolor": "#c1defa",
			"primary": false,
			"writable": false
			}
			]
 			},
		{ "access_broken": true,
		"primary": true,
		"_id": "604b9727a7a147d4d45f72d1",
		"source": "google",
		"name": "testuser@gmail.com",
		"token": "604b97276793f6001ef96d7f",
		"subcalendars": [] } ],
		"belongs_to": "604b97276793f6001ef96d7e",
		"updatedAt": "2021-03-12T16:30:32.230Z",
		"createdAt": "2021-03-12T16:30:31.835Z",
		"__v": 1 }

```

:::::

::::::


## Update the calendars of a user

:::::: panel
::::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
PUT /v2/users/:user_id/calendars HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `id` of the user whose calendar you want to update.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true></attributes>

<attributes title="Body parameters">

<attribute name="name" type="String">
  The name of calendar or sub calendar defined by user.
 </attribute>

<attribute name="primary" type="Boolean">
  The user can have several calendars or subcalendars, but only one will be the main calendar.
 </attribute>

<attribute name="display" type="Boolean">
  If set true, the subcalendar is visible in users calendar.
 </attribute>
 
<attribute name="busy" type="Boolean">
  If set true, the subcalendar will be displayed as busy.
 </attribute>

<attribute name="sync_suggestions" type="Boolean">
  Property of `calendarList` object, if set true - synchronize suggested dates with calendars. Default is true.
 </attribute>

</attributes>

<returns title="Returns">

The updated `CalendarList` object if no error occurred.

</returns>
:::::

::::: right

> CODE SAMPLE

```shell
curl --request PUT 'https://api.vyte.in/v2/users/5f2d4abf1e0662386371d475/calendars' \
--header 'Authorization: vkjvi2bvfo54ssbybmcts0x42z1sbzm6t0mot8trh8i03reno0' \
--header 'Content-Type: application/json' \
--data-raw '
{ 
   "sync_suggestions": false,
   "calendars": [
      {"access_broken": false,
       "primary": false},
       {"access_broken": false,
        "primary": false}
        ]
                }'
```

:::::

::::::

## Delete the calendar of a user

::::: panel
:::: left

> ENDPOINT <small>Authorization `apiKey`</small>

```http
DELETE /v2/users/:user_id/calendars/:calendar_id HTTP/1.1
```

<attributes title="Path parameters">
  <attribute name="user_id" type="string">

The `id` of the user whose availability you want to delete.

  </attribute>
  <attribute name="calendar_id" type="string">

The `id` of the calendar whick you want to delete.

  </attribute>
</attributes>

<attributes title="Query parameters" :isEmpty=true />

<returns title="Returns">

Returns the status if there is no error, and returns an error otherwise.

</returns>

::::

:::: right

```shell
curl --request DELETE 'https://api.vyte.in/v2/users/5f2d4abf1e0662386371d475/calendars/5f2d4abf1e0662386371d466' \
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
