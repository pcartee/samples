---
title: TA Java client integration
description: Reference for the Trust Authority (TA) Java client. Describes the Java connector, Intel SGX adapter, and Intel TDX adapter APIs, with method signatures, parameters, and Java examples for creating a connector, collecting evidence, requesting attestation tokens and nonces, and verifying tokens.
author: pcartee
topic: integration
date: 11/08/2024
uid: integrate.java.client
sidebar_position: 3
---

The Java connector is one of several language-specific clients available for TA. The client libraries provide an interface to the TA REST API and (for attesters) the platform software that collects measurements for a quote. A trusted execution environment (TEE) adapter is needed to collect evidence for attestation. Currently, the Java TEE adapters support Intel® SGX and Intel® TDX. Supported Intel TDX platforms include on-premises Intel TDX hosts, Google Cloud Platform (GCP) confidential VMs with Intel TDX, and Azure confidential VMs with Intel TDX.

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
Fetches the token from the TA server by using the specified API URL.

[**getTokenSigningCertificates**](#gettokensigningcertificates)  
Retrieves a certificate from the collection of signing certificates that TA uses to sign attestation tokens.

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

The Java connector module uses the TA REST APIs to communicate with the TA service. The first step in using the Java connector is to create a connector instance.

### `TrustAuthorityConnector` API

Create a new connector instance, and then use the exposed interfaces to access different parts of the TA API.

```java

// Initialize config required for connector using trustAuthorityBaseUrl (https://portal.ta.intel.com), trustAuthorityApiUrl (https://api.ta.intel.com), trustAuthorityApiKey, and retryConfig
Config cfg = new Config(trustAuthorityBaseUrl, trustAuthorityApiUrl, trustAuthorityApiKey, retryConfig);

// Initialize TrustAuthorityConnector with the config
TrustAuthorityConnector connector = new TrustAuthorityConnector(cfg);
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| connector | Output | Receives a pointer to a Java TrustAuthorityConnector instance. |
| cfg | Input | The configuration file provided by the user. |

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

**attest** provides a relatively simple method to obtain an attestation token for the client.

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

**attest** is designed for a Passport attestation model where the attester wants to get a token and doesn't need to append user data to evidence. The attester only needs to create a new TA client connection and evidence adapter before calling **attest**. If you need to include user data with the evidence, see [GetToken](#gettoken).

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
| **GetNonceArgs.requestId** | Input | An optional request ID to identify the request. If you don't provide a request ID, the API gateway creates one for you, but it isn't guaranteed to be unique. |
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

**GetToken** is for complex scenarios where **attest** doesn't provide enough flexibility. **GetToken** provides more control than **attest** by allowing a confidential app to include user_data, provide a nonce, or modify evidence structures before requesting a token. **GetToken** supports both Passport and Background-check validation models.

You can associate policies with an attestation API key. If you specify policyIds directly in the call, they override and replace any policies associated with the API key.

### `getTokenSigningCertificates`

**getTokenSigningCertificates** retrieves a JSON Web Key Set (JWKS) that contains the collection of signing certificates (in JWT format) that TA uses to sign attestation tokens and nonces.

```java
public class TrustAuthorityConnector {
    public String getTokenSigningCertificates() throws Exception {}
}
```

#### Parameters

**getTokenSigningCertificates** doesn't take any input.

```java
String certs = connector.getTokenSigningCertificates();
```

### `verifyToken`

**verifyToken** verifies the signature of the JWT received from TA.

**verifyToken** performs the following actions:

- Gets the kid from the header.
- Gets the signing certificates.
- Finds the JWT from the kid and verifies the certificate against the CA.
- Checks that the public key can be retrieved from the certificate.
- Returns the parsed JWT.

A relying party can use the connector and the **verifyToken** function to validate any received tokens before establishing trust.

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

Before you integrate an Intel SGX workload with the TA client, the workload must implement a function to generate an enclave report. This function should take the SHA256 hash of the nonce and user data to form report data for the `EnclaveReport`. The TA Attestation Service performs a report data verification in which it expects the report data to be a SHA256 hash of the nonce and user_data (if any).

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

**collectEvidence** gets a quote from an Intel SGX enclave by using Intel SGX DCAP.

```java
Evidence evidence = sgxAdapter.collectEvidence(nonce);
```

#### Parameters

| Name | I/O | Description |
| :--- | :--- | :--- |
| nonce | Input | The nonce value provided by the user. |

## Java Intel TDX adapter API reference

The Intel TDX adapter for Java is two adapters: one for systems that use the configfs-tsm Linux subsystem for quote generation, such as on-premises Intel TDX hosts and Google Cloud Platform confidential VMs with Intel TDX, and one for Azure confidential VMs with Intel TDX. Azure uses a proprietary scheme for quote generation. These adapters are installed from the same source and share an identical package name (`com.intel.ta.tdx`) and API in the `TdxAdapter` class.

### `TdxAdapter`

**TdxAdapter** creates a new TdxAdapter instance.

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
