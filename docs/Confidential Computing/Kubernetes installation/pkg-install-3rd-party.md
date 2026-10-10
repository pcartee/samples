---
title: Install third-party components for a Kubernetes deployment
description: "Guide to preparing a single-node k3s cluster and installing third-party Kubernetes components for a local application. Covers Helm, Kustomize, Calico, secret management, certificate management, Istio, node feature discovery, hardware device plugins, PostgreSQL, deployment prerequisites, and a local authenticated Docker registry."
author: pcartee
topic: Third-party Kubernetes components for local deployment
date: "2024-12-12"
uid: pkg.deploy.3rd.party
---

This guide describes how to prepare a single-node Kubernetes cluster with k3s and install the third-party components required by a local application. Run the commands on the host server.

## Install Helm and Kustomize

Helm and Kustomize are tools for managing Kubernetes applications and configuration.

### Install Helm

Helm is a package manager for Kubernetes. It uses charts—collections of files that define Kubernetes resources—to install and manage applications.

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
sudo chmod +x /usr/local/bin/helm
```

### Install Kustomize

Kustomize customizes Kubernetes YAML configurations without changing the original files. Use overlays to adapt a shared base configuration for different environments, such as development, staging, and production.

```bash
curl -s https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh | bash
sudo mv kustomize /usr/local/bin/
```

## Set up k3s management services

k3s is a lightweight Kubernetes distribution designed to run on a single server. The following commands create a cluster and configure the `kubectl` client.

1. Install k3s.

   ```bash
   curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.29.9+k3s1 INSTALL_K3S_EXEC="--write-kubeconfig-mode 0600 --cluster-init --flannel-backend=none --disable=traefik --disable-network-policy --cluster-cidr 192.168.0.0/16 --tls-san $(hostname)" sh -
   sudo chown -R $USER:$USER /etc/rancher/k3s/
   export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

   kustomize build --enable-alpha-plugins --enable-exec infra/cni | kubectl create -f -
   ```

1. Wait for the k3s pods to start and reach the **Ready** state. This can take five minutes or longer. The `/etc/rancher/k3s/k3s.yaml` file contains administrative credentials and cluster connection information. Restrict access to this file and do not share it.

   ```bash 
   watch kubectl get pods -A
   ```

### Install add-ons

The application requires several additional plugins and services.

#### Hardware device plugin operator

The device plugin operator manages hardware devices that can be allocated to Kubernetes workloads. It can:

* Identify nodes with supported hardware.
* Configure device plugins and make hardware resources available to workloads.
* Support hardware-backed trusted execution workloads.

:::note
Build the required device plugin container image from source. See the build instructions below.
:::

#### Calico CNI

The Container Network Interface (CNI) defines how Kubernetes pods connect to a network. Calico provides networking and network security for containers and virtual machines. Follow the [Calico quick start guide for k3s](https://docs.tigera.io/calico/latest/getting-started/kubernetes/k3s/quickstart) to install it.

#### External Secrets Operator v0.10.0

External Secrets Operator v0.10.0 synchronizes secrets from external providers, such as AWS Secrets Manager, Azure Key Vault, and HashiCorp Vault, into Kubernetes. See the [installation guide](https://external-secrets.io/v0.10.7/introduction/getting-started/).

#### HashiCorp Vault KV

HashiCorp Vault KV stores secrets, such as API keys, passwords, and certificates, and controls access to them. It also supports dynamic secrets, encryption services, and audit logs. See the [Vault installation guide](https://developer.hashicorp.com/vault/docs/install).

#### cert-manager

cert-manager automates TLS certificate issuance, renewal, and deployment in a Kubernetes cluster. See the [cert-manager Helm installation guide](https://cert-manager.io/v1.6-docs/installation/helm/).

#### Istio 1.24.1

Istio 1.24.1 manages traffic between services and provides security and observability features. See the [Istio Helm installation guide](https://istio.io/latest/docs/setup/install/helm/).

#### Istio CNI

The Istio CNI node agent configures networking for Istio sidecar proxies without requiring privileged access to the host network. See the [Istio CNI installation guide](https://istio.io/latest/docs/setup/additional-setup/cni/).

#### Istio ingress gateway v1.24.1

The Istio ingress gateway manages traffic entering the service mesh. See the [Istio gateway guide](https://istio.io/latest/docs/setup/additional-setup/gateway/).

#### Node Feature Discovery

Node Feature Discovery (NFD) detects hardware features on cluster nodes and advertises them with node labels. These labels help Kubernetes schedule workloads that require specific hardware. See the [NFD Helm deployment guide](https://kubernetes-sigs.github.io/node-feature-discovery/v0.16/deployment/helm.html#deployment).

#### Device plugins operator

Device plugins let Kubernetes schedule and allocate supported hardware resources, such as accelerators, to containers. Use the approved hardware vendor's device plugin operator chart for installation guidance.

#### Trusted execution service manager

The trusted execution service manager supports the lifecycle and communication of hardware-isolated workloads. Follow your platform's approved build and deployment process to create its container image and deploy the service.

#### External Secrets Operator

External Secrets Operator synchronizes secrets from external secret management systems, such as AWS Secrets Manager and HashiCorp Vault, into Kubernetes. See the [installation guide](https://external-secrets.io/v0.10.7/introduction/getting-started/).

#### HashiCorp Vault

Vault stores and controls access to secrets, such as API keys, passwords, and certificates. It supports dynamic secrets, encryption, and audit logging. See the [Vault Helm chart](https://artifacthub.io/packages/helm/hashicorp/vault).

#### PostgreSQL 16.3.0

PostgreSQL is an open-source relational database for storing and querying structured data. See the [Bitnami PostgreSQL chart](https://artifacthub.io/packages/helm/bitnami/postgresql) for installation instructions.

#### Build the hardware plugin container

1. Clone the approved hardware plugin repository.
1. Build the required container image.
1. Tag and push the image to your container registry.

#### Extract the deployment archive

:::note
If the deployment archive is not available for your release, contact your software provider for help installing these prerequisites.
:::

1. Extract the archive.

   Replace the archive and directory placeholders with the actual names before running these commands.

   ```bash
   tar -xvf "<archive-file>"
   cd "<deployment-directory>"
   export DEPLOYMENT_DIR="$PWD"
   ```

1. Install the Container Network Interface (CNI).

   ```bash
   kubectl create -k "$DEPLOYMENT_DIR/infra/cni"
   ```

   Wait for the pods to start:

   ```bash
   watch kubectl get pods -A
   ```

1. Update the variables in `quick-start.env`.

   ```bash
   export POSTGRES_PASSWORD="$(printf '%s' '<set-password>' | base64 -w 0)"
   export CONTAINER_REGISTRY_SECRET_NAME="<registry-secret-name>"
   export APP_IMAGE_REGISTRY_NAME="<registry-name>"
   export APP_IMAGE_NAME="<image-name>"
   export APP_IMAGE_TAG="<image-tag>"
   ```

   :::warning
   These variables are user-defined. Ensure the registry name, image name, and image tag match the values used when you pushed the hardware plugin image. Base64 encoding does not encrypt the database password. Use an approved secret-management system, and do not commit the password or populated environment file to source control.
   :::

1. Deploy the base controllers.

   ```bash
   source quick-start.env && kustomize build "$DEPLOYMENT_DIR/infra/base/" | envsubst | kubectl apply -f -
   ```

   Wait for the controller pods to start:

   ```bash
   watch kubectl get pods -A

   NAMESPACE                NAME                                                 READY   STATUS      RESTARTS   AGE
   cert-manager             cert-manager-974688dfd-7fjml                         1/1     Running     0          17m
   cert-manager             cert-manager-cainjector-6687cc685b-sbqmq             1/1     Running     0          17m
   cert-manager             cert-manager-webhook-b8cdf84f-62gcz                  1/1     Running     0          17m
   istio-system             istio-cni-node-4dn2z                                 1/1     Running     0          30s
   istio-system             istiod-57c4496b9b-fp8tm                              1/1     Running     0          29s
   kube-system              coredns-7b98449c4-vmk9m                              1/1     Running     0          22m
   kube-system              helm-install-base-8jdjs                              0/1     Completed   0          34s
   kube-system              helm-install-cert-manager-kh7sn                      0/1     Completed   0          17m
   kube-system              helm-install-cni-d452h                               0/1     Completed   0          32s
   kube-system              helm-install-eck-operator-xhr92                      0/1     Completed   0          17m
   kube-system              helm-install-istiod-rk488                            0/1     Completed   0          32s
   kube-system              helm-install-jaeger-operator-fq6pj                   0/1     Completed   2          17m
   kube-system              helm-install-nfd-mqfmr                               0/1     Completed   0          17m
   kube-system              local-path-provisioner-595dcfc56f-vwmbw              1/1     Running     0          22m
   kube-system              metrics-server-cdcc87586-hmrt6                       1/1     Running     0          22m
   node-feature-discovery   nfd-node-feature-discovery-gc-75c8dd6575-9kw8k       1/1     Running     0          17m
   node-feature-discovery   nfd-node-feature-discovery-master-6b65fb4bf8-hxw9r   1/1     Running     0          17m
   node-feature-discovery   nfd-node-feature-discovery-worker-4ptdw              1/1     Running     0          17m
   ```

1. Deploy the database, key management, and application certificates:

   ```bash
   source quick-start.env && kustomize build "$DEPLOYMENT_DIR/infra/bootstrap/" | envsubst | kubectl apply -f -
   ```

   Wait until the certificates show **Ready**:

   ```bash
   watch kubectl get certificates -A
   ```

1. Deploy the remaining prerequisites:

   ```bash
   source quick-start.env && kustomize build "$DEPLOYMENT_DIR/infra/components/" | envsubst | kubectl apply -f -
   ```

   Wait for the pods to start:

   ```bash
   watch kubectl get pods -A

   NAMESPACE                   NAME                                                     READY   STATUS      RESTARTS        AGE
   calico-system               calico-kube-controllers-7bf877c685-qklnp                 1/1     Running     0               26m
   calico-system               calico-node-4k5qq                                        1/1     Running     0               26m
   calico-system               calico-typha-5d69fbbf5c-blsjb                            1/1     Running     0               26m
   calico-system               csi-node-driver-tfffh                                    2/2     Running     0               26m
   cert-manager                cert-manager-98c64c5bd-mxnlv                             1/1     Running     0               20m
   cert-manager                cert-manager-cainjector-5f67bf667f-spqw8                 1/1     Running     0               20m
   cert-manager                cert-manager-webhook-749d497c97-swvnn                    1/1     Running     0               20m
   external-secrets            external-secrets-788d7cb874-zmclp                        1/1     Running     0               3m19s
   external-secrets            external-secrets-cert-controller-7486467698-xmk95        1/1     Running     0               3m19s
   external-secrets            external-secrets-webhook-794bd6b8f7-fdb2m                1/1     Running     0               3m19s
   hardware-plugin-system      hardware-service-zz7xm                                   1/1     Running     0               2m52s
   hardware-plugin-system      hardware-device-plugin-sample-vr4lq                      1/1     Running     0               2m59s
   hardware-plugin-system      hardware-plugin-controller-manager-5fb59fd569-xngtc      2/2     Running     0               3m19s
   istio-system                istio-cni-node-wnxcx                                     1/1     Running     0               20m
   istio-system                istiod-9d774d6f9-r2hcr                                   1/1     Running     0               20m
   application                 istio-ingressgateway-application-8b446675b-kk6c7         1/1     Running     0               3m20s
   kube-system                 coredns-559656f558-5lnd8                                 1/1     Running     0               28m
   kube-system                 helm-install-cert-manager-d5h45                          0/1     Completed   0               20m
   kube-system                 helm-install-device-plugin-operator-rkrf6                0/1     Completed   0               3m23s
   kube-system                 helm-install-eck-operator-24szr                          0/1     Completed   0               20m
   kube-system                 helm-install-external-secrets-5ftlz                      0/1     Completed   0               3m23s
   kube-system                 helm-install-istio-base-655dk                            0/1     Completed   0               20m
   kube-system                 helm-install-istio-cni-f6bs8                             0/1     Completed   0               20m
   kube-system                 helm-install-istio-ingressgateway-application-gt5wr      0/1     Completed   0               3m23s
   kube-system                 helm-install-istiod-pqck9                                0/1     Completed   0               20m
   kube-system                 helm-install-jaeger-operator-tlqh5                       0/1     Completed   2               20m
   kube-system                 helm-install-nfd-tzcz4                                   0/1     Completed   0               3m23s
   kube-system                 helm-install-postgres-wn82p                              0/1     Completed   0               3m21s
   kube-system                 helm-install-device-plugin-qngd8                         0/1     Completed   2               3m20s
   kube-system                 helm-install-vault-mnq6j                                 0/1     Completed   0               3m19s
   kube-system                 local-path-provisioner-5ccc7458d5-rdxrn                  1/1     Running     0               28m
   kube-system                 metrics-server-7cbbc464f4-wwx7j                          1/1     Running     0               28m
   kube-system                    svclb-istio-ingressgateway-application-b3a1d927-mtmz4    3/3     Running     0               3m20s
   node-feature-discovery      nfd-node-feature-discovery-gc-c5785bf49-54qlf            1/1     Running     0               3m20s
   node-feature-discovery      nfd-node-feature-discovery-master-7c9fdff957-64n78       1/1     Running     0               3m20s
   node-feature-discovery      nfd-node-feature-discovery-worker-psx4k                  1/1     Running     0               3m20s
   postgres                    postgres-postgresql-0                                    1/1     Running     0               3m5s
   tigera-operator             tigera-operator-5d56685c77-rvg5x                         1/1     Running     0               26m
   vault                       vault-0                                                  1/1     Running     0               3m13s
   vault                       vault-agent-injector-695dcf78c6-vpxzh                    1/1     Running     0               3m13s
   ```

1. Verify that the hardware device plugin registered successfully. Follow the verification instructions in the plugin documentation.

### Set up a local Docker registry

Host container images in a registry that Helm and Kubernetes can access. The following steps use the public Docker `registry` image to create a local registry.

1. (Optional) Configure the Docker proxy.

   If your network uses a proxy, configure Docker to use it before continuing.

1. Pull the Docker Registry image.

   ```bash
   docker pull registry:2.7
   ```

1. Create an authentication file. The following commands create a directory for authentication files and generate a password file. You are prompted to enter a password for the `imageregistry` user.

   :::note
   The generated password hash in `auth/htpasswd` is needed to create the registry pull secret during deployment.
   :::

   ```bash
   mkdir -p auth
   htpasswd -Bc auth/htpasswd imageregistry
   ```

1. Run the authenticated Docker Registry container. It listens on port 5000 and uses the credentials in the `htpasswd` file.

   ```bash
   docker run -d --name registry -p 5000:5000 -v $(pwd)/auth:/auth -e "REGISTRY_AUTH=htpasswd" -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" registry:2.7
   ```
