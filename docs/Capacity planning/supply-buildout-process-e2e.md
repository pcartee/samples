---
title: Supply Buildout Process - E2E Documentation
author: jm_tobkin@apple.com
date: 2026-04-14
description: Review and approval process for platform capacity requests.
sidebar_position: 4
---

This document describes the Supply Buildout Process for platform capacity
requests at Apple. It serves as both an instructional guide and a comprehensive
workflow reference.

## SAFE approvals

Before building out the supply, you need an approved SAFE ticket.

- Approval chain required:
- LOB (Line of Business) Review
- Architect Review
- Security Review
- CIBO Review
- LOB Leadership Review
- Finance Controller Review
- Infra Leadership Review

- If the request is over $5 million, the Executive Supply/Demand Meeting on
Wednesday must approve it.

- Once the seven approvals are gathered, the ticket can proceed to allocation
and supply build-out.

## Supply review

Once a ticket is approved, decide whether the request will be fully met from
CIBO supply, will need deployment to fulfill, or will require a combination of
CIBO supply and deployment for partial fulfillment.

:::note

The temporary workflow will be replaced with the approved workflow once it is
finalized.

:::

## On-hand allocation

The request must meet the following criteria to be fulfilled from CIBO
supply:

- Config: Standard Tomahawk (for example, KT, LN), Zurich (for example, MF,
LV), or T1386 (MO, ML, and others)
- Network: ISS-Denali, ISE-Denali
- Supply on hand to meet the quantity needed
- US-based Apple-Owned Data Center (Reno, Maiden, and others)

If the criteria are met, the following steps are taken:

- Allocate supplies within 24 hours of ticket approval.
- Add assets to the JIRA ticket.
- Update the aDB and Postgres logs with the JIRA ticket ID and L Fields.

## DRC deployment

You need a DRC deployment if the request requires a non-standard config (for
example, NetApp), network (for example, PIE/SDR), specific location or rack, or
a quantity not on hand in CIBO supply.

The following determines who submits the deployment:

- CIBO submits the deployment if the ticket has a clearly defined Bill of
Materials (BOM) at an Apple-owned Data Center (AoDC).
- The SAFE requester or someone from their team submits the deployment if the
request has a non-standard BOM or is at a Regional Data Center (RDC).

You must submit deployments by end of day Monday to meet that week's DRC,
which takes place on Thursday.

