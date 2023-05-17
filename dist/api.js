"use strict";
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchmailApi = exports.HttpClient = exports.ContentType = void 0;
const axios_1 = require("axios");
const buffer_1 = require("buffer");
const FormData = require("form-data");
var ContentType;
(function (ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["FormData"] = "multipart/form-data";
    ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
    ContentType["Text"] = "text/plain";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
class HttpClient {
    instance;
    securityData = null;
    securityWorker;
    secure;
    format;
    constructor({ securityWorker, secure, format, ...axiosConfig } = {}) {
        this.instance = axios_1.default.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "https://api.switchmail.com" });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }
    setSecurityData = (data) => {
        this.securityData = data;
    };
    mergeRequestParams(params1, params2) {
        const method = params1.method || (params2 && params2.method);
        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase()]) || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }
    stringifyFormItem(formItem) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        }
        else {
            return `${formItem}`;
        }
    }
    createFormData(input) {
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent = property instanceof Array ? property : [property];
            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof buffer_1.File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }
            return formData;
        }, new FormData());
    }
    request = async ({ secure, path, type, query, format, body, ...params }) => {
        const secureParams = ((typeof secure === "boolean" ? secure : this.secure) &&
            this.securityWorker &&
            (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;
        if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
            body = this.createFormData(body);
        }
        if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
            body = JSON.stringify(body);
        }
        return this.instance
            .request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        })
            .then((response) => response.data);
    };
}
exports.HttpClient = HttpClient;
/**
 * @title Switch APIs Documentation
 * @version 0.5.0
 * @baseUrl https://api.switchmail.com
 *
 * This is the official document of Switch APIs for sending a letter. Applicable for Switch's Developer account only. You need an account for using this API service.
 */
