---
title: Identity Router Administrators
description: Manage Studio administrator accounts, including creating administrator users, assigning groups and customers, configuring passwords, and setting advanced Studio API access and customer associations.
author: pcartee
topic: administration
date: 09/17/2024
uid: idr-administrators
---


## **Administrators**

The *Administrators* page displays all of the administrators in your Studio system. There are two types of administrators: administrator and super administrator.

| Role                  | Description                               |
|-----------------------|-------------------------------------------|
| Administrators        | Can add, edit, and delete existing users. |
| Super Administrators  | Can add, edit, and delete existing users. |
| System Administrator  | Can add, edit, and delete existing users. |

## **Create an Account Administrator**

**Note**: You must be logged in as a super administrator or a system administrator to perform this task.

### **Configuration Tab**



1. From the *Administrators* page, click the **New Admin User** ![Administrators page with the New Admin User icon](/img/operations-guide/_page_15_Picture_6.jpeg) icon.

The *New Administrator* dialog displays.

![New Administrator dialog with account configuration fields](/img/operations-guide/_page_16_Picture_2.jpeg)

2. Complete the following fields:

- **User ID (Email Address)** - Enter the email address that will be used to log into Studio 
- **Administrator Name** - Enter the name that will be displayed while in Studio. The name can be up to 50 characters long 
- **Phone Number** - Optionally enter a phone number for the administrator • **Time Zone** - Select a time zone from the drop-down list 
- **Group** - Select the administrator group to which this user will belong from the drop-down list 
- **Customer** - This feature is only available to Support Administrators. Select the Customer to which the Support Administrator belongs.
- **Disabled**  Select this checkbox to disable the administrator account. This administrator will not be able to sign in to Studio when the account is disabled 
- **Require Password Change on Next Login** - Optionally select this checkbox to require the new administrator to change their password upon their first successful sign-in
- **New Password** Enter a password. The password can be up to 50 characters long
- **Confirm Password** Re-enter the password

3. Click **Save**.

The new administrator is created.

### **Advanced Tab**

The Advanced tab provides a means to attach an administrator to the customer they will manage.

![Advanced tab showing Studio API and customer association settings](/img/operations-guide/_page_17_Picture_2.jpeg)

1. Optionally select the Enable Studio API checkbox to activate the Account Identifier and Shared Secret fields.
