import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box } from "../../components/Box";
import "./collection_page.scss";
import { useMint } from '../../providers/mint_provider'
import { uploadImage, uploadMetadata } from '../../services/ipfs_service';
import { useConnection } from "../../providers/connection_provider";
import Loading from "../../components/loading/Loading";
/* global BigInt */

function CollectionPage() {
    const navigate = useNavigate()

    const { connectionState } = useConnection()
    const { web3, accounts, mContract, errors } = connectionState;

    const { mintState, setMintState } = useMint()
    const [isLoading, setLoading] = useState(false)

    const [metadata, setMetadata] = useState({
        name: "",
        symbol: "",
        image: "",
        description: "",
        twitterUrl: "",
        websiteUrl: "",
    })

    const [nftData, setNftData] = useState({
        forSale: true,
        isFixedPrice: false,
        price: -1,
        royalty: -1
    })

    const [cImage, setCImage] = useState("")
    const [activeReqs, setActiveReqs] = useState(0)

    const triggerInput = async () => {
        document.getElementById('imgpick').click();
    }

    const handleImage = async (e) => {
        setActiveReqs(activeReqs + 1)
        const blob = e.target.files[0]

        var fr = new FileReader()
        fr.readAsDataURL(blob)
        fr.onload = () => {
            setCImage(fr.result)
        }

        const imageCID = await uploadImage(blob)

        setMetadata({ ...metadata, image: imageCID })
        setActiveReqs(activeReqs - 1)
    }

    const validateInput = () => {
        let errorField
        if (metadata.name === "") {
            errorField = "name"
        } else if (metadata.symbol === "") {
            errorField = "symbol"
        } else if (metadata.image === "") {
            errorField = "image"
        } else if (metadata.description === "") {
            errorField = "description"
        } else if (metadata.twitterUrl === "") {
            errorField = "twitterUrl"
        } else if (metadata.websiteUrl === "") {
            errorField = "websiteUrl"
        }
        return errorField
    }

    const waitTillReqsDone = () => {
        if (activeReqs > 0) {
            setTimeout(waitTillReqsDone, 100)
        }
        return;
    }

    const handleSubmit = async () => {
        waitTillReqsDone()

        // TODO: Validate metadata and nftdata

        setLoading(true)

        try {
            const metadataCID = await uploadMetadata(JSON.stringify(metadata))
            const transaction = await mContract.methods
                .createCollection(metadata.name, metadata.symbol, metadata.image, metadataCID)
                .send({ from: accounts[0] });

            const event = transaction.events.CollectionCreated.returnValues;

            setMintState({
                ...mintState,
                collection: { address: event.cAddress, imageUrl: cImage, metadata: metadata, metadataCID },
                nftData
            })

            setLoading(false)
        } catch (err) {
            // TODO: Handle Metamask denied signature
            setLoading(false)
        }

        navigate('/mint')
    }

    if (!web3 || accounts.length === 0 || errors) {
        return errors;
    }

    return (<div className="container">
        {isLoading ? <Loading /> : <div></div>}

        <Box height="30" />

        <h2>Step 3 / 4</h2>

        <Box height="10" />

        <h1>Create Collection</h1>

        <Box height="50" />

        <div className="image-picker center-child" onClick={triggerInput}>
            {cImage !== "" ?
                <img alt="Broken" src={cImage} height="100%" width="100%" style={{ borderRadius: "10px" }} />
                : <span>Choose Thumbnail</span>}
        </div>
        <input id="imgpick" onChange={handleImage} type="file" style={{ visibility: "hidden", height: "30px" }} />

        {/* <Box height="30" /> */}

        <div className="row-flex">
            <div className="textfield">
                <label>Name *</label>
                <input
                    onChange={(e) => { setMetadata({ ...metadata, name: e.target.value }) }}
                    type="text" placeholder='Enter name for your collection e.g. Cryptopunks' />
            </div>

            <Box width="40" />

            <div className="textfield">
                <label>Symbol *</label>
                <input
                    onChange={(e) => { setMetadata({ ...metadata, symbol: e.target.value }) }}
                    type="text" placeholder='Enter symbol for your collection' />
            </div>
        </div>

        <Box height="30" />

        <div className="textfield">
            <label>Description *</label>
            <input
                onChange={(e) => { setMetadata({ ...metadata, description: e.target.value }) }}
                type="text" placeholder='Describe your collection, its utilty (if any)' />
        </div>

        <Box height="30" />

        <div className="row-flex">
            <div className="textfield">
                <label>Twitter Url *</label>
                <input
                    onChange={(e) => { setMetadata({ ...metadata, twitterUrl: e.target.value }) }}
                    type="text" placeholder='Enter twitter profile Url' />
            </div>

            <Box width="40" />

            <div className="textfield">
                <label>Website Url *</label>
                <input
                    onChange={(e) => { setMetadata({ ...metadata, websiteUrl: e.target.value }) }}
                    type="text" placeholder='Enter website Url' />
            </div>
        </div>

        <Box height="50" />

        Listing Details for all your NFTs

        <Box height="40" />

        <div className="row-flex">
            <div className="flex-child">
                <input type="checkbox" id="forsale"
                    onChange={(e) => {
                        setNftData({ ...nftData, forSale: e.target.checked })
                    }}
                    checked={nftData.forSale}
                />
                <Box width="20" />
                <label for="forsale">List For Sale</label>
            </div>

            <Box width="40" />

            {nftData.forSale ?
                <div className="selltype">
                    <div className="flex-child">
                        <input type="radio" id="fixedprice" name="selltype" value="Fixed Price"
                            onChange={(e) => {
                                setNftData({ ...nftData, isFixedPrice: e.target.checked })
                            }}
                            checked={nftData.isFixedPrice}
                        />
                        <Box width="20" />
                        <label for="fixedprice">Fixed Price </label>
                    </div>

                    <div className="flex-child">
                        <input type="radio" id="bidding" name="selltype" value="Bidding" checked
                            onChange={(e) => {
                                setNftData({ ...nftData, isFixedPrice: !e.target.checked })
                            }}
                            checked={!nftData.isFixedPrice}
                        />
                        <Box width="20" />
                        <label for="bidding">Bidding</label>
                    </div>
                </div> : <div className="flex-child"></div>
            }
        </div>

        <Box height="30" />

        <div className="row-flex">
            <div className="textfield">
                <label>Royalty *</label>
                <input
                    type="number" placeholder="The % amount you recieve for each future trade of these NFTs"
                    onChange={(e) => {
                        let royalty = e.target.value === "" ? -1 : parseInt(e.target.value)
                        setNftData({ ...nftData, royalty })
                    }} />
            </div>

            <Box width="40" />

            {nftData.forSale ?
                <div className="textfield">
                    <label>{nftData.isFixedPrice ? "Price *" : "Minimum Bid Price *"}</label>
                    <input
                        type="number" placeholder={nftData.isFixedPrice ? "Price in MATIC" : "Minimum Bid Price in MATIC"}
                        onChange={(e) => {
                            if (e.target.value !== "") {
                                setNftData({ ...nftData, price: BigInt(parseFloat(e.target.value) * 1e4) * BigInt(1e14) })
                            } else {
                                setNftData({ ...nftData, price: -1 })
                            }
                        }}
                    />
                </div>
                : <div className="flex-child"></div>
            }
        </div>

        <Box height="50" />

        <div className="center-child">
            <button onClick={handleSubmit}>Create Collection</button>
        </div>

        <Box height="50" />
    </div>);
}

export default CollectionPage;