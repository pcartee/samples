---
title: Create/Edit Customers
description: Create and configure customers in Identity Router Studio, including customer context, company and domain information, license agreements, SSO session and cipher-rotation settings, portal configuration, Integrated Windows Authentication, Identity Router NFS and CIFS clustering, User Management, and audit logging.
author: pcartee
topic: administration
date: 09/17/2024
uid: idr-customers
---

The *Customers* page displays all of the customers associated to your Studio System. Studio is designed to enable its users to manage their customers easily and efficiently. For example, the status of a customer is displayed by the highlight of the customer's icon. More information about the customer can be seen by moving your mouse-pointer over the customer's icon and clicking the expand Icon. A fly-over window displays current customer information.

![Customers page with customer status icons](/img/operations-guide/_page_18_Picture_2.jpeg)

The icons under the customer icon enable the System administrator to perform actions on the selected customer. The table below lists the icons and describes the action they enable.

| ICON | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                        |
|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![Context icon](/img/operations-guide/context.png)    | Sets the context of Studio to that of the customer. Setting the context to a particular customer filters the GUI so that you only see the Studio elements that the customer sees (while keeping your System Administrator rights.) Clicking the **Reset Context** link in the upper right-hand corner cancels the impersonating process and returns you to your Administrator role with Studio. |
| ![Cipher Rotation icon](/img/operations-guide/cipher-rotation.png)    | Rotate cipher key - Manually force a cipher-key rotation.                                                                                                                                                                                                                                                                                                                                          |
| ![Delete icon](/img/operations-guide/delete.png)    | Delete the Administrator - Deletes the selected administrator. Only a super administrator can delete other super administrators and administrators.                                                                                                                                                                                                                                                |
| ![Export icon](/img/operations-guide/export.png)     | Exports the customer's information to an XML file. This enables the customer to transition from one Identity Router to another one.                                                                                                                                                                                                                                                                |

## **The New/Edit Customer Dialog**

The *New/Edit Customer* dialog enables the System Administrator to create/edit Studio customers. A customer is anyone who is using Studio to manage access to their Web applications.

All customers are created or edited in the *Edit Customer* dialog, which is accessed from the **Customers** tab on the *System Admin* page.

The *New/Edit Customer* dialog has six tabs on which the customer's information is maintained.

•**Configure** - Create/Edit company information that will be displayed in the fly-over window

- •**SSO Configuration**- Set session length, cipher-, and key-rotation schedules
- **Portal** Configure the customer's portal page
- **Windows Authentication** Configure Integrated Windows Authentication for this customer
- **ID Router Clustering** Configure how multiple Identity Routers will communicate with each other •**Features** - Select the features to which the customer has subscribed

## **Set Customer Context**

The **Set Customer Context** option enables a System administrator to mimic a customer. This option enables the System administrator to run Studio as if they were the customer and ensures they can provide help with the changes and configurations set by the customer.

- 1) Click the **Customers** link at the top of the *Studio* page.
- 2) Mouse over the customer that you want to mimic and click the **Set Customer Context** button.

![Customer icon menu used to set customer context](/img/operations-guide/_page_19_Picture_4.jpeg)

- 3) Click **Yes** at the confirmation window. The context is set to the selected customer.

## **Reset the Context**

After making the necessary changes to the customer's Studio configuration, you must reset the context of the Studio application to the System Administrator context.

- 1) Click **Reset Context** in the upper left-hand corner of the Studio page.
- 2) The customer context is set back to System Administrator.

## **Customer Configuration**

These instructions explain how to create a new customer in Studio. Customers are created by recording information on the customer in the *New/Edit Customer* dialog. The *New/Edit Customer* dialog contains six tabs on which to enter information about the customer. Each tab is explained in the following pages.

The information entered on the **Configuration** tab is displayed when the customer performs a mouse-over their super administrator icon on the *Administrators* page in Studio.

### **Company Information**

- 1) Click the **Customers** link at the top of the page.

![Customers page with the New Customer control](/img/operations-guide/_page_20_Picture_0.jpeg)

- 2) Click the **New Customer** icon.

The *New Customer* dialog displays.

![New Customer dialog with configuration fields](/img/operations-guide/_page_20_Picture_3.jpeg)

