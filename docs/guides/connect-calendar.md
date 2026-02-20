# Connect a user's calendar

In this guide, you will learn how to let a user of your organization connect their calendar to Vyte. This is a two-step process: first you retrieve a short-lived authentication token for the user, then you redirect the user to the Vyte calendar settings page with that token.

[[toc]]

## Step 1: Get an authentication token for the user

To let a user connect their calendar, you first need to get a temporary authentication token on their behalf. This token is obtained by making a `GET` request to the `/v2/users/:user_id/token` endpoint, where `:user_id` is the Vyte `_id` of the user in your organization.

This request must be authenticated with your organization API key.

::: warning
Don't forget to replace the API key and `:user_id` with your own values.
:::

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/users/5f198d23c1ac5d0bcafc00ee/token' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
```

You will get back an object containing the authentication token:

```json light-code
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

::: tip
This token is valid for **60 minutes**. Make sure you redirect the user before it expires.
:::

## Step 2: Redirect the user to the calendar settings page

With the token obtained in step 1, you can now authenticate the user on Vyte and send them directly to the calendar connection settings page.

Build the following URL, replacing `yourdomain` with your organization's Vyte domain and appending the token as the `t` query parameter:

```
https://yourdomain.vyte.in/settings/calendar/setup?embed=max&t=<token>
```

For example:

```
https://acme.vyte.in/settings/calendar/setup?embed=max&t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Redirecting the user to this URL will log them into their Vyte account and take them directly to the calendar connection setup page, where they can connect their calendar (Google Calendar, Outlook, etc.).

## Conclusion

You now know how to let users in your organization connect their calendar to Vyte without requiring them to log in manually. The flow is:

1. Your server calls `GET /v2/users/:user_id/token` (authenticated with your API key) to get a short-lived token.
2. You redirect the user to `https://yourdomain.vyte.in/settings/calendar/setup?embed=max&t=<token>`.

The token expires after 60 minutes, so always generate it fresh just before redirecting the user.
