---
title: Troubleshoot a local Kubernetes deployment
description: "Troubleshooting guide for a local Kubernetes deployment. Covers expanding bare-metal host storage, recovering namespaces stuck in Terminating, removing stale Porter installation records, resolving Porter secret-read errors, cleaning up stalled object bucket claims, reclaiming container image disk space, and retrieving deployment outputs and logs."
author: pcartee
topic: Local Kubernetes deployment troubleshooting
date: "2025-04-01"
uid: pkg.trouble
--- 

## Expand storage on a bare-metal host

If the host has available storage, follow the guide to [extend the default LVM space on Ubuntu](https://packetpushers.net/blog/ubuntu-extend-your-default-lvm-space/).

## Remove a namespace stuck in the Terminating state

Removing finalizers can leave resources orphaned. First, investigate and remove or repair the resources that are preventing deletion. Only remove finalizers as a last resort, and specify the namespace explicitly; do not automatically select the first namespace in a terminating state.

:::warning
This operation bypasses Kubernetes cleanup safeguards and can leave resources behind. Confirm the namespace and understand why it is stuck before continuing.
:::

Replace `<namespace>` with the namespace you have investigated:

```bash
kubectl get namespace <namespace> -o json \
  | jq '.spec.finalizers = []' \
  | kubectl replace --raw "/api/v1/namespaces/<namespace>/finalize" -f -
```

## Remove a stale Porter installation record

If you removed the k3s cluster without uninstalling the application with Porter, a stale installation record can prevent a new installation. After confirming that the old deployment no longer exists, remove its record:

```bash
porter installations delete <installation-name> -n <namespace> --force
```

## Resolve a Porter filesystem secret-read error

If `porter install` fails with an `rpc error: code = Unknown desc = error reading secret from filesystem` message, verify that the configured secrets plugin and filesystem permissions are correct. If the failed installation left a stale record, confirm that it is safe to remove, then delete it:

```bash
porter installations delete <installation-name> -n <namespace> --force
```

## Remove a stalled object bucket claim

If an ObjectBucketClaim (OBC) is stalled, first check its status and the associated storage resources. Removing finalizers can orphan storage resources, so do this only after investigating the cause and confirming cleanup is safe.

:::warning
Replace `<claim-name>` and `<namespace>` with the verified claim and namespace. This patch bypasses normal finalizer cleanup.
:::

```bash
kubectl patch obc/<claim-name> \
  --namespace <namespace> \
  --type=merge \
  --patch '{"metadata":{"finalizers":null}}'
```

## Reclaim disk space by removing unused images

These commands remove unused Docker and k3s images. Review what will be removed before running them; you might need to download images again.

```bash
docker system prune -a -f
sudo k3s ctr images prune --all
```

## Get deployment outputs and logs

Use the following commands to list installations, view outputs, and retrieve logs. Replace the placeholders with the installation name and namespace. Treat sensitive outputs, such as API keys, as secrets.

```bash
# List installations.
porter installations list -n <namespace>

# List outputs.
porter installations output list -i <installation-name> -n <namespace>

# Show selected outputs.
porter installations output show <output-name> -i <installation-name> -n <namespace>

# Get logs.
porter logs -i <installation-name> -n <namespace>
```
