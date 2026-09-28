---
title: My Application Types
description: Configure application types in Identity Router Studio, including HTTP Basic and HTTP Digest authentication, application discovery, login form detection, failure detection, authentication forms, and custom form inputs for web application login handling.
author: pcartee
topic: administration
date: 09/17/2024
uid: idr-application-types
---

The **My Application Types** page displays the types of applications you can configure within Studio.

There are three Application Types that can be created in Studio. Each type is listed below:

**HTTP Basic Configuration** on page 31 - Configure a Basic application

**HTTP Digest Configuration** on page 32 - Configure a Digest application

**Discovery** on page 34 - Discover an application and configure the handler within Studio

**Note**: The No-Authentication application template cannot be edited.

## **HTTP Basic Configuration**

Basic access authentication is a method designed to allow a Web browser or other client program to provide credentials in the form of a username and password when making a request. The string used to make the request is constructed of the username appended with a colon, concatenated with the password, and encoded with the Base64 algorithm.

1) Click the **My Application Types** link.

The *Application Types* page displays.

![My Application Types page](/img/operations-guide/_page_40_Picture_11.jpeg)

The **My Application Types** page displays the types of applications Studio can configure for your system.

2) Click **HTTP Basic.**

The *Edit Application Config* dialog displays.

![Edit Application Config dialog for HTTP Basic](/img/operations-guide/_page_41_Picture_3.jpeg)

- 3) Complete the following fields: • **Name** - Enter a name for the application type • **Login URL** - Enter the login URL for the application type
  - **Customer**  This field is automatically populated

4) Click **Save** to persist your changes.

## **HTTP Digest Configuration**

Digest access authentication sends an encrypted password over the network, and is different from the Basic access authentication (which sends plain text over the network).

1) Click the **Application Types** link.

The *My Application Types* page displays.

![My Application Types page with HTTP Digest available](/img/operations-guide/_page_42_Picture_2.jpeg)

The **My Application Types** page displays the types of applications that can be configure in Studio for your system.

2) Click **HTTP Digest.**

The *Edit Authentication Config* dialog displays.

![Edit Authentication Config dialog for HTTP Digest](/img/operations-guide/_page_42_Picture_6.jpeg)

- 3) Complete the following fields:
  - **Name**  Enter a name for the application type • **Login URL** - Enter the login URL for the application type •**Customer** - This field is automatically populated

4) Click **Save** to persist your changes.

## **Discovery**

The discovery process in Studio searches a Web application's login page for the fields used to enter login credentials (typically a username and password). The information is retrieved from the page so that formstuffing can be used to log users into the Web application.

### **Before You Begin**

Review the list below to ensure all the information needed to perform the task is at hand.

• The URL of the application upon which the discovery process is going to be performed •The name of the company for which the discovery process is being run

#### **Enter the Web Application URL**

1) Click the **Application Types** link.

The *My Application Types* page displays.

![Application discovery form with customer and login URL fields](/img/operations-guide/_page_43_Picture_9.jpeg)

The **My Application Types** page displays the types of applications Studio can configure for your system.

2) Complete the following fields at the top of the page:

- •**Discovery** - Select the customer for whom the discovery is taking place from the drop-down list
- **Login Form URL** Enter the URL of the Web application for which the login fields will be discovered

### 3) Click **Discover** to scan the Login Form URL.

The discovery process may take a substantial amount of time (two minutes or more). When the login

information is found, the *Edit Authentication Config* dialog displays.

![Edit Authentication Config dialog showing discovery results](/img/operations-guide/_page_44_Picture_1.jpeg)

#### **Authentication Configuration Information**

#### 4) Complete the following fields:

- • **Name** - Enter a name for the application type. The name entered in this field appears on the *Applications* page in the Studio GUI
- **Login URL** Enter the URL containing the login fields
- **Customer**  This field is automatically populated with the customer selected on the *My Application Type*s page

#### **Failure Detection**

### 5) Complete the following fields:

- Select a failure-detection type from the drop-down list. The failure detection type tells Studio what to look for when it checks for login success o **VISIBLE\_TEXT** - Studio looks for contents in the VISIBLE\_TEXT field to determine that a login failure has occurred o **URL** - Studio looks for the URL entered in this field (for example, an error page) o **STATUS** - Studio looks for a status • Select the qualifier for the contents of this message from the drop-down list. •Enter a value for the fields, if needed

#### **Forms**

6) Select the **Forms** tab.

![Forms tab with the discovered login form](/img/operations-guide/_page_45_Picture_2.jpeg)

- 7) Select the URL of the login form from the **Login Form** drop-down list.
- 8) If necessary, delete the fields that are not needed for this form by clicking the **Delete** icon next to the fields that are not needed.
- 9) Click **Save** to persist your changes.

## **Add a Custom Form**

Custom forms are created to handle login authentication for Web applications specific to your organization or Web applications that are not represented by a Handler. In other words, custom forms are associated with custom applications.

### **Configuration**

**Note**: These instructions assume you are using the Discovery feature and have already completed the initial discovery process.

#### 1) Click the **Add Custom Form** icon.

![Add Custom Form control](/img/operations-guide/_page_46_Picture_2.jpeg)

The **Edit Form** dialog displays.

![Edit Form dialog with configuration fields](/img/operations-guide/_page_46_Picture_5.jpeg)

### 2) Complete the following fields:

• **Action** - Enter the name of the action that will take place • **Method** - Enter the method that will be called •**Identifier** - Enter the identifier associated with this form

#### **Inputs**

3) Select the **Inputs** tab.

![Inputs tab for configuring custom form inputs](/img/operations-guide/_page_47_Picture_2.jpeg)

#### 4) Complete the following fields:

• **Identifier** - Enter the identifier associated with this custom form • **Name** - Enter the name associated with this custom form • **Purpose** - Select how this value will be used from the **Purpose** drop-down list •**Value/Label** - If necessary, enter the text for the label associated with the identifier

5) Optionally click the **Add Custom Form** icon and repeat steps 2 through 4 to

configure other form inputs.

6) Click **Update** to persist the changes.
