---
title: Trust Domain Extensions (TDX)
description: Overview of Intel TDX, its attestation model, supported platforms, and TD Integrity.
author: pcartee
topic: conceptual
date: 05/16/2025
uid: tee.tdx
---

Trust Domain Extensions (TDX) enables you to deploy hardware-isolated confidential virtual machines (CVMs) called **trust domains** (TDs). A TD is isolated from the virtual machine manager (VMM), hypervisor, and other non-TD software on the host platform. TDX encrypts TD memory using a multiple-key encryption method. It aims to exclude the host platform from the TD's trusted computing base (TCB) and isolate TDs in a multitenant environment from one another.

You generally don't need to understand TDX internals to use TA attestation and tools. However, you need to understand how claims in evidence relate to system state and the TCB. For more information, see the TDX section of Attestation Tokens. Attestation policies let you compare claims and evidence collected from the TDX CVM with reference values and apply rules and conditions to the claims.

## TDX attestation

The root of trust for TDs is the TDX Provisioning Certification Enclave (PCE), which is implemented as an SGX enclave. The PCE signs evidence reports (quotes) for attestation, provisions cryptographic keys, and certifies the platform TCB status. The PCE is remotely attested when the TD is instantiated and whenever an attesting party requests a TD quote.

For background on host-level TDX remote attestation, see the Confidential Computing Documentation's TDX Enabling Guide, specifically its Infrastructure Setup section. If you're using cloud-based TDX CVMs with TA attestation, you don't need to know the infrastructure setup details. If you're setting up a TDX host on-premises, consult the TDX Enabling Guide and Canonical's [Trust Domain Extensions (TDX) on Ubuntu][canonical-tdx].

## Supported platforms and tools

TDX CVMs can run on-premises and on cloud platforms such as Microsoft Azure **\*** (Azure) and Google Cloud Platform **\*** (GCP). Azure and GCP implement TDX CVMs differently, but the TEE adapters in the TA Attestation Client handle the platform-specific details. An attesting workload or relying party doesn't need to know which TDX platform it's running on. TDX software adapters are available for on-premises hosts, Azure TDX CVMs, and GCP TDX CVMs. The combination of a TDX CVM and NVIDIA H100 **\*** GPUs is supported. [ta-pycli](../concept-gpu-attestation.md#python-cli) provides a CLI for composite attestation of a TDX CVM and NVIDIA GPU.

TA includes an Attestation CLI and [Attestation Client](../../Integration/integrate-overview.md) libraries for Go, Python, Java, and C to help you add TDX attestation to your workload. The CLI and client connectors abstract most platform details. Attesters and relying parties use the same API across platforms.

## TD Integrity

TD Integrity is a TA feature that uses evidence collected from boot logs, the platform, the TPM, and the trust domain to establish a remotely attested "chain of trust" for TDX CVMs. A verified chain of trust helps ensure that all TCB components, from the hardware to the TD, are remotely validated and may be considered "trusted."

Some platform and image reference values required for TD Integrity come from cloud service providers (CSPs). Attestation policies use these reference values to evaluate evidence collected from the platform and TD. For more information, see the TA TD Integrity repository on GitHub.

---

**\*** Other names and brands may be claimed as the property of others.

{/* external links */}
[canonical-tdx]: https://github.com/canonical/tdx
