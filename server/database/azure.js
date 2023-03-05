import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from 'dotenv';
dotenv.config();

let blobService;
let blobContainer;

const sasToken = process.env.AZURE_SAS;
const containerName = process.env.containerName;
const storageAccountName = process.env.storageAccountName;
const blobPublicUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/`;


export class Azure {

    static instance;

    // Prevent calling with new.
    constructor() {
        blobService = new BlobServiceClient(
            `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
        );
        blobContainer = blobService.getContainerClient(containerName);
    }

    // Singleton
    static getAzureInstance() {
        if (!Azure.instance) {
            Azure.instance = new Azure();
        }
        return Azure.instance;
    }


    // Get the container client
    getContainerClient() {
        return blobContainer;
    }

    // Get the public url for the container
    getBlobPublicUrl() {
        return blobPublicUrl;
    }
}
