---
title: Identity Routers Operations Guide
description: Manage and configure Identity Routers in Studio, including registering routers with serial numbers and Activation Keys, assigning customers, testing connectivity, monitoring CPU, memory, sessions, uptime, and file-system status, configuring firewall rules and static DNS entries, setting up appliance network and DNS information, changing router credentials, and uploading certificate bundles.
author: pcartee
topic: administration
date: 09/17/2024
uid: identity-routers
---

## Identity Routers

The *Identity Routers* page lists all the Identity Routers assigned to your organization in Studio and their status. If an Identity Router is online, its status icon is green. If it's offline, the icon is red.

System Administrators manage Identity Routers. Hover over the Identity Router and then select the expand icon to see its status.

![Identity Routers page with router status indicators and action icons](/img/operations-guide/_page_4_Picture_3.jpeg)

The table below describes each icon and its action.

| ICON                                                                        | DESCRIPTION                                                                         |
|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| ![Test icon](/img/operations-guide/test.png)           | Test the Identity Router's communication with Studio.                         |
| ![Reboot](/img/operations-guide/reboot.png)            | Reboot the Identity Router. This option is only available to super administrators. |
| ![Restart icon](/img/operations-guide/restart.png)        | Restart the SinglePoint Studio service.                                            |
| ![View icon](/img/operations-guide/view.png) | View the log files for the selected Identity Router.                                |
| ![View icon](/img/operations-guide/view.png)     | View the provisioning log files for the selected Identity Router.                   |
| ![Apply icon](/img/operations-guide/apply.png)    | Apply updates to the selected Identity Router.                                      |
| ![Delete icon](/img/operations-guide/delete.png)           | Delete the selected Identity Router.                                                |
|  ![Expand icon](/img/operations-guide/expand.png)          | Expand the flyover dialog for the Identity Router.                                |

## Configure an Identity Router in Studio

The Identity Router is a server appliance that simplifies installation and maintenance. It combines its hardware and software in one product and includes preinstalled applications. You can connect it to an existing network with little configuration. It requires little or no support.

In the Studio environment, the Identity Router polices incoming users. It sits in front of the network.

### Before You Begin

Review the list below to ensure you have all the information needed to complete the task.

- The customer to assign the Identity Router
- The serial number of the Identity Router being configured
- The model name
- The Activation Key for the Identity Router supplied by the Technical Operations Group

1. Sign in to Studio as a System Administrator.
1. Select the **Identity Routers** link.

1. Select the New Identity Router![New Identity Router dialog with router configuration fields](/img/operations-guide/_page_6_Picture_0.jpeg) icon.

    ![Symplified Cloud ID Router interface showing the 'Configuration' and 'Status' tabs, and a 'ID Router Information' section with fields for Serial Number, Model, Activation Key, Status, Timeout (secs), and Customer.](/img/operations-guide/create-idr.png)

1. Complete the following fields:

    - **Serial Number** - Enter the Identity Router's serial number
    - **Model** - Enter either "GT" or "GTX" depending on the model being used
    - **Activation Key** - Enter the key supplied by the Technical Operations Group
    - **Status**  Select a status for the Identity Router from the drop-down list
    - **Timeout (secs)** - Enter the amount of time (in seconds) a user can be connected to the Identity Router
    - **Customer** - Select a customer to assign to the Identity Router from the drop-down list
    - **Disable automatic software updates** - Select this option to turn off automatic updates for this customer

1. After the fields are completed, select **Save**.

1. On the *Identity Routers* page, hover over the new **Identity Router** icon and select the **Test** icon. The status icon turns green when the Identity Router connects to Studio.

## Identity Router Status

Select a button on the **Status** tab to view specific information about the Identity Router:

![Identity Router Status tab with system status charts](/img/operations-guide/_page_7_Figure_1.jpeg)

- **CPU** - CPU usage over the preceding ten minutes
- **File System** The amount of used and available file system space where the Identity Router saves Keychain data. In a High Availability environment, it displays the status of the cluster share that stores this data.
- **Java Memory** - The use of system memory by Java applications
- **Load** - The value of the UNIX `load` command, which estimates how much of an Identity Router's system resources are being consumed. It also includes averages over five and ten minutes.
- **Sessions** - The number of user sessions currently active on the Identity Router
- **System Memory** - The use of system memory by the Identity Router for the preceding ten minutes
- **Uptime** - The amount of time the Identity Router has been running

