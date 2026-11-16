---
{ "pageClass": "reference-page" }
---

# Video conferencing (Webex and Zoom)

:::::panel

:::: left
A [user](/reference/users/) can connect a personal Webex account and a personal Zoom account to Vyte. Once an account is connected, Vyte can create an online meeting on it for the events organized by that user whose place is `Webex` or `Zoom`, and uses the meeting's join link as the address of the place (see [Events](/reference/events/)). A connection belongs to one user and one provider: a user has at most one Webex connection and at most one Zoom connection, and they are independent of each other.

Connecting an account requires the consent of the account owner on the provider's own website (OAuth 2.0). The API therefore cannot connect an account silently: it gives you a setup URL to open in the end user's browser, a status endpoint to check the result, and an endpoint to remove the connection. Both providers work the same way; the paths only differ by the provider name (`webex` or `zoom`). Authentication, key scopes and error format are described in [Conventions](/reference/).

::::

:::: right

> ENDPOINTS

<endpoints>
  <endpoint method="get" path="/v2/users/:user_id/webex" href="#check-the-webex-connection-of-a-user"></endpoint>
  <endpoint method="get" path="/users/webex/setup" href="#start-connecting-a-webex-account"></endpoint>
  <endpoint method="delete" path="/v2/users/:user_id/webex" href="#remove-the-webex-connection-of-a-user"></endpoint>
  <endpoint method="get" path="/v2/users/:user_id/zoom" href="#check-the-zoom-connection-of-a-user"></endpoint>
  <endpoint method="get" path="/users/zoom/setup" href="#start-connecting-a-zoom-account"></endpoint>
  <endpoint method="delete" path="/v2/users/:user_id/zoom" href="#remove-the-zoom-connection-of-a-user"></endpoint>
</endpoints>
::::

:::::

## Connection flow

