---
title: Edit Profile Information
description: Configure Identity Router and customer settings in Studio through the Edit Profile dialog, including company information, user sessions, domains, Keychain API credentials, default and custom portals, Integrated Windows Authentication (IWA) with Kerberos and IP networks, CIFS and NFS clustering, User Management, SFTP, Amazon EC2 and local disk backups, keychain restore, audit logging, and authentication sources.
author: pcartee
topic: administration, configuration, authentication, clustering, backup, audit-logging
date: 09/17/2024
uid: idr-edit-profile
---

The Edit Profile dialog enables the administrator to edit/update their information and information about the company. Go to the following topics for instructions on changing the information on the *Edit Profile* dialog.

**My Profile** - Edit your company profile information.

**My Company** - Edit Company Information, User Sessions, and Keychain API Configuration.

**Portal** - Configure Studio to funnel all traffic for a particular customer to a portal proxy. There are three types of portal configuration: Default, Basic Custom and Advanced Custom. This option is only available to Super Administrators and System Administrators.

**Windows Authentication** - Configure Integrated Windows Authentication for Studio. This option is only available to Super Administrators and System Administrators.

**Identity Router Clusterin**g - Only a Super Administrator can edit the Identity Router Clustering information. This option is only available to Super Administrators.

**Backup** - Configure when the keychain is backed up

**Restore** - Restore the keychain from a list of preconfigured dates

**Audit Logging** - Configure logging fore the Identity Router

AuthN Sources – Configure which sources will be used for Authentication

## **My Profile**

When logged into Studio as a system administrator, setting the context to a customer will deactivated the **My Profile** tab. A system administrator cannot change the information on the **My Profile** tab.

- 1) To update your administrator information, click the **Edit Profile** link at the upper right-hand of the Studio page.

The *Edit Profile* dialog displays.

## **My Company**

The **My Company** tab is divided into four sections: *Company Information*, *User Sessions*, *Domain*, and *Keychain API Configuration*. Each section is covered below.

### **Company Information**

1) To update company information, click the **Edit Profile** link at the upper right of the *SinglePoint® Studio* page.

- The *Edit Profile* dialog displays.
- 2) Select the **My Company** tab to display the *My Company* dialog.

![My Company tab with company information fields](/img/operations-guide/_page_68_Picture_5.jpeg)

3) Edit the appropriate fields:

- **Display Name** Enter the name of the company. The name entered in this field will be displayed on the *Customer* page in SinglePoint® Studio •**Time Zone** - Select the appropriate time zone from the drop-down list

#### **User Sessions**

4) Complete the following fields:

- • **One Time Auth Window** - Enter the time (in milliseconds) a user is allowed to keep an authentication window open while waiting for a response. This option is valuable if an organization has many remote users logging into an access point. If the users are being timed out from their session while trying to be authenticated, increase this setting to ensure the user is given enough time to keep the session open while waiting for authentications that take longer than expected
- **Max Session Length (secs)** Enter the maximum time (in seconds) that a session can be open • **Inactivity Timeout (secs)** - Enter the length of time (in seconds) that a session can be open without any activity • **Session IP Validation** - Check this box to ensure that the session IP is validated before starting or restarting it
- **Limit Concurrent Sessions** Check this box to limit the amount of concurrent user sessions on the

Identity Router, and then enter the desired number of concurrent sessions in the textfield

#### **Domain**

5) Complete the following fields:

• In the **Domain** textfield, enter the name of the domain to which the customer belongs. • **Load Key...** - Click the **Load Key...** button, navigate to the key associated to this Identity Router and click the **Upload** button. Note that the **Load Key** button name is changed to **Reload Key** • **Load Cert...** - Click the **Load Cert...** button, navigate to the certificate associated to this Identity Router and click the **Upload** button. Note that the **Load Cert...** button name is changed to **Reload Cert...** • **Load Cert Chain... -** Click the Load Cert Chain... button, navigate to the Keychain Certificate associated with this Identity Router and click the **Upload** button. Note that the **Load Cert Chain...** button name is changed to **Reload Cert Chain...**

#### **Keychain API Configuration**

6) In the **Keychain API Key** textfield, enter the key (given to you by your system administrator) that will enable the Keychain API to communicate to the ID Router.

**Note**: The Keychain API key is created by your system administrator.

#### 7) Click **Save** to persist the key.

## **Portal**

The **Portal** tab enables you to configure *SinglePoint® Studio* to funnel all traffic to a portal proxy. There are two types of portal configurations: Default Portal and Custom Portal.

