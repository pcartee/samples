---
title: "Web Console Case API Reference Guide"
description: "Reference for the LogRhythm Web Console Case REST API, including authentication, case properties, routes, responses, errors, throttling, and JavaScript and C# examples."
author: pcartee
topic: Reference
date: 2017-01-22
uid: cybersec.case.ape.ref
sidebar_position: 5
---

The LogRhythm Web Console Case API is a REST API that communicates over HTTPS and uses JSON. Its routes and methods let you work with cases, such as synchronizing tickets from a bug-tracking system with LogRhythm cases. Each request runs on behalf of the API account associated with the API token in the request.

Use the Case API to:

- Retrieve basic case properties.
- Add a case with basic properties.
- Update basic case properties.
- Add a note to a case.

## Basic case properties

The Case API can retrieve, add, or update the following properties:

| Parameter    | Type   | Definition                                                                   |
| :----------- | :----- | :--------------------------------------------------------------------------- |
| `id`         | string | Database-generated case GUID. You cannot set this value.                     |
| `number`     | number | Case number shown in the Web Console. You cannot set this value.             |
| `externalId` | string | Custom unique identifier, such as a foreign key.                             |
| `name`       | string | Case name. Required when creating a case; 1–250 characters.                  |
| `statusName` | string | Case status: `Created`, `Completed`, `Incident`, `Mitigated`, or `Resolved`. |
| `priority`   | number | Case priority from 1 to 5. Required when creating a case.                    |
| `summary`    | string | Case summary, up to 4,000 characters.                                        |

## Additional case properties

The following property can be used when adding a note to a case:

| Parameter | Type   | Definition                           |
| :-------- | :----- | :----------------------------------- |
| `text`    | string | Text of the note to add to the case. |

## Security

The Case API uses standard protocols to help protect API integrations and maintain data integrity.

- All communication uses HTTPS. The API supports TLS 1.1 and TLS 1.2.
- By default, installation generates self-signed certificates and keys. To use your own certificates and keys, update the service configuration files (`.env` files). For details, see the *Web Console Installation Guide* or the *Client Console Help Guide*.
- The service is stateless. Include a valid API token with every request; the API does not use a login process or maintain a session.
- API tokens are JSON Web Tokens (JWTs) generated through the Client Console and associated with an API account.
- To revoke a token's API access, disable its associated API account or delete the token. The API rejects subsequent requests that use that token.

## Case API reference

### Authentication

Include an API token in the `Authorization` header of every request:

```http
Authorization: Bearer <your-api-token>
```

### Content type

The API uses JSON as its content type.

### API routes

In a route, replace `:caseId` with `externalId/:externalId` or `number/:caseNumber`. Using an external ID is useful when synchronizing cases from another system because it lets you identify LogRhythm cases by that ID.

#### Get a case

`GET /api/cases/:caseId` returns the case details.

The response includes `id`, `number`, `externalId`, `name`, `statusName`, `priority`, and `summary`.

```http
GET /api/cases/number/1
```

Example response:

```json
{
  "id": "BBB41E18-8EB1-403B-A301-038E54AA76C5",
  "number": 1,
  "externalId": "SomeOtherSystem-123",
  "name": "My First Case",
  "statusName": "Created",
  "priority": 3,
  "summary": "You can put up to 4000 chars in the summary."
}
```

#### Create or update a case

`POST /api/cases` creates or updates a case.

The request can include `id`, `number`, `externalId`, `name`, `priority`, and `summary`. For a new case, `name` and `priority` are required. The response includes `id`, `number`, `externalId`, `name`, `statusName`, `priority`, and `summary`.

Example request to create a case:

```http
POST /api/cases
Content-Type: application/json

{
  "name": "My Second Case",
  "priority": 3
}
```

Example response:

```json
{
  "id": "CCC41E18-8EB1-403B-A301-038E54AA77C5",
  "number": 2,
  "externalId": null,
  "name": "My Second Case",
  "statusName": "Created",
  "priority": 3,
  "summary": null
}
```

Example request to update a case:

```http
POST /api/cases
Content-Type: application/json

{
  "id": "BBB41E18-8EB1-403B-A301-038E54AA76C5",
  "number": 1,
  "externalId": "SomeOtherSystem-123",
  "summary": "Updating the summary of my first case."
}
```

To update a specific case, provide `caseId`, `caseNumber`, or `externalId` in the request body. The API searches for a matching case in that order. If it finds no match using `caseId` or `caseNumber`, it returns a `404 Not Found` error. If you provide only an `externalId` and the API finds no match, it creates a case with that external ID.

