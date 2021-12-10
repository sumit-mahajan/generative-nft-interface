import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box } from "../../components/Box";
import "./collection_page.scss";
import { useMint } from '../../providers/mint_provider'
import { uploadImage, uploadMetadata } from '../../services/ipfs_service';
import { useConnection } from "../../providers/connection_provider";

function CollectionPage() {
    const navigate = useNavigate()

    const { connectionState } = useConnection()
    const { web3, accounts, mContract, errors } = connectionState;

    const { mintState, setMintState } = useMint()

    const [metadata, setMetadata] = useState({
        name: "",
        symbol: "",
        image: "",
        description: "",
        twitterUrl: "",
        websiteUrl: "",
    })
    const [cImage, setCImage] = useState()
    const [activeReqs, setActiveReqs] = useState(0)

    const handleImage = async (e) => {
        setActiveReqs(activeReqs + 1)
        const blob = e.target.files[0]
        setCImage(blob)

        const imageCID = await uploadImage(blob)
        setMetadata({ ...metadata, image: imageCID })
        setActiveReqs(activeReqs - 1)
    }

    const waitTillReqsDone = () => {
        if (activeReqs > 0) {
            setTimeout(waitTillReqsDone, 100)
        }
        return;
    }

    const handleSubmit = async () => {
        waitTillReqsDone()

        const metadataCID = await uploadMetadata(JSON.stringify(metadata))

        const transaction = await mContract.methods
            .createCollection(metadata.name, metadata.symbol, metadata.image, metadataCID)
            .send({ from: accounts[0] });

        const event = transaction.events.CollectionCreated.returnValues;

        setMintState({ ...mintState, collection: { address: event.cAddress, imageBlob: cImage, metadata: metadata, metadataCID } })

        navigate('/mint')
    }

    if (!web3 || accounts.length === 0 || errors) {
        return errors;
    }

    return (<div>
        <Box height="20" />
        <input type="file" onChange={(e) => { handleImage(e) }} required />
        <Box height="20" />
        <input type="text" onChange={(e) => { setMetadata({ ...metadata, name: e.target.value }) }} placeholder="name" required />
        <Box height="20" />
        <input type="text" onChange={(e) => { setMetadata({ ...metadata, symbol: e.target.value }) }} placeholder="symbol" required />
        <Box height="20" />
        <input type="text" onChange={(e) => { setMetadata({ ...metadata, description: e.target.value }) }} placeholder="description" required />
        <Box height="20" />
        <input type="text" onChange={(e) => { setMetadata({ ...metadata, twitterUrl: e.target.value }) }} placeholder="twitterUrl" required />
        <Box height="20" />
        <input type="text" onChange={(e) => { setMetadata({ ...metadata, websiteUrl: e.target.value }) }} placeholder="websiteUrl" required />
        <Box height="20" />
        <button onClick={handleSubmit}>Submit</button>
    </div>);
}

export default CollectionPage;