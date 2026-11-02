---
title: UEFI Event Logs
description: "Explains how TA collects and replays UEFI event logs during TPM attestation, how to write an appraisal policy for Secure Boot, and how to troubleshoot event-log errors."
author: pcartee
topic-type: conceptual
date: 11/14/2024
uid: uefi.log
---

Modern UEFI firmware measures system integrity during boot. It stores these
measurements in event logs that TA can use during remote attestation. The logs
include individual measurement events extended to TPM PCRs 0 through 7 during
boot.

:::note

UEFI generates event logs using the hash algorithm selected by the UEFI
implementation, typically SHA-256. For event log replay to work correctly, the
TPM must have a PCR bank enabled for the same algorithm. OEM support for TPM
PCR banks varies. Some manufacturers allow multiple banks to be enabled at
once, while others allow only one. Where possible, Intel recommends enabling
all PCR banks on the TPM. This generally ensures that a bank matching the event
log algorithm is available. If this isn't possible, check the UEFI event log
at `/sys/firmware/security/tpm0/binary_bios_measurements` and use the hash
length of the event measurements to determine which algorithm the system's
UEFI uses: 16 bytes for SHA-1, 32 bytes for SHA-256, and 48 bytes for SHA-384.

The `pcr_selections` setting in `config.json` defines the PCR bank that the
attestation client CLI uses. It must match the algorithm used for the event
logs so that the CLI selects the correct bank for replay.

:::

## When measurements change

PCR values change at boot when firmware, the boot loader, the OS kernel, or
other components change.

TPM measurements (except some IMA measurements) update only when the system
reboots. If you update the OS kernel, the system does not measure the new
kernel until reboot. UEFI logs are part of boot-time integrity attestation, not
runtime attestation.

## Sample appraisal policy to verify Secure Boot is active

This sample appraisal policy verifies that Secure Boot is enabled and checks
the chain-of-trust requirements.

`tdx.tdx_mrtd` measurement: This value measures the Azure confidential VM
trust domain. It requires Intel® Trust Domain Extensions (Intel® TDX) and is
unique to this version of the Azure trust domain; it may change when Azure
updates the version. Including this measurement in the policy verifies that
the attester (the confidential VM) is an Azure confidential VM with Intel TDX.
This helps verify that the expected vTPM version is in use because Azure
integrates its vTPM implementation with Intel TDX. In effect, Intel TDX is the
"root" of the chain of trust.

`evlog := input.tpm.uefi_event_logs[_]`: The `[_]` notation tells the policy
to iterate over all elements in the event logs claim.

`evlog.index == 7`: Tells the policy to verify that the event's PCR index is 7.
The Secure Boot enablement measurement is extended to PCR 7.

`evlog.type_name == "EV_EFI_VARIABLE_DRIVER_CONFIG"`: Specifies the
measurement event name.

`evlog.details.unicode_name == "SecureBoot"`: Specifies the Unicode name of
the measurement event and identifies the Secure Boot enablement value.

`evlog.details.variable_data == "AQ=="`: Asserts that Secure Boot is enabled.
The value `AQ==` represents True.

To view all claims for the attester, including event logs, generate an
attestation token without a policy. This is a way to capture claims for policy
authoring. The token is Base64-encoded; decode it to view the claims.

You can use the same approach to create policies for other UEFI event logs.

```rego
default valid_evlog_measurements = false
valid_evlog_measurements = true {
  input.tdx.tdx_mrtd == "89b65df57162988700bb27b57b6dfb4fe21d9979bdbbc128cc0d4a291fb07cb6b790ab205ea59216e8bf1de414fc25aa"
  input.tdx.tdx_seamsvn == 4

  evlog := input.tpm.uefi_event_logs[_]
  evlog.index == 7
  evlog.type_name == "EV_EFI_VARIABLE_DRIVER_CONFIG"
  evlog.details.unicode_name == "SecureBoot"
  evlog.details.variable_data == "AQ=="
}
```

## UEFI event logs with TA client

The TA attestation client CLI can collect and include UEFI event logs during
remote attestation.

To request attestation with UEFI event logs, use the `--evl` flag with
`ta-cli token`. The `--evl` option also requires the `--tpm` option.

```bash
sudo ta-cli token --tdx --tpm --evl -c config.json
```

Linux distributions expose event logs for each UEFI measurement event. The
`--evl` option enables UEFI event log collection. By default, the logs are
stored at `/sys/kernel/security/tpm0/binary_bios_measurements`. If your Linux
distribution exposes the logs at a different path, use the `--evl-path` option
to specify the path.

```bash
ta-cli token --evl-path <path> --tdx --tpm --evl -c config.json
```

## Evidence with event logs

The following command collects evidence that includes runtime and UEFI event
logs.

```bash
./ta-cli evidence --tpm --tdx --evl -c config.json > evidence-with-event-logs.json
```

