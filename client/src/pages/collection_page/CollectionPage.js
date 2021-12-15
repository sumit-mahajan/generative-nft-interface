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
    const { accounts, mContract } = connectionState;

    const { mintState, setMintState } = useMint()

    const [metadata, setMetadata] = useState({
        name: "",
        symbol: "",
        description: "",
        twitterUrl: "",
        websiteUrl: "",
    })

    const [nftData, setNftData] = useState({
        forSale: true,
        isFixedPrice: false,
        price: 0,
        royalty: 0
    })

    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [cImage, setCImage] = useState("")
    const [imageCID, setImageCID] = useState("")
    const [activeReqs, setActiveReqs] = useState(0)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const triggerInput = async () => {
        document.getElementById('imgpick').click();
    }

    const handleImage = async (e) => {
        setImageCID("")
        if (error === "Please fill the rest of the form and then try uploading image") {
            setError("")
        }

        const blob = e.target.files[0]
        var fr = new FileReader()
        fr.readAsDataURL(blob)
        fr.onload = () => {
            setCImage(fr.result)
        }

        let _imageCID;
        try {
            _imageCID = await uploadImage(blob)
            console.log("Uploaded")

            setImageCID(_imageCID)
        } catch (err) {

            setImageCID("")
            setCImage("")
            setError("Please wait for some time and then try uploading image")
            document.getElementById('imgpick').value = null;
            return;
        }
    }

    const handleSubmit = async () => {
        setError("")
        setLoading(true)

        if (imageCID === "") {
            setError("Image is not uploaded yet")
            setLoading(false)
            return;
        }
        metadata.image = imageCID

        console.log(metadata)

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
            navigate('/mint')

        } catch (err) {
            console.log(err)
            setError("Denied Metamask Tx Signature")
            setLoading(false)
        }
    }

    return (<div className="container">
        {isLoading ? <Loading message="Creating collection" /> : <div></div>}

        <Box height="30" />

        <h2>Step 3 / 4</h2>

        <Box height="10" />

        <h1>Create Collection</h1>

        <Box height="50" />

        <form onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
        }}>

            <div className="image-picker center-child" onClick={triggerInput}>
                {cImage !== "" ?
                    <img alt="Broken" src={cImage} height="100%" width="100%" style={{ borderRadius: "10px" }} />
                    : <span>Choose Thumbnail *</span>}
            </div>
            <input id="imgpick" onChange={handleImage} type="file" style={{ visibility: "hidden", height: "30px" }} required />

            {/* <Box height="30" /> */}

            <div className="row-flex">
                <div className="textfield">
                    <label>Name *</label>
                    <input value={metadata.name}
                        onChange={(e) => { setMetadata({ ...metadata, name: e.target.value }) }}
                        type="text" placeholder='Enter name for your collection e.g. Cryptopunks'
                        required />
                </div>

                <Box width="40" />

                <div className="textfield">
                    <label>Symbol *</label>
                    <input value={metadata.symbol}
                        onChange={(e) => { setMetadata({ ...metadata, symbol: e.target.value }) }}
                        type="text" placeholder='Enter symbol for your collection'
                        required />
                </div>
            </div>

            <Box height="30" />

            <div className="textfield">
                <label>Description *</label>
                <input value={metadata.description}
                    onChange={(e) => { setMetadata({ ...metadata, description: e.target.value }) }}
                    type="text" placeholder='Describe your collection, its utilty (if any)'
                    required />
            </div>

            <Box height="30" />

            <div className="row-flex">
                <div className="textfield">
                    <label>Twitter Url</label>
                    <input value={metadata.twitterUrl}
                        onChange={(e) => { setMetadata({ ...metadata, twitterUrl: e.target.value }) }}
                        type="text" placeholder='Enter twitter profile Url'
                    />
                </div>

                <Box width="40" />

                <div className="textfield">
                    <label>Website Url</label>
                    <input value={metadata.websiteUrl}
                        onChange={(e) => { setMetadata({ ...metadata, websiteUrl: e.target.value }) }}
                        type="text" placeholder='Enter website Url'
                    />
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
                    <label>List For Sale</label>
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
                            <label>Fixed Price </label>
                        </div>

                        <div className="flex-child">
                            <input type="radio" id="bidding" name="selltype" value="Bidding"
                                onChange={(e) => {
                                    setNftData({ ...nftData, isFixedPrice: !e.target.checked })
                                }}
                                checked={!nftData.isFixedPrice}
                            />
                            <Box width="20" />
                            <label>Bidding</label>
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
                            setNftData({ ...nftData, royalty: e.target.value })
                        }}
                        max={99}
                        min={0}
                        required />
                </div>

                <Box width="40" />

                {nftData.forSale ?
                    <div className="textfield">
                        <label>{nftData.isFixedPrice ? "Price *" : "Minimum Bid Price *"}</label>
                        <input
                            type="number" placeholder={nftData.isFixedPrice ? "Price in MATIC" : "Minimum Bid Price in MATIC"}
                            onChange={(e) => {
                                if (!e.target.value) {
                                    return;
                                }
                                setNftData({ ...nftData, price: BigInt(parseFloat(e.target.value) * 1e4) * BigInt(1e14) })
                            }}
                            max={1e5}
                            min={0}
                            step={"any"}
                            required
                        />
                    </div>
                    : <div className="flex-child"></div>
                }
            </div>

            <Box height="50" />

            <div className="center-child">
                <button type="submit" >Create Collection</button>
                <Box height="10" />
                <p className="error-field">{error}</p>
            </div>

        </form>

        <Box height="50" />
    </div>);
}

export default CollectionPage;