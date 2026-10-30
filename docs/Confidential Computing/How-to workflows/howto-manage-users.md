---
title: User management
description: Learn how tenant admins in Trust Authority (TA) view, invite, search, update, and delete users with the TA portal or the tactl CLI, including user roles (Tenant Admin and User) and related commands.
author: pcartee
topic: how to
date: 12/09/2024
uid: manage.users
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Trust Authority (TA) divides user permissions into _tenant admins_ and _users_. Tenant admins can perform all regular user functions and manage other users through the **Manage users** dashboard. Your tenant must have at least one active tenant admin. TA automatically assigns this role to the first TA subscriber from a tenant organization. Only tenant admins can invite, edit, and delete users.

:::important
Enable more than one tenant admin account for redundancy.
:::

You can manage users in the TA portal, with the [CLI](../Command-line/cli-user-commands.md), or by using the REST API. Select the tab for your preferred method.

<Tabs>
  <TabItem value="portal" label="TA portal" default>

## Portal

### View tenant admins and users

To view the list of users:

1. Sign in as a tenant admin.

1. Select **Manage users**.

   ![The Manage Users page listing each user's email address, role, status, and actions, with an Invite a user button and search by email, role, and status controls.](/img/howto-manage-users/view-users.png)

   The table lists each user, their role, and their status.

### Create a user

To create a user:

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. Select **INVITE A USER**.

   ![The Invite a user page with fields for email address, role, and language, and Go back and Save buttons.](/img/howto-manage-users/invite-user.png)

1. Enter the user's email address.

1. Select the role for the new user.

1. (Optional) Select a language for the user.

1. Select **SAVE**.

   TA emails the invitation to the user.

### Search for users

You can search for TA users within your tenant by filtering by email, role, or status. To search for users in the TA portal:

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. In the **Manage users** dashboard, filter users by using any of the following options:

   - **Search by email**: In the **Search by email** box, enter the user's email address. This is an incremental search that starts when you enter the first character. The table displays users whose email addresses match.
   - **Search by role**: From the menu, select a role option (**Show All**, **Tenant Admin**, or **User**). The table displays users with the selected role.
   - **Search by status**: From the menu, select a status option (**Show All**, **Active**, or **Pending**). The table displays users with the selected status.

### Update user roles

To update a user's role:

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. Identify the user to update.

1. Select the **Edit** icon ![Pencil icon that represents Edit.](/img/common-graphics/edit-icon.png).

1. In the pop-up window, select **YES, EDIT**.

1. From the menu, select the new role.

1. Select **SAVE**.

   TA updates the user and displays the updated information in the **Active Users** pane.

### Delete a user

To delete a user:

1. Sign in as a tenant admin.

1. Select **Manage users**.

1. Identify the user to delete.

1. Select the **Delete** icon ![Trash can icon that represents Delete.](/img/common-graphics/delete-icon.png).

1. In the pop-up window, select **YES, DELETE USER**.

   TA deletes the user and removes them from the **Active Users** pane.

:::note
Deleting a user does **not** delete the user's policies, tags, or API keys.
:::

</TabItem>

<TabItem value="cli" label="CLI">

## CLI

### View tenant admins and users

This command lists the current users in your environment:

`tactl list user`

#### Sample call

```bash
tactl list user
```

#### Sample response

```bash
trace-id:  LOnetHW6IAMEEQQ=
Users: [ { "id": "e3968eb8-e053-4646-98dd-7b61991a66d1", "email": user1@company.com, "tenant_roles": [ { "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1", "roles": [ { "id": "66ec2e33-8cd3-42b1-8963-c7765205446e", "name": "Tenant Admin" } ] } ], "active": true, "created_at": "2022-09-29T16:42:46.236499Z" }, { "id": "f9af3e31-9fc5-48db-afc3-c818049f6570", "email": user1@company.com, "tenant_roles": [ { "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1", "roles": [ { "id": "66ec2e33-8cd3-42b1-8963-c7765205446e", "name": "Tenant Admin" } ] } ], "active": false, "created_at": "2022-10-01T01:00:53.924856Z" }, { "id": "82ac5d98-c8ba-49cf-ac3e-4d4a1385be68", "email": user1@company.com, "tenant_roles": [ { "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1", "roles": [ { "id": "885391bf-2a37-4dc7-9444-833c5a817cdf", "name": "User" } ] } ], "active": false, "created_at": "2022-10-01T01:27:44.145412Z" }, { "id": "42850600-7a58-43a1-970a-85bb4008cd88", "email": user1@company.com, "tenant_roles": [ { "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1", "roles": [ { "id": "66ec2e33-8cd3-42b1-8963-c7765205446e", "name": "Tenant Admin" } ] } ], "active": false, "created_at": "2022-10-11T20:30:40.348744Z" }, { "id": "1c83eeb3-e9f7-4a59-8104-7009f6f385b0", "email": user1@company.com, "tenant_roles": [ { "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1", "roles": [ { "id": "66ec2e33-8cd3-42b1-8963-c7765205446e", "name": "Tenant Admin" } ] } ], "active": false, "created_at": "2022-10-11T21:16:45.358066Z" }, { "id": "598db1fc-4340-4bbc-9e19-2d596c3b7bd8", "email": user1@company.com, "tenant_roles": [ { "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1", "roles": [ { "id": "885391bf-2a37-4dc7-9444-833c5a817cdf", "name": "User" } ] } ], "active": false, "created_at": "2022-10-12T03:18:17.545383Z" }, { "id": "dd4b49c7-9207-43e4-a3c1-8c734cf828a4", "email": user1@company.com, "tenant_roles": [ { "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1", "roles": [ { "id": "66ec2e33-8cd3-42b1-8963-c7765205446e", "name": "Tenant Admin" } ] } ], "active": false, "created_at": "2022-10-12T03:18:19.458591Z" } ]
```

### Create a user

Use the following command to create a user in your environment:

`tactl create user -e < email Id> -r < Role (Tenant Admin/User) >`

#### Sample call

```bash
tactl create user -e user@example.com -r User
```

#### Sample response

```bash
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

### Update user roles

Use the following command to update the role of a specified user:

`tactl update user role -u < user id > -r < Role (Tenant Admin/User) >`

#### Sample call

```bash
tactl update user role -a 7110194b-a703-4657-9d7f-3e02b62f2ed8 -u "4324598fs-0404-4f4r-9oii9-8f8flk893w21" -r "Tenant Admin"
```

#### Sample response

```bash
trace-id:  LOnetHW6IAMEEQQ=
Updated User: { "id": "598db1fc-4340-4bbc-9e19-2d596c3b7bd8", "email": user1@company.com, "tenant_roles": [ { "tenant_id": "020f1162-25ed-441c-9d8f-69cfc7974cc1", "roles": [ { "id": "66ec2e33-8cd3-42b1-8963-c7765205446e", "name": "Tenant Admin" } ] } ], "active": false, "created_at": "2022-10-12T03:18:17.545383Z" }
```

### Delete a user

This command deletes the specified user from the tenant you're signed in to:

`tactl delete user -u < user id >`

#### Sample call

```bash
tactl delete user -u "4324598fs-0404-4f4r-9oii9-8f8flk893w21"
```

#### Sample response

```bash
trace-id:  LOnf6FS_oAMEXPw=
user 4324598fs-0404-4f4r-9oii9-8f8flk893w21 deleted
```

  </TabItem>
</Tabs>