### **Before you begin**

Ensure the following steps have been completed before attempting these instructions.

• Create a Web server with a backend hostname set to the machine hosting the portal and whichever front-end server you want • Create a new application that has no authentication required and select the **Pass Headers** checkbox. This application needs to use the portal server, have an **Allow All** policy, and needs to protect minimally the portal page itself, though it probably ought to protect all of the portal integration pages

**Note**: If you use the default **Protect All Application Areas** to protect the entire portal Web server, then **everything** on the Web server will be protected. Trying to access images on a login page with the entire portal server protected will result in the images not being displayed because the Identity Router requires you to be logged in to see the images.

Select a portal type to configure:

• **Default Portal** on page 61 - Configure the default portal •**Custom Portal** on page 62 - Configure a custom portal

## **Default Portal**

- 1) Access the *Edit Profile* dialog.
- 2) Select the **Portal** tab (if it is not already selected).

The *Portal* dialog displays.

![Portal tab with default portal server and client configuration](/img/operations-guide/_page_70_Picture_4.jpeg)

### **Portal Type**

- 3) Click the Default Portal button. The default portal fields display.

#### **Default Portal Server Configuration**

- 4) Complete the following fields: • **Company Name** - Enter the company name for this portal • **Home Background URL** - Enter the background URL for this portal
  - **Portal Background URL** Enter the portal background • **Help URL** - Enter the help URL for this portal •**Settings URL** - Enter the settings URL for this portal

#### **Default Portal Client Configuration**

- 5) Complete the following fields: • **Image Path** - Enter the relative path to the images used for this portal page • **Default Language** - Select a default language for the Studio user interface
  - **Default Theme** Select the default theme from the drop-down list •**Default Position** - Select the default position for the portal

- •**Auto Dim** - Select this option to enable the auto-dim feature.
- 6) Click **Save** to persist the changes.

## **Custom Portal**

- 1) Access the *Edit Customer* dialog.
- 2) Select the **Portal** tab if it is not already selected.

The *Portal* dialog displays with the **Default Portal** option selected.

![Portal Type settings with default and custom portal options](/img/operations-guide/_page_71_Picture_4.jpeg)

![Screenshot of the Edit Profile setting in Atlantic Sources viewing a portal type setting.](/img/operations-guide/_page_71_Picture_4.jpeg)The screenshot displays the 'Edit Profile' setting in Atlantic Sources. The top bar shows the 'Edit Profile' icon and the 'My Company' button. The middle bar contains the 'Portal' button, 'Windows Add', 'EDN Clusters', 'User Manag', 'Backup', 'Restore', 'Audit Logging', and 'AuthN Source'. The bottom bar shows the 'Portal Type' button with two checked options: 'Default Portal' and 'Custom Portal'. The 'Portal Type' button is checked and shows 'Basic Custom Portal Configuration'. The 'Portal Page' button is a small rectangular box. The 'Portal Page' button is also checked. The 'Error Page' button is also checked. A small button 'Enable ATAX Proxy' is also checked. The 'ATAX Proxy Configuration' button is checked. The 'Portal Path' button is a small rectangular box. The 'Retrieving Portal Levels' button is also checked. The bottom bar contains the 'Close' icon, 'Search' icon, and 'Closed' icon.

### **Portal Type**

3) Click the **Custom Portal** button.

The *Custom Portal* textfields display.

**Note**: In the *Edit Profile* dialog on the **Portal** tab, enter the end-user facing URLs for the portal page, i.e. "https://portal.myco.com/login.jsp", "https://portal.myco.com/portal.jsp", etc... (rather than "https://backendhostname/login.jsp")

#### **Basic Custom Portal Configuration**

- 4) Complete the following fields: • **Login Page** - Enter the URL to the login page for the portal • **Portal Page** - Enter the URL for the portal page that contains the list of Web applications for this customer • **Error Page** - Enter the URL of the error page to be displayed for this customer •**Logout Page** - Enter the URL of the page that will be displayed in the event of a logout

**Technical Note**: Inside of the head tag of your logout page, include this line:

<script language="javascript" src="https://<HOSTNAME\_OF\_ROUTER\_HERE>/LogoutJsServlet"></script>

When configuring a custom portal, the following pages must be protected resources: portal, error, and logout.

#### **AJAX Proxy Configuration**

- 5) Optionally select the **Enable AJAX Proxy** checkbox to configure an AJAX proxy, then complete the following fields:
  - **Portal Path** Enter the portal path
  - **Backing Portal Location** Enter the backing portal location
