---
title: Install infrastructure prerequisites for a bare-metal deployment
description: "Guide to preparing an Ubuntu 22.04 bare-metal host for a local Kubernetes application that uses hardware-based trusted execution. Covers hardware and EPC memory requirements, package installation, trusted execution configuration and verification, provisioning certificate caching, host registration, and device permissions."
author: pcartee
topic: Bare-metal infrastructure prerequisites
date: "2024-12-05"
uid: pkg.deploy.infra
---

These instructions explain how to prepare and configure bare-metal servers for a local application that uses hardware-based trusted execution.

## Hardware and operating system requirements

The application requires Software Guard Extensions (SGX) for trusted execution.

You can deploy the application on one server. For production environments, use at least three Kubernetes worker nodes to improve reliability and availability.

See the list of supported [SGX-capable CPUs](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions-processors.html).

Use Ubuntu 22.04 LTS with Linux kernel 5.15.0 or later.

Recommended hardware:

* 128 GB of Enclave Page Cache (EPC) memory (64 GB minimum).
* 250 GB of storage (150 GB minimum). For proof-of-concept (POC) environments, local block storage is sufficient.

:::note
Each CPU has a maximum supported EPC capacity. Total EPC memory can be up to 50% of system RAM. For example, a dual-socket system with 256 GB of RAM may provide 128 GB of EPC if each CPU supports at least 64 GB. For more information, see the [SGX developer guide](https://download.01.org/intel-sgx/latest/linux-latest/docs/Intel_SGX_Developer_Guide.pdf).
:::

## Install prerequisite software

Install the prerequisites on each infrastructure server. These instructions assume a single-server deployment and that you run commands locally. Steps that apply once per cluster are identified.

```bash
sudo apt update && sudo apt-get upgrade -y && sudo apt install ca-certificates curl unzip wget msr-tools jq -y
```

Restart the server.

Install Node.js version 18.

```bash
curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
```

## Configure SGX

### Set up the SGX repository

Follow the [SGX software installation guide](https://download.01.org/intel-sgx/latest/dcap-latest/linux/docs/Intel_SGX_SW_Installation_Guide_for_Linux.pdf). The following commands provide an overview.

```bash
sudo mkdir -p /opt/intel
wget https://download.01.org/intel-sgx/sgx-dcap/1.21/linux/distro/ubuntu22.04-server/sgx_debian_local_repo.tgz -O /tmp/sgx_debian_local_repo.tgz
sudo tar -xvzf /tmp/sgx_debian_local_repo.tgz -C /opt/intel
echo 'deb [trusted=yes arch=amd64] file:///opt/intel/sgx_debian_local_repo jammy main' | sudo tee /etc/apt/sources.list.d/sgx-repo.list
sudo apt update
sudo chown -Rv _apt:root /opt/intel
sudo chmod -Rv 755 /opt/intel
```

### Install packages for the provisioning certificate caching service

Install the following dependencies for the Provisioning Certificate Caching Service (PCCS), then hold the Node.js package version.

```bash
sudo apt install -y age build-essential ocaml automake autoconf libtool python-is-python3 libssl-dev cracklib-runtime sgx-pck-id-retrieval-tool nodejs=18.19.1-1nodesource1
sudo apt-mark hold nodejs
```

### Enable SGX and increase EPC

Open the server's UEFI settings, enable SGX, and set the EPC size to at least 64 GB.

### Verify that SGX is enabled

Use `rdmsr`, included in `msr-tools`, to read the CPU model-specific registers (MSRs) and verify that SGX, Flexible Launch Control (FLC), and Delayed Authentication Mode (DAM) are configured correctly.

```bash
sudo rdmsr 0x3a -f 17:17
# Confirm that both /dev/sgx_enclave and /dev/sgx_provision are present.
ls -al /dev/sgx*
```

SGX should be enabled; the output should be `1`.

```bash
sudo rdmsr 0x3a -f 18:18
```

FLC should be enabled; the output should be `1`.

```bash
sudo rdmsr -x 0x503
```
DAM should be disabled; the output should be `0`.

### Install and configure the provisioning certificate caching service

PCCS facilitates enclave provisioning without requiring enclaves to connect directly to the internet. For more information, see the [PCCS design guide](https://download.01.org/intel-sgx/sgx-dcap/1.10/linux/docs/SGX_DCAP_Caching_Service_Design_Guide.pdf).

Install PCCS once per cluster. It can run on a remote server if the application hosts can connect to it over the network. These instructions assume a single-server deployment with PCCS installed locally.

```bash
sudo apt-get install -y sgx-dcap-pccs
```
Follow the prompts to configure PCCS, select ports and connection scope, provide the provisioning service API key, choose a cache fill method, and set passwords.

:::warning
If you are upgrading, back up the existing cache database before continuing. The installer updates the database automatically. For DCAP 1.8 and earlier, the database cannot be upgraded; delete it manually before installing the new version.
:::

If you do not provide the provisioning service API key during installation, add a primary or secondary key to `/opt/intel/sgx-dcap-pccs/config/default.json`.

:::warning
Treat the API key and PCCS passwords as secrets. Do not include real credentials in documentation or commit them to source control.
:::

```text
Do you want to configure PCCS now? (Y/N) :Y
Set HTTPS listening port [8081] (1024-65535) :
Set the PCCS service to accept local connections only? [Y] (Y/N) :
Set your provisioning service API key (Press ENTER to skip) :
You didn't set the provisioning service API key. You can set it later in config/default.json.
Choose caching fill method : [LAZY] (LAZY/OFFLINE/REQ) :
Set PCCS server administrator password:
Re-enter administrator password:
Set PCCS server user password:
Re-enter user password:
Do you want to generate a self-signed HTTPS key and certificate for PCCS? [Y] (Y/N) :
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
```

The certificate request also prompts for a distinguished name (DN), including personal and organization information. Enter appropriate values or leave fields blank.

```text
Country Name (2 letter code) [AU]:COUNTRY
State or Province Name (full name) [Some-State]:STATE
Locality Name (eg, city) []:CITY
Organization Name (eg, company) [Internet Widgits Pty Ltd]:ThisOrg
Organizational Unit Name (eg, section) []:ThisUnit
Common Name (e.g. server FQDN or YOUR name) []: YourName
Email Address []:you@email.org
```

Respond to the applicable prompts for additional certificate request attributes.

```text
Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

The PCCS installation creates a symbolic link to `/usr/lib/systemd/system/pccs.service`. Start the service:

```bash
sudo systemctl start pccs
```

The service may already be running. Check its status:

```bash
sudo systemctl status pccs.service
```

The service should be loaded, enabled, and active (running).

### Register SGX hosts

If the SGX hosts are not already registered, complete these steps on each server. PCCS and the local package repository should already be configured.

1. If `intel-sgx-keyring.asc` exists, remove it.

   ```bash
   sudo rm -f /etc/apt/keyrings/intel-sgx-keyring.asc
   ```

1. Install the PCK ID retrieval tool.

   ```bash
   sudo apt install -y sgx-pck-id-retrieval-tool
   ```

1. Run the PCK ID retrieval tool to register the SGX host.

   ```bash
   PCKIDRetrievalTool -url https://<PCCS-host>:8081 -user_token <PCCS-user-token> -use_secure_cert false -proxy_type direct
   ```

On success, the console displays `the data has been sent to cache server successfully!`.

### Update SGX device permissions

Set the owner of `/dev/sgx_enclave` to user ID 1000 so that the application containers can access the host's enclave interface.

```bash
sudo chown 1000:1000 /dev/sgx_enclave
```