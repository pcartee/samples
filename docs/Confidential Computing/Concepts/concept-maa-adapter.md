---
title: TA MAA adapter service
description: Describes the MAA adapter service functionality and how to use it.
author: pcartee
date: 06/12/2024
uid: maa.adapter.service
---

## Overview

The TA MAA (Microsoft Azure Attestation) adapter service allows you to switch to using TA attestation instead of Azure attestation. The MAA adapter service offers the same set of APIs as Azure attestation to fully accommodate Azure attestation requests.

The TA MAA adaptor replicates the same API endpoints, parameters, request and response schema, and behaves just like the Azure Attestation service. The MAA client/workload submits the exact same attestation request to the TA service instead of Azure Attestation. Then the MAA workload or relying party retrieves and uses the TA signing certificates to verify the token instead of Azure Attestation certificates. The rest of the MAA client/workload logic remains unchanged. Existing Azure Attestation workloads can be migrated with only minor changes, as described below in [MAA workload migration](#maa-workload-migration).

The following table is a brief comparison of TA vs. Azure Attestation.

| | TA | Azure Attestation |
|:---|:---|:---|
| URL instance  | Unified instance URL  | Regional shared provider and Tenant custom provider |
| API endpoints | Unified API endpoint for all TEE attestation types. | Separate endpoints for each attestation type. |
| Request/response and token schemas | TA-specific  | Azure Attestation-specific |
| Policies | Tenant can define multiple policies. Uses OPA policy engine and Rego policy language. | One policy per attestation type; uses Azure policy grammar. |
| Verifier logic | Quote verification + policies + nonce & user_data verification. | Quote verification + policy + runtime data verification. |
| Authentication | API key | Azure identity |
| Client SDK | Go | C#, Java, Python, and others.|
| Token signing algorithm (alg) | PS386 | RS256 |

## MAA adapter workflow

1. The Azure client sends the evidence along with the TA API key as a query parameter in the URL.
1. An inter-service JWT based on the API key is generated. The inter-service JWT contains information such as TA tenant ID, subscription ID, etc.
1. The MAA adapter service transforms the Azure Attestation request to a TA appraisal request.
1. The intermediate steps are the typical TA attestation flow for quote and policies verification.
1. The MAA adapter service converts the TA token to an Azure Attestation token and response.
1. The MAA adapter service sends the response back to the Azure client.

## MAA workload migration

This section describes how to migrate an existing Azure Attestation workload to use TA attestation.

### Token signing algorithm 

TA uses PS386 as the native signing algorithm. However, attestation requests through the MAA Adapter return tokens signed with RS256 to maintain compatibility with existing Azure Attestation applications. The signing algorithm is identified in the token header **alg** claim.

### Policy migration

The Azure attestation policy must be manually migrated to TA. This section describes how to map and migrate the Azure policy to the equivalent TA policies.

#### Incoming claims

| MAA incoming claim | TA incoming claim |
| :--- | :--- |
| `x-ms-tee-is-debuggable` | `sgx_is_debuggable` |
| `x-ms-sgx-product-id` | `sgx_isvprodid` |
| `x-ms-sgx-mrsigner` | `sgx_mrsigner` |
| `x-ms-sgx-mrenclave` | `sgx_mrenclave` |
| `x-ms-sgx-svn` | `sgx_isvsvn` |

#### Policy mapping

| MAA policy rule | TA policy type |
| :--- | :--- |
| version | N/A |
| authorizationrules | Appraisal policy |
| issuancerules | Token customization policy |

#### Sample policy mapping

The following policy is an Azure Attestation policy.

```bash
version= 1.0;
authorizationrules{
[ type=="x-ms-tee-is-debuggable", value==false ] && [ type=="x-ms-sgx-svn", value>=1 ] => permit();
};
issuancerules{
c:[type=="x-ms-tee-is-debuggable"] => issue(type="is-debuggable", value=c.value);
c:[type=="x-ms-sgx-mrsigner"] => issue(type="sgx-mrsigner", value=c.value);
c:[type=="x-ms-sgx-mrenclave"] => issue(type="sgx-mrenclave", value=c.value);
c:[type=="x-ms-sgx-product-id"] => issue(type="product-id", value=c.value);
c:[type=="x-ms-sgx-svn"] => issue(type="svn", value=c.value);
};
```

The Azure policy can be mapped to the following TA attestation policies.

**TA appraisal policy**

```bash
default matches_sgx_policy = false
matches_sgx_policy = true {
    input.sgx_is_debuggable == false
    input.sgx_isvsvn >= 1
}
```

**TA token customization policy**

```bash
get_token_fields[token_fields] {
    token_fields := {
        "svn": input.sgx_isvsvn,
        "sgx-mrenclave": input.sgx_mrenclave,
        "sgx-mrsigner": input.sgx_mrsigner,
        "product-id": input.sgx_isvprodid,
        "is-debuggable": input.sgx_is_debuggable,
    }
}
```

### Workload modification

The TA MAA adapter is designed to be very easy to use, with few or no code changes. In many cases, all that is needed is a configuration change. The attestation URI will change, and the token validation option may change.

#### Attestation URI

TA replicates the Azure Attestation APIs under the base URI `api.ta.intel.com/azure-attestation`. The Azure workload must be changed to use the TA attestation URI.

 :::note
If you are in the European Union (EU) region, use the following TA URI: 
`api.eu.ta.intel.com/azure-attestation`
:::
