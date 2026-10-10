---
title: Amazon EC2 Identity Router Deployment
description: Deploy Identity Routers on Amazon Web Services (AWS) Elastic Compute Cloud (EC2), including AWS account and X.509 certificate setup, security groups, Elastic IP addresses, key pairs, EC2 instances, Amazon Machine Images (AMIs), regional deployment, and access through the AWS Management Console. The guide covers creating and uploading a CentOS-based Identity Router AMI and provisioning Identity Router instances in an AWS environment.
author: pcartee
topic: administration, deployment, aws, ec2
date: 09/17/2024
uid: idr-amazon-ec2
---

This guide explains how to manually deploy an Identity Router on Amazon Web Services (AWS) Elastic Compute Cloud (EC2). It covers preparing an AWS account and X.509 certificate/key pair, configuring security groups, Elastic IP addresses, and key pairs, creating and uploading a CentOS-based Amazon Machine Image (AMI), and using the AWS Management Console to launch and provision Identity Router instances in the correct region.

**Warning**: Only Identity Router's created on EC2 accounts owned by your Cloud Service Provider will be supported.

There are three steps to complete when deploying an Identity Router to an Amazon EC2 environment:

- •**Create a New EC2 Environment** on page 50
- **Create a New Amazon Machine Image (AMI)** on page 52 •**Log Into the AWS Management Console** on page 52

## **Understanding Your New Amazon Web Service Account**

The elements within the management console are tied to a specific region and that region is essentially a data center. Like any data center, there are different components working in concert to make up the data center as a whole. The Amazon Web Service (AWS) components to be concerned with are: Security groups, Elastic IP's, and Instances. These AWS elements are represented by different terms in the industry. The AWS elements are listed below in bold with their analogous counterparts.

- • **Security Groups** - Firewall rules • **Elastic IPs** - Static public-facing IP addresses that can be included in NAT mapping •**Key pairs** - User account access to instances
- **Instances** Running machines

## **Security Groups**

Security groups are effectively the firewall for your Amazon account. You can create multiple security groups and assign those groups to different inbound ports for access. Once a security group is created it can be associated to any running instance. This enables you to create a single security group for all IDRs because the security group acts as the inbound access rules rather than the NAT mapping.

The NAT mapping is independent of the security group, but the two are associated at runtime with the instance. The Security Group can be modified at anytime and will immediately affect access to any running instance that is associated to the Security Group.

## **Elastic IP's and AWS IP addressing space in general**

IP addressing for the machine instances at AWS is based off of DHCP for the internal network space (RFC 1918). When a new account is created, a DHCP pool is also allocated to the account. The pool is allocated by AWS. It is not possible to specify an IP range to use. The pool grows when more machine instances are created. When you allocate an instance, a public (non RFC 1918) address within the pool is allocated and automatically assigned to the instance.

The public IP address assigned by AWS is also assigned via DHCP and is automatically included in the internal IP address range and NAT. External access from the new public facing IP address is controlled via the security group described above. This is the IP address that can be used to access the machine directly using SSH and the key pairs described in the *Key Pairs* section of this document. This process assumes that the security group assigned to the instance allows SSH access.

The external IP address space is "free" and is allocated via DHCP, which will work if DNS will not be used in your AWS instances. Using DNS is not ideal for most Web applications, and particularly not ideal for an Identity Router. To overcome this, AWS has created the Elastic IP system. By default a new EC2 account will be assigned 2 elastic IP's. An elastic IP is a static public IP address that AWS assigns to your account. This IP address will not change and can then be assigned to a running instance. When this is done the DHCP assigned public IP is then released and the elastic IP address is now the public IP that will be in the NAT mapping to the internal DHCP IP address of the instance to which it was assigned. Additional elastic or "static" public IP addresses can be purchased if needed.

## **Key pairs**

Creating key pairs will be one of the first tasks you'll need to do once your AMI is uploaded to AWS. Each key pair is effectively a user with root access to the IDR instances that you'll create. Key pairs can be created and deleted as needed, but you will be required to pick a specific key pair when creating an Identity Router instance. It is recommended that only one key pair be created and that the key pair be managed by the operations team for a Studio account.

## **Instances**

An AWS instance is a running virtual machine in the configured region (data center). Each instance is created (launched) from a specified AMI.

This will launch a running Virtual Machine (VM) based off of the AMI that was uploaded, which will always be a 64-bit CentOS base image for Identity Routers. Once an instance has been created, it is turned into an Identity Router (a process explained later in this document).

Instances are "runtime" instances of machines. They can be rebooted and will maintain their state. Because they are runtime instances, when they are shutdown they effectively go away and are deallocated from your running instances and ALL DATA IS LOST. Since IDRs run most processes using information sent from the cloud, shutting it down an IDR is not an issue. However, because IDRs have the potential to lose data if they go down, it is important that keychain backup always be enabled for Amazon IDR's.