- 6) Click **Save** to capture the URLs for this customer in SinglePoint® Studio.

## **Windows Authentication**

Integrated Windows Authentication (IWA) is a mechanism which allows an end-user's client (the Internet Explorer Web browser) to log into a domain using stored client information, rather than prompting the end user to manually supply a username and password. To use IWA, the end user must be logged into a local computer as a domain user. Should the initial cryptographic exchange fail, the browser will prompt the user to enter credentials for the domain.

When IWA is enabled on the Identity Router, end users that are logged into the Windows domain will not have to manually authenticate to the portal page or protected applications in the same domain. Studio can perform IWA authentication with either a domain controller or with multiple Windows Internet Naming Service (WINS) servers.

To further customize your authentication scheme, Studio allows administrators to specify a range of client networks which will use IWA. In this scenario, the Identity Router will only attempt to initiate an IWA exchange for requests coming from computers in the specified client network. This is useful when a network configuration is configured such that computers using a Microsoft operating system are assigned similar IP addresses.

### Before You Begin

Before attempting to configure IWA, please have the following information:

• A valid username and password combination for a user account in the domain. This account will be used to retrieved the initial IWA challenge from the domain controller • The fully qualified name for the domain •The domain name or IP address of the domain controller

## **IWA Enabled - Edit Profile**

Use these instructions to configure Integrated Windows Authentication with Kerberos enabled in SinglePoint Studio.

### **Before You Begin**

Before attempting to configure IWA, please have the following information:

- • A valid username and password combination for a user account in the domain. This account will be used to retrieved the initial IWA challenge from the domain controller
- The fully qualified name for the domain

## **Configure IWA with Kerberos**

Follow these steps to configure IWA with Kerberos within SinglePoint Studio.

- 1) Click the **Customers** link at the top of the page.
- 2) Click the **New Customer** icon. The *New Customer* dialog displays.
- 3) Select the **Windows Authentication** tab.
- 4) Select **Enable** from the **Status** drop-down list.

![Windows Authentication settings for Kerberos](/img/operations-guide/_page_73_Picture_8.jpeg)

**Note**: If you have an IWA configuration already saved and you change the status to **Disabled**, the

configuration information is deleted.

- 5) Complete the following fields:
  - **Username**  A username for an account on the domain
  - **Password**  The password for the specified account
  - **Domain Name** The fully qualified name of the domain
  - **WINS Name** The WINS-style domain name is automatically extracted and displayed •**Token Validity** - Enter number of days the current token will be valid
- 6) Optionally, make the ID Router a member of your network by clicking the **Join** button. The ID Router must be on your premises to be able to join your network.

**Technical Note**: - Add Identity Router to Windows DNS Manager - Kerberos

You must add the Identity Router to your Windows DNS Manager to enable the Identity Router to perform IWA.

**To add the Identity Router to your DNS Manager on Windows Server 2003 - 2008:**

Go to **Administrative Tools>DNS**. In the left-hand menu, select your domain in the **Forward Lookup Zones** section. In the right-hand window, right-click and select **New Host (A or AAAA),** and then enter the information about your ID Router. The IP address of the host should be configured with the proxy IP address (public IP address) of your Identity Router.

When adding a new host record to the forward lookup zone, please be sure that the checkbox labeled **Create associated pointer (PTR) record** is checked (it will be checked by default). If the proxy IP address of the Identity Router is in an IP address range that is already defined as a reverse lookup zone, create the new record in the forward lookup zone. If the IP address range IS NOT defined as a reverse lookup zone, then do not add the record to the forward lookup zone until the IP address range containing the proxy IP address has been added as a new reverse lookup zone. For more information on creating reverse lookup zones, please consult Microsoft's documentation.

### **Technical Note: Add the Identity Router to the Trusted Intranet Servers List**

Windows clients will only respond to IWA challenges from servers located within the client's domain. The client's browser determines if a server is within their domain by verifying that the server's DNS short name is used instead of the fully qualified DNS name. To allow a client to receive a successful IWA challenge and respond to that challenge, the URL of the Identity Router must be added to the "Local Intranet Sites List" in Internet Explorer (**Tools>Internet Options>Local Intranet>Sites>Advanced**). To add the Identity Router's URL to all clients' Internet Explorer's "Local Intranet sites list", use the GPO to push the registry settings that represent the "Local Intranet Sites List" to all clients. Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.

#### **Technical Note:** - IWA Kerberos Windows 7 Security Update