![Screenshot of the New Customer section with a blue house icon and a section titled 'Configuration'.](/img/operations-guide/_page_20_Picture_3.jpeg)The screenshot shows the 'New Customer' section of the New Customer service app. It features a blue house icon and a section titled 'Configuration'. The 'Configuration' section includes a 'SSO Configuration' section with a 'Portal' and 'Windows Authentication' buttons, and a 'IDE Clustering' and 'User Management' buttons. A 'Clipped Name' field is shown with a 'Mountain Standard Time' checkmark. A 'Status' field shows 'New'. A 'On Premises Identity Requirement' button is also visible. A 'License Agreement' section is at the top, with a checkmark for 'Enable Click-Through License Agreement'. The 'Studio Sessions' section is below, listing 'Max Session Length' at 42:00 and 'Installably Timeout' at 0:00. A 'Domain' field is shown with a 'Domain' checkmark. A 'Load Key...' button is also visible below the 'Domain' field. A 'Keychain API Configuration' section is below the 'Load Key...' field, with a 'Keychain API Key' checkmark. A 'Cancel' button is at the bottom center.

- 3) Complete the following fields:
  - **Display Name**  Enter a name for the company
  - **Time Zone** Select the appropriate time zone for this customer from the drop-down list • **Status** - Select the appropriate status from the drop-down list •**Parent** - Select the parent organization for this customer
- 4) Select the **On Premises Identity Router** checkbox if the Identity Router is located within the customer's network.

#### **License Agreement**

- 5) To allow customers to agree to an online license agreement, select the **Enable Click-Through License Agreement** checkbox.

#### **Domain**

- 6) Enter the customer's domain name and then click **Load Key**.
- 7) Navigate to the customer's private key. The file should end with the extension ".key".

**Note**: PSA keys in the PEM format are supported.

8) Select the key and then click **Open**.

9) Click **Upload**.

The key is uploaded to Studio.

10) Click **Load Cert**.

11) Navigate to the customer's public key certificate file. It should end in ".cert".

12) Select the key and then click **Open** to load the key.

#### **Keychain API Key**

13) In the **Keychain API Key** textfield, enter the key that will enable the Keychain API to communicate to the Identity Router.

**Note**: The keychain API Key is created by your system administrator.

14) Click **Save** to persist your changes.

## **SSO Configuration**

The **SSO Configuration** tab is used to configure the customer's user session, cipher-rotation and keychainrefresh functions. Each section is explained below.

## **User Session**

Set the length of time a customer can be logged into the portal with and without activity.

1) Select the **SSO Configuration** tab.

![SSO Configuration tab with user session and cipher rotation settings](/img/operations-guide/_page_21_Picture_10.jpeg)

![Screenshot of the New Customer section window showing the 'User Session' and 'Option Rotation' panels.](/img/operations-guide/_page_21_Picture_10.jpeg)The screenshot displays the 'New Customer' section of the New Customer window. The 'User Session' panel on the left shows an icon of a blue and white store building. The 'Option Rotation' panel on the right shows the 'SSO Configuration' and 'Partal' and 'Windows Authentication' icons. The 'User Session' panel contains fields for 'One Time Ruth Window' (3), 'Men Session Length' (43200), 'Inactivity Timeout' (1200), 'Session IP Validation' (checked), 'Limit Concurrent Sessions' (checked), and 'To' (1). The 'Option Rotation' panel contains 'Start' (09/31/2011), 'Internal' (5), and 'Davo' (checked). The 'Adapter Updates' panel on the right shows 'Adapter Updates Time' (10:40) and 'pH' (checked).

2) Complete the following fields:

- **Max Session Length (secs)** Enter the time (in seconds) that can be spent by an active user on the portal
- **Inactivity Timeout (secs)** Enter the amount of time (in seconds) that can be spent on the portal before the user times out for inactivity •**Session IP Validation** - To require a session validation, select the checkbox

• **Limit Concurrent Sessions** - To limit the number of sessions a user can initiate, select the **Concurrent Sessions** checkbox and then enter a value in **Limit** text field - The **Limit** textfield appears when the **Concurrent Sessions** checkbox is selected

3) Click **Save** or continue onto *Cipher Rotation*.

## **Cipher Rotation**

The cipher rotation determines how often the encryption key used to secure the communication between the Identity Router and the cloud is changed. Complete the following fields to configure cipher rotation.

**Warning**: Cipher Rotation must be disabled for High Availability customers.

1) Select the **SSO Configuration** tab.

2) Complete the following fields:

