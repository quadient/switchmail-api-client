import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { SwitchmailApi, Types } from "../src";

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
  switchmailApi.letters.confirmCreate(
    lettersResponse.id,
    { id, trackingId, transaction },
    { headers: { Authorization: tokenResponse.authorization, "X-Invocation-Type": "RequestResponse" } }
  );

  console.log("[COMPLETED]");
}
run();
