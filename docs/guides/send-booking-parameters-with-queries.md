# Set up booking parameters in the link

In Vyte you can create your own booking page to send to other people the link like 'vyte.in/yourname'. Pretty cool, right? :smirk:
But you also can add some parameters of you meeting directly to the link. Let's have a look :point_down:.

[[toc]]

## Embedding a Vyte Page (optional)

If you would like to embed a Vyte booking page directly into your website, it is very simple.
Just add the following line of code to your website:

```
<iframe src="https://www.vyte.in/demovyte?embed" width="100%" height="1000px" frameborder="0">https://www.vyte.in/demovyte</iframe>
```
where `/demovyte` is the path of your Vyte booking Page.

As you may have noticed there is a `?embed` query paramater, make sure to keep it if you add other query parameters to ensure that the booking page is optimized for iframe embeds.

You can also get this line of code, customized for a specific user from [that user account settings](https://www.vyte.in/pages/1#share)

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

You can use those parameters with the URL of your Vyte page (ex: https://vyte.in/yourname).
> Make sure to urlEncode white spaces in your content (replace them by %20), otherwise it could break the URL.

<attributes title="Query parameters">

  <attribute name="cn" type="string" :required=false>
Creator name: useful to auto set a title with the name of all the participants.
  </attribute>

  <attribute name="cm" type="string" :required=false>
Creator e-mail: if you set cn your invitees won't be prompted to put their name and emails or to login with Google to book you. We highly recommend to populate cm along.
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
App ID: your app ID for Vyte. You get it when you register your app with GET /thirdparties/new.
  </attribute>

  <attribute name="agid" type="string" :required=false>
App Group ID: this is an id you will provide to Vyte, that you will use to identify a group of users such as a team, a project, etc.
  </attribute>

</attributes>

### Example
With some of these parameters set the URL to your booking page will look like:

```jsonp light-code

https://www.vyte.in/john/20?et=Meeting%20%7B%7Binvitee%7D%7D&cm=john.doe@domain.com&cn=John%20Doe&places=Skype%7Cjohn%7C%7CGoogle%20Hangouts%7Cjoh.doe@domain.com&em=Hello

```
Here we see that:
- the page belongs to `John`
- event title is `Meeting <invitee name>`
- John's email is `john.doe@domain.com`
- John's name is `John Doe`
- John has two places for meetings: Skype and Google Hangouts
- Event message is set to `Hello`

Presetting some parameters will save your time and help to avoid accidental mistakes.