- **Disable** To disable the **Cipher Rotation** feature, select the **Disable** checkbox • **Start** - Click the calendar, select a start date, enter the starting time in the textfield, and then select either **AM** or **PM** from the drop-down list • **Interval** - Enter the amount variable in the **Interval** textfield and then select the value from the drop-down list

**Warning**: During the cipher rotation process, users cannot log in. Be sure to set the cipher rotation to occur at a time when the least amount of user will be logged into Studio.

3) Click **Save** or continue onto *Cloud Keychain Refresh or Adapter Updates below.*

## **Adapter Updates**

- 1) Select the **SSO Configuration** tab.
- 2) To select when the adapter update takes place, enter a time in the **Adapter Update Time** textfield and then select either **AM** or **PM** from the drop-down list
- 3) Click **Save**.

## **Portal - Edit Profile**

The **Portal** tab enables you to configure *SinglePoint® Studio* to funnel all traffic to a portal proxy. There are two types of portal configurations: Default Portal and Custom Portal.

### **Before you begin**

Ensure the following steps have been completed before attempting these instructions.

• Create a Web server with a backend hostname set to the machine hosting the portal and whichever front-end server you want

• Create a new application that has no authentication required and select the **Pass Headers** checkbox. This application needs to use the portal server, have an **Allow All** policy, and needs to protect minimally the portal page itself, though it probably ought to protect all of the portal integration pages

**Note**: If you use the default **Protect All Application Areas** to protect the entire portal Web server, then **everything** on the Web server will be protected. Trying to access images on a login page with the entire portal server protected will result in the images not being displayed because the Identity Router requires you to be logged in to see the images.

Choose the type of portal to configure:

- **Default Portal** on page 14 Configure the default portal
- **Custom Portal** on page 15- Configure a custom portal

## **Default Portal - New Customer**

- 1) Access the *Edit Customer* dialog.
- 2) Select the **Portal** tab if it is not already selected.

The *Portal* dialog displays with the **Default Portal** option selected.

![New Customer dialog with portal configuration options](/img/operations-guide/_page_23_Picture_8.jpeg)

### **Portal Type**

3) Click the Default Portal button.

The default portal fields display.

**Default Portal Server Configuration**

4) Complete the following fields:

• **Company Name** - Enter the company name for this portal • **Home Background URL** - Enter the background URL for this portal • **Portal Background URL** - Enter the portal background • **Help URL** - Enter the help URL for this portal •**Settings URL** - Enter the settings URL for this portal

#### **Default Portal Client Configuration**

- 5) Complete the following fields: • **Image Path** - Enter the relative path to the images used for this portal page • **Default Language** - Select a default language for the Studio user interface • **Default Theme** - Select the default theme from the drop-down list • **Default Position** - Select the default position for the portal •**Auto Dim** - Select this option to enable the auto-dim feature.

6) Click **Save** to persist the changes.

## **Custom Portal - New Customer**

1) Access the *Edit Customer* dialog.

2) Select the **Portal** tab if it is not already selected.

The *Portal* dialog displays with the **Default Portal** option selected.

![Custom Portal configuration screen](/img/operations-guide/_page_24_Diagram_9.jpeg)

### **Portal Type**

#### 3) Click the **Custom Portal** button.

The *Custom Portal* textfields display.

**Note**: In the *Edit Profile* dialog on the **Portal** tab, enter the end-user facing URLs for the portal page, i.e. "https://portal.myco.com/login.jsp", "https://portal.myco.com/portal.jsp", etc... (rather than

"https://backendhostname/login.jsp")

#### **Basic Custom Portal Configuration**

- 4) Complete the following fields:
  - **Login Page** Enter the URL to the login page for the portal
  - **Portal Page** Enter the URL for the portal page that contains the list of Web applications for this customer
  - **Error Page** Enter the URL of the error page to be displayed for this customer
  - **Logout Page** Enter the URL of the page that will be displayed in the event of a logout

**Technical Note**: Inside of the head tag of your logout page, include this line:

<script language="javascript" src="https://<HOSTNAME\_OF\_ROUTER\_HERE>/LogoutJsServlet"></script>

When configuring a custom portal, the following pages must be protected resources: portal, error, and logout.

#### **AJAX Proxy Configuration**

- 5) Optionally select the **Enable AJAX Proxy** checkbox to configure an AJAX proxy, then complete the following fields: • **Portal Path** - Enter the portal path •**Backing Portal Location** - Enter the backing portal location
- 6) Click **Save** to capture the URLs for this customer in SinglePoint® Studio.

