---
title: Cloud infrastructure demand planning
author: mgauthier@apple.com
date: "2025-10-10"
description: Describes the 15-month cloud infrastructure demand-planning process, including demand collection, normalization, platform translation, forecast validation and publication, variance monitoring, quarterly refreshes, and fiscal-year budgeting.
sidebar_position: 1
---

This document describes Apple's capacity-planning process for cloud infrastructure resources, including the [infrastructure demand-planning cycle](#infrastructure-demand-planning-cycle) and [process flow](#process-flow).

## Scope

This process covers end-to-end infrastructure demand planning for bare-metal services and applications, platforms, third-party cloud, and large language models (LLMs).

- **Bare-metal infrastructure:** Capacity units such as racks, physical nodes, standalone hosts, and site-level power requirements.

:::note
Bare-metal infrastructure has specific policies and requirements. See the internal Bare Metal Policy documentation for more information.
:::

- **Platforms:**
  - **Non-foundational platforms:** Virtualized sellable units, including vCPU, RAM, block storage, GPU units, and bandwidth.
  - **Foundational platforms:** Capacity units such as racks, physical nodes, standalone hosts, and site-level power requirements for platform expansion.
  - **Line-of-business (LOB) platforms:** Capacity units such as racks, physical nodes, standalone hosts, and site-level power requirements for foundational platform expansion.
- **Third-party cloud (3PC):** Forecasted usage across AWS, GCP, and LLM services, including compute, storage, GPUs, block storage, and tokens provisioned through public cloud platforms.

## Infrastructure demand planning cycle

**Planning horizon:** Use a 15-month rolling forecast to support near-term execution and midterm planning.

### Forecast cadence

- **Monthly updates:** Make routine updates to capture incremental changes and actual demand.
- **Quarterly deep refreshes:** Conduct a deep refresh in the second month of each quarter to reassess demand drivers, align with business milestones, and update assumptions.
- **Annual fiscal planning:** Align fiscal planning with the finance planning calendar to inform capital expenditure (CapEx) and operating expenditure (OpEx) budgets for the next fiscal year.

## Process flow

### 1. Demand signal collection

Demand signal collection is the systematic gathering of data that indicates infrastructure needs. It is the first step in Apple's cloud infrastructure demand-planning process.

**DRI: CIBO Demand Team.** Each LOB or non-foundational platform signals infrastructure demand based on key business drivers, including the following:

- **Demand types:**
  - **Organic growth:** Increases in active users, engagement, concurrent sessions, or storage requirements (for example, iCloud Photos).
  - **Internal development needs:** Capacity for testing, experimentation, product and development simulations, and developer environments.
  - **Migration:** Moves from bare metal to platforms, between platforms, from platforms to third-party cloud, or from third-party cloud to platforms.
  - **Hygiene:** Hardware refreshes required because of age or security vulnerabilities.
  - **New features:** Infrastructure for new offerings or major updates.
  - **Market and geographic expansion:** Regional scaling to support business growth and expansion into new territories.
  - **Seasonal patterns and events:** Anticipated demand spikes around holidays or operating system releases (for example, Christmas, Lunar New Year, or a fall software launch).
- **Forecast submission channels:**
  - **Atlas Customer Forecast Tool (CFT):** Submit standard hardware SKUs and platform resource forecasts using this tool.
  - **Direct coordination with demand planners:** Use this channel for nonstandard hardware configurations or specialized use cases.
  - **Third-party cloud and LLM forecast templates:** The Demand Planning team provides Keynote-based templates for AWS, GCP, and third-party LLM infrastructure, including GPU-intensive workloads.

#### 1.1 Required fields for Apple Cloud demand

- Demand type
- Initiative or project name
- Server family or product SKU
- Platform (product) or bare metal
- Data center
- Need-by month
- Quantity (hosts or sellable units)
- Demand justification
- Comments and change notes (when adjusting a prior forecast)

#### 1.2 Required fields for third-party cloud demand

- Third-party cloud provider
- Whether the demand is new or for an existing account
- Product SKU
- Resource type
- Account (if an existing account is expected to grow)
- Region or availability zone (AZ)
- Demand justification or description

### 2. Demand normalization

**DRI: CIBO Demand Team.** The CIBO Demand Team standardizes demand signals to ensure consistency, accuracy, and readiness for downstream forecasting and modeling across platforms.

#### Normalization activities

