---
title: Author a custom policy
description: Learn how to write custom TA attestation and token customization policies in Rego, including Intel SGX and Azure confidential VM examples.
author: pcartee
topic: how to
date: 07/17/2024
uid: author.custom.policy  # Do not change uid!
sidebar_position: 3
---

:::important
This article describes version 1 (V1) of the attestation policy supported by TA. Version 2 (V2) is also available. We strongly encourage you to transition existing V1 policies to V2 as soon as possible. TA will continue to support V1 policies for now, but will eventually phase them out. For more information about transitioning to V2, see Attestation policy V2.
:::

This article explains how to create policies for TA. TA uses [Open Policy Agent (OPA)](https://www.openpolicyagent.org/docs/latest/) to decouple policy evaluation logic from policy enforcement. You write policies in the [Rego policy language](https://www.openpolicyagent.org/docs/latest/policy-language/).

TA always issues a token, even on policy failure. The one exception is the built-in default policy, which evaluates the integrity of the Intel® Software Guard Extensions (Intel® SGX) quoting enclave and TCB. If the built-in policy fails, an error occurs, and no token is issued.

TA evaluates policies and categorizes them as matched or unmatched in the issued token.

## Allowed built-in functions

You can use the following built-in functions in your policy:

- time.now_ns()
- time.parse_rfc3339_ns(_value_)
- time.add_date(_ns, years, months, days_)
- object.subset(_super, sub_)
- count(_collection_)
- `&`   (And)
- `==`  (Comparison; is equal)
- `=`   (Unification; make equal)
- `>`
- `>=`
- `<`
- `<=`
- `:=`

For more information, see Policy language functions.

## Minimum required contents for a policy

- An output variable:
  - Appraisal policies return a logical true or false value and use the equality operator `=` to set the `matches_policy` output. Appraisal policies perform comparisons.
  - Token customization policies return a set of name-value claims and use the assignment operator `:=` to set the `token_fields` output variable. They define custom claims and set their values.
- Every policy must have at least one rule that evaluates to the correct output type.
- As a best practice, initialize the output variable for every appraisal policy to `false`.

## Attestation policies

Attestation policies define the requirements that the appraiser (TA) compares with evidence from an attester. When a token request specifies user-defined attestation policies, the resulting token contains arrays of matched and unmatched policy IDs. These arrays indicate which policies' requirements the evidence satisfied.

### Obtaining policy values

Attestation policies require you to define expected claim values. For example, a policy might require the **sgx.mrenclave** claim to match `83f4e819861adef6ffb2a4865efea9337b91ed30fa33491b17f0d5d9e8204410`. How you obtain the expected value depends on the claims being evaluated and the technology being attested.

The easiest method is to use the TA client to request attestation for a known-good example of the application you want to protect. Examine the claims in the resulting token to see the supported values, then use the relevant values to write a policy that meets your application's trust requirements. For most attestation technologies, you can use the `token` command in the Attestation Client CLI. For example, to request attestation for a VM protected by Intel TDX, run `ta-cli token --config config.json`.

Alternatively, some claim values are build outputs or are defined by the software owner. For example, with Intel SGX, **sgx.mrenclave** is a hash of the SGX enclave (a code library) and can be generated as part of the build process. **sgx_isvsvn** is an integer value defined by the software developer that indicates the enclave's security version.

The infrastructure owner may be the only party that defines or knows some claim values. Some service providers may publish these values.

See the vendor documentation for the attestation technology to learn how to obtain policy values.

## Default policies

TA always applies a default policy, even when other policies are associated with the API key or specified in an array in the token request. The default policy validates the enclave's Trusted Compute Base (TCB) against the latest firmware and authenticated code modules. This check helps establish that the quoting enclave is genuine and up to date. When a customer-defined policy is assigned to an API key or specified in an array in the token request, the attestation token includes lists of matched and unmatched policy IDs. The token includes these lists only when the request specifies a customer-defined attestation policy or one is associated with the API key. The lists aren't included when TA evaluates only the default policy. The TA team recommends defining one or more appraisal policies to validate specific claims in the quote.

## Sample Intel SGX attestation policy

This sample policy sets `false` as the default value and changes it to `true` only if all rules match.

```rego
default matches_sgx_policy = false
matches_sgx_policy = true {
   input.sgx_mrenclave == "83f4e819861adef6ffb2a4865efea9337b91ed30fa33491b17f0d5d9e8204410"
   input.sgx_mrsigner == "83d719e77deaca1470f6baf62a4d774303c899db69020f9c70ee1dfc08c7ce9e"
   input.sgx_isvprodid == 3
   input.sgx_isvsvn == 2
   input.sgx_is_debuggable == false
}
```

## Create an Intel SGX policy

This example uses an Intel SGX attestation policy, but the authoring process is the same for all policies supported by TA.

Before beginning these instructions, have access to the hash for the **mrenclave** measurement and the hash for the signing key.

1. Create a new file.

1. Add the default pre-evaluation value.

   ```rego
   default matches_sgx_policy = false
   ```

1. Add the conditions (rules) to be met to change the value to **true**.

   ```rego
   default matches_sgx_policy = false
   matches_sgx_policy = true {
      input.sgx_mrenclave == "83f4e819861adef6ffb2a4865efea9337b91ed30fa33491b17f0d5d9e8204410"
      input.sgx_mrsigner == "83d719e77deaca1470f6baf62a4d774303c899db69020f9c70ee1dfc08c7ce9e"
      input.sgx_isvprodid == 3
      input.sgx_isvsvn == 2
      input.sgx_is_debuggable == false
   }
   ```

1. Save the file.

## Sample Azure* confidential VM policy with Intel® TDX and vTPM attestation

:::note
This feature is in pre-release status. For preview access, please contact your Intel sales representative. Details of implementation and usage may change before general availability.
:::

This sample policy verifies that an Azure* confidential VM with Intel® TDX is authenticated and uses an Azure* hypervisor and VM image. The `match` keyword and variable let you specify which rules must match for the entire policy to match. This sample uses a `match` rule that references other rules in the policy. The Intel® TDX **mrseam** and **mrtd** measurements check the integrity and authenticity of the trust domain and image. The PCR 0 measurement verifies the integrity of the virtual UEFI firmware.

This policy imports the `rego.v1` package. The `if` keyword is required before a rule block. The `rego.v1` package enables future keywords and related features.

### Verify the integrity of an Azure* confidential VM with vTPM and Intel® TDX

:::note
Many system components extend TPM PCR measurements. With vTPM, the policy verifies the integrity and authenticity of the hypervisor and image. When an Azure* confidential VM runs updates, PCR values change at boot time, except for runtime PCR extensions such as IMA. The changed PCR values are updated at boot.
:::

This sample policy sets `false` as the default value and changes it to `true` only if all rules match.

```rego
import rego.v1

default match := false

match if {
    is_azure_tdx_cvm
    is_azure_tdx_platform
}

is_azure_tdx_cvm if {
    input.tdx.tdx_mrseam == "360304d34a16aace0a18e09ad2d07d2b9fd3c17..."
    input.tdx.tdx_mrtd == "0cc279c02d62414498ef4455822f2aea53351c8dc..."
}

is_azure_tdx_platform if {
    pcr := input.tpm.pcrs[_]
    pcr.alg == "SHA-256"
    pcr.index == 0
    pcr.digest == "f70272c29c9fd4b76eab8441a768..."
}
```

## Create an Azure* confidential VM policy with Intel® TDX and vTPM

This example uses an Intel® TDX and vTPM attestation policy, but the authoring process is the same for all policies supported by TA.

Before beginning these instructions, have access to the hash for the **mrseam** and **mrtd** measurements and the hash for PCR digest.

1. Create a new file.

1. Import `rego.v1` at the top of your policy.

   ```rego
   import rego.v1
   ```

1. Add the default pre-evaluation value for verification of an Azure* confidential virtual machine with Intel TDX.

   ```rego
   default match := false
   ```

1. Add the conditions (rules) to be met to change the value to **true**.

   ```rego
   match if {
    is_azure_tdx_cvm
    is_azure_tdx_platform
   }

   is_azure_tdx_cvm if {
    input.tdx.tdx_mrseam == "360304d34a16aace0a18e09ad2d07d2b9fd3c17..."
    input.tdx.tdx_mrtd == "0cc279c02d62414498ef4455822f2aea53351c8dc..."
   }

   is_azure_tdx_platform if {
    pcr := input.tpm.pcrs[_]
    pcr.alg == "SHA-256"
    pcr.index == 0
    pcr.digest == "f70272c29c9fd4b76eab8441a768..."
   }
   ```

1. Save the file.

## Next steps

- Optionally, sign the policy with the Policy Signing Tool to help ensure its integrity.
- Upload the new policy through the web portal, REST API, or command-line tool.
- Learn more about policies.
