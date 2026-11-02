---
title: ASE Platform Forecast Process
author: a_kanduri@apple.com
date: 2025-10-10
description: "Describes the ASE platform capacity forecasting process, including scope, inputs, monthly cadence, forecast entry and maintenance rules, review and approval, and late-breaking capacity requests."
sidebar_position: 2
---

The end-to-end (E2E) Capacity Management process has multiple subprocesses. This
document focuses on ASE platform forecasting and provides guidelines and
principles for generating the forecast. The documented process standardizes
forecasting across ASE.

:::note

In the 15-month rolling window, "T" stands for the month in which the team needs
the requested capacity. The numbers show how many months are counted backward
from T.

:::

## Purpose

The ASE forecast supports proactive capacity and resource planning. It aligns
infrastructure supply with anticipated demand to optimize resource utilization
and minimize the risk of server unavailability. This signal supports strategic
decision-making across the supply chain and enables appropriate, timely resource
allocations.

## Scope

### In scope

The ASE platform forecast includes:

- A forecast for all ASE service providers (Platform teams) built on foundational
  and non-foundational platforms, both in the cloud and on bare metal.
- A forecast for all SKUs that are needed to enable capacity. This includes any
  new SKUs planned in the Master Production Schedule (MPS), even if they have
  not completed qualification (for example, T1386 and J236).
- A forecast for all divestments, where ASE service providers return
  non-foundational or foundational capacity (for example, workload migrations
  between platforms and over-provisioned capacity).
- A forecast for all decommissioning activities, including replacement capacity
  and hardware returned from foundational platforms.
- **Tech refresh:** Forecast all tech refresh capacity needs and
  decommissioning activities.
- **IS&T-driven decommissioning program:** Include all decommissioning plans.

### Out of scope

This document excludes customer forecasting. The process applies to ASE-managed
services. Non-ASE infrastructure platforms, such as Media platforms, may use the
Customer Forecasting Tool (CFT).

## Forecast tool and cadence

### Tool

Enter all forecasts directly into the Platform Forecast Tool; the tool does not
accept offline submissions. For step-by-step instructions, see the platform
forecasting demo and playbook, which include the recording and presentation
materials.

### Cadence

The ASE Platform Forecast Cycle is a 14-day process for generating a forecast
with monthly granularity over 15 months. The forecast is updated monthly. The
14-day process starts when CIBO publishes demand, usually on the last Thursday
of the month.

The cadence begins with the publication of customer forecasts, followed by a
phased data-entry period.

- **Beginning:** The cycle starts on the last Thursday of each month.
- **Days 1 through 3:** Forecasts for non-foundational platforms (for example,
  Zookeeper and ADP).
- **Days 4 through 7:** Forecasts for foundational platforms (for example,
  ACEC and Kube).
- **Day 8:** The ASE Capacity Management Team reviews and analyzes forecasts.
- **Days 9 through 10:** Finance and ASE Leadership conduct the final review
  and approval.

:::note

The calendar period is supervised by the CIBO Controller.

:::

## Platform forecast data input

### Primary inputs

These are the core drivers of the forecast calculation:

- **Customer demand:** The Customer Forecast (LOB Forecast) captures
  incremental customer demand at monthly granularity. It forecasts customer
  needs for specific platforms, measured in vendable units.
  - **Signal scope:** The demand forecast includes foundational and
    non-foundational platforms, capacity divestments, and both committed (CA)
    and general availability (GA) demand.
  - **Data accountability:** CIBO collects all demand forecasts and is
    accountable for their output data. The demand signal is expected to have
    less than 10% volatility within the T-4 lead time (four months before the
    requirement date), because platforms cannot build supply within this
    window. Planners must address late-breaking needs within the T-4 window on
    a best-effort basis; standard fulfillment is not guaranteed.
  - **Approval:** LOBs and their financial planners are considered to have
    reviewed and approved all demand forecasts from CIBO. ASE Infra is not
    responsible for aligning demand forecasts with LOBs and their financial
    controllers.
  - **Tool:** The demand forecast uses arkCIBO. In the future, the Customer
    Forecasting Tool (CFT) will collect all demand data.
- **ASE non-foundational platform demand:** Demand on other non-foundational or
  foundational platforms.
  - **Data accountability:** Platform/Service Capacity DRIs are responsible and
    accountable for generating and entering capacity forecasts.
  - **Tool:** The Platform Forecast Tool (PFT) collects all demand.
- **Platform maintenance, strategic buffer, and hedge:** A composite of several
  strategic inputs, including:
  - **Hygiene (maintaining existing infrastructure):** Proactive replacement
    and maintenance of aging hardware to ensure operational stability and
    service health.
  - **Beachhead (supporting new platforms):** An initial strategic investment
    in capacity to establish and enable the launch of new services or
    platforms.
  - **Supply-demand hedge (managing risk):** A capacity buffer to protect
    against unexpected increases in customer demand or supply chain
    disruptions.

### Secondary inputs

These sources provide additional context and help refine the forecast with
incremental signals:

- New SKUs
- SKU qualification data
- IS&T Tech-refresh plans
- Efficiency programs, migrations, and divestments

## Forecasting process

This process outlines the key principles and step-by-step procedures for
accurately forecasting server capacity needs using the PFT.

### Platform forecast outputs

- **Primary deliverable:** The Foundational Platform Server Capacity Forecast
  outlines future server needs for core infrastructure.
