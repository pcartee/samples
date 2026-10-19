---
title: "Disaster Recovery: Installation and Configuration"
description: "Install and configure LogRhythm Disaster Recovery across Primary and Secondary sites, including prerequisites, database replication, failover, testing, and high-availability setup."
author: pcartee
topic: Reference
date: 2017-01-22
uid: cybersec.disaster.recovery.installation
---

This guide describes how to install and configure the LogRhythm Disaster
Recovery (DR) solution, which protects businesses from potential site
failures due to catastrophic events (power outage, fire, flood, etc.).
If a failure occurs, the DR solution helps businesses recover key
LogRhythm SIEM databases and continue collecting logs.

## Intended audience

This guide is for LogRhythm Professional Services staff who install and
configure the DR solution for customers. LogRhythm customers can also
use it to learn about the solution.

## Overview of steps

1. **Understand the Disaster Recovery solution architecture**. If you
    are configuring the DR solution for the first time, read this
    section to become familiar with the DR architecture.

1. **Meet system requirements and prepare the SIEM environment**.
    Before installing the DR solution, make sure the environment meets
    all the prerequisites:

    - All LogRhythm components are using the same SIEM version.

    - The SQL Server service runs under the same account at the Primary
      and Secondary sites.

    - The SQL Server Agent service runs under the same account at the Primary
      and Secondary sites.

    - A network interface (NIC port) is dedicated for data replication
      between the Primary and Secondary sites (recommended so that
      normal Platform Manager traffic is separate from replicated
      traffic).

    - The ports used for replication between the two sites are open (not
      locked down by a firewall). The DR setup will automatically open
      ports secured by Windows Firewall, but not by other types of
      firewalls.

    - A common DNS record that can point to either the IP address of the
      Primary Platform Manager or the IP address of the Secondary
      Platform Manager.

    - The Data Indexer and AI Engines are configured so they point to
      the Platform Manager using DNS names, rather than IP addresses.

    - The DNS zone spans the Primary and Secondary sites.

    - A TTL (Time to Live) is configured in DNS records.

:::important
Use only static IPs for the replication interface. Do not use DHCP.
:::

1. **Install and configure the Disaster Recovery software**. During installation, you will perform the following steps:

    - Configure the Primary system.

    - Transfer the LogRhythm database backup files to the Secondary
      system.

    - Configure the Secondary system.

    - Complete the setup on the Primary system.

1. **Register the LogRhythm databases** (optional). By registering the databases, you can view detailed status information in the SQL Database Mirroring Monitor.

1. **Test the DR solution** (recommended). Test the DR solution to make sure the configuration was successful.

1. **Upgrade** **the** **DR Test Systems.** Perform DR Upgrade Testing.

    - Stop LogRhythm services on both nodes, paying close attention to which services should be running on each node (for example, scarm and lrjobmgr will not be running on the passive node, but all other services will).

    - Run Upgrade Assistant on the active node.

    - Manually run the Build_CMDB and BuildEMDB scripts on the passive node.

    - Run LRI on both nodes.

    - Start the appropriate services (as noted above) on each node.

## Definition of terms

The following table describes terms used in this guide.

| Term | Definition |
| --- | --- |
| Disaster recovery sites | The solution uses two sites. **Primary** is the main site that collects and processes log data. **Secondary** is the mirrored site that can be available if the Primary site fails. |
| System status | **Active** describes the site currently collecting and processing log data. The Primary site is usually active unless failover has occurred. **Standby** describes a system available to collect and process log data. |
| Site types | **Cold:** available, but possibly powered off or unconfigured. **Warm:** configured, but unable to become active until it receives the Primary site's backup files. **Hot:** mirrored and able to become active within minutes. The Secondary site in the LogRhythm DR solution is a hot site. |
| Recovery objectives | **Recovery Point Objective (RPO):** the maximum tolerable period of data loss from the Primary site after a disruption. **Recovery Time Objective (RTO):** the maximum period a site can be unavailable before restoration is required to avoid unacceptable business consequences. Each organization must determine its acceptable RPO and RTO based on the impact to its applications and systems. |
| Transmission methods | **Asynchronous (default and recommended):** the Primary site acknowledges the data transfer before sending it to the Secondary site. This supports performance during peak periods and allows synchronization to catch up during slower periods. **Synchronous:** the Secondary site commits the data before the Primary acknowledges the transfer. Primary performance is limited by the link between the sites. |
| Failover situations | **Unplanned failover:** occurs because of a disaster or unforeseen event. **Planned failover:** occurs when administrators schedule the switch to another site. |

