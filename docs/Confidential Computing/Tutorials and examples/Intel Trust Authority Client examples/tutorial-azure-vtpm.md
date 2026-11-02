---
title: TA Tutorial for Azure with vTPM and Intel TDX
description: Learn how to create an Azure confidential VM with Intel TDX and a vTPM, configure the Attestation Client CLI, and generate composite attestation evidence and tokens.
author: pcartee
topic: tutorial
date: "2024-10-16"
uid: tutorial.tpm.azure
---

This tutorial shows you how to use the Attestation Client CLI to attest
evidence from a virtual Trusted Platform Module (vTPM) on Microsoft
Azure. You need the [latest version of the client CLI with vTPM
support](https://github.com/intel/application-client-for-go/tree/main/tdx-cli)
to attest the vTPM. The CLI collects vTPM evidence and sends it to the
attestation service verifier. The verifier validates the evidence and
returns a JSON Web Token (JWT) containing vTPM claims. If attestation
succeeds, the CLI prints the token.

Microsoft Azure's implementation of vTPM uses Intel® Trust Domain Extensions (Intel® TDX) to ensure the integrity and authenticity of the "paravisor" (where the vTPM resides) and the VM image. The vTPM public attestation key (AK), which is used to verify the TPM quote signature, is included in the `user-data` in the Intel TDX quote. This ties the vTPM identity to the trust domain.

This tutorial has three main sections:

1. Create an Azure confidential VM (CVM) with Intel TDX, verify that Intel TDX and the vTPM are enabled, and configure access to the vTPM.
1. Install and configure the Attestation Client CLI.
1. Attest the Intel TDX trust domain and vTPM.

## Prerequisites

- An Azure account with permissions to create a confidential VM and deploy a Bastion host.
- A subscription to the attestation service with access to the pilot environment.

## Create a VM with Intel TDX on Microsoft Azure

In this section, create an Azure CVM with Intel TDX and a vTPM.

:::note
The availability of Azure confidential VM images and sizes with Intel TDX in specific regions and availability zones can change. This tutorial uses West US 2 and Availability Zone 1 as an example. If you are outside North America, you might need to select a different region and availability zone. Check the Azure [Products by Region](https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/?products=virtual-machines) page to find regions and availability zones that support confidential VMs with Intel TDX.
:::

To create an Azure confidential VM with Intel TDX, perform the following steps.

1. Sign in to the Azure portal.

1. Select **Create a resource**.

1. Select **Virtual machine**, and then select **Create**.

1. On the **Basics** tab, under **Project Details**, select an existing **Resource group** or create one. We recommend creating a new resource group for this tutorial. When you finish, you can delete the resource group to remove all the resources in one step. To create a resource group, select **Create new** under the **Resource group** box, and then enter a name.

1. In the **Instance details** section, complete the following fields:

    - **Virtual machine name**: Enter a name for your virtual machine.
    - **Region**: Select **(US) West US 2**.
    - **Availability options**: Select **Availability zone**.
    - **Availability zone**: Select **Zone 1**.
    - **Security type**: Select **Trusted launch virtual machine**.
    - **Image**: Select **Ubuntu Server 22.04 LTS (Confidential VM) - x64 Gen2**.
    - **Size**: Select **DC1s_v3**. If it is not listed, select **See all sizes** and then select **DC1s_v3**. The smallest size with one vCPU is sufficient for this tutorial.
    - **Public inbound ports**: Select **None**.

1. In the **Administrator account** section:

    - **Authentication type**: Select **SSH public key** (recommended), or use a password.
    - **Username**: Enter a username for the VM.
    - **SSH public key**: Select **Generate new key pair**.
    - Keep the default SSH key type and key pair name.

1. In the **Inbound port rules** section, select **None**.

1. Select the **Networking** tab. For **Public IP**, select **None**.

1. At this point, you can skip the remaining sections and go directly to **Review + create**.

1. Review the options, and then select **Create**.

1. When the **Generate new key pair** screen appears, select **Download private key and create resource**. Deployment usually takes a few minutes.

1. When deployment is complete, select **Go to resource** to view the VM. The virtual machine overview page appears.

1. In the left menu, select **Connect**, and then select **Bastion**.

1. Select **Deploy Bastion**. Bastion deployment takes a few minutes.

1. When deployment is complete, select **Connect**, and then select **Go to Bastion**.

    1. Set **Authentication Type** to **SSH Private Key from Local File**.
    1. For **Username**, enter the username you specified when creating the VM.
    1. Select the private key file that you downloaded when creating the VM.
    1. Select **Connect**. A new browser tab opens with a connection to the VM terminal.

After you connect, confirm that the VM has Intel TDX and a vTPM. Then add your user account to the `tss` group to provide the required TPM permissions.

1. Verify that TDX is enabled. This step and the next step should display the character-device attributes for `tpmrm0` and `tpm0`. If either device is missing, check that the VM image and size (Standard DC1s_v3) are correct.

    ```bash
    ls -l /dev/tpmrm0
    ```

1. Verify the vTPM is enabled.

    ```bash
    ls -l /dev/tpm0
    ```

1. Add your user account to the `tss` group to provide the required TPM permissions.

    ```bash
    sudo usermod -aG tss "$USER"
    ```

1. Exit, and then reconnect through Bastion.

The CVM setup is complete. Continue to install the Attestation Client CLI.

## Install and configure the Attestation Client CLI

Connect to the Azure CVM through Bastion, and then follow these steps to
install and configure the Attestation Client CLI.

1. Go 1.22 or later is required to run the Attestation Client CLI. The following commands install Go on Ubuntu 22.04 LTS.

    ```bash
    wget https://go.dev/dl/go1.23.1.linux-amd64.tar.gz
    sudo tar -xvf go1.23.1.linux-amd64.tar.gz -C /usr/local
    export PATH=$PATH:/usr/local/go/bin
    ```

    Verify that Go is installed by running `go version`. The output should be similar to `go version go1.23.1 linux/amd64`.

1. Install the Attestation Client CLI. This script installs the CLI and its dependencies. You might need to restart one or more services.

    ```bash
    curl -sL https://github.com/intel/application-client-for-go/blob/main/release/install-tdx-cli-azure.sh | sudo bash -
    ```

    Verify the Attestation Client CLI is installed correctly by running `trustauthority-cli version`.

1. Before you use the `token` and `verify` commands, configure the required properties in `tpm-cli.json`:

    ```bash
    cat << EOF | tee ./tpm-cli.json
    {
      "cloud_provider": "azure",
      "application_url": "https://[redacted]",
      "application_api_url": "https://[redacted]",
      "application_api_key": "<application attestation API key>",
      "tpm": {
        "owner_auth": "",
        "ak_handle": "81000003"
      }
    }
    EOF
    ```

    `owner_auth` is the TPM owner password, and `ak_handle` is the TPM attestation key handle. For Azure confidential VMs, `owner_auth` is an empty string and `ak_handle` is set to `81000003`, the location of the Azure-provisioned AK in the vTPM.

| Setting | Description |
| --- | --- |
| `application_api_key` | Your attestation service API key. Use it to authenticate requests to the service API. |
| `application_api_url` | The base URL for the attestation service API. If you're in the European Union (EU), use the EU URL below. |
| `application_url` | The base URL for the attestation service portal. If you're in the EU, use the EU URL below. |
| `tpm.owner_auth` | The TPM owner password, which establishes authority for some TPM commands. For Azure confidential VMs, this value is empty. |
| `tpm.ak_handle` | The TPM attestation key (AK) handle to use when generating a TPM quote. For Microsoft Azure confidential VMs with Intel TDX, this handle is always `81000003`. |

If you're in the European Union (EU), use the following attestation
service URLs:

- Base URL: `https://[redacted]`
- API URL: `https://[redacted]`

For other regions, use the URLs shown in the configuration example.

## Demonstrate attestation of the Intel TDX trust domain and vTPM

This section shows you how to attest your confidential virtual machine
(CVM) with the Attestation Client CLI.

1. Display composite evidence for Intel TDX and vTPM. This command
   displays the evidence that the CLI would send to the attestation
   service verifier.

    ```bash
    trustauthority-cli evidence --tdx --tpm -c ~/tpm-cli.json
    ```

    ```text
    [DEBUG] GET https://[redacted]/appraisal/v1/nonce
    INFO[0001] Successfully wrote 64 bytes at NV index 1400002
    INFO[0001] Sleeping for 3 seconds to allow Azure to read the runtime data
    {
      "tdx": {
        "runtime_data": "eyJrZX...J9",
        "quote": "BA...AA=",
        "verifier_nonce": {
          "val": "dk...Q==",
          "iat": "M...EM=",
          "signature": "Im...g"
        }
      },
      "tpm": {
        "quote": "/1...DA==",
        "signature": "AB...AA",
        "pcrs": "h/...AA",
        "verifier_nonce": {
          "val": "dk...PQ==",
          "iat": "Mj...EM=",
          "signature": "Im...Ag"
        }
      }
    }
    ```

1. Generate a composite Intel TDX and TPM attestation token. This
   command collects evidence from Intel TDX and the TPM and sends it to
   the attestation service verifier. The output is an attestation token
   containing claims for both Intel TDX and the TPM.

    ```bash
    trustauthority-cli token --tdx --tpm -c ./tpm-cli.json
    ```

You can try the other `trustauthority-cli` commands. To see them, run `trustauthority-cli --help`. When you finish, delete the resource group to remove the resources you created for this tutorial.

## Conclusion

This tutorial showed how to create an Azure confidential VM with Intel
TDX and a vTPM, install and configure the Attestation Client CLI, and
attest the Intel TDX trust domain and vTPM. This is composite
attestation: attesting a trusted execution environment (TEE) and vTPM
in a single token.

For more information, see the Attestation Client CLI documentation.
