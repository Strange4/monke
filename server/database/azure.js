import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from 'dotenv';
dotenv.config();

let blobService;
let blobContainer;

const sasToken = process.env.AZURE_SAS;
const containerName = process.env.containerName;
const storageAccountName = process.env.storageAccountName;
const blobPublicUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/`;

// Prevent calling with new.
blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
);
blobContainer = blobService.getContainerClient(containerName);

// Get the container client
export function getContainerClient() {
    return blobContainer;
}

// Get the public url for the container
export function getBlobPublicUrl() {
    return blobPublicUrl;
}