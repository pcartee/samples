---
title: TA Java client integration
description: Reference for the Trust Authority (TA) Java client, including Java connector, Intel SGX adapter, and Intel TDX adapter APIs, method parameters, and examples for collecting evidence, requesting tokens and nonces, and verifying tokens.
author: pcartee
topic: integration
date: "2024-11-08"
uid: integrate.java.client
sidebar_position: 3
---

The Java connector is one of several language-specific clients available for TA. The client libraries provide an interface to the TA REST API and, for attesters, to the platform software that collects measurements for a quote. Attestation requires a trusted execution environment (TEE) adapter to collect evidence. The Java TEE adapters support Intel® SGX and Intel® TDX. Supported Intel TDX platforms include on-premises Intel TDX hosts, Google Cloud Platform (GCP) confidential VMs with Intel TDX, and Azure confidential VMs with Intel TDX.

The TA Java client modules, build instructions, and installation instructions are on [GitHub](https://github.com/intel/ta-client-for-java).

## Java client API index

### Java-connector APIs

[**TrustAuthorityConnector**](#trustauthorityconnector-api)  
Establishes a connection with TA services.

[**attest**](#attest)  
Provides a relatively simple method to obtain an attestation token for the client.

[**GetNonce**](#getnonce)  
Retrieves a signed nonce from TA.

[**GetToken**](#gettoken)  
Requests an attestation token from the TA server.

[**getTokenSigningCertificates**](#gettokensigningcertificates)  
Retrieves signing certificates that TA uses to sign attestation tokens.

[**verifyToken**](#verifytoken)  
Verifies the signature of an attestation token received from TA.

### Java-SGX adapter

[**SgxAdapter**](#sgxadapter)  
Creates a new Intel SGX adapter.

[**collectEvidence**](#collectevidence-intel-sgx)  
Collects evidence from an Intel SGX enclave.

### Java-TDX adapter

[**TdxAdapter**](#tdxadapter)  
Creates a new Intel TDX adapter.

[**collectEvidence**](#collectevidence-intel-tdx)  
Collects evidence from an Intel TDX trust domain.

## Java-connector API

The Java connector module uses the TA REST APIs to communicate with the TA service. To use the Java connector, first create a connector instance.

### `TrustAuthorityConnector` API

Create a connector instance, and then use its interfaces to access the TA API.

```java

// Initialize config required for connector using trustAuthorityBaseUrl (https://portal.ta.intel.com), trustAuthorityApiUrl (https://api.ta.intel.com), trustAuthorityApiKey, and retryConfig
Config cfg = new Config(trustAuthorityBaseUrl, trustAuthorityApiUrl, trustAuthorityApiKey, retryConfig);

// Initialize TrustAuthorityConnector with the config
TrustAuthorityConnector connector = new TrustAuthorityConnector(cfg);
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| connector | Output | Receives a reference to a Java TrustAuthorityConnector instance. |
| cfg | Input | The configuration object provided by the user. |

#### Cfg parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| trustAuthorityBaseUrl | Input | The TA URL. In the US, use `https://portal.ta.intel.com`. In the EU, use `https://portal.eu.ta.intel.com`. |
| trustAuthorityApiUrl | Input | The TA API URL. In the US, use `https://api.ta.intel.com`. In the EU, use `https://api.eu.ta.intel.com`. |
| trustAuthorityApiKey | Input | An attestation API key for TA. |
| retryConfig | Input | A Java class object that holds the values required for the retry mechanism: retryWaitMin, retryWaitMax, and retryMax. |
| retryWaitMin | Input | The minimum time to wait between retries. The default is 2 seconds. |
| retryWaitMax | Input | The maximum time to wait between retries. The default is 10 seconds. |
| retryMax | Input | The maximum number of retries. |

### `attest`

**attest** provides a simple way to obtain an attestation token for the client.

```java
public class TrustAuthorityConnector {
    public AttestResponse attest(AttestArgs args) throws Exception{}
}
```

The following call initiates remote attestation with TA.

```java
AttestResponse attestResponse = connector.attest(attestArgs);
```

#### attest arguments

| Name | I/O | Description |
| :--- | :--- | :--- |
| AttestArgs | Input | The AttestArgs argument has five members: <br /> ***adapter***: Pointer to an EvidenceAdapter. <br /> ***policyIds***: An optional list of policy IDs provided by the user. <br /> ***requestId***: An optional request ID to identify the request. For more information, see [Request ID](../glossary.md#request-id). <br /> ***tokenSigningAlg***: Optional. Lets you select "PS384" (the default if no option is specified) or "RS256" for the token signing algorithm. <br /> ***policyMustMatch***: Optional. Boolean `{true \| false}`. If set to **true**, all policies must match for TA to issue an attestation token. The default is **false**, which means that one or more policies can be unmatched and TA still issues an attestation token. |

#### Usage

**attest** is designed for the Passport attestation model when the attester wants a token and does not need to append user data to the evidence. Before calling **attest**, create a TA client connection and an evidence adapter. To include user data with the evidence, see [GetToken](#gettoken).

**attest** performs the following actions:

- Gets a nonce from TA.
- Collects evidence by using the TEE adapter.
- Forwards the evidence and policy IDs to TA.
- Returns an attestation token and HTTP response headers.

### `GetNonce`

**GetNonce** retrieves a signed nonce from TA.

```java
public class TrustAuthorityConnector {
    public GetNonceResponse GetNonce(GetNonceArgs args) throws Exception {}
}
```

```java
GetNonceResponse nonceResponse = connector.GetNonce(nonceArgs);
```

#### GetNonce arguments

| Name | I/O | Description |
| :--- | :--- | :--- |
| **GetNonceArgs.requestId** | Input | An optional request ID to identify the request. If you do not provide one, the API gateway creates one, but it is not guaranteed to be unique. |
| nonce | Output | A signed nonce returned by TA. |

### `GetToken`

**GetToken** requests a new TA attestation token.

```java
public class TrustAuthorityConnector {
    public GetTokenResponse GetToken(GetTokenArgs args) throws Exception {}
}
```

```java
GetTokenResponse tokenResponse = connector.GetToken(tokenArgs);
```

#### GetToken arguments

| Name | I/O | Description |
| :--- | :--- | :--- |
| GetTokenArgs | Input | The GetTokenArgs argument has six members: |
| ***nonce*** | Input | A VerifierNonce provided by the user. |
| ***evidence*** | Input | An evidence structure returned from a TEE adapter. Evidence contains the quote for attestation. |
| ***policyIds*** | Input | An optional list of policy IDs provided by the user. |
| ***requestId*** | Input | An optional request ID to identify the request. |
| ***tokenSigningAlg*** | Input | Optional. Lets you select "PS384" (the default if no option is specified) or "RS256" for the token signing algorithm. |
| ***policyMustMatch*** | Input | Optional. Boolean `{true \| false}`. If set to **true**, all policies must match for TA to issue an attestation token. The default is **false**, which means that one or more policies can be unmatched and TA still issues an attestation token. |

#### Usage

Use **GetToken** for scenarios where **attest** does not provide enough flexibility. **GetToken** allows a confidential app to include `user_data`, provide a nonce, or modify evidence structures before requesting a token. **GetToken** supports both Passport and Background-check validation models.

You can associate policies with an attestation API key. If you specify `policyIds` in the call, they replace any policies associated with the API key.

### `getTokenSigningCertificates`

**getTokenSigningCertificates** retrieves a JSON Web Key Set (JWKS) containing the signing certificates TA uses to sign attestation tokens and nonces.

```java
public class TrustAuthorityConnector {
    public String getTokenSigningCertificates() throws Exception {}
}
```

#### Parameters

**getTokenSigningCertificates** does not take any input.

```java
String certs = connector.getTokenSigningCertificates();
```

### `verifyToken`

**verifyToken** verifies the signature of the JWT received from TA.

**verifyToken** performs the following actions:

- Gets the `kid` from the header.
- Gets the signing certificates.
- Finds the JWT by its `kid` and verifies the certificate against the CA.
- Checks that it can retrieve the public key from the certificate.
- Returns the parsed JWT.

A relying party can use the connector and the **verifyToken** function to validate received tokens before establishing trust.

```java
public class TrustAuthorityConnector {
    public JWTClaimsSet verifyToken(String token) throws Exception {}
}
```

```java
JWTClaimsSet claims = connector.verifyToken(token);
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| token | Input | The JWT returned from TA. |

## Java SGX adapter API reference

Before you integrate an Intel SGX workload with the TA client, implement a function to generate an enclave report. This function should use the SHA-256 hash of the nonce and user data as report data for the `EnclaveReport`. The TA Attestation Service verifies the report data and expects it to be a SHA-256 hash of the nonce and `user_data`, if provided.

### `SgxAdapter`

The following code fragment creates a new Java SGX adapter and then uses the adapter to collect a quote from the SGX TEE.

```java
SgxAdapter sgxAdapter = new SgxAdapter(enclaveID, useData, EnclaveLibrary.EnclaveFunction);
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| enclaveID | Input | The enclave ID specified by the user. |
| userData | Input | The data, in binary or JSON format, provided by the user. |
| EnclaveLibrary.EnclaveFunction | Input | A function pointer to the enclave create report function. |

### `collectEvidence` (Intel SGX)

**collectEvidence** collects a quote from an Intel SGX enclave by using Intel SGX DCAP.

```java
Evidence evidence = sgxAdapter.collectEvidence(nonce);
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| nonce | Input | The nonce value provided by the user. |

## Java Intel TDX adapter API reference

The Java Intel TDX adapter has two variants: one for systems that use the configfs-tsm Linux subsystem for quote generation, such as on-premises Intel TDX hosts and Google Cloud Platform confidential VMs with Intel TDX, and one for Azure confidential VMs with Intel TDX. Azure uses a proprietary scheme for quote generation. These variants are installed from the same source and share the package name (`com.intel.ta.tdx`) and the API in the `TdxAdapter` class.

### `TdxAdapter`

**TdxAdapter** creates a new `TdxAdapter` instance.

```java
TdxAdapter tdxAdapter = new TdxAdapter(userData);
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| userData | Input | The user data provided by the user. |

### `collectEvidence` (Intel TDX)

**collectEvidence** takes a nonce as input, which is hashed (along with user data, if supplied) during trust domain report creation.

```java
Evidence evidence = tdxAdapter.collectEvidence(nonce);
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| nonce | Input | The nonce value provided by the user. |