class SwitchmailApi extends HttpClient {
    account = {
        /**
         * No description
         *
         * @tags Account
         * @name FundsCreate
         * @summary You need to save card information at billing page first.
         * @request POST:/account/{developerId}/funds
         */
        fundsCreate: (developerId, body, params = {}) => this.request({
            path: `/account/${developerId}/funds`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Account
         * @name PaymentCreate
         * @summary Dataflow: When the user adds a fund with an amount from the Partner's Application, the request will be directly sent to SwitchAPI which contains Authorization (Token can be created at Create Token) and a number of amounts (in the cent). A transaction will be made by Payment Gateway and then Partner's Application. While doing it, the Client needs to fill in the card information to create a payment method from Payment Gateway. Combining those data, we can start to confirm payment transaction. However, if the type of client's card is 3D or 3DS, we need one more step to confirm the transaction from the customer. One link from Card Issuer will be sent to the Partner's Application that needs to be popped up for user confirmation. After all, the payment transaction will be completed and Partner's Application can take the newest information of account balance from SwitchAPI You can test add fund here.
         * @request POST:/account/{accountId}/payment
         */
        paymentCreate: (accountId, body, params = {}) => this.request({
            path: `/account/${accountId}/payment`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Account
         * @name FundsDetail
         * @summary Get the remaining amount of the account. Provide the account's id then the API will return the remaining amount of this account.
         * @request GET:/account/{id}/funds
         */
        fundsDetail: (id, params = {}) => this.request({
            path: `/account/${id}/funds`,
            method: "GET",
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
    auth = {
        /**
         * No description
         *
         * @tags Authentication
         * @name TokenCreate
         * @summary Create the authorization token for other API. Provide the parameters then the API will return your token. Attention:  Should call it once every 30 seconds. Can use RefreshToken API to make a new token. The refresh token can use for duration 30 days. After that period, another call to CreateToken API is necessary.
         * @request POST:/auth/token
         */
        tokenCreate: (body, params = {}) => this.request({
            path: `/auth/token`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Authentication
         * @name RenewCreate
         * @request POST:/auth/renew
         */
        renewCreate: (body, params = {}) => this.request({
            path: `/auth/renew`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Authentication
         * @name RefreshCreate
         * @summary Refresh the authorization token to make the new one if the old token has expired. Provide the parameters then the API will return new authorization token.
         * @request POST:/auth/refresh
         */
        refreshCreate: (body, params = {}) => this.request({
            path: `/auth/refresh`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
    documents = {
        /**
         * No description
         *
         * @tags Documents
         * @name DocumentsCreate
         * @summary Get the forms signed with switch-api file's storage to upload documents. Provide the parameters then the API will create the forms in switch-mail storage then return information of these documents. SwitchMail implements content deduplication mechanism to protect itself from burst/replay requests. To avoid this, let make another difference one or try in the next few minutes.
         * @request POST:/documents
         */
        documentsCreate: (body, params = {}) => this.request({
            path: `/documents`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Documents
         * @name DocumentsDelete
         * @summary Delete the document if it's no longer in use. Provide the document's id then the API will find your letter in system and delete it.
         * @request DELETE:/documents/{id}
         */
        documentsDelete: (id, params = {}) => this.request({
            path: `/documents/${id}`,
            method: "DELETE",
            type: ContentType.Json,
            ...params,
        }),
        /**
         * No description
         *
         * @tags Documents
         * @name DocumentsDetail
         * @summary Retrieves an URL to download your document. Provide the parameters then the API will return the corresponding document.
         * @request GET:/documents/{id}
         */
        documentsDetail: (id, query, params = {}) => this.request({
            path: `/documents/${id}`,
            method: "GET",
            query: query,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
    letters = {
        /**
         * No description
         *
         * @tags Letters
         * @name ConfirmCreate
         * @summary Confirm and pay the letter which was created before. Provide the parameters then the API will send your letter to the print-service provider, will charge you the letter then return the letter's data. SwitchMail implements content deduplication mechanism to protect itself from burst/replay requests. To avoid this, let make another difference one or try in the next few minutes.
         * @request POST:/letters/{id}/confirm
         */
        confirmCreate: (id, body, params = {}) => this.request({
            path: `/letters/${id}/confirm`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Letters
         * @name LettersCreate
         * @summary Create the letter in switch-mail system. Provide the parameters then the API will create the letter then return it's data. Don't hesitate, You will not be charged util you confirm it. SwitchMail implements content deduplication mechanism to protect itself from burst/replay requests. To avoid this, let make another difference one or try in the next few minutes.
         * @request POST:/letters
         */
        lettersCreate: (body, params = {}) => this.request({
            path: `/letters`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Letters
         * @name PreviewDetail
         * @summary Preview the letter which was created before. Provide the parameters then the API will find your letter in system and return its data.
         * @request GET:/letters/{id}/preview
         */
        previewDetail: (id, params = {}) => this.request({
            path: `/letters/${id}/preview`,
            method: "GET",
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
    reports = {
        /**
         * No description
         *
         * @tags Reports
         * @name StatementList
         * @summary Get the statement of the letter which was created in the time range. Provide the parameters then the API will find your letter in system and return its data. If the nextToken field has value, which means there is still data that can be retrieved.  Please call the next request with the value of the nextToken field.
         * @request GET:/reports/statement
         */
        statementList: (query, params = {}) => this.request({
            path: `/reports/statement`,
            method: "GET",
            query: query,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
    tracking = {
        /**
         * No description
         *
         * @tags Request_Trackings
         * @name TrackingList
         * @summary Get all tracking of the letters which was created before. Provide the parameters then the API will find your request in system and return its data.
         * @request GET:/tracking
         */
        trackingList: (timestamp, query, params = {}) => this.request({
            path: `/tracking`,
            method: "GET",
            query: query,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
    user = {
        /**
         * No description
         *
         * @tags Reseller
         * @name ConnectUpdate
         * @summary This API will help to engage user to partner group for existing user who has invited by partner admin by calling 2 - ConnectUser. And the parameter acceptableToken returned from it will be the input of the request
         * @request PUT:/user/connect
         */
        connectUpdate: (body, params = {}) => this.request({
            path: `/user/connect`,
            method: "PUT",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Reseller
         * @name ConnectCreate
         * @summary We have two kinds of users, the first one is an admin who controls a group and the second one is client. When the admin wants to add a client to their group, he will send a pending request to the client's account. The approval will be executed when the client confirms the pending request. After that, the client's account will be immediately added to a partner's group
         * @request POST:/user/connect
         */
        connectCreate: (body, params = {}) => this.request({
            path: `/user/connect`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Reseller
         * @name CreateCreate
         * @summary Create a partner's user in switch-mail system. Provide the parameters then the API will create the user then return user's api key.
         * @request POST:/user/create
         */
        createCreate: (body, params = {}) => this.request({
            path: `/user/create`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
    reseller = {
        /**
         * No description
         *
         * @tags Reseller
         * @name ReportsStatementCreate
         * @summary This method will export all statement information of all users in the admin group. Retrieve all activities and billing summary of all users of the partner’s account, export CSV or Excel file, and return the download link. Endpoint will have X-Invocation-Type at headers is Event (unchangeable) so the response will have requestId. You can find the real response by using this field as an input for GetUpdatedRequest.
         * @request POST:/reseller/reports/statement
         */
        reportsStatementCreate: (body, params = {}) => this.request({
            path: `/reseller/reports/statement`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Reseller
         * @name ReportsUsersList
         * @summary Get all users of the partner’s account. This method can only be called with a partner admin permission level. The response can include a field named “nextToken”. This token can be used to call again this method to get the next page of data (if current response doesn’t fit on only one page).
         * @request GET:/reseller/reports/users
         */
        reportsUsersList: (query, params = {}) => this.request({
            path: `/reseller/reports/users`,
            method: "GET",
            query: query,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Reseller
         * @name RatesList
         * @summary Get the margin rate of the group admin. Provide the payload then the API will return admin margin.
         * @request GET:/reseller/rates
         */
        ratesList: (query, params = {}) => this.request({
            path: `/reseller/rates`,
            method: "GET",
            query: query,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Reseller
         * @name RatesDelete
         * @summary This endpoint will delete the rateCode that you already saved before
         * @request DELETE:/reseller/rates
         */
        ratesDelete: (rateCode, params = {}) => this.request({
            path: `/reseller/rates`,
            method: "DELETE",
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Reseller
         * @name RatesCreate
         * @summary This endpoint will save the new rate called Margin Rate into database then return success after completed.
         * @request POST:/reseller/rates
         */
        ratesCreate: (body, params = {}) => this.request({
            path: `/reseller/rates`,
            method: "POST",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Reseller
         * @name ReportsStatementDetail
         * @summary Get one specific user of the partner’s account. This method can only be called with a partner admin permission level.
         * @request GET:/reseller/reports/statement/{id}
         */
        reportsStatementDetail: (id, query, params = {}) => this.request({
            path: `/reseller/reports/statement/${id}`,
            method: "GET",
            query: query,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Reseller
         * @name ReportsUsersDetail
         * @summary Get one specific user of the partner’s account. This method can only be called with a partner admin permission level.
         * @request GET:/reseller/reports/users/{id}
         */
        reportsUsersDetail: (id, params = {}) => this.request({
            path: `/reseller/reports/users/${id}`,
            method: "GET",
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
    trackings = {
        /**
         * No description
         *
         * @tags Trackings
         * @name TrackingsList
         * @summary Get the status of the letter which was created in the time range. Provide the parameters then the API will find your letter in system and return its data.
         * @request GET:/trackings
         */
        trackingsList: (query, params = {}) => this.request({
            path: `/trackings`,
            method: "GET",
            query: query,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags Trackings
         * @name TrackingsDetail
         * @summary Get the tracking of the letter which was created before. Provide the parameters then the API will find your letter in system and return its data.
         * @request GET:/trackings/{id}
         */
        trackingsDetail: (id, query, params = {}) => this.request({
            path: `/trackings/${id}`,
            method: "GET",
            query: query,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
    webhook = {
        /**
         * No description
         *
         * @tags WebHook
         * @name SubscribeUpdate
         * @request PUT:/webhook/subscribe
         */
        subscribeUpdate: (body, params = {}) => this.request({
            path: `/webhook/subscribe`,
            method: "PUT",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
        /**
         * No description
         *
         * @tags WebHook
         * @name UnsubscribeUpdate
         * @request PUT:/webhook/unsubscribe
         */
        unsubscribeUpdate: (body, params = {}) => this.request({
            path: `/webhook/unsubscribe`,
            method: "PUT",
            body: body,
            type: ContentType.Json,
            format: "json",
            ...params,
        }),
    };
}
exports.SwitchmailApi = SwitchmailApi;
