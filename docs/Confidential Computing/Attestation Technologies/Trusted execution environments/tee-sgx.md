---
title: Software Guard Extensions (SGX)
description: Explains SGX attestation requirements, provisioning, kernel support, and EPC memory.
author: pcartee
topic: conceptual
date: 11/18/2024
uid: tee.sgx
---
import DCAP from '../../Include/_install-dcap.md';

This article describes the requirements for Software Guard Extensions (SGX)-enabled applications to generate attestation quotes.

For more information about SGX, see the [SGX product page](https://www.company..com/content/www/us/en/developer/tools/software-guard-extensions/overview.html).

At a high level, attestation with SGX requires the following:

- Hardware supporting SGX provisioned using the Software Guard Extensions Provisioning Certification Service (SGX Provisioning Certification Service).
- SGX driver support in the operating system kernel.
- Software Guard Extensions Data Center Attestation Primitives (SGX DCAP) to provide quoting capability to SGX-enabled applications.
- An attestation authority such as TA.

## Working with SGX

SGX uses the Elliptic Curve Digital Signature Algorithm (ECDSA) attestation architecture.

:::note
TA supports ECDSA-based quote verification only. TA does not support legacy Enhanced Privacy ID (EPID)-based quotes. To create ECDSA-based quotes, your processor must support the SGX Launch Control feature (sometimes called SGX Flexible Launch Control, or FLC), and FLC must be set to **unlocked** mode. On third-generation Xeon® Scalable Processors and newer CPUs, this is the default setting and cannot be changed. On older Xeon E processors, you can usually configure FLC in the BIOS. For more information, see [How to determine if a processor with SGX supports DCAP and FLC](https://www.company.com/content/www/us/en/support/articles/000057420/software/company-security-products.html).
:::

1. The enclave workload contacts the relying party and requests access to a service or resource.

1. The relying party responds by issuing a challenge that asks the SGX workload to identify itself and provide proof that its credentials are valid.

1. To satisfy the challenge, the SGX workload generates a quote, which is a cryptographic measurement of the instantiated enclave. The quote is signed using the attestation collateral stored in the data center caching service.

1. The workload sends the quote to the relying party over a secure communications channel.

1. The relying party verifies the quote by fetching the attestation collateral associated with the quote from the data center caching service and using it to verify the signature.

1. Assuming the quote is valid, the relying party examines the quote metadata and the trusted-compute base (TCB) level associated with the signing key. The service then applies its security policy and decides whether to trust the enclave.

For more information, see [Provisioning Certification Service for ECDSA Attestation](https://www.company.com/content/www/us/en/developer/articles/technical/quote-verification-attestation-with-sgx-dcap.html).

This attestation flow has several requirements beyond SGX-capable hardware and an SGX-enabled workload. This article explains these requirements and how they fit into your software and data center architecture.

## Provisioning certification

SGX ECDSA attestation requires physical SGX-enabled hosts to access the [SGX Provisioning Certification Service](https://api.portal.trustedservices.company.com/provisioning-certification) to provision certificates for the attestation process. Hosts can access this service directly, but most data centers use a caching service instead. The caching service provides a single point of contact for the SGX Provisioning Certification Service over the internet. SGX hosts in the data center can connect to the caching service without requiring direct internet access for provisioning.

This requirement applies only to bare-metal SGX servers. Customers using SGX-enabled cloud service providers (CSPs) do not need a caching service or direct access to the PCS because the CSP provides that functionality.

## SGX driver in the kernel

SGX requires driver support at the kernel level. For Linux, this support was added in the Linux kernel 5.11 and later.

<DCAP />

## Enclave Page Cache (EPC) memory

SGX requires Enclave Page Cache (EPC) memory for SGX enclaves. On physical SGX hosts, configure EPC memory in the system BIOS. Cloud service providers typically include EPC memory allocations in their SGX-enabled offerings. The amount of EPC memory required depends on the enclave size; a small cryptographic toolkit library may require only a few megabytes of EPC memory.

Because Gramine encapsulates the entire application in an SGX enclave, it requires more EPC memory than an approach that uses enclaves only for specific application libraries. Ensure that enough EPC memory is available to run the entire "graminized" application.

---

## Next steps

### SGX primary resources

- SGX Attestation on Microsoft Azure

**\*** Other names and brands may be claimed as the property of others.