## **Windows Authentication**

Integrated Windows Authentication (IWA) is a mechanism which allows an end-user's client (the Internet Explorer Web browser) to log into a domain using stored client information, rather than prompting the end user to manually supply a username and password. To use IWA, the end user must be logged into a local computer as a domain user. Should the initial cryptographic exchange fail, the browser will prompt the user to enter credentials for the domain.

When IWA is enabled on the ID Router, end users that are logged into the Windows domain will not have to manually authenticate to the SinglePoint-portal page or SinglePoint-protected applications in the same domain. SinglePoint® Studio can perform IWA authentication with either a domain controller or with multiple Windows Internet Naming Service (WINS) servers.

To further customize your authentication scheme, SinglePoint® Studio allows administrators to specify a range of client networks which will use IWA. In this scenario, the ID Router will only attempt to initiate an IWA exchange for requests coming from computers in the specified client network. This is useful when a network configuration is configured such that computers using a Microsoft operating system are assigned similar IP addresses.

### **Before You Begin**

Review the list below to ensure all the information needed to perform the task is at hand.

- A valid username and password combination for a user account in the domain. This account will be used to retrieve the initial IWA challenge from the domain controller • The fully qualified name for the domain •The domain name or IP address of the domain controller
- There are two options when configuring IWA in SinglePoint® Studio: o **IWA Enabled - New Customer** on page 64 o **IWA Enabled by IP Networks - New Customer** on page 66

## **IWA Enabled**

Use these instructions to configure Integrated Windows Authentication with Kerberos in SinglePoint® Studio.

### **Before You Begin**

Review the list below to ensure all the information needed to perform the task is at hand.

- A valid username and password combination for a user account in the domain. This account will be used to retrieve the initial IWA challenge from the domain controller •The fully qualified name for the domain

## **Configure IWA with Kerberos**

Follow these steps to configure IWA with Kerberos within SinglePoint® Studio. The **Windows Authentication** tab is accessed from the *Edit Profile* dialog.

- 1) To access the *Edit Profile* dialog, click the **Edit Profile** link in the upper right-hand corner of the *SinglePoint® Studio* page.
- 2) The *Edit Profile* dialog displays.

3) Select the **Windows Authentication** tab.

![Windows Authentication configuration fields in Studio](/img/operations-guide/_page_27_Picture_1.jpeg)

4) Select **Enabled** from the **Status** drop-down list.

**Note**: If you have an existing IWA configuration and you change the status to **Disabled**, the configuration information is deleted.

5) Complete the following fields:

- • **Username** - A username for an account on the domain •**Password** - The password for the specified account
- **Domain Name** The fully qualified name of the domain
- **WINS Name** The WINS-style domain name is automatically extracted and displayed

6) Optionally make the ID Router a member of your network by clicking the **Join** button. The ID Router must be on the domain network, and does not have to be on the premises.

**Technical Note**: - Add Identity Router to Windows DNS Manager - Kerberos

You must add the Identity Router to your Windows DNS Manager to enable the Identity Router to perform IWA.

**To add the Identity Router to your DNS Manager on Windows Server 2003 - 2008:**

Go to **Administrative Tools>DNS**. In the left-hand menu, select your domain in the **Forward Lookup Zones** section. In the right-hand window, right-click and select **New Host (A or AAAA),** and then enter the information about your ID Router. The IP address of the host should be configured with the proxy IP address (public IP address) of your Identity Router.

When adding a new host record to the forward lookup zone, please be sure that the checkbox labeled

**Create associated pointer (PTR) record** is checked (it will be checked by default). If the proxy IP address of the Identity Router is in an IP address range that is already defined as a reverse lookup zone, create the new record in the forward lookup zone. If the IP address range IS NOT defined as a reverse lookup zone, then do not add the record to the forward lookup zone until the IP address range containing the proxy IP address has been added as a new reverse lookup zone. For more information on creating reverse lookup zones, please consult Microsoft's documentation.

**Technical Note:** - Add the Identity Router to the Trusted Intranet Servers List

