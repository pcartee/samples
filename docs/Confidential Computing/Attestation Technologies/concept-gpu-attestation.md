---
title: GPU remote attestation with TA
description: Learn how TA supports NVIDIA GPU attestation with Intel TDX, including composite and GPU-only workflows, the attestation architecture, Python client and CLI usage, REST API endpoint, JWT claims, and sample appraisal policies.
author: pcartee
topic: conceptual, attestation, gpu
date: 09/17/2024
uid: gpu.attestation
---
import BasicToken from '../Include/eat/_nv-basic-token.md';
import NVIDIA from '../Include/eat/_nvidia-policy-claims.md';

TA supports remote attestation for NVIDIA H100 GPU TEEs. You can attest a confidential virtual machine (VM) TEE and an NVIDIA H100 GPU in a single composite attestation workflow. This article describes the GPU attestation architecture, the TA Python client, CLI, and REST API support, and examples of GPU and composite attestation JWTs.

:::note
The implementation described here supports on-premises hardware. Cloud-based GPU attestation is outside the scope of this article.
:::

Using a GPU as a TEE extends the capabilities of a CPU TEE. Generative artificial intelligence (GAI) and other demanding workloads use GPU acceleration to achieve acceptable performance. GAI models and parameters can be valuable intellectual property, and these workloads often process sensitive data. A GPU TEE provides a protected execution environment for these workloads and helps protect data from unauthorized access or tampering.

However, a GPU alone does not provide a complete confidential computing solution. The GPU confidential computing solution relies on a CPU TEE in a confidential VM, enabled by Intel® Trust Domain Extensions (Intel® TDX) 1.x on Intel CPUs. The CPU TEE provides measurements and attestation evidence that help establish trust in the GPU. It also orchestrates secure information transfer to the GPU. The GPU and confidential VM exchange keys to establish an encrypted communications channel.

The TA Python client, CLI for Intel TDX and NVIDIA GPUs, and TA REST API support two GPU attestation options:

1. **Composite CPU TEE and GPU TEE attestation:** The TA client collects separate evidence from the confidential VM TEE and GPU driver, combines it, and sends it to TA for verification. TA verifies the CPU evidence and sends the GPU quote to NVIDIA Remote Attestation Service (NRAS) for verification. The attestation JWT issued by TA contains CPU TEE claims, GPU claims, and other claims from the TA service. Composite attestation is the preferred method for confidential computing solutions that include a GPU TEE.
2. **GPU-only attestation:** The TA client collects GPU evidence and requests verification. As described above, GPU-only attestation does not provide a complete confidential computing solution.

## GPU attestation architecture

The following diagram provides a high-level view of the GPU attestation architecture and the relationships among the attester, verifiers, and relying party.

![Intel TDX and NVIDIA GPU attestation architecture diagram](/img/gpu-attestation/gpu_attestation_arch.png)

The attester comprises the confidential computing (CC) application and related software running in the trust domain (TD), the Intel TDX-enabled host server, and a local or remote NVIDIA GPU.

Two independent verifiers are involved: the TA service and NVIDIA Remote Attestation Service (NRAS). NRAS verifies the GPU TEE by comparing evidence collected from the driver with reference measurements stored in the NVIDIA Reference Integrity Manifest (RIM) service.

GPU attestation begins when the TA client GPU TEE adapter calls the NVIDIA SDK API to request evidence. The NVIDIA GPU driver on the server where the GPU is installed provides the evidence. The GPU server can be local or remote, but the GPU driver must run on the same server as the GPU.

For composite attestation (options 1 and 1a in the diagram), independent evidence is collected for the Intel TDX TD and NVIDIA H100 GPU. TA verifies the Intel TDX quote and forwards the GPU evidence to the NRAS GPU verification service.

TA extracts the NRAS JWT from the NRAS API response body, verifies its certificate, and embeds the NRAS JWT as a JSON subobject in the TA-issued JWT. This is called _composite_ attestation because it relies on multiple verifiers and the result includes claims from more than one TEE or device.

:::note
For composite attestation with an NVIDIA GPU, TA relies on NRAS to verify the GPU quote and return a JWT. If NRAS is slow or unavailable, TA returns an error instead of an attestation token. A delay can also cause the verifier nonce to expire before the request completes. Add retry logic to the client application to handle these conditions.
:::

For GPU-only attestation (option 2 in the diagram), the TA Python client GPU adapter collects GPU evidence, generates a nonce in NVIDIA's 32-byte hexadecimal format, and sends an attestation request to TA. TA sends the GPU evidence to NRAS for verification, verifies the NRAS JWT certificate, and copies the NRAS JWT claims to the `"nvgpu": {}` section of the TA-issued JWT.

Composite attestation of the CPU TEE and GPU TEE provides a more complete confidential computing solution than GPU-only attestation. The GPU TEE trust model relies on the CPU TEE to establish trust in the GPU and manage data flow and computation over the secure channel between them.

## Python client

The TA Python client supports NVIDIA GPU attestation. Its GPU adapter collects evidence from the NVIDIA GPU driver running on the server where the GPU is installed and sends it to TA for verification.

:::note
Intel TDX and NVIDIA GPU attestation require Ubuntu 24.04 LTS with Linux kernel 6.8 or later.
:::

