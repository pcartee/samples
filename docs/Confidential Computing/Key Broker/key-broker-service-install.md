---
title: Key Broker service installation
description: Install and configure the Key Broker System (KBS) on Linux. Covers prerequisites, building the Docker image, creating host directories, configuring KBS and HashiCorp Vault or PyKMIP, optional proxy settings, and running the KBS container.
author: pcartee
topic: KBS
date: "2025-04-14"
uid: kbs.installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To install and configure the Key Broker System (KBS), complete these steps:

1. [Install and configure the Key Management System (KMS)](key-broker-service-kms-install.md)
1. Install and configure the KBS.
1. Create and retrieve KBS keys.
1. Manage KBS users.

## Prerequisites

- A TA account with access to the TA Download Center.
- HashiCorp Vault (Community Edition) or PyKMIP installed and running.
- Docker Engine installed.

## Install and configure the Key Management System (KMS)

KBS supports two KMS options: [HashiCorp Vault](key-broker-service-kms-install.md)
and [PyKMIP](key-broker-service-kms-install.md). Follow the installation
instructions for the KMS you use.

## Build and install the Key Broker System (KBS)

### Build the KBS

Run `make docker` to build the KBS Docker image
(`key-broker-service:v1.0.0`) from the Dockerfile.

### Install the KBS

On Linux, follow these steps to install the KBS:

1. Create directories.

   Create the following directories on the host machine.

   ```bash
   sudo mkdir -p /opt/kbs/users /etc/kbs/certs/tls /opt/kbs/keys /opt/kbs/keys-transfer-policy /etc/kbs/certs/signing-keys
   ```

   :::important
   Data in the KBS directories is not encrypted. Store these directories
   on a protected file system.
   :::

1. Configure the KBS.

   Create a `kbs.env` file and add the configuration variables listed below.

   :::note
   The `kbs.env` file contains secrets, including the admin username and
   password and the KMS token or admin password. For improved security,
   remove the `kbs.env` file after you run the KBS container for the
   first time. The file isn't needed after the initial configuration.
   :::

   ```bash
   LOG_LEVEL=<DEBUG, INFO, TRACE, ERROR>
   KEY_MANAGER=<VAULT or KMIP, default VAULT> # Choose VAULT for HashiCorp Vault or KMIP for PyKMIP.
   ADMIN_USERNAME=<kbs admin username>
   ADMIN_PASSWORD=<kbs admin password>
   HTTP_READ_HEADER_TIMEOUT=<KBS server read header timeout, default 10 sec>
   BEARER_TOKEN_VALIDITY_IN_MINUTES=<kbs auth token validity, default 5 min>
   TRUSTAUTHORITY_API_URL="api.ta.company.com"
   TRUSTAUTHORITY_API_KEY=<TA API key>
   TRUSTAUTHORITY_BASE_URL="portal.ta.company.com"
   AUTHENTICATION_DEFEND_MAX_ATTEMPTS=<max number of invalid login attempts; default 5 attempts>
   AUTHENTICATION_DEFEND_INTERVAL_MINUTES=<time interval for invalid token fetch attempts; default 1 min>
   AUTHENTICATION_DEFEND_LOCKOUT_MINUTES=<lockout duration after the maximum number of attempts is exceeded; default 1 min>
   SAN_LIST=<SAN list for KBS TLS certificate>
   ```

:::note
If you are in the European Union (EU) region, use the following TA URLs:

```bash
TRUSTAUTHORITY_API_URL="https://api.eu.ta.company.com"
TRUSTAUTHORITY_BASE_URL="portal.eu.ta.company.com"
```

:::

<Tabs>
<TabItem value="hashicorp-config" label="HashiCorp Vault KMS configuration">

### HashiCorp Vault KMS configuration

Use these settings only if KBS uses the free version of HashiCorp Vault.

```bash
VAULT_SERVER_IP=<vault server IP address>
VAULT_SERVER_PORT=<vault port number; default 8200>
VAULT_CLIENT_TOKEN=<vault root token>
```

</TabItem>
<TabItem value="pykmip-config" label="PyKMIP configuration">

### PyKMIP configuration

Use these settings only if KBS uses PyKMIP.

```bash
KMIP_CLIENT_KEY_PATH=<path to KMIP client key>
KMIP_ROOT_CERT_PATH=<path to KMIP root certificate>
KMIP_CLIENT_CERT_PATH=<path to KMIP client certificate>
KMIP_SERVER_IP=<KMIP server IP address>
KMIP_SERVER_PORT=<KMIP server port number>
KMIP_HOSTNAME=<hostname where KMIP is running>
KMIP_USERNAME=<KMIP server username>
KMIP_PASSWORD=<KMIP password>
KMIP_VERSION=<KMIP version>
```

</TabItem>
</Tabs>

1. Optionally, configure a proxy setting.

    If you're running behind a proxy, add the following to the `kbs.env` file.

    ```bash
    http_proxy=<http proxy>
    https_proxy=<https proxy>
    ```

1. Run the KBS container.

    ```bash
    docker run -d --restart unless-stopped --name kbs --env-file <KBS env file> -p <KBS port>:9443 -v /etc/kbs/certs:/etc/kbs/certs -v /etc/hosts:/etc/hosts -v /opt/kbs:/opt/kbs ta/key-broker-service:v1.0.0
    ```
