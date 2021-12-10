import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api.nft.storage/upload',
    headers: {
        'Authorization': 'Bearer ' + process.env.REACT_APP_API_KEY,
        'Content-Type': 'image/*',
        'Access-Control-Allow-Origin': '*'
    }
});

export default async function upload(blob) {
    const response = await instance.post("/", blob)

    return response.data.value.cid;
}