Due to a new feature in Windows 7 (which has been backported to older versions of Windows via a security patch) a registry entry must be added to individual Windows clients before they can perform IWA. The registry entry that must be added is

**HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\LSA\SuppressExtendedProtection.** The value of the entry should be **2**. This addition needs to be applied ONLY if the client machines have been updated with the Windows 7 Security Update. The official announcement from Microsoft can be found at http://support.microsoft.com/kb/968389. Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.

## **IWA Enabled by IP Networks - Edit Profile**

Use these instructions to configure Integrated Windows Authentication with Kerberos in IP Networks in SinglePoint® Studio.

### **Before You Begin**

Before attempting to configure IWA, please have the following information:

• A valid username and password combination for a user account in the domain. This account will be used to retrieved the initial IWA challenge from the domain controller • The fully qualified name for the domain •The domain name or IP address of the domain controller

## **Configure IWA with Kerberos by IP Networks**

Follow these steps to configure IWA with Kerberos by IP Networks within SinglePoint Studio.

- 1) Click the **Customers** link at the top of the page.
- 2) Click the **New Customer** icon. The *New Customer* dialog displays.
- 3) Select the **Windows Authentication** tab.

4) Select the **Enabled Kerberos by IP Networks** from the **Status** drop-down list.

![Windows Authentication settings with IP network configuration](/img/operations-guide/_page_76_Picture_1.jpeg)

![Screenshot of the Windows App Edit Profile showing the 'Integrated Windows Authentication' section. The section includes a field for 'Status' with a button 'Enabled by IP Networks' and a field for 'Username', 'Password', 'Domain Name', 'WINS Name', and 'Taken validity Period'. The 'IWA Client Networks' section shows a screenshot of a Windows App Edit profile with a 'IP' field and a 'Mask' field. A 'QA3-KSY' note is at the bottom center.](/img/operations-guide/_page_76_Picture_1.jpeg)**Note**: If you have an IWA configuration already saved and you change the status to **Disabled**, the configuration information is deleted.

- 5) Complete the following fields: o **Username** - A username for an account on the domain o **Password** - The password for the specified account o **Domain Name** - The fully qualified name of the domain o **WINS Name** - The WINS-style domain name is automatically extracted and displayed o **Token Validity** - Enter number of days the current token will be valid
- 6) In the **IP** field, the starting IP for your network.
- 7) In the **Mask** field, enter the class C subnet, A.K.A. /24 in CIDR notation.
- 8) Optionally, make the ID Router a member of your network by clicking the **Join** button. The ID Router must be on your premises to be able to join your network.
- 9) Click **Test** to test your configuration.

**Technical Note**: - Add Identity Router to Windows DNS Manager - Kerberos

You must add the Identity Router to your Windows DNS Manager to enable the Identity Router to perform IWA.

**To add the Identity Router to your DNS Manager on Windows Server 2003 - 2008:**

Go to **Administrative Tools>DNS**. In the left-hand menu, select your domain in the **Forward Lookup Zones** section. In the right-hand window, right-click and select **New Host (A or AAAA),** and then enter the information about your ID Router. The IP address of the host should be configured with the proxy IP address (public IP address) of your Identity Router.

When adding a new host record to the forward lookup zone, please be sure that the checkbox labeled **Create associated pointer (PTR) record** is checked (it will be checked by default). If the proxy IP address of the Identity Router is in an IP address range that is already defined as a reverse lookup zone, create the new record in the forward lookup zone. If the IP address range IS NOT defined as a reverse lookup zone, then do not add the record to the forward lookup zone until the IP address range containing the proxy IP address has been added as a new reverse lookup zone. For more information on creating reverse lookup zones, please consult Microsoft's documentation.

**Technical Note:** - Add the Identity Router to the Trusted Intranet Servers List

Windows clients will only respond to IWA challenges from servers located within the client's domain. The client's browser determines if a server is within their domain by verifying that the server's DNS short name is used instead of the fully qualified DNS name. To allow a client to receive a successful IWA challenge and respond to that challenge, the URL of the Identity Router must be added to the "Local Intranet Sites List" in Internet Explorer (**Tools>Internet Options>Local Intranet>Sites>Advanced**). To add the Identity Router's URL to all clients' Internet Explorer's "Local Intranet sites list", use the GPO to push the registry settings that represent the "Local Intranet Sites List" to all clients. Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.

### **Technical Note: IWA Kerberos Windows 7 Security Update**

