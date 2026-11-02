---
title: TA Client Tutorial for Google Cloud Platform with TDX
description: Create a Google Cloud confidential VM with Intel TDX, install and configure the Trust Authority Attestation Client CLI, and request a TDX attestation token.
author: pcartee
topic-type: tutorial
date: "2024-12-19"
uid: tdx.gcp
---

## TA Client Tutorial: TDX Attestation on GCP

This tutorial shows you how to deploy a demo application that uses the Trust Authority (TA) client with Intel® Trust Domain Extensions (Intel® TDX) on Google Cloud Platform**\*** (GCP).

The demo application uses the TA client to retrieve platform evidence and request attestation from TA. It demonstrates a simple passport attestation model that stops before involving a relying party. The application outputs the resulting attestation token. Use the demo as a workflow reference for your applications.

## Create a CVM with TDX on GCP

Create a confidential VM (CVM) that supports TDX on GCP with the following attributes:

- **Virtual machine name**: Enter a name for your virtual machine.
- **Machine type**: **c3-standard-4**
- **Zone**: **us-central1-a**
- **Confidential compute type**: **TDX**
- **Maintenance policy**: **TERMINATE**
- **Image family**: **ubuntu-2204-lts**
- **Image project**: **ubuntu-os-cloud**

:::note
The availability of confidential VM images and sizes with TDX in specific regions and zones can change. This tutorial uses `us-central1-a` as an example. If you are outside North America, you might need to select a different region and zone. Check Google Cloud's [Regions and zones](https://cloud.google.com/compute/docs/regions-zones) page to find regions and zones that support confidential VMs with TDX.
:::

To list compute images that support TDX, run the following command in Cloud Shell:

```bash
gcloud compute images list --filter="guestOsFeatures[].type:(TDX_CAPABLE)"
```

To create a GCP CVM with TDX, follow these steps.

1. Sign in to the [Google Cloud console](https://console.cloud.google.com/).

1. Select **Create a VM**.

1. Open Cloud Shell by selecting the terminal icon in the upper-right corner. The Cloud Shell terminal opens.

1. Create the CVM in Cloud Shell. The following command creates a CVM that uses Ubuntu* 22.04 LTS with TDX.

   ```bash
   gcloud compute instances create gcp-tdx-vm \
     --machine-type=c3-standard-4 \
     --zone=us-central1-a \
     --confidential-compute-type=TDX \
     --maintenance-policy=TERMINATE \
     --image-family=ubuntu-2204-lts \
     --image-project=ubuntu-os-cloud
   ```

After the CVM is created, confirm that the Cloud Shell output includes details such as the name, zone, machine type, IP addresses, and status. Refresh the browser to view the CVM in the **VM instances** list.

## Connect to the CVM over SSH

After the CVM is created, exit Cloud Shell and connect to it over SSH in your browser.

1. Select the drop-down arrow for **SSH** in the **Connect** section for your VM.

1. Select **Open in browser window**.

   An **SSH in browser** window appears, along with another window that contains an **Authorize** button.

1. Select **Authorize**.

After authorization, a browser terminal connects to your CVM over SSH.

## Verify TDX on the GCP CVM

Verify that TDX is active on the CVM by running the following command. The output should include `Memory Encryption Features active: TDX`. If it does not, check that the VM parameters are correct.

```bash
sudo dmesg | grep -i tdx
```

CVM setup is now complete. You can now proceed to install the TA Attestation Client CLI.

## Install and configure the Attestation Client CLI

The TA CLI provides a command-line wrapper for the Go client libraries. Follow these steps to install and configure the TA Attestation Client CLI.

1. Install Go 1.23.1 on Ubuntu 22.04 LTS:

    ```bash
    wget https://go.dev/dl/go1.23.1.linux-amd64.tar.gz
    sudo tar -xvf go1.23.1.linux-amd64.tar.gz -C /usr/local
    export PATH=$PATH:/usr/local/go/bin
    ```

1. Verify that Go is installed by running `go version`. The output should be similar to `go version go1.23.1 linux/amd64`.

1. Install the Attestation Client CLI. This script installs the CLI and its dependencies. You might need to restart one or more services.

   ```bash
   curl -sL https://raw.githubusercontent.com/[redacted]/install-tdx-cli.sh | sudo bash -
   ```

1. Verify that the Attestation Client CLI is installed by running `ta-cli version`.

1. Configure your API key and attestation endpoint. You can also configure a policy to evaluate.

1. Before you use the `token` and `verify` commands, configure the required properties in `config.json`:

   ```bash
   cat <<EOF > config.json
   {
     "trustauthority_api_url": "https://[redacted]",
     "trustauthority_api_key": "<attestation API key>"
   }
   EOF
   ```

:::note
If you are in the European Union (EU), use the following TA API URL:

`"trustauthority_api_url": "https://[redacted]"`
:::

## Demonstrate attestation of TDX on GCP

This section shows you how to attest your confidential virtual machine (CVM) with the TA Attestation Client CLI.

1. Display TDX evidence. This command displays the evidence that would be sent to the TA verifier for attestation.

   ```bash
   sudo ta-cli evidence --tdx -c config.json
   ```

   ```text
   [DEBUG] GET https://[redacted]/appraisal/v2/nonce
   {
     "tdx": {
       "runtime_data": null,
       "quote": "BA... AA=",
       "event_log": "W3...1d=",
       "verifier_nonce": {
         "val": "cV...Q==",
         "iat": "M...EM=",
         "signature": "vc...L"
       }
     }
   }
   ```

1. Generate a TDX attestation token. The `token` command automatically collects TDX evidence and sends it to TA for attestation. The output is an attestation token containing TDX claims.

   ```bash
   sudo ta-cli token -c config.json
   ```

You can try the other `ta-cli` commands. To see them, run `ta-cli --help`. When you finish, you can delete the VM to remove the resources you created for this tutorial.

For more information about TDX, see the TDX main page.

For more information, see the TA Attestation Client CLI documentation.

**\*** Other names and brands may be claimed as the property of others.
