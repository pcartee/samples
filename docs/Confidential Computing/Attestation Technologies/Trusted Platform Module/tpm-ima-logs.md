---
title: Integrity Measurement Architecture (IMA) logs
description: "Explains Linux Integrity Measurement Architecture (IMA) runtime logs, TPM PCR replay, IMA policy configuration on an Azure confidential VM, and TA appraisal policies for verifying measured files."
author: pcartee
topic: IMA logs
date: 11/14/2024
uid: ima-log
---

The Linux Integrity Measurement Architecture (IMA) is a Linux kernel security
subsystem with three main features: IMA measurement, IMA appraisal, and IMA
audit. IMA policy rule actions activate these features. TA can include IMA
event logs in TPM attestations.

:::note

IMA generates event logs using the hash algorithm set by kernel modules. The
default kernel modules for many current distributions use SHA-256 (for example,
Ubuntu 24.04), while some widely used OS versions default to SHA-1 (for example,
Ubuntu 20.04). For event log replay to work correctly, the TPM must have a PCR
bank enabled for the same algorithm. OEM support for TPM PCR banks varies. Some
manufacturers allow multiple PCR banks to be enabled at the same time, while
others allow only one. Where possible, Intel recommends enabling all PCR banks
on the TPM. This generally ensures that a PCR bank matching the event log
algorithm is available. If this isn't possible, check the kernel flags enabled
for your system.

```bash
cat /boot/config-$(uname -r) | grep CONFIG_IMA_DEFAULT_HASH

# CONFIG_IMA_DEFAULT_HASH_SHA1 is not set
CONFIG_IMA_DEFAULT_HASH_SHA256=y
```

In this example, the default IMA hash algorithm is SHA-256. For event log
replay to work correctly, the TPM must have the SHA-256 PCR bank enabled.

The `pcr_selections` setting in `config.json` defines the PCRs that the
attestation client CLI uses. The selected PCR bank must match the algorithm
used for the event logs so that the CLI uses the correct bank during replay.

:::

## IMA boot-time and runtime measurements

Boot-time measurements capture the system's initial state, while runtime
measurements help maintain integrity during normal operation. The system updates
boot-time measurements only when it boots. It can extend runtime measurements
while the system is powered on.

### IMA runtime measurements

Runtime measurements are taken during normal system operation. They help ensure
that the system remains in a known good state and that unauthorized
modifications do not occur. IMA runtime measurements typically cover:

- Executable files that are loaded and run
- Critical configuration files that are read at runtime
- Kernel modules loaded after startup
- Scripts that are run
- Data files accessed by applications

IMA generates event logs for each measurement event. These logs list, in
order, all measurements extended to the TPM. During attestation, the verifier
(TA) replays the event logs to verify that the resulting measurement matches
the actual PCR value. If the values match, the event log's integrity is
verified, and its content can be trusted for use with appraisal policies.

If event log replay does not match the PCR value, the log is untrustworthy and
its integrity cannot be verified. Attestation returns an error.

Configure an IMA policy on the system to be attested (the attester) to specify
which files or resources to measure. This IMA policy differs from appraisal
policies configured through TA.

#### IMA policy

- Configure this policy on the attester (the system with a TPM) using a text
  file at `/etc/ima/ima-policy`.
- This policy determines which files on the system to measure and the
  conditions under which IMA repeats the measurements.

#### Appraisal policy

- Configure this policy on the verifier (TA) using the Rego policy language.
- This policy specifies the claim values required in an attestation token for
  the policy to match.

To attest a TPM with IMA logs, configure an IMA policy on the attester to
measure the desired files, and configure an appraisal policy in TA to assert
the expected values for those files.

### Integrity Measurement Architecture (IMA) documentation

