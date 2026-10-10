---
title: Deploy Kubernetes for a local deployment
description: "Guide to preparing an Ubuntu host and deploying a local Kubernetes cluster with k3s (v1.30.9+k3s1) and Calico (v3.29.1). Covers package installation, inotify limits, cluster initialization, KUBECONFIG configuration, Calico CNI setup, and verifying that pods are running."
author: "Redacted"
topic: Local Kubernetes cluster deployment with k3s and Calico
date: "2025-04-09"
uid: pkg.deploy.kubernetes
--- 

## Deploy Kubernetes


This guide explains how to prepare an Ubuntu server for a local application, install a Kubernetes cluster with `k3s`, and configure Calico as the cluster's Container Network Interface (CNI).

### Install prerequisites

:::note
These steps apply to both trusted execution environment (`TEE`) and non-TEE deployments.
:::

1. Update and upgrade the packages.

   ```bash
   sudo apt-get update
   sudo apt-get upgrade -y
   ```

1. Install the required packages.

   ```bash
   sudo apt-get install ca-certificates curl unzip wget msr-tools jq bzip2 make -y
   ```

1. Install [Docker](https://docs.docker.com/engine/install/ubuntu/).

   :::note
   If your network uses a proxy, configure Docker to use it before continuing.
   :::

1. Install [Porter](https://porter.sh/docs/getting-started/install-porter/#install-or-upgrade).

   :::note
   Set `VERSION` to `latest` to install the latest Porter release.
   :::

   ```bash
   export VERSION="latest"
   curl -L https://cdn.porter.sh/$VERSION/install-linux.sh | bash
   ```

1. Add the Porter configuration to `~/.profile`:

   ```bash
   export PORTER_DEFAULT_SECRETS_PLUGIN=filesystem
   ```

### Increase inotify limits

Run these commands once on each host to help prevent "Too many open files" errors.

```bash
sudo -E /bin/bash -c 'echo "fs.inotify.max_user_watches = 524288" >> /etc/sysctl.conf'
sudo -E /bin/bash -c 'echo "fs.inotify.max_user_instances = 512" >> /etc/sysctl.conf'
sudo sysctl -p
```

### Set up the Kubernetes cluster

1. Install `k3s`.

   ```bash
   curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.30.9+k3s1 INSTALL_K3S_EXEC="--write-kubeconfig-mode "0644" --cluster-init --flannel-backend=none --disable=traefik --disable-network-policy --cluster-cidr 192.168.0.0/16 --tls-san `hostname`" sh -
   ```

1. Set the `KUBECONFIG` environment variable.

   ```bash
   export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
   ```

1. Set up the Container Network Interface (CNI).

   The following configuration uses Calico for cluster networking and enables container IP forwarding.

   :::note
   Copy and paste the commands carefully. Do not add extra spaces.
   :::

   ```yaml
   kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.29.1/manifests/tigera-operator.yaml

   cat << EOF | kubectl apply -f -
   ---
   kind: Installation
   apiVersion: operator.tigera.io/v1
   metadata:
     name: default
   spec:
     variant: Calico
     calicoNetwork: 
       containerIPForwarding: Enabled
   EOF
   ```

1. Wait until all pods are running.

   ```bash
   kubectl get pods -A
   ```

   ```text
   NAMESPACE         NAME                                       READY   STATUS    RESTARTS        AGE
   calico-system     calico-kube-controllers-56f5dd5bb4-stpmp   1/1     Running   0               4h40m
   calico-system     calico-node-5h77s                          1/1     Running   0               4h40m
   calico-system     calico-typha-5d5d97b9dc-pftrt              1/1     Running   0               4h40m
   calico-system     csi-node-driver-rthjj                      2/2     Running   0               4h40m
   kube-system       coredns-7b98449c4-66ndj                    1/1     Running   0               4h51m
   kube-system       local-path-provisioner-595dcfc56f-rbkzx    1/1     Running   0               4h51m
   kube-system       metrics-server-cdcc87586-dccwq             1/1     Running   0               4h51m
   tigera-operator   tigera-operator-7bc55997bb-jrs8n           1/1     Running   1 (4h41m ago)   4h43m
   ```