## Overview of the LogRhythm DR solution

LogRhythm's Disaster Recovery (DR) solution includes SIEM software running in two LogRhythm deployments: one on a Primary site and the other on a Secondary site. The Primary site includes the active Platform Manager, which sends replicated data to the Secondary Platform Manager. The Secondary site essentially becomes a "hot standby" in a planned outage, natural disaster, or attack.

### Appliance configurations

The Primary site can include one Platform Manager, Data Indexers, optional AI Engines (on-site or remote), and multiple remote Agents that actively monitor systems and collect logs. To create a standby solution, you can configure the Secondary site in several ways. At a minimum, you will use the DR solution to replicate the Platform Manager database (EMDB), which contains key LogRhythm data and configuration information. Then depending on business needs, you can also replicate the Events,
Alarms, LogMart, and CMDB databases.

:::note
LogRhythm Archives are not included in the DR solution's replication, since Archive files are part of the individual Data Indexers, not the Platform Manager. To protect LogRhythm Archives, administrators must manually back up the files from the Data Indexers to another system or configure them for replication in a Storage Area Network (SAN).

The following example shows a scenario where only the Platform Manager
database (EMDB) is replicated on the Secondary site.

#### Example 1: EMDB replication only

![Primary and Secondary sites](../../static/img/cybersec/replication.png)

:::note
In a failover scenario, Agents installed on Data Indexers may not be accessible, and therefore should not be used as primary collection points.

The next example shows a scenario where the DR solution replicates all
LogRhythm databases on the Secondary site. This Secondary site also
includes a standby Data Indexer and AI Engine, in case the key SIEM
components on the Primary site are unavailable for a long period of
time. In addition, the Archives are manually backed up to another system
or replicated in a SAN. Archives are available to Data Indexers in the
Primary site and the Secondary site.

#### Example 2: Full protection with minimal disruption

![Screenshot](../../static/img/cybersec/replication-2.png)

### DNS infrastructure

All components within the Primary and Secondary sites must include a
common DNS infrastructure. When configuring the DNS infrastructure,
follow these guidelines:

- **Platform Managers**: A common DNS record can point to either the IP
  address of the Primary Platform Manager or the IP address of the
  Secondary Platform Manager.

- **Data Indexers and AI Engines**: The Data Indexers and AI Engines
  point to the Platform Manager using a DNS name rather than an IP
  address. Remote Data Indexers and AI Engines should also support DNS
  for connecting to either a Primary or Secondary site.

- **Agents**: The Agents can use DNS to identify new mediator host
  connections. The Agent resolves the DNS name to IP upon every new
  connection attempt. (Agents can also be redirected to new Data
  Indexers using the Deployment Manager in the SIEM Console.)

### Overview of the failover process

The failover process depends on whether the Primary site was purposely
shut down (Planned Failover) or the Primary site went down unexpectedly
(Unplanned Failover). In either case, you must manually perform a
failover, as outlined below:

1. Manually initiate the failover, using the appropriate process:

    - **Planned Failover**. Go to the *Primary* (active) site and use
      the DR solution to initiate the failover to the standby site.

    - **Unplanned Failover**. Go to the *Secondary* (standby) site and
      use the DR solution to initiate the failover to the standby site.

1. Update the common DNS record so the Primary site components point to
    the IP address of the Secondary Platform Manager. Once the Time to
    Live (TTL) limit is reached, all systems within the Primary site
    reconnect to the newly activated Platform Manager.

1. If a Data Indexer is unavailable on the Primary site, reconnect
    Agents to a new Data Indexer by changing the DNS records or using
    the Deployment Manager in the SIEM Console.

    For detailed instructions, see the *LogRhythm Disaster Recovery Administration Guide*.

    ![Screenshot](../../static/img/cybersec/replication-4.png)

## Preparation

Before you install the DR solution, make sure the environment meets the
prerequisites in the following table.

