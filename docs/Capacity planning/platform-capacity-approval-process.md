---
title: Platform Capacity Approval Process
author: a_kanduri@apple.com
date: 2025-10-10
description: Review and approval process for platform capacity requests.
sidebar_position: 3
---

This document provides an end-to-end guide for the Supply Buildout Process at
Apple's Cloud Infrastructure Build Operations (CIBO). It covers how platform
capacity requests are reviewed, approved, and fulfilled.

## Purpose

This process governs the review and approval of platform capacity requests
initiated by Lines of Business (LOBs) and non-foundational platforms (KCS and
ADP) submitted to platform teams (for example, Compute, Storage, Data Services)
for fulfillment.

## Process Flow

:::note

Steps one through six are sequential and must be performed in the order
presented.

:::

### Capacity request submission

**Owner: LOB Capacity Requestor**

- The LOB requester notifies their Demand Planner of a platform capacity request.
- The LOB requester must include all required details: business driver,
platform, resource type (for example, vCPU, RAM, sellable unit), quantity,
need-by date, and business justification.

**Output:** Email submitted to the LOB Demand Planner.

### LOB demand planner review

**Owner: LOB Demand Planner (See People Matrix below.)**

- Validates the completeness and accuracy of the request.
- Checks with Platform Capacity DRI to determine if the necessary capacity is
available for the request.
- Translates the platform resource request into a capital expenditure (CapEx)
estimate.
- The LOB Demand Planner prepares an approval request email with all required
details, including business driver, resource type, quantity, need-by date,
justification, and CapEx estimate.
- The email must include the following stakeholders: Capacity Requestor, LOB
Capacity DRI, LOB Financial Controller, CIBO Platform Demand Planner,
Platform Capacity DRI, Infrastructure Finance, and ASE Capacity EPMs.

**Output:** Email sent to the LOB Capacity DRI and financial controller
requesting approval.

### LOB capacity DRI review

**Owner: LOB Capacity DRI (See People Matrix below.)**

- Reviews the request for alignment with strategic business priorities and
capacity objectives.
- Verifies the timing and accuracy of resource requirements.
- Approves, modifies, or requests clarification as needed.

**Output:** The LOB Capacity DRI provides feedback via email on an as-needed
basis and sends an approval email.

### LOB financial controller review

**Owner: LOB Financial Controller (See People Matrix below.)**

- Reviews financial implications of the request.
- Validates budget alignment with fiscal constraints and forecasts.
- Approves, rejects, or requests modification to ensure financial
compliance.

**Output:** The LOB Financial Controller provides feedback via email on an
as-needed basis and sends an approval email.

### Notify platform stakeholders of approved demand

**Owner: LOB Demand Planning Team**

- Shares the email of the fully approved request with the Platform Demand
Planner and Platform Capacity DRI.
- Includes a breakdown by resource type (for example, vCPU, GPU, TB Storage),
need by month, and data center(s).

**Output:** Email sent to the Platform Demand Planner and Platform Capacity
DRI notifying them of approved demand.

### Platform acknowledgment, review, and response

**Owner: Platform Capacity DRI**

- Reviews the approved request for feasibility against existing platform
constraints (for example, supply availability, deployment timelines,
architectural dependencies).
- Notifies the LOB Demand Planner and other stakeholders if any issues or
risks may impact timely fulfillment.

**Output:** Email acknowledging receipt of the approved demand and
highlighting any constraints or risks related to fulfillment.

### Platform approval guidelines

For detailed information on platform approval guidelines, see
[Platform approval and allocation guidelines from CIBO](https://quip-apple.com/L0xOAso0hjaq#temp:C:REP79c8a2f34e03472a840dbc48b)

## LOB capacity roles and responsibilities matrix

| Line of Business (LOB) | CIBO Demand Planner | LOB Finance Controller | LOB Capacity DRI | LOB Capacity Point of Contact | LOB Capacity Team |
| ------------------------------ | ------------------- | ---------------------- | ----------------- | ------------------------------ | ------------------------- |
| AIML | Josh Rose | Martin Lu | Benoit Dupin | Various | |
| Apps | Josh Rose | Jenny Lui | Mark Takacs | Mark Takacs | |
| HW-Technology | Josh Rose | Jason Koehn | Ravi Poddar | Russell Heredia | |
| iCloud | Lydia Hwang | Martin Lu | Pascal Borghino | Mathieu Dardenne; Julien Grave | |
| IS&T | Greg Carter | Kunnal Vij | Adam Bechtel | Ayumi Minamikawa | Ryan Dooley, JP Chilumula |
| Maps | Simon Tang | Martin Lu | Adithya Nagarajan | Venkat Appineni | Sree Veeramachaneni |
| Media | Kevin Johnson | Martin Lu | Lionel Gentil | Anthony Fleming | |
| Private Cloud Compute (PCC) | Simon Tang | Martin Lu | Pascal Borghino | Babak Alipour; Leslie Cheung | |
| SWE | Simon Tang | Garrett LoCascio | Diogo Almeida | Angel Viera; Jonathan Rawson | |
| Wallet, Payments, and Commerce | Kevin Johnson | Tim Laughland | Teo Cervantes | Elaine Chalfin | |

## Platform capacity roles and responsibilities matrix

| | CIBO Demand Planner | Infra Finance | ASE Capacity EPM | Platform Capacity DRI | ASE Infrastructure Engineering |
| --------------------------- | ------------------- | ------------- | ---------------- | --------------------- | ------------------------------ |
| Kube | Kristen Daves | Manny Morales | | Andrea Tosatto | Madhu |
| Simcloud | Tim Schultz | Manny Morales | | Stratos | Madhu |
| Apple Cloud Elastic Compute | Christina Mancuso | Manny Morales | Surabhi Ravindra | Neerja Khattar | Madhu |
| Cassandra | Ben Wu | Manny Morales | | Chris Earman | Scott Andreas |
| OS2.0 | Spencer Myers | Manny Morales | | Vijay Bellur | Suri Medapati |
| ACED/ScaleIO | Ben Wu | Manny Morales | | Vijay Bellur | Suri Medapati |
| FDB | Lydia Hwang | Manny Morales | | Josh McManus | |
| Hadoop to Tiered Storage | Ben Wu | Manny Morales | | Tu Tran | |