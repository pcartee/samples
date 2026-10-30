---
title: Faithful Verifier Tool
description: Learn how to use the Trust Authority (TA) Faithful Verification (FV) command-line tool on Linux to audit a TA attestation token. Covers how Faithful Verification works, prerequisites (Ubuntu, Intel SGX DCAP, PCCS), downloading and verifying the tool, running the config and verify commands, interpreting passed and failed output, and CLI reference.
author: pcartee
topic: conceptual
date: 06/12/2024
uid: faithful.verifier
---

import Binaries from '../../Include/_verify-signed-binaries.md';

The Faithful Verification (FV) tool is a Linux command-line utility that you can use to verify the fidelity of a TA token. This optional tool helps an attestor or relying party verify the integrity of the TA environment.

## Faithful Verification

A token is "faithful" when authentic TA services generate it in an attested trusted execution environment (TEE). TA includes a self-monitoring feature called Faithful Verification. All TA microservices involved in generating an attestation token run in a TEE. When a TEE-protected microservice starts, TA collects attestation-related artifacts, such as TEE quotes, TCB collaterals, current policy requirements, and service IDs, and saves them in a ledger-backed database.

All token generation processing occurs in these TEEs, and protected assets are released only to microservice instances that meet the TEE policy requirements. The attestation information for each of these microservices is referenced in the `verifier_instance_ids` section in every TA token generated.

You can use these ledger references in a TA attestation token to validate the specific microservice instances that produced the token and to retrieve their TEE attestation information. When TA receives a valid token audit request, such as POST **TokenAuditReport**, it generates a token audit report based on the contents of the validation ledger. The Faithful Verification tool gets a token audit report for the given token and then independently validates the TEE quotes. In this way, a TA user can audit the secure processing of attestation tokens and check that the TA microservices and TEEs are valid. The Faithful Verification tool can audit attestation tokens for up to two years after the token issuance date.

## Prerequisites

- Ubuntu 20.04 LTS (Focal) or Ubuntu 22.04 LTS (Jammy).
- Intel® SGX DCAP (Data Center Attestation Primitives), which is required for quote verification. Intel SGX DCAP must be installed on the host system where the FV tool runs.
- Access from the host system to the Intel SGX Provisioning Certification Service (PCS), or to a Provisioning Certificate Caching Service (PCCS), for SGX collaterals.
- `sudo` or root privileges to install packages and edit files in `/etc`.

:::note
Valid characters include: numbers 0 through 9, upper and lowercase English characters, underscore (_), colon (;), period (.), slash (/), dash (-), and a space ( ).
:::

### Install Intel SGX DCAP libraries

To add the Intel SGX repository and install the Intel SGX DCAP library packages, run the following commands for Ubuntu 20.04. If you're using Ubuntu 22.04, change the word `focal` to `jammy` in the second command.

```bash
sudo mkdir -p /etc/apt/keyrings
wget -qO - https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key | sudo tee /etc/apt/keyrings/intel-sgx-keyring.asc > /dev/null
echo 'deb [signed-by=/etc/apt/keyrings/intel-sgx-keyring.asc arch=amd64] https://download.01.org/intel-sgx/sgx_repo/ubuntu focal main' | sudo tee /etc/apt/sources.list.d/intel-sgx.list
sudo apt-get update
sudo apt-get install -y libsgx-urts libsgx-dcap-quote-verify-dev libsgx-dcap-default-qpl
```

After installation, edit `/etc/sgx_default_qcnl.conf` as follows to configure Intel SGX DCAP to use the Intel PCS at `https://api.trustedservices.intel.com/sgx/certification/v3/`.

```jsonc
{
  // *** ATTENTION : This file is in JSON format so the keys are case sensitive. Don't change them.

  //PCCS/PCS server address
  "pccs_url": "https://api.trustedservices.intel.com/sgx/certification/v3/",

  // To accept insecure HTTPS certificate, set this option to false
  "use_secure_cert": true
}
```

Use the following command to check that the system can connect to the Intel PCS.

```bash
curl -v -X GET "https://api.trustedservices.intel.com/sgx/certification/v3/qe/identity"
```

If this command returns a `200 OK` with PCS added identity content, DCAP should be able to connect.

## Download the Faithful Verification tool

The Faithful Verification tool is a downloadable executable on the downloads page of the TA portal.

## Verify the signature of the tool

To verify the signature of the Faithful Verification tool, perform the following steps.

<Binaries />

## Verify an attestation token

The Faithful Verification tool requires a TA attestation token. Save the token to a file (for example, `token.jwt`) on the system where you run Faithful Verification.

Create an answer file (`fv.env` in this example) to configure FV. Replace the `API_KEY` value with an attestation API key:

```bash
# fv.env
TRUSTAUTHORITY_BASE_URL=https://api.ta.intel.com
API_KEY=<your-attestation-api-key>
```

:::note
If you are in the European Union (EU) region, use the following TA URL:

`TRUSTAUTHORITY_BASE_URL=https://api.eu.ta.intel.com`
:::

Configure the Faithful Verification tool by using the `config` command.

