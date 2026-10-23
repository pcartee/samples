---
title: Faithful Verifier Tool
description: Install, configure, and use the Faithful Verifier command-line tool to independently verify TA attestation tokens and review verification reports.
author: "[redacted]"
topic: conceptual
date: 06/12/2024
uid: faithful.verifier
---

import Binaries from '../../Include/_verify-signed-binaries.md';

The Faithful Verifier (FV) tool is a Linux command-line utility for verifying the fidelity of a TA attestation token. Attesters and relying parties can use this optional tool to verify the integrity of the TA environment.

## How faithful verification works

A token is "faithful" when authentic TA services generate it in an attested trusted execution environment (TEE). TA includes a self-monitoring feature called Faithful Verification. All TA microservices involved in generating an attestation token run in a TEE. When a TEE-protected microservice starts, TA collects attestation-related artifacts, such as TEE quotes, TCB collaterals, current policy requirements, and service IDs, and saves them in a ledger-backed database.

All token-generation processing occurs in these TEEs, and TA releases protected assets only to microservice instances that meet the TEE policy requirements. Every TA token references each microservice's attestation information in the `verifier_instance_ids` section.

Use these ledger references in a TA attestation token to validate the microservice instances that produced the token and retrieve their TEE attestation information. When TA receives a valid token audit request, such as POST **TokenAuditReport**, it generates a token audit report from the validation ledger. The Faithful Verifier retrieves the report for the specified token and independently validates the TEE quotes. This lets TA users audit the secure processing of attestation tokens and verify the TA microservices and TEEs. The tool can audit tokens for up to two years after issuance.

## Download the Faithful Verifier tool

Download the Faithful Verifier executable from the Downloads page in the TA portal.

## Verify the tool's signature

To verify the Faithful Verifier tool's signature, follow these steps.

<Binaries />

## Prerequisites

- Ubuntu 20.04 LTS (Focal) or Ubuntu 22.04 LTS (Jammy)
- Intel® SGX DCAP (Data Center Attestation Primitives) is required for quote verification. Install Intel SGX DCAP on the host system where the FV tool will run.
- The host system must have access to Intel® SGX PCCS (Provisioning Certificate Caching Service) for SGX collaterals.

:::note
Supported characters are the digits 0 through 9; uppercase and lowercase English letters; the underscore (_), colon (:), period (.), slash (/), and dash (-); and the space character.
:::

### Install Intel SGX DCAP libraries

To add the Intel SGX repository and install the Intel SGX DCAP library packages on Ubuntu 20.04, run the following commands. For Ubuntu 22.04, change `focal` to `jammy` in the first line.

```bash
echo 'deb [arch=amd64] https://download.01.org/intel-sgx/sgx_repo/ubuntu focal main' > /etc/apt/sources.list.d/intel-sgx.list
wget -qO - https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key | apt-key add -
apt-get update
apt-get install -y libsgx-urts libsgx-dcap-quote-verify-dev libsgx-dcap-default-qpl
```

After installation, edit `/etc/sgx_default_qcnl.conf` as follows to configure Intel SGX DCAP to use the PCCS endpoint at `https://api.trustedservices.intel.com/sgx/certification/v3/`.

```jsonc
{
  // Attention: This file uses JSON format, so the keys are case-sensitive. Do not change them.

  // PCCS server address
  "pccs_url": "https://api.trustedservices.intel.com/sgx/certification/v3/",

  // To accept an insecure HTTPS certificate, set this option to false.
  "use_secure_cert": true
}
```

Use the following command to check that the system can connect to Intel PCCS.

```bash
curl -v -X GET "https://api.trustedservices.intel.com/sgx/certification/v3/qe/identity"
```

If this command returns `200 OK` with PCS attestation identity content, DCAP should be able to connect.

## Verify an attestation token

The Faithful Verifier requires a TA attestation token. Save the token to a file, such as `token.jwt`, on the system where you will run the tool.

Create an environment file to configure FV. In this example, the file is named `fv.env`. Replace the `API_KEY` placeholder with an attestation API key:

```bash
# fv.env
TRUSTAUTHORITY_BASE_URL=https://api.ta.intel.com
API_KEY=YOUR_API_KEY
```

:::note
If you are in the European Union (EU) region, set the TA URL as follows:

`TRUSTAUTHORITY_BASE_URL=https://api.eu.ta.intel.com`
:::