Due to a new feature in Windows 7 (which has been backported to older versions of Windows via a security patch) a registry entry must be added to individual Windows clients before they can perform IWA. The registry entry that must be added is **HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\LSA\SuppressExtendedProtection.** The value of the entry should be **2**. This addition needs to be applied ONLY if the client machines have been updated with the Windows 7 Security Update. The official announcement from Microsoft can be found at http://support.microsoft.com/kb/968389. Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.

10) Click **Save** to persist your changes.

## **Identity Router Clustering - Edit Profile**

Follow these steps to configure Identity Router NFS clustering.

1) Click the **Customers** link at the top of the page.

![Edit Profile page with the IDR Clustering tab](/img/operations-guide/_page_78_Picture_0.jpeg)

- 2) Click the **New Customer** icon. The *New Customer* dialog displays.
- 3) Select the **IDR Clustering** tab.

![Clustering Configuration settings in the Edit Profile dialog](/img/operations-guide/_page_78_Picture_2.jpeg)

![Clustering Configuration dialog with the Clustering Enabled checkbox](/img/operations-guide/_page_78_Picture_2.jpeg)

4) Select the **Clustering Enabled** checkbox to enable Identity Router Clustering and then select the type of clustering to perform:

• **Identity Router NFS Clustering** on page 73 •**Identity Router CIFS Clustering** on page 69

**Technical Note:** The following 3 load-balancer products are supported with SinglePoint® Studio:

\* CISCO ACE family \* F5 Big-IP family \* Citrix Netscaler

All of these products support" session persistence" or sticky sessions.

We recommend that you use "HTTP Cookie Persistence with Cookie Insert method" to support session stickiness

## **ID Router CIFS Clustering - Edit Profile**

These instructions are divided into 2 sections: *Set the LMCompatibilityLevel in Windows Server 2008* and

*Configure ID Router CIFS Clustering*.

## **Set the LMCompatibilityLevel in Windows Server 2008**

**Warning**: The LMCompatibilityLevel must be set in the UI of Windows Server 2008. Setting the LMCompatibilityLevel in the Registry will not persist the changes.

- 1) At the Widows Server 2008 desktop, run **gpmc.msc** and press **Enter**.

![Group Policy Management console](/img/operations-guide/_page_79_Picture_4.jpeg)

The *Group Policy Management Editor* dialog displays.

![Group Policy Management console with domain controller policy](/img/operations-guide/_page_79_Picture_6.jpeg)

![Screenshot of the Group Policy Management window showing the 'Default Domain Controllers Policy' section. The section includes a list of domains and a section for 'Security Fitness' with a 'Name' field and a 'Restricted' field.](/img/operations-guide/_page_79_Picture_6.jpeg)

- 2) Select the domain of interest, e.g. cust1.env2, and navigate to **Default Domain Controllers Policy**. `<DOMAIN>->Domain Controllers->Default Domain Controllers Policy`
- 3) Right click on **Default Domain Controllers Policy** and select **Edit**.

The *Group Policy Management Editor* dialog displays.

![Group Policy Management Editor navigation tree](/img/operations-guide/_page_80_Picture_2.jpeg)

- 4) On the *Group Policy Management Editor* dialog, select **Computer Configuration->Policies->Windows Settings->Security Settings->Local Policies->Security Options**.
- 5) In the Policy section, right click **Network security: LAN Manager authentication level** and select **Edit**. The Network: LAN Manager authentication level Properties dialog displays.

![LAN Manager authentication policy settings](/img/operations-guide/_page_80_Picture_4.jpeg)

- 6) In the **Define this policy setting** drop-down, select appropriate policy, click Apply, then click **OK**. **Note**: All policies except **Send NTLM2 response only. Refuse LM & NTLM** will function with SinglePoint® Studio.
- 7) Exit the *Group Policy Management Editor* dialog and then exit the *Group Policy Management* dialog.
- 8) Run **gpupdate /force** from the desktop.

![Command prompt after running gpupdate](/img/operations-guide/_page_81_Picture_1.jpeg)

When the process is finished running, the changes have taken place.

## **Configure ID Router CIFS Clustering**

1) Select **CIFS** from the **Clustering Share Type** drop-down list.

![CIFS clustering settings in Studio](/img/operations-guide/_page_82_Picture_2.jpeg)

- 2) Complete the following fields: • **Clustering Enabled** - Select this checkbox to enable ID Router clustering. This field can only be edited by super administrators
  - **Clustering Share Type** Select **CIFS** from the drop-down list • **Load balancer dns name** - Enter the dns name of the load balancer for ID Router clustering • **IP Address** - Enter the IP Address of the IP Address of CIFS server • **CIFS Share Name** - Enter the share name of the CIFS server • **CIFS Username** - Enter the CIFS username • **CIFS Password** - Enter the CIFS password •**Use Guest** - If guest accounts are allowed, check the **Use Guest** checkbox