Windows clients will only respond to IWA challenges from servers located within the client's domain. The client's browser determines if a server is within their domain by verifying that the server's DNS short name is used instead of the fully qualified DNS name. To allow a client to receive a successful IWA challenge and respond to that challenge, the URL of the Identity Router must be added to the "Local Intranet Sites List" in Internet Explorer (**Tools>Internet Options>Local Intranet>Sites>Advanced**). To add the Identity Router's URL to all clients' Internet Explorer's "Local Intranet sites list", use the GPO to push the registry settings that represent the "Local Intranet Sites List" to all clients. Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.

### **Technical Note: IWA Kerberos Windows 7 Security Update**

Due to a new feature in Windows 7 (which has been backported to older versions of Windows via a security patch) a registry entry must be added to individual Windows clients before they can perform IWA. The registry entry that must be added is

**HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\LSA\SuppressExtendedProtection.** The value of the entry should be **2**. This addition needs to be applied ONLY if the client machines have been updated with the Windows 7 Security Update. The official announcement from Microsoft can be found at http://support.microsoft.com/kb/968389. Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.

7) Click **Save** to persist your changes.

## **IWA - Enabled by IP Networks**

When IWA by IP Networks with Kerberos is configured, the ID Router(s) will only attempt IWA for requests coming from machines in the specified IP range(s).

Use these instructions to configure Integrated Windows Authentication with Kerberos in IP Networks in SinglePoint® Studio.

### **Before You Begin**

Review the list below to ensure all the information needed to perform the task is at hand.

• A valid username and password combination for a user account in the domain. This account will be used to retrieve the initial IWA challenge from the domain controller • The fully qualified name for the domain •The domain name or IP address of the domain controller

## **Configure IWA with Kerberos by IP Networks**

Follow these steps to configure IWA with Kerberos by IP Networks within SinglePoint® Studio. The **Windows Authentication** tab is accessed from the *Edit Profile* dialog.

- 1) To access the *Edit Profile* dialog, click the **Edit Profile** link in the upper right-hand corner of the *SinglePoint® Studio* page.
- 2) The *Edit Profile* dialog displays.
- 3) Select the **Windows Authentication** tab.

![Windows Authentication settings with client IP network fields](/img/operations-guide/_page_29_Picture_4.jpeg)

![Screenshot of the New Customer window showing the Integrated Windows Authentication section. The IP address is 'IP Networks'. The Windows Authentication section includes fields for Status (Enabled by IP Networks), Username, Password, Domain Name, WINS Name, Token Validity Period, and IWA Client Networks. A screenshot of the IP Networks section is shown at the bottom left.](/img/operations-guide/_page_29_Picture_4.jpeg)

- 4) Select the **Enabled by IP Networks** from the **Status** drop-down list. **Note**: If you have an existing IWA configuration and you change the status to **Disabled**, the configuration information is deleted.
- 5) Complete the following fields: • **Username** - A username for an account on the domain
  - **Password**  The password for the specified account •**Domain Name** - The fully qualified name of the domain
  - **WINS Name** The WINS-style domain name is automatically extracted and displayed
- 6) In the **IP** field, enter the starting IP for your network.
- 7) In the **Mask** field, enter a value to allow eight or more addresses in the class C subnet. For example:

**255.255.248.0**.

- 8) Click the **Join** button to make the ID Router a member of your domain. The ID Router only needs to be connected to the domain network, and does not have to be physically on the premises.
- 9) Click **Save** to persist your changes.

**Technical Note**: - Add Identity Router to Windows DNS Manager - Kerberos

You must add the Identity Router to your Windows DNS Manager to enable the Identity Router to perform IWA.

### **To add the Identity Router to your DNS Manager on Windows Server 2003 - 2008:**

Go to **Administrative Tools>DNS**. In the left-hand menu, select your domain in the **Forward Lookup Zones** section. In the right-hand window, right-click and select **New Host (A or AAAA),** and then enter the information about your ID Router. The IP address of the host should be configured with the proxy IP address (public IP address) of your Identity Router.

When adding a new host record to the forward lookup zone, please be sure that the checkbox labeled **Create associated pointer (PTR) record** is checked (it will be checked by default). If the proxy IP address of the Identity Router is in an IP address range that is already defined as a reverse lookup zone, create the new record in the forward lookup zone. If the IP address range IS NOT defined as a reverse lookup zone, then do not add the record to the forward lookup zone until the IP address range containing the proxy IP address has been added as a new reverse lookup zone. For more information on creating reverse lookup zones, please consult Microsoft's documentation.

#### **Technical Note:** - Add the Identity Router to the Trusted Intranet Servers List

