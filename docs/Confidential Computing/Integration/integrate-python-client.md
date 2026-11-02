---
title: TA Python connector
description: Reference for the Trust Authority (TA) Python client, including ITAConnector methods, Config and RetryConfig setup, Intel SGX and Intel TDX adapters, user data handling, and Python examples for collecting evidence and requesting and verifying attestation tokens.
author: pcartee
topic: integration
date: "2024-05-16"
uid: integrate.python.client
sidebar_position: 4
---

The TA client provides Python libraries for attesting trusted execution environments (TEEs). Import the libraries into your application to make REST calls to TA and obtain attestation tokens containing information about TEE attestation and verification.

The TA Python client modules, build instructions, and installation instructions are on GitHub at [**intel/ta-client-for-python**](https://github.com/intel/ta-client-for-python).

## ITAConnector class and evidence adapters

The Python client `ITAConnector` class includes the following methods for attestation and verification:

[**`attest`**](#attest)  
Collects evidence and requests an attestation token from TA for clients that use the Passport validation model.

[**`get_nonce`**](#get_nonce)  
Retrieves a nonce and parses it as JSON.

[**`get_token`**](#get_token)  
Requests an attestation token from TA. `get_token` provides more control than `attest` by allowing a confidential app to include user data, provide a nonce, and modify evidence structures before requesting a token. `get_token` supports both Passport and background-check attestation models.

[**`get_token_signing_certificates`**](#get_token_signing_certificates)  
Retrieves a JSON Web Key Set (JWKS) containing the signing certificates TA uses to sign attestation tokens.

[**`verify_token`**](#verify_token)  
Verifies that a TA attestation token is properly formatted and signed.

A connector requires a TEE adapter (`adapter: EvidenceAdapter` in **AttestArgs**) to collect evidence from the attesting platform. For information about the TEE adapters that the Python connector supports, see [TEE adapters](../Integration/integrate-overview.md#tee-adapters) in the integration overview.

A relying party can use the Python connector without a TEE adapter. Only **attest** requires a TEE adapter.

## API reference

Before you can use the API methods, you must set attributes of the **Config** object. The following example is from the Intel TDX attestation sample app:

```python

    # Populate the config object.
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
If you are in the European Union (EU) region, use these TA URLs:

- Base URL: `https://portal.eu.ta.intel.com`
- API URL: `https://api.eu.ta.intel.com`

:::

**RetryConfig** is optional. If you do not set it, the client uses the default values defined in `inteltrustauthorityclient/resources/constants.py`.

### attest

**attest** is an all-in-one method that supports the Passport attestation model.

```python
  def attest(self, args: AttestArgs) -> AttestResponse
```

**attest** gets a nonce, collects evidence from the TEE, and returns an attestation token if validation succeeds. It lets you supply a list of appraisal policies and a request ID to track the request. To include `user_data` in your attestation request, use **get_token** directly.

| Parameter/return | Comment |
| :--- | :--- |
| AttestArgs.adapter | Required. A reference to an **EvidenceAdapter** abstract base class, which represents the TEE adapter module. |
| AttestArgs.request_id | An optional request ID for tracking. The **request_id** can contain up to 128 characters: a-z, A-Z, 0-9, and hyphens (-). Special characters are not allowed. |
| AttestArgs.policy_ids | An optional array of one to 10 attestation policy IDs. |
| AttestResponse.headers | An array of one or more HTTP response headers. |
| AttestResponse.token | If the attestation request is successful, **token** contains a JWT in base64-encoded format. |

### get_nonce

**get_nonce** retrieves a nonce from TA.

```python
  def get_nonce(self, args: GetNonceArgs) -> GetNonceResponse
```

| Parameter/return | Comment |
| :--- | :--- |
| GetNonceResponse.headers | HTTP response headers. |
| GetNonceResponse.nonce | A signed nonce in JSON format. The nonce has three fields: `val`, `iat`, and `signature`. |

Example `GetNonceResponse.nonce`:

```json
{
  "val": "<redacted nonce>",
  "iat": "<redacted timestamp>",
  "signature": "<redacted signature>"
}
```

### get_token

**get_token** retrieves an attestation token (JWT) from TA.

```python
  def get_token(self, args: GetTokenArgs) -> GetTokenResponse
```

| Parameter/return | Comment |
| :--- | :--- |
| GetTokenArgs.nonce | Optional. A **VerifierNonce** object (JSON format) that contains a nonce received from TA. |
| GetTokenArgs.evidence | Required. An **Evidence** object returned by a TEE adapter's **collect_evidence()** method or, in background-check attestation mode, evidence received from the attester. |
| GetTokenArgs.policy_ids | An optional array of one to 10 attestation policy IDs. |
| GetTokenArgs.request_id | An optional request ID for tracking. The **request_id** is a maximum of 128 characters, including a-z, A-Z, 0-9, and - (hyphen). Special characters aren't allowed. |
| GetTokenResponse.token | Contains a JWT in base64-encoded format. |
| GetTokenResponse.headers | An array of one or more HTTP response headers. |

**get_token** calls the TA REST API to request an attestation token. You can use **get_token** in Passport or background-check attestation models, with or without a TEE adapter. The **attest** method demonstrates the steps your code should take before calling **get_token** in Passport mode. Unlike **attest**, **get_token** does not require a TEE adapter, so a relying party operating in background-check mode can request an attestation token using evidence provided by an attester.

To include user data, such as a public key for secure key release, pass `user_data` to the evidence adapter when you create an adapter object.

### get_token_signing_certificates

**get_token_signing_certificates** retrieves the attestation token signing certificates from `https://<base_url>/certs`.

```python
  def get_token_signing_certificates(self)
```

The following example retrieves the JWKS from TA. In a later step (not shown), the `kid` from the attestation token header is used to find the certificate that signed the token.

```python
  jwks_data = self.get_token_signing_certificates()
  if jwks_data is None:
      log.error(
          "Unable to get token signing certificates from TA."
      )
      return None
```

### verify_token

**verify_token** verifies that the token is well-formed and that its signing certificate can be traced to the issuing authority.

```python
def verify_token(self, token)
```

The following example verifies an attestation token received from **attest**. It logs an error if verification fails and logs the verified token if verification succeeds.

```python
# verify the attestation token received from TA
verified_token = None
try:
    verified_token = ita_connector.verify_token(token)
except Exception as exc:
    log.error(f"Token verification returned an exception: {exc}")
if verified_token is not None:
    log.info("Token verification succeeded")
    log.info(f"Verified attestation token: {verified_token}")
else:
    log.info("Token verification failed")
```

## TEE adapters

Four Python TEE adapters are currently available. They all present the same API interface to the connector, so the same codebase can support several platforms.

The Intel TDX attestation sample application includes code to instantiate the adapter for the current platform at run time. This allows the sample to run on all supported Intel TDX platforms without modification, except for setting an environment variable. The following code sample shows how to create the appropriate adapter and pass user data to include in the attestation token.

```python
# Create a TDX adapter.
user_data = "data generated inside tee"
adapter_type = os.getenv("ADAPTER_TYPE")
if adapter_type is None:
    log.error("ADAPTER_TYPE is not set.")
    exit(1)
adapter = None
if adapter_type == const.INTEL_TDX_ADAPTER:
    adapter = TDXAdapter(user_data)
elif adapter_type == const.AZURE_TDX_ADAPTER:
    adapter = AzureTDXAdapter(user_data)
elif adapter_type == const.GCP_TDX_ADAPTER:
    adapter = GCPTDXAdapter(user_data)
else:
    log.error("Invalid adapter type selected.")
    exit(1)
```

As shown in the preceding code, you can provide `user_data` when you create an adapter object. User data can be binary or JSON and must be encoded as Base64 or Base64url. The maximum allowed size is 1 MB. The client concatenates the user data with the nonce, if provided, and hashes the result. It saves the resulting extended hash in the evidence's **report_data** attribute and outputs it in the JWT **`<tee>_report_data`** claim. TA uses the **report_data** hash to verify that the user data was not modified after evidence collection.

The term `user_data` has several names. The following terms all refer to the data provided to the evidence adapter when you create the adapter object:

- In the REST API request body, it is the **runtime_data** parameter. `Evidence.user_data` maps to the attestation request's **runtime_data** field.
- In the client connector source code, it is called **user_data** or **uData**, depending on the language convention.
- In the attestation token, it is the **attester_held_data** output claim when provided in binary format and the **attester_user_data** output claim when provided in JSON format.

User data appears in only one output claim in the attestation token. A single claim cannot contain both binary and JSON data, which is why the token has two output claims for `user_data`/`runtime_data`.

### collect_evidence

The `collect_evidence` method is the same for all adapters. A nonce is optional, but it is a good practice to include one whenever your use case allows.

```python
  def collect_evidence(self, nonce=None) -> Evidence
```

**collect_evidence** returns an **Evidence** object. The **ITAConnector.get_token** `make_request()` method shows how to use the evidence to construct the REST API attestation request body.