| Requirement | Details |
| --- | --- |
| LogRhythm SIEM | Deploy the same LogRhythm software version at the Primary and Secondary sites. |
| SQL Server and SQL Server Agent | Run the SQL Server and SQL Server Agent services under the same account at both sites. Use a domain account or identical local user accounts. |
| Network | A dedicated replication network is recommended to isolate replication traffic. Configure replication IP addresses on dedicated interfaces; they do not need to be on the same subnet. The network must support 10 Mbs/second bandwidth and a maximum latency of 150 milliseconds. |
| Ports and firewall | Keep the replication ports open between the sites. The DR setup opens ports secured by Windows Firewall, but it does not configure other firewalls. |
| DNS | Configure a common DNS record that can point to either Platform Manager. Configure Data Indexers and AI Engines to use a DNS name for the Platform Manager. DNS zones must span both sites. Configure DNS address records with a two-minute time to live (TTL) for faster failover. A shared name for Data Indexers and AI Engines is optional. |
| Platform Manager disk space | During setup, back up the Primary Platform Manager databases and copy them to the Secondary system. The installer checks database sizes and estimates the required disk space. You can use a network drive if the SQL Agent service account has write access to the share. **Note:** The backup can take several hours, depending on the data volume and backup media write speed. |
| Existing High Availability deployment | If you are adding DR to an existing LogRhythm High Availability deployment, complete the additional preparation steps in Appendix A and installation and configuration steps in Appendix B. |

## Installation and configuration

Follow the steps in this section to install and configure the Disaster
Recovery solution on Primary and Secondary sites.

:::note
During DR configuration, the setup routine stops the Platform Manager services. You do not need to stop any services yourself.

### Configure the Primary Platform Manager

To configure the Primary site:

:::important
Use only static IPs for the replication interface. Do not use DHCP.

1. Download the DR zip file from the LogRhythm Support Portal and
    extract it on the Primary Platform Manager.

1. Browse to the newly extracted **DR** directory.

1. Right-click **DR_Setup** and select **Run as administrator**. Enter
    your local system administrator credentials.

1. In the first DR Setup dialog, enter credentials for a SQL System
    Admin or enable the Windows Authentication check box. Select
    **Next**.

    :::note
    The user you enter here must have the `sysadmin` role in SQL Server. To verify permissions, connect to SQL Server Management Studio (SSMS). In Object Explorer, expand **Security > Logins**, select the user (or create one), and open **Properties**. Select **Server Roles** and verify that **sysadmin** is selected.
    
    ![Screenshot](../../static/img/cybersec/replication-5.png)

1. Select **Primary** and select **Next**.

    ![Screenshot](../../static/img/cybersec/replication-6.png)

1. Under **Primary**, select the IP address for the Primary site (use the drop-down arrow to select from discovered IPs). 

1. Under **Secondary**, enter the IP address of the Secondary site. If desired, you can also select a different port number as long as that port is not used by other systems. The port used for the Primary site and the port used for the Secondary site can be different. 

1. Select **Next**.

    ![Screenshot](../../static/img/cybersec/replication-7.png)

1. Select the databases to replicate on the Secondary site, then select
    **Next**. By default, you must select the **EMDB** (Platform Manager
    database). The Events and Alarms databases must be selected
    together.

    :::important
    The DR solution does not replicate the LogRhythm Archives.
    :::
    
    ![Screenshot](../../static/img/cybersec/replication-8.png)

1. Select a folder for temporarily storing the database backup, and then select **Next**.

    After you select the folder, the DR Setup shows the Free Space available. If the system does not have enough free space for the backup, an error message appears at the bottom of the dialog. If necessary, you can select a network drive or external drive. (If you want to change your database selections, select **Back** to return to the previous screen.)

    ![Screenshot](../../static/img/cybersec/replication-9.png)

1. Select the desired minutes for your Recovery Point Objective (RPO). The RPO is the maximum tolerable period in which data from the Primary system can be lost due to system disruption. If the data replication falls behind this time limit, the LogRhythm SIEM generates an alert. The default is 60 minutes.

    ![Screenshot](../../static/img/cybersec/replication-10.png)

1. Select **Install** to back up the Platform Manager databases and install the DR solution on the Primary system.

    The DR setup launches a script that shows its progress. Depending on the size of the databases, this process could take several hours. When it's done, the following prompt appears:

    `Press Enter when the setup is complete on the secondary system`

1. Keep this progress window open. You will return to it later, after completing the setup on the secondary Platform Manager.

    ![Screenshot](../../static/img/cybersec/replication-11.png)

### Transfer database files to the Secondary site

When the setup completes on the Primary system, copy the database backup files to the Secondary system.

1. Open the folder where the backup files are stored on the Primary system.

1. Select and copy all the database files and the **logins** file, similar to the following example.

    ![Screenshot](../../static/img/cybersec/replication-12.png)

1. Access the Secondary Platform Manager server. Paste the files into a folder.     You will load the files from this folder when you configure the Secondary Platform Manager.

