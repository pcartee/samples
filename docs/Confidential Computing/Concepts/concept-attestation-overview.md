---
title: Attestation overview
description: Overview of remote attestation with Trust Authority (TA), including the attester, verifier, and relying party roles; passport and background-check models; Faithful Verification; and attestation policies.
author: pcartee
topic: conceptual
date: "2023-09-01"
uid: attestation.overview
---

This article provides a high-level overview of remote attestation with Trust Authority (TA). In a remote attestation architecture, TA acts as a _verifier_. To understand the verifier's role and how to use TA attestation, familiarize yourself with the Remote Attestation Procedures Architecture defined in [IETF RFC 9334](https://datatracker.ietf.org/doc/rfc9334/). This article uses the terminology defined in RFC 9334.

Attestation helps establish trust between a confidential computing workload and one or more relying parties. At a high level, the process involves three steps:

1. An attester provides TEE measurements and other cryptographic evidence about the workload.
1. A verifier evaluates the evidence against reference values and endorsements, and determines whether the evidence is valid and whether specific claims match stored values and policies.
1. A relying party uses the attestation token to decide whether to trust the attester.

## Verifier

TA provides services for the second step: verification. For information about where TA fits into different workflows and the steps involved, see Attestation patterns.

## Attester

The _attester_ is a confidential computing environment that must provide evidence of its identity and integrity.

TA provides a [client](../Integration/integrate-go-client.md) and a TDX CLI to simplify evidence collection from the attesting workload. The TA client adapter libraries handle low-level calls to platform software, simplifying the integration of remote attestation into a confidential workload.

The attesting workload collects evidence by using a TA library or another compatible method. It then sends the evidence directly to TA (the passport model) or to a relying party, which relays it to TA (the background-check model).

## Relying party

The _relying party_ uses the attestation token to decide whether to trust the attester. It must be able to process a token issued by TA. In the simplest passport model, the relying party performs a minimal verification of the attestation token and signing certificate without using TA services or the REST API. In more complex scenarios, the relying party can contact TA and related utilities at multiple points in the workflow. For more information, see Relying party integration.

## Faithful verification

An attestation token is only as trustworthy as the verifier and the services in its chain of trust. TA signs attestation tokens with a certificate that is traceable to the certificate authority (CA). TA microservices run in TEEs, and TA records TEE quotes and the services used during quote verification and attestation. _Faithful Verification_ generates a token audit report that you can use to verify the TA services involved in attestation and the TA environment. For more information, see the [Faithful Verifier](../Attestation%20Technologies/Utilities/utility-faithful-verifier.md) tool.

## Attestation policies

TA uses _attestation policies_ (also called _appraisal policies_) to define comparison tests that the verifier applies to evidence. For example, a policy can compare the latest **mrsigner** hash with the **mrsigner** hash in the evidence, determine whether they match, and set the policy result. The attestation token includes the policies that matched and those that did not, so the relying party can evaluate the results. For more information, see Policies.