```bash
./faithful-verifier config -v fv.env
```

Run the **verify** command and provide the attestation token to verify:

```bash
./faithful-verifier verify -t token.jwt
```

The Faithful Verification tool independently validates the Intel SGX quotes for each of the quoted services by using the Intel SGX DCAP libraries and the TCB requirements from the Intel SGX PCS server. Quotes are validated without using any TA attestation resources. In this way, you can verify the "faithfulness" of the TA token without relying only on the TA assertion.

:::note
Verification depends on the Intel SGX DCAP libraries communicating with the public Intel PCS server to attest the Intel SGX quotes from the faithfulness report. If this communication is blocked, such as by a proxy configuration, the Faithful Verification tool might appear to "hang" until you stop it manually.
:::

### Sample output

The following sample command-line output shows the result for a token that passed verification without errors:

```json
{
        "052335ca-7c5c-4dbc-b373-d0f7774392f6": [
                "Service record quote for appraisal-service with id: 052335ca-7c5c-4dbc-b373-d0f7774392f6 is valid",
                "appraisal-service with id: 052335ca-7c5c-4dbc-b373-d0f7774392f6 passed verification against permitlist",
                "appraisal-service with id: 052335ca-7c5c-4dbc-b373-d0f7774392f6 is faithful"
        ],
        "cb8452ac-9f7f-4212-a061-f93f3aad9281": [
                "Service record quote for quote-verification-service with id: cb8452ac-9f7f-4212-a061-f93f3aad9281 is valid",
                "quote-verification-service with id: cb8452ac-9f7f-4212-a061-f93f3aad9281 passed verification against permitlist",
                "quote-verification-service with id: cb8452ac-9f7f-4212-a061-f93f3aad9281 is faithful"
        ],
        "ceb6e9a3-b555-47e9-b92c-034fb6005429": [
                "Service record quote for tee-caching-service with id: ceb6e9a3-b555-47e9-b92c-034fb6005429 is valid",
                "tee-caching-service with id: ceb6e9a3-b555-47e9-b92c-034fb6005429 passed verification against permitlist",
                "tee-caching-service with id: ceb6e9a3-b555-47e9-b92c-034fb6005429 is faithful"
        ]
}
```

This output includes comparisons of each faithful service against the permit list, as well as an independent verification of the microservice Intel SGX quotes. If both tests return true, the service is reported as "faithful." For an example of what happens when services _don't_ pass verification, see [Failed verification](#failed-verification).

You can optionally save the token audit report retrieved from TA to a file by using the `-r` (`--export-token-audit-report`) flag. This report contains the full Intel SGX quotes for each microservice, along with references to the "permitlist" policy requirements that were valid at the time of microservice registration:

```bash
./faithful-verifier verify -t token.jwt -r report.json
```

Sample content of the report:

```json
{
 "report": {
  "service_records": {
   "052335ca-7c5c-4dbc-b373-d0f7774392f6": {
    "service_id": "052335ca-7c5c-4dbc-b373-d0f7774392f6",
    "name": "appraisal-service",
    "quote": "<SGX quote>",
    "registration_date": "2023-02-02T16:19:17.6587Z",
    "permitlist_version": "v0.3.0-66f6bcd",
    "fmspc": "00606A000000",
    "ca": "platform"
   },
   "cb8452ac-9f7f-4212-a061-f93f3aad9281": {
    "service_id": "cb8452ac-9f7f-4212-a061-f93f3aad9281",
    "name": "quote-verification-service",
    "quote": "<SGX quote>",
    "registration_date": "2023-02-02T16:18:10.743747Z",
    "permitlist_version": "v0.3.0-66f6bcd",
    "fmspc": "00606A000000",
    "ca": "platform"
   },
   "ceb6e9a3-b555-47e9-b92c-034fb6005429": {
    "service_id": "ceb6e9a3-b555-47e9-b92c-034fb6005429",
    "name": "tee-caching-service",
    "quote": "<SGX quote>",
    "registration_date": "2023-02-02T16:18:12.925546Z",
    "permitlist_version": "v0.3.0-66f6bcd",
    "fmspc": "00606A000000",
    "ca": "platform"
   }
  },
  "permit_lists": [
   {
    "version": "v0.3.0-66f6bcd",
    "measurements": {
     "appraisal-service": {
      "mrenclave": "A2Ew...",
      "mrsigner": "Y9q...",
      "semver": "v0.5.3-b3027a6-5132d8f"
     },
     "fv-controller": {
      "mrenclave": "xh68...",
      "mrsigner": "Y9qJ...",
      "semver": "v0.3.2-f5161aa-29c7eed"
     },
     "maa-adaptor-service": {
      "mrenclave": "fDT...",
      "mrsigner": "Y9qJ...",
      "semver": "v0.1.3-f5161aa-8b6276b"
     },
     "policy-provisioner": {
      "mrenclave": "PESo...",
      "mrsigner": "Y9qJ...",
      "semver": "v0.4.2-f5161aa-8b6276b"
     },
     "quote-verification-service": {
      "mrenclave": "Hd+9...",
      "mrsigner": "Y9qJ...",
      "semver": "v0.5.2-f5161aa-8b6276b"
     },
     "tee-caching-service": {
      "mrenclave": "zLI2...",
      "mrsigner": "Y9qJ...",
      "semver": "v0.5.2-f5161aa-8b6276b"
     }
    }
   }
  ],
  "date": "2023-02-07T19:50:16.40252Z",
  "nonce": "<nonce value>",
  "sgx_collaterals": [
   {
    "collection_date": "2023-01-10T21:08:02.835329Z",
    "fmspc": "00606A000000",
    "ca": "platform",
    "sgx_collaterals": {
     "pck_crl_issuer_chain": "<pck cert info>",
     "root_ca_crl": "<root ca info>",
     "pck_crl": "<pck_crl>",
     "tcb_info_issuer_chain": "<TCB issuer cert info>",
     "tcb_info": "<TCB info>",
     "qe_identity_issuer_chain": "<Quoting enclave certificate info>",
     "qe_identity": "<Quoting enclave identity>"
    }
   }
  ]
 },
 "user_data": "<SGX user_data for the service that issues FV reports>",
 "report_quote": "<SGX quote for the service that issues FV reports>"
}
```

