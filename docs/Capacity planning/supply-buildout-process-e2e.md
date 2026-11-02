---
title: Supply buildout process
author: jm_tobkin@apple.com
date: "2026-04-14"
description: End-to-end guide to SAFE approvals, CIBO supply allocation, DRC deployments, partial fulfillment, server returns, and the Flip the Bit decommissioning process.
sidebar_position: 4
---

This document describes Apple's Supply Buildout Process for platform capacity requests. Use it as an instructional guide and workflow reference.

## SAFE approvals

Before building out supply, obtain an approved SAFE ticket.

- **Required approval chain:**
  - Line of business (LOB) review
  - Architect review
  - Security review
  - CIBO review
  - LOB leadership review
  - Finance controller review
  - Infrastructure leadership review

- If the request exceeds $5 million, the Executive Supply/Demand Meeting must approve it on Wednesday.

- After all seven approvals are obtained, the ticket can proceed to allocation and supply buildout.

## Supply review

After a ticket is approved, determine whether CIBO supply can fulfill the request, whether a deployment is required, or whether a combination of supply and deployment will partially fulfill it.

:::note
The temporary workflow will be replaced by the approved workflow once it is finalized.
:::

## On-hand allocation

The request must meet the following criteria to be fulfilled from CIBO supply:

- **Configuration:** Standard Tomahawk (for example, KT or LN), Zurich (for example, MF or LV), or T1386 (MO, ML, and others)
- **Network:** ISS-Denali or ISE-Denali
- Sufficient supply is on hand to meet the requested quantity.
- The request is for a U.S.-based, Apple-owned data center (for example, Reno or Maiden).

If the request meets these criteria:

- Allocate the supply within 24 hours of ticket approval.
- Add the assets to the JIRA ticket.
- Update the aDB and PostgreSQL logs with the JIRA ticket ID and L fields.

## DRC deployment

You need a DRC deployment if the request requires a nonstandard configuration (for example, NetApp), network (for example, PIE/SDR), a specific location or rack, or a quantity that is not available in CIBO supply.

The following criteria determine who submits the deployment:

- CIBO submits the deployment if the ticket includes a clearly defined bill of materials (BOM) for an Apple-owned data center (AoDC).
- The SAFE requester or someone on their team submits the deployment if the request has a nonstandard BOM or is for a regional data center (RDC).

Submit deployments by end of day Monday to meet that week's DRC, which takes place on Thursday.

- DRC Hardware Request Submission & Review SOP (internal link redacted)
- aDB Deployment Request training video and hardware request page (internal link redacted)

Fulfillment can take 8 to 12 weeks. The Infrastructure Provisioning (IP) team and CIBO jointly provide the estimated time of arrival (ETA). After DRC approves a deployment:

- CIBO adds a link to the DRC-approved aDB deployment.
- The IP team emails CIBO and the aDB deployment requester when it completes the work.
- CIBO adds the assets to the JIRA ticket.
- CIBO updates the aDB and PostgreSQL logs with the JIRA ticket ID.
- After deployment, automation sets the L field in aDB.

## Partial allocation and deployment (not preferred; infrequent)

The request must meet the same criteria as a CIBO deployment (standard configuration, network, and AoDC). Partial allocation and deployment might be necessary when CIBO does not have the requested quantity or required rack diversity. If CIBO supply can only partially fulfill the request:

- Allocate the available CIBO supply and add the assets to the ticket.
- Update the aDB and PostgreSQL logs to reflect the allocation.
- Submit the aDB deployment. The remaining work follows the DRC process.

## Server returns (to CIBO)

Before returning a server to CIBO, confirm that it meets the following requirements:

- Useful life remains (see the depreciation schedule).
- It has a standard configuration (Tomahawk, Zurich, or T1386).
- ISS/ISE-Denali.
- It is installed in a full rack.