### Configure the Secondary Platform Manager

To configure the Secondary site:

1. Extract the DR zip file on the Secondary Platform Manager.

1. Browse to the newly extracted DR folder.

1. Right-click **DR_Setup** and select **Run as administrator**. Enter your local system administrator credentials.

1. In the first DR Setup dialog, enter credentials for a SQL System Admin or enable the Windows Authentication check box. Select **Next**.

    :::note
    The user you enter here must have the `sysadmin` role in SQL Server. To verify permissions, connect to SQL Server Management Studio (SSMS). In Object Explorer, expand **Security > Logins**, select the user (or create one), and open **Properties**. Select **Server Roles** and verify that **sysadmin** is selected.
    :::

1. Select **Secondary** and select **Next**.

    :::note
    If you leave this setting at **Primary**, the DR setup will fail. Rerun DR Setup on the Secondary system and choose **Secondary**.
    :::

    ![Screenshot](../../static/img/cybersec/replication-13.png)

1. Under **Primary**, enter the IP address of the Primary site. Make sure the Primary Port number is the same one you selected during the Primary site configuration. Under **Secondary**, select the IP address for the Secondary site (use the drop-down arrow to select from discovered IPs). Make sure the Secondary Port number is the same one you selected during the Primary site configuration. Select **Next**.

    ![Screenshot](../../static/img/cybersec/replication-14.png)

1. Select the folder where you copied the Platform Manager databases.
    Select **Next**.

    ![Screenshot](../../static/img/cybersec/replication-15.png)

1. Select the desired minutes for the Recovery Point Objective (RPO) on the Secondary Platform Manager. The default is 60 minutes. (This value does not need to be the same RPO selected for the Primary Platform Manager.)

1. Select **Install**.

    ![Screenshot](../../static/img/cybersec/replication-16.png)

1. When you see the "Step complete" message, press **Enter** to exit.

    ![Screenshot](../../static/img/cybersec/replication-17.png)

    You are now done with setup on the Secondary site.

    :::Note
    Do not start the Platform Manager's Job Manager and ARM services on the Secondary site. Leave both services set to **Manual** unless you need to fail over to the Secondary site. For details, see the *LogRhythm Disaster Recovery Administration Guide*.
    :::

### Complete setup on the Primary Platform Manager

After completing the setup on the Secondary site, follow these steps:

1. On the Primary Platform Manager, return to the DR Setup progress window.

1. Press **Enter** to complete the setup on the Primary system.

    :::Note
    If setup fails, check the log files in the **Logs** subdirectory.
    :::

    ![Screenshot](../../static/img/cybersec/replication-18.png)

    When the "DR Setup Complete" message appears, you are finished with the DR configuration.

    ![Screenshot](../../static/img/cybersec/replication-19.png)

1. If desired, remove the backup files you created on both the Primary and Secondary Platform Managers. The files are no longer needed.

1. Restart all LogRhythm services running on AI Engines, Data Indexers, and the Platform Manager on the **Primary** site (not the Secondary site). These services include:

    - Platform Manager: Job Manager service and ARM service

    - Data Indexers: Mediator service

    - AI Engine (if integrated): AI Engine service and AI Engine Communication Manager service

### Register LogRhythm databases for SQL

To use the SQL Database Mirroring Monitoring tool for viewing data replication status, you must register the LogRhythm databases first.

1. From the Primary Platform Manager server, navigate to **Start \> All Programs \> LogRhythm \> Disaster Recovery**

1. Double-click **DR_Status** to open the Database Mirroring Monitor.

1. Select **Action \> Register Mirrored Database**.

    ![Screenshot](../../static/img/cybersec/replication-20.png)

1. In the Register Mirrored Database dialog, select **Connect**.

    ![Screenshot](../../static/img/cybersec/replication-21.png)

1. Enter credentials for the SQL Server administrator, and then select     **Connect**.

1. In the Register Mirrored Database dialog, select the check boxes for all the databases. Also enable the **Show the Manage Server Connections** check box and select **OK**.

    ![Screenshot](../../static/img/cybersec/replication-22.png)

1. Select **OK** again at the next prompt regarding Server Instance Connections.

1. In the Database Mirroring Monitor panel, select the plus sign to expand the list of mirrored databases.

    ![Screenshot](../../static/img/cybersec/replicatio-23.png)

    The LogRhythm databases now appear in the Database Mirroring Monitor.

    ![Screenshot](../../static/img/cybersec/replication-24.png)