1. **Start.** From your server, get a [user token](/reference/users/#get-a-token-to-authenticate-a-user) for the user (`GET /v2/users/:user_id/token`). Then send the end user's browser to the setup URL of the provider, `https://api.vyte.in/users/webex/setup?token=USER_TOKEN` or `https://api.vyte.in/users/zoom/setup?token=USER_TOKEN`, with an optional `callback` query parameter telling where the user must land at the end. It must be a full-page navigation of the end user's own browser (a link, a redirect or a new tab), with cookies enabled; it cannot be an XHR / fetch call, and it cannot be performed by your server on the user's behalf.
2. **Redirect to the provider.** Vyte answers `302` and redirects the browser to the provider's sign-in and consent page (Webex or Zoom).
3. **Consent.** The end user signs in to their Webex or Zoom account and authorizes Vyte. This is the only action required from the user.
4. **Return.** The provider sends the browser back to Vyte, which stores the connection for the user and redirects the browser to the `callback` URL:
   - success: the browser lands on the `callback` URL, unchanged;
   - the user refused, or the provider reported an error: the browser lands on the `callback` URL with an extra `error` query parameter holding the provider's error code (for example `?error=access_denied`).
5. **Check.** From your server, call `GET /v2/users/:user_id/webex` (or `/zoom`): `200` means the account is connected.

Rules of the flow:

- Steps 1 to 4 must happen in the same browser and must be completed within about 10 minutes. Otherwise the return is rejected with `403` and the user has to start again from step 1.
- Landing on the `callback` URL without `error` is not a proof for your backend; always confirm with step 5.
- If the user already has a working connection for the provider, going through the flow again keeps the existing connection (the account is not switched) and still ends on the `callback` URL. To connect a different account, [remove the connection](#remove-the-webex-connection-of-a-user) first.
- If the existing connection is no longer usable, going through the flow replaces it.
- When the return step fails for another reason, the browser is not redirected: it receives an error status with a JSON body `{"message": "..."}`. Possible statuses: `400` (incomplete return from the provider, or `callback` not allowed), `403` (flow expired, already used, or finished in a different browser than the one that started it), `404` (the user no longer exists), `502` (the provider refused to complete the connection; a previously stored connection is left untouched), `500` (unexpected error).

**Authenticating the setup URL.** A browser navigation cannot send an `Authorization` header, and an API key must never reach a browser. The setup URL is therefore not a `/v2` endpoint: it is authenticated with a short-lived user token passed in the `token` query parameter. Request the token right before redirecting the user, and use it only for this redirect.

## The connection status object

There is no stored resource to read or write; the status endpoints return a small description of the connected account, which differs by provider.

**Webex**

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `connected` | boolean | no | Always `true` (a user without connection gets `404`, not `false`). |
| `provider_id` | string | no | Identifier of the connected account at Webex. |
| `email` | string | no | Email address of the connected Webex account. May be absent if Webex does not report one. |

```json
{
  "connected": true,
  "provider_id": "WEBEX_PERSON_ID",
  "email": "jane.doe@example.com"
}
```

**Zoom**

The response is the profile of the connected Zoom user as provided by Zoom.

| Field | Type | Writable | Description |
| --- | --- | --- | --- |
| `id` | string | no | Identifier of the connected user at Zoom. |
| `email` | string | no | Email address of the connected Zoom account. Always present in a `200` response. |

Responses may contain additional fields not listed here; they are defined by Zoom, may change without notice and must not be relied upon.

```json
{
  "id": "ZOOM_USER_ID",
  "email": "jane.doe@example.com"
}
```

## Endpoints

| Method | Path | Description | Key scope |
| --- | --- | --- | --- |
| `GET` | `/v2/users/:user_id/webex` | Check the Webex connection of a user | organization, team, user |
| `GET` | `/users/webex/setup` | Start connecting a Webex account (browser redirect, not under `/v2`) | user token |
| `DELETE` | `/v2/users/:user_id/webex` | Remove the Webex connection of a user | organization, team, user |
| `GET` | `/v2/users/:user_id/zoom` | Check the Zoom connection of a user | organization, team, user |
| `GET` | `/users/zoom/setup` | Start connecting a Zoom account (browser redirect, not under `/v2`) | user token |
| `DELETE` | `/v2/users/:user_id/zoom` | Remove the Zoom connection of a user | organization, team, user |

For the four status and removal endpoints (the setup URLs are authenticated with a user token), a `team` key requires the user to be a member of one of the key's teams, and a `user` key only works for the key's own user.

The following errors are common to these four endpoints and are not repeated in each table:

| Status | When |
| --- | --- |
| `401` | Missing, unknown or deactivated API key. |
| `403` | The user is not a member of the key's organization (or of the key's teams for a `team` key), or a `user` key is used for another user. |
| `404` | The user or the key's organization does not exist. |
| `500` | Unexpected server error. |

### Check the Webex connection of a user

`GET /v2/users/:user_id/webex`

Tells whether the user has a working Webex connection and which Webex account it is. Vyte verifies the connection with Webex on each call. If the stored connection turns out to be unusable (for example the user revoked the authorization on the Webex side), it is removed and `204` is returned: the user must go through the [connection flow](#connection-flow) again.

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string | Id of the user. |

**Query parameters**

None.

**Request body**

None.

**Response**

- `200 OK` with the [Webex status object](#the-connection-status-object): the account is connected and usable.
- `204 No Content`, empty body: a connection existed but could no longer be used; it has just been removed. Treat as "not connected".

**Errors**

| Status | When |
| --- | --- |
| `404` | The user has no Webex connection (plain-text body). |
| `500` | Webex could not be reached or returned an unreadable answer. The connection is kept; retry later. |

**Example**

```bash
curl -i 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/webex' \
  -H 'Authorization: YOUR_API_KEY'
```

```json
{
  "connected": true,
  "provider_id": "WEBEX_PERSON_ID",
  "email": "jane.doe@example.com"
}
```

### Start connecting a Webex account

`GET /users/webex/setup`

First step of the [connection flow](#connection-flow). **This path is not under `/v2` and is not authenticated with an API key**: it is opened by the end user's browser and authenticated with a [user token](/reference/users/#get-a-token-to-authenticate-a-user). Redirects to the Webex sign-in and consent page.

**Authentication:** a user token of the user whose account is being connected, in the `token` query parameter. Obtain it from your server with `GET /v2/users/:user_id/token` just before redirecting the user. Never put an API key in this URL.

**Path parameters**

None. The user is the one designated by the token.

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `token` | string | yes | - | User token of the user, obtained with `GET /v2/users/:user_id/token` (see [Users](/reference/users/#get-a-token-to-authenticate-a-user)). |
| `callback` | string | no | The user's `account.app_url` if set, otherwise the Vyte web application | Where the browser is sent at the end of the flow. Allowed values: a relative path starting with a single `/` (resolved against the user's `account.app_url` if set, otherwise against the Vyte web application), or an absolute `http(s)` URL located on a Vyte domain or on the same origin as the user's `account.app_url`. URLs containing credentials, whitespace or backslashes are refused. URL-encode the value. |

**Request body**

None.

**Response**

`302 Found` with a `Location` header pointing to the Webex consent page. The response also sets a short-lived cookie that the browser must send back at the end of the flow, which is why the same browser has to complete it. There is no JSON body.

**Errors**

| Status | When |
| --- | --- |
| `400` | The `callback` value is not allowed. Body: `{"message": "callback not allowed"}`. |
| `401` | Missing, invalid or expired user token. |
| `403` | The user is not allowed to connect a Webex account (the feature is not available for this user). |
| `500` | The connection could not be started. Body: `{"message": "..."}`. |

**Example**

From your server, get a token for the user:

```bash
curl 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/token' \
  -H 'Authorization: YOUR_API_KEY'
```

Then redirect the user's browser to:

```
https://api.vyte.in/users/webex/setup?token=USER_TOKEN&callback=%2Fsettings
```

```
HTTP/1.1 302 Found
Location: https://...
```

### Remove the Webex connection of a user

`DELETE /v2/users/:user_id/webex`

Removes the Webex connection stored by Vyte for the user. Vyte stops creating Webex meetings for this user. Meetings already created and events already scheduled are not modified. The authorization is not revoked on the Webex side: the user can also remove Vyte from the authorized applications of their Webex account.

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string | Id of the user. |

**Query parameters**

None.

**Request body**

None.

**Response**

`204 No Content`, empty body. Also returned when the user had no Webex connection.

**Errors**

Only the common errors listed under [Endpoints](#endpoints).

**Example**

```bash
curl -i -X DELETE 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/webex' \
  -H 'Authorization: YOUR_API_KEY'
```

```
HTTP/1.1 204 No Content
```

### Check the Zoom connection of a user

`GET /v2/users/:user_id/zoom`

Tells whether the user has a working Zoom connection and which Zoom account it is. Vyte verifies the connection with Zoom on each call. If the stored connection turns out to be unusable (for example the user removed the Vyte application from their Zoom account), it is removed and `204` is returned: the user must go through the [connection flow](#connection-flow) again.

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string | Id of the user. |

**Query parameters**

None.

**Request body**

None.

**Response**

- `200 OK` with the [Zoom status object](#the-connection-status-object): the account is connected and usable.
- `204 No Content`, empty body: a connection existed but could no longer be used; it has just been removed. Treat as "not connected".

**Errors**

| Status | When |
| --- | --- |
| `404` | The user has no Zoom connection, or Zoom did not return the account's profile (plain-text body). Treat as "not connected". |
| `500` | Zoom could not be reached or returned an unreadable answer. The connection is kept; retry later. |

**Example**

```bash
curl -i 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/zoom' \
  -H 'Authorization: YOUR_API_KEY'
```

```json
{
  "id": "ZOOM_USER_ID",
  "email": "jane.doe@example.com"
}
```

### Start connecting a Zoom account

`GET /users/zoom/setup`

First step of the [connection flow](#connection-flow). **This path is not under `/v2` and is not authenticated with an API key**: it is opened by the end user's browser and authenticated with a [user token](/reference/users/#get-a-token-to-authenticate-a-user). Redirects to the Zoom sign-in and consent page.

**Authentication:** a user token of the user whose account is being connected, in the `token` query parameter. Obtain it from your server with `GET /v2/users/:user_id/token` just before redirecting the user. Never put an API key in this URL.

**Path parameters**

None. The user is the one designated by the token.

**Query parameters**

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `token` | string | yes | - | User token of the user, obtained with `GET /v2/users/:user_id/token` (see [Users](/reference/users/#get-a-token-to-authenticate-a-user)). |
| `callback` | string | no | The user's `account.app_url` if set, otherwise the Vyte web application | Where the browser is sent at the end of the flow. Allowed values: a relative path starting with a single `/` (resolved against the user's `account.app_url` if set, otherwise against the Vyte web application), or an absolute `http(s)` URL located on a Vyte domain or on the same origin as the user's `account.app_url`. URLs containing credentials, whitespace or backslashes are refused. URL-encode the value. |

**Request body**

None.

**Response**

`302 Found` with a `Location` header pointing to the Zoom consent page. The response also sets a short-lived cookie that the browser must send back at the end of the flow, which is why the same browser has to complete it. There is no JSON body.

**Errors**

| Status | When |
| --- | --- |
| `400` | The `callback` value is not allowed. Body: `{"message": "callback not allowed"}`. |
| `401` | Missing, invalid or expired user token. |
| `403` | The user is not allowed to connect a Zoom account (the feature is not available for this user). |
| `500` | The connection could not be started. Body: `{"message": "..."}`. |

**Example**

From your server, get a token for the user:

```bash
curl 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/token' \
  -H 'Authorization: YOUR_API_KEY'
```

Then redirect the user's browser to:

```
https://api.vyte.in/users/zoom/setup?token=USER_TOKEN&callback=%2Fsettings
```

```
HTTP/1.1 302 Found
Location: https://...
```

### Remove the Zoom connection of a user

`DELETE /v2/users/:user_id/zoom`

Removes the Zoom connection stored by Vyte for the user. Vyte stops creating Zoom meetings for this user. Meetings already created and events already scheduled are not modified. The authorization is not revoked on the Zoom side: the user can also remove the Vyte application from their Zoom account.

**Key scope:** organization, team, user.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| `user_id` | string | Id of the user. |

**Query parameters**

None.

**Request body**

None.

**Response**

`204 No Content`, empty body. Also returned when the user had no Zoom connection.

**Errors**

Only the common errors listed under [Endpoints](#endpoints).

**Example**

```bash
curl -i -X DELETE 'https://api.vyte.in/v2/users/5f1e9b2a8c4d3e0012345678/zoom' \
  -H 'Authorization: YOUR_API_KEY'
```

```
HTTP/1.1 204 No Content
```

## Notes and caveats

- Interpreting the status endpoints: `200` = connected; `404` and `204` = not connected; `500` = unknown, retry later. Never expect `{"connected": false}`.
- A status check that answers `204` has a side effect: the unusable connection is deleted, so the next status check answers `404`.
- The Webex and Zoom status bodies do not have the same shape (`provider_id` / `email` / `connected` for Webex, `id` / `email` for Zoom).
- The setup endpoints answer with a redirect, not JSON. HTTP clients that follow redirects automatically will fetch the provider's HTML consent page; that is expected and useless outside a browser.
- The setup endpoints must be loaded by the end user's browser; a `Location` URL obtained by your server cannot be handed to the user, because the flow is tied to the browser that started it.
- The flow must be finished within about 10 minutes, and each started flow can be completed only once.
- `callback` must point to a Vyte domain or to the user's own `account.app_url` origin; arbitrary partner URLs are refused with `400`. To land on your own application, have the user's `account.app_url` set accordingly (see [Users](/reference/users/)).
- Re-running the flow for a user who is already connected does not switch accounts. Call `DELETE` first, then start the flow again.
- `DELETE` is idempotent and always answers `204`.
- Connecting an account is a prerequisite for Vyte to create Webex or Zoom meetings for the events the user organizes; the meeting is created on the organizer's connected account.
