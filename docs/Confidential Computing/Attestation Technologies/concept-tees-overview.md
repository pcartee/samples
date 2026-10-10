---
title: Trusted Execution Environments (TEE)
description: Overview of trusted execution environments (TEEs), attestation and trusted computing base verification, and options for integrating SGX and TDX workloads with TA services.
author: pcartee
topic: conceptual
date: 02/07/2025
uid: tees.overview
---

A trusted execution environment (TEE) helps protect code and data from modification by untrusted software, hardware, and system components outside the TEE boundary. TEEs can help defend against many software-based and some hardware-based attacks, and provide assurance that the software and hardware within the TEE have not been tampered with.

TA supports Software Guard Extensions (SGX) and Trust Domain Extensions (TDX) TEEs. To use TA services, you need a working knowledge of the underlying TEE technology. To learn more about SGX and TDX, see [Next steps](#next-steps).

A TEE running directly on an SGX-enabled platform is called an _enclave_. A TDX virtual machine (VM) running on a TDX-enabled platform is called a _trust domain_.

Every TEE has a trusted computing base (TCB), which includes the software, firmware, and hardware resources within the TEE's security boundary. When an enclave or trust domain is created, its TCB must be verified through attestation before it can be trusted with sensitive workloads and data. For more information, see [TA attestation](../Concepts/concept-attestation-overview.md).

A TEE generates a quote containing cryptographic evidence to support its claim of authenticity. Low-level, platform-specific attestation primitives collect the evidence.

TA provides several ways to integrate TEE workloads with its services:

- Your workload can create a quote using platform-specific code, then call the TA REST API or, for TDX trust domains, the TDX CLI. This option can help migrate existing applications to TA attestation.
- You can use the TA Go client libraries to integrate SGX or TDX attestation into your application. The client library handles low-level calls to platform-specific attestation primitives, reducing the complexity of working with TEEs. Go is the currently supported language for this integration.
- You can migrate existing Microsoft Azure Attestation (MAA) applications to use TA attestation. In this case, your Microsoft Azure TEE application creates a quote in a format compatible with MAA. The TA MAA adapter accepts MAA-format quotes for remote attestation. For more information, see the [MAA adapter service](../Concepts/concept-maa-adapter.md).

---

## Next steps

SGX and TDX resources:

- [SGX main page](https://www.company.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html)
- [TDX main page](https://www.company.com/content/www/us/en/developer/articles/technical/trust-domain-extensions.html)

TA TEE integrations:

- [TA Go Client](../Integration/integrate-go-client.md)
- TDX CLI (for TDX trust domains)
- Gramine client


**\*** Other names and brands may be claimed as the property of others.
