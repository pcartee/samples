---
title: Understanding TA integrations
description: Describes the integration framework for TA client libraries.
author: pcartee
topic: conceptual
date: 06/20/2024
uid: integrate.overview
---

TA offers a variety of ways to integrate attestation with your confidential workload or relying party. Each method is designed to satisfy a different use case. All are designed to be easy to integrate into new applications and require minimal changes to retrofit existing applications.

## TA components

The following TA components are available for integrating remote attestation into your confidential process.

The TA web portal is the starting point for integration. You'll need to create an Attestation API key for attestation-related tasks. You can create a new **apiClient** attestation key by using the REST API or **trustauthorityctl**, but you can't retrieve the key except by using the portal. An Attestation API key is required for all remote attestation APIs. The tenant administration CLI and the related management REST APIs require an Admin API key.

The REST API is the primary integration interface for TA. All remote attestation requests are processed through the REST API. In addition to client management, it offers faithful verification and policy management, among other functions. The REST API, designed for both attester and relying party use cases, is accessible via a public API gateway endpoint. 

A common use case occurs when an attestation token is obtained using evidence collected by a different process. This scenario is background-check attestation, where the token is requested by the relying party using evidence collected by the attester. In this scenario, the relying party doesn't require a TA client, TEE adapter, or CLI to use the REST APi for obtaining an attestation token or verifying the resulting token. The relying party only needs an attestation API key and TA URLs to use the REST API for background-check attestation.

To make it easier to add remote attestation to a confidential process, TA provides client libraries in several language bindings. There are at least two components to most attester clients: the main library API, called a _connector_, and one or more _TEE adapter_(s). Source code for the connectors and TEE adapters is open source and available on GitHub.

Connectors communicate with the TA SaaS instance via a TLS-encrypted HTTPS connection through an API gateway to the TA REST API.

Other integration components include the following.
- CLI for Intel TDX — **ta-cli** enables TDX attestation from the Linux command line.  The TA CLI for Intel TDX is a CLI layer implemented on top of the connector and Intel TDX TEE adapter.
- TA Administration CLI — Allows users and applications to perform management functions from the Linux command line. Note that `trustauthorityctl` requires an Admin API key for configuration.
- Gramine Shielded Containers (GSC) client — Permits existing Intel SGX enclaves to use TA remote attestation with very few changes. 

### TEE adapters

The Trusted Execution Environment (TEE) adapters encapsulate the low level code needed to collect evidence from the TEE and format a quote for attestation.  The following client library support matrix shows which client languages are currently available, and the TEE adapters they support.

|   | Intel SGX | Intel TDX | Azure TDX | GCP TDX | NVIDIA GPU | AMD SEV-SNP |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| [**Go**](../Integration/integrate-go-client.md) | X | X | X | X | — | P |
| [**Python**](../Integration/integrate-python-client.md) | X | X | X | X | P | — |
| [**C**](../Integration/integrate-c-client.md) | X | X | X | — | — | — |
| [**Java**](../Integration/integrate-java-client.md) | X | X | — | — | — | — |

**X** indicates current support. <br /> **—** indicates that the TEE adapter is not supported at this time. <br /> **P** means that support is in pre-release status in the pilot environment only, and features and functionality may change before general availability. Contact your Intel representative to inquire about pilot availability

Each TEE has unique requirements for the host platform. To learn more about these requirements, refer to the README file for the adapter in the GitHub repository. Additionally, you can find further information and relevant links by selecting one of the language links provided in the table above.

## Integration example

The following diagram is a high-level view of the integration architecture provided by TA. This simplified view shows the primary functions performed by each of the entities in a passport attestation model.

![TA integration architecture](/img/integrations/integration-arch.png)


This diagram illustrates a passport attestation pattern. It simplifies the representation of all major components required for integrating remote attestation into a confidential process. Additionally, the diagram provides a simplified view of the TA client stack for the Go connector.  

In this integration, both the attester and the relying party use the client libraries to communicate with the TA service.
1. The attester uses the Go client libraries to collect evidence from the TEE and request an attestation token from TA.
2. TA verifies the quote using built-in policy and policies specified by the attester and tenant admins. 
3. Since this is a passport attestation pattern, the attester forwards the attestation token to the relying party.
4. The relying party is responsible for validating the authenticity of the token and applying its own appraisal policies to decide if it trusts the attester. Optionally, the relying party can download attestation token signing certificates, request a Faithful Verification report, or use the TA client libraries to perform token verification. For more information, see Relying party integration.

## TA client for Gramine

TA supports using [Gramine](https://gramineproject.io/). Gramine is a library operating system (LibOS) designed to allow an entire application to run in an enclave with few or no changes needed to the application itself.

For more information, see Gramine integration with TA.


