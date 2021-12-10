import axios from "axios";

const imageInstance = axios.create({
    baseURL: 'https://api.nft.storage/upload',
    headers: {
        'Authorization': 'Bearer ' + process.env.REACT_APP_API_KEY,
        'Content-Type': 'image/*',
        'Access-Control-Allow-Origin': '*'
    }
});

const metadataInstance = axios.create({
    baseURL: 'https://api.nft.storage/upload',
    headers: {
        'Authorization': 'Bearer ' + process.env.REACT_APP_API_KEY,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

async function uploadImage(blob) {
    const response = await imageInstance.post("/", blob)
    return response.data.value.cid;
}

async function uploadMetadata(metadata) {
    const response = await metadataInstance.post("/", metadata)
    return response.data.value.cid;
}

export { uploadImage, uploadMetadata }