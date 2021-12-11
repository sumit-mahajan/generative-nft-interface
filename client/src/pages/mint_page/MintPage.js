import React, { useEffect, useState } from "react";
import { useMint } from "../../providers/mint_provider";
import { Box } from "../../components/Box";
import "./mint_page.scss";
/* global BigInt */
import { uploadMetadata } from '../../services/ipfs_service'
import { useConnection } from "../../providers/connection_provider";

function MintPage() {
    const { connectionState, createCollectionInstance } = useConnection()
    const { web3, accounts } = connectionState
    const { mintState, setMintState } = useMint()

    useEffect(() => {
        const nftsWithMetadata = [];
        let count = 0
        mintState.nfts.forEach(async (nft) => {
            const metadataCID = await uploadMetadata(JSON.stringify(nft.metadata))
            nftsWithMetadata.push({
                ...nft,
                metadataCID
            })
            count++
            if (count === mintState.nfts.length) {
                nftsWithMetadata.sort((a, b) => a.id - b.id)
                setMintState({ ...mintState, nfts: nftsWithMetadata })
            }
        })
    }, [])

    // const validateInput = () => {
    //     let errorField
    //     if (commonData.price < 0) {
    //         errorField = "price"
    //     } else if (commonData.royalty < 0) {
    //         errorField = "royalty"
    //     }
    //     return errorField
    // }

    const handleSubmit = async () => {

        let cContract = await createCollectionInstance(web3, mintState.collection.address);
        // let batch = new web3.BatchRequest();

        mintState.nfts.forEach(async (nft) => {
            console.log(nft.id)
            // batch.add(
            await cContract.methods
                .mintNFT(
                    nft.metadata.name,
                    nft.metadata.image,
                    nft.metadata.properties.toString(),
                    nft.metadataCID,
                    mintState.nftData.forSale,
                    mintState.nftData.isFixedPrice,
                    mintState.nftData.price,
                    mintState.nftData.royalty,
                    "Never gonna give you up, Never gonna let you down"
                )
                .send({ from: accounts[0] })
            // )
        })
        // batch.execute()
    }

    return (<div>
        <button onClick={handleSubmit}>Mint</button>
        {/* <img src={mintState.collection.imageUrl} />
        <p>{mintState.collection.address}</p>
        <p>{mintState.collection.metadata.name}</p>
        {mintState.nfts.map(nft =>
            <div key={nft.id}>
                <img src={nft.image} />
                <p>{nft.metadata.name}</p>
                <p>{nft.metadata.image}</p>
            </div>
        )} */}
    </div>);
}

export default MintPage;