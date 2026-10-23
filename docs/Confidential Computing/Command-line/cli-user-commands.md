---
title: TA CLI user management
description: Reference for creating, listing, updating, and deleting TA users and configuring tenant notification settings with the TA CLI.
author: pcartee
topic-type: Reference
date: 08/17/2023
uid: cli-user-commands
sidebar_position: 2
---

Use these commands to manage users with the TA CLI. You can also manage users in the TA portal by following the [manage users workflow](../How-to%20workflows/howto-manage-users.md).

## Create a user

This command creates a TA user.

`tactl create user -e <email address> -r <role (Tenant Admin or User)>`

### Sample call

```bash
tactl create user -e "user@example.com" -r User
```

### Sample response

```text
trace-id:  LOnduFR-IAMEVqw=
User:

{
  "id": "8f96ee5c-69a7-497d-9cf7-900ed2250470",
  "email": "user@example.com",
  "role": {
    "id": "885391bf-2a37-4dc7-9444-833c5a817cdf",
    "name": "User"
  },
  "active": false,
  "created_at": "2023-09-14T04:02:57.329824144Z",
  "privacy_acknowledgement": false
}
```

## List users

This command lists the users in your TA environment.

`tactl list user`

### Sample call

```bash
tactl list user
```

### Sample response

```text
trace-id:  LOnetHW6IAMEEQQ=
Users:
[
  {
    "id": "e3968eb8-e053-4646-98dd-7b61991a66d1",
    "email": "user@example.com",
    "tenant_roles": [
      {
        "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1",
        "roles": [
          {
            "id": "66ec2e33-8cd3-42b1-8963-c7765205446e",
            "name": "Tenant Admin"
          }
        ]
      }
    ],
    "active": true,
    "created_at": "2022-09-29T16:42:46.236499Z"
  },
  {
    "id": "f9af3e31-9fc5-48db-afc3-c818049f6570",
    "email": "user@example.com",
    "tenant_roles": [
      {
        "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1",
        "roles": [
          {
            "id": "66ec2e33-8cd3-42b1-8963-c7765205446e",
            "name": "Tenant Admin"
          }
        ]
      }
    ],
    "active": false,
    "created_at": "2022-10-01T01:00:53.924856Z"
  },
  {
    "id": "82ac5d98-c8ba-49cf-ac3e-4d4a1385be68",
    "email": "user@example.com",
    "tenant_roles": [
      {
        "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1",
        "roles": [
          {
            "id": "885391bf-2a37-4dc7-9444-833c5a817cdf",
            "name": "User"
          }
        ]
      }
    ],
    "active": false,
    "created_at": "2022-10-01T01:27:44.145412Z"
  },
  {
    "id": "42850600-7a58-43a1-970a-85bb4008cd88",
    "email": "user@example.com",
    "tenant_roles": [
      {
        "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1",
        "roles": [
          {
            "id": "66ec2e33-8cd3-42b1-8963-c7765205446e",
            "name": "Tenant Admin"
          }
        ]
      }
    ],
    "active": false,
    "created_at": "2022-10-11T20:30:40.348744Z"
  },
  {
    "id": "1c83eeb3-e9f7-4a59-8104-7009f6f385b0",
    "email": "user@example.com",
    "tenant_roles": [
      {
        "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1",
        "roles": [
          {
            "id": "66ec2e33-8cd3-42b1-8963-c7765205446e",
            "name": "Tenant Admin"
          }
        ]
      }
    ],
    "active": false,
    "created_at": "2022-10-11T21:16:45.358066Z"
  },
  {
    "id": "598db1fc-4340-4bbc-9e19-2d596c3b7bd8",
    "email": "user@example.com",
    "tenant_roles": [
      {
        "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1",
        "roles": [
          {
            "id": "885391bf-2a37-4dc7-9444-833c5a817cdf",
            "name": "User"
          }
        ]
      }
    ],
    "active": false,
    "created_at": "2022-10-12T03:18:17.545383Z"
  },
  {
    "id": "dd4b49c7-9207-43e4-a3c1-8c734cf828a4",
    "email": "user@example.com",
    "tenant_roles": [
      {
        "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1",
        "roles": [
          {
            "id": "66ec2e33-8cd3-42b1-8963-c7765205446e",
            "name": "Tenant Admin"
          }
        ]
      }
    ],
    "active": false,
    "created_at": "2022-10-12T03:18:19.458591Z"
  }
]
```

## Get users by email address

This command lists users in your TA environment by email address.

`tactl list user -e <email address>`

### Sample call

```bash
tactl list user -e "user@example.com"
```

### Sample response

```text
trace-id:  LOnezF_5oAMEHZQ=
Users:

{
  "id": "8f96ee5c-69a7-497d-9cf7-900ed2250470",
  "email": "user@example.com",
  "role": {
    "id": "885391bf-2a37-4dc7-9444-833c5a817cdf",
    "name": "User"
  },
  "active": false,
  "created_at": "2023-09-14T04:02:57.329824Z",
  "privacy_acknowledgement": false
}
```

## Update a user's role

This command updates a specific user's role.

`tactl update user role -u <user ID> -r <role (Tenant Admin or User)>`

### Sample call

```bash
tactl update user role -a "<redacted admin API key>" -u "4324598fs-0404-4f4r-9oii9-8f8flk893w21" -r "Tenant Admin"
```

### Sample response

```text
trace-id:  LOnetHW6IAMEEQQ=
Updated User:
{
  "id": "598db1fc-4340-4bbc-9e19-2d596c3b7bd8",
  "email": "user@example.com",
  "tenant_roles": [
    {
      "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1",
      "roles": [
        {
          "id": "66ec2e33-8cd3-42b1-8963-c7765205446e",
          "name": "Tenant Admin"
        }
      ]
    }
  ],
  "active": false,
  "created_at": "2022-10-12T03:18:17.545383Z"
}
```

## Delete a user

This command deletes a specific user.

`tactl delete user -u <user ID>`

### Sample call

```bash
tactl delete user -a "<redacted admin API key>" -u "4324598fs-0404-4f4r-9oii9-8f8flk893w21"
```

### Sample response

```text
trace-id:  LOnf6FS_oAMEXPw=
User 4324598fs-0404-4f4r-9oii9-8f8flk893w21 deleted
```

## List tenant settings

This command lists the email address used to send notifications when an attestation failure occurs.

`tactl list tenant-settings`

### Sample response

```text
trace-id: LOnTaExEoAMECsQ=
Tenant Settings:
 {
  "attest_failure_email": ""
}
```

## Update tenant settings

Enter an email address to receive notifications when an attestation failure occurs. Notifications are sent only for attestation failures, not policy mismatches. By default, notifications are disabled.

`tactl update tenant-settings -e "<email address>"`

### Sample call

```bash
tactl update tenant-settings -e user@example.com
```

### Sample response

```text
trace-id:  LOnTgGR2IAMEFAA=
 {
  "attest_failure_email": "user@example.com"
}
```

## Disable tenant notifications

This command disables notifications when an attestation failure occurs.

`tactl update tenant-settings -d`

### Sample response

```text
trace-id:  LOnTnGxjoAMEdWQ=
Updated Tenant Settings:
 {
  "attest_failure_email": ""
}
```