```json
{
 "tdx": {
  "runtime_data": "eyJrZXlzIjpbeyJraWQiOiJIQ0xBa1B1YiIsImtleV9vcHMiOlsic2lnbiJdLCJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsIm4iOiJ1NjkxdWdB9...",
  "quote": "BAACAIEAAAAAAAAAk5pyM/ecTKmUCg2zlX8GBw63EL/H5YFouU/M5DIyGdAAAAAABAEHAAAA=..."
 },
 "tpm": {
  "quote": "/1RDR4AYACIACy5qBmpdQckwKSj1obbaeHK1cdtpOCrctXVdXwDNeVo3AAAAAAAAZsI7wwAAAAUAAAAAASAgAxIAEgADAAAA=...",
  "signature": "ABQACwEAL4ucHZfySxfFepu25GGhs9CzLPITM36q/WHsAY+ATk6FhNqvFS3mXa+cshU6vg==...",
  "pcrs": "Qtj1VpAaTLqbxS0yxFnGxwoK11xTOsQgJd15V3Zy5A0Dr0oq/1P5g9s4ZSusAXpJIhX/+mFDhuS1l7EyXOECiy4PbhSXaULl7RlLyblKB0dfe5gIPUWM/lXMA+ofRD8VYr7sjfUcdeFKn8+acjShPxmOeWk9RYz+VcwDAAAAA=...",
  "uefi_event_logs": "AAAAAAMAAAAAAAvp3WQMyTb1gKPTnj3hLrh3Kiqt8S90hxaoZoyP1l70YUERddmlcspEMzLXxY7i9mvp3WQMyTb1gKPTnj3hLv8qkFEXyAUXBqq3fSmibmLZo43iVt/+t3oO7IZmq9mvp3WQMyTb1gKPTnj3hLyHWuio21RB/dX/.CeTtfTMKWHM6W9mvp3WQMyTb1gKPTnj3hLeDZGW9/652jvrty6qLV4e69RsnkqAg6A40Gj+CT/Tnj3hLpLP+4yTSXFP7XLSGMNyA3X7njBqsjI3uqSc5aZfjO869mvp3WQMyTb1gKPTnj3hLqYPnPle98BTJopMxKQ7offN/l8gdvMQ8bJM/4iCcC9W9mvp3WQMyTb1gKPTnj3hLtCBQnQ1pspRjP9euLDaytUnUWmqGPvFoQ6ERahESf1a9mvp3WQMyTb1gKPTnj3hLzoxE4YX6qgOVnPIyKWB4VO9+MW7Qdz1m175eCkgGHeW9mvp3WQMyTb1gKPTnj3hL6AijN+1pEe9WHCfKusq/TqbW4g+3D1QTsSGsJRq8wQy9mvp3WQMyTb1gKPTnj3hL6ccbfNWk3wukjSykjmxGjmVyV/c/ZgF95F4Y7nRu19W9mvp3WQMyTb1gKPTnj3hL/TBiNY4OHcTDpgOA7xvf1MUfRHO4YAk32SHfRy+/m2W9mvp3WQMyTb1gKPTnj3hLZWJaFD0iDqGE29XN+xuenDvZZUKU6qK5hii8Jz68GLW9mvp3WQMyTb1gKPTnj3hLgAQjzrfkdZYhpixym6vIH1MlnZX3ZFciStYBVCt7JtS9mvp3WQMyTb1gKPTnj3hLAyj33RK1Uu+nqeCDcwMzuF8/+w9O2G9mvp3WQMyTb1gKPTnj3hLCfdpljHBjbDDNJHrSzxluPJ5I4xfxeOrC6UnN9u9JvO9mvp3WQMyTb1gKPTnj3hL+YPVijrCXyq9mvp3WQMyTb1gKPTnj3hLaRujQU54YiWBvFGbrwvLFvsmLTq72GOfPg7KKin5lAa9mvp3WQMyTb1gKPTnj3hLbOHymG8MRmg7oH0pbQqERI7PdsadsYP+KcNu7Y+ofRD8VYr7sjfUcdeFKn8+vV6mYVxA9C9EptvroCgAAABFeGl0IEJvb3QgU2VydmljZXMgUmV0dXJuZWQgd2l0aCBTdWNjZXNz..."
 }
}
```

## Errors

Errors can occur under the following conditions:

- When the system is booted to legacy BIOS mode instead of UEFI.
- When `/sys/firmware/security/tpm0/binary_bios_measurements` is not the current path or does not exist, or the current user doesn't have permission to access the path.
- If the Linux user collecting TPM evidence does not have read access to `/sys/kernel/security/tpm0/binary_bios_measurements`.

For attestation to succeed, all provided event logs must pass replay checks.
Replay applies each measurement extension event in the log and compares the
final measurement with the actual PCR value. This integrity check verifies
that the event log can be trusted. If replay for any PCR does not match the
actual PCR value, the log is considered untrustworthy and attestation returns
an error.
