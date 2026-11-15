# Get started

In this guide you will learn how to get started with the Vyte API. At the end, you will have created an organization, retrieved your API key and made your first request to test authentication.

[[toc]]

::: warning

The use of the Vyte API is reserved to pro members. Please refer to the [pricing page](https://www.vyte.in/en/pricing) for more information.

:::

## Create an organization

To be able to use the Vyte API, you first have to create an organization.

To do this, go to [https://www.vyte.in/settings/organization/setup](https://www.vyte.in/settings/organization/setup), give a name to your organization and click on **Create my organization**.

<asset-image srcHtml="img/create-organization.png" altHtml="Create an organization" titleHtml="Create an organization"/>

## Retrieve your API key

Once your organization is created, an administrator of the organization can create an API key from the organization settings of the Vyte web application (API key tab). Keys cannot be created through the API.

> This key is essential to use our API since all requests must be authenticated with it. Treat it like a password and keep it on your server.

<asset-image srcHtml="img/retrieve-key.png" altHtml="Retrieve API key" titleHtml="Retrieve API key"/>

Each key has one scope (`organization`, `team` or `user`) which decides what the key can reach. The guides of this section assume an `organization` scoped key. See [API key scopes](/reference/#api-key-scopes) for the details.

## Test your API key

You are now able to make your first request. To keep it simple, we will just check that your API key works.

To do this, make a `GET` request to `https://api.vyte.in/v2/auth/test` and send your API key, as is, in the `Authorization` header. There is no `Bearer` prefix.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fauth%252Ftest%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 234px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/auth/test' \
--header 'Authorization: YOUR_API_KEY'
```

If everything went well, the answer is `200` with the organization the key belongs to:

```json light-code
{
  "_id": "5f1e9b2a8c4d3e0012340000",
  "name": "ACME",
  "lang": "en",
  "admins": ["5f1e9b2a8c4d3e0012345601"],
  "members": ["5f1e9b2a8c4d3e0012345601"],
  "createdAt": "2026-01-14T09:12:44.000Z",
  "updatedAt": "2026-01-14T09:12:44.000Z"
}
```

Keep the `_id` of the organization: several requests of the next guides need it.

A request without a key, or with an unknown or deactivated key, is answered with `401` and an empty body.

## Conclusion

You're now ready to use the Vyte API.

In the following guides, you will learn how to use the API to automate your workflow:

- [Create and manage booking pages](/guides/create-and-manage-booking-pages/): create your first user and set up their Vyte Page.
- [Scheduling API for 1-to-1 bookings](/guides/scheduling-api-for-1-to-1-bookings/): find free slots and book a meeting with the API only.
- [Set up team booking](/guides/setup-team-booking/): group users in a team and let Vyte assign bookings to its members.
- [Using team admins for notifications and event management](/guides/using-team-admins-for-notifications-and-event-management/): keep managers informed of the bookings of their team.
- [Set up webhooks](/guides/set-up-webhooks/): be notified when an event is created, confirmed or cancelled.
- [Adding a simple locator](/guides/use-simple-locator/): let visitors find the nearest place to book.

The rules shared by every endpoint (authentication, formats, errors) are described in the [API Reference](/reference/).
