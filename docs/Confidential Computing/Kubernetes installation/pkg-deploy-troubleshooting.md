---
title: Maintain and troubleshoot a local deployment
description: "Maintenance and troubleshooting guide for a local Kubernetes deployment. Covers refreshing TPM endorsement certificates and trusted execution environment collateral, refreshing certificate revocation lists (CRLs), uninstalling the application or k3s, expanding Linux logical volumes, and configuring Docker proxies."
author: pcartee
topic: Local deployment maintenance and troubleshooting
date: "2025-04-09"
uid: pkg.deploy.troubleshooting
--- 

This guide covers maintenance and troubleshooting for a local Kubernetes deployment. It explains how to refresh Trusted Platform Module (TPM) endorsement certificates, manage trusted execution environment (TEE) collateral, refresh certificate revocation lists (CRLs), uninstall the application or k3s, expand Linux logical volumes, and configure Docker proxies.

### Refresh TPM endorsement certificates

The deployment downloads TPM endorsement certificates from an external URL during initial setup. Refresh the certificates periodically to get the latest versions.

1. Set the environment variables.

   ```bash
   # Namespace for the application deployment.
   export APP_NAMESPACE=<application-namespace>

   # AWS CLI image. Do not change.
   export AWS_CLI_IMAGE=amazon/aws-cli

   # Ubuntu image. Do not change.
   export UBUNTU_IMAGE=ubuntu

   # Set these variables if the environment uses a proxy.
   export HTTP_PROXY
   export HTTPS_PROXY
   export NO_PROXY

   # Public URL for the Microsoft TPM certificates. Do not change.
   export MS_TPM_CERTS_URL=https://go.microsoft.com/fwlink/?linkid=2097925

   # kubectl timeout, in minutes.
   export KUBECTL_TIMEOUT=10m0s

   export DOLLAR=$
   ```

1. Apply the certificate configuration. Replace `<redacted-manifest-path>` with the path to the deployment's certificate manifests.

   ```bash
   kustomize build <redacted-manifest-path> | envsubst | kubectl apply --timeout "${KUBECTL_TIMEOUT}" --filename -
   ```

1. Restart the certificate provisioning deployment. Replace `<redacted-deployment>` with its deployment name.

   ```bash
   kubectl rollout restart deployment <redacted-deployment> --namespace "$APP_NAMESPACE"
   ```

### Refresh TEE collateral

Publish updated collateral containers monthly.

Set the environment variables for the collateral container.

```bash
# Namespace for the application deployment.
export NAMESPACE=<application-namespace>

# Name of the collateral container.
export DATA_CONTAINER_NAME=<container-name>

# Registry where the collateral container is stored.
export CONTAINER_REGISTRY=<container-registry>

# Image name for the collateral container.
export DATA_CONTAINER_IMAGE_NAME=<image-name>

# Image tag for the collateral container.
export DATA_CONTAINER_IMAGE_TAG=<image-tag>
```

Update the collateral deployment to use the new image.

```bash
kubectl patch deployment <redacted-deployment> --namespace "$NAMESPACE" \
  --patch "{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"$DATA_CONTAINER_NAME\",\"image\":\"$DATA_CONTAINER_IMAGE_NAME:$DATA_CONTAINER_IMAGE_TAG\"}]}}}}"
```

Restart the deployments that consume the collateral. Replace the placeholders with the deployment names for your application.

```bash
kubectl rollout restart deployment <redacted-deployment-1> --namespace "$NAMESPACE"
kubectl rollout restart deployment <redacted-deployment-2> --namespace "$NAMESPACE"
kubectl rollout restart deployment <redacted-deployment-3> --namespace "$NAMESPACE"
```

### Refresh CRLs

The Helm installation creates a custom resource (CR) for the certificate operator. To inspect it, run:

```bash
kubectl get <redacted-resource-type> --namespace "$NAMESPACE" --output yaml
```

The following example shows the CR's general structure. Replace the generic names and values with those used by your deployment.

```yaml
apiVersion: v1
items:
- apiVersion: <redacted-api-group>/v1
  kind: CertificateOperator
  metadata:
    labels:
      app.kubernetes.io/managed-by: kustomize
      app.kubernetes.io/name: certificate-operator
      cleanup-by-application: "true"
    name: certificate-operator
    namespace: <application-namespace>
  spec:
    crls:
      certificate-a-crl:
        expiresInDays: 29
        refreshBeforeInDays: 5
        refreshCheckInHours: 6
        renewCommand:
          command:
          - <certificate-a-renew-command>
          force: true
      certificate-b-crl:
        expiresInDays: 29
        refreshBeforeInDays: 5
        refreshCheckInHours: 6
        renewCommand:
          command:
          - <certificate-b-renew-command>
          force: true
      certificate-c-crl:
        expiresInDays: 29
        refreshBeforeInDays: 5
        refreshCheckInHours: 6
        renewCommand:
          command:
          - <certificate-c-renew-command>
          force: true
      root-certificate-crl:
        expiresInDays: 29
        refreshBeforeInDays: 5
        refreshCheckInHours: 6
        renewCommand:
          command:
          - <root-certificate-renew-command>
          force: true
kind: List
metadata:
  resourceVersion: ""
```

The operator refreshes CRLs automatically according to `refreshBeforeInDays`.

To force a refresh for a specific CRL, edit the custom resource and set its `refreshBeforeInDays` value to `0`:

```bash
kubectl edit <redacted-resource-type> --namespace "$NAMESPACE"
```

### Uninstall the application

```bash
cd <redacted-deployment-directory> \
  && source <deployment-environment-file> \
  && porter uninstall <application-name> -n <application-namespace> -f <redacted-porter-manifest>
```

### Uninstall k3s (optional)

```bash
sudo systemctl stop k3s
sudo /usr/local/bin/k3s-uninstall.sh
```

## Miscellaneous

### Expand logical volumes

1. Check the volume group allocation.

   :::note
   The command can display multiple volume groups. Select the group that you want to expand.
   :::

    ![Volume group display](/img/pkgsw/vgdisplay.png)

2. The current `Alloc PE/Size` can be expanded if there is sufficient space available in `Free PE/Size`. This allows the volume to grow. Use the following command to perform the expansion:

   ```bash
   # NOTE: The path of the file-system-volume can be obtained using `df -h`
   sudo lvextend -L <expand-size> <full-path-of-the-file-system-volume>
   # e.g: sudo lvextend -L 200G /dev/mapper/ubuntu--vg-ubuntu--lv
   ```

   For background information, see [Create an LVM partition in Linux](https://www.linuxtechi.com/how-to-create-lvm-partition-in-linux/).

   :::danger
   Do not run `lvreduce` on a volume that contains the system boot partition. Use separate volume groups for the boot partition and other data.
   :::

### Configure a Docker proxy

Complete the [Docker post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/), if needed. To configure a proxy, see the Docker documentation for the [daemon](https://docs.docker.com/engine/daemon/proxy/) or the [CLI](https://docs.docker.com/engine/cli/proxy/).
