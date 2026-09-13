---
title: Studio Identity Router API reference
description: API reference for the Studio Identity Router — supported data types (KeychainObject, UserKeychain, Application) and API call operations.
author: pcartee
topic-type: API_reference
date: 09/13/2026
uid: api.identity.reference
slug: /reference/identity-router-api
keywords: [identity router, keychain, KeychainObject, UserKeychain, WSDL, Apache CXF, data types]
---

*· September/13/2026 ·*

This is the Studio Identity Router API Reference Guide. This guide contains information about the data types and API calls supported by the Studio Identity Router.

## Who Should Read this Document

This guide is intended for programmers that need detailed information about the data types and operations supported by the Studio Identity Router API.

## API Call Specification

The currently supported API can always be found via the management interface of the Studio Identity Router. The WSDL for the API can be viewed at `https://<management-interface-ip>/API`.

## Data Types

This section lists the data types in the Studio Identity Router API.

:::note
All elements returned from the API are sent using Apache CXF.
:::

### KeychainObject

KeychainObject is a generic element that can be returned from the API. Because some calls to the API return elements that cannot be determined until runtime, any API call that returns an element will actually return a KeychainObject, from which the proper element type can be extracted. As of the 7.1 release of the API, a KeychainObject can be either a UserKeychain or an Application element.

#### Contents

Either a UserKeychain or Application

##### UserKeychain

UserKeychain represents a User's keychain configuration. This configuration contains information about the user and a list of applications configured in the user's keychain.

###### UserKeychain Contents

| NAME         | DESCRIPTION DESCRIPTION                  | REQUIRED |
|--------------|------------------------------------------|----------|
| username     | The name of the user for whom the        |          |
| applications | A set of application elements configured |          |

##### Application

Application represents a keychain entry for a single application. This element contains information about the application itself, as well as a list of the user's unique credentials for the application.

###### Application Contents

| NAME | DESCRIPTION DESCRIPTION                 | REQUIRED |
|------|-----------------------------------------|----------|
| name | The name of the application.            | Yes      |
| uuid | The generated uuid for the application, |          |

|  | NAME        | DESCRIPTION                                                                           | REQUIRED |
|--|-------------|---------------------------------------------------------------------------------------|----------|
|  | credentials | A set of Credential elements representing the user's credentials for the application. | No       |

##### Credential

Credential represents a name-value pair for a single credential. The Credential element stores a user's unique credential value that will be supplied when logging into the parent Application.

###### Credential Contents

