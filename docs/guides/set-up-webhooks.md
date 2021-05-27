# Webhooks for flexible scheduling notifications
Webhooks are the easiest and fastest solution for quick notification. If something happens, they send the automated message to particular URL. It works for notification and also integration with different platforms. So, how does it work in Vyte?

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
It should return the webhook object