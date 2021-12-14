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

        try {
            const names = mintState.nfts.map((nft) => nft.metadata.name)
            const images = mintState.nfts.map((nft) => nft.metadata.image)
            const properties = mintState.nfts.map((nft) => JSON.stringify(nft.metadata.properties).toString())
            const metadatas = mintState.nfts.map((nft) => nft.metadataCID)

            await cContract.methods
                .mintBatch(
                    names,
                    images,
                    properties,
                    metadatas,
                    mintState.nftData.forSale,
                    mintState.nftData.isFixedPrice,
                    mintState.nftData.price,
                    mintState.nftData.royalty,
                    mintState.nfts.length
                )
                .send({ from: accounts[0] })

            setLoading(false)

            navigate('/success');

        } catch (err) {
            setError("Denied Metamask Tx Signature")
            setLoading(false)
        }
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
                        <Box height="20" />
                        <p className="sub-text">{mintState.collection.metadata.description}</p>
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
                    {mintState.nftData.forSale ? mintState.nftData.isFixedPrice ? "Price: " + mintState.nftData.price : "Minimum Bidding Price: " + parseFloat(BigInt(mintState.nftData.price) / BigInt(1e18)) : ""}
                </p>
                <Box height="15" />
                <p className="sub-text">
                    Royalty: {mintState.nftData.royalty} %
                </p>
            </div>
        </div>

        <Box height="40" />

        Preview of NFTs to be minted

        <Box height="40" />

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