Windows clients will only respond to IWA challenges from servers located within the client's domain. The client's browser determines if a server is within their domain by verifying that the server's DNS short name is used instead of the fully qualified DNS name. To allow a client to receive a successful IWA challenge and respond to that challenge, the URL of the Identity Router must be added to the "Local Intranet Sites List" in Internet Explorer (**Tools>Internet Options>Local Intranet>Sites>Advanced**). To add the Identity Router's URL to all clients' Internet Explorer's "Local Intranet sites list", use the GPO to push the registry settings that represent the "Local Intranet Sites List" to all clients. Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.

#### **Technical Note:** - IWA Kerberos Windows 7 Security Update

Due to a new feature in Windows 7 (which has been backported to older versions of Windows via a security patch) a registry entry must be added to individual Windows clients before they can perform IWA. The registry entry that must be added is

**HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\LSA\SuppressExtendedProtection.** The

value of the entry should be **2**. This addition needs to be applied ONLY if the client machines have been updated with the Windows 7 Security Update. The official announcement from Microsoft can be found at http://support.microsoft.com/kb/968389. Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.

## **Identity Router Clustering - New Customer**

When using more than one ID Router, you must designate one router as the connection to the outside world to accept all incoming traffic. These instructions explain how to designate an ID Router to handle all incoming traffic.

**Note**: Identity Router clustering can only be enabled by a Symplified Administrator.

- 1) Click the **Customers** link at the top of the page.
- 2) Click the **New Customer** icon. The *New Customer* dialog displays.
- 3) Select the **IDR Clustering** tab. The *IDR Clustering* dialog displays.

![Customer dialog with the IDR Clustering tab selected](/img/operations-guide/_page_31_Picture_5.jpeg)

- 4) Select the **Clustering Enabled** checkbox to enable IDR Clustering and then select the type of clustering to perform: •**Identity Router NFS Clustering** on page 73

•**Identity Router CIFS Clustering** on page 69

**Technical Note:** The following 3 load-balancer products are supported with SinglePoint® Studio:

\* CISCO ACE family \* F5 Big-IP family \* Citrix Netscaler

All of these products support" session persistence" or sticky sessions.

We recommend that you use "HTTP Cookie Persistence with Cookie Insert method" to support session stickiness

## **Identity Router NFS Clustering - New Customer**

Follow these steps to configure Identity Router NFS clustering.

- 1) Click the **Customers** link at the top of the page.
- 2) Click the **New Customer** icon. The *New Customer* dialog displays.
- 3) Select the **IDR Clustering** tab. `<Identity_Route_NSF_Clustering_New_Customer>`
- 4) Complete the following fields: • **Clustering Enabled** - Check this box to enable ID Router clustering • **Clustering Type** - Select **NFS** from the drop-down list
  - **Load balancer DNS name** Enter the DNS name of the load balancer for the ID Router cluster • **Routing Interface** - Choose the type of interface the Identity Router will use frrom the following: o If the Identity Router is behind a protected firewall, select Private o If the Identity Router is behind outside of the firewall, select public
  - **IP Address** Enter the IP Address for the NFS server •**Path** - Enter the path to the NFS server
- 5) Click **Test** to ensure a connection can be made between SinglePoint® Studio and the ID Router.
- 6) Click **Save** to keep the configuration. NFS clustering has been configured.

## **Identity Router CIFS Clustering - New Customer**

These instructions are divided into 2 sections: *Set the LMCompatibilityLevel* and *Configure Identity Router CIFS Clustering*.

## **Set the LMCompatibilityLevel**

To configure an Identity Router for CIFS clustering, you must configure the LMCompatiblityLevel. This must be done through the UI in Windows Server 2008. Follow the instructions below to set the correct LMCompatibilityLevel.

- 1) At the Windows Server 2008 desktop, select Start->Run
- 2) Enter **run gpmc.msc** and click **OK**. The *Group Policy Management* dialog displays.

![Group Policy Management console](/img/operations-guide/_page_33_Picture_3.jpeg)

