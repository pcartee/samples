---
title: Getting started
description: Quickstart for TA that explains how to view and copy admin API keys, create attestation API keys in the portal or with the REST API, request a first SGX attestation token with the REST API or Go client, and resolve sign-in issues after a password change.
author: pcartee
topic: tutorial
date: 06/07/2024
uid: api.key
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This quickstart describes a sample workflow that covers the basic prerequisites for generating your first attestation by using TA.

## Admin API key management

Admin API keys are required to manage all non-attestation functions in TA. These functions include creating attestation API keys, inviting new users, changing user permissions, managing policies, and managing subscription levels.

:::note
Rotate the admin API keys whenever a Tenant Admin user is removed or downgraded to User. The admin API keys that the former Tenant Admin could access remain active and usable unless you rotate them.
:::

An admin API key is the only authorization required to run nearly all REST APIs, except attestation-related APIs, which require an attestation API key. An admin API key can't be used to attest a TEE. You can do nearly anything in the portal by using the TA REST API. The exception is retrieving the value of an attestation API key, which you can do only in the portal.

### View admin API keys

1. Sign in to the TA portal.

    :::note
    The portal works best with Google Chrome, Microsoft Edge, Mozilla Firefox, and Safari.
    :::

1. Select **Admin API keys**.

1. View the API keys in the table.

    ![Admin API keys](/img/howto-manage-admin-api-keys/admin-api-keys.png)

### Copy admin API keys {/* #admin-keys */}

1. Sign in to the TA portal.

1. Select **Admin API keys**.

1. Go to the API key that you want to copy.

1. Select the view ![View icon](/img/common-graphics/view-icon.png) icon for the API key.

    The API key is displayed.

1. Select the copy ![Copy icon](/img/common-graphics/copy-icon.png) icon.

    The API key is copied to the clipboard.

You can use the API key with the **trustauthorityctl** CLI utility to manage admins and users.

<a id="attest-api-keys"></a>

## Attestation API keys

Attestation API keys authenticate attestation-related functions. These functions include generating a new attestation token, creating a signed nonce, and requesting a Faithful Verification token audit report. An attestation API key must accompany all attestation-related requests. An attestation API key lets you attest any supported TEE.

You can create a new attestation API key in the portal or by using the REST API. You can retrieve the new key value only from the portal. This restriction prevents a rogue client from creating and using a new attestation key. A client can obtain and use a new attestation key only when a user with portal access transfers the key to the client.

You can associate one or more attestation policies with an attestation API key. The policies, if any, are applied to all attestation requests that the key authorizes. You can also specify policies in the attestation request. In that case, the policies specified in the request replace the associated policies. The associated policies aren't evaluated; only the specified policies are evaluated.

Attestation API keys can also have tags, which provide reporting and metrics visibility. All API keys have at least one tag, the default **Workload** tag.

<Tabs>
    <TabItem value="portal" label="Portal" default>

### Create an attestation API key

Any user can create attestation API keys available for all users within the tenant organization.

1. Sign in to the TA portal.

1. Select **Manage services**.

    ![Manage Services](/img/cli/manage-services-page.png)

1. Select **ADD API KEY**.

    The **Add API key** page appears.

    ![Add API key](/img/howto-manage-api-keys/add-api-key.png)

1. Enter a name for the API key. The name can be up to 64 alphanumeric characters. Spaces and special characters other than underscores (_) and hyphens (-) aren't supported.

1. (Optional) Assign one or more tags to the new API key. Tags are key-value pairs that help track utilization for reports and metrics. The **Workload** tag is predefined. You can use values such as an application's name with the **Workload** tag to track the attestations that the application requests. For more information, see Tag management.

1. (Optional) Assign one or more policies to the new API key. Use the **Select an existing policy** list to choose from existing policies. Alternatively, select **Create a new policy** to create one. For more information, see Policy management.

1. When you finish, select **SAVE & CONTINUE**.

1. Review the information on the **Confirm API key details** page.

1. If the information is correct, select **SUBMIT**.

    The new API key is created, along with any new tags or policies.

  </TabItem>

  <TabItem value="restapi" label="REST API">

### Create an attestation API key

Creating an attestation API key by using the REST API requires an admin API key for authentication.

1. (Optional) Create and retrieve the IDs for the tags or policies to associate with the attestation API key.

1. Find the service offer ID.

1. Retrieve the product ID by using the service offer ID.

1. Create a new API client by using the POST method.

  </TabItem>

</Tabs>

:::note
A new attestation API key can take up to two minutes to become active.
:::

## Request an attestation

This example attests an SGX enclave. Examples are provided for the REST API and the Go client libraries.

<Tabs>
  <TabItem value="restapi" label="REST API">

### REST API

This option uses the TA REST API directly to request an attestation. It assumes that you have an existing SGX application that can retrieve an SGX quote.

