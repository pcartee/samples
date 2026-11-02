---
title: Platform capacity approval process
author: a_kanduri@apple.com
date: "2025-10-10"
description: Describes the review, approval, and fulfillment process for platform capacity requests from lines of business and non-foundational platforms, including roles, required information, and stakeholder responsibilities.
sidebar_position: 3
---

This document describes Apple's Supply Buildout Process for Cloud Infrastructure Build Operations (CIBO). It explains how platform capacity requests are reviewed, approved, and fulfilled.

## Purpose

This process governs the review and approval of platform capacity requests that lines of business (LOBs) and non-foundational platforms (KCS and ADP) submit to platform teams, such as Compute, Storage, and Data Services, for fulfillment.

## Process Flow

:::note
Perform steps one through six in the order presented.
:::

### Capacity request submission

**Owner: LOB capacity requestor**

- The LOB requester notifies their Demand Planner of a platform capacity request.
- The requester must include the business driver, platform, resource type (for example, vCPU, RAM, or sellable unit), quantity, need-by date, and business justification.

**Output:** An email submitted to the LOB Demand Planner.

### LOB demand planner review

**Owner: LOB Demand Planner (see the people matrix below)**

- Validate the request for completeness and accuracy.
- Consult the Platform Capacity DRI to determine whether sufficient capacity is available.
- Translate the platform resource request into a capital expenditure (CapEx) estimate.
- Prepare an approval request email with the business driver, resource type, quantity, need-by date, justification, and CapEx estimate.
- Include these stakeholders in the email: Capacity Requestor, LOB Capacity DRI, LOB Financial Controller, CIBO Platform Demand Planner, Platform Capacity DRI, Infrastructure Finance, and ASE Capacity EPMs.

**Output:** An email requesting approval, sent to the LOB Capacity DRI and financial controller.

### LOB capacity DRI review

**Owner: LOB Capacity DRI (see the people matrix below)**

- Review the request for alignment with strategic business priorities and capacity objectives.
- Verify the timing and accuracy of resource requirements.
- Approve or modify the request, or request clarification as needed.

**Output:** The LOB Capacity DRI provides feedback by email as needed and sends an approval email.

### LOB financial controller review

**Owner: LOB Financial Controller (see the people matrix below)**

- Review the financial implications of the request.
- Validate budget alignment with fiscal constraints and forecasts.
- Approve or reject the request, or request modifications to ensure financial compliance.

**Output:** The LOB Financial Controller provides feedback by email as needed and sends an approval email.

### Notify platform stakeholders of approved demand

**Owner: LOB Demand Planning Team**

- Share the fully approved request with the Platform Demand Planner and Platform Capacity DRI.
- Include a breakdown by resource type (for example, vCPU, GPU, or TB of storage), need-by month, and data center.

**Output:** An email notifying the Platform Demand Planner and Platform Capacity DRI of the approved demand.

### Platform acknowledgment, review, and response

**Owner: Platform Capacity DRI**

- Review the approved request for feasibility against existing platform constraints, such as supply availability, deployment timelines, and architectural dependencies.
- Notify the LOB Demand Planner and other stakeholders of any issues or risks that might affect timely fulfillment.

**Output:** An email acknowledging receipt of the approved demand and identifying any fulfillment constraints or risks.

### Platform approval guidelines

For detailed information about platform approval guidelines, see the internal CIBO platform approval and allocation guidelines (link redacted).

## LOB capacity roles and responsibilities matrix

| Line of business (LOB) | CIBO Demand Planner | LOB Finance Controller | LOB Capacity DRI | LOB Capacity Point of Contact | LOB Capacity Team |
| ---------------------- | ------------------- | ---------------------- | ---------------- | ------------------------------ | ----------------- |
| AIML                   | Redacted            | Redacted               | Redacted         | Various                        |                   |
| Apps                   | Redacted            | Redacted               | Redacted         | Redacted                       |                   |
| HW-Technology          | Redacted            | Redacted               | Redacted         | Redacted                       |                   |
| iCloud                 | Redacted            | Redacted               | Redacted         | Redacted                       |                   |
| IS&T                   | Redacted            | Redacted               | Redacted         | Redacted                       | Redacted          |
| Maps                   | Redacted            | Redacted               | Redacted         | Redacted                       | Redacted          |
| Media                  | Redacted            | Redacted               | Redacted         | Redacted                       |                   |
| Private Cloud Compute (PCC) | Redacted       | Redacted               | Redacted         | Redacted                       |                   |
| SWE                    | Redacted            | Redacted               | Redacted         | Redacted                       |                   |
| Wallet, Payments, and Commerce | Redacted     | Redacted               | Redacted         | Redacted                       |                   |

## Platform capacity roles and responsibilities matrix

| Platform | CIBO Demand Planner | Infra Finance | ASE Capacity EPM | Platform Capacity DRI | ASE Infrastructure Engineering |
| -------- | ------------------- | ------------- | ---------------- | --------------------- | ------------------------------ |
| Kube | Redacted | Redacted | | Redacted | Redacted |
| Simcloud | Redacted | Redacted | | Redacted | Redacted |
| Apple Cloud Elastic Compute | Redacted | Redacted | Redacted | Redacted | Redacted |
| Cassandra | Redacted | Redacted | | Redacted | Redacted |
| OS2.0 | Redacted | Redacted | | Redacted | Redacted |
| ACED/ScaleIO | Redacted | Redacted | | Redacted | Redacted |
| FDB | Redacted | Redacted | | Redacted | |
| Hadoop to Tiered Storage | Redacted | Redacted | | Redacted | |