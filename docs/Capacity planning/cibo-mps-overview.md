---
title: CIBO MPS Overview
author: paulcartee@yahoo.com
date: 2026-02-12
description: An overview of the CIBO MPS process for managing monthly server build plans with OEMs.
sidebar_position: 5
---

This document explains how to manage the Master Production Schedule (MPS) process.

- This document is specific to x86 servers.
- MPS for Apple Silicon is managed by WW SDM (Worldwide Server Data Management).

## Q and A

### What does MPS stand for?

The Master Production Schedule (MPS) is a long-term build plan provided to server OEMs (original equipment manufacturers).

- MPS specifies which products to manufacture, in what quantities, and on what timeline.
- MPS is updated monthly by region (AMR and EMEA) and by configuration letter levels.

### When is MPS published?

- Each month, the CIBO team validates and revises MPS to align with the CIBO (Cloud Infrastructure Build Out) demand forecast update schedule.
- The CIBO team publishes MPS monthly and distributes it to OEMs by email.

### What timeframe does MPS cover?

MPS covers the full material lead time required for server production.

- For x86 servers, the typical material lead time is 8 to 9 months.
- Providing build direction 8 to 9 months in advance ensures OEMs have sufficient time to order required components.

### How are the MPS quantities determined?

The goal of MPS is to align the server build plan with CIBO demand.

- The CIBO team adjusts MPS as needed to balance the latest demand forecast with total supply.
- If supply exceeds demand, MPS may be reduced or postponed to address the excess.
- If demand exceeds supply, MPS can be increased to mitigate the shortage.

## Demand

Demand is based on the latest 15-month forecast published by the CIBO Demand team.

- Forecasted demand is consolidated monthly in arkCIBO.
- All Lines of Business (LOB) and platforms are included.
- Demand is reported by month, region, and required server configuration.
- The requested date is the expected server install date at the data center.
- Open tickets in the SAFE (Service and Fulfillment Engine) Portal and in-flight aDBD (Apple Data and Business Development) deployments are included in CIBO demand.

## Supply

The CIBO team measures supply by the following:

- Supply on hand
- Future MPS to be received
- Expected returns (if applicable)

Supply on hand is determined by aDBD assets.

- [DCI Stock dashboard](https://tableauanalytics.corp.apple.com/#/site/IST-InfraSWDev/views/InfrastructureDivision_16837657965910/Stock?:iid=1).

## Compare supply and demand

The "Supply and Demand" keynote slide calculates the difference between supply and forecasted demand at the server SKU (stock keeping unit) level.

- MPS is adjusted to balance the latest demand forecast with the total supply.
- Supply excesses or shortages are allocated to the appropriate server platform according to hardware compaction.
- Leadership reviews the calculated MPS adjustments (Wednesday Adrian sync). Once approved, the CIBO team updates and publishes MPS.

## Revise MPS

MPS is maintained by region, month, and configuration letter.

- Revisions to MPS are typically scheduled for future months, beyond the quoted material lead time, for example, 8 to 9 months for T1386.
- The MPS month reflects the OEM's expected delivery timing.
- Handoff to the customer then requires integration.