Configure the Faithful Verifier with the `config` command.

```bash
./faithful-verifier config -v fv.env
```

Run the `verify` command and provide the attestation token:

```bash
./faithful-verifier verify -t token.jwt
```

The Faithful Verifier independently validates the Intel SGX quotes for each service by using the Intel SGX DCAP libraries and TCB requirements from the Intel SGX PCS server. It validates quotes without using TA attestation resources, so users can verify a token's "faithfulness" without relying only on TA's assertion.

:::note
Verification depends on the Intel SGX DCAP libraries communicating with the public Intel PCS server to attest the Intel SGX quotes in the faithfulness report. If a proxy configuration or another network restriction blocks this communication, the Faithful Verifier may appear to hang until you stop it manually.
:::

### Sample output

The following sample command-line output shows a token that passed verification without errors:

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

This output shows each service's result against the permit list and the independent verification result for its Intel SGX quote. If both checks pass, the service is reported as "faithful." For an example of a failed verification, see [Failed verification](#failed-verification).

Use the `-r` flag to save the Faithful Verifier report retrieved from TA. The report contains the full Intel SGX quotes for each microservice and references the "permitlist" policy requirements that were valid when each microservice registered:

```bash
./faithful-verifier verify -t token.jwt -r report.json
```

The report contains data similar to the following:

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
     "qe_identify_issuer_chain": "<Quoting enclave certificate info>",
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
Some Intel SGX security advisories require software mitigations that cannot be reflected in SGX quote evidence. Attesting an enclave affected by such an advisory returns a **SW_HARDENING_NEEDED** message, indicating that software mitigation is required. TA has implemented the applicable software mitigations for the **SW_HARDENING_NEEDED** advisories listed on the [Intel SGX Attestation Technical Details](https://www.intel.com/content/www/us/en/security-center/technical-details/sgx-attestation-technical-details.html) page.
:::

### Failed verification

When the FV tool detects services that failed verification, it returns one or more errors and output similar to the following:

```bash
./faithful-verifier verify -t token.jwt
Successfully verified FV token audit report quote
Verification completed with non-terminal result: SW_HARDENING_NEEDED



Failed to verify service record quote for appraisal-service with id: 280c2180-518b-45bb-bd64-28f3f0ef0782, error: sgx_qv_verify_quote failed with error code: 0xe022
Failed to verify service record quote for quote-verification-service with id: c991a8bd-c4e5-4384-9010-627c6fc6b9d1, error: sgx_qv_verify_quote failed with error code: 0xe022
Failed to verify service record quote for tee-caching-service with id: 740da594-a0ec-4193-bfeb-257ab991961d, error: sgx_qv_verify_quote failed with error code: 0xe022
{
        "280c2180-518b-45bb-bd64-28f3f0ef0782": [
                "Failed to verify service record quote for appraisal-service with id: 280c2180-518b-45bb-bd64-28f3f0ef0782, message: sgx_qv_verify_quote failed with error code: 0xe022",
                "appraisal-service with id: 280c2180-518b-45bb-bd64-28f3f0ef0782 passed verification against permitlist",
                "appraisal-service with id: 280c2180-518b-45bb-bd64-28f3f0ef0782 is not faithful"
        ],
        "740da594-a0ec-4193-bfeb-257ab991961d": [
                "Failed to verify service record quote for tee-caching-service with id: 740da594-a0ec-4193-bfeb-257ab991961d, message: sgx_qv_verify_quote failed with error code: 0xe022",
                "tee-caching-service with id: 740da594-a0ec-4193-bfeb-257ab991961d passed verification against permitlist",
                "tee-caching-service with id: 740da594-a0ec-4193-bfeb-257ab991961d is not faithful"
        ],
        "c991a8bd-c4e5-4384-9010-627c6fc6b9d1": [
                "Failed to verify service record quote for quote-verification-service with id: c991a8bd-c4e5-4384-9010-627c6fc6b9d1, message: sgx_qv_verify_quote failed with error code: 0xe022",
                "quote-verification-service with id: c991a8bd-c4e5-4384-9010-627c6fc6b9d1 passed verification against permitlist",
                "quote-verification-service with id: c991a8bd-c4e5-4384-9010-627c6fc6b9d1 is not faithful"
        ]
}
```

## Faithful Verifier CLI commands

```bash
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