- **Standardize resource units:** Normalize inputs to common infrastructure units, such as sellable units or hardware SKUs and configurations.
- **Align the forecast horizon:** Ensure all submissions map to the 15-month rolling forecast window.
- **Eliminate redundancies:** Identify and remove overlaps between forecasted demand and fulfilled or in-flight capacity.
- **Incorporate supply constraints:** Adjust demand for known data center, regional, or zone-level limitations (for example, power caps or floor space).

### 3. Platform resource translation

**DRI: Platform Capacity.** Platform engineering teams translate LOB growth signals into hardware requirements.

#### Translation activities

- Map sellable-unit demand to specific hardware SKUs and configurations.
- **Apply platform architecture standards:** Ensure consistency, performance, and scalability.
- Incorporate efficiency gains from software optimizations or infrastructure improvements.
- Offset new demand with existing platform inventory to avoid over-provisioning.
- Account for buffer capacity to mitigate forecast uncertainty and maintain performance headroom across regions and workloads.
- Notify the planner about any unfulfilled demand.

### 4. Forecast aggregation

**DRI: CIBO Demand Management.** The Demand Planning team consolidates and models total infrastructure demand.

#### Aggregation activities

- Aggregate forecasts across bare metal, platforms, third-party cloud, and LLMs.
- Translate Apple Cloud resource requirements into site-level space and power.
- Validate forecast accuracy by comparing trends against historical actuals and usage patterns.
- Build the preliminary 15-month infrastructure forecast dataset to support downstream planning.

### 5. Forecast validation and review

**DRI:** CIBO Demand Team.

#### Validation activities

- Validate space and power availability at each data center to ensure physical capacity can support forecasted demand.
- Review changes from the previous forecast. If you detect material deviations, confirm with the LOB or platform team that the changes are intentional and reflect updated business assumptions.
- Confirm hardware delivery timelines and availability with supply planning partners.
- Identify anomalies or outliers that require follow-up with LOBs or platform teams for clarification.

### 6. Forecast publication and distribution

The CIBO Demand Team publishes and shares the finalized 15-month forecast with key stakeholders to support alignment and execution.

#### Publication activities

- Publish the forecast by platform and resource type, including compute, storage, GPU, network, and third-party cloud.
- Include detailed bare-metal demand in capacity units (racks, nodes, and site-level power).
- Maintain version control and access through PostgreSQL tables, shared Keynote files, and Box folders.
- Highlight material changes from the previous cycle and identify dependencies or decisions stakeholders need to address.

#### 6.1 Distribution list

Distribute forecast outputs to:

- Supply planning
- Data center capacity planning
- Infrastructure finance
- LOB finance
- LOB capacity DRIs
- Infrastructure leadership
- Platform engineering teams
- Corporate procurement (third-party cloud)

### 7. Forecast to actual monitoring

Monthly variance tracking helps maintain forecast accuracy and continuously improve the planning process.

#### Monitoring activities

- Compare forecasted and actual usage at the platform, resource, and site levels.
- Engage with LOBs and platform teams to validate findings and update business assumptions.
- Incorporate insights into future forecast cycles to refine models and increase accuracy over time.
- Maintain a historical log of variances to identify recurring patterns and inform long-range planning.
- Update the forecast to reflect actual usage in the forward-looking forecast.

#### 7.1 Root cause investigation

Investigate root causes of significant variances, such as:

- Product or feature launch delays
- Efficiency improvements (for example, code optimization, infrastructure tuning, or platform overhead reduction)
- Over-forecasting or underutilization by LOBs

### Quarterly forecast refreshes

Quarterly forecast refreshes align forecasts with evolving business priorities, product milestones, and infrastructure needs.

#### Refresh activities

- Re-engage LOBs to capture updated business drivers, roadmap changes, and revised growth assumptions.
- Refresh platform translation models to reflect architecture changes, efficiency gains, or new SKUs.
- Update the full 15-month rolling forecast to incorporate revised demand inputs across bare metal, platforms, and third-party cloud.
- Validate changes with cross-functional stakeholders to maintain alignment and forecast confidence.

### Fiscal year budget refresh

The infrastructure demand forecast informs annual financial and strategic plans.

#### Budget integration activities

- Incorporate demand signals into long-range infrastructure expansion plans, including data center builds, regional growth, and technology changes.
- Enable executive-level visibility into infrastructure trends, investment needs, and capacity posture.
- Work closely with infrastructure finance so forecasts inform bottom-up budget proposals and top-down planning assumptions.
