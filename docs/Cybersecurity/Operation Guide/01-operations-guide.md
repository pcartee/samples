---
title: Identity Routers Overview
description: Explains how Identity Routers authenticate users, enforce access policies, and provide single sign-on for protected applications, with links to guidance on router operations, Studio administration, federation, certificates, and deployment.
author: pcartee
topic: administration
date: 09/17/2024
uid: idr-operations-guide-intro
---

An Identity Router is the access-control point between users and an organization's web applications. It receives user requests, authenticates users through configured identity services, and applies access policies before allowing connections to protected applications; it can also provide single sign-on so users can reach authorized applications without repeatedly entering credentials. Managed through Studio, Identity Routers can be configured as network appliances or deployed in Amazon EC2, and support capabilities such as Integrated Windows Authentication, federation with Active Directory Federation Services, and secure connections using SSL/TLS certificates. This guide explains how to configure, operate, and maintain the routers and their supporting Studio settings.

- [Identity Routers](02-idenity-routers.md) explains how to register and configure routers, check their status and connectivity, manage firewall and DNS settings, and update appliance credentials and certificates.
- [Identity Router Administrators](03-idr-administrators.md) covers creating administrator accounts, assigning groups and customers, and configuring account settings and API access.
- [Create/Edit Customers](04-customers.md) describes customer setup, session and cipher settings, portal configuration, Windows authentication, clustering, and related customer features.
- [My Application Types](05-application-types.md) explains how to configure HTTP Basic and Digest application types, discover login forms, and create custom authentication forms.
- [Identity Router Handlers](06-handlers.md) describes how to view handlers and control which customers can use them, including adapters used for directory and user-store synchronization.
- [Identity Routers Certificates](07-certificates.md) explains certificate options and how to configure CA-signed certificate chains, wildcard certificates, SAN certificates, and self-signed certificates for router domains.
- [Amazon EC2 Identity Router Deployment](08-amazon-ec2.md) walks through preparing an AWS environment, creating and uploading an Identity Router AMI, and provisioning router instances.
- [Active Directory Federation Services](09-ad-federation-services.md) covers integrating ADFS with an Identity Router, including prerequisites, certificate setup, SAML relying-party trust, claim rules, and public-key export.
- [Edit Profile Information](10-edit%20-profile.md) describes profile and company settings, portals, Windows authentication, clustering, backup and restore, audit logging, and authentication sources.