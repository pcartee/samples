---
title: Troubleshoot attestation and view Kubernetes logs
description: Troubleshoot protected-secret attestation failures in a Kubernetes deployment and use kubectl to inspect resources, identify pods and containers, retrieve or follow logs, and search logs by request ID.
author: pcartee
topic: Kubernetes deployment troubleshooting and logs
date: "2024-08-14"
uid: pkg.log
sidebar_position: 3
---

The application runs on a Kubernetes cluster and is deployed and managed
with Helm. Use `kubectl` to view pod logs and troubleshoot attestation
failures.

## Troubleshoot protected-secret attestation

Some deployments require services to attest their code before receiving
protected secrets. The attestation key manager (KM) works with a backend
key management system (KMS) to keep secrets outside Kubernetes Secrets
and the cluster operator's trust boundary. When a service starts, it
requests remote attestation to verify its code's authenticity and
integrity. If attestation succeeds, the service receives the protected
secrets, and the transaction is recorded in the attestation ledger. If
the SGX `mrsigner` or `mrenclave` measurements do not match the allowlist
configured in the KM, the KM withholds the secrets and the service fails
to start.

If services that require attestation keep restarting and never reach the
**Ready** state, check the verification controller (VC) pod logs. The VC
verifies attestation for other services and logs related errors.

If the VC fails to start, check the KM logs. The KM verifies the VC
during application startup.

Kubernetes or Helm configuration changes normally trigger the required
updates and restarts. However, when protected secrets or configuration
values change, restart the KM first, then the VC, and then the other
services that require attestation. This order allows the updated values
to propagate through the cluster.

## Deployments, pods, and containers

The following list describes common deployment roles and example pod
and container names. Pod names are examples; actual names vary by
deployment. Where present, the `istio-proxy` container handles
service-mesh traffic for the pod.

### Attestation token service

Provides attestation tokens for SGX or TDX workloads.

- Sample pod name: `<attestation-token-pod>`
- Container: `<attestation-token-container>`

### Service gateway

Routes authenticated requests to core attestation services, using a hash-based message authentication code (HMAC).

- Sample pod name: `<service-gateway-pod>`
- Container: `<service-gateway-container>`

### Content hosting

Hosts static content, such as entity attestation token (EAT) profiles and token-verification collateral.

- Sample pod name: `<content-hosting-pod>`
- Container: `<content-hosting-container>`

### Request coordinator

Provides a nonce and routes attestation requests to the appropriate appraisal service.

- Sample pod name: `<request-coordinator-pod>`
- Container: `<request-coordinator-container>`

### Attestation controller

Registers services with the attestation key manager and provides attestation-token audit reports.

- Sample pod name: `<attestation-controller-pod>`
- Container: `<attestation-controller-container>`

### Attestation key manager

Manages keys for services that require attestation.

- Sample pod name: `<attestation-key-manager-pod>`
- Container: `<attestation-key-manager-container>`

### GPU appraisal

Provides attestation tokens for supported GPUs.

- Sample pod name: `<gpu-appraisal-pod>`
- Container: `<gpu-appraisal-container>`

### GPU verification

Verifies quotes or reports for supported GPUs.

- Sample pod name: `<gpu-verification-pod>`
- Container: `<gpu-verification-container>`

### Service-mesh proxy

Handles service-mesh traffic for a pod.

- Sample pod name: `<service-mesh-proxy-pod>`
- Container: `istio-proxy`

### Policy evaluation

Evaluates policies against attestation tokens. This pod includes the policy evaluation service and Open Policy Agent (OPA) containers.

- Sample pod name: `<policy-evaluation-pod>`
- Containers:
  - `<policy-evaluation-container>`
  - `opa`

### Policy management

Provides create, read, update, and delete (CRUD) operations for policies.

- Sample pod name: `<policy-management-pod>`
- Container: `<policy-management-container>`

### Quote verification

Verifies SGX and TDX quotes.

- Sample pod name: `<quote-verification-pod>`
- Container: `<quote-verification-container>`

### Request authentication

Authenticates requests using JSON Web Token (JWT) signatures.

- Sample pod name: `<request-authentication-pod>`
- Container: `<request-authentication-container>`

### SEV-SNP appraisal

Provides attestation tokens for supported AMD platforms.

- Sample pod name: `<sev-snp-appraisal-pod>`
- Container: `<sev-snp-appraisal-container>`

### SEV-SNP collateral caching

Caches Versioned Chip Endorsement Key (VCEK) certificates from the AMD Key Distribution System (KDS).

- Sample pod name: `<sev-snp-caching-pod>`
- Container: `<sev-snp-caching-container>`

### SEV-SNP verification

Verifies quotes or reports for supported AMD platforms.

- Sample pod name: `<sev-snp-verification-pod>`
- Container: `<sev-snp-verification-container>`

### TEE collateral caching

Caches SGX or TDX collateral and platform details.

- Sample pod name: `<tee-caching-pod>`
- Container: `<tee-caching-container>`

## View Kubernetes logs with kubectl

The following examples show how to view logs for a deployment or pod.

### Get logs for a deployment

Run this command to retrieve logs from all pods and containers managed
by a deployment:

```bash
kubectl logs "deployment/<deployment-name>" --all-pods=true --all-containers=true --namespace "<namespace>"
```

### Get the pod name

Run this command to list pods in a namespace:

```bash
kubectl get pods --namespace "<namespace>"
```

### Get and follow pod logs

Use `--follow` to stream log output from a specific pod:

```bash
kubectl logs "<pod-name>" --follow --namespace "<namespace>"
```

### Get details about the pod

Use `kubectl describe` to get details about a resource or group of
resources:

```bash
kubectl describe pod "<pod-name>" --namespace "<namespace>"
```

## Search logs

Use `grep` to search logs for a request ID. Add a `request-id` header to
REST API requests or pass a request ID with the client CLI, if
supported. Search for that ID to trace a request through the system:

```bash
kubectl logs "deployment/<deployment-name>" --namespace "<namespace>" | grep "<request-id>"
```
