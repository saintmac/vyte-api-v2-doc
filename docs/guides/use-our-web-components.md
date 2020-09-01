# Use our web components

We provide a web component to integrate the Vyte slot picker directly in your website. This is a fully configurable Vue.js component with the following props:

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

<iframe
  src="/slot-picker.html"
  style="width: 100%; height: 300px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin" class="mobile-hidden">
</iframe>

```html
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
>
</vyte-slot-picker>

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
```
