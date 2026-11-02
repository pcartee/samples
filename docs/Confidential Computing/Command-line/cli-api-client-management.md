---
title: API client management
description: Reference for using `tactl` to create, update, retrieve, and delete Trust Authority API clients; list API client policies and tags; and create, list, and delete tags.
author: pcartee
topic-type: Reference
date: "2024-01-03"
uid: api-client-management
sidebar_position: 4
---

Use these commands to manage Trust Authority (TA) API clients, policies, and tags.

:::note
You need an admin API key to run these commands. For more information, see [Copy an admin API key](../Quickstart/tutorial-api-key.md#admin-keys).
:::

## Create an API client

This command creates an attestation API key and its associated metadata, including policies and tags. To retrieve the key, use the portal. For instructions, see [Getting started](../Quickstart/tutorial-api-key.md).

```bash
tactl create apiClient -r SERVICE_ID -p PRODUCT_ID -n "API_CLIENT_NAME" -i "POLICY_ID_1,POLICY_ID_2" -v "TAG_ID_1:TAG_NAME_1,TAG_ID_2:TAG_NAME_2"
```

Replace the uppercase placeholders with the corresponding values.

### Sample call

```bash
tactl create apiClient -n "TestApiClientKeyDefaultTag" -p 095e2a13-b913-4d66-9c4d-f6e8a40f5915 -r 382d4141-103b-47f3-a001-13490db89d1d -v Workload:testworkload
```

### Sample response

```text
trace-id:  LOnu-EK3IAMEHdA=
ApiClient:

{
  "id": "60e94c91-e181-4bbe-9325-df6d8ac52866",
  "service_id": "382d4141-103b-47f3-a001-13490db89d1d",
  "service_offer_name": "",
  "product_id": "095e2a13-b913-4d66-9c4d-f6e8a40f5915",
  "product_name": "Enterprise",
  "status": "Active",
  "name": "TestApiClientKeyDefaultTag",
  "keys": [
    "<redacted>"
  ],
  "policy_ids": null,
  "tags": [
    {
      "key": "Workload",
      "value": "testworkload",
      "predefined": true
    }
  ],
  "created_at": "2023-09-14T04:04:47.626821351Z",
  "product_type": "attestation"
}
```

## Update an API client

This command updates an API client's policies and tags.

```bash
tactl update apiClient -r SERVICE_ID -p PRODUCT_ID -c API_CLIENT_ID -i "POLICY_ID_1,POLICY_ID_2" -v "TAG_KEY_1:TAG_VALUE_1,TAG_KEY_2:TAG_VALUE_2"
```

Replace the uppercase placeholders with the corresponding values.

### Sample call

```bash
tactl update apiClient -r 382d4141-103b-47f3-a001-13490db89d1d -p 095e2a13-b913-4d66-9c4d-f6e8a40f5915 -c 0c5be66c-fac0-4c27-825b-22ee5abbbf71 -i 32489d08-9a79-4643-b526-f4402cba3c29 -v "Tag:abc123"
```

### Sample response

```text
trace-id:  LOnw6Fv6oAMEstQ=
ApiClient:

{
  "id": "0c5be66c-fac0-4c27-825b-22ee5abbbf71",
  "service_id": "382d4141-103b-47f3-a001-13490db89d1d",
  "product_id": "095e2a13-b913-4d66-9c4d-f6e8a40f5915",
  "product_name": "",
  "status": "Active",
  "name": "Amber-ApiClient_Key123",
  "created_at": "2023-09-14T04:04:46.280101Z",
  "product_type": "attestation"
}
```

## List API clients

This command lists API clients for a service.

```bash
tactl list apiClient -r SERVICE_ID
```

### Sample call

```bash
tactl list apiClient -r 382d4141-103b-47f3-a001-13490db89d1d
```

### Sample response

```text
trace-id:  LOnw6Fv6oAMEstQ=
ApiClient:

{
  "id": "948rujr4-e3rt-0oke-ok8u-fr45tk9mf2q1",
  "service_id": "09kjmn3w-9i8u-043kd-p0j3-3erf098kjmnf",
  "product_id": "pldo9ide3e-09id-0odc-p0od-podo85mn324d",
  "product_name": "Enterprise",
  "status": "Inactive",
  "description": "Sample tenant API client",
  "expired_at": "2022-11-14T11:08:40.804604Z",
  "created_at": "2022-10-14T10:15:24.376065Z"
}
```

## Get an API client by ID

This command displays a specific TA API client. Replace the uppercase placeholders with the corresponding IDs.

```bash
tactl list apiClient -r SERVICE_ID -c API_CLIENT_ID
```

### Sample call

```bash
tactl list apiClient -r 382d4141-103b-47f3-a001-13490db89d1d -c 0c5be66c-fac0-4c27-825b-22ee5abbbf71
```

### Sample response

```text
trace-id:  LOny2GU8IAMEgZw=
ApiClients:

{
  "id": "0c5be66c-fac0-4c27-825b-22ee5abbbf71",
  "service_id": "382d4141-103b-47f3-a001-13490db89d1d",
  "service_offer_name": "TEE Attestation",
  "product_id": "095e2a13-b913-4d66-9c4d-f6e8a40f5915",
  "product_name": "Enterprise",
  "status": "Active",
  "name": "Amber-ApiClient_Key123",
  "keys": [
    "<redacted>"
  ],
  "policy_ids": [],
  "tags": [],
  "created_at": "2023-09-14T04:04:46.280101Z",
  "product_type": "attestation"
}
```

## Delete an API client

This command deletes a TA API client. Replace the uppercase placeholders with the corresponding IDs.

```bash
tactl delete apiClient -r SERVICE_ID -c API_CLIENT_ID
```

### Sample call

```bash
tactl delete apiClient -r 382d4141-103b-47f3-a001-13490db89d1d -c 0c5be66c-fac0-4c27-825b-22ee5abbbf71
```

### Sample response

```text
trace-id:  LOn0YHigIAMEX7g=
Deleted api client with Id: 36ffa32c-e1df-46a2-9d57-f2be51c07d9f
```

## List API client policies

This command lists the policies associated with an API client.

```bash
tactl list apiClient policy -r SERVICE_ID -c API_CLIENT_ID
```

### Sample call

```bash
tactl list apiClient policy -r 382d4141-103b-47f3-a001-13490db89d1d -c 3a7e48bc-0d7a-4078-b830-8d4da2b5b704
```

### Sample response

```text
trace-id:  LOnzYH4uoAMEdiQ=
Policy IDs:
{
  "policy_ids": [
    "32489d08-9a79-4643-b526-f4402cba3c29"
  ]
}
```

## Create a tag

This command creates a tag for TA.

```bash
tactl create tag -n TAG_NAME
```

Replace `TAG_NAME` with the name of the tag.

### Sample call

```bash
tactl create tag -n "SampleTag"
```

### Sample response

```text
trace-id:  LOnIBH5yIAMEJ5Q=
{
  "id": "60f29395-2ffc-4e65-8e60-5abbd2e97d1c",
  "name": "SampleTag",
  "predefined": false
}
```

## List tags

This command lists the tags associated with your TA system.

```bash
tactl list tag
```

### Sample call

```bash
tactl list tag
```

### Sample response

```text
trace-id:  LOnI6FFjIAMEYaQ=
Tags:
{
  "tags": [
    {
      "id": "010fe8cf-5f6c-4840-a0b0-df96168bc2b3",
      "name": "Workload",
      "predefined": true
    },
    {
      "id": "976e4fe8-b5ba-4443-a7d6-fd2544cadb69",
      "name": "AmberTag",
      "predefined": false
    },
    {
      "id": "259d1b98-16d7-42ed-a3da-f9ddb2cc842d",
      "name": "Amber-Tag",
      "predefined": false
    },
    {
      "id": "63245ae5-7519-4347-9de2-fece6fc3848b",
      "name": "Amber_Tag",
      "predefined": false
    }
  ]
}
```

## Delete a tag

This command deletes a tag.

```bash
tactl delete tag -t TAG_ID
```

Replace `TAG_ID` with the ID of the tag to delete.

### Sample call

```bash
tactl delete tag -t 47yukjsv-29op-38sq-v3g8-xcqd456hju7i
```

### Sample response

```text
tag 47yukjsv-29op-38sq-v3g8-xcqd456hju7i deleted
```

## List API client tags

This command lists the tags associated with an API client.

```bash
tactl list apiClient tag -r SERVICE_ID -c API_CLIENT_ID
```

### Sample call

```bash
tactl list apiClient tag -r 382d4141-103b-47f3-a001-13490db89d1d -c 30686bc0-0a75-4086-9a4c-4c59bea6df64
```

### Sample response

```text
trace-id:  LOnz5H8OoAMEVtQ=
Tags:
{
  "tags": [
    {
      "key": "AmberTag",
      "value": "AmberTagValue",
      "predefined": false
    }
  ]
}
```
