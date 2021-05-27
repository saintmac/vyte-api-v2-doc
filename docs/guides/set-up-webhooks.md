# Webhooks for flexible scheduling notifications
Webhooks are the easiest and fastest solution for quick notification. If something happens, they send the automated message to particular URL. It works for notification and also integration with different platforms. So, how does it work in Vyte?

## About our hooks
The hook has two main properties: `target_url` and `action`. Target URL leads to the recipient application (your website or app), `action` defines the type of event happened. For now Vyte uses several hooks:

* Event:
    created
    confirmed
    updated
    cancelled
    voted
    new_invitee

* User:
    joined

* Vyteme:
    updated

But it is not all. The funny thing about hooks - they can send also some data, often called `payload`. It means, that your app or site can get info about the event and participants, not only status.


## Create webhook
To create a webhook you can use `/hooks` endpoint with a valid api key and method POST.

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/hooks?api_key=2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx"' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
    target_url: "https://www.test.com/hooks?id=123"
    action: 'event.cancelled'
}'
```

It should return the webhook object like this:

```json light-code
{
    "_id": "60af526954e6605aae0dad5a",
    "target_url": "https://www.toto.com/hooks?id=123",
    "action": "event.cancelled",
    "scope": "organization",
    "organization": "60af5269459aad001d0cb565",
    "updatedAt": "2021-05-27T08:03:53.775Z",
    "createdAt": "2021-05-27T08:03:53.775Z",
    "__v": 0
}

```

## Modify the webhook
To modify a webhook you can use `/hooks/:hook_id` endpoint with a hook `_id` and method PUT.

```shell screen-hidden
curl --request PUT 'https://api.vyte.in/v2/hooks/60af526954e6605aae0dad5a' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
    target_url: "https://www.test.com/hooks?id=123"
    action: 'event.updated'
}'
```

If everything is okay, it returns the modified hook.

## List all the hooks
You can list all the hooks, created for the organisation using `/hooks` endpoint and GET method.

```shell screen-hidden
curl --request PUT 'https://api.vyte.in/v2/hooks' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
```
It returns an arry of hooks like this:

```json light-code
[
    {
    "_id": "60af526954e6605aae0dad5a",
    "target_url": "https://www.toto.com/hooks?id=645",
    "action": "event.updated",
    "scope": "organization",
    "organization": "60af5269459aad001d0cb565",
    "updatedAt": "2021-05-27T08:03:53.775Z",
    "createdAt": "2021-05-27T08:03:53.775Z",
    "__v": 0
    },
    {
    "_id": "60af526954e6605aae0dad65",
    "target_url": "https://www.toto.com/hooks?id=123",
    "action": "event.cancelled",
    "scope": "organization",
    "organization": "60af5269459aad001d0cb565",
    "updatedAt": "2021-05-27T08:03:53.775Z",
    "createdAt": "2021-05-27T08:03:53.775Z",
    "__v": 0
    },
    {
    "_id": "60af526954e6605aae0dad4d",
    "target_url": "https://www.toto.com/hooks?id=241",
    "action": "event.created",
    "scope": "organization",
    "organization": "60af5269459aad001d0cb565",
    "updatedAt": "2021-05-27T08:03:53.775Z",
    "createdAt": "2021-05-27T08:03:53.775Z",
    "__v": 0
    }

]

```
## Get the hook
You can get particular hook using `/hooks/:hook_id` endpoint and GET method.

```shell screen-hidden
curl --request PUT 'https://api.vyte.in/v2/hooks/60af526954e6605aae0dad4d' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
```
It returns an object:
```json light-code

{
    "_id": "60af526954e6605aae0dad4d",
    "target_url": "https://www.toto.com/hooks?id=241",
    "action": "event.created",
    "scope": "organization",
    "organization": "60af5269459aad001d0cb565",
    "updatedAt": "2021-05-27T08:03:53.775Z",
    "createdAt": "2021-05-27T08:03:53.775Z",
    "__v": 0
}

```

## Delete the hook
You can delete particular hook using `/hooks/:hook_id` endpoint and DELETE method.

```shell screen-hidden
curl --request DELETE 'https://api.vyte.in/v2/hooks/60af526954e6605aae0dad4d' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \

```

If you used Zapier hooks, the way is a bit different: `POST` method for `/hooks/zapier/delete` endpoint.

## Last but not least
Wanna test hooks? Check out our [Webhook tester](https://github.com/saintmac/webhook-tester) for automated testing.


