---
title: "Set up Windows authentication"
description: "Instructions for configuring Kerberos delegation, IIS, SQL Server, application accounts, and WCF clients to use Windows authentication with the LogRhythm API, including troubleshooting guidance."
author: pcartee
topic: Reference
date: 2017-01-22
uid: cybersec.win.auth
sidebar_position: 5
---

To use Windows authentication with the LogRhythm API, configure the web server for cross-machine delegation with Kerberos. A domain administrator must complete steps that require changes to Active Directory. Windows authentication is supported only when all servers and accounts belong to the same Active Directory forest.

## Configuration steps

### Create a domain service account

The IIS application pool account needs permissions in the LogRhythm databases to validate Windows user permissions. The preferred approach is to create a domain account for this purpose in Active Directory.

Alternatively, use the default `ApplicationPoolIdentity` and grant the web server's machine account (`<domain>\<hostname>$`) permission to access the databases. This option is less secure.

### Enable Kerberos delegation in Active Directory

1. In the Active Directory Users and Computers snap-in, locate the web server's computer account.
1. Open the computer account's properties and select the **Delegation** tab.
1. Select **Trust this computer for delegation to any service (Kerberos only)**.
1. To use constrained delegation (the **Trust this computer for delegation to specified services only** option), first complete this setup and verify Kerberos authentication from a client application. Then configure delegation for a restricted set of services.

### Configure the IIS application pool

1. On the LogRhythm API server, open Internet Information Services (IIS) Manager.
1. Select **Application Pools**.
1. Open **Advanced Settings** for `LogRhythmAppPool`.
1. Open the **Identity** dialog. Select **Custom account**, and enter the service account name and password.

### Enable Windows authentication in IIS

1. On the LogRhythm API server, open IIS Manager.
1. Select **LogRhythm Web Site**.
1. In **Features View**, open **Authentication**.
1. Enable **Anonymous Authentication**, **Basic Authentication**, and **Windows Authentication**. Disable the other authentication methods.
1. Select **Windows Authentication**, then select **Providers**. Make sure **Negotiate** is at the top of the list.
1. Select **Windows Authentication**, then select **Advanced Settings**. Make sure **Enable Kernel-mode authentication** is selected.

### Configure SQL Server for Kerberos authentication

1. On each LogRhythm XM, PM, or DPX appliance, open SQL Server Configuration Manager.
1. Select **SQL Server Services**.
1. For the SQL Server service, note the account shown under **Log On As**.
1. If the service account is `NT AUTHORITY\LOCALSERVICE`, change it to `NT AUTHORITY\NETWORKSERVICE`. Stop LogRhythm services before you restart the database.
1. If the service account is `LocalSystem` or `NT AUTHORITY\NETWORKSERVICE` (the preferred option), SQL Server should register the Service Principal Names (SPNs) automatically when it starts.
1. If the service account is a domain account, a domain administrator must register the SPNs manually. Run these commands for each XM, PM, or DPX appliance that the application might query:

   ```cmd
   setspn -S MSSQLSvc/<fully-qualified-domain-name>:1433 <domain>\<sql-service-account>
   setspn -S MSSQLSvc/<host-name>:1433 <domain>\<sql-service-account>
   ```

   Alternatively, run the SQL Server service on each LogRhythm appliance under the account specified for its SQL Server SPN.

### Grant the service account database permissions

1. On the LogRhythm XM or PM, open SQL Server Management Studio.
1. Open **Server > Security > Logins**, then create a new login.
1. Enter or select the web server service account created earlier.
1. On the **User Mapping** page, select `LogRhythmEMDB` and the `LogRhythmRestrictedAnalyst` role.

### Configure the client

The Windows Communication Foundation (WCF) client application must be configured to delegate credentials.

In the client's `web.config`, define an endpoint behavior for each service reference that uses Windows authentication. Add a behavior like this:

```xml
<behaviors>
  <endpointBehaviors>
    <behavior name="DelegateBehavior">
      <clientCredentials>
        <windows allowedImpersonationLevel="Delegation" />
      </clientCredentials>
    </behavior>
  </endpointBehaviors>
</behaviors>
<client>
  <endpoint
    address="https://webserver/LogRhythm.API/Services/LogQueryServiceWindowsAuth.svc"
    binding="basicHttpBinding"
    bindingConfiguration="LogQueryServiceWindowsAuth_LogQueryService"
    contract="LogQueryService.LogQueryService"
    name="LogQueryServiceWindowsAuth_LogQueryService"
    behaviorConfiguration="DelegateBehavior" />
</client>
```

You can also configure delegation in your .NET client code after you instantiate the LogRhythm service:

```csharp
<LogRhythmClient>.ClientCredentials.Windows.AllowedImpersonationLevel =
    System.Security.Principal.TokenImpersonationLevel.Delegation;
```

