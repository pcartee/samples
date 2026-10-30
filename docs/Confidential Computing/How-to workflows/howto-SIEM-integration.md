---
title: SIEM integration
<<<<<<< HEAD
description: Learn how to configure Trust Authority (TA) to send successful and failed attestation events to Splunk or Datadog, including event types, authentication, endpoint URL, and API key.
=======
description: Learn how to configure a SIEM integration in TA to receive real-time successful and failed attestation events.
>>>>>>> origin/main
author: pcartee
topic: how to
date: 05/14/2024
uid: siem-integration
sidebar_position: 2
---

<<<<<<< HEAD
This article explains how to integrate Trust Authority (TA) with third-party Security Information and Event Management (SIEM) services, such as Splunk* or Datadog*, to receive real-time notifications about critical events, including successful and failed attestations.

:::note
TA SIEM events are approximately 12 KB. Splunk* limits event sizes to 10 KB by default, and truncates event messages larger than 10 KB. Splunk* administrators can increase the character limit to more than 10,000 to prevent messages from being truncated.
:::

## Attestation events

### Successful attestation

The attestation token is sent to the SIEM platform when attestation succeeds. By default, this does not mean that all policies matched. To require policy matches and return an error instead of a token when a policy does not match, set the optional `policy_must_match` value to `true` in the attestation request.

### Failed attestation

If the attestation request returns an error response, the error is sent to the SIEM platform. By default, an error indicates a malformed API request or an attestation failure against the default policy. If policy enforcement is enabled in the attestation request, policies that do not match also cause an error and are included in the failed attestation event.

The data sent to SIEM is the same data recorded in the Reports and Metrics date-range reports. For more information, see the Reports and Metrics article.

:::note
By default, TA provides an attestation token regardless of policy evaluation unless the attestation request requires policy compliance.
=======
This article explains how to integrate TA with third-party Security Information and Event Management (SIEM) services, such as Splunk\* or Datadog\*, to receive real-time notifications about attestation events.

:::note
TA SIEM events are approximately 12 KB. By default, Splunk\* limits event sizes to 10 KB and truncates larger messages. Splunk\* administrators can increase the character limit to more than 10,000 to prevent truncation.
:::

- **Successful attestation:** TA sends the attestation token to the SIEM platform when attestation succeeds. By default, this doesn't indicate that all policies matched. To enforce policy matching and return an error instead of a token when a policy doesn't match, set the optional `policy_must_match` value to `true` in the attestation request.
- **Failed attestation:** If the attestation request returns an error, TA sends the error to the SIEM platform. By default, an error indicates a malformed API request or a failure to attest against the default policy. If the request enables policy enforcement, any unmatched policies also cause an error and are included in the “failed attestation” event.

TA sends the same data to the SIEM platform that it records in the Reports and Metrics date-range reports. For more information, see the Reports and Metrics article.

:::note
By default, TA returns an attestation token regardless of policy evaluation unless the request requires policy compliance.
>>>>>>> origin/main
:::

## Configure SIEM integration

Only a tenant admin can manage SIEM service details, including adding, updating, and deleting them.

<<<<<<< HEAD
1. Sign in to TA as a tenant admin.
2. Select **Configurations**.
3. Select **Reporting (SIEM) applications**.
=======
![TA Configurations page showing the Reporting (SIEM) Applications tab, SIEM service selector, security event options, authentication type, and Save button.](/img/howto-SIEM-integration/siem-config.png)

1. Sign in to TA as a tenant admin.
1. Go to **Configurations**.
1. Select **Reporting (SIEM) applications**.
>>>>>>> origin/main

![The Configurations page with Reporting (SIEM) applications selected and the SIEM service, event type, and authentication controls visible.](/img/howto-SIEM-integration/siem-config.png)

### Reporting (SIEM) applications

<<<<<<< HEAD
Complete the following sections to enable the SIEM service:

1. Select a SIEM service.
2. Select the security event types.
3. Select the authentication type.
4. Enter the endpoint URL and API key.

#### SIEM service

In **SIEM service (required)**, select a service from the list:
=======
Complete the following sections to turn on the SIEM service:

1. Select a SIEM service.
1. Select the security event types.
1. Choose the authentication type.
1. Enter the endpoint URL and API key.

#### SIEM service

In **SIEM service (required)**, select an available service from the list:
>>>>>>> origin/main

- Datadog*
- Splunk*

#### Security event type

<<<<<<< HEAD
Select the security event types for which you want real-time notifications:

![The Security Event Type options for successful and failed attestation, both selected.](/img/howto-SIEM-integration/siem-event.png)

1. Go to **Security event type (required)**.
2. Select one or both options:
=======
Select the security event types for which you want real-time notifications.

![Reporting (SIEM) Applications settings with Splunk selected and checkboxes for successful and failed attestation events.](/img/howto-SIEM-integration/siem-event.png)

1. Go to **Security event type (required)**.
1. Select one or both checkboxes:
>>>>>>> origin/main
   - Successful attestation
   - Failed attestation

#### Authentication type

<<<<<<< HEAD
1. Go to **Authentication Type**.
2. Select **Auth key (default)**.

#### Configuration data

![The Configuration Data section with fields for the endpoint URL and authentication key.](/img/howto-SIEM-integration/siem-data.png)

In **Configuration Data**, enter a valid endpoint URL and the API key in the corresponding fields. A text hint indicates where to find this information.
=======
Choose an authentication type:

1. Go to **Authentication Type**.
1. Select **Auth key (default)**.

![Configuration Data section with fields for the endpoint URL and authentication key.](/img/howto-SIEM-integration/siem-data.png)

#### Configuration data

Enter the endpoint URL and API key in **Configuration Data**:

- **Endpoint URL**: Enter a valid URL.
- **Auth Key**: Enter the API key.

The page includes a hint that explains where to find this information.
>>>>>>> origin/main

### Save

Select **SAVE**.

<<<<<<< HEAD
If validation succeeds, a green notification appears, and the attestation token is sent to the SIEM platform.

If validation fails, a red notification appears with details about the errors. The errors are sent to the SIEM platform.
=======
If validation succeeds, TA displays a green notification and sends the attestation token to the SIEM platform.

If validation fails, TA displays a red notification with information about the errors and sends the errors to the SIEM platform.
>>>>>>> origin/main

**\*** Other names and brands may be claimed as the property of others.
