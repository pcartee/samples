---
title: Create and edit customers
description: Create and configure customers in Identity Router Studio, including customer context, company and domain information, license agreements, SSO session and cipher-rotation settings, portal configuration, Integrated Windows Authentication, Identity Router NFS and CIFS clustering, User Management, and audit logging.
author: pcartee
topic: administration
date: 09/17/2024
uid: idr-customers
---

import MyPartial from '../../_includes/_network-auth.md';

The *Customers* page displays all customers associated with your Studio system. Studio is designed to enable its users to manage their customers easily and efficiently. For example, the customer icon highlight indicates the customer’s status. To view more information, hover over the customer’s icon and select the expand icon. A flyout window displays the customer’s current information.

![Customers page with customer status icons](/img/operations-guide/_page_18_Picture_2.jpeg)

The icons below each customer icon let the system administrator perform actions for that customer. The following table describes each icon and its action.

| ICON | DESCRIPTION |
|------|-------------|
| ![Context icon](/img/operations-guide/context.png) | Sets the context of Studio to that of the customer. Setting the context to a particular customer filters the GUI so that you only see the Studio elements that the customer sees (while keeping your system administrator rights). Selecting the **Reset Context** link in the upper-right corner ends customer context and returns you to the system administrator role in Studio. |
| ![Cipher Rotation icon](/img/operations-guide/cipher-rotation.png) | Manually rotate the cipher key. |
| ![Delete icon](/img/operations-guide/delete.png) | Deletes the selected administrator. Only a super administrator can delete other super administrators or administrators. |
| ![Export icon](/img/operations-guide/export.png) | Exports the customer’s information to an XML file so it can be transferred to another Identity Router. |

## The New/Edit Customer Dialog

The *New/Edit Customer* dialog lets the system administrator create and edit Studio customers. A customer is an organization that uses Studio to manage access to its web applications.

All customers are created or edited in the *Edit Customer* dialog, which is accessed from the **Customers** tab on the *System Admin* page.

The *New/Edit Customer* dialog has six tabs for maintaining customer information.

- **Configure** - Create or edit company information that will be displayed in the flyout window.
- **SSO Configuration** - Set session length, cipher- and key-rotation schedules.
- **Portal** - Configure the customer's portal page.
- **Windows Authentication** - Configure Integrated Windows Authentication for this customer.
- **ID Router Clustering** - Configure how multiple Identity Routers communicate with each other.
- **Features** - Select the features the customer has subscribed to.

## Set customer context

The **Set Customer Context** option lets a system administrator view and manage Studio as the customer. Use it to help the customer with configuration changes.

1. Select the **Customers** link at the top of the *Studio* page.

1. Hover over the customer, then select the **Set Customer Context** button.

   ![Customer icon menu used to set customer context](/img/operations-guide/_page_19_Picture_4.jpeg)

1. Select **Yes** in the confirmation window. The context is set to the selected customer.

### Reset customer context

After you finish changing the customer’s Studio configuration, return Studio to the system administrator context.

1. Select **Reset Context** in the upper-left corner of the Studio page.

1. Studio returns to the system administrator context.

## Configure a customer

Use the *New/Edit Customer* dialog to create a customer and enter its information. The dialog has six tabs, described in the following sections.

The information entered on the **Configuration** tab appears when the customer hovers over their super administrator’s icon on the *Administrators* page in Studio.

### Company information

1. Select the **Customers** link at the top of the page.

   ![Customers page with the New Customer control](/img/operations-guide/_page_20_Picture_0.jpeg)

1. Select the **New Customer** icon. The *New Customer* dialog displays.

   ![New Customer dialog with configuration fields](/img/operations-guide/_page_20_Picture_3.jpeg)

1. Complete these fields:

   - **Display Name** - Enter a name for the company.
   - **Time Zone** - Select the appropriate time zone for this customer from the drop-down list.
   - **Status** - Select the appropriate status from the drop-down list.

1. Select the **On Premises Identity Router** checkbox if the Identity Router is located within the customer's network.

