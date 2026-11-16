# Add scheduling features to your app or platform

In this guide, we will explore another way to add Vyte to your app or platform. This will let you easily add a button in your product to schedule a meeting with one person or a group.

In fact, we will learn how to generate links to some Vyte pages with pre-defined options as query parameters. For instance, you will be able to create a button to redirect from your website to an event creation page with pre-filled fields.

[[toc]]

## Register your app

In this part, we will discover a new notion: the third-party app and its secret key. This differs from the classic API because we will generate a token, and this token will enable us to generate links to some Vyte pages.

So, the first thing to do is to register a new third-party app. To do this, we just have to make a `POST` request at `/v2/third_parties` with the following query parameters (the request is authenticated with your API key):

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fthird_parties%253Fname%253Dacme%2526contact_email%253Dcontact%2540example.com%2526contact_name%253DACME%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 256px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request POST 'https://api.vyte.in/v2/third_parties?name=acme&contact_email=contact@example.com&contact_name=ACME' \
--header 'Authorization: YOUR_API_KEY'
```

This endpoint registers your app as a third-party app and lets you obtain your `app_id` and `app_secret`:

```json light-code
{
  "contact": {
    "email": "contact@example.com",
    "name": "ACME"
  },
  "_id": "5f1e9b2a8c4d3e0012345690",
  "name": "acme",
  "organization": "5f1e9b2a8c4d3e0012340000",
  "secret": "YOUR_APP_SECRET",
  "updatedAt": "2026-01-12T09:30:00.000Z",
  "createdAt": "2026-01-12T09:30:00.000Z"
}
```
Your `app_id` is the `_id` of the response and your `app_secret` is its `secret`. Note them, we will need them in the next steps.

## Create links to event creation pages

You can set different parameters for the event creation such as title, invitees, places and message. Here are the available parameters:

<attributes title="Query parameters">
<attribute name="aid" type="string" :required=true>

App ID: your app ID for Vyte. You get it when you register your app with `POST /v2/third_parties`.

</attribute>
<attribute name="agid" type="string" :required=false>

App Group ID: this is an id you will provide to Vyte, that you will use to identify a group of users such as a team, a project, etc. You can also pass several ids, separated by commas.

</attribute>
<attribute name="cm" type="string" :required=false details="optional if the user already has a Vyte account and is expected to be logged in with it on the same browser.">

Creator e-mail.

</attribute>
<attribute name="cn" type="string" :required=false>

Creator name: useful if the creator doesn't have a Vyte account yet.

</attribute>
<attribute name="ct" type="string" :required=false details="optional if the user already has a Vyte account and is expected to be logged in with it on the same browser.">

Creator token: used to authenticate the request. See below how to generate such a token.

</attribute>
<attribute name="em" type="string" :required=false>

Event message.

</attribute>
<attribute name="et" type="string" :required=false>

Event title.

</attribute>
<attribute name="im" type="string" :required=false>

Invitee e-mail(s), separated by a pipe (|).

</attribute>
<attribute name="in" type="string" :required=false>

Invitee name(s), separated by a pipe (|). To be used with `im`, with emails and names listed in the same order.

</attribute>
<attribute name="places" type="string" :required=false>

Event places, with place name and address separated by a single pipe (|) and several places separated by a double pipe (||).

</attribute>
</attributes>

You can link to Vyte using either the first step (`/add_invitees`), or the second step (`/add_details`). In both cases, all the parameters will be taken into account.

If the user creating the event already has a Vyte account, you don't need to authenticate them. If they have an account but are not logged in, they will be redirected to the login screen. Once logged in, they will be redirected back to the event creation page.

If you want to enable your users to create events with Vyte, without having a Vyte account, you need to authenticate their email with a simple token system.

### Token generation

So, in case our user doesn't have a Vyte account, let's create a new token to authenticate them. To generate a new token, we make a `GET` request at `/v2/third_parties/token` and give the creator email (`cm`) and the `secret` key of our app (the one we got in the response of the third-party creation) as query parameters:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fthird_parties%252Ftoken%253Fcm%253Djane.doe%2540example.com%2526secret%253DYOUR_APP_SECRET%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 256px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --request GET 'https://api.vyte.in/v2/third_parties/token?cm=jane.doe@example.com&secret=YOUR_APP_SECRET' \
--header 'Authorization: YOUR_API_KEY'
```

