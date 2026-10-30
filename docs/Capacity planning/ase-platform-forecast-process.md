---
title: ASE Platform Forecast Process
author: a_kanduri@apple.com
date: 2025-10-10
description: Instructions for following the ASE Platform Forecast Process.
sidebar_position: 2
---

The end-to-end (E2E) Capacity Management process has multiple subprocesses, as
shown in the image below. This document focuses on ASE Platform Forecasting and
provides guidelines and principles for generating the forecast. The documented
process standardizes forecasting across ASE.

:::note

In the image above, "T" stands for the month in which the team needs the
requested capacity. The numbers show how many months are counted backward
within the 15-month rolling window.

:::

**Purpose of ASE Forecast:** The ASE forecast serves as a critical roadmap for
proactive capacity and resource planning. It is designed to align infrastructure
supply with anticipated demand, ensuring optimal resource utilization and
minimizing the risk of server unavailability. This vital signal underpins
strategic decision-making across the supply chain, enabling appropriate and
timely resource allocations.

## Scope

### In scope

The ASE platform forecast includes:

- A forecast for all ASE service providers (Platform teams) built on foundational
and non-foundational platforms, both in the cloud and on bare metal
- A forecast for all SKUs that are needed to enable capacity. This includes any
new SKUs that are planned in Master Production Schedule (MPS), but not
necessarily completed qualification (for example, T1386 and J236)
- A forecast for all divestments, where ASE service providers return non-foundational
or foundational capacity (for example, migration of workloads between
platforms and over-provisioned capacity)
- A forecast for all decomms, including both replacement capacity and return of
hardware from foundational platforms
- **Tech refresh:** Forecast all tech refresh capacity needs and decomms
- **IS&T-driven decommissioning program:** Include all decommissioning plans

### Out of scope

This document excludes Customer Forecasting. The process applies to ASE managed
services. Non-ASE Infra platforms, such as Media platforms, may use the Customer
Forecasting Tool (CFT).

## Forecast tool and cadence

### Tool

