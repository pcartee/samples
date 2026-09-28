---
title: Identity Router Handlers
description: Configure Identity Router application handlers in Studio, including viewing and editing customer handler filters, allowing all customers or restricting handlers to selected customers, and enabling the adapters required for synchronization with Active Directory, Google, and Salesforce user stores.
author: pcartee
topic: administration
date: 09/17/2024
uid: idr-handlers
---

Application handlers enable Studio to interact with an application. Only the Handler's assigned to the customer appear on the *Handlers* page.

**Technical Note**: When configuring Sync for customers, you must have the following adapters enabled for the customer:

 \* **ADSource** - Active Directory source \* **ADToGoogleMapping** - Active Directory to Google mapping \* **ADToSfdcMapping** - Active Directory to Salesforce.com mapping \* **BooleanInversTransformer** - Inverse transformer \* **ChoiceTransformer** - Select how the data is handled \* **ConstantTransformer** - Select a constant value to use \* **GoogleTarget** - Google user store target \* **IdentityTransformer** - Select how to handle an identity \* **SfdcTarget** - Salesforce.com user store target

1) Click the **Handlers** link at the top of the page.

The *Handlers* dialog displays.

![Handlers dialog with handler categories](/img/operations-guide/_page_48_Picture_7.jpeg)

Handlers are used for various operations in Studio. The tabs at the top of the *Handlers* dialog organize

the handlers into operational uses.

2) Click on the name of the application handler you want to edit.

The *Edit Customer Handler Filter* dialog displays.

![Edit Customer Handler Filter dialog with customer access options](/img/operations-guide/_page_49_Picture_4.jpeg)

![Screenshot of the 'Edit Customer Handler Filter' interface. The title bar at the top reads 'Edit Customer Handler Filter'. The section 'Configure Filter For Best' is above a section 'All Customers' and 'Restrict'. Below these are two boxes with checkboxes: 'MyCo' and 'TestCustomer'. Below the boxes are three buttons: 'Save', 'Certified', and 'Certified'.](/img/operations-guide/_page_49_Picture_4.jpeg)

3) Choose from the following:

- •**All Customers** - Select this radio button to enable all customers to use this application handler
- **Restrict**  Select this radio button to restrict the use of this application handler to specific consumer(s) - select the customer(s) who will be using this application handler by selecting the checkbox next to their names

4) Click **Save** to persist the changes and close the *Edit Customer Handler Filter* dialog.