AWS does provide an operational permanent store and the storage is independent of running instances and can be re-attached to a separate instance if necessary. This is NOT currently supported as the storage service involves an additional cost and must be mounted as a separate process from our current IDR stack. This feature may be supported in future releases.

## **Create a New EC2 Environment**

Creating an EC2 environment involves two steps: Create a New Amazon Web Services Account, Create and download the X.509 Cert/Key Pair.

## **Create a New Amazon Web Services Account**

- 1) Go to http://aws.amazon.com.
- 2) Follow the instructions supplied by Amazon.

## **Create a Cert/Key Pair**

Once you have created an Amazon Web Services account, you will need to create an X.509 cert/key pair for use with the Amazon API.

- 1) Click the **Security Groups** link under your **Account** tab. The *Security Groups* page displays.

| AWS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Products | Developers | Community | Support | Account |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |  |  |  |  |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|------------|-----------|---------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--|--|--|--|
| <b>Your Account</b>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |          |            |           |         |         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |  |  |  |  |
| <ul style={{listStyleType: 'none'}}> <li><b>Account Activity</b> <p>View current charges and account activity, itemized by service and by usage type. Previous months' billing statements are also available.</p> </li> <li><b>Usage Reports</b> <p>Download usage reports for each service you are subscribed to. Reports can be customized by specifying usage types, timeframe, service operations, and more.</p> </li> <li><b>Security Credentials</b> <p>Amazon Web Services uses access identifiers to authenticate requests to AWS and to identify the sender of a request. Three types of identifiers are available: (1) AWS Access Key Identifiers, (2) X-309 Certificates, and (3) Key pairs.</p> </li> <li><b>Personal Information</b> <p>View and edit personal contact information, such as address and phone number. Set communication preferences for email subscriptions.</p> </li> </ul> |          |            |           |         |         | <ul style={{listStyleType: 'none'}}> <li><b>Payment Method</b> <p>View and edit current payment method, as well as add new payment methods.</p> </li> <li><b>Consolidated Billing</b> <p>Receive one bill for multiple AWS Accounts, with cost breakdowns for each account. Usage is combined, enabling you to more quickly reach lower-priced volume bers.</p> </li> <li><b>AWS Identity and Access Management</b> <p>Create multiple Users and manage the permissions for each of these Users within your AWS Account.</p> </li> <li><b>AWS Management Console</b> <p>Access and manage AWS Infrastructure Web Services through our web-based, point-and-click, graphical user interface.</p> </li> <li><b>DevPay Activity</b> <p>View revenue and costs for your Amazon DevPay products. Manage your Amazon DevPay products.</p> </li> </ul> |  |  |  |  |

2) Scroll down and select the **X.509 Certificates** tab.

![Screenshot of the Access Credentials page showing the X.509 certificates section. It includes a list of credentials and a 'Create a new Certificate' button.](/img/operations-guide/_page_62_Picture_2.jpeg)The screenshot displays the 'Access Credentials' section of the Access Credentials page. It includes a list of credentials and a 'Create a new Certificate' button.

| Created                                                | X.509 Certificate                                       | Status                    |
|--------------------------------------------------------|---------------------------------------------------------|---------------------------|
| December 30, 2010                                      | cert-RIENY3HQOXFKQT43ESK2AYDE7EMQ2FFK.pem<br />(Download) | Active<br />(Make Inactive) |
| Create a new Certificate   Upload Your Own Certificate |                                                         |                           |

3) On the **X.509 Certificates** tab, click the **Create a new Certificate** link.

**Note**: There can only be two X.509 certificates associated to your account. If you already have two X.509 certificates, you will not see the **Create a Certificate** link.

The **X.509 Certificate Created** dialog displays.

![Screenshot of the X.509 Certificate Created from the X.509 Certificate Created program.](/img/operations-guide/_page_53_Picture_10.jpeg)This image shows the X.509 Certificate Created from the X.509 Certificate Created program. It is a screenshot of the program interface. At the top is a bar with the text 'X509 Certificate Created'. Below this is a section titled 'You have successfully created a new X.509 Certificate.' This section contains a link to 'Please download your Private Key file now.' This link provides a page where the private key file can be downloaded from the X.509 Certificate Created program. Below the link is a section titled 'Download Private Key File'. This section contains a link to 'IMPORTANT: You should store your Private Key file in a secure location.' This link provides a page where the private key file can be downloaded from the X.509 Certificate Created program. Below the link is a section titled 'Your Private Key is secret, and should be known only by you.' This link provides a page where the private key file can be downloaded from the X.509 Certificate Created program. Below the link is a section titled 'Please download your certificate file.' This link provides a page where the private key file can be downloaded from the X.509 Certificate Created program. Below the link is a section titled 'Close'.

