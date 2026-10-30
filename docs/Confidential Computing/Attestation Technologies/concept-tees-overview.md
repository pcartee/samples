---
title: Trusted Execution Environments (TEE)
description: Learn what a trusted execution environment (TEE) is, how Intel SGX enclaves and Intel TDX trust domains use a trusted computing base (TCB), quotes, and attestation, and the ways to integrate SGX and TDX workloads with Trust Authority (TA) services, including the Go, C, Java, and Python client libraries.
author: pcartee
topic: conceptual
date: 02/07/2025
uid: tees.overview
---

A trusted execution environment (TEE) helps protect code and data from modification by untrusted software, hardware, and system components outside the TEE boundary. TEEs can help defend against many software-based and some hardware-based attacks, and they provide assurance that the software and hardware within the TEE haven't been tampered with.

Trust Authority (TA) supports Intel® Software Guard Extensions (Intel® SGX) and Intel® Trust Domain Extensions (Intel® TDX) TEEs. TA also supports AMD SEV-SNP confidential VMs and NVIDIA GPU TEEs. This article focuses on SGX and TDX. To use TA services, you need a working knowledge of the underlying TEE technology. To learn more about SGX, TDX, and SEV-SNP, see [Next steps](#next-steps).

A TEE that runs directly on an SGX-enabled platform is called an _enclave_. A TDX virtual machine (VM) that runs on a TDX-enabled platform is called a _trust domain_.

Every TEE has a trusted computing base (TCB), which includes the software, firmware, and hardware resources within the TEE's security boundary. When you create an enclave or trust domain, you must verify its TCB through attestation before you can trust it with sensitive workloads and data. For more information, see [TA attestation](../Concepts/concept-attestation-overview.md).

A TEE generates a quote that contains cryptographic evidence to support its claim of authenticity. Low-level, platform-specific attestation primitives collect the evidence.

TA provides several ways to integrate TEE workloads with its services:

- Create a quote by using platform-specific code in your workload, and then call the TA REST API or, for TDX trust domains, the TDX CLI. This option can help you migrate existing applications to TA attestation.
- Use a TA client library to integrate SGX or TDX attestation into your application. TA provides client libraries for Go, C, Java, and Python. The client library handles low-level calls to platform-specific attestation primitives, which reduces the complexity of working with TEEs.
- Migrate existing Microsoft Azure Attestation (MAA) applications to use TA attestation. In this case, your Microsoft Azure TEE application creates a quote in a format that's compatible with MAA. The TA MAA adapter accepts MAA-format quotes for remote attestation. For more information, see the [MAA adapter service](../Concepts/concept-maa-adapter.md).

## Next steps

TEE technology articles:

- [Software Guard Extensions (SGX)](./Trusted%20execution%20environments/tee-sgx.md)
- [Trust Domain Extensions (TDX)](./Trusted%20execution%20environments/tee-tdx.md)
- [AMD SEV-SNP](./Trusted%20execution%20environments/tee-sev-snp.md)

Intel resources:

- [Intel SGX overview](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html)
- [Intel TDX overview](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html)

TA TEE integrations:

- [TA Go client](../Integration/integrate-go-client.md)
- [TA C client](../Integration/integrate-c-client.md)
- [TA Java client](../Integration/integrate-java-client.md)
- [TA Python client](../Integration/integrate-python-client.md)
- TDX CLI (for TDX trust domains)
- Gramine client

**\*** Other names and brands may be claimed as the property of others.
