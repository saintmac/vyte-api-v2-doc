# Webhooks

## Available webhooks
When registering for webhooks, you register for `actions` on resources. Actions are often called "events" in the webhooks terminology, but since Vyte's main resource is called "Event" we decided to name them `actions`.

### Event resource
This is the main resource on Vyte. An `event` is a meeting, 1-on-1 or group. It can be already confirmed, or still in the planing phase.

Usually an event is created, then confirmed and sometimes updated or cancelled.

#### `event.created`
When an event has been created

#### `event.confirmed`
When an event has been confirmed which means a date and / or place have been decided.

Some events can be created already confirmed. In this case both `event.created` and `event.confirmed` actions are fired.

#### `event.updated`
When an event that was already confirmed has ben edited an reconfirmed.
Usually the final date and / or place has been changed but there is no guarantee of it.

#### `event.cancelled`
When an event, confirmed or not, has been cancelled.

### User resource
A user is someone that has signed up to Vyte.

#### `user.joined`
When a user has joined an organization using a link such as `https://yourapp.vyte.in/organizations/1234/join` .
If you have passed us an external id from your app `extid` as a query parameter, you will get it back as the `resource.account.organization.extid` property




## Authentication for Webhooks
To use webhooks you need to have a Vyte organization and an <a href="#api-keys">API key for your organization</a>

<a href="#authenticating-a-request-with-an-api-key">All requests require to be authenticated</a>

## Creating a webhook
> Example

```
POST https://api.vyte.in/hooks
```

> Body

```json
{
  "action": "event.cancelled",
  "target_url": "https://api.example.com/hooks/12345"
}
```
> Response on success: `201 Created`

```json
{
  "__v": 0,
  "createdAt": "2018-01-04T15:00:58.486Z",
  "updatedAt": "2018-01-04T15:00:58.486Z",
  "organization": "14ce14c8a8ced358c78a5c231d",
  "scope": "organization",
  "action": "event.cancelled",
  "target_url": "https://api.example.com/hooks/12345",
  "_id": "5a4e41aaa8ced3001bf5da77"
}
```

### HTTP request
`POST /hooks`

### Request body

| Field      | Type   | Mandatory | Definition                                                                           |
| ---------- | ------ | --------- | ------------------------------------------------------------------------------------ |
| action     | String | true      | The action that you want to be aware of                                              |
| target_url | String | true      | The URL you want to be called at when the `action` occurs. This must be a https url. |

*The `action` field is often called `event` in the Webhooks terminology.
As Events are the main resource on Vyte's API, we named that field `action` to avoid confusion.*



## Getting a webhook
> Example

```
GET https://api.vyte.in/hooks/5a4e41aaa8ced3001bf5da77
```

> Response on success: `200 OK`

```json
{
  "__v": 0,
  "createdAt": "2018-01-04T15:00:58.486Z",
  "updatedAt": "2018-01-04T15:00:58.486Z",
  "organization": "14ce14c8a8ced358c78a5c231d",
  "scope": "organization",
  "action": "event.cancelled",
  "target_url": "https://api.example.com/hooks/12345",
  "_id": "5a4e41aaa8ced3001bf5da77"
}
```

### HTTP request
`GET /hooks/:hook_id`

where `:hook_id` is the `_id` of the webhook obtained when creating the webhook.



## Updating a webhook
> Example

```
PUT https://api.vyte.in/hooks/5a4e41aaa8ced3001bf5da77
```
> Body

```json
{
  "action": "event.updated",
  "target_url": "https://api.example.com/hooks/54321"
}
```
> Response on success: `200 OK`

```json
{
  "__v": 0,
  "createdAt": "2018-01-04T15:00:58.486Z",
  "updatedAt": "2018-01-04T15:00:58.486Z",
  "organization": "14ce14c8a8ced358c78a5c231d",
  "scope": "organization",
  "action": "event.updated",
  "target_url": "https://api.example.com/hooks/54321",
  "_id": "5a4e41aaa8ced3001bf5da77"
}
```

### HTTP request
`PUT /hooks/:hook_id`

where `:hook_id` is the `_id` of the webhook obtained when creating the webhook.

### Request body

| Field      | Type   | Mandatory | Definition                                                                           |
| ---------- | ------ | --------- | ------------------------------------------------------------------------------------ |
| action     | String | true      | The action that you want to be aware of                                              |
| target_url | String | true      | The URL you want to be called at when the `action` occurs. This must be a https url. |

## Deleting a webhook
> Example

```
DELETE https://api.vyte.in/hooks/1234
```
> Response on success: `204 No Content`

### HTTP request
`DELETE /hooks/:hook_id`

where `:hook_id` is the `_id` of the webhook obtained when creating the webhook.


## Listing all your webhooks
> Example

```
GET https://api.vyte.in/hooks
```

> Response on success: `200 OK`

```json
{
  "hooks": [
    {
      "__v": 0,
      "createdAt": "2018-01-04T15:00:58.486Z",
      "updatedAt": "2018-01-04T15:00:58.486Z",
      "organization": "14ce14c8a8ced358c78a5c231d",
      "scope": "organization",
      "action": "event.cancelled",
      "target_url": "https://api.example.com/hooks/12345",
      "_id": "5a4e41aaa8ced3001bf5da77"
    }
  ]
}
```

### HTTP request
`GET /hooks`

returns a `hooks` array.


## Getting a webhook call
> Example:

```
POST https://api.example.com/hooks/12345
```

> HEADERS:

```
Content-Type: application/json
```

> BODY:

```json
{
  "action": "event.cancelled",
  "resource": {
    "cancelled": "2017-12-01T12:05:00.000Z",
    "confirmed":{"flag": true},
    "created_by":{"email": "user.name@domain.com"},
    "dates":[{"all_day": false, "date": "2017-11-10T11:00:00.000Z", "end_date": "2017-11-10T12:00:00.000Z"}],
    "invitees":[{"full_name": "Person booking a slot name", "email": "jean.dupont@domain.com", "phone": "0601020304"}],
    "lang":"fr",
    "locale":"fr",
    "messages":[{"body": "I’m booking appointment about this"}],
    "places":[{"name": "Office name", "address": "12 rue de Rivoli, 75004, Paris, France"}],
    "timezone":"Europe/Paris",
    "title":"Appointment about topic",
    "vyteme":true
  },
  "organization": "14ce14c8a8ced358c78a5c231d"
}
```


When an action you have subscribed a webhook for is performed on a resource, Vyte will call your API at the `target_url` you provided.

### HTTP request
`POST target_url`
Vyte will perform a POST request at the `target_url` provided

#### Request body
The request body is an array of objects representing actions that have happened on a resource linked to your api key.
You can assume this array will always have a length of 1 but that may change in the future.

Object properties

| Property     | Type   | Always present | Definition                                                                       |
| ------------ | ------ | -------------- | -------------------------------------------------------------------------------- |
| action       | String | true           | The action that happened on the resource. ex: `event.cancelled`                  |
| organization | String | false          | The `id` of the organization linked to that action                               |
| user         | String | false          | The `id` of the user linked to that action                                       |
| resource     | Object | true           | The resource that has been updated by this action. An event object for instance. |
