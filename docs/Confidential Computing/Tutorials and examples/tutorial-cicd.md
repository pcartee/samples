---
title: CI/CD integration
description: Learn how to use GitHub Actions, tactl, and Gramine Shielded Containers to retrieve an Intel SGX mrenclave measurement and update an existing Trust Authority appraisal policy.
author: pcartee
topic-type: tutorial
date: "2023-08-01"
uid: tutorial.update.policies
---

This tutorial shows how to automate updates to an Intel SGX appraisal
policy in a GitHub Actions workflow. The workflow retrieves the
`mrenclave` measurement from a newly built application image and updates
an existing policy to match the application version being attested. The
example uses a Gramine Shielded Container, but you can adapt the
workflow to other SGX build pipelines.

## Update policies with GitHub Actions

When a TEE-protected application is part of a continuous delivery (CD)
workflow, you might need to update its appraisal policy as part of that
workflow. Some application attributes, such as the `mrenclave`
measurement, change with each build. If the policy contains values from
the previous version, its appraisal won't match the new evidence. The
following GitHub Actions example automates the policy update to keep the
policy current.

## Sample policy

This tutorial assumes that you're familiar with GitHub Actions.

:::note
This example assumes that you have an existing application that uses
Software Guard Extensions (SGX), the `mrenclave` measurement for the
enclave, and the ID of an uploaded appraisal policy. The unsigned sample
policy below evaluates several claims during attestation, including
`mrenclave`, `mrsigner`, and other SGX claims. This workflow updates only
the `mrenclave` value; it leaves the other claim values unchanged.
:::

```json
{
  "policy": "default matches_sgx_policy = false \n\n matches_sgx_policy = true { \n input.sgx_is_debuggable == false \n input.sgx_isvsvn == 0 \n input.sgx_isvprodid == 0 \n input.sgx_mrsigner == \"[redacted]\" \n \n input.sgx_mrenclave == \"[redacted]\" \n }",
  "user_id": "[redacted]",
  "policy_name": "Sample_Policy_SGX",
  "policy_type": "Appraisal policy",
  "service_offer_name": "SGX Attestation",
  "service_offer_id": "[redacted]"
}
```

## GitHub Actions workflow

The following steps show how to update the `mrenclave` value in an
existing policy. The example retrieves TEE information for an SGX
application in a Gramine Shielded Container (GSC) with the integrated TA
client. It uses the `gsc/gsc info-image` command from the [Gramine Docker
integration](https://github.com/gramineproject/gsc) to get the latest
`mrenclave` value from a newly built container image. The workflow then
updates the appraisal policy so TA can attest the GSC enclave with the
new value.

Although this example uses a GSC image, you can adapt the workflow for
images that don't use GSC.

1. Download the TA tenant management [CLI
   utility](../Command-line/cli-install.md). Replace
   `<tactl-download-URL>` with the download URL for the `tactl`
   executable.

   ```yaml
   name: Get TA tenant CLI
   run: wget <tactl-download-URL>
   ```

1. Retrieve the policy and temporarily save it to `policy.txt`. Set the
   GitHub Actions variable `vars.APPRAISAL_POLICY_ID` to the UUID of the
   appraisal policy to update. Set the secret
   `secrets.TENANT_ADMIN_API_KEY` to a TA Tenant Admin API key. Store the
   key as a secret because it has permissions beyond updating a policy.

   ```yaml
   name: Retrieve policy
   run: tactl list policy -a ${{ secrets.TENANT_ADMIN_API_KEY }} -p ${{ vars.APPRAISAL_POLICY_ID }} > policy.txt
   ```

1. Retrieve the updated `mrenclave` value from the GSC image.

   Make sure `repo` and `tag` are available as environment variables in
   this step. `${repo}` is the image path, including the registry URL
   (for example, `container-registry-sample.com/sample-imagename`).
   `${tag}` is the image tag.

   ```yaml
   name: Update mrenclave hash
   run: |
     info=($(gsc/gsc info-image "${repo}:${tag}"))
     if [ $? -ne 0 ]; then
       echo "Failed to collect gsc info from ${repo}:${tag}"
       exit 1
     fi

     mrenclave=$(echo "${info[2]}" | tr -d '"' | xxd -r -p | base64)
     echo "mrenclave=$mrenclave" >> "$GITHUB_ENV"
   ```

1. Replace the `mrenclave` value in the policy.

   GitHub Actions makes values written to `GITHUB_ENV` available to
   subsequent steps in the same job.

   ```yaml
   name: Replace mrenclave value
   run: sed -ri 's:mrenclave == "[a-zA-Z0-9]+":mrenclave == "'"$mrenclave"'":' policy.txt
   ```

1. Update the policy in TA. This command overwrites the existing policy
   content, including the updated `mrenclave` value.

   ```yaml
   name: Update policy in TA
   run: tactl update policy -a ${{ secrets.TENANT_ADMIN_API_KEY }} -i ${{ vars.APPRAISAL_POLICY_ID }} -f policy.txt
   ```
