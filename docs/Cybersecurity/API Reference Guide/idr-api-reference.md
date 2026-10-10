---
title: Studio Identity Router API reference
description: >-
  API reference for the Studio Identity Router, including supported data types
  and API call operations.
author: pcartee
topic-type: API_reference
date: 09/13/2026
uid: api.identity.reference
slug: /reference/identity-router-api
keywords:
  - identity router
  - keychain
  - KeychainObject
  - UserKeychain
  - WSDL
  - Apache CXF
  - data types
---

This guide documents the data types and API operations supported by the
Studio Identity Router API.

## Audience

This guide is for developers who need the data types and operations supported
by the Studio Identity Router API.

## API specification

The management interface exposes the currently supported API. View the API
WSDL at `https://<management-interface-ip>/API`.

The WSDL is the authoritative source for the complete service contract,
including the exact operation signatures and wire format. Replace
`<management-interface-ip>` with the IP address of the management interface.

This guide describes the API data types and operation behavior. It does not
define authentication, TLS, transport, or error-code details that are not
specified in the WSDL.

## Data Types

This section defines the data types returned by the Studio Identity Router API.

:::note
API elements are serialized and returned through Apache CXF.
:::

### KeychainObject

`KeychainObject` is a generic element returned by operations whose concrete
element type is determined at runtime. As of API release 7.1, a
`KeychainObject` can be a `UserKeychain` or an `Application`.

#### Contents of KeychainObject

One `UserKeychain` or `Application` element.

#### UserKeychain

`UserKeychain` represents one user's keychain configuration. It contains the
user name and the applications configured in the user's keychain.

##### UserKeychain fields

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | string | Not specified | User who owns the keychain. |
| `applications` | array of `Application` | Not specified | Applications. |

#### Application

`Application` represents one application entry in a user's keychain. It
contains application metadata and the user's credentials for that application.

##### Application fields

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Name of the application. |
| `uuid` | string | Not specified | UUID generated for the application. |
| `credentials` | array of `Credential` | No | Application credentials. |

#### Credential

`Credential` represents one name-value pair. The value stores the user's
credential for the parent `Application`.

##### Credential fields

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Not specified | Name of the credential. |
| `value` | string | Not specified | Credential for the parent application. |

## List of API Operations

The following table summarizes the available operations. Use `update` or
`updateAll` when existing child data must be preserved. Use `replace` or
`replaceAll` when omitted child data must be deleted.

| Operation | Purpose | Response | Destructive |
| --- | --- | --- | --- |
| `get` | Retrieve one element. | `KeychainObject` | No |
| `getAll` | Retrieve all elements of a type. | Multiple objects | No |
| `update` | Add or update one element. | Updated `KeychainObject` | No |
| `updateAll` | Add or update multiple elements. | None | No |
| `replace` | Replace one element. | None | Yes |
| `replaceAll` | Replace multiple elements. | None | Yes |
| `getCount` | Count elements of a type. | Signed 64-bit integer | No |
| `remove` | Remove one element. | None | Yes |
| `removeAll` | Remove all elements of a type. | None | Yes |
| `rename` | Rename one element. | Updated `KeychainObject` | No |

### get

Retrieves one element from the keychain.

#### get request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Name of the element to retrieve. |
| `type` | string | Not specified | Type of the element to retrieve. |

#### get response

Returns the requested `KeychainObject`.

### getAll

Retrieves all elements of the specified type from the keychain.

#### getAll request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | string | Yes | Values: `user-keychain`, `application-type`. |

#### getAll response

Returns multiple `KeychainObject` elements.

### update

Adds or updates one element in the keychain. If the element exists, all
non-obfuscated values are updated. If it does not exist, it is added. Child
elements are not changed unless they are included in the supplied element.

An invalid configuration prevents the update. Examples include a non-existent
application or a credential that is not associated with an existing
application.

#### update request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `obj` | `KeychainObject` | Yes | Element to add or update. |
| `type` | string | Not specified | Type of the element to update. |

#### update response

Returns the updated `KeychainObject` as it exists in the keychain.

### updateAll

Adds or updates multiple elements in the keychain. Existing elements are
updated with non-obfuscated values. Missing elements are added. Child elements
are not changed unless they are included in the supplied elements.

If any element has an invalid configuration, none of the elements are updated.
Examples include a non-existent application or a credential that is not
associated with an existing application.

#### updateAll request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `obj` | multiple objects | Yes | Elements to add or update. |
| `type` | string | Not specified | Type of the elements to update. |

#### updateAll response

Returns no response elements.

### replace

Replaces one element in the keychain. If the element exists, all values are
replaced. Obfuscated values sent to the API retain the existing non-obfuscated
values. If the element does not exist, the API returns an error.

Unlike `update`, `replace` deletes existing child elements that are not
included in the supplied element. An invalid configuration prevents the
replacement.

:::warning
Use `replace` and `replaceAll` only when the entire element or keychain
should be replaced. Use `update` or `updateAll` to preserve existing data.
:::

#### replace request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `obj` | `KeychainObject` | Yes | Element to replace. |
| `type` | string | Not specified | Type of the element to replace. |

#### replace response

Returns no response elements.

### replaceAll

Replaces multiple elements in the keychain. Existing elements are fully
replaced. Obfuscated values retain the existing non-obfuscated values. If any
element does not exist, the API returns an error.

Unlike `updateAll`, `replaceAll` deletes existing child elements that are not
included in the supplied elements. If any element has an invalid
configuration, no elements are replaced.

:::warning
Use `replace` and `replaceAll` only when the entire element or keychain
should be replaced. Use `update` or `updateAll` to preserve existing data.
:::

#### replaceAll request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `obj` | multiple objects | Yes | Elements to replace. |
| `type` | string | Not specified | Type of the elements to replace. |

#### replaceAll response

Returns no response elements.

### getCount

Returns the number of existing elements of the specified type.

#### getCount request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | string | Yes | Element type. Supported value: `user-keychain`. |

#### getCount response

Returns `count`, a signed 64-bit integer.

### remove

Removes one entry from the keychain.

#### remove request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Not specified | Name of the element to remove. |
| `type` | string | Not specified | Type of the element to remove. |

#### remove response

Returns no response elements.

### removeAll

Removes all elements of the specified type from the keychain.

#### removeAll request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | string | Yes | Element type. Supported value: `user-keychain`. |

#### removeAll response

Returns no response elements.

### rename

Renames one element. The API signature is
`KeychainObject rename(String oldName, String newName, String type)`.

#### rename request parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `oldName` | string | Yes | Current name of the element. |
| `newName` | string | Yes | Desired name of the element. |
| `type` | string | Not specified | Type of the element to rename. |

#### rename response

Returns the updated `KeychainObject`.
