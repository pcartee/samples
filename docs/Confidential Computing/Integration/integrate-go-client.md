---
title: TA Go connector
description: Reference for the Trust Authority (TA) Go client. Describes the go-connector, go-sgx, go-tdx, go-nvgpu, and go-amd APIs, with function signatures, parameters, return values, and Go examples for collecting evidence, requesting and verifying attestation tokens, and configuring regional endpoints.
author: pcartee
topic: integration
date: 05/16/2025
uid: integrate.go.client
sidebar_position: 2
---

The TA client and related trusted execution environment (TEE) adapters encapsulate all the functions needed to collect evidence, package it as a quote, and obtain an attestation token from the TA service. Both attesters and relying parties can use the client modules.

The TA Go client modules, build instructions, and installation instructions are on GitHub at [intel/ta-client-for-go][ta-go-client]. The **main** branch contains the latest release. The TA Go client code is [open source][ta-client-license]. The client code is a good source of examples that show how to use the following API functions.

:::note
We are transitioning from manually created API documentation (this article) to Go package documentation generated from comments in the codebase. For more information, see the [TA Client for Go][ta-pkg-go] package documentation on pkg.go.dev. The package documentation is more complete than this article. We will remove the API documentation from this article in a future release.
:::

## Go client API index

### go-connector APIs