![Screenshot of the Group Policy Management window showing the 'Defealt Domain Controllers Policy' section. The left sidebar shows the 'Group Policy Management' section with various policy types like 'Forest', 'Consens', 'Group Policy Objects', 'Stress', 'Group Policy Modeling', and 'Group Policy Results'. The right sidebar shows the 'Defealt Domain Controllers Policy' section with 'Scope' (Default), 'Settings' (Delegation), 'Links' (Display links in this location), and 'The following sites, domains, and UIUs are linked to this GPD'. The 'Location' section shows 'Domain Controllers' and 'States GPOs'. The 'Security Filtering' section shows 'Name' and 'Sig, Sufficiented Users'. The 'WMI Filtering' section shows 'The GPD is linked to the following WMI links: 'cnomo'.](/img/operations-guide/_page_33_Picture_3.jpeg)

- 3) Select the domain of interest, e.g. cust2.env2, expand as follows: `<domain>->Domain Controllers->Default Domain Controllers Policy`
- 4) Right click on **Group Domain: Controller Policies** under the domain of interest and select **Edit**.

The *Group Policy Management Editor* dialog displays.

![Group Policy Management Editor navigation tree](/img/operations-guide/_page_34_Picture_2.jpeg)

- 5) On the Group Policy Management *Editor* dialog, select **Computer Configuration->Policies->Windows Settings->Security Settings->Local Policies->Security Options**, as shown above.
- 6) In the *Policy* section, right click **Network security: LAN Manager authentication level** and select the desired policy and click **OK**.

![LAN Manager authentication policy settings](/img/operations-guide/_page_34_Picture_5.jpeg)

**Warning**: Do not select **Send NTLM v2 response only Refuse LM & NTLM** because this policy will not work with Studio.

- 7) Exit the *Group Policy Management Editor* dialog and then exit the G*roup Policy Management* dialog.
- 8) At the command line, run **gpupdate /force** to push the changes.
- 9) Click the **Customers** link at the top of the page.

10) Click the **New Customer** icon.

The *New Customer* dialog displays.

11) Select the **IDR Clustering** tab.

![New Customer dialog with clustering configuration](/img/operations-guide/_page_35_Picture_4.jpeg)

![Screenshot of the New Customer interface showing the 'Clustering Configuration' tab with a blue house icon and a clustering tree button.](/img/operations-guide/_page_35_Picture_4.jpeg)

- 12) Complete the following fields: • **Clustering Enabled** - Check this box to enable clustering for this customer • **Clustering Share Type** - Select **CIFS** from the drop-down list • **Load balancer DNS name** - Enter the DNS name of the load balancer for ID Router clustering
  - **Routing Interface** Choose the type of interface the Identity Router will use from the following: o If the Identity Router is behind ar protected firewall, select Private o If the Identity Router is behind outside of the firewall, select public
  - **IP Address** Enter the IP Address of the CIFS server •**CIFS Share Name -** Enter the Share name of the CIFS server
  - **CIFS Username** Enter the CIFS username
  - **CIFS Password** Enter the CIFS password
  - **Use Guest** If guest accounts are allowed, check the **Use Guest** checkbox
- 13) Click **Test** to ensure that the information is correct and that a connection can be established between SinglePoint® Studio and the Identity Router.
- 14) Click **Save** to keep the configuration. CIFS clustering has been configured.

### **User Management - New Customer**

This User Management tab enables the customer to enable and configure User Management.

User Management is a separate feature and must be enabled by the system administrator. If the User Management tab does not appear on the Edit Profile dialog, contact your system administrator.

**Note**: You must set the context of Studio to a customer before attempting these instructions.

- 1) Click the **Edit Profile** link in the upper right-hand corner of any Studio page. The *Edit Profile* dialog displays.
- 2) Select the **User Management** tab. The *User Management* dialog displays.

![User Management Database Configuration settings](/img/operations-guide/_page_36_Picture_6.jpeg)

- 3) Complete the following fields: • **User** Management Enabled - Select this checkbox to activate User Management • **Type** - Select the database User Management wil use to store users • **Routing Interface** - Select the routing interface used on the Identity Router from the dropdown list • **Server** - Enter the IP of the server on which User Manager is installed • **Port** - enter the port use to connectd to User Manager • **Instance Name** - enter the instance for User Manager • **Username** - Enter the username for the database User Manager is accessing
  - **Password**  Enter the password for the database User Manger is accessing
  - **Test**  Click this button to test the configuration
- 4) Click **Save** to persist the changes.

## **Audit Logging**

These instructions explain how to configure audit logging for your Identity Router. The audit logs can be stored to a file or stored on a customer's SysLog server.

### **Audit Logging Configuration**