#### Change a case's status

`PUT /api/cases/:caseId/actions/changeStatus` changes the case status. The request body must include `statusName`. The response includes the case properties.

```http
PUT /api/cases/CCC41E18-8EB1-403B-A301-038E54AA77C5/actions/changeStatus
Content-Type: application/json

{
  "statusName": "Incident"
}
```

#### Add a note to a case

`POST /api/cases/:caseId/evidence/note` adds a note. The request body must include the note text in the `text` property. The response body is empty.

```http
POST /api/cases/number/1/evidence/note
Content-Type: application/json

{
  "text": "I have some additional information for this case."
}
```

### Errors

Responses with an HTTP status code of 400 or higher indicate an error. The JSON response body includes the following properties:

- `statusCode` (number): HTTP status code. For details, see [Response status code explanations](#response-status-code-explanations).
- `name` (string): Short error name, usually associated with the HTTP status code.
- `message` (string): Human-readable error message. The exact message text can change, so API clients should not depend on it.

Depending on the error, the response may include additional properties, such as `messageDetails`, with information about how to correct the request.

### Update objects and clear fields

To clear an optional field, such as `summary`, send `null` as its value. If you omit a property, the API does not clear it.

### Request throttling

By default, the API limits requests to 300 per minute. If you exceed this limit, the API returns a `429 Too Many Requests` response. The `X-Rate-Limit-Remaining` response header indicates how many requests remain in the current rate-limit window.

### Response status code explanations

The Case API uses the following response status codes:

- `200` — The API executed the request successfully.
- `201` — The API executed the request successfully and created a resource.
- `400` — The request is invalid. The response body provides more information. Common causes include:
  - A malformed header.
  - Invalid JSON in the request body.
  - Missing required fields.
  - A field that fails validation, such as a priority outside the range of 1 to 5.
- `401` — The API token is missing, invalid, or expired.
- `429` — The client sent too many requests too quickly. Check the response headers for rate-limit information.
- `500` — An unexpected server error occurred. Check the API service logs for troubleshooting information, or contact [LogRhythm Support](https://logrhythm.com/contact/).

## Sample code

The following examples show how to call the Case API from JavaScript and C#. They use the default certificate validation behavior of their respective HTTP clients. In production, ensure that the server certificate is trusted and validated.

### JavaScript

This Node.js example uses the built-in `https` module and callbacks for asynchronous operations.

```javascript
const https = require('https');

const host = '<your LogRhythm host name or IP address>';
const port = 443;
const apiToken = '<your API token>';

function request(method, path, data, callback) {
  const body = JSON.stringify(data || {});
  const req = https.request({
    host,
    port,
    method,
    path: `/api${path}`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  }, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => { responseBody += chunk; });
    res.on('end', () => {
      if (res.statusCode >= 400) {
        callback(new Error(`API request failed (${res.statusCode}): ${responseBody}`));
        return;
      }
      callback(null, responseBody ? JSON.parse(responseBody) : null);
    });
  });

  req.on('error', callback);
  req.write(body);
  req.end();
}

request('POST', '/cases', {
  externalId: 'example-123',
  name: 'Case created by the API',
  priority: 1,
}, (error, newCase) => {
  if (error) throw error;

  request('POST', '/cases', {
    number: newCase.number,
    summary: 'Additional case details.',
  }, (updateError, updatedCase) => {
    if (updateError) throw updateError;
    console.log(updatedCase);
  });
});
```

### C# example

This example uses RestSharp and Newtonsoft.Json, both available from NuGet. It assumes a version of .NET that supports TLS 1.1 and TLS 1.2.

```csharp
using Newtonsoft.Json;
using RestSharp;
using System;

var client = new RestClient("https://<your LogRhythm host name or IP address>/api/");
const string apiToken = "<your API token>";

var request = new RestRequest("cases", Method.Post);
request.AddHeader("Authorization", $"Bearer {apiToken}");
request.AddJsonBody(new
{
    externalId = "example-123",
    name = "Case created by the API",
    priority = 1
});

var response = client.Execute(request);
if (!response.IsSuccessful)
{
    throw new Exception($"API request failed: {response.StatusCode} {response.Content}");
}

dynamic newCase = JsonConvert.DeserializeObject(response.Content);
Console.WriteLine($"Created case {newCase.number}");
```
