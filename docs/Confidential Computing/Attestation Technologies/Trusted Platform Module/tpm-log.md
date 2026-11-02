---
title: Trusted Platform Module (TPM) event logs
description: "Explains TPM and vTPM attestation, PCR measurements, boot-time and runtime event logs, PCR replay, and how event logs support selective verification and troubleshooting."
author: pcartee
topic-type: conceptual
date: 10/25/2024
uid: tpm.log
---

TPMs have 24 Platform Configuration Registers (PCRs). These registers contain
hash measurements based on many measurement events. Most events occur during
boot (UEFI events), and others occur at runtime (IMA events). You can use PCR
measurements to verify the integrity of parts of the system.

## TPM and vTPM attestation

A Trusted Platform Module (TPM) is a device that provides several security
functions. A virtual TPM (vTPM) provides TPM functions to virtual machines in
software, typically in the hypervisor.

During boot, the system measures components such as UEFI, the OS kernel, and
the boot loader before execution. These measurements can help detect
modifications or other unauthorized changes to those components.

## TPM event logs and system integrity

PCRs contain hash measurements based on various events, which can occur during
boot (such as UEFI events) or at runtime (such as IMA events).

TCG event logs (UEFI event logs) support boot-time platform attestation and
are verified by replaying them against PCRs. IMA logs record runtime file
measurements and can also be replayed against PCRs.

Each of a TPM's 24 PCRs can be extended with multiple measurement events. The
`pcr_extend` process concatenates the existing PCR value with the new
measurement hash, then hashes the combined value to calculate the new PCR
value. Each PCR value can therefore serve as cryptographic evidence of the
integrity of all system elements extended to that PCR. However, you cannot
reverse a PCR value to recover the individual measurement events.

## The Challenge of PCR Measurements

PCR measurements provide information about system integrity, but they do not
reveal the individual events that produced the final PCR values. This makes it
difficult to create human-readable attestation policies or identify the cause
of a mismatch between expected and actual PCR values.

For example, PCR 7 includes measurements related to the UEFI configuration,
including Secure Boot status, boot manager code and configuration, and option
ROM code and configuration. A policy that asserts a specific PCR 7 value can
verify the integrity of all these elements, but it cannot identify which one
changed if the values do not match. You might want to verify only the Secure
Boot state and disregard the other measurements, but you cannot do this by
asserting PCR values alone.

Some PCRs also contain "fragile" measurements that might change on every boot
or differ between identically configured systems. In these cases, the PCR
value alone might not be sufficient to verify a component's integrity.

## Leveraging Event Logs

Attestation can include event logs to address the limitations of relying only
on PCR values. Event logs list the events measured for each PCR. Replaying a
log and comparing the result with the PCR value verifies the integrity of the
log. After verifying the log's integrity, you can evaluate its individual
measurements. For example, a policy can assert that Secure Boot is enabled
without asserting a specific PCR 7 value. Attestation replays the full PCR 7
event log and checks the Secure Boot state against the policy. If replay does
not match the PCR, attestation returns an error.

## Benefits of Using Event Logs

Using TPM event logs instead of fragile PCR values offers several benefits:

1. **Selective verification:** Event logs let you use policies to verify
   specific system elements. This allows you to focus on critical components,
   such as Secure Boot status, without asserting unrelated measurements.

2. **Enhanced troubleshooting:** If attestation fails, event logs can help
   identify which system elements changed, simplifying troubleshooting.

3. **Readable information:** Event logs are easier to interpret than PCR
   values or complex TCG specifications, helping users understand the
   measurements and system integrity status.

4. **Mitigating PCR fragility:** Event logs can help address the fragility of
   PCR values and support a more reliable attestation process. In many cases,
   you do not need to know the measurement value. Instead, assert the event
   data you want to verify and let event log replay verify the measurements.