## Configure the application pool account

The LogRhythm web service application pool must run under an account with the `WebServiceAdmin` role. By default, no `WebServiceAdmin` accounts are configured in a LogRhythm deployment, so create a profile and account for this purpose. Grant the profile Web API access, then configure the account as the identity for `LogRhythmAppPool`.

1. Start the LogRhythm Client Console and sign in as a Global Administrator.
1. On the **Tools** menu, select **Administration**, then select **User Profile Manager**.
1. Right-click below the list of existing profiles, then select **New**.
1. Create the user profile and select **Web Service Administrator** as the security role.
1. Complete the profile details, then select **OK**.

## Configure web.config user initialization

LogRhythm web services require an application account for global caching. Configure the account in `web.config` as shown below. If you do not use Windows or Basic authentication, you can comment out the corresponding section.

The application creates the global cache the first time it starts or when a session cannot find the cache. With Windows authentication, the application uses the application pool account. If this section is commented out, uncomment it and configure it as shown:

**File location:** `\\..\LogRhythm\WebSiteRoot\LogRhythm.API\Web.config`

Leave the account and account key empty so the application uses the Windows account assigned to the application pool.

```xml
<!-- Begin Windows Application Account Settings -->
<add key="ApplicationAccountType" value="WindowsAccountType" />
<add key="ApplicationAccount" value="" />
<add key="ApplicationAccountKey" value="" />
<!-- End Windows Application Account Settings -->
```

## Troubleshooting

### Service Principal Names

Kerberos authentication requires Service Principal Names (SPNs) to be registered in Active Directory. SPNs uniquely identify each service involved in authentication. SQL Server or IIS may register SPNs automatically when the service starts.

- SQL Server automatically registers SPNs when it runs as LocalSystem or Network Service. Local Service and domain accounts without the required domain privileges cannot register SPNs. SQL Server writes an Information event to the Application event log when it registers an SPN.
- IIS 7 automatically registers SPNs regardless of the application pool identity when Kernel-mode authentication is enabled.
- Duplicate SPNs for the same service can cause authentication to fail. Make sure each SPN is registered only once.
- Use the Windows Server `setspn.exe -L` command to list the SPNs associated with a computer or user account. SQL Server automatically registers SPNs with the service name `MSSQLSvc`.

### Common errors

- **Error: The requested service could not be activated.**

  Open the service URL in Internet Explorer on the server to view a more descriptive error.

- **Error: Security settings for this service require Windows authentication, but it is not enabled for the IIS application that hosts this service.**

  Enable Windows authentication for the website in IIS.

- **Error: Login failed for user `'<DOMAIN>\<HOSTNAME>$'`.**

  The application pool uses the default `ApplicationPoolIdentity`, which does not have permission to log in to the database. Grant the machine account database permissions or run the application pool under a domain account.

- **Error: Login failed for user `'<SERVICEACCOUNT>'`.**

  Grant the service account permissions in the database.

- **Error: Login failed for user `'NT AUTHORITY\ANONYMOUS LOGON'`.**

  The server is not configured correctly for Kerberos authentication. Check the SPN configuration and delegation permissions in Active Directory.

- **Error: Windows authentication requires identity delegation.**

  The web service is being called without impersonation or the permissions needed to delegate the identity. Check the client configuration.

- **Error: Transport authentication failed in the Windows Application log.**

  As a troubleshooting measure, enable NTLM in your client code. This setting is deprecated.

  ```csharp
  <LogRhythmClientService>.ClientCredentials.Windows.AllowNtlm = true;
  ```

### Additional resources

- [Understanding Kerberos double hop](https://blogs.technet.com/b/askds/archive/2008/06/13/understanding-kerberos-double-hop.aspx)
- [Registering a Service Principal Name for Microsoft SQL Server](https://msdn.microsoft.com/en-us/library/ms191153(v=sql.105).aspx)
- [Delegation and impersonation with WCF](https://msdn.microsoft.com/en-us/library/ms730088(v=vs.100).aspx)
- [Enable Kerberos event logging](https://support.microsoft.com/kb/262177)

DelegConfig is an ASP.NET application for validating Kerberos configuration. Install and configure it on the IIS web server as a .NET 2.0 application.

- [DelegConfig v2 beta (delegation Kerberos configuration tool)](https://www.iis.net/downloads/community/2009/06/delegconfig-v2-beta-(delegation-kerberos-configuration-tool))
- [How to use DelegConfig](https://blogs.iis.net/bretb/archive/2008/03/27/How-to-Use-DelegConfig.aspx)
- [DelegConfig delegation configuration reporting tool](https://blogs.iis.net/brian-murphy-booth/archive/2007/03/09/delegconfig-delegation-configuration-reporting-tool.aspx)
