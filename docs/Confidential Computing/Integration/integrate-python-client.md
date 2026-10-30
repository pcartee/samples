---
title: TA Python connector
description: Reference for the Trust Authority (TA) Python client. Describes the ITAConnector class methods (attest, get_nonce, get_token, get_token_signing_certificates, verify_token), Config and RetryConfig setup, TEE adapters for Intel SGX and Intel TDX platforms, user data handling, and collect_evidence, with Python examples.
author: pcartee
topic: integration
date: 05/16/2024
uid: integrate.python.client
sidebar_position: 4
---

The TA client provides a set of Python libraries for attesting trusted execution environments (TEEs). You can import the Python libraries into your application and make REST calls to TA to get an attestation token that contains information about the TEE attestation and verification.

The TA Python client modules, build instructions, and installation instructions are on GitHub at [**intel/ta-client-for-python**](https://github.com/intel/ta-client-for-python).

## ITAConnector class and evidence adapters

The Python client ITAConnector class includes the following methods for attestation and verification:

[**`attest`**](#attest)  
Collects evidence and requests an attestation token from TA for clients that use a Passport validation model.

[**`get_nonce`**](#get_nonce)  
Gets a nonce and parses it to JSON.

[**`get_token`**](#get_token)  
Requests an attestation token from TA. `get_token` provides more control than `attest` by allowing a confidential app to include user data, provide a nonce, and modify evidence structures before requesting a token. `get_token` supports both Passport and Background-check attestation models.

[**`get_token_signing_certificates`**](#get_token_signing_certificates)  
Retrieves a JSON Web Key Set (JWKS) that contains the collection of signing certificates that TA uses to sign attestation tokens.

[**`verify_token`**](#verify_token)  
Verifies that a TA attestation token is properly formatted and signed.

A connector requires a TEE adapter (`adapter: EvidenceAdapter` in **AttestArgs**) to collect evidence from the attesting platform. For more information about which TEE adapters the Python connector currently supports, see [TEE adapters](../Integration/integrate-overview.md#tee-adapters) in the integration overview article.

A relying party can use the Python connector without a TEE adapter. The only method that requires a TEE adapter is **attest**.

## API reference

Before you can use the API methods, you must set attributes of the **Config** object. The following example is from the Intel TDX attestation sample app:

```python

    # Populate config object
    config_obj = config.Config(
        config.RetryConfig(
            int(retry_wait_time_min), int(retry_wait_time_max), int(retry_max)
        ),
        trustauthority_base_url, # https://portal.ta.intel.com
        trustAuthority_api_url, # https://api.ta.intel.com
        trust_authority_api_key, # An attestation API key
    )
```

:::note
If you are in the European Union (EU) region, use the following TA URLs:

- Base URL: `https://portal.eu.ta.intel.com`
- API URL: `https://api.eu.ta.intel.com`
:::

**RetryConfig** is optional. If you don't set RetryConfig, the client uses the default values defined in `inteltrustauthorityclient/resources/constants.py`.

### attest

**attest** is an all-in-one attestation method that supports the Passport attestation model.

```python
  def attest(self, args: AttestArgs) -> AttestResponse
```

**attest** gets a nonce, collects evidence from the TEE, and (if validation is successful) returns an attestation token. **attest** lets you supply a list of appraisal policies and a request ID to track the request. If you need to supply user_data with your attestation request, use **get_token** directly.

| Parameter/return | Comment |
| :--- | :--- |
| AttestArgs.adapter | Required. A reference to an **EvidenceAdapter** abstract base class, which represents the TEE adapter module. |
| AttestArgs.request_id | An optional request ID for tracking. The **request_id** is a maximum of 128 characters, including a-z, A-Z, 0-9, and - (hyphen). Special characters aren't allowed. |
| AttestArgs.policy_ids | An optional array of one to 10 attestation policy IDs. |
| AttestResponse.headers | An array of one or more HTTP response headers. |
| AttestResponse.token | If the attestation request is successful, **token** contains a JWT in base64-encoded format. |

### get_nonce

**get_nonce** gets a nonce from TA.

```python
  def get_nonce(self, args: GetNonceArgs) -> GetNonceResponse
```

| Parameter/return | Comment |
| :--- | :--- |
| GetNonceResponse.headers | HTTP response headers. |
| GetNonceResponse.nonce | A signed nonce in JSON format. The nonce has three fields: "val", "iat", and "signature". |

Example GetNonceResponse.nonce:

```json
 {
  "val": "g9QC7VxV0n8dID0zSJeVLSULqYCJuv4iMepby91xukrhXgKrKscGXB5lxmT2s3POjxVOG+fSPCYpOKYWRRWAyQ==",
  "iat": "MjAyMi0wOC0yNCAxMjozNjozMi45Mjk3MjIwNzUgKzAwMDAgVVRD",
  "signature": "WswVG3rOPJIuVmMNG2GZ6IF4hD+QfuJ/PigIRaHtQitGAHRCRzgtW8+8UbXe9vJfjnapjw7RQyzpT+vPGVpxRSoiBaj54RsedI38K9ubFd3gPvsMlYltgFRSAtb1ViWZxMhL0yA9+xzgv0D+11mpNEz8nt3HK4oALV5EAxqJYCmKZRzi3/LJe842AY8DVcV9eUZQ8RBx7gNe72Ex1fU3+qF9A9MuOgKqJ41/7HFTY0rCpcBS8k6E1VBSatk4XTj5KNcluI3LoAOvBuiwObgmNKT8Nyc4JAEc+gmf9e9taIgt7QNFEtl3nwPQuiCLIh0FHdXPYumiQ0mclU8nfQL8ZUoe/GqgOd58+fZoHeGvFoeyjQ7Q0Ini1rWEzwOY5gik9yH57/JTEJTI8Evc0L8ggRO4M/sZ2ZTyIq5yRUISB2eDh6qTfbKgSr5LpxW8IRl0y9fp8CEuzhFxKcOeld9p61yb040P+QhemhP/O1E5tf4y4Pz/ISASiKUBFSTh4yYx"
  }
```

### get_token

**get_token** gets an attestation token (JWT) from TA.

```python
  def get_token(self, args: GetTokenArgs) -> GetTokenResponse
```

| Parameter/return | Comment |
| :--- | :--- |
| GetTokenArgs.nonce | Optional. A **VerifierNonce** object (JSON format) that contains a nonce received from TA. |
| GetTokenArgs.evidence | Required. An **Evidence** object returned by a TEE adapter's **collect_evidence()** method, or (in background-check attestation mode) evidence received from the attester. |
| GetTokenArgs.policy_ids | An optional array of one to 10 attestation policy IDs. |
| GetTokenArgs.request_id | An optional request ID for tracking. The **request_id** is a maximum of 128 characters, including a-z, A-Z, 0-9, and - (hyphen). Special characters aren't allowed. |
| GetTokenResponse.token | Contains a JWT in base64-encoded format. |
| GetTokenResponse.headers | An array of one or more HTTP response headers. |

**get_token** calls the TA REST API to request an attestation token. You can use **get_token** in passport or background-check attestation models, with or without a TEE adapter. The **attest** method provides an example of the steps your code should take before calling **get_token** in passport mode. Unlike **attest**, **get_token** doesn't need a TEE adapter, which allows a relying party operating in background-check mode to request an attestation token by using evidence provided by an attester.

To include user data, such as a public key for secure key release or a similar use case, you must pass the user_data to the evidence adapter when you create a new adapter object.

### get_token_signing_certificates

**get_token_signing_certificates** gets the list of attestation token signing certificates from `https://<base_url>/certs`.

```python
  def get_token_signing_certificates(self)
```

The following example attempts to retrieve the JWKS from TA. In a later step (not shown here), the kid retrieved from the attestation token header is used to search the JWKS for the certificate that was used to sign the token.

```python
  jwks_data = self.get_token_signing_certificates()
  if jwks_data == None:
      log.error(
          "Unable to get token signing certificates from TA."
      )
      return None
```

### verify_token

**verify_token** verifies that the token is well-formed and that the signing certificate can be traced to the issuing authority.

```python
def verify_token(self, token)
```

The following example attempts to verify an attestation token received from the **attest** method. If verification fails, the error is logged. If verification is successful, the verified token is saved to the log.

```python
# verify the attestation token received from TA
    try:
        verified_token = ita_connector.verify_token(token)
    except Exception as exc:
        log.error(f"Token verification returned an exception : {exc}")
    if verified_token != None:
        log.info("Token verification succeeded")
        log.info(f"Verified attestation token : {verified_token}")
    else:
        log.info("Token verification failed")
```

## TEE adapters

There are currently four Python TEE adapters available. All of the TEE adapters present an identical API interface to the connector, so that the same code base can support several platforms.

The Intel TDX attestation sample application includes code to instantiate the correct adapter for the current platform at run time. This allows the sample to run on all of the supported Intel TDX platforms without any modifications, except for setting an environment variable. The following code sample from the Intel TDX example shows how to create the appropriate adapter and pass user data to include in the attestation token.

```python
  # Create TDX Adapter
  user_data = "data generated inside tee"
  adapter_type = os.getenv("ADAPTER_TYPE")
  if adapter_type is None:
      log.error("ADAPTER_TYPE is not set.")
      exit(1)
  adapter = None
  if(adapter_type == const.INTEL_TDX_ADAPTER):
      adapter = TDXAdapter(user_data)
  elif(adapter_type == const.AZURE_TDX_ADAPTER):
      adapter = AzureTDXAdapter(user_data)
  elif(adapter_type == const.GCP_TDX_ADAPTER):
      adapter = GCPTDXAdapter(user_data)
  else:
      log.error("Invalid Adapter Type Selected.")
      exit(1)
```

As shown in the preceding code, you can provide user_data when you create a new adapter object. User data can be binary or JSON, and must always be encoded as either Base64 or Base64url. The maximum size allowed is 1Mb. The user data is concatenated with the nonce (if provided) and hashed. The resulting extended hash is saved in the **report_data** attribute in the evidence, and then output in the JWT **`<tee>_report_data`** claim. TA uses the report_data hash to verify that the user data wasn't modified after evidence was collected.

The term user_data is known by several names. The following terms all refer to the data provided to the evidence adapter during object instantiation:

- In the REST API request body, it's the **runtime_data** parameter. Evidence.user_data maps to the attestation request runtime_data field.
- In the client connector source code (across all languages), it's referred to as **user_data** or **uData**, depending on language convention.
- In the attestation token, it's the **attester_held_data** output claim if user data is provided in binary format, and the **attester_user_data** output claim if user data is provided in JSON format.

User data appears in only one output claim in the attestation token. A single claim can't output both binary and JSON because of data rules, which is why there are two output claims for user_data/runtime_data.

### collect_evidence

The collect_evidence method is the same for all adapters. A nonce is optional, but it's a good practice to always include a nonce if your use case allows.

```python
  def collect_evidence(self, nonce=None) -> Evidence
```

**collect_evidence** returns an **Evidence** object. The **ITAConnector.get_token** make_request() method shows how to use the evidence to construct the REST API attestation request body.