If the asset was allocated and a logical build was started, revert those changes. Contact the Linux Platform Team for help with items 1–4, and the Service Delivery Team for item 5.

1. Wipe the Master Boot Record (MBR).
1. Power down the hosts.
1. Confirm that the asset tag is not listed in Verdad (internal link redacted).
1. Do not modify the hostname; leave it in its raw state.

## Server returns (Flip the Bit in full racks only)

### Prerequisites (SRE or asset owner)

To ensure Flip the Bit (FTB) succeeds, complete these prerequisites:

- Create a program name, or work with the project manager (PM) to create one, and associate all decommissioned assets in aDB.
- Forecast the decommission with the PM team.
- Remove assets from production.
- Disable monitoring so site teams do not receive WO/P1/P0 tickets.
- Obtain the Decommissioner role in aDB (see the FAQ page for details).
- Flip the bit in aDB (see [Initiating Flip the Bit](#initiating-flip-the-bit)).
- Update provisioning ownership (if applicable).
- PXE boot assets with the latest magic-eraser image.
- GIO teams should not use this process. Work with GIO to decommission assets. For priority requests, contact your PM.

### Initiating flip the bit

After completing the prerequisites, initiate Flip the Bit as follows:

1. **Find the assets to decommission:** Search for assets in aDB and confirm that you have permission to decommission them. You need the Decommissioner role in aDB.
1. **Remove the assets from production:** Confirm that the assets are no longer part of the active infrastructure.
1. **Set the disposition status:** In aDB, change the asset's disposition status to `DECOMMISSION_REQUESTED`. This starts the decommissioning process.
1. **Wait through the cooldown period:** A 24-hour cooldown begins after you set the disposition status. You can cancel decommissioning during this period by clearing the disposition status.
1. **Complete the process after the cooldown:** Decommissioning becomes irreversible after the 24-hour cooldown. After a successful PXE boot, the host checks the wipe software, and the asset's user value changes to `IS-bot`. This indicates that the IS team is responsible for the wipe process.

### Post-Flip the Bit activities

After the 24-hour cooldown and successful initiation of Flip the Bit, the asset proceeds through several stages before it can be physically removed from the data center.

#### Asset ownership

After the 24-hour cooldown and a successful PXE boot, the asset's user value changes to `IS-bot`. The IS team assumes responsibility for the asset, and your team is no longer responsible for it.

#### Drive wipe

Magic-eraser securely wipes all drives in the asset. Apple InfoSec (AIS) approves this process to ensure that all data is erased. PXE boot the asset with the magic-eraser image for the wipe process to work.

#### Wipe outcomes

- **All drives wiped:** The asset is ready for secure resale or removal from Apple facilities.
- **One or more drives fail to wipe:** The failed drives are removed and recorded in the aDB Drives system. These drives follow the aDB Media chain-of-custody workflow for tracking and handling.

#### Asset management (sustainability)

After the wipe succeeds, aDB updates the asset's disposition status to `DECOMMISSIONED`. The asset then enters a sustainability algorithm that determines its next action (for example, resale, recycling, stock retention, or break-fix).

The asset receives the `decomm_ready_to_unrack` tag to indicate that it is ready for physical removal from the rack.

#### Site Services (DCO)

The Data Center Operations (DCO) team uses the aDB iOS app to monitor and prioritize the removal of decommissioned assets, with a focus on space-constrained locations.

When an asset receives the `decomm_ready_to_unrack` tag, the app notifies the DCO team that the asset is ready for physical removal from the data center.

- If all drives were wiped successfully, the DCO team verifies the asset details and removes the asset physically and logically.
- If any drives failed to wipe, the DCO team removes the failed drives, validates their details (serial number, make, and model), and records them in aDB Media to maintain the chain of custody.

## Links

- SAFE portal for submitting a JIRA ticket (internal link redacted)
- aDB deployments for DRC (internal link redacted)
- Flip the Bit full-process notes (internal link redacted)
