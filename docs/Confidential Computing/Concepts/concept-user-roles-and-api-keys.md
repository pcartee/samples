---
title: User roles and API keys
description: Learn how TA user roles determine access to Attestation and Admin API keys, and which TA resources each role and key type can manage.
author: pcartee
topic-type: conceptual
date: 05/29/2024
uid: user-roles-and-api-keys
---

You manage user roles and API keys through the TA web portal. A user's role determines which types of API keys they can access. This article explains the relationship between user roles and API keys.

## User roles

TA has two user roles: **user** and **tenant admin**. Your subscription determines how many users and tenant admins your instance can have.

### Users

Your subscription determines how many users your TA instance can have. A Starter plan allows five users, while an Enterprise plan allows unlimited users. Users can modify all TA resources except other users and Admin API keys. You can integrate Attestation API keys into an application workflow to request attestation.

### Tenant admins

Tenant admins interact with TA through the portal, CLI, and REST APIs. Your service plan determines how many tenant admins your instance can have. A Starter plan allows one tenant admin, while an Enterprise plan allows up to five. Tenant admins can manage all TA resources, including other users and Admin API keys. They use Admin API keys to interact with TA through the CLI and REST APIs.

:::important
Intel recommends enabling more than one tenant administrator account for redundancy purposes.
:::

The following table lists the resources for each user role.

| Resource             | User | Tenant admin |
| ---                  | :---:| :---:        |
| Attestation API keys | X    | X            |
| Policies             | X    | X            |
| Tags                 | X    | X            |
| Users                |      | X            |
| Admin API keys       |      | X            |
| Reports              | X    | X            |
| Web UI               | X    | X            |

## API keys

TA provides two types of API keys for managing and accessing resources: Attestation API keys and Admin API keys. User roles determine which API keys are available through the portal. Users can access only Attestation API keys, while tenant admins can access both types. API keys have a tenant-wide scope. All users can view Attestation API keys and report data.

### Tenant Admin API keys

Each tenant receives two Admin API keys, which are available through the portal. The TA CLI and REST APIs require Admin API keys, which provide access to the same functions as the portal. You can retrieve the value of an Attestation or Admin API key only through the portal. An Admin API key can't be used with attestation-related APIs, such as those for getting a nonce or attestation token.

:::warning
Intel recommends rotating the Admin API keys whenever you remove a tenant admin or change their role to user. The Admin API keys that the former tenant admin could access remain active unless you rotate them.
:::

<a id="attest-api-keys"></a>

### Attestation API keys

Both tenant admins and users can access Attestation API keys through the portal. The subscription type determines how many Attestation API keys a TA instance has. A Starter subscription includes one API key, while an Enterprise subscription includes multiple API keys. Attestation API keys are used for attestation-related functions, such as the Microsoft Azure Attestation adapter and Faithful Verification. You can't use these keys for other tasks, such as managing policies, tags, or users.

The following table lists the resources each API can manage.

| Resource                         | Admin API | Attestation API |
| ---                              | :---:     | :---:           |
| Attestation                      |           | X               |
| Nonce                            |           | X               |
| Policies                         | X         |                 |
| Tags                             | X         |                 |
| Users                            | X         |                 |
| Admin API keys                   | X         |                 |
| Reports - Faithful Verifications |           | X               |

## Rotating admin and attestation API keys

Admin and Attestation API keys provide access to TA functions, from verifying workloads to managing users. Intel® recommends rotating API keys regularly to help keep your system secure. When you remove an administrator, their API keys remain active. Regular rotation helps prevent unwanted access to API keys.
