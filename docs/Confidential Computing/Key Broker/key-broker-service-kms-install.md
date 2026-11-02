---
title: HashiCorp Vault and PyKMIP installation
description: Install and configure HashiCorp Vault or PyKMIP as the Key Broker System (KBS) key management service (KMS). Includes setup references, Vault initialization and configuration, and the PyKMIP certificates and server settings required for KBS communication.
author: pcartee
topic: kbs
date: "2025-04-14"
uid: kms.install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A key management service (KMS) must be installed before you install the
Key Broker System (KBS). KBS supports HashiCorp Vault and PyKMIP. Select
the KMS that suits your environment, and follow the instructions.

<Tabs>
<TabItem value="hashicorp-config" label="HashiCorp Vault configuration">

### HashiCorp Vault configuration

1. [Install Vault](https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-install).

1. [Create a Vault server configuration file](https://developer.hashicorp.com/vault/docs/configuration).

1. [Start the Vault server](https://developer.hashicorp.com/vault/docs/commands/server).

1. Initialize the Vault server using the [Vault server command documentation](https://developer.hashicorp.com/vault/docs/commands/server). Store the keys securely.

1. [Unseal the Vault server](https://developer.hashicorp.com/vault/docs/commands/operator/unseal).

1. Log in to Vault by running the following command:

   ```bash
   vault login <root-token>
   ```

1. Enable a KV secrets engine for KBS:

   ```bash
   vault secrets enable -path=keybroker kv
   ```

1. Add the following Vault server information to the KBS configuration file:

   ```bash
   VAULT_SERVER_IP=<Vault server IP address>
   VAULT_SERVER_PORT=<Vault port number; default 8200>
   VAULT_CLIENT_TOKEN=<Vault root token>
   ```

</TabItem>
<TabItem value="pykmip-config" label="PyKMIP configuration">

### PyKMIP configuration

:::important
Create all certificates and keys required for KBS-PyKMIP communication.
KBS reads the configuration file you provide and uses the communication
type defined in that file.
:::

1. [Install PyKMIP](https://pykmip.readthedocs.io/en/latest/installation.html).

1. [Create server certificates and configure the server](https://pykmip.readthedocs.io/en/latest/server.html).

1. Add the following PyKMIP server information to the KBS configuration file:

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
