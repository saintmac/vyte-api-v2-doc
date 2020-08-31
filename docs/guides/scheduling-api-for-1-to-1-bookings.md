# Scheduling API for 1-to-1 bookings

In the previous guide, you learned how to use our API to set up a new booking page.

This guide will teach you how to completely dispense with the Vyte interface and fully manage 1-1 bookings using only the API.

> To sum up, we will explore how to use the API to create a new booking request for a user, that means that we will learn how to retrieve the available slots for a user, then how to create a new booking request and finally, how to update the created event.

[[toc]]

## Get the available slots for a user

### Using the API

When someone wants an appointment with a the user, the first thing we have to do is to retrieve when the user is available (to draw a parallel with the Vyte Page, we want to retrieve what is shown in the datepicker).

To achieve this, we will use the [Slots API](../reference/slots.md). We will perform a `GET` request to the `/v2/slots` endpoint. Here is a little reminder of the available query params :

<attributes title="Query parameters">
  <attribute name="duration" type="number" :required=true>

Duration of the appointment in minutes.

  </attribute>
  <attribute name="emails" type="string" :required=true>

Address of the person you want to book an appointment with. It has to be the address that person is signed up with on Vyte.

**Required if no `user_id` is sent**

  </attribute>
  <attribute name="users" type="string" :required=true>

List of `user_id` you want to book an appointment with. It must be separated with a comma and if several `user_id` are provided, it returns the slots to which all users are available.

**Required if no `email` is sent**

  </attribute>
  <attribute name="from" type="string" :required=true>

Date from when you want to get available slots (included) formatted as `YYYY-MM-DD`.

  </attribute>
  <attribute name="to" type="string" :required=true>

Date until when you want to get available slots (included) formatted as `YYYY-MM-DD`.

  </attribute>
  <attribute name="timezone" type="string">

The timezone expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

  </attribute>
</attributes>

In the rest of this guide, we will assume that someone wants to make a 1 hour meeting on September 1 or 2 with our user John Doe whose id is : `5f3feb7821046c3bb9327e6a`.

So, to retrieve the availabilities of our user for these days, we make the following request :

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520GET%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fslots%253Fduration%253D60%2526users%253D5f3feb7821046c3bb9327e6a%2526from%253D2020-10-01%2526to%253D2020-10-02%27%2520%255C%250A--header%2520%27Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx%27%2520%255C"
  style="width: 100%; height: 300px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```bash screen-hidden
curl --request GET 'https://api.vyte.in/v2/slots?duration=60&users=5f3feb7821046c3bb9327e6a&from=2020-10-01&to=2020-10-02' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
```

We get the following response :

```jsonp light-code
{
  "timezone": "Europe/Paris",
  "from": "2020-10-01",
  "to": "2020-10-02",
  "slots": [
    {
      "start": {
        "dateTime": "2020-10-01T00:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-10-01T01:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-10-01T01:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-10-01T02:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-10-01T02:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-10-01T03:00:00+02:00"
      }
    },
    {
      "start": {
        "dateTime": "2020-10-01T03:00:00+02:00"
      },
      "end": {
        "dateTime": "2020-10-01T04:00:00+02:00"
      }
    },
    ...
  ]
}
```

Now that we have all the available slots for our user John Doe, we can make our choose one that seems to be good (pratically, we will use some algorithm or conditions to determine which one is the best).

_We will consider here that September 2 from 10:00 to 11:00 a.m. is a good choice._

### Using our web component

We provide a web component to integrate the Vyte slot picker directly in your website. This is a fully configurable Vue.js component with the following attributes:

<attributes title="Properties">

<attribute name="emails" type="string" :required=true details="if no users is passed">

Email of the person whose availabilities you want to show (Vyte account required).

</attribute>
<attribute name="users" type="string" :required=true details="if no emails is passed">

Vyte `user_id` of the person whose availabilities you want to show (Vyte account required).

</attribute>
<attribute name="ndays" type="number" details="default is 5">

Number of days you want to show.

</attribute>
<attribute name="timezone" type="string" :required=true>

The timezone you want the availabilities displayed in. It must be expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

</attribute>
<attribute name="duration" type="string" details="default is 30">

Duration in minutes.

</attribute>
<attribute name="lang" type="string" details="default is english">

Language of the event. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are : `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.

</attribute>
<attribute name="one-column" type="boolean" details="default is false">

If you want the slots to be displayed on 1 column (vs 1 column per day which).

</attribute>
<attribute name="start" type="date" details="defaults to today">

Start date expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601).

</attribute>
<attribute name="start-at-first-availability" type="boolean" details="default is false">

If you want the first date to jump to your first availability.

</attribute>
<attribute name="nslots" type="number">

Number of slots max shown per day.

</attribute>
</attributes>

The following code show you how to integrate it easily:

::: demo html