1. Request a nonce.

   ```bash
   curl --location 'https://api.ta.company.com/appraisal/v1/nonce' \
     --header 'Accept: application/json' \
     --header 'x-api-key: <attestation API key>'
   ```

   :::note
   If you're in the European Union (EU) region, use the following URL instead:

   ```bash
   curl --location 'https://api.eu.ta.company.com/appraisal/v1/nonce' \
     --header 'Accept: application/json' \
     --header 'x-api-key: <attestation API key>'
   ```
   :::

   Sample response:

   ```json
   {
    "val": "UHRKZ09RZFpxU3lCSzllS1FkbkgyMTFGN0ZNRHM4WERoR014b0Y0bENwUktaMDNrY2l3L2xjdmpCWW10eStLZERVWUtKSGRGRXI0THNMdkludEdsVFE9PQ==",
    "iat": "MjAyMy0wNi0xMiAyMDo0NDo0NiArMDAwMCBVVEM=",
    "signature": "kcnt3nLP0HhS0FMKnSB5pgZgDp0Pfar55MDt+lv9GqTrRi4lARaow/cGsPUJcK98Rcb6X2lxGtF8o2TP8AVMLANuqDga/QdpqR+vSfx523swM+ud1aJaTzbV4/o/lKSDSK/oV+Oe5o2IPfVKqedhXdJV/0xm51iMcESxw0wS8AnKliTRwsV9lCJujasAJIGt2LurLcuF89+DnXqo9p9WBUNv5vacjmz6p85Gun7VY9+5flWHBqEZTPWr4ddxHIOyUsOR31BtqgVIf5zFAKlLOUyrH4+ENUJADsnmBJmY5JIbaAFuetucj1dS5ISBTokrOSNUwrSeK0ktQoV7WV3yGdKrjwZS1vGEp85B0/ZUZAgwevsG9QhO8YPXIwbQ40bPUi/gssIogIpN6gC647YDGNqglHwlCopWFJE/O8D3k7f/ywHuNvCL1qYWjJbCdkrNLkBSUJ8eikcIiKqE/Dt2xMk+wiVsCK9nEkzLxzTeFRPayMQVRBRo9x4LLWzsybg2"
   }
   ```

1. Retrieve an SGX quote from an SGX-enabled application. The quote must include the actual quote and any enclave `user_data` or `runtime_data`. Concatenate the nonce `val` and `iat` values with the enclave `runtime_data`, and include the result in the quote. For example:

   ```text
   nonce.Val | nonce.Iat | runtime_data
   ```

1. Request an attestation token.

   ```bash
   curl --location 'https://api.ta.company.com/appraisal/v1/attest' \
    --header 'Accept: application/json' \
    --header 'x-api-key: <attestation API key>' \
    --header 'Content-Type: application/json' \
    --data '{
        "quote": "<Full SGX quote>",
        "verifier_nonce": {
            "val": "<from nonce request>",
            "iat": "<from nonce request>",
            "signature": "<from nonce request>"
        },
        "policy_ids": [<optional list of additional policy IDs to appraise during attestation>],
        "runtime_data": "<SGX user_data from the SGX quote>"
    }'
   ```

  </TabItem>

  <TabItem value="go" label="Go client">

### Go client

This option uses the TA Go client libraries to request a new attestation token. This example assumes that you integrated the Go client, including the `go-sgx` module, with an existing SGX-enabled application.

For more code samples, see the [TA client repo](https://github.com/ta-client-for-go/tree/main).

1. Instantiate the client.

   ```go

    cfg := connector.Config{
            // Replace TRUSTAUTHORITY_URL with real TA URL
            BaseUrl: "TRUSTAUTHORITY_URL",
            // Replace TRUSTAUTHORITY_API_URL with real TA API URL
            ApiUrl: "TRUSTAUTHORITY_API_URL",
            // Provide TLS config
            TlsCfg: &tls.Config{},
            // Replace TRUSTAUTHORITY_API_KEY with real API key
            ApiKey: "TRUSTAUTHORITY_API_KEY",
            // Provide Retry config
            RClient: &RetryConfig{},
    }
   ```

1. Request a new signed nonce.

   ```go
   nonce, err := connector.GetNonce()
   if err != nil {
       fmt.Printf("Error getting nonce: %s\n\n", err)
       return err
   }
   ```

1. Collect evidence from the enclave.

   ```go
   adapter, err := sgx.NewEvidenceAdapter(enclaveId, enclaveHeldData, unsafe.Pointer(C.enclave_create_report))
   if err != nil {
       return err
   }

   evidence, err := adapter.CollectEvidence(nonce)
   if err != nil {
       return err
   }
   ```

1. Request an attestation token by using the nonce and evidence. No additional attestation policies are evaluated unless you set the `policyIds` variable.

   ```go
   token, err := connector.GetToken(nonce, policyIds, evidence)
   if err != nil {
       fmt.Printf("Error getting attestation token: %s\n\n", err)
       return err
   }
   ```

1. Verify the attestation token. This step checks the token's issue time and signature.

   ```go
   // Download the token signing certificates
   jwks, err := connector.GetTokenSigningCertificates()
   if err != nil {
       fmt.Printf("Error getting token signing certificates: %s\n\n", err)
       return err
   }

   parsedToken, err := connector.VerifyToken(string(token))
   if err != nil {
       fmt.Printf("Error verifying token: %s\n\n", err)
       return err
   }
   ```

 </TabItem>

</Tabs>

## Change your password

After you change your password, you might be unable to sign in to the TA portal. If this problem occurs, close all your browser windows, and then open a new browser window to sign in with the updated password. If you still can't sign in, contact support.
