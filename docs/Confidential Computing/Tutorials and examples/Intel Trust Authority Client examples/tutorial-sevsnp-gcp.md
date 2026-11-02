---
title: TA Client Tutorial for Google Cloud Platform with AMD SEV-SNP
description: Create a Google Cloud confidential VM with AMD SEV-SNP, authenticate with GitHub CLI, build the Trust Authority Go client, and request an attestation token.
author: pcartee
topic-type: tutorial
date: "2024-12-19"
uid: tutorial.sevsnp.gcp
---

This tutorial shows you how to deploy a demo application that uses the Trust Authority (TA) client with AMD SEV-SNP on Google Cloud Platform**\*** (GCP).

The demo application uses the TA client to retrieve platform evidence and request an attestation from TA. It demonstrates a simple passport attestation model that stops before involving a relying party. The application outputs the resulting attestation token. Use the demo as a workflow reference for your applications.

## Create a CVM with AMD SEV-SNP on GCP

To create a confidential VM (CVM) with AMD SEV-SNP on GCP, sign in to GCP and create the VM in Cloud Shell. When you create an instance in the GCP web UI, AMD CVMs default to SEV instead of SEV-SNP. These instructions use Cloud Shell to create an AMD SEV-SNP CVM.

Create a GCP CVM that supports AMD SEV-SNP with the following attributes:

- **Virtual machine name**: Enter a name for your virtual machine.
- **Machine type**: **n2d-standard-2**
- **Minimum CPU platform**: **AMD Milan**
- **Zone**: **us-central1-a**
- **Confidential compute type**: **SEV_SNP**
- **Maintenance policy**: **TERMINATE**
- **Image family**: **ubuntu-2204-lts**
- **Image project**: **ubuntu-os-cloud**

:::note
The availability of CVM images in specific regions and zones can change. This tutorial uses `us-central1-a` as an example. If you are outside North America, you might need to select a different region and zone. Check Google Cloud's [Regions and zones](https://cloud.google.com/compute/docs/regions-zones) page to find regions and zones that support confidential VMs with AMD SEV-SNP.
:::

To get a list of compute images for AMD SEV-SNP, use the following command in Google Cloud Shell.

```bash
gcloud compute images list --filter="guestOsFeatures[].type:SEV_SNP_CAPABLE"
```

Use these steps to create a GCP CVM in Cloud Shell.

1. Sign in to the [Google Cloud console](https://console.cloud.google.com/).

1. Select **Create a VM**.

1. Open Cloud Shell by selecting the terminal icon in the upper-right corner. The Cloud Shell terminal opens.

1. Create the CVM in Cloud Shell.

   The following command creates a CVM that uses Ubuntu* 22.04 LTS with AMD SEV-SNP.

   ```bash
   gcloud compute instances create sev-snp-vm \
     --machine-type=n2d-standard-2 \
     --min-cpu-platform="AMD Milan" \
     --zone=us-central1-a \
     --confidential-compute-type=SEV_SNP \
     --maintenance-policy=TERMINATE \
     --image-family=ubuntu-2204-lts \
     --image-project=ubuntu-os-cloud
   ```

After the CVM is created, confirm that the output includes details such as the name, zone, machine type, IP addresses, and status.

## Connect to the CVM over SSH

After the CVM is created, exit Cloud Shell and connect to the CVM over SSH in your browser.

1. Select the drop-down arrow for **SSH** in the **Connect** section for your CVM.

1. Select **Open in browser window**.

   An **SSH in browser** window appears, along with another window that contains an **Authorize** button.

1. Select **Authorize**. After authorization, a browser terminal connects to your CVM over SSH.

## Verify AMD SEV-SNP and install prerequisites

To verify that AMD SEV-SNP is enabled on the CVM, run the following command. The output should include `Memory Encryption Features active: SEV-SNP`. If it does not, check that the VM parameters are correct.

```bash
sudo dmesg | grep -i sev-snp
```

Install the following dependencies for the initial setup:

- Git
- Go 1.22 or later
- make
- gcc
- GitHub CLI (`gh`)

Install the system packages:

```bash
sudo apt-get update
sudo apt-get install -y git make gcc gh
```

Install Go 1.23.1:

```bash
wget https://go.dev/dl/go1.23.1.linux-amd64.tar.gz
sudo tar -xvf go1.23.1.linux-amd64.tar.gz -C /usr/local
export PATH=$PATH:/usr/local/go/bin
```

Verify the Go installation:

```bash
go version
```

## Use GitHub CLI to connect to GitHub

Use GitHub CLI to check its version, sign in, and verify your authentication status.

Check the version:

```bash
gh --version
```

1. Sign in with GitHub CLI:

   ```bash
   gh auth login
   ```

   Follow the prompts. Select GitHub.com or GitHub Enterprise Server.

1. Select your account.

   ```text
   What account do you want to log in to?
   GitHub.com or GitHub Enterprise Server
   ```

1. Select HTTPS or SSH.

   ```text
   What is your preferred protocol for Git operations? HTTPS or SSH
   ```

1. When prompted to authenticate Git with your GitHub credentials, press **Enter** for yes or type **n** for no, and then press **Enter**.

   ```text
   HTTPS > Authenticate Git with your GitHub credentials (Y/n)
   ```

1. Choose whether to authenticate with a web browser or an authentication token.

   ```text
   How would you like to authenticate GitHub CLI?
   Login with a web browser or Paste an authentication token?
   ```

1. Select the web browser option, and then press **Enter**. A one-time code appears.

1. Copy the one-time code. A prompt appears to open the browser.

   ```text
   Press Enter to open github.com in your browser...
   ```

1. Press **Enter**. If the browser does not open, go to the [GitHub device activation page](https://github.com/login/device) to authorize your `gh` sign-in. The page displays **Device Activation**.

    1. Select **Continue**.
    1. Enter the one-time code. The **Authorize CLI** screen appears.
    1. Select **Authorize GitHub**. The **Confirm access** screen appears.
    1. Enter your password.
    1. Select **Confirm**. A confirmation message indicates that your device is connected.
    1. Return to the SSH connection window. The terminal indicates that authentication is complete.

1. Press **Enter** to continue. Information displays that you are logged in.

1. Check your GitHub CLI authentication status. The output confirms that you are signed in to GitHub.com.

   ```bash
   gh auth status
   ```

## Install the TA Client for Go

The TA CLI provides a command-line wrapper for the Go client libraries. Follow these steps to download and build it.

:::note
The preview branch is being checked out for the GCP AMD SEV-SNP feature, because this feature is not supported on the main branch of the client CLI.
:::

1. Clone the client repository, check out the preview branch, and build the CLI.

   ```bash
   git clone --branch sevsnp-preview https://github.com/company/application-client
   cd application-client/sevsnp-cli
   make cli
   ```

   Configure your attestation API key and endpoint. You can also configure a policy to evaluate.

1. Before using the `token` and `verify` commands, configure the required properties in `config.json`:

   ```bash
   cat <<EOF > config.json
   {
     "application_api_url": "https://[redacted]",
     "application_api_key": "<attestation API key>"
   }
   EOF
   ```

:::note
If you are in the European Union (EU), use the following Company Name API URL:

`"application_api_url": "https://[redacted]"`
:::

1. Run the sample application. The `application-sevsnp-cli` utility's `token` command automatically collects SEV-SNP evidence and requests an attestation token from TA. For usage details, see the [TA Client CLI documentation](https://docs.application.company.com/main/articles/integrate-go-client.html).

   ```bash
   sudo ./application-sevsnp-cli token --config config.json
   ```

**\*** Other names and brands may be claimed as the property of others.
