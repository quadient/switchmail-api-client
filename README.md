# Node.js API Client for Switchmail.com
 
This is a Node.js TypeScript package that provides an API client for [Switchmail.com](https://switchmail.com). It enables you to send and track physical mails / letters through the Switchmail.com platform.

## Installation

To install this package, you can use npm:

```bash
npm install @quadient/switchmail-api-client
```

## Usage

To use this API client, you need to have a Switchmail.com account and API key. You can sign up for an account at [https://switchmail.com/](https://switchmail.com/).

Below is a TypeScript example of how to use this package (e.g. via `npx ts-node example-code.ts`):

```typescript
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { SwitchmailApi, Types } from '@quadient/switchmail-api-client';

const email = "YOUR_EMAIL";
const apiMasterKey = "YOUR_API_MASTER_KEY";
const baseURL = "https://api-test.switchmail.com"; // test environment / sandbox
// const baseURL = "https://api.switchmail.com"; // production
const documentFile = path.join(__dirname, "YOUR_FILE.pdf");

async function run() {
  const switchmailApi = new SwitchmailApi({ baseURL });

  console.log("- getting authorization token via API master key");
  const tokenResponse = await switchmailApi.auth.tokenCreate({ email }, { headers: { "x-api-key": apiMasterKey } });

  console.log("- creating document entry in AWS bucket");
  const uniqueDocumentName = `document-${new Date().getTime()}.pdf`;
  const documentsResponse = await switchmailApi.documents.documentsCreate(
    { documents: [{ fileName: uniqueDocumentName, fileType: "application/pdf" }] },
    { headers: { Authorization: tokenResponse.authorization } }
  );
  const documentEntry = (documentsResponse.documents as any as Types.DocumentForm[])[0];

  console.log("- uploading document content from file");
  await axios.postForm(documentEntry.form.url, {
    ...documentEntry.form.fields,
    file: fs.readFileSync(documentFile),
  });

  console.log("- creating letter(s) batch");
  const lettersResponse = await switchmailApi.letters.lettersCreate(
    {
      email,
      printing: { printColor: false, duplex: true, envelopSize: "Autoselect" } satisfies Types.PrintingOption,
      delivery: { emailService: "FIRSTCLASS", eReceipt: email } satisfies Types.DeliveryOption,
      sender: {
        firstName: "John",
        lastName: "DC",
        postalAddress: { address1: "RM-2244", city: "West Lake Hills", state: "TX", postcode: "78746" },
      } satisfies Types.Sender,
      recipients: [
        {
          documents: [{ documentId: documentEntry.documentId }],
          firstName: "Roger",
          lastName: "Fox",
          postalAddress: { address1: "47 Northside Ave", city: "Albany", postcode: "12084", state: "NY" },
        },
      ] satisfies Types.Recipient[],
    },
    { headers: { Authorization: tokenResponse.authorization, "X-Invocation-Type": "RequestResponse" } }
  );

  console.log("- confirming letter(s) batch sending");
  const { id, trackingId, transaction } = lettersResponse;
  await switchmailApi.letters.confirmCreate(
    lettersResponse.id,
    { id, trackingId, transaction },
    { headers: { Authorization: tokenResponse.authorization, "X-Invocation-Type": "RequestResponse" } }
  );

  console.log("[COMPLETED]");
}
run();
```

Pure JavaScript / Node.js execution can be performed by removing the types and modifying the imports in following manner.
```javascript
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const SwitchmailApi = require("@quadient/switchmail-api-client").SwitchmailApi;

// ... rest of the example code
```

## API

This package provides the API methods which are described in more details on the following pages:

- https://apidocs.switchmail.com/ (general overview and concepts)
- https://developer.switchmail.com/apidoc/index.html (API reference)
- https://developer.switchmail.com/apidoc/swagger.json (Swagger/OpenAPI specification)

## Customizations

This client is mainly generated using the https://github.com/acacode/swagger-typescript-api, called via:

```bash
npm run generateApi
```

Feel free to customize and/or generate your own API client.

## License  
Licensed under the [MIT License](https://github.com/quadient/switchmail-api-client/blob/master/LICENSE).