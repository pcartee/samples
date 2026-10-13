#### Configure network authentication

Configure Windows to recognize and trust the Identity Router for network authentication and access.

You must add the Identity Router to your Windows DNS Manager to enable it to perform IWA. To add the Identity Router to your DNS Manager on Windows Server 2003 - 2008, follow these instructions.

1. Go to **Administrative Tools > DNS**.

1. In the left-hand menu, select your domain in the **Forward Lookup Zones** section.

1. In the right-hand window, right-click and select **New Host (A or AAAA)**, and then enter the information about your ID Router. The IP address of the host should be configured with the proxy IP address (public IP address) of your Identity Router.

   When adding a new host record to the forward lookup zone, please be sure that the checkbox labeled **Create associated pointer (PTR) record** is checked (it will be checked by default). 

    - If the proxy IP address of the Identity Router is in an IP address range that is already defined as a reverse lookup zone, create the new record in the forward lookup zone. 
    - If the IP address range IS NOT defined as a reverse lookup zone, then do not add the record to the forward lookup zone until the IP address range containing the proxy IP address has been added as a new reverse lookup zone. 

    For more information on creating reverse lookup zones, please consult Microsoft's documentation.

#### Add the Identity Router to the Trusted Intranet Servers List

Windows clients only respond to IWA challenges from servers located within the client's domain. The client's browser determines if a server is within their domain by verifying that the server's DNS short name is used instead of the fully qualified DNS name. 

1. To allow a client to receive a successful IWA challenge and respond to that challenge, the URL of the Identity Router must be added to the "Local Intranet Sites List" in Internet Explorer (**Tools>Internet Options>Local Intranet>Sites>Advanced**). 

1. To add the Identity Router's URL to all clients' Internet Explorer's "Local Intranet sites list", use the GPO to push the registry settings that represent the "Local Intranet Sites List" to all clients. 

Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.

#### IWA Kerberos Windows 7 Security Update

Due to a new feature in Windows 7 (which has been backported to older versions of Windows via a security patch), a registry entry must be added to individual Windows clients before they can perform IWA. The registry entry that must be added is

`HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\LSA\SuppressExtendedProtection`

The value of the entry should be **2**. This addition needs to be applied ONLY if the client machines have been updated with the Windows 7 Security Update. The official announcement from Microsoft can be found at `http://support.microsoft.com/kb/968389`.

Please refer to Microsoft's documentation on how to push registry settings via the GPO to all machines in a domain.