To learn more about configuring IMA and understanding IMA policies, see the
[Integrity Measurement Architecture (IMA) wiki](https://sourceforge.net/p/linux-ima/wiki/Home/).

## Configure an Azure Confidential VM for vTPM attestation with IMA

<!-- markdownlint-disable MD029 -->

1. Create an Azure confidential virtual machine (CVM) with Intel TDX. Azure's
   vTPM uses Intel TDX as its root of trust, and IMA is enabled by default on
   Azure confidential VMs. However, you must add an IMA policy to measure
   anything beyond the default TCB policy.

:::note

See the Intel TDX Attestation on Microsoft Azure tutorial for guidance on
building an Azure CVM with the required features enabled.

:::

2. Install the TA attestation client CLI on the new Azure confidential VM.

```sh
curl https://raw.githubusercontent.com/intel/ta-client-for-go/main/release/install-tdx-cli-azure.sh | sudo bash -
```

3. Configure the attestation client CLI.

   Configure the required properties before using the `token` and `verify`
   commands. Save the properties and values as JSON in `config.json`. Create
   `~/config.json` with the following content:

   ```json
   {
     "cloud_provider": "azure",
     "trustauthority_url": "https://portal.ta.intel.com",
     "trustauthority_api_url": "https://api.ta.intel.com",
     "trustauthority_api_key": "<trustauthority attestation API key>",
     "tpm": {
       "owner_auth": "",
       "ak_handle": "81000003",
       "pcr_selections": "sha1:10+sha256:all"
     }
   }
   ```

<!-- markdownlint-enable MD029 -->

The `cloud_provider` setting is required only for Microsoft Azure. `owner_auth`
is the TPM owner password, and `ak_handle` is the TPM attestation key handle.
For this release, `owner_auth` is an empty string, and `ak_handle` is set to
`81000003`, the handle of the Azure-provisioned AK in the vTPM. The
`pcr_selections` field specifies which PCRs to include in the attestation
token. The default is all SHA-256 PCRs; however, IMA replay won't verify
without SHA-1 PCR 10.

Use this configuration file when running the attestation client CLI.

### Configure an IMA policy on the Azure confidential VM

An IMA policy specifies which files to measure and under what circumstances.
In this example, you create a policy that measures all files executed by a
specific user.

#### Create a user

Create the `imauser` account for this example. The IMA policy requires a UID,
so this account will run the workload and be named in the policy. This limits
the measurements and helps manage the log size.

1. `sudo useradd -m imauser`

1. `sudo passwd imauser` (enter a password)

1. `sudo id imauser` (use the UID in `ima-policy.txt`; this example assumes
   the UID is `1001`)

1. `sudo usermod -aG tss imauser` (grant access to the TPM)

#### Grant read access to IMA log files

Grant the TSS group read access to the IMA logs so `imauser` can read them.

1. `sudo chgrp tss /sys/kernel/security/ima/ascii_runtime_measurements`

1. `sudo chmod g+r /sys/kernel/security/ima/ascii_runtime_measurements`

#### Deploy the CLI and configuration to the `imauser` home directory

1. `sudo cp ta-cli /home/imauser`

1. `sudo cp config.json /home/imauser`

1. `sudo chown -R imauser:imauser /home/imauser/ta-cli`

1. `sudo chown -R imauser:imauser /home/imauser/config.json`

#### Create `ima-policy.txt` in the `imauser` home directory

This IMA policy is based on the default TCB policy, with additional rules to
monitor processes run by the user created above. It configures IMA to measure
all files executed by `imauser`.

:::note

For more information on IMA policies, see the
[IMA Recipes](https://wiki.gentoo.org/wiki/Integrity_Measurement_Architecture/Recipes).

:::

:::warning

Copying and pasting the policy below may alter its formatting. Ensure that
there are no spaces before text in the file, and verify the formatting before
using it. An incorrectly formatted IMA policy can prevent the system from
booting.

:::

```bash
# https://wiki.gentoo.org/wiki/Integrity_Measurement_Architecture/Recipes
# PROC_SUPER_MAGIC = 0x9fa0
dont_measure fsmagic=0x9fa0
# SYSFS_MAGIC = 0x62656572
dont_measure fsmagic=0x62656572
# DEBUGFS_MAGIC = 0x64626720
dont_measure fsmagic=0x64626720
# TMPFS_MAGIC = 0x01021994
dont_measure fsmagic=0x1021994
# DEVPTS_SUPER_MAGIC=0x1cd1
dont_measure fsmagic=0x1cd1
# BINFMTFS_MAGIC=0x42494e4d
dont_measure fsmagic=0x42494e4d
# SECURITYFS_MAGIC=0x73636673
dont_measure fsmagic=0x73636673
# SELINUX_MAGIC=0xf97cff8c
dont_measure fsmagic=0xf97cff8c
# SMACK_MAGIC=0x43415d53
dont_measure fsmagic=0x43415d53
# CGROUP_SUPER_MAGIC=0x27e0eb
dont_measure fsmagic=0x27e0eb
# CGROUP2_SUPER_MAGIC=0x63677270
dont_measure fsmagic=0x63677270
# NSFS_MAGIC=0x6e736673
dont_measure fsmagic=0x6e736673
dont_measure func=MMAP_CHECK mask=MAY_EXEC
dont_measure func=FILE_CHECK mask=MAY_READ uid=0
dont_measure func=MODULE_CHECK
dont_measure func=FIRMWARE_CHECK

# measure kernel and initramfs
measure func=KEXEC_KERNEL_CHECK
measure func=KEXEC_INITRAMFS_CHECK

# This addition excludes binaries run by root (uid=0) and measures binaries
# run by imauser (uid=1001). This helps monitor the user's workload without
# collecting too much data.
dont_measure func=BPRM_CHECK mask=MAY_EXEC uid=0
measure func=BPRM_CHECK mask=MAY_EXEC uid=1001
```

:::note

The `uid=1001` entry in `ima-policy.txt` is the UID of the `imauser` account
created above. The user-specific `BPRM_CHECK` rule measures files executed by
`imauser`; executions by other users do not trigger that rule. Other IMA policy
rules may measure additional system events. Ensure that the account used to
execute files whose integrity must be measured has the UID specified in the
IMA policy.

:::

1. Deploy the IMA policy. The file `/etc/ima/ima-policy` defines the
   measurements IMA records on the next boot.

   `sudo cp ima-policy.txt /etc/ima/ima-policy`

2. Reboot the Azure VM from the control panel to ensure that the system starts
   with the new policy.

#### Verify the IMA policy

Validate the IMA policy to ensure that it is applied and functioning as
intended.

1. After reboot, inspect the IMA logs:

   `sudo cat /sys/kernel/security/ima/ascii_runtime_measurements`

2. Run a process as `imauser` to generate IMA log entries:

   1. `su - imauser` (enter the password)

   2. `ls` (listing directories generates an IMA log entry for the `ls`
      binary)

   3. `exit` (exiting the shell generates an IMA log entry)

3. Confirm that the IMA policy is working. The output of
   `cat /sys/kernel/security/ima/ascii_runtime_measurements` should include
   `/usr/bin/ls`.

```bash
10 98aa9e41ffe519d74f9a8d20f5f9fdad8b998855 ima-ng sha1:7448a72f7519d1d1564a2456bc178b30673836d6 /usr/bin/ls
```

### Author an appraisal policy for IMA measurements

Collect reference values from the token created in the previous step and use
them to configure an appraisal policy in TA.

1. Create a new attestation token on the system where you configured the IMA
   policy. This ensures that the token claims include the IMA logs containing
   the measurements from this example.

<!-- markdownlint-disable MD029 -->

:::note

Log in as `imauser` first to ensure that the IMA policy measures the files you
run.

:::

```sh
# Azure Confidential VM with vTPM:
sudo ./ta-cli token --tdx --tpm --ima -c config.json

# Physical TPM or vTPM not dependent on Intel TDX:
sudo ./ta-cli token --tpm --ima -c config.json
```

2. The returned token is Base64-encoded. Decode it to read the claims.

```json
  ...other token claims...
  "runtime_measurements": [
    {
      "alg": "SHA-1",
      "index": 10,
      "cumulative_hash": "6128FC2C16F02D...",
      "measurements": [
        {
          "file_path": "/usr/bin/ta-cli",
          "digest": "c25e74f77e121e7a61429..."
        }
```

3. Use the token claims to build an appraisal policy. See the sample policy
   below.

```rego
import rego.v1

default valid_runtime_measurements = false
valid_runtime_measurements = true {
  input.tdx.tdx_mrtd == "b4f3e2748d800711d81fa75d5b4fee1e9..."
  input.tdx.tdx_seamsvn == 4

# This section verifies the integrity of the trust domain. The TD in Azure
# includes the vTPM, so this measurement is needed to maintain the chain of
# trust for Azure confidential VMs. To trust the IMA measurements, trust the
# TPM; to trust the TPM, trust the TD. This tdx_mrtd measurement is uniform
# across Azure confidential VMs for a given version. If Azure updates the TD
# version, this measurement changes and the policy must be updated. Capture
# the value from the token; the claim name is "tdx_mrtd". This section is not
# needed for physical TPMs or vTPMs that do not depend on Intel TDX.

# Example: "tdx_mrtd": "bb379...f2de0d7154"

default ima_cli_rtm_match := false
ima_cli_rtm_match if {
  ima_rtm_match(input.tpm.runtime_measurements, 10, "/home/imauser/ta-cli", "753a72acc9828e99ad8f1b37b8954471e31803f6fee66fda6bad09ecd3dfa534")
}

# The section above invokes the "ima_rtm_match" function, which is defined
# below. It passes the IMA event log from the "tpm.runtime_measurements" claim,
# sets the TPM PCR index to 10 (where IMA extends measurements), sets the event
# file path to "/home/imauser/ta-cli", and asserts the required measurement.

ima_rtm_match(runtime_measurements, idx, fp, dig) := r if {
  fp_digests := [ digest |
    some _, m in [measurements |runtime_measurements[i].index == idx
      measurements := runtime_measurements[i].measurements[_]
    ]
    m.file_path == fp
    digest = m.digest
  ]

  cnt := count(fp_digests)
  cnt > 0
  r := fp_digests[cnt-1] == dig
}

# The "ima_rtm_match" function iterates over the event log measurements for
# the specified PCR index and finds events whose file path matches. If the
# same file path appears more than once, it checks only the latest event.
# Because IMA measures a file at runtime when the specified file is executed,
# this function ignores older measurements and checks only the most recent
# measurement. This allows the policy to detect changes to the executable.
# Note that IMA records only changes in measurements; repeated executions of
# the same binary with the same hash are represented by a single measurement
# event. Attestation must still be triggered for the appraisal policy to be
# evaluated. In this example, the policy checks the attestation client CLI,
# so each attestation request also verifies the integrity of the client that
# provided the evidence.
```

4. Use this file with real digest values captured from the attestation token
   claims and without comments to create an appraisal policy in the TA web UI
   or with the tenant management CLI.

### Demonstrate attestation

Run `ta-cli` as `imauser` and inspect the token claims to verify the policy.

1. Log in to the Azure confidential VM as `imauser`.

```bash
su - imauser
```

2. Run the following command to attest the system using the new IMA appraisal
   policy.

```bash
./ta-cli token --tdx --tpm --ima -c config.json --policy-ids <appraisal policy UUID>
```

<!-- markdownlint-enable MD029 -->

The output includes details such as the EAT profile, intended use, matched
policy IDs, and unmatched policy IDs.

```bash
  ...
  "policy_ids_matched": [
    {
      "id": "<appraisal policy UUID>",
      "version": "v1",
      "hash": "bkxNYT...2dNazczNVJFbnFBZA=="
    }
  ],
  "policy_ids_unmatched": null,
```

If the policy appears in the `policy_ids_matched` array, the evidence matches
the policy assertions. In this example, the policy verifies the Intel TDX
trust domain as the root of trust for the Azure vTPM, the boot-time integrity
of measurements extended to PCR 4 (including the VM's OS kernel), the vTPM
event log integrity, and the execution-time integrity of the TA attestation
client CLI.

### Sample IMA token claim

The following sample IMA token claim in JSON format includes TPM, PCR, and
runtime measurement details.

```json
{
  "tpm": {
    "pcrs": [
      ...
      {
        "alg": "SHA-1",
        "digest": "6128FC2C16F02D...",
        "index": 10
      }
    ],
    "runtime_measurements": [
      {
        "alg": "SHA-1",
        "index": 10,
        "cumulative_hash": "6128FC2C16F02D...",
        "measurements": [
          {
            "file_path": "/usr/bin/ta-cli",
            "digest": "c25e74f77e121e7a61429..."
          }
          ...
        ]
      }
    ]
  }
}
```

### Sample IMA evidence

IMA event logs in `/sys/kernel/security/ima/ascii_runtime_measurements` have
six fields separated by spaces:

- **`10`:** The PCR index.
- **`92bbbb...`:** The PCR value before the measurement was extended.
- **`ima-ng`:** The event type, in this case, Integrity Measurement
  Architecture Next Generation (IMA-NG). The IMA-NG format includes a hash
  algorithm identifier and the object's hash value.
- **`sha1`:** The algorithm used to hash the object.
- **`47f202...`:** The hash value of the measured object.
- **`/usr/lib/modules/6.5`:** The path to the measured file.

```sh
10 92bbbbbb24cdc02f01bb139cbd73fa7d51111958 ima-ng sha1:47f2024b02af118e838ad61aa915b078755aa85c boot_aggregate
10 9a2a67974ba6a9be1a6e5592912e2a14dfe90be5 ima-ng sha1:fd957dec0fcd03e32ada63fd3953599eaf53e679 /usr/bin/bash
10 b9e605c844d52bcbefb07aac6cc7a70377cf55bc ima-ng sha1:c434fdbf2ec9d659c2ba76cf6a23b97d78ec16b1 /usr/bin/groups
10 d6ca063aab29ed50c199f5174b2e068c47876e9a ima-ng sha1:5629b219107447a0bd948100e5eafd82180eba4b /usr/bin/lesspipe
10 042c9ed10b091c35a5e75aa3350ef4583e942c6e ima-ng sha1:42e94914c7800c7063c51d7a17aec3a2069a3769 /usr/bin/dash
...
```

### Sample IMA claims in an attestation token

In an attestation token issued by TA, IMA event log claims appear in the `tpm`
section under `runtime_measurements`. This array represents the measurements
from `/sys/kernel/security/ima/ascii_runtime_measurements` on the attester
whose evidence was used to generate the token.

```json
  ...
  "runtime_measurements": [
    {
      "alg": "SHA-1",
      "index": 10,
      "cumulative_hash": "6128FC2C16F02D...",
      "measurements": [
        {
          "file_path": "/usr/bin/bash",
          "digest": "c25e74f77e121e7a61429..."
        },
        {
          "file_path": "/usr/bin/groups",
          "digest": "c434fdbf2ec9d65..."
        },
        ...
      ]
    }
  ]
```
