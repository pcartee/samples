---
title: User management
description: Learn how tenant admins can view, invite, search for, update, and delete TA users through the portal or CLI.
author: pcartee
topic: how to
date: 12/09/2024
uid: manage.users # Do not change uid!
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

TA has two user roles: _tenant admin_ and _user_. Tenant admins can perform all user functions and manage other users through the Manage Users dashboard. Each tenant must have at least one active tenant admin. TA automatically assigns this role to the first TA subscriber from a tenant organization. Only tenant admins can invite, edit, and delete users.

:::important
Enable more than one tenant admin account for redundancy.
:::

You can manage users through the TA portal, the [CLI](../Command-line/cli-user-commands.md), or the REST API.

<Tabs>
  <TabItem value="TA portal" label="TA portal" default>

## Portal

### View tenant admins and users

To view the users in your tenant:

1. Sign in as a tenant admin.

1. Select **Manage users**.

     ![Manage Users dashboard showing the user list, email search, role and status filters, and edit and delete actions.](/img/howto-manage-users/view-users.png)

     The table lists each user's email address, role, and status.

### Create a user

To create a user:

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. Select **INVITE A USER**.

    ![Invite a user form with fields for email address, role, and language, and a Save button.](/img/howto-manage-users/invite-user.png)

1. Enter the user's email.

1. Select the role for the new user.

1. Optionally, select a language for the user.

1. Select **SAVE**.

    The portal emails an invitation to the user.

### Search for users

You can search for TA users in your tenant by email address, role, or status. To search in the TA portal:

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. In the Manage users dashboard, use one or more of these filters:
   - **Search by email**: Enter the user's email address in the **Search by email** box. The search begins as you type, and matching users appear in the table.
   - **Search by role**: Select a role from the menu: **Select All**, **Tenant Admin**, or **User**. Users with the selected role appear in the table.
   - **Search by status**: Select a status from the menu: **Show All**, **Active**, or **Pending**. Users with the selected status appear in the table.

### Update user roles

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. Identify the user to update.

1. Select the **Edit** ![Edit icon](/img/common-graphics/edit-icon.png) icon for the user.

1. In the confirmation dialog, select **YES, EDIT**.

1. Select the updated role from the menu.

1. Select **SAVE**.

1. The user's role is updated, and the user appears in the Active Users pane.

### Delete a user

1. Sign in as a tenant admin.

1. Select **Manage Users**.

1. Identify the user to delete.

1. Select the **Delete** ![Delete icon](/img/common-graphics/delete-icon.png) icon for the user.

1. In the confirmation dialog, select **YES, DELETE USER**.

1. The user is deleted and removed from the Active Users pane.

:::note
A user's policy, tags, and API keys are **not** deleted when the user is deleted.
:::

</TabItem>

<TabItem value="cli" label="CLI">

### View tenant admins and users (CLI)

This command lists the current users in your environment.

```bash
tactl list user
```

#### Sample call

```bash
tactl list user
```

#### Sample response

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

### Create a user (CLI)

Use the following command to create a new user for your environment.

```bash
tactl create user -e <email address> -r <role (Tenant Admin/User)>
```

#### Sample call

```bash
tactl create user -e user@example.com -r User
```

#### Sample response

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

### Update user roles (CLI)

Use the following command to update a specified user's role.

```bash
tactl update user role -u <user ID> -r <role (Tenant Admin/User)>
```

#### Sample call

```bash
tactl update user role -a "<redacted admin API key>" -u "<user ID>" -r "Tenant Admin"
```

#### Sample response

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

### Delete a user (CLI)

This command deletes the specified user from the tenant associated with the logged-in account.

```bash
tactl delete user -u <user ID>
```

#### Sample call

```bash
tactl delete user -a "<redacted admin API key>" -u "<user ID>"
```

#### Sample response

```text
trace-id:  LOnf6FS_oAMEXPw=
User <user ID> deleted
```

  </TabItem>
</Tabs>
