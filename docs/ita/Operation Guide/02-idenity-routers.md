---
title: Identity Routers Operations Guide
description: Manage and configure Identity Routers in Studio, including registering routers with serial numbers and activation keys, assigning customers, testing connectivity, monitoring CPU, memory, sessions, uptime, and file-system status, configuring firewall rules and static DNS entries, setting up appliance network and DNS information, changing router credentials, and uploading certificate bundles.
author: pcartee
topic: administration
date: 09/17/2024
uid: identity-routers
---

## Identity Routers

The *Identity Routers* page lists all the Identity Routers assigned to your organization in Studio. This page also shows the status of the Identity Routers. If an Identity Router is online, the highlight color of the icon is green. If the Identity Router is not online, the highlight color of the icon is red.

Identity Routers are managed by System Administrators. Mouse-over the Identity Router and then click the expand icon to see its status.

![Identity Routers page with router status indicators and action icons](/img/operations-guide/_page_4_Picture_3.jpeg)

The table below describes the icons and the activities they initiate.

| ICON                                                                        | DESCRIPTION                                                                         |
|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| ![Test icon](/img/operations-guide/test.png)           | Tests that the Identity Router can communicate with Studio.                         |
| ![Reboot](/img/operations-guide/reboot.png)            | Reboots the Identity Router. This option is only available to super administrators. |
| ![Restart icon](/img/operations-guide/restart.png)        | Restarts the SinglePoint Studio service.                                            |
| ![View icon](/img/operations-guide/view.png) | View the log files for the selected Identity Router.                                |
| ![View icon](/img/operations-guide/view.png)     | View the provisioning log files for the selected Identity Router.                   |
| ![Apply icon](/img/operations-guide/apply.png)    | Apply updates to the selected Identity Router.                                      |
| ![Delete icon](/img/operations-guide/delete.png)           | Delete the selected Identity Router.                                                |
|  ![Expand icon](/img/operations-guide/expand.png)          | Expands the fly-over dialog for the Identity Router.                                |

## Configure an Identity Router in Studio

The Identity Router is a specialized server designed for ease of installation and maintenance. Server appliances have their hardware and software bundled into the product, so all applications are preinstalled. The appliance can be plugged into an existing network and can begin working almost immediately, with little configuration. The Identity Router is designed to run with little or no support.

In the Studio environment, the Identity Router is the computer that sits in front of the network that polices incoming users.

### Before You Begin

Review the list below to ensure all the information needed to perform the task is at hand.

- A customer created in which to assign the Identity Router
- The serial number of the Identity Router being configured
- The model name
- Activation key for the Identity Router
- Get this key from the Technical Operations Group

1. Sign in to Studio as a System administrator.
1. Click the **Identity Routers** link.

1. Select the New Identity Router![New Identity Router dialog with router configuration fields](/img/operations-guide/_page_6_Picture_0.jpeg) icon.

    ![Symplified Cloud ID Router interface showing the 'Configuration' and 'Status' tabs, and a 'ID Router Information' section with fields for Serial Number, Model, Activation Key, Status, Timeout (secs), and Customer.](/img/operations-guide/create-idr.png)

1. Complete the following fields:

    - **Serial Number**  In this case enter the customer's name •**Model** - Enter either "GT" or "GTX" depending on the model being used
    - **Activation key** The key you got from the Technical Operations group
    - **Status**  Select a status for the Identity Router from the drop-down list • **Timeout (secs)** - Enter the amount of time (in seconds) a user can be connected to the Identity Router •**Customer** - Select a customer for the Identity Router from the drop-down list
    - **Disable automatic software updates** select whether the automatic updates are appropriate for the customer's situation

1. After the fields are completed, click **Save**. The information is saved and the *New Identity Router* dialog closes.

1. On the *Identity Routers* page, mouse-over the new **Identity Router** icon and then click the **Test** icon to ensure the Identity Router is connected. The Identity Router's highlight color will turn green when a connection is established.

## Identity Router Status

The **Status** tab has seven buttons, each of which displays specific information about the Identity Router when selected. The functions of the buttons are listed below.

![Identity Router Status tab with system status charts](/img/operations-guide/_page_7_Figure_1.jpeg)

- **CPU**  This graph displays the CPU usage of the Identity Router for the preceding ten minutes
- **File System** This graph displays the used and available file system space at the location where the Identity Router stores Keychain data. In a High Availability environment this graph displays the status of the cluster share where Keychain data is stored 
- **Java Memory** - This graph displays the use of system memory by Java applications 
- **Load** - This graph displays the value of the UNIX "load" command, which provides an estimate of how much of an Identity Router's system resources are being consumed. It also includes five- and ten-minute averages of resource consumption 
- **Sessions** - This graph shows the number of user sessions currently active on the Identity Router 
- **System Memory** - This graph displays the use of system memory by the Identity Router for the preceding ten minutes 
- **Uptime** - Displays how long the Identity Router has been up and running

## Identity Router Firewall Setup

Follow these instructions to configure Studio to recognize your firewall.

1. Log in to Studio and click the Identity Routers link.
1. Select the **Firewall** tab.The *Firewall* dialog displays.

