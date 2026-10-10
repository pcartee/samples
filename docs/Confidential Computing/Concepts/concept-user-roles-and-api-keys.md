---
title: User roles and API keys
description: TA CLI policy management commands.
author: pcartee
topic-type: conceptual
date: 05/29/2024
uid: user-roles-and-api-keys
---

User roles and API keys are provisioned through the TA web portal. The user role determines the type of API keys you can access. This article explains the relationship between user roles and API keys.

## User roles

TA has two types of user roles, **users** and **tenant admins**. Your subscription determines the number of each user type.

### Users

Your subscription determines the number of users allowed in your instance of TA. A Starter plan allows five users, while an Enterprise plan allows unlimited users. Users can modify all TA resources except other users and admin API keys. The keys can be integrated into the application workflow when an attestation is requested.

### Tenant admins

Tenant admins interact with TA through the TA portal, the CLI, and REST APIs. Your service plan determines the number of tenant admins. A Starter plan allows one tenant admin, while an Enterprise plan allows up to five tenant admins. Tenant admins can manage all TA resources, including other users and admin API keys. Tenant admins use the admin API keys to interact with TA using the CLI and REST APIs.

:::important
Intel recommends enabling more than one tenant administrator account for redundancy purposes.
:::

The following table lists the resources for each user role.

|Resource             |User|Tenant Admin|
|---------------------|:--:|:----------:|
|Attestation API Keys |  X |     X      |
|Policies             |  X |     X      |
|Tags                 |  X |     X      |
|Users                |    |     X      |
|Admin API keys       |    |     X      |
|Reports              |  X |     X      |
|Web UI               |  X |     X      |

## API keys

Two types of API keys are provided to clients to manage resources: Attestation API keys and Admin API keys. User roles determine which API keys can be accessed through the portal. Users can only access attestation API keys, while tenant admins can access both attestation and admin API keys. API keys have a tenant-wide scope. Attestation API keys and report data are visible to all users.

### Tenant Admin API keys

Each tenant is issued two Admin API keys accessible through the UI. Admin API keys are required by the TA CLI and REST APIs, and they allow you to access all the same functions managed in the portal. (An exception is retrieving the value of an Attestation or Admin API key, which can only be done through the portal.) An Admin API key can't be used for attestation-related APIs, such as getting a nonce or an attestation token. 

:::warning
Intel recommends rotating the Admin API keys whenever a Tenant Admin user is removed, or "downgraded" to User. The Admin API keys previously accessible to the former Tenant Admin remain active and usable unless rotated.
:::

<a id="attest-api-keys"></a>

### Attestation API keys

Both tenant admins and users have access to attestation API keys through the portal. The number of attestation API keys for an instance of TA is determined by the subscription type. A Starter subscription is given one API key, while an Enterprise subscription is given multiple API keys. Attestation API keys are used for all attestation-related functions such as, the Microsoft Azure Attestation adaptor and Faithful Verification. This key cannot be used for other tasks, such as managing policies, tags, or other users.

The following table lists the resources each API can manage.

|Resource                         |Admin API|Attestation API|
|---------------------------------|:-------:|:-------------:|
|Attestation                      |         |       X       |
|Nonce                            |         |       X       |
|Policies                         |    X    |               |
|Tags                             |    X    |               |
|Users                            |    X    |               |
|Admin API keys                   |    X    |               |
|Reports - Faithful Verifications |         |       X       |

## Rotating admin and attestation API keys

Admin and attestation API keys control every aspect of TA, from verifying workloads to creating users. Intel® recommends that a regular rotation schedule be implemented to help keep your system secure. When an administrator is eliminated from the system, the API keys to which they had access are not eliminated. Keeping a rotational schedule helps prevent unwanted access to API keys.