- 3) Click **Test** to ensure that the information is correct and that a connection can be established between SinglePoint® Studio and the ID Router.
- 4) Click **Save** to keep the configuration. CIFS clustering has been configured.

## **ID Router NFS Clustering - Edit Profile**

To configure an ID Router for NFS clustering, follow the directions below.

1) Select **NFS** from the **Clustering Share Type** drop-down list.

![NFS clustering settings in Studio](/img/operations-guide/_page_83_Picture_1.jpeg)

- 2) Complete the following fields: • **Clustering Enabled -** This checkbox can only be edited by a super administrator • **Clustering Type** - Select **NFS** from the drop-down list • **Load balancer dns name** - Enter the dns name of the load balancer for the ID Router cluster • **IP Address** - Enter the IP Address for the NFS server •**Path** - Enter the path to the NFS server
- 3) Click **Test** to ensure a connection can be made between SinglePoint® Studio and the ID Router.
- 4) Click **Save** to keep the configuration. NFS clustering has been configured.

## **User Management**

This User Management tab enables the customer to enable and configure User Management.

User Management is a separate feature and must be enabled by the system administrator. If the User Management tab does not appear on the Edit Profile dialog, contact your system administrator.

**Note**: You must set the context of Studio to a customer before attempting these instructions.

- 1) Click the Edit Profile link in the upper right-hand corner of any Studio page.

The *Edit Profile* dialog displays.

- 2) Select the **User Management** tab.
- 3) The *User Management* dialog displays.

![User Management Database Configuration settings](/img/operations-guide/_page_84_Picture_2.jpeg)

![Screenshot of the User Management Database Configuration from the Edit Profile section of the User Management Database Configuration program.](/img/operations-guide/_page_84_Picture_2.jpeg)The screenshot shows the 'User Management Database Configuration' section of the User Management Database Configuration program. The top navigation bar is labeled 'Edit Profile'. Below it, the 'User Management Database Configuration' section is visible, with a 'User Management Enabled' icon checked. The configuration is as follows:

- **Type:** NySQL (selected)
- **Routing Interface:** Public (selected)
- **Server:** 10.200.1.14:20 (selected)
- **Port:** 2306
- **Information Name:** Miniations (selected)
- **Username:** symplified (selected)
- **Password:** secrets (selected)

A green 'Test' icon is positioned below the configuration tabs.

At the bottom of the screen, there are two control buttons: 'Save' (shown as a scroll icon) and 'Cancel' (shown as a closed icon).

- 4) Complete the following fields: • **User Management Enabled** - Select this checkbox to activate User Management • **Type** - Select the database User Management wil use to store users • **Routing Interface** - Select the routing interface used on the Identity Router from the dropdown list • **Server** - Enter the IP of the server on which User Manager is installed • **Port** - enter the port use to connectd to User Manager
  - **Instance** Name enter the instance for User Manager
  - **Username**  Enter the username for the database User Manager is accessing • **Password** - Enter the password for the database User Manger is accessing •**Test** - Click this button to test the configuration
- 5) Click **Save** to persist the changes.

## **Backup**

The Backup function enables you to configure automated backups of your users' keychain data. In addition to keychain data, the backup procedure for Secure FTP and Amazon S3 also backs up audit log files.

Select and configure the desired location for the keychain backup files.

- **SFTP Backup** on page 76 Use a secure FTP site to backup the keychain files
- **Amazon EC2 Backup** on page 77 Use the Amazon Electronic Compute Cloud
- **Local Disk Backup** on page 78 Use a local disk to backup the keychain files

## **SFTP Backup**

The Backup function for SFTP provides automated backups of keychain data and audit log files.

1) Select **Secure FTP** from the **Type** drop-down list.

![Screenshot of the Edit Profile section of the Console showing a backup schedule for a house and a backup status section with text boxes for types and task configurations.](/img/operations-guide/_page_85_Picture_7.jpeg)The screenshot displays the **Edit Profile** section of the Console. A blue backup schedule is shown on the left with a small illustration of a house. The top bar contains the following tabs: **My Profile**, **My Company**, **Portal**, **Wireless Apps**, **EDI Clusters**, **User Manager**, **Backup**, **Restore**, **Audit Logging**, and **Author Security**. The backup schedule is divided into two sections: **Backup Schedule** and **Backup Location**. The **Backup Schedule** section includes a tab for **Type** with a selected **Sector: PTP** and fields for **Username**, **Password**, **Hostname**, **Port**, **Relative Path**, **Badius History Length**, and **Routing Interface**. The **Backup Location** section includes a tab for **Task Configurations** and a **Backup Status** section with a small illustration of a house.