![Identity Router Firewall tab with firewall rule settings](/img/operations-guide/_page_8_Picture_1.jpeg)

1. Click the **Add** and complete the following fields:

    - **Connection Method** Select the connection method used by your organization. If your organization uses several different connection methods, select **All**  •**Protocol** - Select the protocol used with your intranet
    - **Port Range** Enter the port range used by your organization. This field is only available when **All** is selected from the **Connection Method** drop-down list •**Source Network** - Enter the IP range used by your organization

1. Click **Save** to persist the changes.

## Identity Router Static DNS Entries

Follow these instructions to enter static DNS addresses into Studio. These static DNS entries are used to edit the /etc/host file. The IP Addresses and Aliases are written to the etc/host file so that they will be recognized by the Identity Router.

1. Log in to Studio and click the **Identity Routers** link.
1. Select the **Static DNS Entries** tab. The *Static DNS Entries* dialog displays.

    ![Screenshot of the Create Identity Router interface showing the 'Configuration' and 'Status' tabs, and a 'Static DNS Entries' tab with a 'IP Address' and 'Aliases' fields. A 'Save' and 'Cancel' buttons are at the bottom.](/img/operations-guide/_page_9_Picture_1.jpeg)

1. Complete the following fields:

    - **IP Address** - Enter a static IP address
    - **Aliases**  Enter the alias for the static IP Address

1. Repeat step 3 to add additional DNS entries.
    . Click **Save** to persist the changes.

## Identity Router Hardware Setup

These instructions explain how to configure your Identity Router.

1. Log in to your Identity Router's setup page.

    The *IDR Setup* page displays. There are five sections in these instructions each corresponding to a section on the *IDR Setup* page.

    ![Symplified IDR Setup interface with a blue background and a white sheet for IDR setup.](/img/operations-guide/idr-hardware.png)

### Management Information

1. Complete the following *Management Information* fields:

    - **Identity Router Key** - Enter the key for the Identity Router
    - **Management IP Address** Enter the IP address of the Identity Router
    - **Management Netmask** - Enter the IP range that contains the Identity Router's Management IP address
    - **Management Gateway IP Address** - Enter the Gateway IP Address for the Identity Router

### Proxy Information

1. Complete the following *Proxy Information* fields:

    - **Proxy IP Address** - Enter the proxy IP address for the Identity Router 
    - **Proxy Netmask** - Enter the IP range in which the Identity Router resides 
    - **Proxy Gateway IP Address** - Enter the gateway IP address for the Identity Router

### DNS Configuration

1. Complete the following DNS information:

    - **Domain** - Enter the Domain to which the Identity Router belongs
    - **IP** - Enter the IP address or re-enter the Gateway IP Address for the Identity Router
    - **Default** - Check this box if the IP address entered is to be the default IP address for the Identity Router 
    - **Add DNS Record** - Optionally click **Add DNS Record** to add additional DNS records

### Misc Configuration

1. Complete the following Configuration fields:

    - **Management Servicer IP Address** - Enter the IP address to which vpn.symplified.net resolves
    - **Controller URL** - Enter the URL the controller uses to communicate to the cloud

:::note
These fields will need different values when Studio is implemented by a platinum customer.
:::

### Protected Application Configuration

1. **Studio Server Name** - Enter the name of the Identity Router.

1. Click **Update Configuration** to persist the changes.

## Change Password - Identity Router

Follow these instructions to change the username and password for the Identity Router.

1. Click the **Change Password** link in the upper-right-hand corner of the *IDR Setup* page. The *Change Password* page displays.

    ![A screenshot of a window titled 'Change Password' showing a form for credential details.](/img/operations-guide/_page_13_Picture_2.jpeg)The image shows a screenshot of a window titled 'Change Password'. The form is divided into three sections:

    - **Credential Details:** A line of text at the top of the form.
    - **One Password:** A rectangular box for the first password.
    - **New Username:** A rectangular box for the new user name.
    - **New Password:** A rectangular box for the new password.
    - **Confirm New Password:** A rectangular box for the confirmed new password.

    A small box labeled 'Change Password' is located at the bottom center of the form.

    ![Identity Router Change Password form](/img/operations-guide/_page_13_Picture_2.jpeg)

1. Complete the following fields:

    - **Old Password** - Enter the password to be changed 
    - **New Username** - Enter the username associated with the Identity Router
    - **New Password** - Enter the new password
    - **Confirm New Password** - Re-enter the new password

1. Click **Change Password** to persist the changes. A message appears at the top of the page affirming your changes.

## Upload Certificate

Follow these instructions to upload your certificate to the Identity Router.

1. Click the **Upload Certificate** link at the upper-right hand top of the page. The **Certificate Bundle Upload** page displays.

    ![Certificate Bundle Upload page](/img/operations-guide/_page_13_Picture_12.jpeg)

1. Click **Browse** and then navigate to the directory in which the certificate is stored.
1. Select the certificate and then click **Open**.

1. Click **Upload Certificate Bundle** to upload the certificate to the Identity Router.