The **ITAConnector.get_token_v2** method supports both single-device (Intel TDX or GPU) and composite (Intel TDX and NVIDIA H100) attestation.

```python
def get_token_v2(self, tdx_args: GetTokenArgs, gpu_args: GetTokenArgs) -> GetTokenResponse:
```

You must supply either `tdx_args` or `gpu_args`, or both, to **get_token_v2**. If you supply both, the client requests composite attestation.

The **ITAConnector.get_token** method supports single-device attestation for Intel TDX and Intel SGX. It does not support GPU or composite attestation.

## Python CLI

The TA Python CLI for Intel® Trust Domain Extensions (Intel® TDX) and NVIDIA GPUs, **ta-pycli**, attests an Intel TDX trust domain (TD) and NVIDIA GPU with TA.

**ta-pycli** requires **`python-connector`**, **`python-intel-tdx`**, **`python-nvgpu`**, and the NVIDIA Attestation SDK. You must have a configuration file in the **ta-pycli** directory. See the README for details and documentation of the following commands.

**ta-pycli** has three commands: **attest**, **evidence**, and **verify**.

:::note
Root permissions are required to access the configfs-tsm device to collect evidence for Intel TDX attestation. Run the **attest** and **evidence** commands as root. For example: `sudo python3 ta-pycli attest --attest_type tdx+nvgpu`. GPU-only attestation does not require `sudo`.
:::

The **attest** command collects evidence from the attester and sends an attestation request to TA. It requires an `--attest_type` parameter: `tdx`, `nvgpu`, or `tdx+nvgpu`. Use `tdx+nvgpu` for composite attestation of an Intel TDX TD and NVIDIA H100 GPU.

The **evidence** command collects evidence from Intel TDX, the GPU driver, or both, and can save the evidence to a file. It supports the background-check attestation model and is useful for development and testing.

The **verify** command verifies a TA attestation token. It takes a JWT as input and checks the issuer's signing certificates, certificate revocation list (CRL), and expiration date.

## REST API updates

GPU-only and composite Intel TDX and GPU attestation use the `/appraisal/v2/attest` endpoint of the TA REST API.

## GPU JWT example

The following sample shows a basic NVIDIA GPU attestation token as returned from NRAS.

<BasicToken />

## Composite JWT example

The following sample JWT is the result of composite attestation with an Intel TDX TD and an NVIDIA H100 GPU. Each embedded JWT is a subobject identified by `"intel_tee"` or `"nvidia_gpu"`.

<NVIDIA />

## Claims usable in policy

Not all JWT claims can be used in an appraisal policy. The following sample shows an NVIDIA GPU attestation token with claims that can be used in a policy. Claims not shown are informational or not intended for policy use.

<NVIDIA />

This token shows a mixed result: the attestation report is valid, but the GPU measurements do not match. The `x-nvidia-mismatch-measurement-records` and `x-nvidia-mismatch-indexes` claims identify the mismatched measurements. A relying party can use these claims to determine whether the GPU meets its requirements or should be quarantined or taken offline.

## Example appraisals

This section includes sample appraisal policies for GPU attestation results. Most examples are fragments that must be combined to create a complete GPU or composite policy. For more information about appraisal policies, see the Appraisal Policy V2 documentation.

### Secure boot

This policy checks whether Secure Boot is enabled and all GPU measurements match.

```rego

default match := false

match {
    input.nvgpu.secboot == true
    input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-measurements-match"] == true
}
```

### Validate attestation report

This policy checks whether the attestation report is valid.

```rego
default match := false

match {
      input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-attestation-report-cert-chain-validated"] == true
      input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-attestation-report-parsed"] == true
      input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-attestation-report-signature-verified"] == true
}

```

### GPU driver RIM

This policy checks whether the GPU driver RIM is available and valid.

```rego
default match := false

match {    
    input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-driver-rim-schema-validated"] == true
    input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-driver-rim-schema-fetched"] == true
    input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-driver-rim-signature-verified"] == true
    input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-driver-rim-cert-validated"] == true
    input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-driver-rim-driver-measurements-available"] == true
}

```

### GPU VBIOS RIM

This policy checks whether the VBIOS RIM is available and valid.

```rego
default match := false

match {    
    input.nvgpu["x-nvidia-attestation-detailed-result"]['x-nvidia-gpu-vbios-rim-measurements-available'] == true
    input.nvgpu["x-nvidia-attestation-detailed-result"]['x-nvidia-gpu-vbios-rim-schema-fetched'] == true
    input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-vbios-rim-cert-validated"] == true
    input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-vbios-rim-schema-validated"] == true
    input.nvgpu["x-nvidia-attestation-detailed-result"]["x-nvidia-gpu-vbios-rim-signature-verified"] == true
}
```

### GPU hardware info

This policy checks GPU hardware information, such as the driver and VBIOS versions. Replace the example values with the values for your GPU.

This example uses policy v2 syntax. Replace the example values with the values for your GPU.

```rego

import rego.v1

default match := false

match if {    
    input.nvgpu["x-nvidia-gpu-driver-version"] == "535.104.05"
    input.nvgpu.hwmodel == "GH100 A01 GSP BROM"
    input.nvgpu["x-nvidia-gpu-vbios-version"] == "96.00.5E.00.01"
}

```

**\*** Other names and brands may be claimed as the property of others.