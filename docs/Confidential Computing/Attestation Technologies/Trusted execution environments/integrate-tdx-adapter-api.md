---
title: "`go-tdx` adapter API reference"
description: Reference for the TA Go TDX attestation client APIs, including evidence collection, decryption, key generation, and event-log access.
author: "[redacted]"
topic: integration
date: 12/22/2023
uid: integrate.tdx.api
---

The TA Intel® TDX Attestation client includes a Go client and a command-line interface (CLI). Use the Go client in Go applications. Use the CLI from the command line or from applications written in other languages to add TDX remote attestation.

:::note
TA uses the `tdx_report_data` claim to verify certain data provided with the quote. The TDX quote's `REPORTMACSTRUCT.REPORTDATA` must contain a SHA-512 hash of the cumulative value of the nonce supplied with the evidence, `runtime_data` supplied during quote generation, optional user data (provided through the `user_data` parameter in client APIs), and attester-held data supplied by the TEE during quote generation. TA clients hash the data for you. Independently developed clients must include the logic to add the hash to `REPORTDATA`. For an example, see the Go TDX adapter's [CollectEvidence](https://github.com/intel/ta-client-for-go/blob/14b89ef3b58dac84feb125857f6837c1e1b166f0/go-tdx/collect_evidence.go#L26) function.

Microsoft Azure TDX Preview users should use the [azure-tdx-preview](https://github.com/intel/ta-client-for-go/tree/azure-tdx-preview/go-tdx) branch. The Microsoft Azure implementation has different prerequisites, build steps, and commands. See the `README.md` file for details.
:::

The `go-tdx` package exposes the following APIs.

## API reference

```go
import "github.com/intel/ta-client-for-go/go-tdx"
```

[**func CollectEvidence**](#func-collectevidence)

[**func Decrypt**](#func-decrypt)

[**func GenerateKeyPair**](#func-generatekeypair)

[**func GetEventLogs**](#func-geteventlogs)

[**func NewEvidenceAdapter**](#func-newevidenceadapter)

[**func NewEventLogParser**](#func-neweventlogparser)

The following code example creates a TDX adapter and collects evidence for a quote.

```go
import "github.com/intel/ta-client-for-go/go-tdx"

evLogParser := tdx.NewEventLogParser()
adapter, err := tdx.NewEvidenceAdapter(tdHeldData, evLogParser)
if err != nil {
    return err
}

evidence, err := adapter.CollectEvidence(nonce)
if err != nil {
    return err
}
```

### `func CollectEvidence`

```go
func (adapter *tdxAdapter) CollectEvidence(nonce []byte) (*connector.Evidence, error)
```

`CollectEvidence` collects evidence for a quote from the TDX trust domain. It takes a nonce as input, which is hashed when the trust domain report is created. On success, `CollectEvidence` returns an `Evidence` structure. Otherwise, it returns an error.

[Back to top](#api-reference)

### `func Decrypt`

```go
func Decrypt(encryptedData []byte, em *EncryptionMetadata) ([]byte, error)
```

`Decrypt` takes encrypted data as input and decrypts it with the private key specified in `EncryptionMetadata`. On success, the API returns the decrypted data as a byte array. Otherwise, it returns an error.

The following snippet shows how to decrypt an encrypted blob.

```go
em := &tdx.EncryptionMetadata{
	PrivateKeyLocation: privateKeyPath,
	HashAlgorithm:      "SHA256",
}
decryptedData, err := tdx.Decrypt(encryptedData, em)
if err != nil {
    fmt.Printf("Something bad happened: %s\n\n", err)
    return err
}
```

[Back to top](#api-reference)

### `func GenerateKeyPair`

```go
func GenerateKeyPair(km *KeyMetadata) ([]byte, []byte, error)
```

`GenerateKeyPair` generates a private and public key pair based on the specified key metadata.

```go
km := &tdx.KeyMetadata{
	KeyLength: 3072,
}
privateKeyPem, publicKeyPem, err := tdx.GenerateKeyPair(km)
if err != nil {
    fmt.Printf("Something bad happened: %s\n\n", err)
    return err
}
```

[Back to top](#api-reference)

### `func GetEventLogs`

```go
func (parser *fileEventLogParser) GetEventLogs() ([]RtmrEventLog, error)
```

The `GetEventLogs` API returns a trust domain event log in JSON format. The log contains the events measured into all four RTMRs, in order. Replay the event measurements in order to verify the integrity of the RTMRs (runtime measurement registers).

The following code example collects the event log from a TD.

```go
evLogParser := tdx.NewEventLogParser()
eventLog, err := evLogParser.GetEventLogs()
if err != nil {
    return err
}
```

[Back to top](#api-reference)

### `func NewEvidenceAdapter`

```go
func NewEvidenceAdapter(udata []byte, evLogParser EventLogParser) (connector.EvidenceAdapter, error)
```

`NewEvidenceAdapter` initializes a `TdxAdapter`, which manages quote collection from a trust domain (TD). `TdxAdapter` also collects the event log for a TD.

The following code example shows how to create a Go TDX adapter. For an example of collecting evidence with the adapter, see [CollectEvidence](#func-collectevidence).

```go
import "github.com/intel/ta-client-for-go/go-tdx"

evLogParser := tdx.NewEventLogParser()
adapter, err := tdx.NewEvidenceAdapter(tdHeldData, evLogParser)
if err != nil {
    return err
}

```

[Back to top](#api-reference)

### `func NewEventLogParser`

```go
func NewEventLogParser() EventLogParser
```

`NewEventLogParser` initializes an `EventLogParser`, which reads a trust domain's event log from either the ACPI (Advanced Configuration and Power Interface) tables or an EFI (Extensible Firmware Interface) file. The event log for a trust domain is stored in ACPI tables.

For an example, see [GetEventLogs](#func-geteventlogs).

[Back to top](#api-reference)