![SFTP backup schedule and backup location settings](/img/operations-guide/_page_85_Picture_7.jpeg)

2) Complete the following fields:

- • **Username** - Enter the username for the SFTP server • **Password** - Enter the password associated with the username for the SFTP server •**Hostname** - Enter the hostname or IP Address for the SFTP server
- **Port**  Enter the port number for the SFTP server •**Relative Path** - Enter the relative path for the directory where backups will be stored

**Note**: When setting up Windows secure FTP as the backup target, adding a sub directory to the relative path works with both of the following:

sftpbackup/subdir sftpbackup\\subdir The back slash config needs to be escaped with an extra back slash. Using a single backslash such as sftpbackup\subdir will not work.

- **Backup History Length** Enter the maximum number of backups to keep
- 3) Click **Save** to persist the configuration.

## **Amazon EC2 Backup**

The Backup function for Amazon EC2 provides automated backups of keychain data and audit log files.

**Note**: You must have the AmznS3BackupHandler handler enabled for your organization before attempting these instructions. See your system administrator or the Operations instructions for steps to enable the AmznS3BackupHandler.

1) Select **Amazon S3** from the **Type** drop-down list.

![Screenshot of the Amazon S3 schedule section with a blue house icon and a backup schedule section with a blue house icon.](/img/operations-guide/_page_86_Picture_8.jpeg)The screenshot shows the Amazon S3 schedule section. On the left, there is a blue house icon. The top bar is divided into four sections: 'My Profile', 'My Company', 'Portal', 'Windows Arch...', 'IDR Clusters...', 'User Manag...', 'Backup', 'Restore', 'Assist Logging', and 'AuthN Source...'. The 'Backup Schedule' section on the left includes a blue house icon and a 'Traffic' checkbox. The 'Backup Alt' section on the right shows a blue house icon and a 'AM' checkbox. The 'Backup Location' section on the left includes a 'Type' button with a 'Amazon S3' checkbox. The 'Access Code' section on the right is a blue box. The 'Secret Key' section on the right is a blue box. The 'Bucket' section on the right is a blue box. The 'Rackup History Length' section on the right is a blue box. A blue button with a small icon is located below the 'Rackup History Length' box. The 'Backup Status' section on the left includes a blue house icon and a 'TAM Configuration' checkbox. At the bottom of the screen, there is a button titled 'Store' and a button titled 'Cancel'.

![Amazon S3 backup configuration settings](/img/operations-guide/_page_86_Picture_8.jpeg)

- 2) Complete the following fields: • **Access Code** - Enter the access code supplied to you by Amazon
  - **Secret Key** Enter the secret key supplied to you by Amazon
  - **Bucket**  Enter the name of the bucket in which backups will be stored
- 3) Click **Save** to persist the configuration.

## **Local Disk Backup**

1) Select **Local** from the **Type** drop-down list.

![Screenshot of the Edit Profile interface showing a house icon and the 'Backup Schedule' section.](/img/operations-guide/_page_87_Picture_4.jpeg)The image shows the 'Edit Profile' interface for a house. The house icon is in the upper left corner. The 'Backup Schedule' section is visible, showing a 'Backup Now' button and a 'Backup At: 2:00' time tick button. The 'Type' icon is 'Local Disk'. The 'Backup History Length' icon is a square with a '3' in the center. The 'Test Configuration' icon is a green graphic. The 'Backup Status' section is at the bottom, showing a 'QAS RET' button and the text 'The requested operation was successful.'

![Local disk backup schedule and status](/img/operations-guide/_page_87_Picture_4.jpeg)

- 2) In the **Backup History Length** textfield, enter the maximum number of backups to keep.
- 3) Click **Save** to persist the configuration.

## **Restore**

The Restore function enables you to restore from a previous backup. This will restore all user keychains to the state in which they were configured when the backup was performed.

- 1) Click the **Edit Profile** link at the upper right of the *Studio* page. The *Edit Profile* dialog displays.
- 2) Select the **Restore** tab.

The *Backup Restore Points* dialog displays.

![Available keychain restore points](/img/operations-guide/_page_88_Picture_1.jpeg)

