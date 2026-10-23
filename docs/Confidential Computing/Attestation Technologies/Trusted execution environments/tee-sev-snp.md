---
title: AMD SEV-SNP
description: Overview of AMD SEV-SNP isolation, Linux kernel support, and attestation.
author: pcartee
topic: conceptual
date: 05/20/2025
uid: tee.sev.snp
---

*AMD Secure Encrypted Virtualization–Secure Nested Paging (AMD* SEV-SNP) provides a secure computing environment for virtual machines by isolating them from the hypervisor and other virtual machines on the host. This enables hardware-isolated virtual machines.

Read more about [AMD* SEV-SNP](https://www.amd.com/en/developer/sev.html).

## AMD SEV-SNP driver support in the kernel

AMD* SEV-SNP requires driver support at the kernel level. On Linux, this support requires a development kernel with IOMMU enabled in the BIOS because the SNP patches have not been merged into the main Linux kernel.

See [AMDSEV](https://github.com/AMDESE/AMDSEV/blob/snp-latest/stable-commits) for more information on kernel support.

## Attestation

A signed attestation report validates the system's state and identity and helps confirm that it is genuine AMD hardware. Attestation provides confidence in the guest configuration, launch, and platform configuration.

AMD* SEV-SNP attestation uses V2 policies and a new V2 appraisal API endpoint.

## Related tutorials

- [TA Client Tutorial for Azure with vTPM and TDX](../../Tutorials%20and%20examples/Intel%20Trust%20Authority%20Client%20examples/tutorial-azure-vtpm.md)
- [TA Client Tutorial for SEV-SNP on Google Cloud Platform](../../Tutorials%20and%20examples/Intel%20Trust%20Authority%20Client%20examples/tutorial-sevsnp-gcp.md)

**\*** Other names and brands may be claimed as the property of others.