1. Go to the Secondary Platform Manager and follow the previous steps
    to register the mirrored databases.

1. After you register the Primary and Secondary databases, you can view the status of a LogRhythm database by selecting it in the left panel. For more information about the Database Mirroring Monitor, see the *LogRhythm Disaster Recovery Administration Guide*.

    ![Screenshot](../../static/img/cybersec/replication-25.png)

1. Install the DX on both the Primary and Secondary machines.

1. Use the DNS name for the AllConf EMDB location on the DR side.

1. Point the DP on the DR side to the logrhythm cluster.

    :::note
    You can also see replication status by running LogRhythm's **DR Control** from **Start \> All Programs \> LogRhythm \> Disaster > Recovery,** right-click **DR Control**, and select **Run as administrator**. For more information about this program, see the *LogRhythm Disaster Recovery Administration Guide*.
    :::

    ![Screenshot](../../static/img/cybersec/replication-26.png)

## Disaster Recovery test

Test the DR solution by running a failover scenario and a failback scenario. See the *LogRhythm Disaster Recovery Administration Guide* for more information about how to run a failover and failback.

## Appendix A: Preparation on an HA system

All of the Preparation steps above should be performed on both nodes of
the HA system. Each of the HA nodes will need a dedicated replication
interface on the same subnet.

A new LifeKeeper resource will need to be created for the shared IP
address of the replication interface.

1. Open the LifeKeeper GUI as an administrator.

1. Right-click on the active node and select Create Resource Hierarchy.

![Screenshot](../../static/img/cybersec/replication-27.png)

1. Step through the wizard

    a.  Select Next on the first screen.

    b.  Select IP Address for the Application to protect.

    c.  Enter a valid IP address on the same subnet as the replication
        interfaces.

    d.  Select the correct Subnet Mask.

    e.  Provide a Resource Tag name (e.g. 172.16.21.5_ResTag).

    f.  Choose the replication interface

    g.  Do not enable local recovery

    h.  The resource will be created and then automatically start the Extend Wizard to extend the hierarchy to the standby node.

    i.  Select the correct Subnet Mask.

    j.  Choose the replication interface.

    k.  Accept defaults for the rest of the screens.

1. Right-click on the SQL resource and select Add Dependency to add the newly created resource as a dependency for the SQL resource.

    ![Screenshot](../../static/img/cybersec/replication-28.png)

1. Step through the wizard, making sure to select the newly created IP resource as the Child Resource and otherwise accepting defaults.

## Appendix B: Installation and configuration on an HA system

All of the Installation and Configuration steps above should be performed, using the active HA node as the primary DR system. Use the Shared IP created in Appendix A as the DR Primary IP Address.

1. After the DR setup is complete, use the LifeKeeper GUI to failover the resource hierarchy to the HA secondary system. On that system, extract the DR zip file and browse to the **DR\\bin** directory.

1. Right-click on HA_DR_Setup.ps1 and select Run with Powershell.

1. When the "DR Setup Complete" message appears, press Enter to close the window and use the LifeKeeper GUI to failback to the HA primary system.

## Appendix C: Configure LogRhythm for HA+DR

Follow the standard HA+DR instructions, with these changes:

:::note
Follow these instructions only for HA+DR.
:::

- Install HA as usual, using the 192.168.33.x addresses for the private network

- Configure LogRhythm:

  - Use the Agent on the DR side to point to DR Secondary machine IP

  - Use the DNS name for the AllConf EMDB location on the HA side

  - Use the shared IP for the AllConf Public IP

  - Use the HA shared name and IP for the new deployment wizard in the console

    - Configure the "Platform Manager" on the HA side to point to the shared IP

    - Configure the "Platform Manager" on the DR side to point to the DR IP

    - Configure the "Data Processor" on the HA side to point to the DNS name

    - Configure the "Data Processor" on the DR side to point to the DNS name

    - Configure AIE on the HA side to point to the DNS name

    - Configure AID on the DR side to point to the DNS name

    - Configure the Agent on the HA side to point to the shared IP

  - Use the DNS name for the AllConf EMDB location on the DR side

  - Change the AllConf ElasticSearch clustername value on the DR side to    logrhythmdr

  - Add the DR secondary machine entity on entity tab of Deployment Manager and create a data indexer for DR secondary machine

  - Point the DP on the HA side to the logrhythm cluster

  - Point the DP on the DR side to the logrhythmdr cluster