The response provides us with a new token for our user:

```json light-code
{
  "token": "CREATOR_TOKEN"
}
```

### Link creation

Now we are ready to generate our first link to an event creation page. Let's consider that we want a pre-filled page with the following information:

- the event message: "Important brainstorming for a new feature. We hope you will be at 100% !"
- the event title: "Brainstorming for a new feature"
- the invitees are Oscar Simpson (oscar.simpson@example.com), Emanuel Buckner (emanuel.buckner@example.com), Ezekiel Carr (ezekiel.carr@example.com) and Zayne Rhodes (zayne.rhodes@example.com).
- there are 2 possible places: the office at 2553 Trouser Leg Road, Springfield, 01103, Massachusetts or a coworking place at 4927 Leverton Cove Road, Springfield, 01103, Massachusetts.

So, we just have to serialize and URL-encode all these parameters to generate the URL of our link:

```
aid=5f1e9b2a8c4d3e0012345690&cm=jane.doe@example.com&cn=Jane%20Doe&ct=CREATOR_TOKEN&em=Important%20brainstorming%20for%20a%20new%20feature.%20We%20hope%20you%20will%20be%20at%20100%25%20!&et=Brainstorming%20for%20a%20new%20feature&im=oscar.simpson@example.com|emanuel.buckner@example.com|ezekiel.carr@example.com|zayne.rhodes@example.com&in=Oscar%20Simpson|Emanuel%20Buckner|Ezekiel%20Carr|Zayne%20Rhodes&places=The%20Office|2553%20Trouser%20Leg%20Road,%20Springfield,%2001103,%20Massachusetts||Coworking%20Place|4927%20Leverton%20Cove%20Road,%20Springfield,%2001103,%20Massachusetts
```

And let's try our new link (it is expected that the final creation of the meeting will fail, as these credentials are placeholders):

<Button path="https://www.vyte.in/add_invitees?aid=5f1e9b2a8c4d3e0012345690&cm=jane.doe@example.com&cn=Jane%20Doe&ct=CREATOR_TOKEN&em=Important%20brainstorming%20for%20a%20new%20feature.%20We%20hope%20you%20will%20be%20at%20100%25%20!&et=Brainstorming%20for%20a%20new%20feature&im=oscar.simpson@example.com|emanuel.buckner@example.com|ezekiel.carr@example.com|zayne.rhodes@example.com&in=Oscar%20Simpson|Emanuel%20Buckner|Ezekiel%20Carr|Zayne%20Rhodes&places=The%20Office|2553%20Trouser%20Leg%20Road,%20Springfield,%2001103,%20Massachusetts||Coworking%20Place|4927%20Leverton%20Cove%20Road,%20Springfield,%2001103,%20Massachusetts">Create a new event</Button>

Here we are! This is how you can integrate Vyte in your app by easily generating links to pre-fill some information on the event creation page.

## (Optional) Retrieve your third-parties

To retrieve the third-parties you registered with your API key, you can make a `GET` request at `/v2/third_parties` like this:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--location%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fthird_parties%27%2520%255C%250A--header%2520%27Authorization%253A%2520YOUR_API_KEY%27"
  style="width: 100%; height: 234px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```shell screen-hidden
curl --location --request GET 'https://api.vyte.in/v2/third_parties' \
--header 'Authorization: YOUR_API_KEY'
```

The response will look like this:

```jsonp light-code
[
    {
        "contact": {
            "email": "contact@example.com",
            "name": "ACME"
        },
        "_id": "5f1e9b2a8c4d3e0012345690",
        "name": "acme",
        "organization": "5f1e9b2a8c4d3e0012340000",
        "secret": "YOUR_APP_SECRET",
        "updatedAt": "2026-01-12T09:30:00.000Z",
        "createdAt": "2026-01-12T09:30:00.000Z"
    },
    ...
]
```