<!-- Optional scripts if you want compatibility with older browsers like IE11 -->
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
<script src="https://unpkg.com/unfetch/polyfill"></script>
<script src="https://cdn.jsdelivr.net/npm/custom-event-polyfill@1.0.6/polyfill"></script>
<!--/ optional scripts -->
<!-- Mandatory dependency scripts -->
<!-- If you were already loading them for another component of your page no need to load them twice -->
<script src="https://unpkg.com/vue@2.5.17/dist/vue.min.js"></script>
<script src="https://unpkg.com/document-register-element@1.13.1/build/document-register-element.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-custom-element@3.2.6/dist/vue-custom-element.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.js"></script>
<!-- Mandatory scripts -->
<!-- Web component -->
<script src="https://assets-cdn.vyte.in/wc/vyte-slot-picker/dist/js/app.js"></script>
<link
  rel="stylesheet"
  type="text/css"
  href="https://assets-cdn.vyte.in/wc/vyte-slot-picker/dist/css/app.css"
/>
<!--/ Web component -->

<vyte-slot-picker
id="vyte-slot-picker"
emails="martin@vytein.com"
:ndays="5"
timezone="Europe/Paris"
lang="en"

> </vyte-slot-picker>

<script>
function slotSelectedHandler(event) {
  const slot = event.detail[0];
  const startDate = new Date(slot.start.dateTime);
  const endDate = new Date(slot.end.dateTime);
  console.log("Slot selected", startDate, endDate);
}
const element = document.getElementById("vyte-slot-picker");
element.addEventListener("slot-selected", slotSelectedHandler);
</script>

:::

## Create a new event

Let's create a new meeting request to John Doe for the chosen date. To achieve this, we have to create a new event thanks to the [Events API](../reference/events.md).

So, we will do this by making this `POST` request :

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi.vyte.in%252Fv2%252Fevents%27%2520%255C%250A--header%2520%27Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx%27%2520%255C%250A--header%2520%27Content-Type%253A%2520application%252Fjson%27%2520%255C%250A--data-raw%2520%27%257B%250A%2520%2520%2522title%2522%253A%2520%2522Meeting%2520with%2520Quentin%2520Tarantino%2522%252C%250A%2520%2520%2522created_by%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522user%2522%253A%2520%25225f3feb7821046c3bb9327e6a%2522%250A%2520%2520%257D%252C%250A%2520%2520%2522dates%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522all_day%2522%253A%2520false%252C%250A%2520%2520%2520%2520%2520%2520%2522date%2522%253A%2520%25222020-09-02T10%253A00%253A00%2522%252C%250A%2520%2520%2520%2520%2520%2520%2522end_date%2522%253A%2520%25222020-09-02T11%253A00%253A00%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522invitees%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522full_name%2522%253A%2520%2522Quentin%2520Tarantino%2522%252C%250A%2520%2520%2520%2520%2522email%2522%253A%2520%2522quentin.tarantino%2540hollywood.com%2522%250A%2520%2520%257D%252C%250A%2520%2520%2522places%2522%253A%2520%255B%250A%2520%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520%2522name%2522%253A%2520%2522Place%2520for%2520the%2520meeting.%2522%250A%2520%2520%2520%2520%257D%250A%2520%2520%255D%252C%250A%2520%2520%2522vyteme%2522%253A%2520true%250A%257D%27"
  style="width: 100%; height: 770px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```bash screen-hidden
curl --request POST 'https://api.vyte.in/v2/events' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "title": "Meeting with Quentin Tarantino",
  "created_by": {
    "user": "5f3feb7821046c3bb9327e6a"
  },
  "dates": [
    {
      "all_day": false,
      "date": "2020-09-02T10:00:00",
      "end_date": "2020-09-02T11:00:00"
    }
  ],
  "invitees": {
    "full_name": "Quentin Tarantino",
    "email": "quentin.tarantino@hollywood.com"
  },
  "places": [
    {
      "name": "Place for the meeting."
    }
  ],
  "vyteme": true
}'
```

> Note that it's important for this use case to set the param `vyteme` to true. If you need more information, please refere to [this part](../reference/README.md#vyteme-or-not-vyteme).

Congrats :clap:  
We created our first booking request by using only the API.

## Confirm or cancel the event

The last step in this workflow is to confirm (or cancel) the meeting as soon as our user John Doe is okay.

Nothing complicated for this. We just have to send a `GET` request at `/v2/events/:event_id/confirm` (or `/v2/events/:event_id/cancel`) :

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(74%2C144%2C226%2C1)&t=one-dark&wt=none&l=application%2Fx-sh&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira%20Code&fs=14px&lh=152%25&si=false&es=2x&wm=false&code=curl%2520--request%2520POST%2520%27https%253A%252F%252Fapi-dev2.vyte.in%252Fv2%252Fevents%252F5f43a0caf795d9206556122a%252Fconfirm%27%2520%255C%250A--header%2520%27Authorization%253A%25202lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx%27%2520%255C"
  style="width: 100%; height: 270px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```bash screen-hidden
curl --request POST 'https://api-dev2.vyte.in/v2/events/5f43a0caf795d9206556122a/confirm' \
--header 'Authorization: 2lnpjjrurrl49xja5oo0qujtl60embr7zppiphc5fcav4n7ycx' \
```

Here we are ! We successed to manage a new booking request from end-to-end only with the API.
