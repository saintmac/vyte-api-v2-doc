# Set up booking parameters in the link

In Vyte you can create your own booking page and send its link, like `vyte.in/yourname`, to other people. Pretty cool, right? :smirk:
But you can also add some parameters of your meeting directly to the link. Let's have a look :point_down:.

[[toc]]

## Embedding a Vyte Page (optional)

If you would like to embed a Vyte booking page directly into your website, it is very simple.
Just add the following line of code to your website:

```
<iframe src="https://www.vyte.in/demovyte?embed" width="100%" height="1000px" frameborder="0">https://www.vyte.in/demovyte</iframe>
```
where `/demovyte` is the path of your Vyte booking Page.

As you may have noticed, there is an `?embed` query parameter. Make sure to keep it if you add other query parameters, to ensure that the booking page is optimized for iframe embeds.

You can also get this line of code, customized for a specific user, from [that user's account settings](https://www.vyte.in/pages/1#share).

## Getting started

You don't need to register your app to do that, however you will need to have set up a Vyte page with a pro Vyte account.

- If you don't have a Vyte account yet, [sign up](https://vyte.in/page) to set up your Vyte page.
- If you already have a Vyte account, but don't have a Vyte page yet, set it up from your [Vyte account](https://www.vyte.in/pages).
- Make sure to enable the "Enable API variables in URL" setting in the [advanced Vyte page settings](https://www.vyte.in/pages/1#pro).

## Appointment duration

You can set the duration (in minutes) of an appointment directly in the URL as such:

- https://vyte.in/yourname/30 for a 30 minutes appointment
- https://vyte.in/yourname/120 for a 2 hours appointment

## URL parameters

You can use these parameters with the URL of your Vyte page (ex: `https://vyte.in/yourname`).

> Make sure to URL-encode white spaces in your content (replace them with `%20`), otherwise it could break the URL.

<attributes title="Query parameters">

  <attribute name="cn" type="string" :required=false>
Creator name: useful to auto set a title with the name of all the participants.
  </attribute>

  <attribute name="cm" type="string" :required=false>
Creator e-mail: if you set `cn`, your invitees won't be prompted to enter their name and email or to log in with Google to book you. We highly recommend populating `cm` along with it.
  </attribute>

  <attribute name="cc" type="string" :required=false>
Creator company: make sure to enable the "Ask for company" setting in your advanced Vyte page settings.
  </attribute>

  <attribute name="cp" type="string" :required=false>
Creator phone number: make sure to enable the "Ask for phone number" setting in your advanced Vyte page settings.
  </attribute>

  <attribute name="em" type="string" :required=false>
Event message.
  </attribute>

  <attribute name="et" type="string" :required=false>
Event title.
  </attribute>

  <attribute name="places" type="string" :required=false>
Event places: place name and address separated by a single pipe (|) and several places separated by a double pipe (||).
  </attribute>

  <attribute name="aid" type="string" :required=true>
App ID: your app ID for Vyte. You get it when you register your app with `POST /v2/third_parties` (see [this guide](/guides/add-scheduling-features-to-your-app-or-platform/#register-your-app)).
  </attribute>

  <attribute name="agid" type="string" :required=false>
App Group ID: this is an id you will provide to Vyte, that you will use to identify a group of users such as a team, a project, etc.
  </attribute>

</attributes>

### Example
With some of these parameters set, the URL of your booking page will look like:

```jsonp light-code

https://www.vyte.in/john/20?et=Meeting%20%7B%7Binvitee%7D%7D&cm=john.doe@example.com&cn=John%20Doe&places=Skype%7Cjohn%7C%7CGoogle%20Hangouts%7Cjohn.doe@example.com&em=Hello

```
Here we see that:
- the page belongs to `John`
- event title is `Meeting <invitee name>`
- John's email is `john.doe@example.com`
- John's name is `John Doe`
- John proposes two places for the meeting: Skype and Google Hangouts
- the event message is set to `Hello`

Presetting some parameters will save time and help to avoid accidental mistakes.