You must enter all forecasts directly into the Platform Forecast Tool; the tool
does not accept offline submissions. For step-by-step instructions, see the
platform [forecasting demo](https://appleinc.webex.com/appleinc/ldr.php?RCID=085e0ca31a7004d5a8507f3bf5aca494)
and playbook, including the recording and keynote(s). The password is:
wYb2wpPB.

### Cadence

The ASE Platform Forecast Cycle is a 14-day process for generating a monthly
granularity forecast over 15 months. The forecast is updated on a monthly
cadence. The 14-day process starts when CIBO publishes demand (usually the last
Thursday of the month).

The cadence begins with the publication of customer forecasts, followed by a
phased data entry period.

- **Beginning:** Starts on the last Thursday of each month
- **Days 1 through 3:** Dedicated to forecasts for non-foundational platforms
(for example, Zookeeper, ADP).
- **Days 4 through 7:** For foundational platforms (for example, ACEC, Kube).
- **Day 8:** The ASE Capacity Management Team reviews and analyzes forecasts.
- **Days 9 through 10:** Finance and ASE Leadership conduct final review and approval.

:::note

The calendar period is supervised by the
[CIBO Controller](mailto:cibo-everyone@group.apple.com).

:::

## Platform forecast data input

### Primary inputs

These are the core drivers of the forecast calculation:

- **Customer Demand:** The Customer Forecast (LOB Forecast) operates on a
monthly granularity to capture incremental customer demand. The output of this
process is a forecast of customer needs against specific platforms, measured
in vendable units.
- **In-scope of the signal:** Demand Forecast includes various demand types
such as foundational and non-foundational platforms, capacity divestments,
and both committed (CA) and general availability (GA) demand.
- **Data Accountability:** CIBO collects all demand forecast and is fully
accountable for the output data of the forecast. The demand signal is
expected to have less than 10% volatility within the T-4 lead time (four
months prior to the requirement date), as platforms cannot build supply.
Planners must address any late-breaking needs that arise within the T-4
window on a best-effort fulfillment basis, understanding that standard
fulfillment is not guaranteed.
- **Customer demand forecast approval:** All demand forecasts from CIBO will
be considered reviewed and approved by LOBs and their financial planners.
ASE Infra is not responsible for aligning demand forecasts with LOBs and
their financial controllers.
- **Tool:** The demand forecast uses arkCIBO. In the future, the Customer
Forecasting Tool (CFT) will collect all demand data.

- **ASE Non-Foundational Platform Demand:** Demand on other non-foundational or
foundational platforms.
- **Data Accountability:** Platform/Service Capacity DRIs are accountable and
responsible for generating and inputting capacity forecasts.
- **Tool:** The Platform Forecast Tool (PFT) will collect all demand.

- **Platform Maintenance, Strategic Buffer, and Hedge:** A composite of several
strategic inputs, including:
- **Hygiene (maintaining existing infrastructure):** Proactive replacement and
maintenance of aging hardware to ensure operational stability and service
health.
- **Beachhead (supporting new platforms):** An initial, strategic investment
in capacity to establish and enable the launch of new services or platforms.
- **Supply-Demand Hedge (managing risk):** A buffer of capacity held to
protect against unexpected increases in customer demand or disruptions in
the supply chain.

### Secondary inputs

These sources provide additional context and are used to refine the forecast
with incremental signals:

- New SKUs
- SKU qualification data
- IS&T Tech-refresh plans
- Efficiency programs, migrations, and divestments

## Forecasting process

This process outlines the key principles and step-by-step procedures for
accurately forecasting server capacity needs using the PFT.

### Output of the platform forecast

- **Primary Deliverable:** The main result of this process is the Foundational
Platform Server Capacity Forecast, which outlines future server needs for core
infrastructure.
- **Secondary Deliverable:** A Non-Foundational Platform Forecast is also
produced, quantifying the needs for platforms built upon the foundational
layer in vendable units.
- **Forecast Scope:** All outputs provide a 15-month rolling view with monthly
granularity, ensuring an ongoing, up-to-date perspective on capacity
requirements.

### 1. Understand core forecasting principles

Before entering any data, it is crucial to understand the fundamental principles
that govern the server forecast calculation.

- **Focus on Incremental Needs:** The forecast must only represent new or
additional capacity required. Do not include capacity that has already been
approved and is awaiting fulfillment.
- **Actively Incorporate Anticipated Platform Efficiencies into Your Resource
Forecasts:** This includes accounting for reductions from new offerings (like
the upcoming Kube on-demand, which will lower server needs), clawbacks, and
infrastructure upgrades. Ensure the forecast aligns with the roadmap of the
efficiency initiative.
- **Adhere to the Forecast Lock:** No increases in the capacity forecast are
permitted within the T-4 lead time. Any late-breaking customer demand (within
T-4) cannot be fulfilled by triggering new supply because of server
fulfillment and platform buildout lead times. However, demand will be
fulfilled on a best-effort basis.
- **Net Calculation:** The final forecast number is determined by netting the
existing supply pipeline (either approved capacity awaiting rack-and-stack or
awaiting platform buildout) against the total calculated demand. Net out any
supply available in the GA pool to determine the new supply requirement.
However, the supply should not be netted out against demand more than a
quarter in advance.
- **Manage Rollovers:** Any unmet capacity forecast from a previous cycle must
be identified in the notes and **rolled over** into the next month's
calculation.
- **Apply Divestments Correctly:** Divestments must be applied against demand
strictly within the same month and at the same Data Center.

### 2. Create initial forecast in PFT

When entering a new forecast, follow these guidelines for basis, aggregation,
and granularity.

- **Forecast Basis:**
- **Project-Based:** All forecasts must be tied to a specific project, not
just a time period.
- **Forecast Type:** Accurately categorize the demand (for example, Organic
Growth, Migration, New Projects, and Tech Refresh).
- **Account for Tech Refresh:** Include a forecast for servers that are
expected to be returned to the fleet following a tech refresh.
- **Include Non-Prod Workloads:** Forecast capacity needs for non-production
workloads, such as user acceptance testing (UAT) environments.

- **Project Aggregation:**
- **Large Projects:** Any project requiring more than 10% of the platform's
capacity must be **a separate, individual line item**.
- **Small Projects:** Smaller projects may be aggregated into a single
forecast line item for simplicity.

- **Realistic Ramp-Up:** Forecasts must follow a **realistic ramp-up profile.**
Avoid front-loading the entire demand into the initial period(s).

- **Lead Time Granularity:**
- **Greater than 12 months out (T-12+):** A forecast can be a placeholder
signal against any Data Center.
- **Less than 12 months out (T-12):** The forecast must specify the target
Data Center with accuracy.

#### Meet monthly deadlines

- Forecast updates must be submitted by the communicated deadline for each
monthly cycle.
- Updates submitted after the cut-off will be processed in the following monthly
cycle.
- The team does not accept mid-cycle updates; updates are only processed
according to the established monthly cycle.

### 3. Maintain and update the forecast in the PFT

Timely and accurate forecast updates are essential for effective planning; use
the following rules to ensure your forecasts remain actionable.

- **Update Existing Line Items:** Always update the existing project forecast
line item. **Do not create one**, as previous approved values are retained in
the original.
- **Use Negatives for Divestments Only:** Use negative numbers only for
forecasting a **divestment** (the return of resources). Do not use them for
general downward adjustments.
- **Reflect SKU Conversions:** Any conversion to new SKUs, based on
qualification testing, must be reflected accurately in the PFT.
- **Avoid Stale Forecasts:** The team considers a forecast stale if it is not
updated or validated at least every three months. Stale forecasts will be
disregarded.

### 4. Platform forecast review and approval

The current process is designed with multiple layers of oversight, ensuring that
forecasts are vetted thoroughly before final approval.

1. **Variance Check and Justification:** Any change to a forecast that exceeds a
Significant Variance threshold requires a detailed justification. This
threshold is triggered if the change is greater than the minimum of either
10% of the forecast or 500 servers.
2. **Final Approval:** Following the reviews, the ASE LOB DRI (PPSN) must
provide final approval every cycle for the forecast to be considered locked
and official.

**Rejected Forecast:** The Capacity Management Engineering Program Manager
(EPM) team attempts to resolve all outstanding concerns to complete the
forecast cycle.

- If issues are not resolved in time, the forecast will be rejected, either
completely or for specific platforms.
- Following a rejection, the system will automatically revert to the most
recently approved forecast (the Plan of Record).

**ASE Platform forecast consumption:** CIBO should only consume forecasts that
have been approved for ingestion into downstream signals like MPS and IS&T power
and space planning.

### Late-breaking changes

Late-breaking request fulfillment is based on best effort.

With the evolving and increasingly dynamic needs of the business, situations
arise where there are changes to capacity needs, and servers have to be ordered
and implemented rapidly, often outside of the standard hardware request process.
These late-breaking capacity changes are driven by urgent business requirements,
such as:

- Addressing critical application needs
- Responding to unexpected outages
- Capitalizing on time-sensitive market opportunities

To mitigate the temporary pain and potential business impact associated with
delays, we are implementing an expedited server ordering process and bringing
capacity online. This process leverages the expertise and authority of the
Capacity DRI to streamline decision-making and accelerate deployment.

### Process

The Capacity DRI thoroughly understands the business impacts and does the following:

- Submits a hardware request under $5 million to drive approvals.
- Works with the CIBO team to procure hardware.
- Collaborates with the SRE team to release the capacity for use on time.

While this process provides only temporary relief, the larger request should
follow the regular cycle of capacity procurement. The detailed process for
approving a late-breaking change is part of the ASE Platform approval document.