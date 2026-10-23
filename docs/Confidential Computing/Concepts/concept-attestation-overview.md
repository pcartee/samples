---
title: Attestation overview
description: Learn how remote attestation works in TA, including the roles of the verifier, attester, and relying party, faithful verification, and attestation policies.
author: pcartee
topic: conceptual
date: 09/01/2023
uid: attestation.overview
---

This article provides a high-level overview of how attestation works with TA. TA acts as a _verifier_ in a remote attestation application architecture. To understand the verifier's role and how to use TA attestation, it helps to know the basics of the Remote Attestation Procedures Architecture defined in [IETF RFC 9334](https://datatracker.ietf.org/doc/rfc9334/). This article uses the terminology defined in RFC 9334.

Attestation is a process for establishing trust between a confidential computing workload and one or more relying parties. At its most basic, attestation involves three steps:

1. A confidential computing workload attests to its identity and fidelity by providing TEE measurements and other cryptographic evidence, called a quote.
1. A verifier evaluates the quote against reference values and endorsers to determine whether the quote is valid and whether specific claims match stored values and policies.
1. A relying party uses information in the attestation token to decide whether to trust the attester.

## Verifier

TA focuses on providing services for step 2: verification. For more information about where TA fits into various workflows and the steps involved in each, see Attestation patterns.

## Attester

The _attester_ is a confidential computing environment that must prove its identity and show that it hasn't been tampered with or otherwise compromised.

TA also provides a [client](../Integration/integrate-go-client.md) and a TDX CLI to simplify quote collection from the attesting workload. The TA client adapter libraries handle low-level calls to platform software, simplifying the integration of remote attestation into a confidential workload.

The attesting workload is responsible for collecting evidence for a quote by using a TA library or another compatible method. It then forwards the quote directly to TA (passport model) or sends it to a relying party, which relays the quote to TA (background-check model).

## Relying party

The _relying party_ uses the attestation token to decide whether to trust the attester. The relying party must be able to process a token issued by TA. In the simplest passport case, the relying party performs a minimal verification of the attestation token and signing certificate without using TA services or the REST API. In more complex scenarios, the relying party can contact TA and related utilities at multiple points in the workflow. For more information, see Relying party integration.

## Faithful verification

An attestation token is only as trustworthy as the verifier and services in its chain of trust. TA attestation tokens are signed with a certificate that is traceable to the CA. TA microservices run in TEEs, and TA keeps a record of TEE quotes and the services used during quote verification and attestation. This feature, known as _Faithful Verification_, generates a token audit report that can be used to verify the TA services involved in attestation and the TA environment. For more information, see the [Faithful Verifier](../Attestation%20Technologies/Utilities/utility-faithful-verifier.md) tool.

## Attestation policies

TA uses _attestation policies_ (also called _appraisal policies_) to define comparison tests applied to a quote during verification. For example, a policy can compare the latest **mrsigner** hash with the **mrsigner** hash in the quote, determine whether the values match, and set the policy result. The attestation token includes the policies that matched and those that did not, so the relying party can evaluate them. For more information, see Policies.