- **Secondary deliverable:** The Non-Foundational Platform Forecast quantifies
  the needs of platforms built on the foundational layer in vendable units.
- **Forecast scope:** All outputs provide a 15-month rolling view with monthly
  granularity.

### 1. Understand core forecasting principles

Before entering data, understand the principles that govern the server forecast
calculation.

- **Focus on incremental needs:** The forecast must represent only new or
  additional capacity requirements. Do not include capacity that has already
  been approved and is awaiting fulfillment.
- **Incorporate anticipated platform efficiencies:** Account for reductions
  from new offerings (such as the upcoming Kube on-demand offering, which will
  lower server needs), clawbacks, and infrastructure upgrades. Ensure that the
  forecast aligns with the efficiency initiative's roadmap.
- **Adhere to the forecast lock:** Do not increase the capacity forecast within
  the T-4 lead time. Late-breaking customer demand within T-4 cannot be
  fulfilled by triggering new supply because of server fulfillment and
  platform buildout lead times. However, the demand will be fulfilled on a
  best-effort basis.
- **Calculate net requirements:** Calculate the final forecast by netting the
  existing supply pipeline (approved capacity awaiting rack-and-stack or
  platform buildout) against total demand. Net out any supply available in the
  GA pool to determine the new supply requirement. However, do not net supply
  against demand more than a quarter in advance.
- **Manage rollovers:** Identify any unmet capacity forecast from a previous
  cycle in the notes and **roll it over** into the next month's calculation.
- **Apply divestments correctly:** Apply divestments against demand only in the
  same month and at the same Data Center.

### 2. Create initial forecast in PFT

When entering a new forecast, follow these guidelines for basis, aggregation,
and granularity.

- **Forecast basis:**
  - **Project-based:** Tie all forecasts to a specific project, not just a time
    period.
  - **Forecast type:** Categorize the demand accurately (for example, organic
    growth, migration, new projects, and tech refresh).
  - **Tech refresh:** Include a forecast for servers expected to return to the
    fleet following a tech refresh.
  - **Nonproduction workloads:** Forecast capacity needs for nonproduction
    workloads, such as user acceptance testing (UAT) environments.
- **Project aggregation:**
  - **Large projects:** Any project requiring more than 10% of the platform's
    capacity must have **a separate line item**.
  - **Small projects:** Smaller projects may be aggregated into a single
    forecast line item.
- **Realistic ramp-up:** Follow a **realistic ramp-up profile**. Avoid
  front-loading all demand into the initial periods.
- **Lead-time granularity:**
  - **More than 12 months out (T-12+):** A forecast can be a placeholder signal
    against any Data Center.
  - **Less than 12 months out (T-12):** Specify the target Data Center
    accurately.

#### Meet monthly deadlines

- Forecast updates must be submitted by the communicated deadline for each
  monthly cycle.
- Updates submitted after the cutoff will be processed in the following monthly
  cycle.
- The team does not accept mid-cycle updates; updates are only processed
  according to the established monthly cycle.

### 3. Maintain and update the forecast in the PFT

Use these rules to keep forecasts actionable:

- **Update existing line items:** Always update the existing project forecast
  line item. **Do not create a new one**, because the original retains
  previously approved values.
- **Use negative numbers only for divestments:** Use negative numbers only to
  forecast a **divestment** (the return of resources), not for general
  downward adjustments.
- **Reflect SKU conversions:** Reflect any conversion to new SKUs based on
  qualification testing accurately in the PFT.
- **Avoid stale forecasts:** A forecast is stale if it has not been updated or
  validated for at least three months. The team will disregard stale forecasts.

### 4. Platform forecast review and approval

Multiple review layers ensure that forecasts are vetted before final approval.

1. **Variance check and justification:** Any change that exceeds the
   Significant Variance threshold requires a detailed justification. The
   threshold is triggered when the change is greater than the lower of 10% of
   the forecast or 500 servers.
2. **Final approval:** After the reviews, the ASE LOB DRI (PPSN) must approve
   the forecast every cycle for it to be considered locked and official.

**Rejected forecast:** The Capacity Management Engineering Program Manager
(EPM) team attempts to resolve all outstanding concerns so the forecast cycle
can be completed.

- If the team does not resolve issues in time, it will reject the forecast
  either completely or for specific platforms.
- After a rejection, the system will automatically revert to the most recently
  approved forecast (the Plan of Record).

**ASE platform forecast consumption:** CIBO should consume only forecasts
approved for ingestion into downstream signals such as MPS and IS&T power and
space planning.

## Late-breaking changes

Late-breaking requests are fulfilled on a best-effort basis.

Urgent business requirements can change capacity needs and require servers to
be ordered and implemented rapidly, often outside the standard hardware request
process. Examples include:

- Addressing critical application needs.
- Responding to unexpected outages.
- Capitalizing on time-sensitive market opportunities.

To mitigate delays and their potential business impact, the process expedites
server ordering and brings capacity online. It uses the Capacity DRI's
expertise and authority to streamline decision-making and accelerate
deployment.

### Late-breaking request process

The Capacity DRI assesses the business impact and:

- Submits a hardware request for less than $5 million to obtain approvals.
- Works with the CIBO team to procure hardware.
- Collaborates with the SRE team to release the capacity for use on time.

This process provides temporary relief. Submit the larger request through the
regular capacity procurement cycle. The detailed process for approving a
late-breaking change is in the ASE Platform approval document.
