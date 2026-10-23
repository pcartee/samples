---
title: SIEM integration
description: Learn how to configure a SIEM integration in TA to receive real-time successful and failed attestation events.
author: pcartee
topic: how to
date: 05/14/2024
uid: siem-integration
sidebar_position: 2
---

This article explains how to integrate TA with third-party Security Information and Event Management (SIEM) services, such as Splunk* or Datadog*, to receive real-time notifications about attestation events.

:::note
TA SIEM events are approximately 12 KB. By default, Splunk* limits event sizes to 10 KB and truncates larger messages. Splunk* administrators can increase the character limit to more than 10,000 to prevent truncation.
:::

- **Successful attestation:** TA sends the attestation token to the SIEM platform when attestation succeeds. By default, this doesn't indicate that all policies matched. To enforce policy matching and return an error instead of a token when a policy doesn't match, set the optional `policy_must_match` value to `true` in the attestation request.
- **Failed attestation:** If the attestation request returns an error, TA sends the error to the SIEM platform. By default, an error indicates a malformed API request or a failure to attest against the default policy. If the request enables policy enforcement, any unmatched policies also cause an error and are included in the “failed attestation” event.

TA sends the same data to the SIEM platform that it records in the Reports and Metrics date-range reports. For more information, see the Reports and Metrics article.

:::note
By default, TA returns an attestation token regardless of policy evaluation unless the request requires policy compliance.
:::

## Configure SIEM integration

Only a tenant admin can manage SIEM service details, including adding, updating, and deleting them.

![TA Configurations page showing the Reporting (SIEM) Applications tab, SIEM service selector, security event options, authentication type, and Save button.](/img/howto-SIEM-integration/siem-config.png)

1. Sign in to TA as a tenant admin.
1. Go to **Configurations**.
1. Select **Reporting (SIEM) applications**.

### Reporting (SIEM) applications

Complete the following sections to turn on the SIEM service:

1. Select a SIEM service.
1. Select the security event types.
1. Choose the authentication type.
1. Enter the endpoint URL and API key.

#### SIEM service

In **SIEM service (required)**, select an available service from the list:

- Datadog*
- Splunk*

#### Security event type

Select the security event types for which you want real-time notifications.

![Reporting (SIEM) Applications settings with Splunk selected and checkboxes for successful and failed attestation events.](/img/howto-SIEM-integration/siem-event.png)

1. Go to **Security event type (required)**.
1. Select one or both checkboxes:
   - Successful attestation
   - Failed attestation

#### Authentication type

Choose an authentication type:

1. Go to **Authentication Type**.
1. Select **Auth key (default)**.

![Configuration Data section with fields for the endpoint URL and authentication key.](/img/howto-SIEM-integration/siem-data.png)

#### Configuration data

Enter the endpoint URL and API key in **Configuration Data**:

- **Endpoint URL**: Enter a valid URL.
- **Auth Key**: Enter the API key.

The page includes a hint that explains where to find this information.

### Save

Select **SAVE**.

If validation succeeds, TA displays a green notification and sends the attestation token to the SIEM platform.

If validation fails, TA displays a red notification with information about the errors and sends the errors to the SIEM platform.

**\*** Other names and brands may be claimed as the property of others.