| NAME  | DESCRIPTION DESCRIPTION                    | REQUIRED REQUIRED |
|-------|--------------------------------------------|-------------------|
| name  | The name of the credential (for example,   |                   |
| value | The user's individual value, which will be |                   |

## List of API Operations

This section lists the operations that can be performed within the Identity Router API.

## get

**get** - Retrieves an element from the keychain API. The object is returned via Apache CXF.

### Request Parameters

| NAME | DESCRIPTION DESCRIPTION                  | REQUIRED |
|------|------------------------------------------|----------|
| name | The name of the element to be retrieved  | Yes      |
| type | The type of the element to be retrieved. |          |

#### **Response Elements**

| NAME           | DESCRIPTION           |
|----------------|-----------------------|
| KeychainObject | The requested element |

#### **getAll**

**getAll** - retrieves all elements of the specified type from the keychain API.

## **Request Parameters**

| NAME | DESCRIPTION                                                                                       | REQUIRED |
|------|---------------------------------------------------------------------------------------------------|----------|
| type | The type of the elements to be retrieved. Supported types are: user-keychain and application-type | Yes      |

## **Response Elements**

| NAME                      | DESCRIPTION            |
|---------------------------|------------------------|
| KeychainObject (multiple) | The requested elements |

#### **update**

**update** - updates an element in the keychain. If the element exists, all non-obfuscated values will be updated. If the element does not exist, it will be added to the keychain. Updates do not alter child elements unless they are present in the element passed to the API.

If the provided element contains an invalid configuration, the update will not be performed. This includes (but is not limited to) configurations for non-existent applications or keychain credentials that are not associated with existing applications.

## **Request Parameters**

| NAME | DESCRIPTION DESCRIPTION                | REQUIRED REQUIRED |
|------|----------------------------------------|-------------------|
| obj  | The element to be updated.             | Yes               |
| type | The type of the element to be updated. |                   |

# **Response Elements**

| NAME           | DESCRIPTION                                            |
|----------------|--------------------------------------------------------|
| KeychainObject | The updated element, as it now exists in the keychain. |

#### **updateAll**

**updateAll** - updates multiple elements in the keychain. If the element exists, all non-obfuscated values will be updated. If the element does not exist, it will be added to the keychain. Updates do not alter child elements unless they are present in the element passed to the API.

If any of the provided elements contains an invalid configuration, none of the elements will be updated. This includes (but is not limited to) configurations for non-existent applications or keychain credentials that are not associated with existing applications.

## **Request Parameters**

| NAME           | DESCRIPTION DESCRIPTION                | REQUIRED |
|----------------|----------------------------------------|----------|
| obj (multiple) | The elements to be updated.            | Yes      |
| type           | The type of the element to be updated. |          |

#### **Response Elements**

none

#### **replace**

**replace** - replaces an element in the keychain. If the element exists, all values will be replaced. If obfuscated values are sent to the API, they will be replaced with the existing, non-obfuscated values. If the element does not exist, the API will return an error message. Unlike an update, replace will delete any existing child elements that were not passed in with the element supplied by the API call.

If the provided element contains an invalid configuration, none of the elements will be replaced. This includes (but is not limited to) configurations for non-existent applications or keychain credentials that are not associated with existing applications.

**Warning**: The replace and replaceAll calls are intended for situations where a customer wishes to alter or delete a user's entire keychain. For situations where a customer wishes to preserve existing keychain data or alter only a few application keychains, the update or updateAll API calls should be used.

#### **Request Parameters**

| NAME           | DESCRIPTION DESCRIPTION       | REQUIRED REQUIRED |
|----------------|-------------------------------|-------------------|
| KeychainObject | The elements to be replaced.  | Yes               |
| type           | The type of the element to be |                   |

## **Response Elements**

none

#### **replaceAll**

**replaceAll** - replaces multiple element in the keychain. If the elements exist, all values will be replaced. If obfuscated values are sent to the API, they will be replaced with the existing, non-obfuscated values. If any of the elements do not exist, the API will return an error message. Unlike an update, replace will delete any existing child elements that were not passed in with the elements supplied by the API call.

If any of the provided elements contains an invalid configuration, the replace will not be performed. This includes (but is not limited to) configurations for non-existent applications or keychain credentials that are not associated with existing applications.

**Warning**: The replace and replaceAll calls are intended for situations where a customer wishes to alter or delete a user's entire keychain. For situations where a customer wishes to preserve existing keychain data or alter only a few application keychains, the update or updateAll API calls should be used.

#### **Request Parameters**

| NAME | DESCRIPTION DESCRIPTION       | REQUIRED |
|------|-------------------------------|----------|
|      | The elements to be replaced.  | Yes      |
| type | The type of the element to be |          |

#### **Response Elements**

none

#### **getCount**

**getCount** - returns a numeric count of the number of existing elements of the specified type.

# **Request Parameters**

|  | NAME | DESCRIPTION                                                               | REQUIRED |
|--|------|---------------------------------------------------------------------------|----------|
|  | type | The type of the element to be counted. Supported types are: user-keychain | Yes      |

#### **Response Elements**

| NAME  | DESCRIPTION           |
|-------|-----------------------|
| count | Signed 64-bit integer |

#### **remove**

**remove** - removes the specified entry from the keychain

# **Request Parameters**

| NAME | DESCRIPTION DESCRIPTION       | REQUIRED REQUIRED |
|------|-------------------------------|-------------------|
| name | The name of the element to be |                   |
| type | The type of the element to be |                   |

#### **Response Elements**

none

#### **removeAll**

**removeAll** - removes all elements of the specified type from the keychain

#### **Request Parameters**

| NAME | DESCRIPTION                                                                | REQUIRED |
|------|----------------------------------------------------------------------------|----------|
| type | The type of the elements to be removed. Supported types are: user-keychain | Yes      |

#### **Response Elements**

none

#### **rename**

**rename** - KeychainObject rename(String oldName, String newName, String type)

# **Request Parameters**

|  | NAME    | DESCRIPTION                      | REQUIRED |
|--|---------|----------------------------------|----------|
|  | oldName | The current name of the element. | Yes      |

| NAME | DESCRIPTION DESCRIPTION         | REQUIRED REQUIRED |
|------|---------------------------------|-------------------|
| name | The desired name of the element | Yes               |
| type | The type of the element to be   |                   |

#### **Response Elements**

| NAME           | DESCRIPTION         |
|----------------|---------------------|
| KeychainObject | The updated element |