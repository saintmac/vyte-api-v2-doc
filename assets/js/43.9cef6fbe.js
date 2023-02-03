(window.webpackJsonp=window.webpackJsonp||[]).push([[43],{424:function(t,a,s){"use strict";s.r(a);var e=s(4),r=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"webhooks"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#webhooks"}},[t._v("#")]),t._v(" Webhooks")]),t._v(" "),s("h2",{attrs:{id:"available-webhooks"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#available-webhooks"}},[t._v("#")]),t._v(" Available webhooks")]),t._v(" "),s("p",[t._v("When registering for webhooks, you register for "),s("code",[t._v("actions")]),t._v(' on resources. Actions are often called "events" in the webhooks terminology, but since Vyte\'s main resource is called "Event" we decided to name them '),s("code",[t._v("actions")]),t._v(".")]),t._v(" "),s("h3",{attrs:{id:"event-resource"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#event-resource"}},[t._v("#")]),t._v(" Event resource")]),t._v(" "),s("p",[t._v("This is the main resource on Vyte. An "),s("code",[t._v("event")]),t._v(" is a meeting, 1-on-1 or group. It can be already confirmed, or still in the planing phase.")]),t._v(" "),s("p",[t._v("Usually an event is created, then confirmed and sometimes updated or cancelled.")]),t._v(" "),s("h4",{attrs:{id:"event-created"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#event-created"}},[t._v("#")]),t._v(" "),s("code",[t._v("event.created")])]),t._v(" "),s("p",[t._v("When an event has been created")]),t._v(" "),s("h4",{attrs:{id:"event-confirmed"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#event-confirmed"}},[t._v("#")]),t._v(" "),s("code",[t._v("event.confirmed")])]),t._v(" "),s("p",[t._v("When an event has been confirmed which means a date and / or place have been decided.")]),t._v(" "),s("p",[t._v("Some events can be created already confirmed. In this case both "),s("code",[t._v("event.created")]),t._v(" and "),s("code",[t._v("event.confirmed")]),t._v(" actions are fired.")]),t._v(" "),s("h4",{attrs:{id:"event-updated"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#event-updated"}},[t._v("#")]),t._v(" "),s("code",[t._v("event.updated")])]),t._v(" "),s("p",[t._v("When an event that was already confirmed has ben edited an reconfirmed.\nUsually the final date and / or place has been changed but there is no guarantee of it.")]),t._v(" "),s("h4",{attrs:{id:"event-cancelled"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#event-cancelled"}},[t._v("#")]),t._v(" "),s("code",[t._v("event.cancelled")])]),t._v(" "),s("p",[t._v("When an event, confirmed or not, has been cancelled.")]),t._v(" "),s("h3",{attrs:{id:"user-resource"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#user-resource"}},[t._v("#")]),t._v(" User resource")]),t._v(" "),s("p",[t._v("A user is someone that has signed up to Vyte.")]),t._v(" "),s("h4",{attrs:{id:"user-joined"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#user-joined"}},[t._v("#")]),t._v(" "),s("code",[t._v("user.joined")])]),t._v(" "),s("p",[t._v("When a user has joined an organization using a link such as "),s("code",[t._v("https://yourapp.vyte.in/organizations/1234/join")]),t._v(" .\nIf you have passed us an external id from your app "),s("code",[t._v("extid")]),t._v(" as a query parameter, you will get it back as the "),s("code",[t._v("resource.account.organization.extid")]),t._v(" property")]),t._v(" "),s("h2",{attrs:{id:"authentication-for-webhooks"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#authentication-for-webhooks"}},[t._v("#")]),t._v(" Authentication for Webhooks")]),t._v(" "),s("p",[t._v("To use webhooks you need to have a Vyte organization and an "),s("a",{attrs:{href:"#api-keys"}},[t._v("API key for your organization")])]),t._v(" "),s("p",[s("a",{attrs:{href:"#authenticating-a-request-with-an-api-key"}},[t._v("All requests require to be authenticated")])]),t._v(" "),s("h2",{attrs:{id:"creating-a-webhook"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#creating-a-webhook"}},[t._v("#")]),t._v(" Creating a webhook")]),t._v(" "),s("blockquote",[s("p",[t._v("Example")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("POST https://api.vyte.in/hooks\n")])])]),s("blockquote",[s("p",[t._v("Body")])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"action"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"event.cancelled"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"target_url"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://api.example.com/hooks/12345"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("blockquote",[s("p",[t._v("Response on success: "),s("code",[t._v("201 Created")])])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"__v"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"createdAt"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2018-01-04T15:00:58.486Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"updatedAt"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2018-01-04T15:00:58.486Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"organization"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"14ce14c8a8ced358c78a5c231d"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"scope"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"organization"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"action"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"event.cancelled"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"target_url"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://api.example.com/hooks/12345"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"5a4e41aaa8ced3001bf5da77"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"http-request"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#http-request"}},[t._v("#")]),t._v(" HTTP request")]),t._v(" "),s("p",[s("code",[t._v("POST /hooks")])]),t._v(" "),s("h3",{attrs:{id:"request-body"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-body"}},[t._v("#")]),t._v(" Request body")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Field")]),t._v(" "),s("th",[t._v("Type")]),t._v(" "),s("th",[t._v("Mandatory")]),t._v(" "),s("th",[t._v("Definition")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("action")]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("true")]),t._v(" "),s("td",[t._v("The action that you want to be aware of")])]),t._v(" "),s("tr",[s("td",[t._v("target_url")]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("true")]),t._v(" "),s("td",[t._v("The URL you want to be called at when the "),s("code",[t._v("action")]),t._v(" occurs. This must be a https url.")])])])]),t._v(" "),s("p",[s("em",[t._v("The "),s("code",[t._v("action")]),t._v(" field is often called "),s("code",[t._v("event")]),t._v(" in the Webhooks terminology.\nAs Events are the main resource on Vyte's API, we named that field "),s("code",[t._v("action")]),t._v(" to avoid confusion.")])]),t._v(" "),s("h2",{attrs:{id:"getting-a-webhook"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#getting-a-webhook"}},[t._v("#")]),t._v(" Getting a webhook")]),t._v(" "),s("blockquote",[s("p",[t._v("Example")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("GET https://api.vyte.in/hooks/5a4e41aaa8ced3001bf5da77\n")])])]),s("blockquote",[s("p",[t._v("Response on success: "),s("code",[t._v("200 OK")])])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"__v"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"createdAt"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2018-01-04T15:00:58.486Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"updatedAt"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2018-01-04T15:00:58.486Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"organization"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"14ce14c8a8ced358c78a5c231d"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"scope"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"organization"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"action"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"event.cancelled"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"target_url"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://api.example.com/hooks/12345"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"5a4e41aaa8ced3001bf5da77"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"http-request-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#http-request-2"}},[t._v("#")]),t._v(" HTTP request")]),t._v(" "),s("p",[s("code",[t._v("GET /hooks/:hook_id")])]),t._v(" "),s("p",[t._v("where "),s("code",[t._v(":hook_id")]),t._v(" is the "),s("code",[t._v("_id")]),t._v(" of the webhook obtained when creating the webhook.")]),t._v(" "),s("h2",{attrs:{id:"updating-a-webhook"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#updating-a-webhook"}},[t._v("#")]),t._v(" Updating a webhook")]),t._v(" "),s("blockquote",[s("p",[t._v("Example")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("PUT https://api.vyte.in/hooks/5a4e41aaa8ced3001bf5da77\n")])])]),s("blockquote",[s("p",[t._v("Body")])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"action"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"event.updated"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"target_url"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://api.example.com/hooks/54321"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("blockquote",[s("p",[t._v("Response on success: "),s("code",[t._v("200 OK")])])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"__v"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"createdAt"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2018-01-04T15:00:58.486Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"updatedAt"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2018-01-04T15:00:58.486Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"organization"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"14ce14c8a8ced358c78a5c231d"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"scope"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"organization"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"action"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"event.updated"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"target_url"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://api.example.com/hooks/54321"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"5a4e41aaa8ced3001bf5da77"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"http-request-3"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#http-request-3"}},[t._v("#")]),t._v(" HTTP request")]),t._v(" "),s("p",[s("code",[t._v("PUT /hooks/:hook_id")])]),t._v(" "),s("p",[t._v("where "),s("code",[t._v(":hook_id")]),t._v(" is the "),s("code",[t._v("_id")]),t._v(" of the webhook obtained when creating the webhook.")]),t._v(" "),s("h3",{attrs:{id:"request-body-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-body-2"}},[t._v("#")]),t._v(" Request body")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Field")]),t._v(" "),s("th",[t._v("Type")]),t._v(" "),s("th",[t._v("Mandatory")]),t._v(" "),s("th",[t._v("Definition")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("action")]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("true")]),t._v(" "),s("td",[t._v("The action that you want to be aware of")])]),t._v(" "),s("tr",[s("td",[t._v("target_url")]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("true")]),t._v(" "),s("td",[t._v("The URL you want to be called at when the "),s("code",[t._v("action")]),t._v(" occurs. This must be a https url.")])])])]),t._v(" "),s("h2",{attrs:{id:"deleting-a-webhook"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#deleting-a-webhook"}},[t._v("#")]),t._v(" Deleting a webhook")]),t._v(" "),s("blockquote",[s("p",[t._v("Example")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("DELETE https://api.vyte.in/hooks/1234\n")])])]),s("blockquote",[s("p",[t._v("Response on success: "),s("code",[t._v("204 No Content")])])]),t._v(" "),s("h3",{attrs:{id:"http-request-4"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#http-request-4"}},[t._v("#")]),t._v(" HTTP request")]),t._v(" "),s("p",[s("code",[t._v("DELETE /hooks/:hook_id")])]),t._v(" "),s("p",[t._v("where "),s("code",[t._v(":hook_id")]),t._v(" is the "),s("code",[t._v("_id")]),t._v(" of the webhook obtained when creating the webhook.")]),t._v(" "),s("h2",{attrs:{id:"listing-all-your-webhooks"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#listing-all-your-webhooks"}},[t._v("#")]),t._v(" Listing all your webhooks")]),t._v(" "),s("blockquote",[s("p",[t._v("Example")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("GET https://api.vyte.in/hooks\n")])])]),s("blockquote",[s("p",[t._v("Response on success: "),s("code",[t._v("200 OK")])])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"hooks"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"__v"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"createdAt"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2018-01-04T15:00:58.486Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"updatedAt"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2018-01-04T15:00:58.486Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"organization"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"14ce14c8a8ced358c78a5c231d"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"scope"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"organization"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"action"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"event.cancelled"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"target_url"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://api.example.com/hooks/12345"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"_id"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"5a4e41aaa8ced3001bf5da77"')]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"http-request-5"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#http-request-5"}},[t._v("#")]),t._v(" HTTP request")]),t._v(" "),s("p",[s("code",[t._v("GET /hooks")])]),t._v(" "),s("p",[t._v("returns a "),s("code",[t._v("hooks")]),t._v(" array.")]),t._v(" "),s("h2",{attrs:{id:"getting-a-webhook-call"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#getting-a-webhook-call"}},[t._v("#")]),t._v(" Getting a webhook call")]),t._v(" "),s("blockquote",[s("p",[t._v("Example:")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("POST https://api.example.com/hooks/12345\n")])])]),s("blockquote",[s("p",[t._v("HEADERS:")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("Content-Type: application/json\n")])])]),s("blockquote",[s("p",[t._v("BODY:")])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"action"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"event.cancelled"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"resource"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"cancelled"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-12-01T12:05:00.000Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"confirmed"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"flag"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"created_by"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"email"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"user.name@domain.com"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"dates"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"all_day"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"date"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-11-10T11:00:00.000Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"end_date"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2017-11-10T12:00:00.000Z"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"invitees"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"full_name"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Person booking a slot name"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"email"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"jean.dupont@domain.com"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"phone"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"0601020304"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"lang"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"fr"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"locale"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"fr"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"messages"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"body"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"I’m booking appointment about this"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"places"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"name"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Office name"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"address"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"12 rue de Rivoli, 75004, Paris, France"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"timezone"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Europe/Paris"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"title"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Appointment about topic"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"vyteme"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"organization"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"14ce14c8a8ced358c78a5c231d"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("When an action you have subscribed a webhook for is performed on a resource, Vyte will call your API at the "),s("code",[t._v("target_url")]),t._v(" you provided.")]),t._v(" "),s("h3",{attrs:{id:"http-request-6"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#http-request-6"}},[t._v("#")]),t._v(" HTTP request")]),t._v(" "),s("p",[s("code",[t._v("POST target_url")]),t._v("\nVyte will perform a POST request at the "),s("code",[t._v("target_url")]),t._v(" provided")]),t._v(" "),s("h4",{attrs:{id:"request-body-3"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#request-body-3"}},[t._v("#")]),t._v(" Request body")]),t._v(" "),s("p",[t._v("The request body is an array of objects representing actions that have happened on a resource linked to your api key.\nYou can assume this array will always have a length of 1 but that may change in the future.")]),t._v(" "),s("p",[t._v("Object properties")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Property")]),t._v(" "),s("th",[t._v("Type")]),t._v(" "),s("th",[t._v("Always present")]),t._v(" "),s("th",[t._v("Definition")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("action")]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("true")]),t._v(" "),s("td",[t._v("The action that happened on the resource. ex: "),s("code",[t._v("event.cancelled")])])]),t._v(" "),s("tr",[s("td",[t._v("organization")]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("false")]),t._v(" "),s("td",[t._v("The "),s("code",[t._v("id")]),t._v(" of the organization linked to that action")])]),t._v(" "),s("tr",[s("td",[t._v("user")]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("false")]),t._v(" "),s("td",[t._v("The "),s("code",[t._v("id")]),t._v(" of the user linked to that action")])]),t._v(" "),s("tr",[s("td",[t._v("resource")]),t._v(" "),s("td",[t._v("Object")]),t._v(" "),s("td",[t._v("true")]),t._v(" "),s("td",[t._v("The resource that has been updated by this action. An event object for instance.")])])])])])}),[],!1,null,null,null);a.default=r.exports}}]);