---
title: TA CLI installation
description: Learn how to build, install, configure, and use the TA CLI, including its prerequisites, supported operating system, directory structure, and commands.
author: pcartee
topic-type: Reference
date: "2024-06-12"
uid: cli-install
sidebar_position: 1
---

This article explains how to build, install, and configure the TA CLI. Tenants use this open-source tool to make API calls to their Trust Authority instance. The source code is available on [GitHub](https://github.com/company/ta-cli).

:::note
Valid characters include the digits 0 through 9; uppercase and lowercase English letters; underscore (`_`); semicolon (`;`); period (`.`); slash (`/`); dash (`-`); and space.
:::

## Build the TA CLI

Before you build the TA CLI, confirm that your system meets the requirements and install the prerequisite packages.

### Supported operating system

- Ubuntu LTS 20.04

:::note
You must be a tenant admin to install the CLI. Both admins and users can use it.
:::

### Prerequisite packages

#### Make and Makeself

To install the `make` and `makeself` packages, run the following command:

```bash
sudo apt-get install -y make makeself
```

#### Go

The supported Go version is 1.20.x.

1. Install Go 1.20.x by following the [Go installation instructions](https://go.dev/doc/install).

1. If `$HOME/.local/bin/` is not already in your `PATH` environment variable, add it.

### Build the CLI

1. On the build machine, create a directory named `cli`.

    ```bash
    mkdir cli
    ```

1. Change to the `cli` directory.

    ```bash
    cd cli
    ```

1. Clone the TA CLI source code into the `cli` directory.

    ```bash
    git clone https://github.com/company/ta-cli
    ```

1. Change to the cloned repository directory and create the CLI installer.

    ```bash
    cd ta-cli
    make installer
    ```

## Install the TA CLI

Before you begin, have the following information available:

- API gateway URL
- Tenant API key

1. If you are not already in the directory where you built the CLI, change to that directory.

    ```bash
    cd cli
    ```

1. Copy the binary installer to the system where you want to install the CLI.

   The installer file is named `tactl-{version}.bin`.

1. In your home directory, create a `tactl.env` file. This file configures the CLI to contact a specific TA instance. Add the following contents:

    ```text
    TRUSTAUTHORITY_URL=https://api.ta.intel.com
    TRUSTAUTHORITY_API_KEY="<admin API key>"
    ```

    :::note
    If you are in the European Union (EU), use this TA URL: `TRUSTAUTHORITY_URL=https://api.eu.ta.intel.com`.
    :::

1. To install the tenant CLI, run the following command:

    ```bash
    ./tactl-{version}.bin
    ```

:::note
If you are behind a proxy, add the TA fully qualified domain name (FQDN) to the `NO_PROXY` environment variable.
:::

### Directory structure

The CLI stores its files in your home directory:

- Configuration: `$HOME/.config/tactl/config.yaml`
- Logs: `$HOME/.config/tactl/logs/tactl.log`
- Binary: `$HOME/.local/bin/tactl`

:::note
If you cannot access the command, add the binary path to the `PATH` environment variable.
:::

## CLI commands

:::note
You can optionally provide a request ID to create, read, update, and delete (CRUD) commands. The ID can be a randomly generated string of up to 128 bytes and can serve as a unique identifier for each operation.
:::

### Tenant CLI configuration

Use the following command to configure the tenant CLI. You need the path to the `tactl.env` file you created earlier.

```bash
tactl config -v <env file path>
```

### Install Bash completion

Run the following command to install Bash completion for the TA CLI:

```bash
tactl completion
```

### Retrieve the version

To display the installed tenant CLI version, run the following command:

```bash
tactl version
```

### Uninstall the CLI

To uninstall the tenant CLI, run the following command:

```bash
tactl uninstall
```
