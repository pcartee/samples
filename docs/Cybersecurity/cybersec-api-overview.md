---
title: "API Overview"
description: "Overview of the LogRhythm API, including the technology stack, security requirements, deployment guidelines, and WSDL endpoints for integrating custom applications."
author: pcartee
topic: Reference
date: 2017-01-22
uid: cybersec.api.overview
---

The LogRhythm API lets you build or integrate your own applications that extend the LogRhythm solution. Common uses include:

- Synchronizing hosts with external systems
- Automating list management for use within investigations or reports
- Building a custom application that displays user alarms and associated logs

## Technology

The LogRhythm Web Services are designed to provide interoperability across multiple development languages and platforms. The API exchanges data as XML over HTTP via the SOAP protocol. The services conform to the Web Services Interoperability (WS-I) Basic Profile 1.1 standard.

Each service provides a Web Services Description Language (WSDL) descriptor. You can use this descriptor to generate proxy classes in .NET, Java, or other languages. These services use the Microsoft .NET Windows Communication Foundation (WCF) platform and run on the Microsoft Internet Information Services (IIS) web server.

## Security

The LogRhythm API uses standard protocols to ensure the security and integrity of solutions built with the API.

- The API requires TLS/HTTPS encryption to secure message contents in transit. Upon installation, this encryption uses a self-signed certificate. The installation instructions describe how to deploy your own PKI-issued trusted certificate for added security.

- The API requires either basic user name/password authentication or Windows authentication. The API provides different URLs configured for each authentication type. Windows authentication requires additional Kerberos configuration. See the *Windows Authentication Setup* document for setup instructions.

- LogRhythm users must be authorized to use the LogRhythm API in the LogRhythm Console. API access is disabled by default. You can enable it for existing users or new service accounts:
  - **Existing users:** Modify the associated user profile or associate the user with a profile that has API access enabled.
  - **Service accounts:** Create a new person and user associated with a profile that has API access enabled.

- The application pool is set up with a database account for mediating connections to the LogRhythm database.

- In a mixed Windows and SQL authentication environment, two accounts are required to manage global shared caching.

- Alarms, Log Sources, and Lists are restricted via the API in the same way they are within the LogRhythm Console.

- The Web Service Administrator security role provides unrestricted data access, similar to the Global Administrator role, but direct database access is limited to only what the LogRhythm API requires.

## Deployment

The LogRhythm API runs on Microsoft Internet Information Services (IIS) on a dedicated server. Installing the API on a LogRhythm appliance is neither recommended nor supported because it may interfere with the function or performance of other LogRhythm services.

The API accesses SQL Server databases on the appliances in your environment, so TCP port 1433 must be open between these systems. See the *LogRhythm® API Installation Guide* for instructions on how to install and configure the LogRhythm API.

![API deployment architecture](/img/cybersec/deploment.png)

## Development

The following tables list the URLs to request the WSDL for each service. Web Services Description Language (WSDL) is a SOAP XML description of the services and their parameters. Many development tools can generate proxy classes from a WSDL to simplify service calls. See the *LogRhythm® API Reference Guide* for details on each service.

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

1. Ensure the web server certificate is trusted on your development system (see [Deployment](#deployment)).
2. Create a new Visual Studio project for your application.
3. Add a Service Reference to the project and specify one of the service URLs listed above.
4. Create a service client proxy class.
5. For basic authentication, set the user name and password (`ClientCredentials.UserName.UserName` and `ClientCredentials.UserName.Password`).
6. Call a service method.

## Calling Web Services from Java

To consume SOAP services from Java, you'll need a third-party toolkit such as [GlassFish Metro](http://metro.java.net/) or [Apache SOAP](http://ws.apache.org/soap/).

If you are using the self-signed certificate, you must import it into the Java Keystore.

## Calling Web Services from Python

To consume SOAP services from Python, you'll need a third-party toolkit such as [Suds](https://fedorahosted.org/suds/).
