---
title: Identity Routers Certificates
description: Configure and manage Identity Router SSL/TLS certificates for secure web traffic and delegated authentication, including CA-signed certificates, intermediate certificate chains, non-wildcard certificates, wildcard certificates, Subject Alternative Name (SAN) certificates, self-signed certificates, virtual domains, certificate file installation, and router restart requirements.
author: pcartee
topic: administration
date: 09/17/2024
uid: idr-certificates
---

Certificates secure communication between an Identity Router and end users or delegated authentication services. This guide explains how to use CA-signed certificates and intermediate certificate chains, and how to choose between non-wildcard, wildcard, Subject Alternative Name (SAN), and self-signed certificates when configuring Identity Router virtual domains.


## **CA-signed Certificates**

If a customer uses a CA-signed certificate that uses an intermediate certificate chain (for instance, GoDaddy.com-signed certificates) for delegated authentication, you may need to import the intermediate certificate chain to the customer's Identity Router. For instance, when Salesforce.com contacts our delegated authentication service, SFDC is acting as a client and requires our intermediate certificate bundle for the SSL Handshake (since our certificate is signed by GoDaddy.com, which uses and intermediate certificate bundle.) Please perform the following steps:

- 1) Copy the certificate file to the customer's Identity Rourt, at the location: /usr/local/symplified/etc/certs/
- 2) Navigate the the directory: /usr/local/symplified/etc
- 3) Edit the following files: httpd-virtual-host-template-catch-all-ssl and httpd-virtual-host-template-singlepoint-jk-proxy-ssl Add the following line: `SSLCertificateChainFile "/usr/local/symplified/etc/certs/<CERT_BUNDLENAME>"`
- 4) Restart the customer's Identity Router.

## **Non-Wildcard Certificates**

To support encrypted transport of web traffic from the Identity Router to the end-user's browser a customer must supply a certificate. In most cases the preference is to have a certificate singed by a trusted Certificate Authority, such as Thwarte or Digicert. The Identity Router will also accept self-signed certificates, but the end-users' web-browsers may throw an "untrusted certificates" error.

In most customer configurations the Identity Router will be serving content for multiple virtual domains, for instance sales.myco.com and internal.myco.com. There are two different types of certificates that we can use for this: wildcard certificates and Subject Alternative Name certificates.

## **Wildcard Certificate**

A "wildcard" certificate is valid for all sub-domains. The benefit of choosing a wildcard certificate is that new sub-domains can be added without needing to change the certificate, making the process of adding applications easier. Disadvantages include the higher cost of a wildcard certificate, and the inherent risk of having a certificate that is valid for all domains for a company.

## **Subject Alternative Name Certificate**

For some customers it makes more sense to use a Subject Alternative Name certificate, also called a SAN certificate or just an "alt name cert". This type of certificate explicitly lists each sub-domain. They also cost less to have signed by a Certificate Authority. When new applications and sub-domains are added to the system it will be necessary to add the sub-domains to the certificate and have it re-signed by the CA.