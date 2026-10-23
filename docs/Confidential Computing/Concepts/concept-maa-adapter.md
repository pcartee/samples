---
title: TA MAA adapter service
description: Learn how the TA MAA adapter service supports Azure Attestation-compatible requests, how its workflow works, and how to migrate policies and workloads to TA.
author: pcartee
date: 06/12/2024
uid: maa.adapter.service
---

## Overview

The TA MAA (Microsoft Azure Attestation) adapter service lets you use TA attestation instead of Azure Attestation. The MAA adapter service offers the same set of APIs as Azure Attestation to accommodate Azure Attestation requests.

The TA MAA adapter replicates the API endpoints, parameters, and request and response schemas of the Azure Attestation service. The MAA client or workload submits the same attestation request to TA instead of Azure Attestation. The MAA workload or relying party then retrieves and uses TA signing certificates to verify the token instead of Azure Attestation certificates. The rest of the MAA client or workload logic remains unchanged. You can migrate existing Azure Attestation workloads with only minor changes, as described in [MAA workload migration](#maa-workload-migration).

The following table briefly compares TA and Azure Attestation.

| Comparison | TA | Azure Attestation |
| --- | --- | --- |
| Instance URL | Unified instance URL | Regional shared provider and tenant custom provider |
| API endpoints | Unified API endpoint for all TEE attestation types | Separate endpoint for each attestation type |
| Request, response, and token schemas | TA-specific | Azure Attestation-specific |
| Policies | Tenants can define multiple policies. Uses the OPA policy engine and Rego policy language. | One policy per attestation type; uses Azure policy grammar |
| Verifier logic | Quote verification, policies, and nonce and `user_data` verification | Quote verification, policy, and runtime data verification |
| Authentication | API key | Azure identity |
| Client SDK | Go | C#, Java, Python, and others |
| Token signing algorithm (`alg`) | PS386 | RS256 |

## MAA adapter workflow

1. The Azure client sends the evidence and the TA API key as a query parameter in the URL.
1. TA generates an interservice JWT based on the API key. The JWT contains information such as the TA tenant ID and subscription ID.
1. The MAA adapter service transforms the Azure Attestation request into a TA appraisal request.
1. TA performs the usual attestation steps to verify the quote and policies.
1. The MAA adapter service converts the TA token into an Azure Attestation token and response.
1. The MAA adapter service sends the response to the Azure client.

## MAA workload migration

This section describes how to migrate an existing Azure Attestation workload to use TA attestation.

### Token signing algorithm

TA uses PS386 as its native signing algorithm. However, attestation requests through the MAA adapter return tokens signed with RS256 to maintain compatibility with existing Azure Attestation applications. The token header's **alg** claim identifies the signing algorithm.

### Policy migration

You must manually migrate the Azure Attestation policy to TA. This section describes how to map the Azure policy to equivalent TA policies.

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

```text
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

##### TA appraisal policy

```rego
default matches_sgx_policy = false
matches_sgx_policy = true {
    input.sgx_is_debuggable == false
    input.sgx_isvsvn >= 1
}
```

##### TA token customization policy

```rego
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

The TA MAA adapter is designed to require few or no code changes. In many cases, you only need to change the configuration. The attestation URI changes, and you might also need to change the token validation option.

#### Attestation URI

TA provides the Azure Attestation APIs under the base URI `api.ta.intel.com/azure-attestation`. Configure the Azure workload to use the TA attestation URI.

:::note
If you're in the European Union (EU), use this TA URI: `api.eu.ta.intel.com/azure-attestation`.
:::
