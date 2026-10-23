---
title: Glossary
description: Definitions of TA and confidential computing terms, including API keys, attestation roles, policies, tokens, and trusted execution technologies.
author: pcartee
topic: conceptual
date: 10/15/2024
uid: concept.glossary
---

The following terms are used in the TA documentation. Terminology related to the attestation process, such as *attester*, *endorser*, and *verifier*, is based on [IETF RFC 9334](https://datatracker.ietf.org/doc/rfc9334/), Remote ATtestation procedureS (RATS). Terms specific to TA are prefixed with “TA,” as in “TA admin API key.” Other terms are industry-standard. Terms marked with an asterisk (*) may be names or brands claimed as the property of entities other than Intel.

#### Admin API key
A TA _admin API key_ (also called a _management API key_) is required to manage TA products, service offers, users, policies, and tags. An Admin API key allows its holder to manage an entire tenant subscription.

:::warning
TA admin API keys are extremely sensitive values that must be safeguarded against unauthorized use.
:::

#### API URL

**TA Base URL** redirects here.

The REST API, and therefore all integration clients and CLIs, require two URLs: the base URL, `https://portal.ta.intel.com`, and the API URL, `https://api.ta.intel.com`.

Use a third well-known URL to retrieve the JWKS containing the signing certificates used for TA attestation tokens and nonces: `https://portal.ta.intel.com/certs`.

:::note
If you're in the European Union (EU), use these TA URLs:

- Base URL: `https://portal.eu.ta.intel.com`
- API URL: `https://api.eu.ta.intel.com`
:::

#### Attestation API key
A TA _attestation API key_ is required for all attestation-related functions. You can't use an attestation API key for management APIs, and you can't use an Admin API key for attestation. You can create an Attestation API key through the REST API, but you can retrieve its value only through the [TA Portal](https://portal.ta.intel.com).

#### Attestation appraisal policy
An _attestation appraisal policy_ is used by the relying party to evaluate claims in the attestation token.

#### Attestation token
A TA _attestation token_ is a JSON Web Token (JWT) generated as a result of verification. It's sometimes called an “attestation report,” although this documentation doesn't use that term. The JWT contains incoming claims (evidence) and outgoing claims, and is signed with a certificate that can be traced to Intel. Relying parties use attestation tokens to decide whether to release confidential services or data to the attester.

#### Attester
An _attester_ is an entity that provides evidence (a _quote_) to a verifier to demonstrate its integrity.

#### Attestation
_Attestation_ is the process by which a trusted authority makes cryptographically verifiable claims based on evidence. For example, an Intel® Software Guard Extensions (Intel® SGX) enclave can generate a quote and send it to an attestation authority, such as TA, to validate the enclave's integrity and identity.

#### Challenger
A _challenger_ is an entity that requests integrity metrics and evaluates the attester's level of trust. When challenged, an attester may respond with a quote or an attestation token, depending on the relying party's needs.

#### Claim
Quotes and attestation tokens are composed of elements called _claims_. A claim usually assigns a value to a named element, often a cryptographic token that represents the signature of a TCB component. _Incoming claims_ are part of the attester's quote. TA adds _outgoing claims_ to the attestation token. For more information, see Attestation tokens and claims.

#### Composite attestation

The goal of _composite attestation_ is to create a single attestation of a trusted computing boundary, which can include a TEE, GPU, and other components. Evidence is collected for each component within the trusted computing boundary, combined, and evaluated against one or more composite attestation appraisal policies. The result is a single attestation token containing claims for all components within the boundary.

#### Intel SGX DCAP
_Intel® Software Guard Extensions Data Center Attestation Primitives (Intel® SGX DCAP)_ is a software infrastructure that helps collect TEE evidence for a quote, which is sent to a verifier, such as TA, for attestation.

#### ECDSA
_Elliptic Curve Digital Signature Algorithm (ECDSA)_ is a cryptographic algorithm that TA uses as part of the attestation process. For more information, see [Intel Software Guard Extensions ECDSA - Attestation for Data Center Orientation Guide](https://download.01.org/intel-sgx/dcap-1.0.1/docs/Intel_SGX_DCAP_ECDSA_Orientation.pdf).

{/* #### Enclave identity */}

#### Endorser
An _endorser_ is an entity that endorses or substantiates evidence provided by the attester or verifier. For example, the key an attester provides to identify an Intel® SGX-enabled processor can be verified, or endorsed, by comparing it with the original value from the Intel® SGX Provisioning Certification Service.

#### Entity
An _entity_ is any component or actor with a role in the attestation process. Entities are usually logical, such as a service, complex logic, or a human component, rather than physical devices such as disk controllers or router cards.

#### Faithful Verification
The [TA Faithful Verifier (FV) tool](./Attestation%20Technologies/Utilities/utility-faithful-verifier.md) is a Linux command-line utility for verifying the fidelity of a TA token. You can download the tool from the downloads page in the TA web interface.

#### GSC
_Gramine Shielded Containers (GSC)_* provide the infrastructure to deploy Docker* containers protected by Intel SGX enclaves using the Gramine Library OS*. For more information, see TA Gramine integration.

#### HSM
A _Hardware Security Module (HSM)_ is a highly secure, tamper-resistant hardware component for storing and managing digital secrets.

#### ISV SVN
The Intel SGX enclave author assigns a _Security Version Number (SVN)_ to each enclave version. The SVN indicates whether security-related updates have occurred. The author can issue a new enclave version without updating the SVN if it includes no security-related changes.

#### ISV Product ID
The enclave author assigns a _product ID_ to each enclave. The ID lets the author distinguish enclaves that share the same author identity. After the enclave initializes successfully, the CPU records the product ID for use during attestation.

#### JSON Web Key (JWK)

According to [IETF RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517), “A JSON Web Key (JWK) is a JavaScript Object Notation (JSON) data structure that represents a cryptographic key.” RFC 7517 also defines a JWK Set JSON data structure that represents a set of JWKs. TA signing certificates conform to the JWK standard. TA returns its signing certificates for attestation tokens and nonces in a JWKS (JSON Web Key Set). The TA JWKS URL is `https://portal.ta.intel.com/certs`.

#### KMS

**KBS** redirects here.

A Key Management System (KMS) is a secure system for storing and managing keys and other digital secrets. A KMS may also implement a Key Broker System (KBS), which brokers access to secrets after successful remote attestation. A KMS stores and safeguards secrets. A KBS acts as an intermediary between the KMS and a confidential computing workload by confirming identity and attestation status and applying key release policies. The KMS or KBS is a relying party in the remote attestation workflow.

#### Nonce
A _nonce_ is a signed JSON object literal used to help mitigate replay attacks and ensure the freshness of an attestation quote or token. TA signs nonces with the PS384 algorithm.

A user-provided nonce is optional for most APIs. If you provide one, the verifier nonce used for the attestation request is embedded in the resulting token. If you don't provide a nonce, the integration client API requests one.

#### OPA
TA uses _Open Policy Agent (OPA)*_ as its policy evaluation engine. For more information about OPA, see the [OPA documentation](https://www.openpolicyagent.org/docs/latest/).

#### PCS
_Intel® Software Guard Extensions Provisioning Certification Service (Intel® SGX Provisioning Certification Service)_ is a reference provisioning certificate caching service implemented in Node.js. It retrieves PCK certificates and other collateral over the internet at runtime, then caches them in a local database.

#### Policy
A TA _policy_ is a collection of rules used to evaluate claims and define the requirements for issuing an attestation token. Relying parties usually have their own policy languages and requirements.

#### Product
A TA _product_ is a grouping of APIs used to define the services enabled for tenants.

#### Quote
A TEE _quote_ is evidence of an enclave's trustworthiness, used during remote attestation. Different TEEs implement quoting mechanisms differently, but every quote represents cryptographically verifiable evidence gathered from various sources during enclave provisioning. A quote consists of a collection of claims.

#### Reference value
A _reference value_ is a value against which claims can be compared. Reference values are often cryptographic measurements of entities and devices, stored in a secure repository such as an HSM or TPM.

#### Relying party
The _relying party_ is any consumer of an attestation token—in other words, any entity that must trust the attester. It's called the relying party because it relies on claims in the verifier-issued attestation token to establish trust in the attester. Relying parties must have their own verifier or verification logic to parse and appraise a TA attestation token.

#### Request ID
The REST API and client library APIs generally accept an optional `RequestID` parameter. TA doesn't read this value; it passes it along with the request throughout the system for tracking. If you don't assign a request ID, the API gateway assigns one, but it isn't guaranteed to be unique.

The request ID can be up to 128 characters long. It can contain the characters a-z, A-Z, and 0-9, and the hyphen (-). No other special characters are allowed.

#### Service Offer
A TA _service offer_ is a bundle containing one or more products.

{/* #### Signing identity */}

#### Intel SGX
_Intel® Software Guard Extensions (Intel® SGX)_ helps protect data in use through application isolation. By protecting selected code and data from modification, developers can partition applications into hardened enclaves, or trusted execution modules, to help increase security. They can attest Intel SGX enclaves to prove their integrity and isolation from other system processes.

#### SIEM
_Security Information and Event Management (SIEM)_ services consolidate security logs and events in a single management tool.

#### Tag
A TA _tag_ is an optional key-value pair that can be associated with an API key to help collect reporting and metrics data.

#### TCB
The Intel platform Trusted Computing Base (TCB) comprises the components critical to meeting Intel's platform security objectives. These components include processor hardware, processor microcode, system firmware, BIOS settings, and platform software (PSW).

#### TEE
A _Trusted Execution Environment (TEE)_ is a secure environment that protects the integrity and confidentiality of code and data during execution by isolating itself from other compute elements. Intel SGX is an example of a TEE. For more information about TEEs, see the [TEE overview](Attestation%20Technologies/concept-tees-overview.md).

#### Trust
*Trust* is the assured reliance on the attributes and behaviors of a given entity.

#### TPM
A *Trusted Platform Module (TPM)* is a secure cryptoprocessor that provides cryptographic generation and storage functions. A TPM is often a separate chip, but it can also be integrated as an independent device in a processor or virtual hardware emulator (vTPM). For more information, see the [TPM Library Specification](https://trustedcomputinggroup.org/resource/tpm-library-specification/).

#### Verifier
A _verifier_ is an entity that evaluates evidence from an attester.

---

**\*** Other names and brands may be claimed as the property of others.