[**Attest**](#attest)  
Collects evidence and requests an attestation token from TA for clients that use a Passport validation model.

[**GetNonce**](#getnonce)  
Retrieves a signed nonce and parses it to JSON.

[**GetToken**](#gettoken)  
Requests an attestation token from TA. **GetToken** provides more control than **Attest** by allowing a confidential app to include user data, provide a nonce, and modify evidence structures before requesting a token. **GetToken** supports both Passport and Background-check attestation models.

[**GetTokenSigningCertificates**](#gettokensigningcertificates)  
Retrieves a JSON Web Key Set (JWKS) that contains the collection of signing certificates that TA uses to sign attestation tokens.

[**VerifyToken**](#verifytoken)  
Verifies that a TA attestation token is properly formatted and signed.

### go-sgx APIs

[**CollectEvidence**](#collectevidence-intel-sgx)  
Collects evidence from an Intel® SGX enclave and formats it as a quote for attestation.

[**NewEvidenceAdapter**](#newevidenceadapter-intel-sgx)  
Instantiates a new Intel SGX Go adapter.

### go-tdx APIs

[**NewEventLogParser**](#neweventlogparser)  
Reads and parses the ACPI event log that contains TD startup events.

[**NewEvidenceAdapter**](#newevidenceadapter-intel-tdx)  
Instantiates a new Intel® TDX evidence collection adapter.

[**CollectEvidence**](#collectevidence-intel-tdx)  
Collects evidence from an Intel TDX TD and formats it as a quote for attestation.

[**Decrypt**](#decrypt)  
Decrypts an encrypted binary object.

[**GenerateKeyPair**](#generatekeypair)  
Creates an RSA key pair. The default key length is 3072 bits.

[**GetEventLogs**](#geteventlogs)  
Gets the TD event logs that contain the events used to create the RTMR(0-3) hash data.

### go-nvgpu APIs

[**NewCompositeEvidenceAdapter**](#newcompositeevidenceadapter)  
Creates a new composite evidence adapter for Intel TDX and GPU evidence.

[**GetEvidence**](#getevidence)  
Gets evidence from the GPU.

[**GetEvidenceIdentifier**](#getevidenceidentifier)  
Gets the evidence identifier, currently set to "nvgpu".

[**GPUAttester**](#gpuattester)  
Gets evidence from a remote GPU attester.

[**GPUEvidence**](#gpuevidence)  
Returns the GPU evidence collected from the attester.

### go-amd APIs

:::note
AMD SEV-SNP attestation is in limited preview status. Details of implementation and usage might change before general availability. Preview features are only available in the TA Pilot environment. Contact your Intel representative for access.
:::

[**CollectEvidence**](#collectevidence-amd)  
Retrieves the SEV-SNP report.

## Go client library structure

**go-connector** creates a secure connection to TA and invokes the attestation-related REST APIs. Confidential computing clients and relying parties can use **go-connector**. The only prerequisites are Go and the correct URLs, API key, and TLS configuration.

**go-sgx** is required to collect evidence (a quote) from an Intel SGX enclave. **go-sgx** requires Intel SGX DCAP and an Intel SGX-enabled platform.

**go-tdx** is required to collect evidence from an Intel TDX trust domain. There are currently two variants of **go-tdx**, with more in development:

- Intel TDX platform adapter: For on-premises and cloud platforms that use the Intel TDX stack and PSW. This version of go-tdx is in the **main** branch of the client repo.
- Azure confidential VMs for Intel TDX adapter: For TDs that run on Azure confidential VMs with the Intel TDX platform only. This adapter is a fork of the Intel TDX adapter, customized to work with Azure's implementation of Intel TDX. This adapter requires the TPM2 TSS library, but doesn't require Intel SGX DCAP. This version of go-tdx is in the **azure-tdx-preview** branch of the client repo.

**go-amd** is required to collect the measurement data from AMD SEV-SNP hardware platforms during the remote attestation process and to integrate with the existing attestation workflow.

## Basic attestation API workflow

The following steps describe the basic attestation workflow. Many variations are possible. With the exception of **Attest**, which requires a TEE adapter, both the attester and the relying party (RP) can use all the APIs.

1. **New**: Create a new connector for TA SaaS.
1. **NewEvidenceAdapter**: An attesting TEE creates a new evidence adapter. (RPs skip this step.)
1. Intel TDX clients must call **NewEventLogParser** to get the ACPI tables before creating a new adapter.
1. **Attest**: The simplest use case for attesters that use the Passport attestation model. Gets a nonce, collects evidence, and requests an attestation token. If successful, it returns an attestation token.
1. **GetNonce**: Gets a nonce to include with the quote in the request for attestation.
1. (EvidenceAdapter) **CollectEvidence**: Collects evidence for a quote. The attester can add TEE or application user data to the evidence collected from the TEE.
1. **GetToken**: After it's given a nonce, evidence collected from the TEE, and optional user data, requests an attestation token (JWT) from TA.
1. **VerifyToken**: After it's given an attestation token, checks that the token is properly formatted and signed by TA.
1. **GetTokenSigningCertificates**: Retrieves a JWKS that contains the signing certificates used to sign nonces and JWTs.

TEE attesters and RPs use the other APIs as needed.

## `go-connector` API

To use the connector, you must first set values for the connector configuration and retry configuration, and then create a new connector instance, as shown in the following code fragment.

There are two TA deployment regions: the European Union (EU) region and a global region for all other countries. Each region has a different BaseUrl and ApiUrl, as follows:

| Region | BaseUrl | ApiUrl |
| :--- | :--- | :--- |
| **EU** | `https://portal.eu.ta.intel.com` | `https://api.eu.ta.intel.com` |
| **World/US** | `https://portal.ta.intel.com` | `api.ta.intel.com` |

```go
import "github.com/intel/ta-client-for-go/go-connector"

cfg := connector.Config{
        // The TA base URL.
        BaseUrl: "https://portal.ta.intel.com",
        // The TA API URL.
        ApiUrl: "https://api.ta.intel.com",
        // Provide TLS config.
        TlsCfg: &tls.Config{},
        // Replace TRUSTAUTHORITY_API_KEY with a real API key.
        ApiKey: "TRUSTAUTHORITY_API_KEY",
        // Provide Retry config
        RClient: &RetryConfig{},
}

retryCfg := connector.RetryConfig{
        // Minimum time to wait; default is 2s.
        RetryWaitMin:
        // Maximum time to wait; default is 10s.
        RetryWaitMax:
        // Maximum number of retries; default is 2.
        RetryMax:
        // CheckRetry specifies the policy for handling retries, and is called
        // after each request. Default retries when HTTP status code is one among 500, 503, and 504
        // and when there is a client timeout or if a service is unavailable.
        CheckRetry:
        // Backoff specifies the policy for how long to wait between retries, default is DefaultBackoff, which 
        // provides a default callback for Backoff which will perform exponential backoff based on the attempt
        // number and limited by the provided minimum and maximum durations.
        BackOff:
}

connector, err := connector.New(&cfg)
```

### `Attest`

**Attest** provides a relatively simple method to obtain an attestation token for the client.

```go
func (connector *trustAuthorityConnector) Attest(args AttestArgs) (AttestResponse, error)
```

#### Parameters

| Name | Datatype | Description |
| :--- | :--- | :--- |
| ***Args*** | AttestArgs | A type structure that holds the request parameters needed for attestation. |
| ***AttestArgs.Adapter*** | EvidenceAdapter | |
| ***AttestArgs.PolicyIds*** | []uuid.UUID | An optional array of up to 10 policy IDs to apply during attestation. |
| ***AttestArgs.RequestId*** | string | An optional [RequestID](../glossary.md#request-id). |
| ***AttestArgs.TokenSigningAlg*** | string | An optional value that specifies the token signing algorithm. Allowed values are `{ "PS384" \| "RS256" }`. The default is PS384. |
| ***AttestArgs.PolicyMustMatch*** | bool | An optional value that overrides the default token issuance behavior. If set to true, all supplied policies must match for a token to be issued. If set to false or omitted, an attestation token is issued unless an error occurs. For more information, see Policy results. |

#### Returns

| Name | Datatype | Description |
| :--- | :--- | :--- |
| ***AttestResponse*** | type | A type structure that contains the JWT and HTTP response headers. |
| ***AttestResponse.Token*** | string | A base64-encoded attestation token (JWT). |
| ***AttestResponse.Headers*** | http.Header | The HTTP response headers returned from TA. |

#### Usage

**Attest** is designed for a Passport attestation model where the attester wants to get a token and doesn't need to append user data to evidence. The attester only needs to create a new TA client connection and evidence adapter before calling **Attest**. If you need to include user data with the evidence, see [**GetToken**](#gettoken).

If you don't provide policy IDs, TA uses the policies (if any) associated with the API key. If you do provide a list of policy IDs, the supplied policies replace the associated policies, which aren't evaluated at all.

If you don't provide a request ID, the API gateway generates a random ID that isn't guaranteed to be unique.

The TokenSigningAlg option lets you choose a signing algorithm (RS256) that is less computationally intensive than PS384, or that is compatible with other systems.

**Attest** performs the following actions:

- Gets a nonce from TA.
- Collects evidence by using the TEE adapter.
- Forwards the evidence and policy IDs to TA.
- Returns an attestation token and HTTP response headers.

#### Example

```go
req := connector.AttestArgs{
    Adapter:   adapter,
    PolicyIds: policyIds,
    RequestId: reqId,
}
resp, err := connector.Attest(req)
if err != nil {
    return err
}
```

### `GetNonce`

**GetNonce** retrieves a signed nonce from TA.

```go
func (connector *trustAuthorityConnector) GetNonce(args GetNonceArgs) (GetNonceResponse, error)
```

#### Parameters

| Name | Datatype | Description |
| :--- | :--- | :--- |
| ***args*** | GetNonceArgs | A **GetNonceArgs** structure that contains an optional RequestID to associate with the request for a nonce. |

#### Returns

A **GetNonceResponse** structure that contains the nonce (val, iat, and signature) and HTTP response headers.

#### Example

```go
req := connector.GetNonceArgs{
    RequestId: reqId,
}
resp, err := connector.GetNonce(req)
if err != nil {
    fmt.Printf("Something bad happened: %s\n\n", err)
    return err
}
```

### `GetToken`

**GetToken** requests a new TA attestation token.

```go
func (connector *trustAuthorityConnector) GetToken(args GetTokenArgs) (GetTokenResponse, error)
```

#### Parameters

| Name | Datatype | Description |
| :--- | :--- | :--- |
| ***GetTokenArgs.Nonce*** | *VerifierNonce | |
| ***GetTokenArgs.Evidence*** | *Evidence | An evidence structure returned from a TEE adapter. Evidence contains the quote for attestation. |
| ***GetTokenArgs.PolicyIds*** | []uuid.UUID | An optional array of up to 10 policy IDs to apply during attestation. |
| ***GetTokenArgs.RequestId*** | string | An optional [RequestID](../glossary.md#request-id). |
| ***GetTokenArgs.TokenSigningAlg*** | string | An optional value that specifies the token signing algorithm. Allowed values are `{ "PS384" \| "RS256" }`. The default is PS384. |
| ***GetTokenArgs.PolicyMustMatch*** | bool | An optional value that overrides the default token issuance behavior. If set to true, all supplied policies must match for a token to be issued. If set to false or omitted, an attestation token is issued unless an error occurs. For more information, see Policy results. |

#### Returns

| Name | Datatype | Description |
| :--- | :--- | :--- |
| ***GetTokenResponse*** | type | A type structure that contains the JWT and HTTP response headers. |
| ***GetTokenResponse.Token*** | string | A base64-encoded attestation token (JWT). |
| ***GetTokenResponse.Headers*** | http.Header | The HTTP response headers returned from TA. |

#### Usage

**GetToken** is for complex scenarios where [**Attest**](#attest) doesn't provide enough flexibility. **GetToken** provides more control than **Attest** by allowing a confidential app to include user_data, provide a nonce, or modify evidence structures before requesting a token. **GetToken** supports both Passport and Background-check validation models.

#### Example

```go
req := connector.GetTokenArgs{
    Nonce:     nonce,
    Evidence:  evidence,
    PolicyIds: policyIds,
    RequestId: reqId,
    TokenSigningAlg: alg,
    PolicyMustMatch: matchFlag,
}
resp, err := connector.GetToken(req)
if err != nil {
    fmt.Printf("Something bad happened: %s\n\n", err)
    return err
}
```

### `GetTokenSigningCertificates`

**GetTokenSigningCertificates** retrieves a JSON Web Key Set (JWKS) that contains the collection of signing certificates (in JWT format) that TA uses to sign attestation tokens and nonces.

```go
func (connector *trustAuthorityConnector) GetTokenSigningCertificates() ([]byte, error)
```

#### Parameters

**GetTokenSigningCertificates** doesn't take any input.

#### Returns

A [JWKS](../glossary.md#json-web-key-jwk). Use the **kid** claim to find the JWK used to sign the token.

#### Example

```go
jwks, err := connector.GetTokenSigningCertificates()
if err != nil {
    fmt.Printf("An error occurred: %s\n\n", err)
    return err
}
```

### `VerifyToken`

**VerifyToken** verifies the attestation token to ensure that a genuine TA attestation service generated the token.

```go
func (connector *trustAuthorityConnector) VerifyToken(token string) (*jwt.Token, error)
```

#### Parameters

| Name | Datatype | Description |
| :--- | :--- | :--- |
| ***token*** | string | A complete attestation token in base64-encoded string format. |

#### Returns

A parsed `*jwt.Token` if verification succeeds; otherwise, an error.

#### Example

```go
parsedToken, err := connector.VerifyToken(string(token))
if err != nil {
    fmt.Printf("An error occurred: %s\n\n", err)
    return err
}
```

## `go-sgx` adapter API reference

Before you integrate an Intel SGX workload with the TA client, the workload must implement a function to generate an enclave report. This function should take the SHA256 hash of the nonce and user data to form report data for the **sgx_create_report** API. The TA Attestation Service performs a report data verification in which it expects the report data to be a SHA256 hash of the nonce and user_data.

```go
import "github.com/intel/ta-client-for-go/go-sgx"
```

The following code fragment creates a new Go SGX adapter and uses it to collect a quote from the SGX TEE.

```go
import "github.com/intel/ta-client-for-go/go-sgx"

adapter, err := sgx.NewEvidenceAdapter(enclaveId, enclaveHeldData, unsafe.Pointer(C.enclave_create_report))
if err != nil {
    return err
}

evidence, err := adapter.CollectEvidence(nonce)
if err != nil {
    return err
}
```

### `NewEvidenceAdapter` (Intel SGX)

**NewEvidenceAdapter** returns a new Intel SGX TEE adapter instance.

```go
func NewEvidenceAdapter(eid uint64, udata []byte, reportFunction unsafe.Pointer) (connector.EvidenceAdapter, error)
```

#### Parameters

| Name | Datatype | Description |
| :--- | :--- | :--- |
| ***eid*** | uint64 | Enclave ID, a unique identifier for the enclave, set by the developer at compile time. |
| ***udata*** | []byte | Optional user data, sometimes called enclave held data. |
| ***reportFunction*** | unsafe.Pointer | A pointer to the sgx_create_report function. |

#### Returns

An **EvidenceAdapter** structure.

### `CollectEvidence` (Intel SGX)

**CollectEvidence** gets a quote from an Intel SGX enclave by using Intel SGX DCAP.

```go
func (adapter *sgxAdapter) CollectEvidence(nonce []byte) (*connector.Evidence, error)
```

#### Parameters

| Name | Datatype | Description |
| :--- | :--- | :--- |
| ***nonce*** | []byte | A TA nonce in base64-encoded format. |

#### Returns

An **Evidence** structure that contains the quote for attestation.

## `go-tdx` adapter API reference

The TA Intel TDX Attestation client includes a Go client and a CLI for use on the command line or by languages other than Go. You can use them to add Intel TDX remote attestation to your application.

There are currently two variants of the TA go-tdx adapter, as explained in the next section. Some details of an Intel TDX client implementation for cloud service provider (CSP) platforms differ from the standard Intel TDX TCB that runs on a hosted server or an on-premises server. CSP platforms require a customized adapter to map CSP implementations to the requirements of the TA evidence verification service. The TA **go-tdx** adapters differ mainly in how the evidence collected from the TD is combined with user data (if supplied) and hashed for verification. Nearly all of the API functions are identical across adapters. Where behavior differs, the API's Usage section describes the difference.

### TA go-tdx variants

- **go-tdx** for Intel TDX-enabled platforms. The code for this adapter is in [intel/ta-client-for-go/go-tdx](https://github.com/intel/ta-client-for-go/tree/main/go-tdx) on the **main** branch.
- **go-tdx** for [Microsoft Azure confidential VMs with Intel TDX](https://azure.microsoft.com/en-us/updates/confidential-vms-with-intel-tdx-dcesv5-ecesv5-public-preview/). The code for the Azure adapter is in [intel/ta-client-for-go/go-tdx](https://github.com/intel/ta-client-for-go/tree/azure-tdx-preview/go-tdx) on the **azure_tdx_preview** branch.

The go-tdx adapter for Azure confidential VMs with Intel TDX differs from the Intel TDX stack in the following ways:

- The `tdreport.report_data` hash doesn't measure user data. It only measures the Azure TD runtime data provided by the Azure "paravisor" component.
- Azure TD runtime data is always a JSON object literal.
- If the user data is JSON, it's output as JSON in the **attester_user_data** claim. If the user data is binary, it's output as base64-encoded data in the **attester_held_data** claim.
- TA requires a hash of the runtime data to be present in the `TDREPORT.report_data` field. The customized go-tdx adapter for Azure TD handles the logic to retrieve the runtime data from the paravisor. The Azure TD runtime data has a predefined JSON data structure, which includes a 64-byte user-data field. The customized go-tdx adapter for Azure TD uses the `runtime_data.user-data` field to hold the SHA512 hash of the original user-provided data and nonce (if any).
- A new API endpoint is available to support Azure TDX attestation: `api.trusthauthority.com/appraisal/v1/attest/tdxvm`. This API accepts a user_data parameter in the request:

  ```json
  {
    "quote":"<tdx-quote>",
    "runtime_data": "<paravisor runtime data>",
    "policy_ids":[<policy_ids>],
    "verifier_nonce": [<verifier nonce>],
    "user_data": "<user-provided data>"
  }
  ```

- `TDREPORT.report_data` is used to verify the integrity of runtime data. (This behavior is common to both go-tdx adapters.) A SHA256 hash is calculated from the runtime data and then stored in the lower 32 bytes of the `TDREPORT.report_data` field.

### Example

The following code fragment creates a new TDX adapter and then collects evidence for a quote. This sample assumes that you previously obtained a nonce for CollectEvidence.

```go
import "github.com/intel/ta-client/go-tdx"

evLogParser := tdx.NewEventLogParser()
adapter, err := tdx.NewEvidenceAdapter(tdHeldData, evLogParser)
if err != nil {
    return err
}

evidence, err := adapter.CollectEvidence(nonce)
if err != nil {
    return err
}
```

### `NewEventLogParser`

**NewEventLogParser** initializes an instance of EventLogParser, which manages the event log collection from a trust domain by reading either the ACPI (Advanced Configuration and Power Interface) tables or an EFI (Extensible Firmware Interface) file that contains event log data. The event log for a trust domain is stored in ACPI tables.

```go
func NewEventLogParser() EventLogParser
```

#### Parameters

**NewEventLogParser** doesn't take any input.

#### Example

```go
evLogParser := tdx.NewEventLogParser()
eventLog, err := evLogParser.GetEventLogs()
if err != nil {
    return err
}
```

### `NewEvidenceAdapter` (Intel TDX)

**NewEvidenceAdapter** initializes an instance of **TdxAdapter**, which manages the quote collection from a trust domain (TD). **TdxAdapter** is also responsible for collecting the event log for a TD.

```go
func NewEvidenceAdapter(udata []byte, evLogParser EventLogParser) (connector.EvidenceAdapter, error)
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***udata*** | Input | Optional user data to include in the evidence. |
| ***evLogParser*** | Input | An event log parser instance that opens and parses the UEFI event log device file. |

#### Example

The following code snippet shows how to create a new Go TDX adapter and then use the adapter to collect a quote from the TDX-enabled platform.

```go
adapter, err := tdx.NewEvidenceAdapter(tdHeldData, nil)
if err != nil {
    return err
}
```

### `CollectEvidence` (Intel TDX)

**CollectEvidence** collects a quote from the Intel TDX trust domain. It takes a nonce as input, which is hashed (along with user data, if supplied) during trust domain report creation. The SHA512 hash of the nonce and user data is stored in `TDREPORT.report_data`, which is output in the attestation token in the **tdx_report_data** claim. TA requires the report_data hash for quote verification, and custom clients must ensure that the hash is present.

```go
func (adapter *tdxAdapter) CollectEvidence(nonce []byte) (*connector.Evidence, error)
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***nonce*** | Input | A TA nonce. |

You can also add user_data to the evidence by including it in the `tdxAdapter.uData` field.

#### Returns

If successful, **CollectEvidence** returns an **Evidence** structure; otherwise, it returns an error.

### `Decrypt`

**Decrypt** takes encrypted data as input and decrypts the data by using the private key that is passed in the **EncryptionMetadata**. On success, the Decrypt API returns a byte array that contains the decrypted data. On failure, it returns an error.

```go
func Decrypt(encryptedData []byte, em *EncryptionMetadata) ([]byte, error)
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***encryptedData*** | Input | An encrypted binary object. |
| ***em*** | Input | An encryption metadata structure that contains three fields: <br />***PrivateKey***: An optional byte array that contains the private key to use for decryption. <br />***PrivateKeyLocation***: An optional parameter that contains the path to the private key file. You must provide either ***PrivateKey*** or ***PrivateKeyLocation***. <br />***HashAlgorithm***: A string value `["SHA256" \| "SHA384" \| "SHA512" \| "SM3_256"]` that identifies the hash algorithm. |

#### Returns

The decrypted object as a byte array.

#### Example

The following snippet shows how to decrypt an encrypted blob.

```go
em := &tdx.EncryptionMetadata{
    PrivateKeyLocation: privateKeyPath,
    HashAlgorithm:      "SHA256",
}
decryptedData, err := tdx.Decrypt(encryptedData, em)
if err != nil {
    fmt.Printf("Something bad happened: %s\n\n", err)
    return err
}
```

### `GenerateKeyPair`

**GenerateKeyPair** creates a private key based on key metadata.

```go
func GenerateKeyPair(km *KeyMetadata) ([]byte, []byte, error)
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***km*** | Input | A ***KeyMetadata*** structure. `KeyMetadata.KeyLength` contains the length, in bits, of the key to generate. |

#### Returns

Two byte arrays. The first value is the private key, and the second value is the public key.

#### Example

```go
km := &tdx.KeyMetadata{
    KeyLength: 3072,
}
privateKeyPem, publicKeyPem, err := tdx.GenerateKeyPair(km)
if err != nil {
    fmt.Printf("Something bad happened: %s\n\n", err)
    return err
}
```

### `GetEventLogs`

The **GetEventLogs** API returns a trust domain event log in the form of JSON. The trust domain event log consists of all the events that are measured to all four RTMRs, in order. You can use the TD event log to verify the integrity of the RTMRs (Real-Time Monitoring and Response) by replaying all the event measurements in order.

```go
func (parser *fileEventLogParser) GetEventLogs() ([]RtmrEventLog, error)
```

#### Parameters

**GetEventLogs** doesn't take any input.

#### Returns

The TD event log as a JSON object literal.

#### Example

The following snippet collects the event log from a TD.

```go
evLogParser := sevsnp.NewEventLogParser()
eventLog, err := evLogParser.GetEventLogs()
if err != nil {
    return err
}
```

## `go-nvgpu` adapter API reference

The **nvgpu** package (gpu_adapter.go) provides the NVIDIA GPU evidence adapter.

```go
import "github.com/intel/ta-client/go-nvgpu"
```

### `NewCompositeEvidenceAdapter`

**NewCompositeEvidenceAdapter** creates a new composite evidence adapter that collects a combined quote for both the GPU and the CVM.

```go
func NewCompositeEvidenceAdapter(opts ...Option) connector.CompositeEvidenceAdapter
```

### `GetEvidence`

**GetEvidence** gets evidence (a quote) from the GPU.

```go
func (adapter *GPUAdapter) GetEvidence(verifierNonce *connector.VerifierNonce, userData []byte) (any, error)
```

### `GetEvidenceIdentifier`

**GetEvidenceIdentifier** is currently set to return "nvgpu".

```go
func (*GPUAdapter) GetEvidenceIdentifier() string
```

### `GPUAttester`

**GPUAttester** gets evidence (a quote) from the remote GPU attester.

```go
type GPUAttester interface {
    GetRemoteEvidence([]byte) ([]gonvtrust.RemoteEvidence, error)
}
```

### `GPUEvidence`

**GPUEvidence** contains the evidence collected from the GPU, the signing certificate, and nonces.

```go
type GPUEvidence struct {
    Evidence      string                   `json:"evidence"`
    Certificate   string                   `json:"certificate"`
    Nonce         string                   `json:"gpu_nonce"`
    VerifierNonce *connector.VerifierNonce `json:"verifier_nonce, omitempty"`
    Arch          string                   `json:"arch"`
}
```

## `go-amd` adapter API reference

:::note
This feature is in limited preview status. Details of implementation and usage might change before general availability. Preview features are only available in the TA Pilot environment. Contact your Intel representative for access.
:::

### `CollectEvidence` (AMD)

**CollectEvidence** retrieves an SEV-SNP report by using an SEV-SNP guest driver in the VM.

:::note
**CollectEvidence** follows different internal logic depending on which Intel AMD SEVSNP platform you use. Some CSPs customize the base Intel AMD SEVSNP stack for their platform, which requires a modified go-amd to match the requirements for TA quote verification. Ensure that you use the correct adapter for your Intel AMD SEVSNP platform.
:::

```go
func (adapter *sevsnpAdapter) CollectEvidence(nonce []byte) (*connector.Evidence, error)
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| ***nonce*** | Input | A TA nonce. |

#### Returns

If successful, **CollectEvidence** returns an **Evidence** structure; otherwise, it returns an error.

[ta-pkg-go]: https://pkg.go.dev/github.com/intel/ta-client
[ta-go-client]: https://github.com/intel/ta-client-for-go
[ta-client-license]: https://github.com/intel/ta-client-for-go/blob/main/LICENSE
