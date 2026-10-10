---
title: Active Directory Federation Services
description: Configure Active Directory Federation Services (ADFS) integration with an Identity Router for federated single sign-on (SSO). This guide covers federation trust architecture, Integrated Windows Authentication (IWA) without joining the Identity Router to the domain, ADFS prerequisites, domain proof and SSL certificate management, SAML 2.0 relying party trusts, LDAP claim rules, and exporting the ADFS public key to the Identity Router.
author: pcartee
topic: administration, federation, authentication, adfs, saml
date: 09/17/2024
uid: idr-ad-federation-services
---

Studio's Active Directory Federation Services (ADFS) implementation enables the Identity Router to leverage existing Identity Provider Services for authenticating to your SSO enabled applications. The Identity Router is able to act as a Resource Federation Server and establish a Federation Trust relationship with your ADFS enabled infrastructure. One of the many benefits to using the ADFS connector is enabling Integrated Windows Authentication (IWA) without requiring the Identity Router to join your domain.

The diagram below represents an example workflow for ADFS enabled authentication. In the diagram the Symplified Identity Router serves as the Resource Federation Server, and the ADFS system serves as the Account Federation Server. As such, there is no need for the Identity Router to speak directly with the ADFS server, but users accessing the system will need 80/443 connectivity to the Portal interface of the Identity Router, your custom Portal, and the relevant interface of the ADFS system. Additionally, the Identity Router will require LDAP access from the Management interface to your User Store to lookup authorization information and apply any access policies.

![ADFS federation workflow with the Identity Router as the resource federation server and ADFS as the account federation server](/img/operations-guide/_page_63_Diagram_3.jpeg)

The Federation Services Trust relationship between the Identity Router and the ADFS server on this diagram is represented, although no direct communication between the two is necessary. Not represented in this diagram is the IWA relationship between your ADFS servers, the client machines, and the windows domain.

## **External References**

Several Microsoft TechNet articles may be of use for you in designing and deploying your ADFS enabled

environment. Some of the relevant articles are below.

**ADFS Overview http://technet.microsoft.com/en-us/library/cc772593%28WS.10%29.aspx Install the ADFS Software http://technet.microsoft.com/en-us/library/dd807096%28WS.10%29.aspx Federated SSO by Example http://technet.microsoft.com/en-us/library/cc779508(WS.10).aspx**

## **Configuring Your ADFS Server**

After completing the ADFS installation wizard, you need to import the domain proof certificate with its private key into the Personal Store on your ADFS server. This certificate will be used to sign the relevant SAML assertions between the Identity Router and your ADFS system.

### **Prerequisites**

- Microsoft Windows Server 2008 R2 Standard with ADFS 2.0 enabled
- ADFS software installed per Microsoft Technet: Install the AD FS 2.0 Software • An installed and running IIS server • X.509 SSL certificate for the domain you are securing •The Identity Router running release 8.1 or later

## **To Import the Domain Proof Certificate onto the Federation Server**

- 1) Click **Start**, click **Run**, and then click **OK**. In the empty console, click **File**, and then click **Add/Remove Snap-in**.
- 2) In the *Add or Remove Snap-ins* dialog box: • select **Certificates** from the list of **Available snap-ins** •click **Add**.
- 3) In the *Certificates snap-in* dialog box: click **Computer account** • click **Next** • click **Finish** •click **OK**.
- 4) In the open console, double-click **Certificates (Local Computer)**, and then double-click **Personal**.
- 5) Right-click **Certificates**, select **All Tasks**, and then click **Import**.
- 6) On the *Welcome to the Certificate Import Wizard* page, click **Next**.
- 7) On the *File to Import* page, type the path location to the client authentication certificate, and then click **Next**.
- 8) On the *Password* page, type the password that is associated with this certificate, and then click **Next**.
- 9) On the *Certificate Store* page, select **Place all certificates in the following store** and verify that it is

pointed to the **Personal store**, and then click **Next**.

