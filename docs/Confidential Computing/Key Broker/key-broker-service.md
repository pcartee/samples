---
title: Key Broker Service
description: Overview of the Key Broker Service (KBS), its role in remote attestation and key release, and its Passport and Background verification modes. Explains the background verification workflow, key wrapping, and how to install KBS.
author: pcartee
topic: KBS
date: "2024-04-18"
uid: kbs.about
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Key Broker Service and Trust Authority

The Key Broker Service (KBS) enables key distribution by using
attestation from a Trusted Execution Environment (TEE), such as Software
Guard Extensions (SGX) or Trusted Domain Extensions (TDX), to authorize
key transfers. It retains image decryption keys and acts as a bridge
between an attestation service, such as Trust Authority (TA), and
Key Management Interoperability Protocol (KMIP)-compatible key
management platforms. KBS brokers access to secrets stored in key
management services (KMSs) by evaluating attestation tokens against a
key transfer policy. The policy defines the trust requirements for
retrieving a key.

In remote attestation, a relying party (such as a key manager, secrets
vault, or network access controller) must establish trust with a
workload (the attester). The relying party uses a remote attestation
service (a verifier) to appraise evidence from the attester and issue an
attestation token that reports the appraisal.

However, a gap can exist between relying parties and verifiers. For
example, HashiCorp Vault does not natively integrate with a remote
attestation authority. KBS helps bridge this gap by acting as an
intermediary.

KBS can connect to a third-party, KMIP-compliant KMS, such as HashiCorp
Vault or PyKMIP, for key creation and secure storage.

## KBS use cases

KBS acts as a relying party in remote attestation. It provides the
following functionality:

- Manages policies associated with keys.
- Supports key requests and transfers in two modes:
  - **Passport mode:** The client sends a `POST` request to the key
    request URL with an attestation token in the request body.
  - **Background check mode:** The request does not include a TA
    attestation token. Instead, KBS requires a TEE quote, a verifier
    nonce, and runtime data (the public key created by the attested
    workload).

<Tabs>
<TabItem value="passport-verification-mode" label="Passport verification mode" default>

In Passport verification mode, a relying party (a TEE agent or KBS
client) sends an attestation request directly to the verifier (the TA
Attestation Service) and receives an attestation token. The attester
then calls the KBS key transfer API to request a key.

KBS verifies the attestation token and checks whether it complies with
the policy associated with the key ID. If it does, KBS issues the
requested key.

</TabItem>
<TabItem value="background-verification-mode" label="Background verification mode">

The workload (the key requester) requests a key from KBS. KBS requests a
nonce from TA and forwards it to the workload, which uses it to obtain a
quote. The quote and nonce are then sent to TA to obtain an attestation
token.

### Background verification mode steps

1. KBS checks the key policy to determine the required attestation type.
1. If the key transfer API request does not include the attestation
   type and token, KBS requests a nonce from TA.
1. TA returns a nonce. KBS sends the same nonce and the attestation type
   specified in the key policy to the key requester.
1. For native hardware only, the key requester obtains a quote from the
   attester. It sends another request to KBS with the quote, runtime
   data (the public key generated inside the TEE), and verifier nonce in
   the request body.
1. KBS checks whether the attestation type in the request matches the
   type in the key policy.
1. If the types match, KBS forwards the request to TA with the quote,
   runtime data, and verifier nonce. KBS can also include a list of
   policy IDs for TA to match in the request body.
1. TA verifies the nonce and quote. If verification succeeds, TA issues
   an attestation token to KBS.
1. KBS parses the attestation token to obtain its claims and compares
   them with the policy associated with the requested key.
1. If all claims match the policy, KBS creates a symmetric key and uses
   it to wrap the secret or key. KBS then wraps the symmetric key with a
   public key received in the request (runtime data).
1. KBS responds to the key requester with the encapsulated requested key
   and wrapped symmetric key.

</TabItem>
</Tabs>

## Format of the released key

After evaluating the key release policy and determining that it can
release the key, KBS wraps the key with a client-owned public key. A
simple KBS workflow is as follows:

- KBS accepts a quote and a public key from the client.
- KBS retrieves the key from the KMS and wraps it using the AES-GCMN
  wrapping algorithm, creating a symmetric key. KBS uses this key to
  encrypt the user key (the wrapped key).
- KBS wraps the symmetric key using the RSA-OAEP algorithm and the
  public key in the `attester_held_data` claim of the TA attestation
  token. The workload usually creates the asymmetric key pair and sends
  it to TA with the quote when it requests the attestation token.

Wrapping the key before release protects it in transit. Only the
requesting entity can decrypt it.

The following example shows the output of a key retrieval request:

```json
{
  "wrapped_key": "<wrapped key>",
  "wrapped_swk": "<wrapped AES key>"
}
```

For installation instructions, see [Install the Key Broker Service](../Key%20Broker/key-broker-service-install.md).
