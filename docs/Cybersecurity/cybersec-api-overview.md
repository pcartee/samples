---
title: "API Overview"
description: "Overview of the LogRhythm API, including the technology stack, security requirements, deployment guidelines, and WSDL endpoints for integrating custom applications."
author: pcartee
topic: Reference
date: 2017-01-22
uid: cybersec.api.overview
---

The LogRhythm API lets you build or integrate applications that extend the LogRhythm solution. Common uses include:

- Synchronizing hosts with external systems.
- Automating list management for investigations or reports.
- Building a custom application that displays user alarms and associated logs.

## Technology

The LogRhythm Web Services provide interoperability across multiple development languages and platforms. The API exchanges data as XML over HTTP using the SOAP protocol. The services conform to the Web Services Interoperability (WS-I) Basic Profile 1.1 standard.

Each service provides a Web Services Description Language (WSDL) descriptor. You can use this descriptor to generate proxy classes in .NET, Java, or other languages. The services use the Microsoft .NET Windows Communication Foundation (WCF) platform and run on Microsoft Internet Information Services (IIS).

## Security

The LogRhythm API uses standard protocols to help secure solutions built with the API and protect data integrity.

- The API requires TLS/HTTPS encryption to protect message contents in transit. By default, the installation uses a self-signed certificate. The installation instructions describe how to deploy a trusted certificate issued by a public key infrastructure (PKI).

- The API requires either basic authentication with a user name and password or Windows authentication. The API provides different URLs for each authentication type. Windows authentication requires additional Kerberos configuration. See the *Windows Authentication Setup* document for instructions.

- LogRhythm users must be authorized to use the API in the LogRhythm Console. API access is disabled by default. You can enable it for existing users or service accounts:

  - **Existing users:** Modify the associated user profile or associate the user with a profile that has API access enabled.
  - **Service accounts:** Create a new person and user associated with a profile that has API access enabled.

- The application pool is set up with a database account for mediating connections to the LogRhythm database.

- In a mixed Windows and SQL authentication environment, two accounts are required to manage global shared caching.

- Access to alarms, log sources, and lists through the API is restricted in the same way as access through the LogRhythm Console.

- The Web Service Administrator security role provides unrestricted data access, similar to the Global Administrator role, but direct database access is limited to only what the LogRhythm API requires.

## Deployment

The LogRhythm API runs on Microsoft Internet Information Services (IIS) on a dedicated server. Installing the API on a LogRhythm appliance is not recommended or supported because it may interfere with the function or performance of other LogRhythm services.

The API accesses SQL Server databases on the appliances in your environment, so TCP port 1433 must be open between these systems. For installation and configuration instructions, see the *LogRhythm® API Installation Guide*.

![Diagram showing a client application connecting to the LogRhythm API over HTTPS on port 443, and the API connecting to Platform Manager and Data Processor and Indexer systems over SQL Server on port 1433](/img/cybersec/deploment.png)

## Development

The following tables list the URLs for requesting each service's WSDL. Web Services Description Language (WSDL) describes SOAP services and their parameters in XML. Many development tools can generate proxy classes from a WSDL to simplify service calls. For details about each service, see the *LogRhythm® API Reference Guide*.

### Basic Authentication

| Service           | WSDL URL                                                                    |
| :---------------- | :-------------------------------------------------------------------------- |
| Alarm Service     | `https://hostname/LogRhythm.API/Services/AlarmServiceBasicAuth.svc?wsdl`    |
| Entity Service    | `https://hostname/LogRhythm.API/Services/EntityServiceBasicAuth.svc?wsdl`   |
| Host Service      | `https://hostname/LogRhythm.API/Services/HostServiceBasicAuth.svc?wsdl`     |
| List Service      | `https://hostname/LogRhythm.API/Services/ListServiceBasicAuth.svc?wsdl`     |
| Log Query Service | `https://hostname/LogRhythm.API/Services/LogQueryServiceBasicAuth.svc?wsdl` |
| Lookup Service    | `https://hostname/LogRhythm.API/Services/LookupServiceBasicAuth.svc?wsdl`   |

### Windows Authentication

| Service           | WSDL URL                                                                      |
| :---------------- | :---------------------------------------------------------------------------- |
| Alarm Service     | `https://hostname/LogRhythm.API/Services/AlarmServiceWindowsAuth.svc?wsdl`    |
| Entity Service    | `https://hostname/LogRhythm.API/Services/EntityServiceWindowsAuth.svc?wsdl`   |
| Host Service      | `https://hostname/LogRhythm.API/Services/HostServiceWindowsAuth.svc?wsdl`     |
| List Service      | `https://hostname/LogRhythm.API/Services/ListServiceWindowsAuth.svc?wsdl`     |
| Log Query Service | `https://hostname/LogRhythm.API/Services/LogQueryServiceWindowsAuth.svc?wsdl` |
| Lookup Service    | `https://hostname/LogRhythm.API/Services/LookupServiceWindowsAuth.svc?wsdl`   |

## Calling Web Services from Visual Studio

1. Verify that your development system trusts the web server certificate. See [Deployment](#deployment).
2. Create a Visual Studio project for your application.
3. Add a Service Reference to the project and specify one of the service URLs listed above.
4. Create a service client proxy class.
5. For basic authentication, set the user name and password (`ClientCredentials.UserName.UserName` and `ClientCredentials.UserName.Password`).
6. Call a service method.

## Calling Web Services from Java

To consume SOAP services from Java, use a third-party toolkit such as [GlassFish Metro](http://metro.java.net/) or [Apache SOAP](http://ws.apache.org/soap/).

If you are using the self-signed certificate, you must import it into the Java Keystore.

## Calling Web Services from Python

To consume SOAP services from Python, use a third-party toolkit such as [Suds](https://fedorahosted.org/suds/).
