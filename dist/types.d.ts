export declare namespace Types {
    interface DocumentForm {
        /** The document ID attached to this form upload. */
        documentId: string;
        /** The requested document origin file name send by customers. */
        fileName: string;
        /** The requested document file type (always is the `application/pdf` file type). */
        fileType: string;
        /** The document form upload fields. */
        form: Formupload;
    }
    interface Formupload {
        /** The POST form url to upload into our file server. */
        url: string;
        /** The parsed form fields (security fields include). */
        fields: {
            [key: string]: string;
        };
    }
    interface Sender {
        firstName: string /** The first name of a person or an ogranization. */;
        lastName: string /** The last name or family name of a person or an ogranization. */;
        companyName?: string /** The company name of an ogranization. */;
        postalAddress: PostalAddress /** PostalAddress The postal address object. */;
    }
    interface Recipient {
        /** The document IDs of pieces attached to this letter. */
        documents?: {
            documentId: string;
        }[];
        /** The first name of a person or the name of an ogranization who receive this letter. */
        firstName: string;
        /** The last name or family name of a person or the department of an ogranization who receive this letter. */
        lastName: string;
        /** The complement name of the department or an ogranization who receive this letter. */
        complementName?: string;
        /** The postal address of a person who receive this letter. */
        postalAddress: PostalAddress;
        /** The custom printing option object. This parameter is overridable in each recipient. */
        printing?: PrintingOption;
        /** The custom delivery option object. This parameter is overridable in each recipient. */
        delivery?: DeliveryOption;
    }
    interface PostalAddress {
        /** The first line of a postal address (aka street address). */
        address1: string;
        /**  The second line of a postal address (aka building, floor etc.,). */
        address2?: string;
        /** The state of the address above. */
        state: string;
        /** The city of the address above. */
        city: string;
        /** The postcode of this postal address. */
        postcode: string;
        /**  The country of this postal address. Currently support only in US.  */
        country?: string;
    }
    interface PrintingOption {
        /** The printing color option (with color if `true`). Default is `false`. */
        printColor: boolean;
        /** The printing request for one side or two side paper. Default is `true`. */
        duplex: boolean;
        /** The envelope size in standard format (`Autoselect` (default) | Small | Medium | Large | Flat | MediumFlat ) */
        envelopSize: string;
    }
    interface DeliveryOption {
        /** The mail class to be sent, is one of (`FIRSTCLASS` | `CERTIFIED`). */
        emailService: string;
        /** The email address of a sender or notifier who want to receive the proof of delivery. */
        eReceipt?: string;
    }
}