![Screenshot of the Edit Profile interface for a house. The interface is dark blue with a white background. At the top is a search button with a screenshot of a house. Below it is a section titled 'Edit Profile' with a button 'My Company' and a button 'Restore Points'. The 'My Company' button contains a screenshot of a house and the text 'Sat Aug 27 03:00:00 GNT-0600 2011'. The 'Restore Points' button contains a screenshot of a house and the text 'Fri Aug 26 02:00:00 GNT-0600 2011'. The 'User Manager' button contains a screenshot of a house and the text 'Thu Aug 25 03:00:00 GNT-0600 2011'. The 'Backup' button contains a screenshot of a house and the text 'Wed Aug 24 02:00:00 GNT-0600 2011'. The 'Restore' button contains a screenshot of a house and the text 'Mon Aug 22 03:00:00 GNT-0600 2011'. A 'Restore Status' button is located in the bottom center. A 'Cancel' button is at the bottom right.](/img/operations-guide/_page_88_Picture_1.jpeg)

- 3) Click the **Refresh** icon to get an up-to-date list of backup files, listed according to date.
- 4) Click the **Restore** button that corresponds to the backup file from which you want to restore the keychain.
- 5) Click **Yes** to start the restore process. When the restore process is complete, the *Restore Status* reads **Success.**
- 6) Click **Save** (if you have made other changes to the Profile) or **Cancel** to exit.

## **Audit Logging**

These instructions explain how to configure audit logging for your Identity Router. The audit logs can be stored to a file or stored on a customer's SysLog server.

### **Audit Logging Configuration**

- 1) Click the **Edit Profile** link in the upper right-hand corner of any Studio page. The *Edit Profile* dialog displays .
- 2) Select the **Audit Logging** tab.

#### The *Audit Logging* dialog displays.

![Audit Logging configuration settings](/img/operations-guide/_page_89_Picture_1.jpeg)

- 3) Configure Audit Logging by checking the boxes of the events to be logged: • **Audit Logging Enabled** - Check this box to enable the logging feature. Deselect this check box to hide the fields on the page • **User Events Enabled** - Check this box to log user events o **Authorization Request Events Enabled** - Check this box to log authorization request events (which are also user-related events, and therefore, affected by the above checkbox as well) • **System Event Enabled** - Check this box to log system-related events o **System Error Events Enabled** - Check this box to log system-errors events (which are also system-related events, and therefore affected by the above checkbox as well) • **Output Type** - Check this box to determine what method will be used to create logs o **File Only** - This option only stores log files to the symplified-audit.log on the Identity Router - This is the default option o **Syslog** - In addition to storing the symplified-audit.log file on the Identity Router, this option also stores log files to a Syslog server as configured in **Local Disk Backup** on page 78 on the Backup tab

#### **SysLog Configuration**

The SysLog fields only display when the SysLog option is selected from the **Output Type** drop-down.

**Note**: The SysLog server is completely independent from Studio. It must setup by the customer.

Before you begin, have the Systlog server information from which the logs will be drawn.

- 4) Complete the following fields:
  - **Server**  Enter the IP address of the server that the to which the Identity Router will log to
  - **Port**  Enter the port number of the SysLog Server to which the Identity Router will send messages
  - **Protocol**  Select the protocol from the drop-down list that the Identity Router must use to send the messages to the SysLog server • **Routing Interface** - Select the interface from the drop-down list from which that SysLog logs will be sent out • **Security Method** - This option determines if the Identity Router will add additional information to the log messages to try to prove that they are authentic and have not been tampered with moving between the Identity Router and the SysLog server

**Note**: The HMAC, SHA-1 and SHA-2 security method options require a password. The Password field for these security method options displays when any of the options are selected.

5) Click **Save** to persist the changes.

## **Authentication Sources**

The Authentication Sources feature enables the Administrator to determine which source will be contacted first to authenticate the user. For example, if an IWA resource is used as the initial authentication source and it fails, this feature enables the user to be passed to another source, in most cases a portal, to be authenticated.

- 1) Click the **Edit Profile** link at the upper right of the *Studio* page. The *Edit Profile* dialog displays.
- 2) Select the **AuthN Sources** tab.

The *AuthN Sources* dialog displays.

![Authentication Sources list and ordering controls](/img/operations-guide/_page_91_Picture_2.jpeg)

- 3) Click the **Add** icon. The **AuthN Sources** dialog displays.
- 4) Highlight an AuthN source and click the up or down arrow to position it in the desired order.
- 5) Repeat the previous step for other AuthN sources that need be repositioned.
- 6) Click **Save** to persist the changes.