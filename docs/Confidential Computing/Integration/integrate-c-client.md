---
title: TA C connector
description: Reference for the Trust Authority (TA) C client libraries, including the C connector, Intel SGX, Intel TDX, TPM, NVIDIA GPU, and AMD SEV-SNP adapters, token functions, and evidence builder functions used to collect evidence and request and verify attestation tokens.
author: pcartee
topic: integration
date: 05/19/2025
uid: integrate.c.client
sidebar_position: 5
---

The Trust Authority (TA) client provides a set of C libraries for attesting Intel® Software Guard Extensions (Intel® SGX) and Intel® Trust Domain Extensions (Intel® TDX) trusted execution environments (TEEs), and Azure confidential VMs with Intel TDX. You can import the C libraries into your application and make REST calls to TA to get an attestation token that contains information about the TEE attestation and verification.

The TA C client modules, build instructions, and installation instructions are on GitHub at [**intel/ta-client-for-c**](https://github.com/intel/ta-client-for-c).

## Return values

All C connector functions return an integer **TRUST_AUTHORITY_STATUS** value. Multiple status conditions are combined by using bitwise OR. Subcomponents, such as the platform adapters, might include an error base value to identify the component (for example, `STATUS_TDX_ERROR_BASE 0x3000`), which is combined by using OR with the **TRUST_AUTHORITY_STATUS** value.

For a complete list of status conditions, see the `TRUST_AUTHORITY_STATUS` enumeration in [intel/ta-client-for-c/include/types.h](https://github.com/intel/ta-client-for-c/include/types.h).

## C client library structure

The TA client for C contains the following libraries:

- **C connector**: Establishes a connection to TA services and contains general-purpose attestation functions.
- **Intel SGX adapter (C-SGX)**: Works with the low-level Intel SGX DCAP functions to collect evidence and prepare a quote.
- **Intel TDX adapter (C-TDX)**: Is similar in function to the C-SGX adapter, but for Intel TDX trust domains.
- **Token API**: Provides a high-level token collection function and a token verification function.
- **Evidence Builder API**: Builds composite attestation.
- **TPM adapter**: Collects evidence from both virtual and physical TPMs.
- **NVGPU adapter**: Collects evidence from an NVIDIA H100 GPU.
- **SEVSNP adapter**: Collects evidence from AMD SEV-SNP VMs. This adapter is in limited preview status in the pilot environment only.

## C connector API

The C connector module communicates with the TA service by using TA REST APIs. The first step in using the C connector is to create a connector instance.

### `trust_authority_connector_new`

Connects to TA. All APIs that communicate with TA require a pointer to the connector instance. Delete the connector instance by using **connector_free**.

```c
TRUST_AUTHORITY_STATUS trust_authority_connector_new(
    trust_authority_connector **connector,
    const char *api_key,
    const char *api_url,
    const int retry_max,
    const int retry_wait_time
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***connector*** | Output | Receives a pointer to a C connector instance. |
| ***api_key*** | Input | An attestation API key for TA. |
| ***api_url*** | Input | The TA API URL: `https://api.ta.intel.com`. If you're in the European Union region, use `https://api.eu.ta.intel.com`. |
| ***retry_max*** | Input | The maximum number of retries allowed. If this value is nonzero, it's copied to `*connector->retry_config` and used for subsequent API calls. |
| ***retry_wait_sec*** | Input | The time in seconds to wait between retry attempts. If this value is nonzero, it's copied to `*connector->retry_config` and used for subsequent API calls. |

**Example**

```c
#ifndef __CONNECTOR_H__
#define __CONNECTOR_H__
#include "types.h"
#include <openssl/x509.h>
#ifdef __cplusplus
extern "C"
{
#endif
    /**
     * Connector to TA
     */
    typedef struct trust_authority_connector
    {
        char api_key[API_KEY_MAX_LEN + 1]; /* Character array containing API KEY use to authenticate to Intel trust Authority */
        char api_url[API_URL_MAX_LEN + 1]; /* Character array containing the TA base URL for your region.  */
        retry_config *retries; /* struct defining retry values */
    } trust_authority_connector;


trust_authority_connector *connector = NULL;

status = trust_authority_connector_new(&connector, ta_key, ta_api_url, retry_max, retry_wait_sec);
#ifdef __cplusplus
}
#endif

```

### `get_nonce`

Gets a signed nonce from TA.

```c
TRUST_AUTHORITY_STATUS get_nonce(
    trust_authority_connector *connector,
    nonce *nonce,
    get_nonce_args *nonce_args,
    response_headers *resp_header
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***trust_authority_connector*** | Input | A pointer to a connector instance. |
| ***nonce*** | Output | A signed nonce returned by TA. |
| ***nonce_args->request_id*** | Input | An optional ID to identify the request. |
| ***resp_header*** | Output | A char pointer to the response headers returned from TA. |

### `get_token`

Gets an attestation token from TA.

```c
TRUST_AUTHORITY_STATUS get_token(
    trust_authority_connector *connector,
    response_headers *resp_headers,
    token *token,
    get_token_args *args,
    char *attestation_endpoint
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***connector*** | Input | A pointer to a connector. |
| ***resp_header*** | Output | A char pointer to the response headers returned from TA. |
| ***token*** | Output | The attestation token returned from TA. |
| ***args->policies*** | Input | A pointer to an array containing zero to a maximum of ten IDs of policies to apply during attestation. |
| ***args->evidence*** | Input | A pointer to the evidence quote generated by the TEE adapter. |
| ***args->nonce*** | Input | A nonce value returned by TA. |
| ***args->request_id*** | Input | An optional ID to identify the request. |
| ***args->token_signing_alg*** | Input | An optional parameter that specifies the attestation token signing algorithm. If supplied, `token_signing_alg` can be `{"PS384" \| "RS256"}`. If no value is supplied, the default is PS384. |
| ***args->policy_must_match*** | Input | `{true \| false}` If **true**, TA issues an attestation token only if all policies are matched. The default (the value is **false** or isn't supplied) is to issue a token even if one or more policies are unmatched. |
| ***attestation_endpoint*** | Input | The API endpoint that's appropriate for the attesting TEE. TA supports several types of TEEs, each of which has a specific API endpoint. For example, an Intel SGX TEE specifies `/appraisal/v1/attest`, but an Azure confidential VM with Intel TDX TEE specifies `/appraisal/v1/attest/azure/tdxvm`. |

### `get_token_signing_certificate`

Retrieves a JSON Web Key Set (JWKS) that contains the collection of signing certificates TA uses to sign attestation tokens.

```c
TRUST_AUTHORITY_STATUS get_token_signing_certificate(
    const char *tokensigncerturl,
    char **jwks,
    const int retry_max,
    const int retry_wait_time
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***tokensigncerturl*** | Input | The TA base URL: `https://portal.ta.intel.com/certs`. In the EU, use `https://portal.eu.ta.intel.com/certs`. |
| ***jwks*** | Output | A pointer to the [JWKS](../glossary.md#json-web-key-jwk) returned from TA. |
| ***retry_max*** | Input | The maximum number of connection retry attempts. |
| ***retry_wait_time*** | Input | The time in seconds to wait between connection retry attempts. |

### `connector_free`

Frees a **trust_authority_connector** by setting structure values to NULL.

```c
TRUST_AUTHORITY_STATUS connector_free(
    trust_authority_connector *connector
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***connector*** | Input | A pointer to the **trust_authority_connector** to reset. |

### `token_free`

Frees a **token** by setting structure values to NULL.

```c
TRUST_AUTHORITY_STATUS token_free(
    token *token
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***token*** | Input | A pointer to a **token** to reset. |

### `evidence_free`

Frees an **evidence** structure by setting values to NULL.

```c
TRUST_AUTHORITY_STATUS evidence_free(
    evidence *evidence
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***evidence*** | Input | A pointer to an **evidence** structure to reset. |

### `nonce_free`

Frees a **nonce** structure by setting values to NULL.

```c
TRUST_AUTHORITY_STATUS nonce_free(
    nonce *nonce
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***nonce*** | Input | A pointer to a **nonce** structure to reset. |

## C Intel SGX API

The TA C language SGX adapter collects evidence from an Intel SGX-enabled platform and prepares a quote for attestation. This library requires Intel® Software Guard Extensions Data Center Attestation Primitives (Intel® SGX DCAP) on the attesting platform.

All Intel SGX adapter functions return an integer value that indicates status. The status value is the bitwise OR of **STATUS_SGX_ERROR_BASE** (0x2000) and **TRUST_AUTHORITY_STATUS**. For an enumeration of possible status values, see **types.h**.

### `sgx_adapter_new`

Creates a new C connector SGX adapter instance.

```c
int sgx_adapter_new(
    evidence_adapter **adapter,
    int eid,
    void *report_function
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***adapter*** | Output | A pointer to a new Intel SGX adapter. |
| ***eid*** | Input | An int containing the enclave ID. |
| ***report_function*** | Input | A void pointer to the report function. |

The following code fragment creates a new C SGX adapter and then uses the adapter to collect a quote from the SGX TEE.

```c
#include <sgx-adapter.h>

evidence_adapter *adapter = NULL;

status = sgx_adapter_new(&adapter, eid, enclave_create_report);
if (STATUS_OK != status)
{
    printf("Failed to create SGX Adapter: 0x%04x\n", status);
    return status;
}
}

status = sgx_collect_evidence(adapter->ctx, &evidence, &nonce, user_data, user_data_len);
if (STATUS_OK != status)
{
    printf("Failed to collect evidence: 0x%04x\n", status);
    return status;
}
```

### `sgx_collect_evidence`

Collects platform evidence from an Intel SGX enclave by using Intel® SGX DCAP.

```c
int sgx_collect_evidence(
    void *ctx,
    evidence *evidence,
    nonce *nonce,
    uint8_t *user_data,
    uint32_t user_data_len
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***ctx*** | Input | A void pointer to a context. |
| ***evidence*** | Output | A pointer to the evidence structure that receives the quote. |
| ***nonce*** | Input | An optional pointer to a TA nonce. This value can be NULL. |
| ***user_data*** | Input | A pointer to user data to include in the quote and attestation token. |
| ***user_data_len*** | Input | The length of `user_data` in bytes. |

### `sgx_adapter_free`

Deletes a C-SGX adapter by setting the **evidence_adapter** members to NULL.

```c
int sgx_adapter_free(
    evidence_adapter *adapter
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***adapter*** | Input | A pointer to the **evidence_adapter** to delete or reset. |

## C Intel TDX API

The Intel TDX adapter is available in two variations: one for TDs running on the standard Intel TDX [TCB](../glossary.md#tcb), and one for TDs running on Azure confidential VMs with Intel TDX. Both adapters are installed when you install the TA C client.

Both Intel TDX adapters support the same set of APIs. The APIs for Azure VMs include `_azure` in the name. Arguments and usage are identical for both adapters, but the adapters aren't interchangeable. The platform software and the details of collecting evidence differ between the Intel TDX TCB and the Azure VM TCB. The Intel TDX adapter uses the configfs-tsm Linux subsystem to collect evidence for a quote. Azure confidential VMs with Intel TDX use a proprietary method to collect evidence for the trust domain.

An API endpoint is available to support Azure TDX attestation: `<api_url>/appraisal/v1/attest/azure/tdxvm`. This API accepts a `user_data` parameter in the request:

```json
{
"quote":"<tdx-quote>",
"runtime_data": "<paravisor runtime data>",
"policy_ids":[<policy_ids>],
"verifier_nonce": [<verifier nonce>],
"user_data": "<user-provided data>"
}
```

For more information about the differences between the Intel TDX adapter and the Azure adapter for Intel TDX, see [TA go-tdx variants](../Integration/integrate-go-client.md#ta-go-tdx-variants).

All Intel TDX adapter functions return an integer value that indicates status. The status value is the bitwise OR of **STATUS_TDX_ERROR_BASE** (0x3000) and **TRUST_AUTHORITY_STATUS**. For an enumeration of possible status values, see **types.h**.

### `tdx_adapter_new`

Creates a new Intel TDX adapter for TDs running on the standard Intel TDX TCB.

```c
int tdx_adapter_new(
    evidence_adapter **adapter
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***adapter*** | Output | A pointer to the new evidence adapter. |

### `azure_tdx_adapter_new`

Creates a new Intel TDX adapter for TDs running on Azure confidential VMs with Intel TDX. The **azure_tdx_adapter_new** function works like the **tdx_adapter_new** function, except that the code is modified to work with the Azure platform software. The arguments for both functions are identical.

### `tdx_collect_evidence`

Collects evidence for a quote from an Intel TDX TD.

```c
int tdx_collect_evidence(
    void *ctx,
    evidence *evidence,
    nonce *nonce,
    uint8_t *user_data,
    uint32_t user_data_len
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***ctx*** | Input | A void pointer containing context. |
| ***evidence*** | Output | A pointer to an evidence structure to receive the quote collected from the TD. |
| ***nonce*** | Input | An optional nonce. |
| ***user_data*** | Input | A pointer to optional user data. |
| ***user_data_len*** | Input | The length of the user data. |

### `tdx_collect_evidence_azure`

Collects evidence for a quote from a TD running on an Azure confidential VM with Intel TDX. The arguments for this function are identical to **tdx_collect_evidence**.

### `tdx_adapter_free`

Frees the TDX adapter by setting **evidence_adapter** structure members to NULL.

```c
int tdx_adapter_free(
    evidence_adapter *adapter
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***adapter*** | Input | A pointer to a TDX adapter instance. |

### Intel TDX example

The following code fragment creates a new Intel TDX adapter for an Azure VM, and then uses the adapter to collect evidence for a quote. The code for a standard Intel TDX TD is the same, except for the function names.

```c
#include <tdx_adapter.h>

status = azure_tdx_adapter_new(&adapter);
if (STATUS_OK != result)
{
    printf("Failed to create an Intel TDX adapter for Azure VM: 0x%04x\n", status);
    return status;
}

status = tdx_collect_evidence_azure(adapter->ctx, &evidence, &nonce, user_data, user_data_len);
if (status != STATUS_OK)
{
    printf("Failed to collect TDX evidence: 0x%04x\n", status);
    return status;
}
```

## Token API

This section describes the functions exported in **token_provider.h** and **token_verifier.h**.

### `collect_token`

Gets an attestation token from TA. This function calls the evidence adapter to collect evidence, and then sends the quote to TA to get a token.

```c
TRUST_AUTHORITY_STATUS collect_token(
    trust_authority_connector *connector,
    response_headers *resp_headers,
    token *token,
    collect_token_args *token_args
    evidence_adapter *adapter,
    uint8_t *user_data,
    uint32_t user_data_len
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***connector*** | Input | A pointer to an instance of the C connector. |
| ***resp_headers*** | Output | A pointer to the response headers returned by the REST API call to TA. |
| ***token*** | Output | A pointer to the attestation token returned from TA. |
| ***token_args->policies*** | Input | An array containing zero to ten IDs of policies to apply during attestation. |
| ***token_args->request_id*** | Input | An optional request ID to associate with the **collect_token** call for tracking purposes. |
| ***token_args->token_signing_alg*** | Input | An optional parameter that specifies the attestation token signing algorithm. If supplied, `token_signing_alg` can be `{"PS384" \| "RS256"}`. If no value is supplied, the default is PS384. |
| ***args->policy_must_match*** | Input | `{true \| false}`. If **true**, TA issues an attestation token only if all policies are matched. The default (the value is **false** or isn't supplied) is to issue a token even if one or more policies are unmatched. |
| ***adapter*** | Input | A pointer to the TEE adapter to use for this request. |
| ***user_data*** | Input | User data to include in the attestation token. |
| ***user_data_len*** | Input | The length of `user_data` in bytes. |

### `verify_token`

Parses and validates the elements of a token, gets the token signing certificate (JWK) from TA, and initiates verification of the token against the token signing certificate.

```c
TRUST_AUTHORITY_STATUS verify_token(
    token *token,
    char *trust_authority_base_url,
    char *trust_authority_jwks_data,
    jwt_t **parsed_token,
    int retry_max,
    int retry_wait_time
);
```

**Parameters**

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***trust_authority_base_url*** | Input | In the US, use `https://portal.ta.intel.com`. In the EU, use `https://portal.eu.ta.intel.com`. |
| ***trust_authority_jwks_data*** | Input | A pointer to the JWKS returned from `<base_url>/certs`. |
| ***parsed_token*** | Input | A pointer to a TA attestation token. |
| ***retry_max*** | Input | The maximum number of times to attempt to verify the token. |
| ***retry_wait_time*** | Input | The time in seconds to wait between retry attempts. |

## C-TPM adapter API

### `tpm_adapter_free()`

Frees a pointer to an adapter.

```c
int tpm_adapter_free(
    evidence_adapter *adapter
)
```

### `tpm_adapter_new()`

Creates a new adapter to get TPM evidence from the platform.

```c
int tpm_adapter_new(evidence_adapter **adapter)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **adapter** | The evidence adapter instance to initialize. |

**Returns**

An int containing the status.

### `tpm_get_evidence()`

Collects TPM evidence from the platform.

```c
int tpm_get_evidence(
    void *ctx,
    json_t *evidence,
    nonce *nonce,
    uint8_t *user_data,
    uint32_t user_data_len
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **ctx** | A void pointer containing context. |
| **evidence** | TPM evidence in the format of `json_object`. |
| **nonce** | A pointer to a nonce. |
| **user_data** | A pointer to user data to include with the evidence. |
| **user_data_len** | The length of the user data. |

**Returns**

An int containing **TRUST_AUTHORITY_STATUS**.

### `tpm_get_evidence_identifier()`

Generates the identifier for TPM evidence.

```c
const char *tpm_get_evidence_identifier()
```

**Parameters**

None.

**Returns**

An evidence identifier.

### `tpm_with_ak_handle()`

Sets the AK handle that the TPM adapter uses when collecting quotes.

```c
int tpm_with_ak_handle(
    evidence_adapter *adapter,
    uint32_t ak_handle
)
```

**Returns**

0 on success, otherwise failure.

### `tpm_with_device_type()`

Sets the TPM device type that the TPM adapter uses.

```c
int tpm_with_device_type(
    evidence_adapter *adapter,
    tpm_device_type device_type
)
```

**Returns**

Zero (0) on success, otherwise failure.

### `tpm_with_ima_log()`

If this flag is set to true, IMA logs are included in the TPM evidence.

```c
int tpm_with_ima_log(
    evidence_adapter *adapter,
    bool flag
)
```

**Returns**

0 on success, otherwise failure.

### `tpm_with_owner_auth()`

Sets the owner authorization password that the TPM adapter uses.

```c
int tpm_with_owner_auth(
    evidence_adapter *adapter,
    char *owner_auth
)
```

**Returns**

0 on success, otherwise failure.

### `tpm_with_pcr_selections()`

Sets the PCR selection that the TPM adapter uses when collecting quotes.

```c
int tpm_with_pcr_selections(
    evidence_adapter *adapter,
    TPML_PCR_SELECTION *pcr_selection
)
```

**Returns**

0 on success, otherwise failure.

### `tpm_with_uefi_log()`

Determines whether UEFI event logs are included in the TPM evidence.

```c
int tpm_with_uefi_log(
    evidence_adapter *adapter,
    bool flag
)
```

**Returns**

0 on success, otherwise failure.

## C-NVGPU adapter API

### `nvgpu_adapter_free()`

```c
int nvgpu_adapter_free(evidence_adapter *adapter)
```

### `nvgpu_adapter_new()`

Creates a new adapter to get evidence and the corresponding certificate chain from the provisioned NVIDIA H100 GPU.

```c
int nvgpu_adapter_new(evidence_adapter **adapter)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **adapter** | A pointer reference to the evidence adapter. |

**Returns**

An int containing the status.

### `nvgpu_get_evidence()`

Collects NVGPU evidence from an NVIDIA GPU and generates a JSON object-based request body for TA attestation.

```c
int nvgpu_get_evidence(
    void *ctx,
    json_t *evidence,
    nonce *nonce,
    uint8_t *user_data,
    uint32_t user_data_len
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **ctx** | The pointer to the context. |
| **evidence** | The pointer reference to the generated JSON object-based evidence. |
| **nonce** | The pointer to the nonce. |
| **user_data** | Must be NULL because NVGPU attestation doesn't support it. |
| **user_data_len** | Must be 0 because NVGPU attestation doesn't support it. |

**Returns**

A `size_t` value.

### `nvgpu_get_evidence_identifier()`

Generates the identifier for the NVGPU evidence.

```c
const char* nvgpu_get_evidence_identifier()
```

**Returns**

The resulting identifier.

## C-SEVSNP adapter API

:::note
AMD SEV-SNP attestation is currently in limited preview status in the pilot environment only. Details of implementation might change before release. For access to the preview, contact your Intel representative.
:::

As of the v1.10 release, Azure confidential VMs with AMD SEV-SNP and vTPM attestation are supported in the pilot environment. For more information, see the [Azure TPM Token](https://github.com/intel/ta-client-for-c/tree/main/examples/azure_tpm_token) example application.

### `azure_sevsnp_adapter_new()`

Creates a new adapter to get a report from the Azure SEVSNP platform.

```c
int azure_sevsnp_adapter_new(evidence_adapter **adapter)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **adapter** | The evidence adapter instance to initialize. |

**Returns**

An int containing the status.

### `sevsnp_adapter_free()`

```c
int sevsnp_adapter_free(evidence_adapter *adapter)
```

### `sevsnp_adapter_new()`

Creates a new SEVSNP adapter instance.

```c
int sevsnp_adapter_new(evidence_adapter **adapter)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **adapter** | The evidence adapter instance to initialize. |

**Returns**

An int containing the status.

### `sevsnp_collect_evidence()`

Collects an SEVSNP evidence report from an on-premises or GCP VM.

```c
int sevsnp_collect_evidence(
    void *ctx,
    evidence *evidence,
    nonce *nonce,
    uint8_t *user_data,
    uint32_t user_data_len
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **ctx** | A void pointer containing context. |
| **evidence** | The evidence report. |
| **nonce** | A nonce. |
| **user_data** | User data. |
| **user_data_len** | The length of the user data. |

**Returns**

An int containing the status.

### `sevsnp_collect_evidence_azure()`

Collects the SEVSNP report from the Azure platform.

```c
int sevsnp_collect_evidence_azure(
    void *ctx,
    evidence *evidence,
    nonce *nonce,
    uint8_t *user_data,
    uint32_t user_data_len
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **ctx** | A void pointer containing context. |
| **evidence** | The evidence report. |
| **nonce** | A nonce. |
| **user_data** | User data. |
| **user_data_len** | The length of the user data. |

**Returns**

An int containing the status.

### `sevsnp_get_evidence()`

Collects the SEVSNP report from an on-premises or GCP platform.

```c
int sevsnp_get_evidence(
    void *ctx,
    json_t *evidence,
    nonce *nonce,
    uint8_t *user_data,
    uint32_t user_data_len
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **ctx** | A void pointer containing context. |
| **evidence** | The evidence report contained in a JSON object literal. |
| **nonce** | A nonce. |
| **user_data** | User data. |
| **user_data_len** | The length of the user data. |

**Returns**

An int containing the status.

### `sevsnp_get_evidence_azure()`

Collects the SEVSNP report from an Azure confidential VM with AMD SEV-SNP.

```c
int sevsnp_get_evidence_azure(
    void *ctx,
    json_t *evidence,
    nonce *nonce,
    uint8_t *user_data,
    uint32_t user_data_len
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **ctx** | A void pointer containing context. |
| **evidence** | The evidence report contained in a JSON object literal. |
| **nonce** | A nonce. |
| **user_data** | User data. |
| **user_data_len** | The length of the user data. |

**Returns**

An int containing the status.

### `sevsnp_get_evidence_identifier()`

```c
const char *sevsnp_get_evidence_identifier()
```

### `with_vmpl()`

Collects the SEVSNP report from the Azure platform.

```c
int with_vmpl(
    sevsnp_adapter_context *ctx,
    unsigned int vmpl_level
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **ctx** | A void pointer containing context. |
| **vmpl_level** | The VM privilege level to set when retrieving the SEVSNP evidence (on-premises or GCP only). |

**Returns**

An int containing the status.

## Evidence Builder API

### `evidence_builder_add_adapter()`

Adds an evidence adapter to the evidence builder for composite attestation.

```c
TRUST_AUTHORITY_STATUS evidence_builder_add_adapter(
    evidence_builder *builder,
    evidence_adapter *adapter
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **builder** | The evidence builder instance to add the evidence adapter to. |
| **adapter** | The evidence adapter to add to the builder. |

**Returns**

A **TRUST_AUTHORITY_STATUS** value.

### `evidence_builder_free()`

```c
TRUST_AUTHORITY_STATUS evidence_builder_free(evidence_builder *builder)
```

### `evidence_builder_get_evidence()`

Builds composite evidence by using evidence adapters.

```c
TRUST_AUTHORITY_STATUS evidence_builder_get_evidence(
    evidence_builder *builder,
    json_t *evidence
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **builder** | The evidence builder instance with evidence adapters added. |
| **evidence** | The composite evidence generated by the builder. |

**Returns**

A **TRUST_AUTHORITY_STATUS** value.

### `evidence_builder_new()`

Creates a new evidence builder to build composite evidence for TA.

```c
TRUST_AUTHORITY_STATUS evidence_builder_new(
    evidence_builder **builder,
    builder_opts *opts
)
```

**Parameters**

| Name | Description |
| :--- | :--- |
| **opts** | The builder options for building composite evidence. |

**Returns**

A **TRUST_AUTHORITY_STATUS** value.
