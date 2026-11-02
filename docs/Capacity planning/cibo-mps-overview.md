---
title: CIBO Master Production Schedule overview
author: paulcartee@yahoo.com
date: "2026-02-12"
description: Overview of the Cloud Infrastructure Build Out (CIBO) Master Production Schedule (MPS) process for forecasting server demand, balancing supply, and coordinating monthly build plans with original equipment manufacturers (OEMs).
sidebar_position: 5
---

This document explains how to manage the Master Production Schedule (MPS) process.

- This process applies to x86 servers.
- Worldwide Server Data Management (WW SDM) manages the MPS for Apple Silicon.

## Questions and answers

### What does MPS stand for?

The Master Production Schedule (MPS) is a long-term build plan provided to server original equipment manufacturers (OEMs).

- MPS specifies which products to manufacture, in what quantities, and on what schedule.
- The team updates MPS monthly by region (AMR and EMEA) and configuration-letter level.

### When is MPS published?

- Each month, the CIBO team validates and revises MPS to align with the Cloud Infrastructure Build Out (CIBO) demand-forecast update schedule.
- The CIBO team publishes MPS and distributes it to OEMs by email each month.

### What timeframe does MPS cover?

MPS covers the full material lead time for server production.

- For x86 servers, the typical material lead time is eight to nine months.
- Providing build direction eight to nine months in advance gives OEMs time to order the required components.

### How are the MPS quantities determined?

The goal of MPS is to align the server build plan with CIBO demand.

- The CIBO team adjusts MPS to balance the latest demand forecast with total supply.
- If supply exceeds demand, the team may reduce or postpone MPS to address the excess.
- If demand exceeds supply, the team may increase MPS to mitigate the shortage.

## Demand

Demand is based on the latest 15-month forecast published by the CIBO Demand team.

- The team consolidates forecasted demand monthly in arkCIBO.
- The forecast includes all lines of business (LOBs) and platforms.
- Demand is reported by month, region, and required server configuration.
- The requested date is the expected server installation date at the data center.
- CIBO demand includes open tickets in the SAFE (Service and Fulfillment Engine) portal and in-flight aDBD (Apple Data and Business Development) deployments.

## Supply

The CIBO team measures supply using the following:

- Supply on hand
- Future MPS to be received
- Expected returns (if applicable)

The team determines supply on hand from aDBD assets.

- DCI Stock dashboard (internal link redacted).

## Compare supply and demand

The "Supply and Demand" Keynote slide calculates the difference between supply and forecasted demand at the server stock keeping unit (SKU) level.

- MPS is adjusted to balance the latest demand forecast with the total supply.
- Supply excesses or shortages are allocated to the appropriate server platform according to hardware compaction.
- Leadership reviews the calculated MPS adjustments during the Wednesday sync. After approval, the CIBO team updates and publishes MPS.

## Revise MPS

The team maintains MPS by region, month, and configuration letter.

- The team typically schedules MPS revisions for future months beyond the quoted material lead time. For example, the lead time for T1386 is eight to nine months.
- The MPS month reflects the OEM's expected delivery timing.
- After delivery, the servers must be integrated before they are handed off to the customer.