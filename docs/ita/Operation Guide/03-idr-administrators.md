---
title: Identity Router Administrators
description: Manage Studio administrator accounts, including creating administrator users, assigning groups and customers, configuring passwords, and setting advanced Studio API access and customer associations.
author: pcartee
topic: administration
date: 09/17/2024
uid: idr-administrators
---

The *Administrators* page lists all users with administrative access in your Studio system.

| Role                  | Description                                                                                                                                                             |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Administrators        | Can add, edit, and delete existing user stores, application groups, applications, and application areas.                                                                |
| Super Administrators  | Performs the same tasks as an administrator. Super administrators can also add, edit, and delete other administrators and super administrators, and manage SimpleLinks. |
| System Administrator  | Performs the same tasks as a Super Administrator. System administrators can create, edit, and delete all other administrator types.                                     |
| Support Administrator | Performs administrative tasks for resale customers.                                                                                                                     |

## **Create an Account Administrator**

:::note
Only super administrators and system administrators can perform this task.
:::

### **Configuration Tab**

1. From the *Administrators* page, select **New Admin User**.

    The *New Administrator* dialog opens.

    ![New Administrator dialog with account configuration fields](/img/operations-guide/_page_16_Picture_2.jpeg)

1. Complete the following fields:

    - **User ID (Email Address)** - Enter the email address used to sign in to Studio.
    - **Administrator Name** - Enter a name to display in Studio. The name can be up to 50 characters long.
    - **Phone Number** - Optionally enter a phone number for the administrator.
    - **Time Zone** - Select a time zone from the drop-down list.
    - **Group** - Select an administrator group from the drop-down list.
    - **Customer** - This field is only available to Support Administrators. Select the customer for the Support Administrator.
    - **Disabled** - Select this checkbox to deactivate the administrator account. This administrator can't sign in to Studio when the account is deactivated.
    - **Require Password Change on Next Login** - Optionally select this checkbox to require the new administrator to change their password on first sign-in.
    - **New Password** - Enter a password. The password can be up to 50 characters long.
    - **Confirm Password** - Re-enter the password.

1. Select **Save**.

### **Advanced Tab**

The Advanced tab lets you associate an administrator with the customer they manage.

![Advanced tab showing Studio API and customer association settings](/img/operations-guide/_page_17_Picture_2.jpeg)

1. Optionally select the Enable Studio API checkbox to activate the Account Identifier and Shared Secret fields.
