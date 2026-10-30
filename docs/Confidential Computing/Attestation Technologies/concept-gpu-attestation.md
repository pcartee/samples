---
title: GPU remote attestation with TA
<<<<<<< HEAD
description: Learn how Trust Authority (TA) attests NVIDIA H100 GPUs with Intel TDX, including composite (CPU and GPU) and GPU-only attestation, the architecture, the Python client and CLI, the REST API endpoint, sample JWTs, policy-usable claims, and example Rego appraisal policies.
=======
description: Learn how TA supports NVIDIA H100 GPU attestation, including Intel TDX and GPU composite workflows, GPU-only attestation, Python client and CLI usage, REST API support, JWT claims, and sample appraisal policies.
>>>>>>> origin/main
author: pcartee
topic: conceptual, attestation, gpu
date: 09/17/2024
uid: gpu.attestation
---

import BasicToken from '../Include/eat/_nv-basic-token.md';
import CompositeToken from '../Include/eat/_composite-gpu-token.md';
import NVIDIA from '../Include/eat/_nvidia-policy-claims.md';

<<<<<<< HEAD
Trust Authority (TA) supports remote attestation for NVIDIA H100 GPU trusted execution environments (TEEs). You can attest a confidential virtual machine (VM) TEE and an NVIDIA H100 GPU in a single composite attestation workflow. This article describes the GPU attestation architecture, TA Python client, CLI, and REST API support, and examples of GPU and composite attestation JSON Web Tokens (JWTs).
=======
TA supports remote attestation for NVIDIA H100 GPU TEEs. You can attest a confidential virtual machine (CVM) TEE and an NVIDIA H100 GPU in a single composite workflow. This article describes the GPU attestation architecture, support in the TA Python client, CLI, and REST API, and examples of GPU and composite attestation JWTs.
>>>>>>> origin/main

:::note
The implementation described here supports on-premises hardware. Cloud-based GPU attestation is outside the scope of this article.
:::

Using a GPU as a TEE extends the capabilities of a CPU TEE. Generative artificial intelligence (GAI) and other demanding workloads use GPU acceleration to achieve acceptable performance. GAI models and parameters can be valuable intellectual property, and these workloads often process sensitive data. A GPU TEE provides a protected execution environment and helps protect workloads and data from unauthorized access and tampering.

<<<<<<< HEAD
However, a GPU alone doesn't provide a complete confidential computing solution. The GPU confidential computing solution relies on a CPU TEE in a confidential VM, enabled by Intel® Trust Domain Extensions (Intel® TDX) 1.x on Intel CPUs. The CPU TEE provides measurements and attestation evidence that help establish trust in the GPU. It also orchestrates secure information transfer to the GPU. The GPU and confidential VM exchange keys to establish an encrypted communications channel.
=======
However, a GPU alone does not provide a complete confidential computing solution. GPU confidential computing relies on a CPU TEE in a confidential VM enabled by Intel® Trust Domain Extensions (Intel® TDX) 1.x on Intel CPUs. The CPU TEE provides measurements and attestation evidence that help establish trust in the GPU. It also orchestrates secure information transfer to the GPU. The GPU and confidential VM exchange keys to establish an encrypted communications channel.
>>>>>>> origin/main

The TA Python client, the CLI for Intel TDX and NVIDIA GPUs, and the TA REST API support two GPU attestation options:

<<<<<<< HEAD
1. **Composite CPU TEE and GPU TEE attestation:** The TA client collects separate evidence from the confidential VM TEE and GPU driver, combines it, and sends it to TA for verification. TA verifies the CPU evidence and sends the GPU quote to NVIDIA Remote Attestation Service (NRAS) for verification. The attestation JWT issued by TA contains CPU TEE claims, GPU claims, and other claims from the TA service. Composite attestation is the preferred method for confidential computing solutions that include a GPU TEE.
2. **GPU-only attestation:** The TA client collects GPU evidence and requests verification. As described earlier, GPU-only attestation doesn't provide a complete confidential computing solution.
=======
1. **Composite attestation for CPU and GPU TEEs:** The TA client collects separate evidence from the confidential VM TEE and GPU driver, combines it, and sends it to TA for verification. TA verifies the CPU evidence and sends the GPU quote to NVIDIA Remote Attestation Service (NRAS) for verification. The attestation JWT issued by TA contains CPU TEE claims, GPU claims, and other claims from TA. Composite attestation is the preferred method for confidential computing solutions that include a GPU TEE.
2. **GPU-only attestation:** The TA client collects GPU evidence and requests verification. As described above, GPU-only attestation does not provide a complete confidential computing solution.
>>>>>>> origin/main