- 4) Click the **Download Private Key File** button to download the X.509 private key.
- 5) Click **Download x.509 Certificate** button to download the X.509 certificate.

## **Create a New Amazon Machine Image (AMI)**

To ease the burden of creating an AMI, the engineering team has supplied a script that creates the base Linux image called **create\_base\_centos\_ami.sh**. Using Amazon's AMI tools, an EC2 ready "bundle" can be created and uploaded. The bundle will be created and uploaded to the specified environment when the **create\_base\_centos\_ami.sh** script is run. This is a one-time task for a new EC2 environment and should only be done with the assistance of the operations team.

**Note**: The creation of the AMI base image for an account needs to be done only once. The upload process is slow; however, the creation of a new AMI should be a very infrequent event.

To get access to the helper scripts, please access the following directory on the build system: /data/alderaan/l0/EC2. This directory contains the script **create\_base\_centos\_ami.sh** which will be used to create an AMI. The variables of the script are defined at the top of the script. This script will create and upload the resulting AMI to the specified Amazon account.

- 1) Download the script from the **/data/alderaan/l0/EC2** directory on the build system.
- 2) The **create\_base\_centos\_ami.sh** script must be edited before it is run. Copy the following information into the **create\_base\_centos\_ami.sh** script or a copy of the script that is to be used for the intended Amazon environment: • The AWS account number
  - The Access Key ID value
  - The Secret Access Key value
  - Specify the location of the previously downloaded certificate and private key
- 3) Once these modifications have been made to the **create\_base\_centos\_ami.sh** script, it is ready to be run. If there are any problems running the **create\_base\_centos\_ami.sh** script, please see the operations is correct: • AWS account number • Access Key ID • Secret Access Key
  - Locations of the private key and certificate that are specified in the script

team for help. Prior to contacting the operations team, double-check that the information you entered

## **About Your AMI**

Once you have run the **create\_base\_centos\_ami.sh** script and the new AMI as been uploaded to the specified account, it's time to log into the **AWS Management Console**.

## **Log into the AWS Management Console**

- 1) Click the **Sign in to the AWS Management Console** link at the top of the *Amazon Web Services* page.

![AWS Access Credentials page with X.509 certificate options](/img/operations-guide/_page_62_Picture_2.jpeg)

![Amazon webservices logo and service buttons for AWS, Products, Developers, Community, Support, and Account.](/img/operations-guide/_page_62_Picture_2.jpeg)

- 2) Enter your login credentials to enter the console. The *Amazon EC2* page displays.
- 3) To view the newly uploaded AMI, click the **AMIs** link.

![Amazon EC2 console listing the uploaded Identity Router AMI](/img/operations-guide/_page_62_Picture_5.jpeg)

![Screenshot of Amazon EC2 showing a comparison of Amazon Elastic Map Reduce and Amazon CloudFront with a comparison task titled 'Amazon Mashine Images'.](/img/operations-guide/_page_62_Picture_5.jpeg)The screenshot displays the Amazon EC2 system interface. The top section contains the 'Amazon Elastic Map Reduce' and 'Amazon CloudFront' buttons. The middle section is titled 'Amazon Mashine Images'. The left side bar is labeled 'Region: US Exec' and 'Instances: Spot Requests'. The right side bar shows a comparison task titled 'Amazon Mashine Images' with columns for 'AMI ID', 'Source', 'Owner', 'Visibility', and 'Status'. The 'AMI ID' is 'ami-01947888' and 'Source' is 'symplified/CentOS\_Base manifest.xml'. The 'Owner' is '936630126168' and 'Visibility' is 'Private'. The 'Status' is 'available'. The 'AMI' icon is yellow. The 'Bamfle Tasks' icon is green.

## **About Your AMI**

When an AMI is uploaded, there are some things you should be aware of:

## **The AMI and Your Account**

- The AMI is given a unique ID for reference within your environment
- The AMI is only available to your account

## **The AMI and Regions**

When the AMI is uploaded, it is only uploaded to a specific region, and is only available to that region. When editing properties in the *Management Console* on the *AMI* page, the edits only affect the region denoted by the **Region** drop-down in the upper left-hand corner of the console.

An AMI can be uploaded to a specific region by tweaking the **create\_base\_centos\_ami.sh** script, but this should not be attempted without the assistance of the operations team and/or consulting the AWS documentation.

Once the AMI has been uploaded to the new AWS account, the account is ready to have Identity Routers provisioned to it. Please keep in mind that ALL Identity Routers will need to be provisioned to the region to which the AMI was uploaded again. It's best to think of regions as physical data centers, because regions have the same constraints with regards to storage and availability that any physical data center would have.