1. To let customers accept an online license agreement, select the **Enable Click-Through License Agreement** checkbox.

1. Configure the customer's domain by completing the following steps:

    1. Enter the customer's domain name in the **Domain** field.

    1. Select **Load Key**.

    1. Navigate to the customer's private key. The file ends with `.key`.

    :::note
    PSA keys in the PEM format are supported.
    :::

    1. Select the key, then select **Open**.

    1. Select **Upload**. The key is uploaded to Studio, and the *New Customer* dialog reappears.

    1. Select **Load Cert**.

    1. Navigate to the customer's public key certificate file. The file ends with `.cert`.

    1. Select the certificate, then select **Open**. The certificate loads, and the *New Customer* dialog reappears.

    1. In the **Keychain API Configuration** section of the *New Customer* dialog, enter the administrator-provided key in the **Keychain API Key** field. This key lets the Keychain API communicate with the Identity Router.

    :::note
    Your system administrator creates the Keychain API key.
    :::

    1. Select **Save**.

## SSO Configuration

The **SSO Configuration** tab is used to configure the customer's user session, cipher rotation, and Keychain refresh functions.

1. Select the **SSO Configuration** tab.

   ![SSO Configuration tab with user session and cipher rotation settings](/img/operations-guide/_page_21_Picture_10.jpeg)

### User session

Set the length of time a customer can be signed in to the portal with and without activity.

1. Complete these fields:

   - **One Time Auth Window (sec)** - Enter the time, in seconds, that the Authentication Window displays.
   - **Max Session Length (secs)** - Enter the maximum time, in seconds, an active user can spend on the portal.
   - **Inactivity Timeout (secs)** - Enter the amount of time a user can be inactive on the portal before timing out.
   - **Session IP Validation** - Select this checkbox to require session validation.
   - **Limit Concurrent Sessions** - To limit the number of sessions a user can initiate, select the **Concurrent Sessions** checkbox, then enter a value in the **Limit** text field. The **Limit** text field appears when you select the **Concurrent Sessions** checkbox.

1. Select **Save** or continue to *Cipher Rotation*.

### Cipher rotation

Cipher rotation determines how often the encryption key used to secure communication between the Identity Router and the cloud changes. Complete these fields to configure cipher rotation.

:::warning
Cipher rotation must be disabled for High Availability customers.
:::

1. Select the **SSO Configuration** tab.

1. Complete these fields:

   - **Disable** - To disable the **Cipher Rotation** feature, select the **Disable** checkbox.
   - **Start** - Select the calendar, select a start date, enter the starting time in the text field, then select **AM** or **PM** from the drop-down list.
   - **Interval** - Enter the interval value in the **Interval** text field, then select the unit from the drop-down list.

   :::warning
   Users cannot sign in to Studio while cipher rotation is in progress. Schedule the rotation for a time when the fewest users are expected to be signed in.
   :::

1. Select **Save** or continue to *Adapter Updates*.

### Adapter updates

1. Select the **SSO Configuration** tab.

1. To set when the adapter update takes place, enter a time in the **Adapter Update Time** text field, then select **AM** or **PM** from the drop-down list.

1. Select **Save**.

## Portal - Edit Profile

The **Portal** tab lets you configure *SinglePoint Studio* to route traffic through a portal proxy. There are two types of portal configurations: Default Portal and Custom Portal.

### Before you begin

Before following these instructions, complete these steps:

- Create a web server with a backend hostname set to the machine hosting the portal and the front-end server you want to use.
- Create an application that requires no authentication and select the **Pass Headers** checkbox. Configure the application to use the portal server and an **Allow All** policy. Protect at least the portal page; protecting all portal integration pages is recommended.

:::note
If you use **Protect All Application Areas** to protect the entire portal web server, everything on that server will be protected. Images on a login page will not display because the Identity Router requires users to sign in before viewing them.
:::

