---
title: Understanding TA integrations
description: Overview of the Trust Authority (TA) integration framework. Describes the TA components (web portal, REST API, client libraries, CLIs, and Gramine client), the TEE adapter support matrix for the Go, Python, C, and Java clients, and a passport attestation integration example.
author: pcartee
topic: conceptual
date: 06/20/2024
uid: integrate.overview
sidebar_position: 1
---

TA offers a variety of ways to integrate attestation with your confidential workload or relying party. Each method is designed to satisfy a different use case. All are easy to integrate into new applications and require minimal changes to retrofit existing applications.

## TA components

The following TA components are available for integrating remote attestation into your confidential process.

The TA web portal is the starting point for integration. You need to create an attestation API key for attestation-related tasks. You can create a new **apiClient** attestation key by using the REST API or **tactl**, but you can retrieve the key only by using the portal. An attestation API key is required for all remote attestation APIs. The tenant administration CLI and the related management REST APIs require an Admin API key.

The REST API is the primary integration interface for TA. All remote attestation requests are processed through the REST API. In addition to client management, it offers faithful verification and policy management, among other functions. The REST API, designed for both attestor and relying party use cases, is accessible through a public API gateway endpoint.

A common use case occurs when an attestation token is obtained by using evidence collected by a different process. This scenario is background-check attestation, where the relying party requests the token by using evidence collected by the attestor. In this scenario, the relying party doesn't need a TA client, TEE adapter, or CLI to use the REST API to obtain an attestation token or verify the resulting token. The relying party only needs an attestation API key and TA URLs to use the REST API for background-check attestation.

To make it easier to add remote attestation to a confidential process, TA provides client libraries in several language bindings. Most attestor clients have at least two components: the main library API, called a _connector_, and one or more _TEE adapters_. The source code for the connectors and TEE adapters is open source and available on GitHub.

Connectors communicate with the TA SaaS instance through a TLS-encrypted HTTPS connection, through an API gateway, to the TA REST API.

Other integration components include the following:

- **CLI for Intel TDX**: **tactl** enables Intel TDX attestation from the Linux command line. The TA CLI for Intel TDX is a CLI layer implemented on top of the connector and the Intel TDX TEE adapter.
- **TA Administration CLI**: Allows users and applications to perform management functions from the Linux command line. `tactl` requires an Admin API key for configuration.
- **Gramine Shielded Containers (GSC) client**: Permits existing Intel SGX enclaves to use TA remote attestation with very few changes.

### TEE adapters

The trusted execution environment (TEE) adapters encapsulate the low-level code needed to collect evidence from the TEE and format a quote for attestation. The following client library support matrix shows which client languages are currently available and the TEE adapters they support.

|   | Intel SGX | Intel TDX | Azure TDX | GCP TDX | NVIDIA GPU | AMD SEV-SNP |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| [**Go**](../Integration/integrate-go-client.md) | X | X | X | X | — | P |
| [**Python**](../Integration/integrate-python-client.md) | X | X | X | X | P | — |
| [**C**](../Integration/integrate-c-client.md) | X | X | X | — | — | — |
| [**Java**](../Integration/integrate-java-client.md) | X | X | — | — | — | — |

- **X** indicates current support.
- **—** indicates that the TEE adapter isn't supported at this time.
- **P** indicates that support is in pre-release status in the pilot environment only, and features and functionality might change before general availability. Contact your Intel representative to inquire about pilot availability.

Each TEE has unique requirements for the host platform. To learn more about these requirements, see the README file for the adapter in the GitHub repository. You can also find more information and relevant links by selecting one of the language links in the preceding table.

## Integration example

The following diagram is a high-level view of the integration architecture provided by TA. This simplified view shows the primary functions that each entity performs in a passport attestation model.

![Diagram titled Intel Trust Authority Integration Architecture. The Intel Trust Authority Verifier (SaaS) contains the REST API, identity verification, policy evaluation, attestation token issuance, and Faithful Verification. The Intel Trust Authority Client contains the TDX CLI, the Go-connector, Go-SGX and Go-TDX, and Intel SGX DCAP and Intel TDX DCAP. A TEE attestor, which contains the Intel Trust Authority Client and a confidential workload, sends a quote to the verifier (step 1). The verifier returns an attestation token to the attestor (step 2). The attestor sends the attestation token to the relying party (step 3). The verifier provides signing certificates and a Faithful Verification report to the relying party (step 4). The relying party contains the Intel Trust Authority Client, relying party policy appraisal, and a decision maker.](/img/integrations/integration-arch.png)

This diagram illustrates a passport attestation pattern. It simplifies the representation of all major components required for integrating remote attestation into a confidential process. It also provides a simplified view of the TA client stack for the Go connector.

In this integration, both the attestor and the relying party use the client libraries to communicate with the TA service.

1. The attestor uses the Go client libraries to collect evidence from the TEE and request an attestation token from TA.
1. TA verifies the quote by using built-in policy and policies specified by the attestor and tenant admins.
1. Because this is a passport attestation pattern, the attestor forwards the attestation token to the relying party.
1. The relying party is responsible for validating the authenticity of the token and applying its own appraisal policies to decide whether it trusts the attestor. Optionally, the relying party can download attestation token signing certificates, request a Faithful Verification report, or use the TA client libraries to perform token verification. For more information, see Relying party integration.

## TA client for Gramine

TA supports using [Gramine](https://gramineproject.io/). Gramine is a library operating system (LibOS) designed to allow an entire application to run in an enclave with few or no changes to the application itself.

For more information, see Gramine integration with TA.