- 1) Click the **Edit Profile** link in the upper right-hand corner of any Studio page. The *Edit Profile* dialog displays .
- 2) Select the **Audit Logging** tab.

The *Audit Logging* dialog displays.

![Audit Logging Configuration tab and event settings](/img/operations-guide/_page_37_Picture_5.jpeg)

![Screenshot of the Audit Logging Configuration interface showing the Audit Logging Enabled and User Events enabled checkboxes.](/img/operations-guide/_page_37_Picture_5.jpeg)The image shows the Audit Logging Configuration interface for a blue house. The top section has a bar with the title 'Edit Profile' at the top and 'Hy Profile' at the bottom. Below the title is a section titled 'Audit Logging Configuration'. The interface includes the following tabs:

- **Hy Profile** - 'Hy Company'
- **Hy Company** - 'Portal'
- **Portal** - 'Windows App'
- **Windows App** - 'IDR ClusterL'
- **IDR ClusterL** - 'User Handg...'
- **User Handg...** - 'Backup'
- **Backup** - 'Restare'
- **Audit Logging** - 'Audit Logging'
- **Audit Source** - 'AuditN Source...'

The interface is divided into two main sections:

- **Audit Logging Enabled** - This section is the highlighted area with a checkbox for 'Audit Logging Enabled'.
- **User Events Enabled** - This section is the highlighted area with a checkbox for 'User Events Enabled'.
- **Authorization Request Events Enabled** - This section is the highlighted area with a checkbox for 'Authorization Request Events Enabled'.
- **System Events Enabled** - This section is the highlighted area with a checkbox for 'System Events Enabled'.
- **System Error Events Enabled** - This section is the highlighted area with a checkbox for 'System Error Events Enabled'.
- **Output Type** - This section is the highlighted area with a button 'File Data' and a '\*' button.

At the bottom of the screen, there is a control button titled 'Stop' and a 'Cancel' button.

- 3) Configure Audit Logging by checking the boxes of the events to be logged: • **Audit Logging Enabled** - Check this box to enable the logging feature. Deselect this check box to hide the fields on the page • **User Events Enabled** - Check this box to log user events o **Authorization Request Events Enabled** - Check this box to log authorization request events (which are also user-related events, and therefore, affected by the above checkbox as well) • **System Event Enabled** - Check this box to log system-related events o **System Error Events Enabled** - Check this box to log system-errors events (which are also system-related events, and therefore affected by the above checkbox as well) •**Output Type** - Check this box to determine what method will be used to create logs

o **File Only** - This option only stores log files to the symplified-audit.log on the Identity Router - This is the default option o **Syslog** - In addition to storing the symplified-audit.log file on the Identity Router, this option also stores log files to a Syslog server as configured in **Local Disk Backup** on page 78 on the Backup tab

#### **SysLog Configuration**

The SysLog fields only display when the SysLog option is selected from the **Output Type** drop-down.

**Note**: The SysLog server is completely independent from Studio. It must setup by the customer.

Before you begin, have the Systlog server information from which the logs will be drawn.

#### 4) Complete the following fields:

• **Server** - Enter the IP address of the server that the to which the Identity Router will log to • **Port** - Enter the port number of the SysLog Server to which the Identity Router will send messages • **Protocol** - Select the protocol from the drop-down list that the Identity Router must use to send the messages to the SysLog server • **Routing Interface** - Select the interface from the drop-down list from which that SysLog logs will be sent out • **Security Method** - This option determines if the Identity Router will add additional information to the log messages to try to prove that they are authentic and have not been tampered with moving between the Identity Router and the SysLog server

**Note**: The HMAC, SHA-1 and SHA-2 security method options require a password. The Password field for these security method options displays when any of the options are selected.

#### 5) Click **Save** to persist the changes.

#### **Features**

The **Features** tab enables the System administrator to select the features to which the customer has subscribed.

![Features tab listing customer features and their enabled status](/img/operations-guide/_page_39_Picture_3.jpeg)

- 1) Select the Features appropriate for the this customer: • To activate the Keycahin, select the **PRODUCT** checkbox
  - To activate Allow SSO Pass-through, select the **PRODUCT** checkbox
  - To activate enable Prototype View, select the **Development** checkbox
  - To activate the enable SinglePoint Studio Express, select the **PRODUCT** checkbox
  - To enable the SinglePoint Identity Manager, select the **PRODUCT** checkbox

  - 2) Click **Save** to persist the change(s).