1. Choose the type of portal to configure:

   - [**Default Portal - New Customer**](#default-portal---new-customer)
   - [**Custom Portal - New Customer**](#custom-portal---new-customer)

### Default Portal - New Customer

1. Access the *Edit Customer* dialog.

1. Select the **Portal** tab if it is not already selected.

   The *Portal* dialog displays with the **Default Portal** option selected.

   ![New Customer dialog with portal configuration options](/img/operations-guide/_page_23_Picture_8.jpeg)

1. Select **Default Portal**. The default portal fields display.

1. To configure the default portal, complete these fields:

   - **Company Name** - Enter the company name for this portal.
   - **Home Background URL** - Enter the background URL for this portal.
   - **Portal Background URL** - Enter the portal background.
   - **Help URL** - Enter the help URL for this portal.
   - **Settings URL** - Enter the settings URL for this portal.

1. To configure the default portal client, complete these fields:

    - **Image Path** - Enter the relative path to the images used for this portal page.
    - **Default Language** - Select a default language for the Studio user interface.
    - **Default Theme** - Select the default theme from the drop-down list.
    - **Default Position** - Select the default position for the portal.
    - **Auto Dim** - Select this option to enable the auto-dim feature.

1. Select **Save**.

### Custom Portal - New Customer

1. Access the *Edit Customer* dialog.

1. Select the **Portal** tab if it is not already selected. The *Portal* dialog displays with the **Default Portal** option selected.

   ![Custom Portal configuration screen](/img/operations-guide/_page_24_Diagram_9.jpeg)

1. Select **Custom Portal**. The *Custom Portal* text fields display.

    :::note
    In the *Edit Profile* dialog on the **Portal** tab, enter the end-user-facing URLs for the portal page. For example:

    `https://portal.myco.com/login.jsp`, `https://portal.myco.com/portal.jsp`

    Do not enter backend URLs such as:

    `https://backendhostname/login.jsp`
    :::

1. To configure a basic custom portal, complete these fields:

   - **Login Page** - Enter the URL to the login page for the portal.
   - **Portal Page** - Enter the URL for the portal page that contains this customer's web applications.
   - **Error Page** - Enter the URL of the error page to display for this customer.
   - **Logout Page** - Enter the URL of the page to display when a user signs out.

    :::note
    In the head tag of your logout page, include this line:

    `<script language="javascript" src="https://<HOSTNAME\_OF\_ROUTER\_HERE>/LogoutJsServlet"></script>`

    When configuring a custom portal, protect the portal, error, and logout pages as resources.
    :::

1. Configure the AJAX proxy by completing these fields:

    - **Enable AJAX Proxy** - Select this checkbox.
    - **Portal Path** - Enter the portal path.
    - **Backing Portal Location** - Enter the backing portal location.

1. Select **Save**.

## Windows Authentication

Integrated Windows Authentication (IWA) lets an end user's web browser sign in to a domain using stored client information instead of prompting the user to enter a username and password. To use IWA, the end user must be signed in to a local computer as a domain user. If the initial cryptographic exchange fails, the browser prompts the user to enter domain credentials.

When IWA is enabled on the ID Router, end users signed in to the Windows domain do not have to manually authenticate to the SinglePoint portal page or SinglePoint-protected applications in the same domain. SinglePoint Studio can perform IWA authentication with a domain controller or multiple Windows Internet Naming Service (WINS) servers.

To further customize authentication, administrators can specify a range of client networks that use IWA. The ID Router attempts an IWA exchange only for requests from computers in the specified client networks. This is useful when computers running a Microsoft operating system are assigned similar IP addresses.

### Before You Begin Windows Authentication Configuration

Before you begin, gather this information:

- A valid username and password for a domain user account. This account retrieves the initial IWA challenge from the domain controller.
- The fully qualified domain name.
- The domain name or IP address of the domain controller.
- Choose an IWA configuration:
  - [**IWA Enabled - Edit Profile**](#iwa-enabled)
  - [**IWA Enabled by IP Networks - New Customer**](#iwa---enabled-by-ip-networks)

### IWA Enabled

Use these instructions to configure Integrated Windows Authentication with Kerberos in SinglePoint Studio.

#### Before you begin IWA configuration

Before you begin, gather this information:

- A valid username and password for a domain user account. This account retrieves the initial IWA challenge from the domain controller.
- The fully qualified domain name.

#### Configure IWA with Kerberos

1. Select the **Edit Profile** link in the upper-right corner of the *SinglePoint Studio* page. The *Edit Profile* dialog displays.

1. Select the **Windows Authentication** tab.

   ![Windows Authentication configuration fields in Studio](/img/operations-guide/_page_27_Picture_1.jpeg)

1. Select **Enabled** from the **Status** drop-down list.

   :::note
   If you have an existing IWA configuration and change the status to **Disabled**, the configuration information is deleted.
   :::

1. Complete these fields:

   - **Username** - Enter the username for a domain account.
   - **Password** - Enter the password for the specified account.
   - **Domain Name** - Enter the fully qualified domain name.
   - **WINS Name** - The WINS-style domain name is extracted and displayed automatically.

1. To optionally make the ID Router a member of your network, select **Join**. The ID Router must be on the domain network but does not have to be on the premises.

1. Select **Save**.

<MyPartial />

### IWA - Enabled by IP Networks

When IWA by IP Networks with Kerberos is configured, the Identity Routers attempt IWA only for requests from machines in the specified IP ranges.

Use these instructions to configure Integrated Windows Authentication with Kerberos by IP networks in SinglePoint Studio.

#### Before you begin

Before you begin, gather this information:

- A valid username and password for a domain user account. This account retrieves the initial IWA challenge from the domain controller.
- The fully qualified domain name.
- The domain name or IP address of the domain controller.

#### Configure IWA with Kerberos by IP networks

The **Windows Authentication** tab is accessed from the *Edit Profile* dialog.

1. Select the **Edit Profile** link in the upper-right corner of the *SinglePoint Studio* page. The *Edit Profile* dialog displays.

1. Select the **Windows Authentication** tab.

   ![Windows Authentication settings with client IP network fields](/img/operations-guide/_page_29_Picture_4.jpeg)

1. Select **Enabled by IP Networks** from the **Status** drop-down list.

   :::note
   If you have an existing IWA configuration and change the status to **Disabled**, the configuration information is deleted.
   :::

1. Configure Integrated Windows Authentication by completing these fields:

   - **Username** - Enter the username for a domain account.
   - **Password** - Enter the password for the account.
   - **Domain Name** - Enter the fully qualified domain name.
   - **WINS Name** - The WINS-style domain name is extracted and displayed automatically.
   - **Token Validity Period** - Enter the number of days a token is valid.

1. Configure the client’s IWA client networks by completing these fields:

   - **IP** - Enter the starting IP address for the client's network.
   - **Mask** - Enter a value that allows eight or more addresses in the class C subnet. For example: **255.255.248.0**.

1. Select **Join Domain** to make the ID Router a member of your domain. The ID Router must be connected to the domain network but does not have to be physically on the premises.

1. Select **Save**.

<MyPartial />

### Identity Router Clustering - New Customer

When using more than one ID Router, designate one router as the connection to the outside world to accept all incoming traffic. These instructions explain how to designate an ID Router to handle incoming traffic.

:::note
Only a Symplified administrator can enable Identity Router clustering.
:::

1. Select the **Customers** link at the top of the page.

1. Select the **New Customer** icon. The *New Customer* dialog displays.

1. Select the **IDR Clustering** tab. The *IDR Clustering* dialog displays.

   ![Customer dialog with the IDR Clustering tab selected](/img/operations-guide/_page_31_Picture_5.jpeg)

1. Select the **Clustering Enabled** checkbox to enable IDR clustering, then select the type of clustering to perform:

   - [**Identity Router NFS Clustering - New Customer**](#identity-router-nfs-clustering---new-customer)
   - [**Identity Router CIFS Clustering - New Customer**](#identity-router-cifs-clustering---new-customer)

   :::note
   SinglePoint Studio supports these load balancer products:

   - Cisco ACE family
   - F5 BIG-IP family
   - Citrix NetScaler

   These products support session persistence, also known as sticky sessions. We recommend using the **HTTP Cookie Persistence with Cookie Insert** method to support session stickiness.
   :::

### Identity Router NFS Clustering - New Customer

Follow these steps to configure Identity Router NFS clustering.

1. Select the **Customers** link at the top of the page.

1. Select the **New Customer** icon. The *New Customer* dialog displays.

1. Select the **IDR Clustering** tab.

1. Complete these fields:

   - **Clustering Enabled** - Select this checkbox to enable ID Router clustering.
   - **Clustering Type** - Select **NFS** from the drop-down list.
   - **Load balancer DNS name** - Enter the DNS name of the load balancer for the ID Router cluster.
   - **Routing Interface** - Choose the interface the Identity Router will use:
     - If the Identity Router is behind a protected firewall, select **Private**.
     - If the Identity Router is outside the firewall, select **Public**.
   - **IP Address** - Enter the IP address for the NFS server.
   - **Path** - Enter the path to the NFS server.

1. Select **Test** to verify that SinglePoint Studio can connect to the ID Router.

1. Select **Save** to save the configuration.

### Identity Router CIFS Clustering - New Customer

These instructions are divided into two sections: *Set the LMCompatibilityLevel* and *Configure Identity Router CIFS Clustering*.

#### Set the LMCompatibilityLevel

To configure an Identity Router for CIFS clustering, configure the LMCompatibilityLevel in the Windows Server 2008 UI. Follow these instructions to set it.

1. At the Windows Server 2008 desktop, select **Start** > **Run**.

1. Enter **gpmc.msc**, then select **OK**. The *Group Policy Management* dialog displays.

   ![Group Policy Management console](/img/operations-guide/_page_33_Picture_3.jpeg)

1. Select the domain of interest, for example, `cust2.env2`, and expand **`<domain>` > Domain Controllers > Default Domain Controllers Policy**.

1. Right-click **Group Domain: Controller Policies** under the domain, then select **Edit**.

   The *Group Policy Management Editor* dialog displays.

   ![Group Policy Management Editor navigation tree](/img/operations-guide/_page_34_Picture_2.jpeg)

1. In the Group Policy Management *Editor* dialog, select **Computer Configuration > Policies > Windows Settings > Security Settings > Local Policies > Security Options**, as shown above.

1. In the *Policy* section, right-click **Network security: LAN Manager authentication level**, select the desired policy, then select **OK**.

   ![LAN Manager authentication policy settings](/img/operations-guide/_page_34_Picture_5.jpeg)

   :::warning
   Do not select **Send NTLM v2 response only Refuse LM & NTLM** because this policy does not work with Studio.
   :::

1. Exit the *Group Policy Management Editor* dialog, then exit the *Group Policy Management* dialog.

1. At the command line, run **gpupdate /force** to apply the changes.

1. Select the **Customers** link at the top of the page.

1. Select the **New Customer** icon. The *New Customer* dialog displays.

1. Select the **IDR Clustering** tab.

   ![New Customer dialog with clustering configuration](/img/operations-guide/_page_35_Picture_4.jpeg)

1. Complete these fields:

   - **Clustering Enabled** - Select this checkbox to enable clustering for this customer.
   - **Clustering Share Type** - Select **CIFS** from the drop-down list.
   - **Load balancer DNS name** - Enter the load balancer DNS name for ID Router clustering.
   - **Routing Interface** - Select the interface the Identity Router will use:
     - If the Identity Router is behind a protected firewall, select **Private**.
     - If the Identity Router is outside the firewall, select **Public**.
   - **IP Address** - Enter the CIFS server IP address.
   - **CIFS Share Name** - Enter the CIFS share name.
   - **CIFS Username** - Enter the CIFS username.
   - **CIFS Password** - Enter the CIFS password.
   - **Use Guest** - Select this checkbox if guest accounts are allowed.

1. Select **Test** to verify the information and confirm that SinglePoint Studio can connect to the Identity Router.

1. Select **Save** to save the configuration.

## User Management - New Customer

Use the **User Management** tab to enable and configure User Management.

User Management is a separate feature that the system administrator must enable. If the **User Management** tab does not appear in the *Edit Profile* dialog, contact your system administrator.

**Note:** Set the Studio context to a customer before following these instructions.

1. Select the **Edit Profile** link in the upper-right corner of any Studio page. The *Edit Profile* dialog displays.

1. Select the **User Management** tab. The *User Management* dialog displays.

   ![User Management Database Configuration settings](/img/operations-guide/_page_36_Picture_6.jpeg)

1. Complete these fields:

   - **User Management Enabled** - Select this checkbox to enable User Management.
   - **Type** - Select the database that User Management will use to store users.
   - **Routing Interface** - Select the Identity Router routing interface from the drop-down list.
   - **Server** - Enter the IP address of the server running User Manager.
   - **Port** - Enter the port used to connect to User Manager.
   - **Instance Name** - Enter the User Manager instance name.
   - **Username** - Enter the username for the database account User Manager uses.
   - **Password** - Enter the password for the database account User Manager uses.
   - **Test** - Select this button to test the configuration.

1. Select **Save** to save the changes.

## Audit Logging

Use these instructions to configure audit logging for your Identity Router. You can store audit logs in a file or on the customer’s Syslog server.

### Audit Logging Configuration

1. Select the **Edit Profile** link in the upper-right corner of any Studio page. The *Edit Profile* dialog displays.

1. Select the **Audit Logging** tab. The *Audit Logging* dialog displays.

   ![Audit Logging Configuration tab and event settings](/img/operations-guide/_page_37_Picture_5.jpeg)

1. Configure audit logging by selecting the event checkboxes:

   - **Audit Logging Enabled** - Select this checkbox to enable logging. Clear it to hide the remaining fields.
   - **User Events Enabled** - Select this checkbox to log user events.
   - **Authorization Request Events Enabled** - Select this checkbox to log authorization request events. These are also user-related events and are affected by **User Events Enabled**.
   - **System Events Enabled** - Select this checkbox to log system events.
   - **System Error Events Enabled** - Select this checkbox to log system error events. These are also system-related events and are affected by **System Events Enabled**.
   - **Output Type** - Select the output method for the logs.
   - **File Only** - Store logs in `symplified-audit.log` on the Identity Router. This is the default option.
   - **Syslog** - Store logs in `symplified-audit.log` on the Identity Router and send them to a Syslog server configured under **Local Disk Backup** on the **Backup** tab.

### Syslog configuration

Syslog fields appear only when you select **Syslog** from the **Output Type** drop-down list.

:::note
The Syslog server operates independently of Studio. The customer must set it up.
:::

Before you begin, obtain the Syslog server information for the destination that will receive the logs.

1. Complete these fields:

   - **Server** - Enter the IP address of the server that will receive logs from the Identity Router.
   - **Port** - Enter the Syslog server port number.
   - **Protocol** - Select the protocol the Identity Router will use to send messages.
   - **Routing Interface** - Select the interface used to send Syslog messages.
   - **Security Method** - Select whether the Identity Router adds information to log messages to help verify their authenticity and integrity while in transit.

   The HMAC, SHA-1, and SHA-2 security methods require a password. The **Password** field appears when you select one of these methods.

1. Select **Save** to save your changes.

## Features

The **Features** tab lets the system administrator select the features to which the customer has subscribed.

![Features tab listing customer features and their enabled status](/img/operations-guide/_page_39_Picture_3.jpeg)

1. Select the appropriate features for this customer:

   - To activate Keychain, select the **PRODUCT** checkbox.
   - To activate Allow SSO Pass-through, select the **PRODUCT** checkbox.
   - To activate Prototype View, select the **Development** checkbox.
   - To activate SinglePoint Studio Express, select the **PRODUCT** checkbox.
   - To activate SinglePoint Identity Manager, select the **PRODUCT** checkbox.

1. Select **Save**.