## GPU attestation architecture

The following diagram provides a high-level view of the GPU attestation architecture and the relationships among the attester, verifiers, and relying party.

<<<<<<< HEAD
![Architecture diagram of Intel TDX and NVIDIA GPU attestation. The attester contains an Intel TDX trust domain with a confidential computing app and the Trust Authority client, which connect to an Intel TDX guest and an NVIDIA driver. These collect TEE measurements from the Intel Xeon host CPU and the NVIDIA H100 GPU. The client sends evidence to the verifiers, the Trust Authority SaaS REST API (step 1), which forwards GPU evidence to NVIDIA Remote Attestation Service (step 1a). In GPU-only attestation (step 2), the client sends GPU evidence directly to NVIDIA Remote Attestation Service. The confidential computing app sends the attestation result to a relying party, such as a KBS or KMS.](/img/gpu-attestation/gpu_attestation_arch.png)
=======
![Diagram showing an attester with an Intel TDX trust domain, confidential computing application, TA client, TDX guest, NVIDIA driver, host CPU, and H100 GPU; a relying party; and Intel Trust Authority and NVIDIA Remote Attestation Service as verifiers connected for composite and GPU-only attestation.](/img/gpu-attestation/gpu_attestation_arch.png)
>>>>>>> origin/main

The attester comprises the confidential computing (CC) application and related software running in the trust domain (TD), the Intel TDX-enabled host server, and a local or remote NVIDIA GPU.

Two independent verifiers are involved: the TA service and NVIDIA Remote Attestation Service (NRAS). NRAS verifies the GPU TEE by comparing evidence collected from the driver with reference measurements stored in the NVIDIA Reference Integrity Manifest (RIM) service.

GPU attestation begins when the TA client GPU TEE adapter calls the NVIDIA SDK API to request evidence. The NVIDIA GPU driver on the server where the GPU is installed provides the evidence. The GPU server can be local or remote, but the GPU driver must run on the same server as the GPU.

For composite attestation (options 1 and 1a in the diagram), TA collects separate evidence for the Intel TDX TD and NVIDIA H100 GPU. TA verifies the Intel TDX quote and forwards the GPU evidence to the NRAS GPU verification service.

TA extracts the NRAS JWT from the NRAS API response body, verifies its certificate, and embeds the NRAS JWT as a JSON subobject in the TA-issued JWT. This is called _composite_ attestation because it relies on multiple verifiers and includes claims from more than one TEE or device.

:::note
For composite attestation with an NVIDIA GPU, TA relies on NRAS to verify the GPU quote and return a JWT. If NRAS is slow or unavailable, TA returns an error instead of an attestation token. A delay can also cause the verifier nonce to expire before the request completes. Add retry logic to the client application to handle these conditions.
:::

For GPU-only attestation (option 2 in the diagram), the TA Python client GPU adapter collects GPU evidence, generates a nonce in the NVIDIA 32-byte hexadecimal format, and sends an attestation request to TA. TA sends the GPU evidence to NRAS for verification, verifies the NRAS JWT certificate, and copies the NRAS JWT claims to the `"nvgpu": {}` section of the TA-issued JWT.

Composite attestation of the CPU and GPU TEEs provides a more complete confidential computing solution than GPU-only attestation. The GPU TEE trust model relies on the CPU TEE to establish trust in the GPU and manage data flow and computation over the secure channel between them.

## Python client

The TA Python client supports NVIDIA GPU attestation. Its GPU adapter collects evidence from the NVIDIA GPU driver on the server where the GPU is installed and sends it to TA for verification.

:::note
Intel TDX and NVIDIA GPU attestation require Ubuntu 24.04 LTS with Linux kernel 6.8 or later.
:::

The **ITAConnector.get_token_v2** method supports both single-device attestation (Intel TDX or GPU) and composite attestation (Intel TDX and NVIDIA H100).

