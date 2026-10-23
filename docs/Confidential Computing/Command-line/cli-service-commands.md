---
title: TA CLI service management
description: Reference for listing TA service offers, services, plans, and products with the TA CLI.
author: pcartee
topic-type: Reference
date: 08/16/2023
uid: cli-service-commands
sidebar_position: 3
---

Use these commands to view service offers, subscribed services, plans, and products.

:::note
Have your API key available before running these commands. For instructions, see [Retrieve your API key](../Quickstart/tutorial-api-key.md).
:::

## List service offers

This command lists the service offers available in your TA environment.

`tactl list serviceOffer`

### Sample call

```bash
tactl list serviceOffer
```

### Sample response

```text
trace-id:  LOm53EuHoAMEIhA=
Service offers: 

 [
  {
    "id": "d47f9540-5bd6-47ff-b984-5fcf0d74c6e2",
    "name": "TEE Attestation"
  }
]
```

## List services

This command lists all services subscribed to by the tenant associated with the API key.

`tactl list service`

### Sample response

```text
trace-id:  LOm7kE9WoAMEG_w=
 [
  {
    "id": "1dceedae-0f71-4bb7-a076-52b29f751fbd",
    "tenant_id": "92b8f7a8-3a3b-4530-a562-91edca330fac",
    "service_offer_id": "8fe770d6-aec0-4eca-bc9d-893ae198fab7",
    "name": "TEE_Attestation",
    "plan_id": "b5fae544-5894-4305-8754-5e18d7b4cb25",
    "plan_name": "Enterprise",
    "active": true,
    "created_at": "2023-03-27T04:39:23.888083Z"
  }
]
```

## Get a service by ID

This command retrieves details for the specified service ID associated with the tenant for the API key.

`tactl list service -r < service Id >`

### Sample call

```bash
tactl list service -r 1dceedae-0f71-4bb7-a076-52b229f751fbd
```

### Sample response

```text
trace-id:  LOm7qHi1oAMEtkg=
Services:
{
  "id": "1dceedae-0f71-4bb7-a076-52b29f751fbd",
  "service_offer_id": "8fe770d6-aec0-4eca-bc9d-893ae198fab7",
  "service_offer_name": "TEE Attestation",
  "name": "TEE_Attestation",
  "created_at": "2023-03-27T04:39:23.888083Z",
  "active": true,
  "plan_id": "b5fae544-5894-4305-8754-5e18d7b4cb25",
  "plan_name": "Enterprise"
}
```

## List plans

This command lists the plans available for the specified service offer in your TA environment.

`tactl list plan -r < service offer id >`

### Sample call

```bash
tactl list plan -r 8fe770d6-aec0-4eca-bc9d-893ae1998fab7
```

### Sample response

```text
trace-id:  LOm5_EPjoAMEN4Q=
Plans: 

 [
  {
    "id": "e8b6cf50-e2d2-4b2e-ad1b-93994002b980",
    "service_offer_id": "d47f9540-5bd6-47ff-b984-5fcf0d74c6e2",
    "name": "Starter",
    "max_key": 1,
    "max_tenant_admin": 2,
    "max_tenant_user": 100,
    "max_policy": 1,
    "ledger": true
  },
  {
    "id": "e66ae43b-3150-44a2-b54f-5d31e7f72361",
    "service_offer_id": "d47f9540-5bd6-47ff-b984-5fcf0d74c6e2",
    "name": "Enterprise",
    "max_key": 10,
    "max_tenant_admin": 5,
    "max_tenant_user": 100,
    "max_policy": 10,
    "ledger": true
  }
]
```

## Get a plan by ID

This command retrieves details for the specified plan and service offer.

`tactl list plan -r < service offer id > -p < plan id >`

### Sample call

```bash
tactl list plan -r 8fe770d6-aec0-4eca-bc9d-893ae1998fab7 -p b5fae544-5894-4305-8754-5e18d7b4cb25
```

### Sample response

```text
trace-id:  LOm6XED-oAMEoFQ=
Plans: 

 {
  "id": "e8b6cf50-e2d2-4b2e-ad1b-93994002b980",
  "service_offer_id": "d47f9540-5bd6-47ff-b984-5fcf0d74c6e2",
  "name": "Starter",
  "max_key": 1,
  "max_tenant_admin": 2,
  "max_tenant_user": 100,
  "max_policy": 1,
  "ledger": true,
  "products": [
    {
      "id": "0ce6c2b6-c81f-48d6-a14b-ddca2e607ead",
      "service_offer_id": "d47f9540-5bd6-47ff-b984-5fcf0d74c6e2",
      "name": "Starter",
      "policy": {
        "limit": 60,
        "quota": 1000,
        "limit_renewal_period": 60,
        "quota_renewal_period": 604801
      },
      "plan_id": "e8b6cf50-e2d2-4b2e-ad1b-93994002b980",
      "product_type": "attestation"
    },
    {
      "id": "db44d79a-12e7-46ff-9bae-88db114ded75",
      "service_offer_id": "d47f9540-5bd6-47ff-b984-5fcf0d74c6e2",
      "name": "Management",
      "policy": {
        "limit": 60,
        "quota": 200000,
        "limit_renewal_period": 60,
        "quota_renewal_period": 604801
      },
      "plan_id": "e8b6cf50-e2d2-4b2e-ad1b-93994002b980",
      "product_type": "management"
    }
  ]
}
```

## List products

This command lists the products available for the specified service offer in your TA environment.

`tactl list product -r < service offer id >`

### Sample call

```bash
tactl list product -r ea6ad8d3-fd3f-4ccb-82c7-ac021899a199
```

### Sample response

```text
trace-id:  LOm7LHeVIAMEttg=
Products: 

 [
  {
    "id": "0ce6c2b6-c81f-48d6-a14b-ddca2e607ead",
    "service_offer_id": "d47f9540-5bd6-47ff-b984-5fcf0d74c6e2",
    "name": "Starter",
    "policy": {
      "limit": 60,
      "quota": 1000,
      "limit_renewal_period": 60,
      "quota_renewal_period": 604801
    },
    "plan_id": "e8b6cf50-e2d2-4b2e-ad1b-93994002b980",
    "product_type": "attestation"
  },
  {
    "id": "095e2a13-b913-4d66-9c4d-f6e8a40f5915",
    "service_offer_id": "d47f9540-5bd6-47ff-b984-5fcf0d74c6e2",
    "name": "Enterprise",
    "policy": {
      "limit": 60,
      "quota": 5000000,
      "limit_renewal_period": 60,
      "quota_renewal_period": 604801
    },
    "plan_id": "e66ae43b-3150-44a2-b54f-5d31e7f72361",
    "product_type": "attestation"
  }
]
```