## Identity Router Firewall Setup

Follow these instructions to configure Studio to recognize your firewall.

1. Log in to Studio and select the Identity Routers link.
1. Select the **Firewall** tab. The *Firewall* dialog displays.

![Identity Router Firewall tab with firewall rule settings](/img/operations-guide/_page_8_Picture_1.jpeg)

1. Select **Add** and complete the following fields:

    - **Connection Method** - Select the connection method used by your organization. If your organization uses more than one connection method, select **All**.
    - **Protocol** - Select the protocol used with your intranet
    - **Port Range** Enter the port range used by your organization. This field is only available when **All** is selected from the **Connection Method** drop-down list
    - **Source Network** - Enter the IP range used by your organization

1. Select **Save**.

## Identity Router Static DNS Entries

Add static DNS entries in Studio. Studio writes the IP addresses and aliases to the Identity Router's `hosts` file so the router can recognize them.

1. Log in to Studio and select the **Identity Routers** link.
1. Select the **Static DNS Entries** tab. The *Static DNS Entries* dialog displays.

    ![Identity Router interface showing the Static DNS Entries tab, IP Address and Aliases fields, and Save and Cancel buttons.](/img/operations-guide/_page_9_Picture_1.jpeg)

1. Complete the following fields:

    - **IP Address** - Enter a static IP address
    - **Aliases** - Enter an alias for the static IP address

1. Repeat step 3 for each DNS entry you want to add.
1. Select **Save**.

## Identity Router Hardware Setup

These instructions explain how to configure your Identity Router.

1. Log in to your Identity Router's setup page.

    The *IDR Setup* page displays.

    ![Symplified IDR Setup interface with a blue background and a white sheet for IDR setup.](/img/operations-guide/idr-hardware.png)

### Management Information

1. Complete the following *Management Information* fields:

    - **Identity Router Key** - Enter the key for the Identity Router
    - **Management IP Address** - Enter the IP address of the Identity Router
    - **Management Netmask** - Enter the IP range that contains the Identity Router's management IP address
    - **Management Gateway IP Address** - Enter the gateway IP address for the Identity Router

### Proxy Information

1. Complete the following *Proxy Information* fields:

    - **Proxy IP Address** - Enter the proxy IP address for the Identity Router
    - **Proxy Netmask** - Enter the IP range in which the Identity Router resides
    - **Proxy Gateway IP Address** - Enter the gateway IP address for the Identity Router

### DNS Configuration

1. Complete the following DNS information:

    - **Domain** - Enter the domain to which the Identity Router belongs
    - **IP** - Enter the IP address or re-enter the gateway IP address for the Identity Router
    - **Default** - Select this box to make the IP address the Identity Router's default
    - **Add DNS Record** - Select **Add DNS Record** to add a DNS record

### Misc Configuration

1. Complete the following Configuration fields:

    - **Management Server IP Address** - Enter the IP Address to which `vpn.symplified.net` resolves
    - **Controller URL** - Enter the web address the controller uses to communicate with cloud services

:::note
For platinum customers, enter different values in the Management Server IP Address and Controller URL fields. The Technical Operations Group supplies these values.
:::

### Protected Application Configuration

1. **Studio Server Name** - Enter the name of the Identity Router.

1. Select **Update Configuration**.

## Change Password - Identity Router

Follow these instructions to change the username and password for the Identity Router.

1. Select the **Change Password** link in the upper-right-hand corner of the *IDR Setup* page. The *Change Password* page displays.

    ![Identity Router Change Password form.](/img/operations-guide/_page_13_Picture_2.jpeg)

    A small box labeled 'Change Password' is located at the bottom center of the form.

1. Complete the following fields:

    - **Old Password** - Enter the current password
    - **New Username** - Enter the username associated with the Identity Router
    - **New Password** - Enter the new password
    - **Confirm New Password** - Re-enter the new password

1. Select **Change Password**. A message appears at the top of the page affirming your changes.

## Upload Certificate

Follow these instructions to upload your certificate to the Identity Router.

1. Select the **Upload Certificate** link at the upper-right-hand corner of the page. The **Certificate Bundle Upload** page displays.

    ![Certificate Bundle Upload page](/img/operations-guide/_page_13_Picture_12.jpeg)

1. Select **Browse** and then navigate to the directory in which the certificate is stored.
1. Select the certificate and then select **Open**.

1. Select **Upload Certificate Bundle** to upload the certificate to the Identity Router.
