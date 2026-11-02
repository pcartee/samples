---
title: Understanding TA integrations
description: Overview of Trust Authority (TA) integration options, including the portal, REST API, client libraries, command-line interfaces, and Gramine client. Covers TEE adapter support across Go, Python, C, and Java clients and explains a Passport attestation workflow.
author: pcartee
topic: conceptual
date: "2024-06-20"
uid: integrate.overview
sidebar_position: 1
---

TA offers several ways to integrate attestation into a confidential workload or relying party. Each option supports a different use case. You can integrate these options into new applications or use them to retrofit existing applications with minimal changes.

## TA components

The following TA components are available to integrate remote attestation into your confidential process.

Start your integration in the TA web portal. Create an attestation API key for attestation-related tasks. You can create an **apiClient** attestation key by using the REST API or **tactl**, but you can retrieve the key only through the portal. All remote attestation APIs require an attestation API key. The tenant administration CLI and related management REST APIs require an Admin API key.

The REST API is TA's primary integration interface. It processes all remote attestation requests and supports client management, Faithful Verification, policy management, and other functions. Both attestors and relying parties can access the REST API through a public API gateway endpoint.

In a common use case, a process collects evidence separately from the token request. This scenario is called background-check attestation: the relying party requests a token by using evidence collected by the attestor. The relying party does not need a TA client, TEE adapter, or CLI to use the REST API to obtain an attestation token or verify it. The relying party needs only an attestation API key and TA URLs to use the REST API for background-check attestation.

To make it easier to add remote attestation to a confidential process, TA provides client libraries in several programming languages. Most attester clients have at least two components: the main library API, called a _connector_, and one or more _TEE adapters_. The connector and adapter source code is open source and available on GitHub.

Connectors communicate with the TA SaaS instance over HTTPS through an API gateway to the TA REST API. HTTPS encrypts the connection by using TLS.

Other integration components include:

- **CLI for Intel TDX**: **tactl** enables Intel TDX attestation from the Linux command line. This CLI layer is implemented on top of the connector and the Intel TDX TEE adapter.
- **TA Administration CLI**: Allows users and applications to perform management functions from the Linux command line. `tactl` requires an Admin API key for configuration.
- **Gramine Shielded Containers (GSC) client**: Permits existing Intel SGX enclaves to use TA remote attestation with very few changes.

### TEE adapters

Trusted execution environment (TEE) adapters encapsulate the low-level code needed to collect evidence from a TEE and format a quote for attestation. The following matrix shows the available client languages and the TEE adapters each supports.

| | Intel SGX | Intel TDX | Azure TDX | GCP TDX | NVIDIA GPU | AMD SEV-SNP |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| [**Go**](../Integration/integrate-go-client.md) | X | X | X | X | — | P |
| [**Python**](../Integration/integrate-python-client.md) | X | X | X | X | P | — |
| [**C**](../Integration/integrate-c-client.md) | X | X | X | — | — | — |
| [**Java**](../Integration/integrate-java-client.md) | X | X | — | — | — | — |

- **X** indicates current support.
- **—** indicates that the TEE adapter is not currently supported.
- **P** indicates that support is in pre-release status and available only in the pilot environment. Features and functionality might change before general availability. Contact your Intel representative to ask about pilot availability.

Each TEE has unique host platform requirements. To learn more, see the adapter's README file in the GitHub repository. You can also find more information and relevant links by selecting a language link in the preceding table.

## Integration example

The following diagram provides a high-level view of the TA integration architecture. It shows the primary functions of each entity in a Passport attestation model.

![Diagram titled Intel Trust Authority Integration Architecture. The Intel Trust Authority Verifier (SaaS) contains the REST API, identity verification, policy evaluation, attestation token issuance, and Faithful Verification. The Intel Trust Authority Client contains the TDX CLI, the Go-connector, Go-SGX and Go-TDX, and Intel SGX DCAP and Intel TDX DCAP. A TEE attestor, which contains the Intel Trust Authority Client and a confidential workload, sends a quote to the verifier (step 1). The verifier returns an attestation token to the attestor (step 2). The attestor sends the attestation token to the relying party (step 3). The verifier provides signing certificates and a Faithful Verification report to the relying party (step 4). The relying party contains the Intel Trust Authority Client, relying party policy appraisal, and a decision maker.](/img/integrations/integration-arch.png)

This diagram illustrates a Passport attestation pattern. It simplifies the major components required to integrate remote attestation into a confidential process and shows the TA client stack for the Go connector.

In this integration, both the attestor and the relying party use the client libraries to communicate with the TA service.

1. The attestor uses the Go client libraries to collect evidence from the TEE and request an attestation token from TA.
1. TA verifies the quote by using its built-in policy and policies specified by the attestor and tenant admins.
1. Because this is a passport attestation pattern, the attestor forwards the attestation token to the relying party.
1. The relying party validates the token's authenticity and applies its own appraisal policies to decide whether it trusts the attestor. The relying party can also download attestation token signing certificates, request a Faithful Verification report, or use the TA client libraries to verify the token. For more information, see Relying party integration.

## TA client for Gramine

TA supports using [Gramine](https://gramineproject.io/). Gramine is a library operating system (LibOS) designed to allow an entire application to run in an enclave with few or no changes to the application itself.

For more information, see Gramine integration with TA.
