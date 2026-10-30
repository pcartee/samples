---
title: Author a custom policy
description: Learn how to author Trust Authority (TA) attestation policies in Rego, including policy requirements, obtaining expected claim values, and sample Intel SGX and Azure confidential VM policies using Intel TDX and vTPM.
author: pcartee
topic: how to
date: 07/17/2024
uid: author.custom.policy
sidebar_position: 3
---

:::important
This article describes version 1 (V1) of the attestation policy supported by TA. Version 2 (V2) is also available. We strongly encourage you to transition your V1 policies to V2. TA continues to support V1 for now, but will eventually phase it out. For more information about transitioning to V2, see Attestation policy V2.
:::

This article explains how to create policies for TA. TA uses [Open Policy Agent (OPA)](https://www.openpolicyagent.org/docs/latest/) to decouple policy evaluation logic from policy enforcement. Policies are written in the [Rego policy language](https://www.openpolicyagent.org/docs/latest/policy-language/).

TA always issues a token, even when a policy fails. The exception is the built-in default policy, which evaluates the integrity of the Intel® Software Guard Extensions (Intel® SGX) quoting enclave and trusted computing base (TCB). If the built-in policy fails, TA returns an error and does not issue a token.

The issued token categorizes policies as matched or unmatched.

## Allowed built-in functions and operators

You can use the following built-in functions and operators in your policy:

- `time.now_ns()`
- `time.parse_rfc3339_ns(value)`
- `time.add_date(ns, years, months, days)`
- `object.subset(super, sub)`
- `count(collection)`
- `&` (and)
- `==` (comparison; is equal)
- `=` (unification; make equal)
- `>`
- `>=`
- `<`
- `<=`
- `:=`

For more information, see Policy language functions.

## Minimum policy requirements

Every policy must include an output variable:

- Appraisal policies produce a logical true or false output. They use the equality operator (`=`) to set the `matches_policy` output. Appraisal policies perform comparison operations.
- Token customization policies produce a set of name-value claims. They use the assignment operator (`:=`) to set the `token_fields` output variable and define the custom claims and their values.

Every policy must have at least one rule that evaluates to the correct output type. As a best practice, initialize the output variable for each appraisal policy to `false`.

## Attestation policies

Attestation policies define the requirements that the appraiser (TA) compares with the evidence provided by an attester. When a token request specifies user-defined attestation policies, the resulting token contains arrays of matched and unmatched policy IDs. These arrays indicate which policies' requirements the evidence satisfied.

### Obtaining policy values

Attestation policies require expected claim values. For example, a policy might require the `sgx.mrenclave` claim to match the value `83f4e819861adef6ffb2a4865efea9337b91ed30fa33491b17f0d5d9e8204410`. How you initially obtain an expected value depends on the claims being evaluated and the technology being attested.

The easiest method is to use the TA client to request an attestation for a known-good example of the application you want to protect. Examine the claims in the resulting token to see the supported claim values, then use the relevant values to author a policy that meets your application's trust requirements. For most attestation technologies, use the Attestation Client CLI's `token` command. For example, to request attestation of a VM protected by Intel TDX, run `ta-cli token --config config.json`.

Alternatively, some technologies produce claim values as build outputs, or the software owner defines them. For example, with Intel SGX, the `sgx.mrenclave` value is a hash of the SGX enclave (a code library) and can be output as part of the build process. The `sgx_isvsvn` value is an integer defined by the software developer that indicates the enclave's security version level.

Some claim values are defined or known only to the infrastructure owner. Service providers might publish these values.

See the vendor documentation for the supported attestation technology to learn how to obtain attestation policy values.

## Default policies

TA always applies a default policy, even when other policies are associated with the API key or specified in an array in the token request. The default policy validates the enclave's trusted computing base (TCB) against the latest firmware and authenticated code modules. This provides assurance that the quoting enclave is genuine and up to date.

When a customer-defined policy is assigned to an API key or specified in an array in the token request, the attestation token includes lists of matched and unmatched policy IDs. The token includes these lists only if a customer-defined attestation policy is specified in the token request or associated with the API key. The lists are not included when TA evaluates only the default policy. The TA team recommends defining one or more appraisal policies to validate specific claims in the quote.

## Sample Intel SGX attestation policy

This sample policy sets `false` as the default value and changes it to `true` only if all the rules match.

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

This section uses an Intel SGX attestation policy as an example. The authoring process is the same for all policies supported by TA.

Before beginning these instructions, have access to the hash for the **mrenclave** measurement and the hash for the signing key.

1. Create a new file.

2. Add the default value before evaluation:

   ```rego
   default matches_sgx_policy = false
   ```

3. Add the conditions (rules) that must be met to change the value to `true`:

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

4. Save the file.

## Sample Azure* confidential VM policy with Intel® TDX and vTPM attestation

:::note
This feature is in pre-release status. For preview access, please contact your Intel sales representative. Details of implementation and usage may change before general availability.
:::

This sample policy verifies the integrity and authenticity of an Azure* confidential VM that uses Intel TDX, the Azure* hypervisor, and a VM image. The `match` variable determines whether the policy's required rules pass. In this sample, the `match` rule references other rules in the policy. The Intel TDX `mrseam` and `mrtd` measurements check the integrity and authenticity of the trust domain and image. The PCR 0 measurement verifies the integrity of the virtual UEFI firmware.

This policy imports the `rego.v1` package, which is required before defining a rule block. The package provides future keywords and related features.

### Verify the integrity of an Azure* confidential VM with vTPM and Intel® TDX

:::note
Many system components extend TPM PCR measurements. With vTPM, the policy verifies the integrity and authenticity of the hypervisor and image. When an Azure* confidential VM runs updates, PCR values change at boot time, except for runtime PCR extensions such as IMA. The changed PCRs are updated on boot.
:::

This sample policy sets `false` as the default value and changes it to `true` only if all the rules match.

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

## Create an Azure* confidential VM policy with Intel TDX and vTPM

This section uses an Intel TDX with vTPM attestation policy as an example. The authoring process is the same for all policies supported by TA.

Before you begin, have the hashes for the `mrseam` and `mrtd` measurements and the hash for the PCR digest.

1. Create a new file.

2. Import `rego.v1` at the top of your policy:

   ```rego
   import rego.v1
   ```

3. Add the default value for verifying an Azure* confidential VM with Intel TDX:

   ```rego
   default match := false
   ```

4. Add the conditions (rules) that must be met to change the value to `true`:

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

5. Save the file.

## Next steps

- Optionally, sign the policy using the Policy Signing Tool to ensure policy integrity.
- Upload the new policy using the web portal, REST API, or command line tool.
- Learn more about policies.