- [DRC Hardware Request Submission & Review SOP](https://confluence.sd.apple.com/pages/viewpage.action?pageId=661950746)
- [aDB Deployment Request Training Video-Submit a hardware request](https://adb-deployments.corp.apple.com/hardware-requests/new)

The request can take 8 to 12 weeks to fulfill. The ETA comes from a joint
effort between the Infrastructure Provisioning (IP) Team and CIBO. Once a
deployment is approved in DRC, the following steps are taken:

- CIBO adds a link to the DRC-approved aDB deployment.
- An email is sent to the CIBO and aDB deployment requester once the IP team
has finished.
- CIBO adds assets to the JIRA ticket.
- CIBO updates the aDB and Postgres logs with the JIRA ticket ID.
- Automation sets the L Field in the aDB after the deployment process.

## Partial allocation and deployment (not ideal—low frequency)

The request must meet the same criteria as the CIBO deployment (Standard
Config, Network, AoDC). Partial allocation and deployment can be due to not
having the quantity needed or the rack diversity required. If the CIBO supply
can only partially fulfill the request, the following steps are taken:

- Allocate what CIBO can from their supply stock and add assets to the ticket.
- Update the aDB and Postgres logs to reflect the allocation.
- Submit the aDB deployment; the remaining work follows the DRC process.

## Server returns (to CIBO)

Before a server can be returned to CIBO, it must meet the following
requirements:

- Useful life remaining (see depreciation schedule)
- Standard Config (Tomahawk, Zurich, T1386)
- ISS/ISE-Denali
- Installed in a full rack

If the asset was allocated and a logical build was started, revert those
items. Contact the Linux Platform Team for help with items 1–4, and the Service
Delivery Team for item 5.

1. Wipe the Master Boot Record (MBR).
2. Power down the hosts.
3. Ensure the asset tag is NOT listed in Verdad via
[https://verdad.apple.com](https://verdad.apple.com).
4. Do not modify the hostname; it must remain in its raw state.

## Server returns (flip the bit in full racks only)

### Prerequisites (SRE or owner)

To ensure FTB succeeds, complete the following prerequisites:

- Create a program name, or work with the PM to create one, and associate all
decom assets in aDB.
- Forecast your decommission with the PM team.
- Remove assets from production.
- Disable monitoring (crucial so the site teams do not get any WO/P1/P0
tickets).
- Gain Decommissioner role access in aDB (see the FAQ page for additional
details).
- Flip the bit in the aDB (see Initiating Flip the Bit) below.
- Update provisioning ownership (if applicable).
- PXE-boot assets with the latest magic-eraser image.
- GIO teams working with GIO should not use this process. Instead, work with
them to decommission assets. For priority requests, work with your PM.

### Initiating flip the bit

To initiate the Flip the Bit process once prerequisites are complete, follow
these steps:

- Search for assets to be decommissioned: Search for assets that need to be
decommissioned within aDB. Ensure that you have the necessary permissions to
decommission the selected assets (this requires the Decommissioner role in
aDB).
- Remove assets from production: Ensure that the assets are fully removed
from production and no longer part of the active infrastructure.
- Set disposition status: Change the asset's disposition status to
DECOMMISSION_REQUESTED within aDB. This action starts the decommissioning
process.
- Cooldown period: After setting the disposition status, a 24-hour cooldown
period begins. During this period, you can cancel the decommissioning by
clearing the disposition status.
- Irreversible after cooldown: After the 24-hour cooldown period ends, the
decommissioning process becomes irreversible. Upon a successful PXE boot, the
host checks the wipe software, and the asset's user value is updated to
IS-bot, indicating that the asset is under the IS team's care for the wipe
process.

### Post flip the bit activities

After the cooldown period and successful initiation of Flip the Bit, the asset
will proceed through several stages before it can be physically removed from
the data center:

- Asset User Changes:
- Once the asset successfully completes the 24-hour cooldown and PXE boot,
the asset's user value is updated to IS-bot. The asset is under the
ownership of the IS team, and your team is no longer responsible for the
asset.

- Drive Wipe:
- Magic-eraser securely wipes all drives within the asset. This process is
approved by Apple InfoSec (AIS) to ensure all data is completely erased.
- PXE-boot the asset with the magic-eraser image for this process to be
effective.
- Wipe Outcomes:
- Happy path: If all drives are successfully wiped, the asset is ready to be
securely resold or removed from Apple facilities.
- Unhappy path: If one or more drives fail to be wiped, the failed drives
are removed and recorded within the aDB Drives system. These drives follow
the aDB Media chain of custody workflow for proper tracking and handling.
- Asset Management (Sustainability):
- After the asset has been successfully wiped, its disposition status in aDB
is updated to DECOMMISSIONED. At this point, the asset enters a
sustainability algorithm that determines its next action (for example,
resale, recycling, stock retention, or break-fix).
- The asset is then tagged with decomm_ready_to_unrack, indicating that it
is ready for physical removal from the rack.
- Site Services (DCO):
- The DCO (Data Center Operations) team uses the aDB iOS app to monitor and
prioritize the removal of decommissioned assets, focusing on
space-constrained locations.
- When an asset is tagged decomm_ready_to_unrack, the DCO team is notified
through the app that the asset is ready for physical removal from the data
center.
- If all drives in the asset are successfully wiped, the DCO team verifies
the asset details and removes it physically and logically.
- If any drives fail to wipe, the DCO team removes the failed drives,
validates their details (serial number, make and model), and logs the drive
details into aDB Media to ensure proper chain of custody.

## Links

- [Safe Portal](http://safe.apple.com/) to submit JIRA ticket
- [aDB deployments](https://adb-deployments.corp.apple.com/hardware-requests/new) for DRC
- [FTB Full Process Notes](https://adb-deployments.corp.apple.com/hardware-requests/new)