10) On the *Completing the Certificate Import Wizard* page, click **Finish**, and then click **OK**.

## **Defining a Relying Party Trust**

The Relying Party Trust configuration is where you will define the relationship with the Identity Router and allow it to become part of the Federation Services Trust relationship.

## **Create a Relying Party Trust Manually**

- 1) Click **Start** and select the following: **Programs** > **Administrative Tools** and then select **AD FS 2.0 Management**.
- 2) Under *AD FS 2.0\Trust Relationships*, right-click **Relying Party Trusts**, and then click **Add Relying Party Trust.** The *Add Relying Party Trust Wizard* displays.
- 3) On the *Welcome* page, click **Start**.
- 4) On the *Select Data Source* page, select **Enter data about the relying party manually**, and then click **Next**.
- 5) On the *Specify Display Name* page type a name in the **Display name** field (perhaps Hewlett Packard Identity Router), under Notes type a description for this relying party trust, and then click **Next**.
- 6) On the *Choose Profile* page, click **AD FS 2.0 profile**, and then click **Next**.
- 7) On the *Configure Certificate* page, click **Browse** to locate a certificate file, and then click **Next**.
- 8) On the *Configure URL* page, select the **Enable support for the SAML 2.0 WebSSO protocol** check box. Under Relying party SAML 2.0 SSO service URL, type the Security Assertion Markup Language (SAML) service endpoint URL for this relying party trust, and then click Next. (Assuming your Identity Router's portal interface is "sso.domain.com" this link would https://sso.domain.com/SPServlet?sp\_id=fed.adfs&RelayState=portal.jsf )
- 9) On the *Configure Identifiers* page, specify one or more identifiers for this relying party, click **Add** to add them to the list, and then click **Next**. (Assuming your Identity Rouoter's portal interface is "sso.domain.com" this link would be https://sso.domain.com/SPServlet )
- 10) On the *Choose Issuance Authorization Rules* page, select either **Permit** all users to access this relying party or **Deny** all users access to this relying party, and then click **Next**.
- 11) On the *Ready to Add Trust* page, review the settings, and then click **Next** to save your relying party trust information.
- 12) On the *Finish* page, click **Close**. This action automatically displays the *Edit Claim Rules* dialog box.
- 13) On the *Issuance Transform Rules* page, click **Add** Rule. This action automatically displays the *Add Transform Claim Rule* wizard.
- 14) In the **Claim rule template** drop-down, make sure **Send LDAP Attributes as Claims** is selected and click **Next**.
- 15) Define a name for the **Claim Rule** you are creating, and choose your Active Directory store from the **Attribute store** drop-down. In the **LDAP Attribute** drop-down, choose **sAM-Account-Name**, and in the **Outgoing Claim Type** drop-down, select **Name ID**. Click **Finish** to establish the Claim Rule.

- 16) Verify that a **Permit Access to All Users Rule = Permit** is in place under the *Issuance Authorization Rules* tab.

## **Export Your Public Key**

The public key for your SSL secured domain must be exported to the Identity Router. To accomplish this, follow the instructions below:

- 1) Click **Start**, **Run**, and type **mmc**.
- 2) When the console is launched, click **File**, **Add/Remove Snap-in**. This launches the *Add or Remove Snapins* dialog box.
- 3) Choose **Certificates** from the list of available snap-ins on the left, and specify **Computer Account**. Specify the Local computer and click **Finish**.
- 4) Under the *Certificates* tree, expand **Personal** and choose **Certificates**. You should see the certificate you added above.
- 5) Right click the certificate, and select **Export** from All Tasks. This will launch the *Certificate Export* wizard.
- 6) At the *Welcome* screen, click **Next**. select **No**, do not export the private key and click **Next**.
- 7) On the *Export File Format* dialog, select **DER** encoded binary X.509 (.CER) and click **Next**.
- 8) Specify a file name, and click **Next**.
- 9) Finish the export of the public key by clicking **Finish**.

The exported key file will be supplied to the Operations team for loading to your Identity Router.