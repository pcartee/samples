---
title: Cloud Infrastructure Demand Planning
author: mgauthier@apple.com
date: 2025-10-10
description: Planning instructions for cloud infrastructure.
sidebar_position: 1
---

This document outlines Apple's comprehensive capacity planning process for cloud infrastructure resources. It covers [infrastructure demand planning cycles](#infrastructure-demand-planning-cycle) and the [Process Flow](#process-flow) for successful infrastructure demand forecasting.

## Scope

This process covers end-to-end infrastructure demand planning across bare
metal services and applications, platforms, third-party cloud, and LLM.

- **Bare-metal infrastructure:** Capacity units such as racks, physical nodes, standalone hosts, and site-level power requirements.

:::note

Bare-metal infrastructures have specific policies and requirements. See the [Bare Metal Policy](https://safe-portal-docs.us-east-1f.app.apple.com/docs/policies/bare-metal-policy/) documentation for more information.

:::

- **Platforms:**
- **Non-foundational platforms:** Virtualized sellable units including vCPU, RAM, block storage, GPU units, and bandwidth.
- **Foundational platforms:** Capacity units such as racks, physical nodes, standalone hosts, and site-level power requirements for foundational platform expansion.
- **Line of Business (LOB) platforms:** Capacity units such as racks, physical nodes, standalone hosts, and site-level power requirements for expansion of foundational platforms.
- **Third-Party Cloud (3PC):** Forecasted usage across AWS, GCP, and LLM (Floodgate to AWS/Anthropic), including compute, storage, GPU, block storage, and token resources provisioned through public cloud platforms.

## Infrastructure demand planning cycle

**Planning horizon:** Use a 15-month rolling forecast to support both near-term execution and mid-term planning.

**Forecast cadence:**

- **Monthly updates:** Perform routine monthly updates to capture incremental changes and actual demand.
- **Quarterly deep refreshes:** Conduct quarterly deep refreshes in the second month of each quarter to reassess drivers, align with business milestones, and update assumptions.
- **Annual fiscal planning:** Integrate annual fiscal planning with the finance planning calendar to inform CapEx (Capital Expenditure) and OpEx (Operating Expenditure) budgeting for the next fiscal year.

## Process flow

### 1. Demand signal collection

Demand signal collection is the systematic gathering of real-time data that indicates actual infrastructure needs. It is the first step in Apple's cloud infrastructure demand planning process.

**DRI: CIBO Demand Team.** Each LOB or non-foundational platform signals
infrastructure demand based on key business drivers, including:

- **Demand type**
- Organic growth: increases in active users, engagement, or concurrent sessions, and storage requirements (for example, iCloud Photos).
- Internal development needs: capacity required to support testing, experimentation, product/development simulations, and developer environments.
- Migration: migration from bare metal to platforms, platform-to-platform, platform-to-third-party cloud, and third-party cloud-to-platform.
- Hygiene: hardware refresh due to age or security vulnerabilities.
- New feature: infrastructure to support new offerings or major updates.
- Market and geographic expansion: regional scale-up to support business growth and expansion into new territories.
- Seasonal patterns and events: anticipated demand spikes around holidays or OS releases (for example, Christmas, Lunar New Year, fall software launch).
- **Forecast submission channels**
- Atlas Customer Forecast Tool (CFT): Use this tool to submit standard hardware SKUs and platform resource forecasts.
- Direct coordination with demand planners: Required for non-standard hardware configurations or specialized use cases.
- Third-party cloud and LLM forecast templates: The Demand Planning team provides Keynote-based templates for AWS, GCP, and Anthropic infrastructure, as well as GPU-intensive LLM workloads.

#### 1.1 Required fields for Apple Cloud demand

- Demand type
- Initiative or project name
- Server family or product SKU
- Platform (product) or bare metal
- Data center
- Need by month
- Quantity (hosts or sellable units)
- Justification for demand
- Comments and change notes (if adjusting a prior forecast)

#### 1.2 Required fields for third-party cloud demand

- Third-party cloud provider
- New demand or existing account
- Product SKU
- Resource type
- Account (if an existing account is expected to grow)
- Region or AZ (availability zone)
- Demand justification or description

### 2. Demand normalization

**DRI: CIBO Demand Team.** The CIBO Demand Team standardizes demand signals
to ensure consistency, accuracy, and readiness for downstream forecasting and
modeling across platforms.

#### Normalization activities

- Standardize resource units: Normalize all inputs to common infrastructure units, such as sellable units or hardware SKUs and configs.
- Align forecast horizon: Ensure all submissions map to the 15-month rolling forecast window.
- Eliminate redundancies: Identify and remove overlaps between forecasted demand and already fulfilled or in-flight capacity.
- Incorporate supply constraints: Adjust demand based on known data center, regional, or zone-level limitations (for example, power caps, floor space).

### 3. Platform resource translation

**DRI: Platform Capacity** Platform engineering teams translate LOB growth
signals into hardware requirements.

#### Translation activities

- Map sellable unit demand to specific hardware SKUs and configs.
- Apply platform architecture standards: Ensure consistency, performance, and scalability.
- Incorporate efficiency gains from software optimizations or infrastructure improvements.
- Offset new demand with existing platform inventory to avoid over-provisioning.
- Account for buffer capacity to mitigate forecast uncertainty and ensure performance headroom across regions and workloads.
- Signal any unfulfilled demand back to the planner.

### 4. Forecast aggregation

**DRI: CIBO Demand Management** The Demand Planning team consolidates and
models total infrastructure demand.

#### Aggregation activities

- Aggregate forecasts across bare metal, platform, third-party cloud, and LLM.
- Apple Cloud Translate resource requirements into site-level space and power.
- Validate forecast accuracy by comparing trends against historical actuals and usage patterns.
- Build the preliminary 15-month infrastructure forecast dataset to support downstream planning.

### 5. Forecast validation and review

**DRI: CIBO Demand Team.**

**Validation activities**

- Validate space and power availability based on the data center location to ensure physical capacity can support forecasted demand.
- Review forecast-over-forecast changes; if material deviations are detected, confirm with the LOB or platform team that the change is intentional and reflects updated business assumptions.
- Confirm the feasibility of hardware delivery timelines and availability with supply planning partners.
- Identify anomalies or outliers that require follow-up with LOBs or platform teams for clarification.

### 6. Forecast publication and distribution

The CIBO Demand Team publishes and shares the finalized 15-month forecast
across key stakeholders to drive alignment and execution.

**Publication activities**

- Publish forecast by platform and resource type, including compute, storage, GPU, network, and third-party cloud.
- Include detailed bare metal demand in capacity units (racks, nodes, site-level power).
- Ensure version control and accessibility through PostgreSQL tables and shared Keynote files and Box folders.
- Highlight material changes from the previous cycle and call out dependencies or decisions needed from stakeholders.

#### 6.1 Distribution list

**Distribute forecast outputs to:**

- Supply planning
- Data center capacity planning
- Infrastructure finance
- LOB finance
- LOB capacity DRIs
- Infrastructure leadership
- Platform engineering teams
- Corporate procurement (third-party cloud)

### 7. Forecast to actual monitoring

Monthly variance tracking ensures forecast accuracy and enables continuous
improvement of the planning process.

**Monitoring activities**

- Compare forecasted vs. actual usage at the platform, resource, and site level.
- Engage with LOBs and platform teams to validate findings and update business assumptions.
- Incorporate insights into future forecast cycles to refine models and increase accuracy over time.
- Maintain a historical log of variances to identify recurring patterns and inform long-range planning.
- Update forecast to ensure actualization is reflected in the forward-looking forecast.

#### 7.1 Root cause investigation

**Investigate root causes of significant variances, such as:**

- Product or feature launch delays
- Efficiency improvements (for example, code optimization, infra tuning, platform overhead reduction)
- Over-forecasting or underutilization by LOBs

### Quarterly forecast refreshes

Quarterly forecast refreshes ensure alignment with evolving business
priorities, product milestones, and infrastructure needs.

**Refresh activities**

- Re-engage LOBs to capture updated business drivers, roadmap shifts, and revised growth assumptions.
- Refresh platform translation models to reflect architecture changes, efficiency gains, or new SKUs.
- Update the full 15-month rolling forecast to incorporate revised demand inputs across bare metal, platforms, and third-party cloud.
- Validate changes with cross-functional stakeholders to maintain alignment and forecast confidence.

### Fiscal year budget refresh

The infrastructure demand forecast plays a critical role in shaping annual
financial and strategic plans.

**Budget integration activities**

- Incorporate demand signals into long-range infrastructure expansion plans, including data center builds, regional growth, and technology shifts.
- Enable executive-level visibility into infrastructure trends, investment needs, and capacity posture.
- Align closely with infrastructure finance to ensure forecasts drive bottom-up budget proposals and top-down planning assumptions.
