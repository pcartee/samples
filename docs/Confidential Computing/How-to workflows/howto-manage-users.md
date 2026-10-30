---
title: User management
<<<<<<< HEAD
description: Learn how tenant admins in Trust Authority (TA) view, invite, search, update, and delete users with the TA portal or the tactl CLI, including user roles (Tenant Admin and User) and related commands.
=======
description: Learn how tenant admins can view, invite, search for, update, and delete TA users through the portal or CLI.
>>>>>>> origin/main
author: pcartee
topic: how to
date: 12/09/2024
uid: manage.users
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<<<<<<< HEAD
Trust Authority (TA) divides user permissions into _tenant admins_ and _users_. Tenant admins can perform all regular user functions and manage other users through the **Manage users** dashboard. Your tenant must have at least one active tenant admin. TA automatically assigns this role to the first TA subscriber from a tenant organization. Only tenant admins can invite, edit, and delete users.
=======
TA has two user roles: _tenant admin_ and _user_. Tenant admins can perform all user functions and manage other users through the Manage Users dashboard. Each tenant must have at least one active tenant admin. TA automatically assigns this role to the first TA subscriber from a tenant organization. Only tenant admins can invite, edit, and delete users.
>>>>>>> origin/main

:::important
Enable more than one tenant admin account for redundancy.
:::

<<<<<<< HEAD
You can manage users in the TA portal, with the [CLI](../Command-line/cli-user-commands.md), or by using the REST API. Select the tab for your preferred method.

<Tabs>
  <TabItem value="portal" label="TA portal" default>
=======
You can manage users through the TA portal, the [CLI](../Command-line/cli-user-commands.md), or the REST API.

<Tabs>
  <TabItem value="TA portal" label="TA portal" default>
>>>>>>> origin/main

## Portal

### View tenant admins and users

<<<<<<< HEAD
To view the list of users:
=======
To view the users in your tenant:
>>>>>>> origin/main

1. Sign in as a tenant admin.

1. Select **Manage users**.

<<<<<<< HEAD
   ![The Manage Users page listing each user's email address, role, status, and actions, with an Invite a user button and search by email, role, and status controls.](/img/howto-manage-users/view-users.png)

   The table lists each user, their role, and their status.
=======
     ![Manage Users dashboard showing the user list, email search, role and status filters, and edit and delete actions.](/img/howto-manage-users/view-users.png)

     The table lists each user's email address, role, and status.
>>>>>>> origin/main

### Create a user

To create a user:

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. Select **INVITE A USER**.

<<<<<<< HEAD
   ![The Invite a user page with fields for email address, role, and language, and Go back and Save buttons.](/img/howto-manage-users/invite-user.png)
=======
    ![Invite a user form with fields for email address, role, and language, and a Save button.](/img/howto-manage-users/invite-user.png)
>>>>>>> origin/main

1. Enter the user's email address.

1. Select the role for the new user.

<<<<<<< HEAD
1. (Optional) Select a language for the user.

1. Select **SAVE**.

   TA emails the invitation to the user.

### Search for users

You can search for TA users within your tenant by filtering by email, role, or status. To search for users in the TA portal:
=======
1. Optionally, select a language for the user.

1. Select **SAVE**.

    The portal emails an invitation to the user.

### Search for users

You can search for TA users in your tenant by email address, role, or status. To search in the TA portal:
>>>>>>> origin/main

1. Sign in as a tenant admin.

1. Select **Manage users**.

<<<<<<< HEAD
1. In the **Manage users** dashboard, filter users by using any of the following options:

   - **Search by email**: In the **Search by email** box, enter the user's email address. This is an incremental search that starts when you enter the first character. The table displays users whose email addresses match.
   - **Search by role**: From the menu, select a role option (**Show All**, **Tenant Admin**, or **User**). The table displays users with the selected role.
   - **Search by status**: From the menu, select a status option (**Show All**, **Active**, or **Pending**). The table displays users with the selected status.
=======
1. In the Manage users dashboard, use one or more of these filters:
   - **Search by email**: Enter the user's email address in the **Search by email** box. The search begins as you type, and matching users appear in the table.
   - **Search by role**: Select a role from the menu: **Select All**, **Tenant Admin**, or **User**. Users with the selected role appear in the table.
   - **Search by status**: Select a status from the menu: **Show All**, **Active**, or **Pending**. Users with the selected status appear in the table.
>>>>>>> origin/main

### Update user roles

To update a user's role:

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. Identify the user to update.

<<<<<<< HEAD
1. Select the **Edit** icon ![Pencil icon that represents Edit.](/img/common-graphics/edit-icon.png).

1. In the pop-up window, select **YES, EDIT**.
=======
1. Select the **Edit** ![Edit icon](/img/common-graphics/edit-icon.png) icon for the user.

1. In the confirmation dialog, select **YES, EDIT**.
>>>>>>> origin/main

1. From the menu, select the new role.

1. Select **SAVE**.

<<<<<<< HEAD
   TA updates the user and displays the updated information in the **Active Users** pane.
=======
1. The user's role is updated, and the user appears in the Active Users pane.
>>>>>>> origin/main

### Delete a user

To delete a user:

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. Identify the user to delete.

<<<<<<< HEAD
1. Select the **Delete** icon ![Trash can icon that represents Delete.](/img/common-graphics/delete-icon.png).

1. In the pop-up window, select **YES, DELETE USER**.

   TA deletes the user and removes them from the **Active Users** pane.
=======
1. Select the **Delete** ![Delete icon](/img/common-graphics/delete-icon.png) icon for the user.

1. In the confirmation dialog, select **YES, DELETE USER**.

1. The user is deleted and removed from the Active Users pane.
>>>>>>> origin/main

:::note
Deleting a user does **not** delete the user's policies, tags, or API keys.
:::

</TabItem>

<TabItem value="cli" label="CLI">

<<<<<<< HEAD
## CLI

### View tenant admins and users
=======
### View tenant admins and users (CLI)
>>>>>>> origin/main

This command lists the current users in your environment:

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

Use the following command to create a user in your environment:

```bash
tactl create user -e <email address> -r <role (Tenant Admin/User)>
```

#### Sample call

```bash
tactl create user -e user@example.com -r User
```
<<<<<<< HEAD

#### Sample response
=======
>>>>>>> origin/main

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

<<<<<<< HEAD
Use the following command to update the role of a specified user:
=======
Use the following command to update a specified user's role.
>>>>>>> origin/main

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

<<<<<<< HEAD
This command deletes the specified user from the tenant you're signed in to:
=======
This command deletes the specified user from the tenant associated with the logged-in account.
>>>>>>> origin/main

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
