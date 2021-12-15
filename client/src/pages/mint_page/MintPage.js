import React, { useEffect, useState } from "react";
import { useMint } from "../../providers/mint_provider";
import { Box } from "../../components/Box";
import "./mint_page.scss";
/* global BigInt */
import { useConnection } from "../../providers/connection_provider";
import Loading from "../../components/loading/Loading";
import { useNavigate } from 'react-router-dom';

function MintPage() {
    const { connectionState, createCollectionInstance } = useConnection()
    const { web3, accounts } = connectionState
    const { mintState } = useMint()

    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleSubmit = async () => {
        setError("")
        setLoading(true)

        let cContract = await createCollectionInstance(web3, mintState.collection.address);

        let batchFactor = 20
        let listOfLists = []
        let count = 0

        for (let i = 0; i < mintState.nfts.length; i += batchFactor) {
            let names = [], images = [], properties = [], metadatas = [];
            for (let j = i; j < i + batchFactor; j++) {
                names.push(mintState.nfts[j].metadata.name)
                images.push(mintState.nfts[j].metadata.image)
                properties.push(JSON.stringify(mintState.nfts[j].metadata.properties).toString())
                metadatas.push(mintState.nfts[j].metadataCID)
            }
            listOfLists.push({ names, images, properties, metadatas })
            count++
        }

        let rejected = 0;
        listOfLists.forEach(async (listObject, index) => {
            try {
                await cContract.methods
                    .mintBatch(
                        listObject.names,
                        listObject.images,
                        listObject.properties,
                        listObject.metadatas,
                        mintState.nftData.forSale,
                        mintState.nftData.isFixedPrice,
                        mintState.nftData.price,
                        mintState.nftData.royalty,
                        mintState.nfts.length
                    )
                    .send({ from: accounts[0] })

                if (index + 1 === count) {
                    setLoading(false)

                    navigate('/success');
                }
            } catch (err) {
                rejected++;
                if (rejected === count) {
                    setError("Denied Metamask Tx Signature")
                    setLoading(false)
                }
            }
        })

    }

    return (<div className="container">
        {isLoading ? <Loading message={"Minting " + mintState.nfts.length + " NFTs"} /> : <div></div>}
        <Box height="30" />

        <h2>Step 4 / 4</h2>

        <Box height="10" />

        <h1>Mint NFTs</h1>

        <Box height="50" />

        <div className="info-flex">
            <div className="collection-details">
                Collection Details
                <Box height="20" />
                <div className="info-box">
                    <div className="image-box">
                        <img alt={mintState.collection.metadata.name}
                            src={mintState.collection.imageUrl}
                            height={"100%"} width={"100%"} style={{ borderRadius: "10px" }}
                        />
                    </div>
                    <Box width="30" />
                    <div className="describe-box">
                        <p className="sub-text">{mintState.collection.metadata.name}</p>
                        <Box height="15" />
                        <p className="sub-text">{mintState.collection.metadata.description}</p>
                        <Box height="15" />
                        <p className="sub-text">{mintState.collection.address}</p>
                    </div>
                    <Box width="50" />
                </div>
            </div>
            <div className="listing-details">
                Listing Details
                <Box height="20" />
                <p className="sub-text">
                    {mintState.nftData.forSale ? mintState.nftData.isFixedPrice ? "For Sale at Fixed Price" : "For Sale on Bidding" : "Not For Sell"}
                </p>
                <Box height="15" />
                <p className="sub-text">
                    {mintState.nftData.forSale ? mintState.nftData.isFixedPrice ?
                        "Price: " + Number(BigInt(mintState.nftData.price) * 10000n / BigInt(1e18)) / 10000
                        : "Minimum Bidding Price: " + Number(BigInt(mintState.nftData.price) * 10000n / BigInt(1e18)) / 10000 : ""
                    } MATIC
                </p>
                <Box height="15" />
                <p className="sub-text">
                    Royalty: {mintState.nftData.royalty} %
                </p>
            </div>
        </div>

        <Box height="50" />

        Preview of NFTs to be minted

        <Box height="50" />

        <div className="nft-grid">
            {mintState.nfts.sort((a, b) => a.id - b.id).map((nft) =>
                <div key={nft.id} className="nft-card">
                    <img alt={nft.metadata.name} src={nft.image} height="100%" width="100%" />
                    <p className="caption">{nft.metadata.name}</p>
                </div>
            )}
        </div>

        <Box height="50" />

        <div className="center-child">
            <button onClick={handleSubmit}>Mint {mintState.nfts.length} NFTs</button>
            <Box height="10" />
            <p className="error-field">{error}</p>
        </div>

        <Box height="50" />
    </div>);
}

export default MintPage;