```python
def get_token_v2(self, tdx_args: GetTokenArgs, gpu_args: GetTokenArgs) -> GetTokenResponse:
```

Supply `tdx_args`, `gpu_args`, or both to **get_token_v2**. If you supply both, the client requests composite attestation.

The **ITAConnector.get_token** method supports single-device attestation for Intel TDX and Intel SGX. It doesn't support GPU or composite attestation.

## Python CLI

The TA Python CLI for Intel TDX and NVIDIA GPUs, **ta-pycli**, attests an Intel TDX trust domain (TD) and NVIDIA GPU with TA.

<<<<<<< HEAD
**ta-pycli** requires `python-connector`, `python-intel-tdx`, `python-nvgpu`, and the NVIDIA Attestation SDK. You must have a configuration file in the **ta-pycli** directory. For details and documentation of the following commands, see the README.
=======
**ta-pycli** requires **`python-connector`**, **`python-intel-tdx`**, **`python-nvgpu`**, and the NVIDIA Attestation SDK. Create a configuration file in the **ta-pycli** directory. See the README for details about these commands.
>>>>>>> origin/main

**ta-pycli** has three commands: **attest**, **evidence**, and **verify**.

:::note
Root permissions are required to access the configfs-tsm device to collect evidence for Intel TDX attestation. Run the **attest** and **evidence** commands as root. For example: `sudo python3 ta-pycli attest --attest_type tdx+nvgpu`. GPU-only attestation doesn't require `sudo`.
:::

The **attest** command collects evidence from the attester and sends an attestation request to TA. It requires an `--attest_type` parameter with one of these values: `tdx`, `nvgpu`, or `tdx+nvgpu`. Use `tdx+nvgpu` for composite attestation of an Intel TDX TD and NVIDIA H100 GPU.

The **evidence** command collects evidence from Intel TDX, the GPU driver, or both, and can save it to a file. It supports the background-check attestation model and is useful for development and testing.

The **verify** command verifies a TA attestation token. It takes a JWT as input and checks the issuer's signing certificates, certificate revocation list (CRL), and expiration date.

## REST API support

GPU-only attestation and composite attestation for Intel TDX and a GPU use the `/appraisal/v2/attest` endpoint of the TA REST API.

## GPU JWT example

The following sample shows a basic NVIDIA GPU attestation token returned by NRAS.

<BasicToken />

## Composite JWT example

The following sample JWT is the result of composite attestation with an Intel TDX TD and an NVIDIA H100 GPU. Each embedded JWT is a subobject identified by `"intel_tee"` or `"nvidia_gpu"`.

<CompositeToken />

## Claims available for policies

<<<<<<< HEAD
You can't use all JWT claims in an appraisal policy. The following sample shows an NVIDIA GPU attestation token with the claims that you can use in a policy. Claims that aren't shown are informational or not intended for policy use.

<NVIDIA />

This token shows a mixed result: the attestation report is valid, but the GPU measurements don't match. The `x-nvidia-mismatch-measurement-records` and `x-nvidia-mismatch-indexes` claims identify the mismatched measurements. A relying party can use these claims to determine whether the GPU meets its requirements or should be quarantined or taken offline.
=======
Not all JWT claims can be used in an appraisal policy. The following sample shows an NVIDIA GPU attestation token with claims that you can use in a policy. Claims not shown are informational or are not intended for policy use.

<NVIDIA />

This token shows a mixed result: the attestation report is valid, but the GPU measurements do not match. The `x-nvidia-mismatch-measurement-records` and `x-nvidia-mismatch-indexes` claims identify the mismatched measurements. A relying party can use these claims to determine whether the GPU meets its requirements or needs to be quarantined or taken offline.
>>>>>>> origin/main

## Example appraisals

This section includes sample appraisal policies for GPU attestation results. Most examples are fragments that you must combine to create a complete GPU or composite policy. For more information, see the Appraisal Policy V2 documentation.

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

### GPU hardware information

<<<<<<< HEAD
This policy checks GPU hardware information, such as the driver and VBIOS versions. This example uses policy v2 syntax. Replace the example values with the values for your GPU.
=======
This policy checks GPU hardware information, such as the driver and VBIOS versions. This example uses Policy V2 syntax. Replace the example values with those for your GPU.
>>>>>>> origin/main

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