:::important
Some security advisories for Intel SGX require mitigation in software that can't be reflected in the evidence contained in an SGX quote. The result of attesting an enclave that's subject to such a security advisory includes a **SW_HARDENING_NEEDED** message, which indicates that you need to make additional mitigation in software. TA implements the applicable software mitigation required for **SW_HARDENING_NEEDED** security advisories listed on the [Intel SGX Attestation Technical Details](https://www.intel.com/content/www/us/en/security-center/technical-details/sgx-attestation-technical-details.html) page.
:::

### Failed verification

When the FV tool detects services that failed verification, it produces output similar to the following and returns one or more errors.

```bash
./faithful-verifier verify -t token.jwt
Successfully verified FV token audit report quote
Verification completed with non-terminal result: SW_HARDENING_NEEDED



Failed to verify service record quote for appraisal-service with id: 280c2180-518b-45bb-bd64-28f3f0ef0782, error: sgx_qv_verify_quote failed with error code: 0xe022
Failed to verify service record quote for quote-verification-service with id: c991a8bd-c4e5-4384-9010-627c6fc6b9d1, error: sgx_qv_verify_quote failed with error code: 0xe022
Failed to verify service record quote for tee-caching-service with id: 740da594-a0ec-4193-bfeb-257ab991961d, error: sgx_qv_verify_quote failed with error code: 0xe022{
        "280c2180-518b-45bb-bd64-28f3f0ef0782": [
                "Failed to verify service record quote for appraisal-service with id: 280c2180-518b-45bb-bd64-28f3f0ef0782, message: : sgx_qv_verify_quote failed with error code: 0xe022",
                "appraisal-service with id: 280c2180-518b-45bb-bd64-28f3f0ef0782 passed verification against permitlist",
                "appraisal-service with id: 280c2180-518b-45bb-bd64-28f3f0ef0782 is not faithful"
        ],
        "740da594-a0ec-4193-bfeb-257ab991961d": [
                "Failed to verify service record quote for tee-caching-service with id: 740da594-a0ec-4193-bfeb-257ab991961d, message: : sgx_qv_verify_quote failed with error code: 0xe022",
                "tee-caching-service with id: 740da594-a0ec-4193-bfeb-257ab991961d passed verification against permitlist",
                "tee-caching-service with id: 740da594-a0ec-4193-bfeb-257ab991961d is not faithful"
        ],
        "c991a8bd-c4e5-4384-9010-627c6fc6b9d1": [
                "Failed to verify service record quote for quote-verification-service with id: c991a8bd-c4e5-4384-9010-627c6fc6b9d1, message: : sgx_qv_verify_quote failed with error code: 0xe022",
                "quote-verification-service with id: c991a8bd-c4e5-4384-9010-627c6fc6b9d1 passed verification against permitlist",
                "quote-verification-service with id: c991a8bd-c4e5-4384-9010-627c6fc6b9d1 is not faithful"
        ]
}
```

## FV CLI commands

```text
Faithful Verifier CLI is used for getting and verifying TrustAuthority faithful services

Usage:
  faithful-verifier [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  config      Setup configuration for Faithful Verifier, saves the configuration in current user home directory as .faithful-verifier-config
  help        Help about any command
  verify      Verifies the faithful verification report
  version     Print the faithful verifier version

Flags:
  -h, --help   help for faithful-verifier

Use "faithful-verifier [command] --help" for more information about a command.

Usage:
  faithful-verifier verify [flags]

Flags:
  -t, --attestation-token string           JWT token created by TA.
  -r, --export-token-audit-report string   TA FV Controller token audit report path to be exported (default: current directory)
  -h, --help                               help for verify
  -i, --request-id string                  Request id to be associated with request
  -o, --results string                     Faithful Verifier result file path (default: current directory)
      --skip-tls-verify                    skips verifying tls certificates when talking to TA
```
